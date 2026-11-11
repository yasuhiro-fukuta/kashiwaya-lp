// Staff-mode only: the "what to charge at check-in" answer, computed in code.
//
// 2026-11-11 incident: the bot was asked to decide paid/unpaid itself from
// prompt rules, and gave two different answers for the same room on the same
// day (12:19 vs 15:10). The board's meal field reads
//   "Wagyu Sukiyaki(2人前) / (paid) Ochazuke Breakfast(2人前)"
// — the "(paid)" marker sits in FRONT of the item it belongs to, and the model
// attached it to the preceding Sukiyaki. Staff also had to add up the prices
// themselves and got them wrong (¥12,500 instead of ¥11,500).
//
// So: paid status and the amount to collect are decided HERE, one line per
// night+room, and the model only copies the line. Sources:
//   - what is served   = 柏屋注文確認票 (orders.ts) — the caterer's final record
//   - paid or not      = CleaningBoard meal field "(paid) …" (schedule API)
//   - selling price    = 「メニュー」sheet (menu.ts) — never the caterer's cost
// When something can't be decided (no board row, no price), it says so and
// falls to "未払い" (collect) — never silently "paid".

import { fetchOrders, type OrderLine } from "./orders";
import { fetchScheduleData, type BoardRow } from "./schedule";
import { fetchMenu } from "./menu";

type Kind = "dinner" | "breakfast";

type MenuItem = { name: string; category: string; persons: string; price: number; note: string };

const BREAKFAST_RE = /朝食|breakfast|ochazuke|お茶漬/i;
const DINNER_RE = /鶏鍋|豚しゃぶ|冷しゃぶ|牛すき|すき焼|ビーガン|ヴィーガン|bbq|chicken|pork|shabu|sukiyaki|wagyu|vegan|hot pot|chilled/i;

export function kindOf(text: string): Kind | null {
  if (BREAKFAST_RE.test(text)) return "breakfast";
  if (DINNER_RE.test(text)) return "dinner";
  return null; // not food (手荷物集配 etc.)
}

// Order-sheet dish → which「メニュー」row it is. null = no selling price on file.
function dinnerMenuKey(item: string): RegExp | null {
  const vegan = /ビーガン|ヴィーガン|vegan/i.test(item);
  const chilled = /冷しゃぶ|chilled|rei/i.test(item);
  if (vegan) return chilled ? /vegan.*chilled/i : /vegan.*hot pot/i;
  if (/鶏鍋|chicken/i.test(item)) return /chicken hot pot/i;
  if (chilled) return /^(?!.*vegan).*chilled/i;
  if (/豚しゃぶ|shabu|pork/i.test(item)) return /^(?!.*vegan).*pork hot pot/i;
  if (/牛すき|すき焼|sukiyaki|wagyu/i.test(item)) return /sukiyaki/i;
  return null;
}

function priceOf(menu: MenuItem[] | null, kind: Kind, item: string, persons: number): number | null {
  if (!menu) return null;
  if (kind === "breakfast") {
    const b = menu.find((m) => m.category === "朝食" && Number(m.persons) === 1);
    return b ? b.price * persons : null;
  }
  const key = dinnerMenuKey(item);
  if (!key) return null;
  const hit = menu.find((m) => m.category === "夕食" && Number(m.persons) === persons && key.test(m.name));
  return hit ? hit.price : null;
}

/** Which kinds are marked "(paid)" in a CleaningBoard meal field. */
export function paidKinds(meal: string): Set<Kind> {
  const paid = new Set<Kind>();
  for (const seg of meal.split(/\s*[\/,、]\s*/)) {
    if (!/\(paid\)/i.test(seg)) continue;
    const k = kindOf(seg.replace(/\(paid\)/gi, ""));
    if (k) paid.add(k);
  }
  return paid;
}

function yen(n: number): string {
  return "¥" + n.toLocaleString("en-US");
}

function jstToday(): string {
  return new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10);
}

function addDays(ymd: string, d: number): string {
  const t = new Date(ymd + "T00:00:00Z");
  t.setUTCDate(t.getUTCDate() + d);
  return t.toISOString().slice(0, 10);
}

export type BillLine = { date: string; weekday: string; room: string; text: string };

// English dish names for the line staff show the guest (staff speak little English).
function enName(kind: Kind, item: string, persons: number): string {
  const n = Number.isFinite(persons) ? persons : "?";
  if (kind === "breakfast") return `Breakfast for ${n}`;
  const dish = /牛すき|すき焼|sukiyaki|wagyu/i.test(item)
    ? "Wagyu Sukiyaki"
    : /鶏鍋|chicken/i.test(item)
      ? "Chicken Hot Pot"
      : /冷しゃぶ|chilled/i.test(item)
        ? "Chilled Pork Shabu-shabu"
        : /豚しゃぶ|shabu|pork/i.test(item)
          ? "Pork Shabu-shabu"
          : /ビーガン|ヴィーガン|vegan/i.test(item)
            ? "Vegan Hot Pot"
            : "Dinner";
  return `${dish} for ${n}`;
}

// One "会計カード" per night+room. The amount to collect comes FIRST and in
// plain words, because on 2026-11-11 staff read a line full of
// 【支払い済み】【未払い】 brackets as "everything is paid" and collected
// nothing (¥10,000 lost). Never write "支払い済み" at room level unless the
// amount to collect really is zero.
export function computeBill(lines: OrderLine[], board: BoardRow[], menu: MenuItem[] | null): BillLine[] {
  const groups = new Map<string, OrderLine[]>();
  for (const l of lines) {
    if (!kindOf(l.item)) continue;
    const k = `${l.date}|${l.room}`;
    groups.set(k, [...(groups.get(k) ?? []), l]);
  }

  const out: BillLine[] = [];
  for (const [k, items] of groups) {
    const [date, room] = k.split("|");
    const row = board.find((r) => r.date === date && r.room === room);
    const paid = row ? paidKinds(row.meal ?? "") : new Set<Kind>();
    let total = 0;
    let unknown = false;
    const collect: string[] = [];
    const already: string[] = [];
    const enCollect: string[] = [];
    const enPaid: string[] = [];
    for (const l of items) {
      const kind = kindOf(l.item)!;
      const qty = Number(l.qty);
      const persons = Number.isFinite(qty) ? Math.round(qty * (kind === "dinner" ? 2 : 1) * 10) / 10 : NaN;
      const what = `${l.item} ${Number.isFinite(persons) ? persons : "?"}名分`;
      if (paid.has(kind)) {
        already.push(`  ・${what} → もらわない（前払い済み）`);
        enPaid.push(enName(kind, l.item, persons));
        continue;
      }
      const price = Number.isFinite(persons) ? priceOf(menu, kind, l.item, persons) : null;
      if (price == null) {
        unknown = true;
        collect.push(`  ・${what} → 金額は社長に電話で確認してからもらう`);
      } else {
        total += price;
        collect.push(`  ・${what} → ${yen(price)} もらう`);
      }
      enCollect.push(enName(kind, l.item, persons) + (price == null ? "" : `: ${yen(price)}`));
    }
    const name = items.find((l) => l.name)?.name ?? row?.guestName ?? "";
    const head = `■${date}(${items[0].weekday}) ${room}${name ? ` ${name}様` : ""}`;
    let lead: string;
    if (collect.length === 0) lead = "◎チェックイン時にもらうお金：なし（食事は全部前払い済み）";
    else if (unknown) lead = `★チェックイン時にお金をもらう：金額が決まらない品があるので社長に電話${total ? `（分かっている分 ${yen(total)}）` : ""}`;
    else lead = `★チェックイン時に ${yen(total)} をもらう`;
    const en: string[] = [];
    if (enCollect.length) {
      en.push(
        `  お客様に見せる英語：「Please pay ${unknown ? "for" : `${yen(total)} for`} your meals now: ${enCollect.join(", ")}.${enPaid.length ? ` (${enPaid.join(", ")}: already paid.)` : ""}」`,
      );
    }
    out.push({
      date,
      weekday: items[0].weekday,
      room,
      text: [head, lead, ...collect, ...already, ...en].join("\n"),
    });
  }
  return out.sort((a, b) => (a.date + a.room).localeCompare(b.date + b.room));
}

export async function getMealBillBlock(): Promise<string | null> {
  try {
    const [orders, schedule, menu] = await Promise.all([fetchOrders(), fetchScheduleData(false), fetchMenu()]);
    const today = jstToday();
    const from = addDays(today, -1);
    const to = addDays(today, 14);
    const bill = computeBill(orders.lines, schedule.board ?? [], menu).filter((b) => b.date >= from && b.date <= to);
    return `# 食事と会計（プログラムで計算済み・スタッフ専用）
★★★シフト・食事・会計・「いくらもらう？」を聞かれたら、答えの**一番最初**に、その日・その部屋の下の「会計カード」（■から始まるかたまり）を**改行も含めて一字一句そのまま**貼る。シフトの他の内容はその後に書く。支払い済みかどうかの判定や金額の計算を自分でしない・言い換えない・足し算し直さない（2026-11-11 社長指示。AIの判定が聞くたびに入れ替わり、スタッフが誤った金額で会計しかけた）。
- 会計カードを要約・言い換え・並べ替えしない。「支払い済み」という言葉を部屋全体に使わない（2026-11-11 スタッフが「全部支払い済み」と読み違えて¥10,000をもらい損ねた）。\n- 下にカードが無い部屋は「仕出しなし（もらうお金なし）」。
- 金額は売値（HPの料金）。仕出し屋への支払額（原価）は出さない。
- 判定元：品目と数＝注文確認票／支払い済み＝予定表の食事欄の「(paid)」／金額＝「メニュー」シート。今日: ${today}

${bill.map((b) => b.text).join("\n\n") || "(この期間の仕出しなし)"}`;
  } catch (err) {
    console.error("mealBill: failed:", err);
    return `# 食事と会計（計算に失敗）
いま食事の会計を計算できない。支払い済みか・いくらもらうかを聞かれたら、推測せず「いま会計の表が読めないので、社長に確認してください」とだけ答える。`;
  }
}

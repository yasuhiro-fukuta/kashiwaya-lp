// Staff-mode only: the caterer's order sheet (柏屋注文確認票, shared with
// ほなみや). This is the FINAL record of what has been agreed with the
// caterer — what will actually be cooked and delivered. The other sources
// (CleaningBoard meals, LatestOptions, the DM ledger) are upstream inputs;
// when they disagree with this sheet, this sheet is what arrives.
//
// The sheet is link-viewable, so it is read through the public CSV export
// (same approach as the DM ledger). Monthly tabs are named like
// "R8　１０月  " (Reiwa year, full-width space, full- or half-width month,
// and a varying number of trailing spaces), so tab ids are looked up from
// the sheet's htmlview page and every tab is validated by its own
// "R８年１０月" header cell before use.
//
// ★The 金額 columns (G/N) are what Kashiwaya pays the caterer (原価).
// Staff must never see cost prices, so they are NOT read at all; meal
// prices come only from the「メニュー」sheet (= selling prices on the site).

const ORDER_SHEET_ID =
  process.env.ORDER_SHEET_ID ?? "1UHVicDOlgA597o7ahXYOgP0bNQnKan_1t7kc2VfkXqc";

const BASE = `https://docs.google.com/spreadsheets/d/${ORDER_SHEET_ID}`;

export const ORDERS_UNAVAILABLE_NOTE = `# 注文確認票 接続エラー（内部情報）
現在、ほなみや（仕出し屋）と共有している注文確認票への接続に一時的に失敗している。食事の注文・仕込みについて聞かれたら、予定表やDM台帳の内容を答えてもよいが、必ず「注文確認票（仕出し屋との最終合意）に接続できないため、仕出し屋に実際に届いている注文かは確認できていません」と添えること。`;

export type OrderLine = {
  date: string; // YYYY-MM-DD
  weekday: string;
  room: "1F" | "2F";
  name: string;
  item: string;
  qty: string;
  note: string;
};

type Tab = { name: string; gid: string };

function nfkc(s: string): string {
  return s.normalize("NFKC");
}

function clean(s: string | undefined): string {
  return nfkc(s ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

// Minimal RFC 4180 parser (quoted fields may contain commas and newlines).
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// Japan time (the sheet is organised by Japanese calendar month).
function jstNow(): Date {
  return new Date(Date.now() + 9 * 3600_000);
}

function targetMonths(): { year: number; month: number }[] {
  const now = jstNow();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  const next = m === 12 ? { year: y + 1, month: 1 } : { year: y, month: m + 1 };
  return [{ year: y, month: m }, next];
}

async function fetchText(url: string, bypassCache: boolean): Promise<string> {
  const res = await fetch(url, {
    // The sheet is edited by hand through the day; 5 minutes keeps it fresh.
    ...(bypassCache ? { cache: "no-store" as const } : { next: { revalidate: 300 } }),
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`orders fetch ${res.status}`);
  return res.text();
}

async function listTabs(bypassCache: boolean): Promise<Tab[]> {
  const html = await fetchText(`${BASE}/htmlview`, bypassCache);
  const tabs: Tab[] = [];
  const re = /name:\s*"((?:[^"\\]|\\.)*)"[^}]*?gid:\s*"(\d+)"/g;
  for (const m of html.matchAll(re)) {
    let name = m[1];
    try {
      name = JSON.parse(`"${name}"`);
    } catch {
      /* keep raw */
    }
    tabs.push({ name, gid: m[2] });
  }
  if (!tabs.length) throw new Error("orders: no tabs found in htmlview");
  return tabs;
}

function monthTabFor(tabs: Tab[], year: number, month: number): Tab | undefined {
  const reiwa = year - 2018;
  return tabs.find((t) => {
    // Tab names vary month to month: "R8　１０月", "R8年１１月" (with 年).
    const m = /^R\s*(\d+)\s*年?\s*(\d+)\s*月$/.exec(clean(t.name));
    return !!m && Number(m[1]) === reiwa && Number(m[2]) === month;
  });
}

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function parseMonth(rows: string[][], year: number, month: number): OrderLine[] | null {
  const reiwa = year - 2018;
  // Validate: the tab must carry its own "R8年10月" header near the top.
  const header = rows
    .slice(0, 5)
    .flat()
    .map(clean)
    // The header cell is "R8年10月" on some tabs and "R811月" (no 年) on others.
    .some((c) => {
      const v = c.replace(/\s/g, "");
      return v === `R${reiwa}年${month}月` || v === `R${reiwa}${month}月`;
    });
  if (!header) return null;

  const lines: OrderLine[] = [];
  // Column layout: B 日付 / C 曜日 / D 名前 / E 注文品 / F 数 / G 金額 (1F)
  //                I 日付 / J 曜日 / K 名前 / L 注文品 / M 数 / N 金額 (2F)
  // 金額 (G/N) is the caterer's price = cost. Deliberately never read.
  const sides: { room: "1F" | "2F"; day: number; d: number; n: number; i: number; q: number }[] = [
    { room: "1F", day: 1, d: 2, n: 3, i: 4, q: 5 },
    { room: "2F", day: 8, d: 9, n: 10, i: 11, q: 12 },
  ];
  const state = sides.map(() => ({ day: 0, name: "" }));

  for (const row of rows) {
    const cells = row.map(clean);
    // Skip header rows.
    if (cells.some((c) => c === "日付" || c === "注文品")) continue;

    sides.forEach((s, idx) => {
      const st = state[idx];
      const dayCell = cells[s.day] ?? "";
      const dm = /^(\d{1,2})日$/.exec(dayCell);
      if (dm) {
        st.day = Number(dm[1]);
        st.name = cells[s.n] ?? "";
      } else if (cells[s.n]) {
        st.name = cells[s.n];
      }
      const item = cells[s.i] ?? "";
      if (!st.day || !item) return;
      const date = new Date(Date.UTC(year, month - 1, st.day));
      if (date.getUTCMonth() !== month - 1) return;
      const notes: string[] = [];
      // Free-text notes sit in the gap column (H) and to the right of 2F.
      if (s.room === "1F" && cells[7]) notes.push(cells[7]);
      if (s.room === "2F") for (const c of cells.slice(14)) if (c) notes.push(c);
      lines.push({
        date: `${year}-${String(month).padStart(2, "0")}-${String(st.day).padStart(2, "0")}`,
        weekday: WEEKDAYS[date.getUTCDay()],
        room: s.room,
        name: st.name,
        item,
        qty: cells[s.q] ?? "",
        note: notes.join(" / "),
      });
    });
  }
  return lines;
}

export type OrdersData = {
  lines: OrderLine[];
  months: { label: string; status: "ok" | "no-tab" | "invalid" }[];
};

export async function fetchOrders(bypassCache = false): Promise<OrdersData> {
  const tabs = await listTabs(bypassCache);
  const lines: OrderLine[] = [];
  const months: OrdersData["months"] = [];
  // The month tabs are independent — fetch them together.
  const results = await Promise.all(
    targetMonths().map(async ({ year, month }) => {
      const label = `${year}-${String(month).padStart(2, "0")}`;
      const tab = monthTabFor(tabs, year, month);
      if (!tab) return { label, status: "no-tab" as const, parsed: null };
      const csv = await fetchText(`${BASE}/export?format=csv&gid=${tab.gid}`, bypassCache);
      const parsed = parseMonth(parseCsv(csv), year, month);
      if (!parsed) return { label, status: "invalid" as const, parsed: null };
      return { label, status: "ok" as const, parsed };
    }),
  );
  for (const r of results) {
    if (r.parsed) lines.push(...r.parsed);
    months.push({ label: r.label, status: r.status });
  }
  if (!months.some((m) => m.status === "ok")) throw new Error("orders: no usable month tab");
  return { lines, months };
}

let lastGood: { block: string; at: string } | null = null;

export async function getOrdersBlock(): Promise<string | null> {
  for (const bypassCache of [false, true]) {
    try {
      const data = await fetchOrders(bypassCache);
      const block = formatOrdersBlock(data);
      lastGood = { block, at: jstNow().toISOString().slice(0, 16).replace("T", " ") };
      return block;
    } catch (err) {
      console.error(`orders: fetch failed (retry=${bypassCache}):`, err);
    }
  }
  if (lastGood) {
    return `${lastGood.block}

※注意: 注文確認票への最新の接続に失敗したため、上記は ${lastGood.at}（日本時間）時点のデータである。回答にも「${lastGood.at}時点の注文確認票です」と添えること。`;
  }
  return null;
}

function formatOrdersBlock(data: OrdersData): string {
  const body = data.lines.map((l) => {
    const parts = [
      `${l.date}(${l.weekday}) ${l.room}`,
      l.name ? `宿泊者:${l.name}` : "宿泊者:(記載なし)",
      `${l.item} ×${l.qty || "?"}`,
    ];
    if (l.note) parts.push(`備考:${l.note}`);
    return parts.join(" | ");
  });
  const missing = data.months
    .filter((m) => m.status !== "ok")
    .map((m) => `${m.label}（${m.status === "no-tab" ? "タブ未作成" : "読み取り不可"}）`);

  return `# 注文確認票（ほなみや＝仕出し屋と共有・スタッフ専用データ）
仕出し屋ほなみやと柏屋が共有している注文確認票。**仕出し屋と最終的に握れている食事注文はこれだけ**であり、実際に作られて届くのはこの表の内容である。

## 使い方のルール（最重要）
- ★★食事の注文・仕込み・品目・数量について答えるときは、**この注文確認票を最優先の正**とする。予定表（CleaningBoard）の食事欄・フォーム注文・問い合わせ台帳（DM）は、この表に反映される前の途中経過である。
- ★予定表やDM台帳に食事があるのに、この表に無い → 「⚠注文確認票に無い＝仕出し屋に未連絡の可能性（要確認）」と明記する。届く前提で答えない。
- ★この表にあるのに予定表やDM台帳に無い・内容が違う → この表の内容（品目・数量）を正として答え、「予定表と食い違い」と添える。
- ★数量の単位は「セット」：**夕食1セット＝2名分、朝食1セット＝1名分**（台帳・予定表の「人前」とは単位が違う）。例：鶏鍋+おにぎり ×1.5 ＝ 3名分、×0.5 ＝ 1名分、朝食 ×2 ＝ 2名分。人数を答えるときはこの換算で答え、照合も換算してから行う。
- 夕食の品目は「鍋の種類+主食（おにぎり・ちらし等）」の形で書かれている。
- ★★この表には金額を載せていない（仕出し屋への支払額＝原価なので、スタッフにもゲストにも絶対に出さない）。食事代を聞かれたら「食事メニューと料金」（HPと同じ売値・セット料金）だけで答える。原価・仕入れ値・仕出し屋への支払額を聞かれても答えない（「お答えできません」とだけ言う）。
- 宿泊者名の後ろの「支払済」「（マスタとの齟齬OK）」などは柏屋側のメモなので、そのまま伝える。
- この表に無い日・部屋は「注文確認票に注文なし」。推測で補わない。
- この表はスタッフ専用。ゲストとの通常会話では存在にも内容にも触れない。
${missing.length ? `- 次の月はまだ読めていない: ${missing.join("、")}。その月の注文は「注文確認票が未作成のため未確認」と答える。\n` : ""}
## 注文一覧（日付 | 部屋 | 宿泊者 | 品目 ×数量）
${body.join("\n") || "(この期間の注文なし)"}`;
}

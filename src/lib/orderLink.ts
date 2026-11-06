// Link paid orders from the meal order page (/order) to their booking, then
// write them to the sheet (「DMからの食事注文」+ CleaningOverride "(paid)").
// 2026-11-06 社長決定：注文ページでは予約を照合しない。定時チェック（6・12・18時）が
// POST /api/order/link を呼び、ここで Booking 予約番号 → Lodgify の予約に紐づける。
// 紐づかない注文・一棟貸しの夕食などは書かずに返し、定時チェックが社長に聞く。

import { fetchLodgifyArrivals, findStay, findStayInLodgify, nameMatches, type LodgifyBooking, type Stay } from "@/lib/stay";
import { listOrderPageOrders, isPaid, setOrderMetadata, type SquareOrder } from "@/lib/square";
import { appendDmOrders, appendOverrides, type DmOrderRow, type OverrideRow } from "@/lib/sheetWrite";
import { addDays, todayJst } from "@/lib/mealOrder";

export type LinkReport = {
  linked: { orderId: string; guest: string; room: string; booking: string; items: string[] }[];
  unmatched: { orderId: string; booking: string; lastName: string; arrival: string; createdAt: string; total: number; items: string[] }[];
  problems: { orderId: string; booking: string; guest: string; reason: string; total: number; items: string[] }[];
  /** 紐づけ済みの注文で、宿泊がキャンセルされたもの（食事も宿泊と同じ条件で取消・返金。2026-11-06 社長決定） */
  cancelled: {
    orderId: string; booking: string; guest: string; arrival: string; total: number; items: string[];
    lodgifyStatus: string; daysBeforeArrival: number | null; policy: string;
  }[];
  skipped: number;
};

/** 食事のキャンセル規定＝宿泊と同じ：到着7日前までのキャンセルは全額返金、それ以降は返金なし */
export const MEAL_FREE_CANCEL_DAYS = 7;

function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400_000);
}

function items(o: SquareOrder): string[] {
  return (o.line_items ?? []).map((li) => `${li.name} ×${li.quantity}`);
}

function roomOn(stay: Stay, date: string): "1F" | "2F" | null {
  const n = stay.nights.find((x) => x.date === date);
  return n && (n.room === "1F" || n.room === "2F") ? n.room : null;
}

async function locate(o: SquareOrder): Promise<Stay | null> {
  const md = o.metadata ?? {};
  const arrival = md.arrival ?? "";
  const booking = md.booking ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(arrival)) return null;
  // Booking number first (exact), then last name + check-in date.
  const byBooking = await findStayInLodgify("", arrival, booking).catch(() => null);
  if (byBooking) return byBooking;
  return findStay(md.lastName ?? md.guest ?? "", arrival, booking).catch(() => null);
}

/**
 * Orders whose sheet rows were already written before marking them as logged
 * failed (Square metadata limit, 2026-11-07). Only mark them; don't append again.
 */
const ALREADY_IN_SHEET = new Set<string>(["aSCglcPwLZGgGC4tJ5w3xWkYaXPZY"]);

export async function linkPendingOrders(): Promise<LinkReport> {
  const report: LinkReport = { linked: [], unmatched: [], problems: [], cancelled: [], skipped: 0 };
  const all = await listOrderPageOrders();
  const pending = all.filter((o) => isPaid(o) && o.metadata?.logged !== "1");
  report.skipped = all.length - pending.length;

  for (const o of pending) {
    const md = o.metadata ?? {};
    const total = o.total_money?.amount ?? 0;
    const booking = md.booking ?? "";
    if ((o.refunds ?? []).length > 0) {
      report.problems.push({ orderId: o.id, booking, guest: md.lastName ?? "", reason: "返金あり（シートには書いていません）", total, items: items(o) });
      continue;
    }
    const stay = await locate(o);
    if (!stay) {
      report.unmatched.push({
        orderId: o.id, booking, lastName: md.lastName ?? "", arrival: md.arrival ?? "",
        createdAt: o.created_at ?? "", total, items: items(o),
      });
      continue;
    }
    const lines = (o.line_items ?? []).filter((li) => li.metadata?.date && li.metadata?.item);
    const outside = lines.filter((li) => !roomOn(stay, li.metadata!.date));
    const houseDinner = stay.nights.some((n) => n.wholeHouse) && lines.some((li) => li.metadata!.kind === "dinner");
    if (outside.length || houseDinner) {
      report.problems.push({
        orderId: o.id, booking, guest: stay.guestName, total, items: items(o),
        reason: houseDinner
          ? "一棟貸しの予約に夕食の注文（一棟貸しは夕食なし）"
          : `宿泊日にない日の注文：${outside.map((li) => li.metadata!.date).join(", ")}`,
      });
      continue;
    }

    const rows: DmOrderRow[] = lines.map((li) => {
      const m = li.metadata!;
      const isDinner = m.kind === "dinner";
      return {
        date: m.date,
        room: roomOn(stay, m.date)!,
        guest: stay.guestName,
        item: m.item,
        persons: Number(m.persons) || 1,
        time: isDinner ? md.time ?? "" : "",
        channel: "Booking",
        dmDate: todayJst(),
        status: "有効",
        memo: [
          "注文ページ（Square支払済・定時チェックで予約に紐づけ）",
          `${li.name} ×${li.quantity}`,
          isDinner && md.rice ? `ご飯:${md.rice}` : "",
          `Booking予約番号:${booking || "?"}`,
          `Square注文:${o.id}`,
        ].filter(Boolean).join(" / "),
      };
    });

    // One CleaningOverride row per night+room carrying EVERY paid item of that
    // night (the batch keys overrides by night+room and the last row wins), so
    // include this guest's earlier linked orders for the same nights.
    const nightsHere = new Set(rows.map((r) => `${r.date}|${r.room}`));
    const earlier = all.filter(
      (x) => x.id !== o.id && isPaid(x) && x.metadata?.logged === "1" && x.metadata?.guest === stay.guestName && !(x.refunds ?? []).length,
    );
    const byNight = new Map<string, OverrideRow>();
    for (const x of [o, ...earlier]) {
      for (const li of x.line_items ?? []) {
        const m = li.metadata;
        if (!m?.date || !m?.label) continue;
        const room = m.room === "1F" || m.room === "2F" ? m.room : roomOn(stay, m.date);
        if (!room) continue;
        const k = `${m.date}|${room}`;
        if (!nightsHere.has(k)) continue;
        const part = `(paid) ${m.label}(${Number(m.persons) || 1}人前)`;
        const cur = byNight.get(k);
        if (cur) {
          cur.meal += `, ${part}`;
          if (!cur.memo!.includes(x.id)) cur.memo += ` ${x.id}`;
        } else {
          byNight.set(k, { date: m.date, room, meal: part, memo: `注文ページ Square支払済 ${x.id}` });
        }
      }
    }

    try {
      if (!ALREADY_IN_SHEET.has(o.id)) {
        await appendDmOrders(rows);
        await appendOverrides([...byNight.values()]);
      }
      await setOrderMetadata(o, { logged: "1", guest: stay.guestName.slice(0, 200) });
      report.linked.push({ orderId: o.id, guest: stay.guestName, room: stay.room, booking, items: items(o) });
    } catch (err) {
      report.problems.push({
        orderId: o.id, booking, guest: stay.guestName, total, items: items(o),
        reason: `シートへの書き込みに失敗：${err instanceof Error ? err.message : String(err)}`,
      });
    }
  }
  await findCancelled(all, report);
  return report;
}

/**
 * 紐づけ済み・未返金・これから到着の注文について、Lodgify の予約がキャンセルに
 * なっていないか確かめる。見つけたら report.cancelled に入れる（返金は社長が
 * Square で行う。Claude は返金しない）。社長が「返金しない」と決めた注文は
 * metadata.cancelHandled=1 で以後出さない（markCancelHandled）。
 */
async function findCancelled(all: SquareOrder[], report: LinkReport) {
  const today = todayJst();
  const watch = all.filter(
    (o) => isPaid(o) && o.metadata?.logged === "1" && o.metadata?.cancelHandled !== "1" && !(o.refunds ?? []).length,
  );
  const cache = new Map<string, LodgifyBooking[]>();
  for (const o of watch) {
    const md = o.metadata ?? {};
    // Arrival: new orders carry it; older ones only have line dates.
    const dates = (o.line_items ?? []).map((li) => li.metadata?.date).filter((d): d is string => !!d).sort();
    const arrival = md.arrival || dates[0] || "";
    if (!arrival || (dates[dates.length - 1] ?? arrival) < today) continue;
    let items = cache.get(arrival);
    if (!items) {
      items = await fetchLodgifyArrivals(arrival).catch(() => [] as LodgifyBooking[]);
      cache.set(arrival, items);
    }
    const bookingNo = String(md.booking ?? "").replace(/[^0-9A-Za-z]/g, "");
    const mine = items.filter(
      (b) =>
        (bookingNo.length >= 6 && String(b.source_text ?? "").split("|")[0].replace(/[^0-9A-Za-z]/g, "") === bookingNo) ||
        nameMatches(String(b.guest?.name ?? ""), md.guest ?? md.lastName ?? ""),
    );
    if (mine.length === 0 || mine.some((b) => b.status === "Booked")) continue;
    const st = mine[0].status;
    const days = daysBetween(today, arrival);
    report.cancelled.push({
      orderId: o.id, booking: md.booking ?? "", guest: md.guest ?? md.lastName ?? "", arrival,
      total: o.total_money?.amount ?? 0, items: (o.line_items ?? []).map((li) => `${li.name} ×${li.quantity}`),
      lodgifyStatus: st, daysBeforeArrival: days,
      policy: days >= MEAL_FREE_CANCEL_DAYS
        ? `到着${days}日前のキャンセルを検知：規定（${MEAL_FREE_CANCEL_DAYS}日前まで）内なので全額返金の対象。ただし実際のキャンセル日は Lodgify で確認`
        : `到着${days}日前に検知：キャンセルが${addDays(arrival, -MEAL_FREE_CANCEL_DAYS)}より前なら全額返金、それ以降なら返金なし（Lodgify のキャンセル日で判断）`,
    });
  }
}

/** 社長が「返金しない／返金済み」と決めたキャンセル注文を、以後の報告から外す */
export async function markCancelHandled(orderId: string): Promise<void> {
  const all = await listOrderPageOrders();
  const o = all.find((x) => x.id === orderId);
  if (!o) throw new Error("order not found");
  await setOrderMetadata(o, { cancelHandled: "1" });
}

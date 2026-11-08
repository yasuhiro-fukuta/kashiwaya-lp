// Look up a guest's stay for the meal order page (/order).
// Reads CleaningBoard through the staff read API (SHEET_API_URL, no part),
// server-side only. Only the matched guest's nights are returned to the
// browser — never other guests' names or the rest of the board.

import { firstOrderableNight, type Night } from "@/lib/mealOrder";

type BoardRow = {
  date: string;
  room: string;
  guests: string;
  state: string;
  guestName: string;
  note?: string;
};

const NIGHT_STATES = ["IN", "OUT→IN", "連泊"];

function norm(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9぀-ヿ一-鿿 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function nameMatches(guestName: string, lastName: string): boolean {
  const g = norm(guestName);
  const l = norm(lastName);
  if (l.length < 2 || !g) return false;
  return g.split(" ").includes(l) || g.replace(/ /g, "").includes(l.replace(/ /g, ""));
}

async function fetchBoard(): Promise<BoardRow[]> {
  const url = process.env.SHEET_API_URL;
  const token = process.env.SHEET_API_TOKEN;
  if (!url || !token) throw new Error("SHEET_API_URL / SHEET_API_TOKEN not set");
  const sep = url.includes("?") ? "&" : "?";
  const res = await fetch(`${url}${sep}token=${encodeURIComponent(token)}`, {
    cache: "no-store",
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`board api ${res.status}`);
  const data = (await res.json()) as { board?: BoardRow[]; error?: string };
  if (data.error || !Array.isArray(data.board)) throw new Error(`board api: ${data.error ?? "no board"}`);
  return data.board;
}

export type Stay = { guestName: string; room: "1F" | "2F" | "1F + 2F" | ""; nights: Night[] };

/**
 * Find the stay whose guest name contains `lastName` and whose first night is
 * `arrival`. Returns null when nothing matches.
 */
export async function findStay(lastName: string, arrival: string, booking = ""): Promise<Stay | null> {
  const fromBoard = await findStayOnBoard(lastName, arrival).catch((err) => {
    console.error("findStay: board lookup failed", err);
    return null;
  });
  if (fromBoard) return fromBoard;
  // The board is refreshed by an hourly batch, so a guest who booked minutes
  // ago is not on it yet. Ask Lodgify directly before giving up.
  return findStayInLodgify(lastName, arrival, booking).catch((err) => {
    console.error("findStay: lodgify lookup failed", err);
    return null;
  });
}

async function findStayOnBoard(lastName: string, arrival: string): Promise<Stay | null> {
  const board = await fetchBoard();
  const mine = board.filter(
    (r) => NIGHT_STATES.includes(r.state) && (r.room === "1F" || r.room === "2F") && nameMatches(r.guestName, lastName),
  );
  const first = mine.filter((r) => r.date === arrival);
  if (first.length === 0) return null;
  const guestName = first[0].guestName;

  // Walk forward night by night while the same guest is still staying.
  const byDate = new Map<string, BoardRow[]>();
  for (const r of mine.filter((r) => r.guestName === guestName)) {
    const list = byDate.get(r.date) ?? [];
    list.push(r);
    byDate.set(r.date, list);
  }
  const cutoff = firstOrderableNight();
  const nights: Night[] = [];
  let d = arrival;
  for (let i = 0; i < 60; i++) {
    const rows = byDate.get(d);
    if (!rows) break;
    // Whole-house stays are expanded to 1F + 2F rows tagged「一棟貸し」in the
    // board note (kashiwayasheet House.gs). A guest who simply booked both
    // rooms has no such tag and can still order dinner.
    const wholeHouse = rows.some((r) => String(r.note ?? "").includes("一棟貸し"));
    const bothRooms = rows.some((r) => r.room === "1F") && rows.some((r) => r.room === "2F");
    const guests = rows.reduce((s, r) => s + (Number(String(r.guests).replace(/[^0-9]/g, "")) || 0), 0);
    nights.push({
      date: d,
      room: rows.some((r) => r.room === "1F") ? "1F" : "2F",
      guests,
      wholeHouse,
      bothRooms,
      orderable: d >= cutoff,
    });
    const next = new Date(`${d}T00:00:00Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    d = next.toISOString().slice(0, 10);
  }
  const room = byDate.get(arrival)!.length > 1 ? "1F + 2F" : nights[0].room;
  return { guestName, room, nights };
}

// ---- Live fallback: Lodgify through the inbox API (kashiwaya-autoreply) ----

// Lodgify room_type_id → room (kashiwaya_master_v2 LodgifyBookings).
export const ROOM_TYPES: Record<number, "1F" | "2F" | "HOUSE"> = { 860944: "1F", 860952: "2F", 917713: "HOUSE" };
const DEFAULT_INBOX_API_URL =
  "https://script.google.com/macros/s/AKfycbxwx6B3UXvr2vOzpWIGzFOJVbGAhCVPlIa6AxAim3Vs1r1LaIBeoJdyJKZ1iJdw5fNW/exec";

export type LodgifyBooking = {
  id?: number;
  arrival: string;
  departure: string;
  status: string;
  source_text?: string | null;
  guest?: { name?: string | null } | null;
  rooms?: { room_type_id: number; people?: number }[];
};

export async function fetchLodgifyArrivals(arrival: string): Promise<LodgifyBooking[]> {
  const url = process.env.INBOX_API_URL || DEFAULT_INBOX_API_URL;
  const token = process.env.INBOX_API_TOKEN || process.env.SHEET_WRITE_TOKEN;
  if (!token) throw new Error("INBOX_API_TOKEN / SHEET_WRITE_TOKEN not set");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,
      action: "lodgify.get",
      path: `/v2/reservations/bookings?page=1&size=10&stayFilter=ArrivalDate&stayFilterDate=${arrival}`,
    }),
    cache: "no-store",
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`inbox api ${res.status}`);
  const data = (await res.json()) as { ok?: boolean; body?: unknown; error?: string };
  if (!data.ok) throw new Error(`inbox api: ${data.error ?? "not ok"}`);
  const body = typeof data.body === "string" ? JSON.parse(data.body) : data.body;
  const items = (body as { items?: LodgifyBooking[] } | null)?.items;
  return Array.isArray(items) ? items : [];
}

export async function findStayInLodgify(lastName: string, arrival: string, booking: string): Promise<Stay | null> {
  const items = (await fetchLodgifyArrivals(arrival)).filter((b) => b.status === "Booked" && b.arrival === arrival);
  const bookingNo = booking.replace(/[^0-9A-Za-z]/g, "");
  const hit =
    (bookingNo.length >= 6 &&
      items.find((b) => String(b.source_text ?? "").split("|")[0].replace(/[^0-9A-Za-z]/g, "") === bookingNo)) ||
    items.find((b) => nameMatches(String(b.guest?.name ?? ""), lastName));
  if (!hit) return null;

  const kinds = (hit.rooms ?? []).map((r) => ROOM_TYPES[r.room_type_id]).filter(Boolean);
  const wholeHouse = kinds.includes("HOUSE");
  const has1F = wholeHouse || kinds.includes("1F");
  const has2F = wholeHouse || kinds.includes("2F");
  if (!has1F && !has2F) return null;
  const bothRooms = has1F && has2F;
  const guests = (hit.rooms ?? []).reduce((s, r) => s + (Number(r.people) || 0), 0);
  const cutoff = firstOrderableNight();
  const nights: Night[] = [];
  let d = arrival;
  for (let i = 0; i < 60 && d < hit.departure; i++) {
    nights.push({ date: d, room: has1F ? "1F" : "2F", guests, wholeHouse, bothRooms, orderable: d >= cutoff });
    const next = new Date(`${d}T00:00:00Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    d = next.toISOString().slice(0, 10);
  }
  if (nights.length === 0) return null;
  return { guestName: String(hit.guest?.name ?? lastName), room: bothRooms ? "1F + 2F" : nights[0].room, nights };
}

// ---- Whole-house or rooms, decided from the date (2026-11-06 社長決定) ----
// Lodgify sells the whole house (room type 917713) only on chosen dates; on
// the other dates it is a closed period and the two rooms are sold instead.
// A date is a whole-house night when the house is booked or still open for
// sale on it. Guests no longer choose this on the order page.
const HOUSE_PROPERTY_ID = 850548;
const HOUSE_ROOM_TYPE_ID = 917713;

type AvailabilityPeriod = {
  start: string;
  end: string;
  available: number;
  closed_period: unknown;
  bookings?: { id: number }[];
};

/** The dates in [start, end] that are whole-house nights. Throws when Lodgify can't be read. */
export async function houseNights(start: string, end: string): Promise<Set<string>> {
  const url = process.env.INBOX_API_URL || DEFAULT_INBOX_API_URL;
  const token = process.env.INBOX_API_TOKEN || process.env.SHEET_WRITE_TOKEN;
  if (!token) throw new Error("INBOX_API_TOKEN / SHEET_WRITE_TOKEN not set");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,
      action: "lodgify.get",
      path: `/v2/availability/${HOUSE_PROPERTY_ID}/${HOUSE_ROOM_TYPE_ID}?start=${start}&end=${end}`,
    }),
    cache: "no-store",
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`inbox api ${res.status}`);
  const data = (await res.json()) as { ok?: boolean; body?: unknown; error?: string };
  if (!data.ok) throw new Error(`inbox api: ${data.error ?? "not ok"}`);
  const body = typeof data.body === "string" ? JSON.parse(data.body) : data.body;
  const periods = ((body as { periods?: AvailabilityPeriod[] }[] | null)?.[0]?.periods ?? []) as AvailabilityPeriod[];
  const out = new Set<string>();
  for (const p of periods) {
    const house = (p.bookings?.length ?? 0) > 0 || (!p.closed_period && Number(p.available) > 0);
    if (!house) continue;
    for (let d = p.start; d <= p.end; ) {
      out.add(d);
      const n = new Date(`${d}T00:00:00Z`);
      n.setUTCDate(n.getUTCDate() + 1);
      d = n.toISOString().slice(0, 10);
    }
  }
  return out;
}

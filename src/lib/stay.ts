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

export type Stay = { guestName: string; room: "1F" | "2F" | "1F + 2F"; nights: Night[] };

/**
 * Find the stay whose guest name contains `lastName` and whose first night is
 * `arrival`. Returns null when nothing matches.
 */
export async function findStay(lastName: string, arrival: string): Promise<Stay | null> {
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
      room: (rows[0].room as "1F" | "2F"),
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

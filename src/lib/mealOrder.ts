// Shared logic for the meal add-on order page (/order): which nights a guest
// can order for, what is on the menu, and the server-side price check.
// Prices always come from the「メニュー」sheet (= selling prices on the site);
// the client never sends a price.

import { fetchMenu } from "@/lib/menu";

export const ORDER_DEADLINE_DAYS = 3; // orders close 3 days before the night
// 2026-11-04 社長指示：夕食の時間は現地で確認するので注文時に聞かない。
// 2026-11-07 社長指示：ちらし寿司は廃止、ご飯はおにぎりのみ（選ばせない）。
export const DINNER_RICE = "Onigiri";

/**
 * A partner restaurant the guest eats at instead of Kashiwaya's catered dinner
 * (2026-11-19 社長決定：ピエロ限定オムライスコースを注文ページに追加。売値は
 * 「メニュー」シートの行で決まる＝行が無い間はページに出ない).
 * The guest pre-pays here; Kashiwaya settles with the restaurant monthly, like
 * ほなみや. Drinks are paid at the restaurant.
 */
export type Restaurant = {
  key: string; // Square metadata / report key
  name: string; // shown to guests
  closedWeekdays: number[]; // 0=Sun … 6=Sat (JS getUTCDay on the night's date)
  time: string; // seating time shown to guests
  walk: string; // how to get there, shown to guests
  mapUrl: string;
};

/** DMからの食事注文 item name → restaurant. */
export const RESTAURANTS: Record<string, Restaurant> = {
  ピエロ: {
    key: "pierrot",
    name: "Pierrot",
    closedWeekdays: [3], // 水曜定休（柏屋QA DB）。夜の営業は18〜19時
    time: "18:00",
    walk: "a 15-minute walk from Kashiwaya",
    mapUrl: "https://maps.app.goo.gl/CxAMh6QWJnFD2dLx6",
  },
};

export type MenuOption = {
  id: string; // stable key = menu row name
  label: string; // shown to guests
  kind: "dinner" | "breakfast" | "external"; // external = dinner out at a partner restaurant
  persons: number; // people per set
  price: number; // JPY per set
  item: string; // DMからの食事注文 item name (鶏鍋 / 朝食 / ピエロ …)
  boardLabel: string; // CleaningBoard meal label (kashiwayasheet CONFIG.MEALS)
  restaurant?: Restaurant; // kind === "external" only
};

/** Weekday (0=Sun) of a yyyy-MM-dd night. */
export function weekdayOf(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

/** True when the restaurant is closed on that night. */
export function restaurantClosed(r: Restaurant, date: string): boolean {
  return r.closedWeekdays.includes(weekdayOf(date));
}

/** DM-sheet item → the label CleaningBoard uses, so "(paid) X(n人前)" parses. */
const BOARD_LABEL: Record<string, string> = {
  鶏鍋: "Chicken Hot Pot",
  豚しゃぶ: "Shabu-Shabu",
  冷しゃぶ: "Cold Shabu-Shabu",
  すき焼き: "Wagyu Sukiyaki",
  ビーガン鍋: "Vegan Hot Pot & Chirashi",
  ビーガン冷しゃぶ: "Vegan Cold Shabu-Shabu",
  朝食: "Ochazuke Breakfast",
  ピエロ: "Pierrot Omurice", // kashiwayasheet CONFIG.MEALS (kind external)
};

/** Map a menu row name to the item names used in the DM order sheet. */
function itemFor(name: string): string | null {
  const n = name.toLowerCase();
  if (n.startsWith("breakfast")) return "朝食";
  if (n.includes("pierrot")) return "ピエロ";
  if (n.includes("vegan") && n.includes("chilled")) return "ビーガン冷しゃぶ";
  if (n.includes("vegan")) return "ビーガン鍋";
  if (n.includes("rei-shabu") || n.includes("chilled")) return "冷しゃぶ";
  if (n.includes("shabu")) return "豚しゃぶ";
  if (n.includes("sukiyaki")) return "すき焼き";
  if (n.includes("chicken")) return "鶏鍋";
  return null;
}

export async function getMenuOptions(): Promise<MenuOption[] | null> {
  const rows = await fetchMenu();
  if (!rows) return null;
  const out: MenuOption[] = [];
  for (const r of rows) {
    const item = itemFor(r.name);
    if (!item) continue;
    const restaurant = RESTAURANTS[item];
    const persons =
      Number(String(r.persons).replace(/[^0-9]/g, "")) || Number(/for (\d+)/i.exec(r.name)?.[1]) || (restaurant ? 1 : 0);
    if (!persons || !r.price) continue;
    out.push({
      id: r.name,
      label: r.name.replace(/^(Dinner|Breakfast)\s*-\s*/i, ""),
      kind: item === "朝食" ? "breakfast" : restaurant ? "external" : "dinner",
      persons,
      price: r.price,
      item,
      boardLabel: BOARD_LABEL[item] ?? item,
      ...(restaurant ? { restaurant } : {}),
    });
  }
  return out;
}

/** Today's date in Japan as yyyy-MM-dd. */
export function todayJst(): string {
  return new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10);
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** First night that can still be ordered for. */
export function firstOrderableNight(): string {
  return addDays(todayJst(), ORDER_DEADLINE_DAYS);
}

export type Night = {
  date: string; // the evening (dinner) / the night before (breakfast)
  room: "1F" | "2F" | ""; // "" = not linked to a booking yet (the order page never looks it up)
  guests: number;
  wholeHouse: boolean; // whole-house rental: no dinner (breakfast only)
  bothRooms: boolean; // 1F + 2F (whole house, or one group in both rooms)
  orderable: boolean;
};

export type OrderLine = {
  date: string;
  optionId: string;
  sets: number; // number of sets
};

export type OrderRequest = {
  booking: string;
  lastName: string;
  arrival: string;
  nights?: number; // number of nights (guest-entered)
  stayType?: "room" | "house"; // what the guest says they booked
  guests?: number;
  email?: string;
  time?: string;
  rice?: string;
  lines: OrderLine[];
};

export type PricedLine = OrderLine & {
  option: MenuOption;
  amount: number;
  room: "1F" | "2F" | "";
};

export const MAX_NIGHTS = 7;
export const MAX_GUESTS = 6;

/**
 * Nights from what the guest typed (2026-11-06 社長決定：注文ページでは予約を
 * 照合しない。部屋・一棟貸しの確認は定時チェックが /api/order/link で後から行う).
 */
export function buildNights(arrival: string, count: number, stayType: string, guests: number): Night[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(arrival)) throw new Error("Please enter your check-in date.");
  const n = Math.floor(Number(count));
  if (!(n >= 1 && n <= MAX_NIGHTS)) throw new Error(`Please choose 1–${MAX_NIGHTS} nights.`);
  const g = Math.floor(Number(guests));
  if (!(g >= 1 && g <= MAX_GUESTS)) throw new Error(`Please choose 1–${MAX_GUESTS} guests.`);
  const wholeHouse = stayType === "house";
  const cutoff = firstOrderableNight();
  return Array.from({ length: n }, (_, i) => {
    const date = addDays(arrival, i);
    return { date, room: "" as const, guests: g, wholeHouse, bothRooms: wholeHouse, orderable: date >= cutoff };
  });
}

/** Mark each night as whole-house or rooms from the dates Lodgify sells the house on. */
export function applyHouseNights(nights: Night[], house: Set<string>): Night[] {
  return nights.map((n) => ({ ...n, wholeHouse: house.has(n.date), bothRooms: house.has(n.date) }));
}

/**
 * Validate an order against the guest's nights and the live menu.
 * Throws an Error with a guest-readable message when something is off.
 */
export function priceOrder(req: OrderRequest, nights: Night[], menu: MenuOption[]): PricedLine[] {
  const lines = (req.lines ?? []).filter((l) => l && l.sets > 0);
  if (lines.length === 0) throw new Error("Please choose at least one meal.");
  if (lines.length > 30) throw new Error("Too many items in one order.");

  return lines.map((l) => {
    const night = nights.find((n) => n.date === l.date);
    if (!night) throw new Error(`${l.date} is not a night of your stay.`);
    if (!night.orderable) throw new Error(`Orders for ${l.date} are closed (${ORDER_DEADLINE_DAYS} days before).`);
    const option = menu.find((m) => m.id === l.optionId);
    if (!option) throw new Error("That menu item is no longer available. Please reload the page.");
    if (option.kind === "dinner" && night.wholeHouse) {
      throw new Error("Dinner is not served on whole-house stays — breakfast only.");
    }
    // Dinner out: allowed on whole-house nights too, but not on the restaurant's closed day.
    if (option.kind === "external" && option.restaurant && restaurantClosed(option.restaurant, l.date)) {
      throw new Error(`${option.restaurant.name} is closed on ${l.date}. Please pick another night.`);
    }
    const sets = Math.floor(Number(l.sets));
    if (!(sets >= 1 && sets <= 10)) throw new Error("Please choose 1–10 sets.");
    return { ...l, sets, option, amount: option.price * sets, room: night.room };
  });
}

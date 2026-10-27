// Shared logic for the meal add-on order page (/order): which nights a guest
// can order for, what is on the menu, and the server-side price check.
// Prices always come from the「メニュー」sheet (= selling prices on the site);
// the client never sends a price.

import { fetchMenu } from "@/lib/menu";

export const ORDER_DEADLINE_DAYS = 3; // orders close 3 days before the night
export const DINNER_TIMES = ["18:00", "18:30"] as const;
export const RICE_CHOICES = ["Chirashi sushi", "Onigiri"] as const;

export type MenuOption = {
  id: string; // stable key = menu row name
  label: string; // shown to guests
  kind: "dinner" | "breakfast";
  persons: number; // people per set
  price: number; // JPY per set
  item: string; // DMからの食事注文 item name (鶏鍋 / 朝食 …)
  boardLabel: string; // CleaningBoard meal label (kashiwayasheet CONFIG.MEALS)
};

/** DM-sheet item → the label CleaningBoard uses, so "(paid) X(n人前)" parses. */
const BOARD_LABEL: Record<string, string> = {
  鶏鍋: "Chicken Hot Pot",
  豚しゃぶ: "Shabu-Shabu",
  冷しゃぶ: "Cold Shabu-Shabu",
  すき焼き: "Wagyu Sukiyaki",
  ビーガン鍋: "Vegan Hot Pot & Chirashi",
  ビーガン冷しゃぶ: "Vegan Cold Shabu-Shabu",
  朝食: "Ochazuke Breakfast",
};

/** Map a menu row name to the item names used in the DM order sheet. */
function itemFor(name: string): string | null {
  const n = name.toLowerCase();
  if (n.startsWith("breakfast")) return "朝食";
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
    const persons = Number(String(r.persons).replace(/[^0-9]/g, "")) || Number(/for (\d+)/i.exec(r.name)?.[1]) || 0;
    if (!persons || !r.price) continue;
    out.push({
      id: r.name,
      label: r.name.replace(/^(Dinner|Breakfast)\s*-\s*/i, ""),
      kind: item === "朝食" ? "breakfast" : "dinner",
      persons,
      price: r.price,
      item,
      boardLabel: BOARD_LABEL[item] ?? item,
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
  room: "1F" | "2F";
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
  email?: string;
  time: string;
  rice: string;
  lines: OrderLine[];
};

export type PricedLine = OrderLine & {
  option: MenuOption;
  amount: number;
  room: "1F" | "2F";
};

/**
 * Validate an order against the guest's nights and the live menu.
 * Throws an Error with a guest-readable message when something is off.
 */
export function priceOrder(req: OrderRequest, nights: Night[], menu: MenuOption[]): PricedLine[] {
  if (!DINNER_TIMES.includes(req.time as (typeof DINNER_TIMES)[number])) throw new Error("Please choose a dinner time.");
  if (!RICE_CHOICES.includes(req.rice as (typeof RICE_CHOICES)[number])) throw new Error("Please choose your rice.");
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
    const sets = Math.floor(Number(l.sets));
    if (!(sets >= 1 && sets <= 10)) throw new Error("Please choose 1–10 sets.");
    return { ...l, sets, option, amount: option.price * sets, room: night.room };
  });
}

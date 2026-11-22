// Meal prices from the kashiwaya_master_v2 spreadsheet's「メニュー」sheet,
// via the same Apps Script Web API used by schedule.ts (?part=menu returns
// prices only — no guest data, so it is safe for guest-mode requests too).
// Replaces the old Google Form scraping (src/lib/mealform.ts): prices are
// Lodgify add-on SET prices (per group of 2/3, not per person).
// Fails soft — if the fetch fails the bot just answers without a price block.
//
// 2026-11-22 社長決定（値上げ）：ほなみやの料理の金額はシートの価格列ではなく
// mealPrices.ts の料金表でプログラムが計算する（受け付けた日時で旧／新を切り替える）。
// シートは「どの品・何名分を売るか（有効）」を決めるだけ。料金表に無い品
// （例：ピエロ）はシートの価格のまま。

import { mealKeyOf, setPrice, tariffAt, OLD_TARIFF, NEW_TARIFF, PRICE_CHANGE_AT, type Tariff } from "@/lib/mealPrices";

export type MenuItem = {
  name: string;
  category: string;
  persons: string;
  price: number;
  note: string;
};

type MenuData = { generatedAt?: string; menu?: MenuItem[]; error?: string };

export async function fetchMenu(): Promise<MenuItem[] | null> {
  const url = process.env.SHEET_API_URL;
  const token = process.env.SHEET_API_TOKEN;
  if (!url || !token) return null;

  try {
    const sep = url.includes("?") ? "&" : "?";
    const res = await fetch(
      `${url}${sep}token=${encodeURIComponent(token)}&part=menu`,
      {
        // Prices change rarely; 10 minutes keeps sheet edits reasonably fresh.
        next: { revalidate: 600 },
        redirect: "follow",
      },
    );
    if (!res.ok) throw new Error(`menu api ${res.status}`);
    const data = (await res.json()) as MenuData;
    if (data.error) throw new Error(`menu api: ${data.error}`);
    if (!Array.isArray(data.menu) || data.menu.length === 0) {
      throw new Error("menu api: no menu rows");
    }
    return data.menu;
  } catch (err) {
    console.error("menu: fetch failed:", err);
    return null;
  }
}

function personsOf(it: MenuItem): number {
  return Number(String(it.persons).replace(/[^0-9]/g, "")) || Number(/for (\d+)/i.exec(it.name)?.[1]) || 0;
}

/**
 * シートの行の価格を料金表で置き換える。料金表で売っていない人数（例：新料金の
 * すき焼き3名分）の行は落とす。料金表に無い品はシートの価格のまま。
 */
export function priceMenuRows(items: MenuItem[], tariff: Tariff): MenuItem[] {
  const out: MenuItem[] = [];
  for (const it of items) {
    const key = mealKeyOf(it.name);
    if (!key) {
      out.push(it);
      continue;
    }
    const price = setPrice(key, personsOf(it), tariff);
    if (price == null) continue;
    out.push({ ...it, price });
  }
  return out;
}

/** 受け付けた日時（既定＝今）の料金でメニューを返す。 */
export async function fetchMenuAt(at: Date | number = Date.now()): Promise<MenuItem[] | null> {
  const items = await fetchMenu();
  return items ? priceMenuRows(items, tariffAt(at)) : null;
}

function yen(n: number): string {
  return "¥" + n.toLocaleString("en-US");
}

function section(items: MenuItem[]): string {
  const groups = new Map<string, MenuItem[]>();
  for (const it of items) {
    const key = it.category || "その他";
    const list = groups.get(key) ?? [];
    list.push(it);
    groups.set(key, list);
  }
  return [...groups.entries()]
    .map(
      ([cat, list]) =>
        `■ ${cat}\n${list
          .map((it) => `  - ${it.name} — ${yen(it.price)}${it.note ? `（${it.note}）` : ""}`)
          .join("\n")}`,
    )
    .join("\n");
}

export async function getMenuBlock(): Promise<string | null> {
  const items = await fetchMenu();
  if (!items) return null;
  const now = Date.now();
  const current = tariffAt(now);
  const other = current === NEW_TARIFF ? OLD_TARIFF : NEW_TARIFF;
  const switchNote =
    now < PRICE_CHANGE_AT
      ? "- ★2026-12-01 0:00（日本時間）以降に受け付ける注文から新料金になる。いま受け付ける注文は「旧料金」。12/1以降の宿泊でも、11/30までに受け付けた注文は旧料金のまま。"
      : "- ★2026-12-01 0:00（日本時間）以降に受け付けた注文は「新料金」。それより前に受け付けた注文は「旧料金」のまま（宿泊日ではなく注文を受け付けた日で決まる）。いま受け付ける注文は新料金。";

  return `# 食事メニューと料金（料金の一次情報）
柏屋の夕食・朝食は事前予約制。正式な料金は下記のとおり。

- 食事の料金を聞かれたら、ここに書かれている金額を正確にそのまま答えること。ここに無い料金は推測・創作しない。
${switchNote}
- ★価格は「セット料金」。"for 2" は2人分セットの合計金額、"for 3" は3人分セットの合計金額であり、1人あたりの単価ではない。1人あたりに換算した金額を答えないこと。
- ★★この表に無い単位・人数(例:「4人前」)の金額を、掛け算・足し算・割り算で**作り出してはならない**(概算・参考値としても不可。過去に換算額と実際の請求額が食い違った事故がある)。表に無い金額を聞かれたら「料金表に該当がないため、問い合わせ台帳（DM台帳・お客様台帳）の記載で確認が必要」と答えること。
- ★★ここにある金額はHPに載っている売値。スタッフにもゲストにも、食事代はこの売値だけで答える。仕出し屋（ほなみや）への支払額・原価・仕入れ値は、どんな聞かれ方でも答えない。問い合わせ台帳に確定金額の記載があるゲストは、その金額を正としてよい。
- 食事は宿泊予約時にオプション（アドオン）として追加できる。予約後の食事の追加・変更は3日前までに WhatsApp (https://wa.me/819038392354) へ連絡。
- Booking.com経由で予約したお客様の食事注文は、食事注文ページ https://kashiwaya-inn.com/order で受け付ける（姓とチェックイン日で予約を照合し、泊まる日ごとに選んで事前決済。締切は各夜の3日前。一棟貸しは朝食のみ）。Googleフォームはもう案内しない。

## ${current.label}【いま受け付ける注文はこちら】
${section(priceMenuRows(items, current))}

## ${other.label}
${section(priceMenuRows(items, other))}`;
}

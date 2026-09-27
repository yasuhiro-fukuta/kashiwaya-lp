// Meal prices from the kashiwaya_master_v2 spreadsheet's「メニュー」sheet,
// via the same Apps Script Web API used by schedule.ts (?part=menu returns
// prices only — no guest data, so it is safe for guest-mode requests too).
// Replaces the old Google Form scraping (src/lib/mealform.ts): prices are
// Lodgify add-on SET prices (per group of 2/3, not per person).
// Fails soft — if the fetch fails the bot just answers without a price block.

type MenuItem = {
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

function yen(n: number): string {
  return "¥" + n.toLocaleString("en-US");
}

export async function getMenuBlock(): Promise<string | null> {
  const items = await fetchMenu();
  if (!items) return null;

  const groups = new Map<string, MenuItem[]>();
  for (const it of items) {
    const key = it.category || "その他";
    const list = groups.get(key) ?? [];
    list.push(it);
    groups.set(key, list);
  }
  const sections = [...groups.entries()].map(
    ([cat, list]) =>
      `■ ${cat}\n${list
        .map((it) => `  - ${it.name} — ${yen(it.price)}${it.note ? `（${it.note}）` : ""}`)
        .join("\n")}`,
  );

  return `# 食事メニューと料金（料金の一次情報）
柏屋の夕食・朝食は事前予約制。正式な料金は下記のとおり。

- 食事の料金を聞かれたら、ここに書かれている金額を正確にそのまま答えること。ここに無い料金は推測・創作しない。
- ★価格は「セット料金」。"for 2" は2人分セットの合計金額、"for 3" は3人分セットの合計金額であり、1人あたりの単価ではない。1人あたりに換算した金額を答えないこと。
- 食事は宿泊予約時にオプション（アドオン）として追加できる。予約後の食事の追加・変更は3日前までに WhatsApp (https://wa.me/819038392354) へ連絡。

${sections.join("\n")}`;
}

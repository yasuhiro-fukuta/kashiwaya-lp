// E-bike tour/rental facts from the Beyond Nakasendo Cycling site's llms.txt
// (a hand-maintained plain-text summary served by that site). Injected as a
// priority source so the bot answers e-bike prices, routes and booking links
// from the live site. Fails soft — on fetch failure the bot answers without it.

const EBIKE_INFO_URL =
  process.env.EBIKE_INFO_URL ?? "https://nakasendo-ebike.com/llms.txt";

export async function getEbikeBlock(): Promise<string | null> {
  try {
    const res = await fetch(EBIKE_INFO_URL, {
      next: { revalidate: 3600 },
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`ebike info ${res.status}`);
    const text = (await res.text()).trim();
    // A 404 page or placeholder would be short; the real file is ~2KB.
    if (text.length < 300) throw new Error("ebike info suspiciously short");

    return `# E-bikeツアー・レンタル情報（Beyond Nakasendo Cycling / 一次優先情報）
柏屋が運営するE-bike事業の公式情報。E-bikeの料金・ルート・予約方法・送迎(luggage shuttle)について聞かれたら、下記の記載を正確にそのまま使うこと。ここに無い料金や条件は推測しない。予約は下記のBookリンク(Square)か公式サイト https://nakasendo-ebike.com を案内する。

${text}`;
  } catch (err) {
    console.error("ebike: fetch failed:", err);
    return null;
  }
}

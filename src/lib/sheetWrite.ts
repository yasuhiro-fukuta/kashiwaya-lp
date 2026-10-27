// Append paid meal orders to「DMからの食事注文」in kashiwaya_master_v2 via
// the kashiwayasheet write API (WriteApi.gs, action dmOrder.append).
// The hourly batch then carries them to CleaningBoard and the order check.
// Needs SHEET_WRITE_URL / SHEET_WRITE_TOKEN (this repo is public — never
// hard-code either value).

export type DmOrderRow = {
  date: string;
  room: "1F" | "2F";
  guest: string;
  item: string;
  persons: number;
  time: string;
  channel: string;
  dmDate: string;
  status: "有効";
  memo: string;
};

export async function appendDmOrders(rows: DmOrderRow[]): Promise<void> {
  const url = process.env.SHEET_WRITE_URL;
  const token = process.env.SHEET_WRITE_TOKEN;
  if (!url || !token) throw new Error("SHEET_WRITE_URL / SHEET_WRITE_TOKEN not set");
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, action: "dmOrder.append", rows }),
      redirect: "follow",
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (data.ok) return;
    // "busy" = the hourly batch holds the lock; wait and retry.
    if (data.error && /busy/i.test(data.error) && attempt < 2) {
      await new Promise((r) => setTimeout(r, 20_000));
      continue;
    }
    throw new Error(`dmOrder.append failed: ${data.error ?? res.status}`);
  }
}

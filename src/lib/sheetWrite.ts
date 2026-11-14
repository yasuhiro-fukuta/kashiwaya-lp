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
  status: "有効" | "取消";
  memo: string;
};

export type OverrideRow = {
  date: string; // the night the meal is served
  room: "1F" | "2F";
  meal: string; // e.g. "(paid) Chicken Hot Pot(2人前), (paid) Ochazuke Breakfast(2人前)"
  memo?: string;
};

export function appendDmOrders(rows: DmOrderRow[]): Promise<void> {
  return post("dmOrder.append", rows);
}

/**
 * CleaningOverride「食事(追記)」is merged into CleaningBoard's meal column
 * (R) by the hourly batch. Writing "(paid) …" here is what tells staff on
 * site that the meal is already paid, so they don't charge it again.
 */
export function appendOverrides(rows: OverrideRow[]): Promise<void> {
  return post("override.append", rows);
}

async function post(action: string, rows: unknown[]): Promise<void> {
  const url = process.env.SHEET_WRITE_URL;
  const token = process.env.SHEET_WRITE_TOKEN;
  if (!url || !token) throw new Error("SHEET_WRITE_URL / SHEET_WRITE_TOKEN not set");
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, action, rows }),
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
    throw new Error(`${action} failed: ${data.error ?? res.status}`);
  }
}

export type PaymentRow = {
  provider: "square" | "stripe";
  account: string;
  id: string;
  at: string; // yyyy-MM-dd HH:mm (JST)
  status: string;
  amount: number;
  refunded: number;
  items: string;
  name: string;
  email: string;
  card: string; // brand + last 4 only
  orderId: string;
  ref: string;
  receipt: string;
};

/** 入金台帳 (PaymentLedger.gs): one row per payment, deduped by provider:id. */
export async function upsertPayments(rows: PaymentRow[]): Promise<{ added: number; updated: number; unchanged: number }> {
  const totals = { added: 0, updated: 0, unchanged: 0 };
  for (let i = 0; i < rows.length; i += 400) {
    const r = (await postJson("payment.upsert", rows.slice(i, i + 400))) as Partial<typeof totals>;
    totals.added += r.added ?? 0;
    totals.updated += r.updated ?? 0;
    totals.unchanged += r.unchanged ?? 0;
  }
  return totals;
}

async function postJson(action: string, rows: unknown[]): Promise<Record<string, unknown>> {
  const url = process.env.SHEET_WRITE_URL;
  const token = process.env.SHEET_WRITE_TOKEN;
  if (!url || !token) throw new Error("SHEET_WRITE_URL / SHEET_WRITE_TOKEN not set");
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, action, rows }),
      redirect: "follow",
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (data.ok) return data as Record<string, unknown>;
    if (data.error && /busy/i.test(data.error) && attempt < 2) {
      await new Promise((r) => setTimeout(r, 20_000));
      continue;
    }
    throw new Error(`${action} failed: ${data.error ?? res.status}`);
  }
  throw new Error(`${action} failed`);
}

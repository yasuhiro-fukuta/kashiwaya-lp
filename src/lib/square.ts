// Minimal Square REST client for the meal add-on order page (/order).
// Uses SQUARE_ACCESS_TOKEN / SQUARE_LOCATION_ID (Kashiwaya's own Square
// account, so the monthly closing rules for Square sales stay the same).
// Server-only: never import this from a client component.

const BASE = "https://connect.squareup.com/v2";
const VERSION = "2025-01-23";

export type Money = { amount: number; currency: "JPY" };

export type SquareLineItem = {
  name: string;
  quantity: string;
  base_price_money: Money;
  note?: string;
  metadata?: Record<string, string>;
};

export type SquareOrder = {
  id: string;
  version?: number;
  state?: string;
  reference_id?: string;
  metadata?: Record<string, string>;
  line_items?: (SquareLineItem & { uid?: string })[];
  tenders?: { id: string }[];
  total_money?: Money;
  net_amount_due_money?: Money;
};

function env() {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.SQUARE_LOCATION_ID;
  if (!token || !locationId) throw new Error("SQUARE_ACCESS_TOKEN / SQUARE_LOCATION_ID not set");
  return { token, locationId };
}

async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  const { token } = env();
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Square-Version": VERSION,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as T & {
    errors?: { code?: string; detail?: string }[];
  };
  if (!res.ok) {
    const msg = (json.errors ?? []).map((e) => `${e.code}: ${e.detail}`).join("; ");
    throw new Error(`square ${method} ${path} ${res.status} ${msg}`);
  }
  return json;
}

/** Create a hosted checkout page. Returns its URL and the order id. */
export async function createPaymentLink(opts: {
  idempotencyKey: string;
  referenceId: string;
  metadata: Record<string, string>;
  lineItems: SquareLineItem[];
  redirectUrl: (orderId: string) => string;
  buyerEmail?: string;
}): Promise<{ url: string; orderId: string }> {
  const { locationId } = env();
  type Res = { payment_link: { id: string; version: number; url: string; order_id: string } };
  const created = await call<Res>("POST", "/online-checkout/payment-links", {
    idempotency_key: opts.idempotencyKey,
    order: {
      location_id: locationId,
      reference_id: opts.referenceId,
      metadata: opts.metadata,
      line_items: opts.lineItems,
    },
    checkout_options: { ask_for_shipping_address: false },
    ...(opts.buyerEmail ? { pre_populated_data: { buyer_email: opts.buyerEmail } } : {}),
  });
  const link = created.payment_link;
  // The redirect must carry the order id, which only exists after creation.
  await call<Res>("PUT", `/online-checkout/payment-links/${link.id}`, {
    payment_link: {
      version: link.version,
      checkout_options: {
        ask_for_shipping_address: false,
        redirect_url: opts.redirectUrl(link.order_id),
      },
    },
  });
  return { url: link.url, orderId: link.order_id };
}

export async function getOrder(orderId: string): Promise<SquareOrder> {
  const res = await call<{ order: SquareOrder }>("GET", `/orders/${encodeURIComponent(orderId)}`);
  return res.order;
}

/** True when the order has been paid in full. */
export function isPaid(order: SquareOrder): boolean {
  const due = order.net_amount_due_money?.amount;
  return (order.tenders?.length ?? 0) > 0 && (due === undefined || due === 0);
}

/** Merge keys into the order's metadata (used to mark it as logged). */
export async function setOrderMetadata(order: SquareOrder, extra: Record<string, string>) {
  const { locationId } = env();
  await call("PUT", `/orders/${encodeURIComponent(order.id)}`, {
    idempotency_key: `${order.id}-meta-${Object.keys(extra).join("-")}`,
    order: {
      location_id: locationId,
      version: order.version,
      metadata: { ...(order.metadata ?? {}), ...extra },
    },
  });
}

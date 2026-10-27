"use client";

import { useMemo, useState } from "react";

type MenuOption = {
  id: string;
  label: string;
  kind: "dinner" | "breakfast";
  persons: number;
  price: number;
};

type Night = {
  date: string;
  room: string;
  guests: number;
  wholeHouse: boolean;
  orderable: boolean;
};

type DinnerPick = { optionId: string; sets: number };

const TIMES = ["18:00", "18:30"];
const RICE = ["Chirashi sushi", "Onigiri"];

function yen(n: number) {
  return "¥" + n.toLocaleString("en-US");
}

function niceDate(d: string) {
  return new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export default function OrderForm() {
  const [booking, setBooking] = useState("");
  const [lastName, setLastName] = useState("");
  const [arrival, setArrival] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [nights, setNights] = useState<Night[] | null>(null);
  const [menu, setMenu] = useState<MenuOption[]>([]);
  const [dinners, setDinners] = useState<Record<string, DinnerPick[]>>({});
  const [breakfasts, setBreakfasts] = useState<Record<string, number>>({});
  const [time, setTime] = useState(TIMES[0]);
  const [rice, setRice] = useState(RICE[0]);

  const dinnerMenu = menu.filter((m) => m.kind === "dinner");
  const breakfast = menu.find((m) => m.kind === "breakfast");

  async function findStay(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/order/stay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lastName, arrival }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setNights(data.nights);
      setMenu(data.menu);
      setDinners({});
      setBreakfasts({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const lines = useMemo(() => {
    const out: { date: string; optionId: string; sets: number }[] = [];
    for (const [date, picks] of Object.entries(dinners)) {
      for (const p of picks) if (p.optionId && p.sets > 0) out.push({ date, ...p });
    }
    if (breakfast) {
      for (const [date, n] of Object.entries(breakfasts)) {
        if (n > 0) out.push({ date, optionId: breakfast.id, sets: n });
      }
    }
    return out;
  }, [dinners, breakfasts, breakfast]);

  const total = lines.reduce((s, l) => s + (menu.find((m) => m.id === l.optionId)?.price ?? 0) * l.sets, 0);
  const hasDinner = lines.some((l) => menu.find((m) => m.id === l.optionId)?.kind === "dinner");

  function setPick(date: string, i: number, patch: Partial<DinnerPick>) {
    setDinners((prev) => {
      const list = [...(prev[date] ?? [])];
      list[i] = { ...(list[i] ?? { optionId: "", sets: 1 }), ...patch };
      return { ...prev, [date]: list };
    });
  }

  function addPick(date: string) {
    setDinners((prev) => ({ ...prev, [date]: [...(prev[date] ?? []), { optionId: "", sets: 1 }] }));
  }

  function removePick(date: string, i: number) {
    setDinners((prev) => ({ ...prev, [date]: (prev[date] ?? []).filter((_, j) => j !== i) }));
  }

  async function pay() {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/order/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking, lastName, arrival, email, time, rice, lines }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  if (!nights) {
    return (
      <form className="order-form" onSubmit={findStay}>
        <label>
          Booking.com reservation number
          <input value={booking} onChange={(e) => setBooking(e.target.value)} inputMode="numeric" required />
        </label>
        <label>
          Last name (as on the booking)
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" required />
        </label>
        <label>
          Check-in date
          <input type="date" value={arrival} onChange={(e) => setArrival(e.target.value)} required />
        </label>
        <label>
          Email for the receipt (optional)
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>
        {error && <p className="order-error">{error}</p>}
        <button className="btn-primary" type="submit" disabled={busy}>
          {busy ? "Checking…" : "Find my stay"}
        </button>
      </form>
    );
  }

  const anyOrderable = nights.some((n) => n.orderable);

  return (
    <div className="order-form">
      {!anyOrderable && (
        <p className="order-error">
          Online orders close 3 days before each night. Please message us on WhatsApp and we&apos;ll see what we can do.
        </p>
      )}

      {nights.map((n) => (
        <fieldset key={n.date} className="order-night" disabled={!n.orderable}>
          <legend>
            {niceDate(n.date)} · {n.wholeHouse ? "Whole house" : n.room}
            {!n.orderable && " — closed"}
          </legend>

          {!n.wholeHouse && (
            <div className="order-block">
              <strong>Dinner</strong> <small>(one set feeds the number of people shown)</small>
              {(dinners[n.date] ?? []).map((p, i) => (
                <div key={i} className="order-row">
                  <select value={p.optionId} onChange={(e) => setPick(n.date, i, { optionId: e.target.value })}>
                    <option value="">Choose a dinner…</option>
                    {dinnerMenu.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label} — {yen(m.price)}
                      </option>
                    ))}
                  </select>
                  <select value={p.sets} onChange={(e) => setPick(n.date, i, { sets: Number(e.target.value) })}>
                    {[1, 2, 3, 4].map((s) => (
                      <option key={s} value={s}>
                        × {s}
                      </option>
                    ))}
                  </select>
                  <button type="button" className="order-link" onClick={() => removePick(n.date, i)}>
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" className="order-link" onClick={() => addPick(n.date)}>
                + Add a dinner
              </button>
            </div>
          )}

          {breakfast && (
            <div className="order-block">
              <strong>Breakfast next morning</strong> <small>({breakfast.label}, {yen(breakfast.price)} per person)</small>
              <div className="order-row">
                <select
                  value={breakfasts[n.date] ?? 0}
                  onChange={(e) => setBreakfasts((prev) => ({ ...prev, [n.date]: Number(e.target.value) }))}
                >
                  {Array.from({ length: Math.max(n.guests, 4) + 1 }, (_, k) => k).map((k) => (
                    <option key={k} value={k}>
                      {k === 0 ? "No breakfast" : `${k} ${k === 1 ? "person" : "people"}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </fieldset>
      ))}

      {hasDinner && (
        <div className="order-block">
          <label>
            Dinner time
            <select value={time} onChange={(e) => setTime(e.target.value)}>
              {TIMES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            Rice with dinner
            <select value={rice} onChange={(e) => setRice(e.target.value)}>
              {RICE.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      <p className="order-total">Total: {yen(total)}</p>
      {error && <p className="order-error">{error}</p>}
      <button className="btn-primary" type="button" onClick={pay} disabled={busy || lines.length === 0}>
        {busy ? "Opening payment…" : "Pay with card (Square)"}
      </button>
      <p>
        <small>
          Payment is handled securely by Square. Allergies or special requests? Tell us on WhatsApp after ordering.
        </small>
      </p>
    </div>
  );
}

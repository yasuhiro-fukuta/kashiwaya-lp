// ほなみや（柏屋の食事）の売値表。料金はここだけで計算する（AIに計算させない）。
//
// 2026-11-22 11:56 社長決定：2026-12-01 0:00（日本時間）以降に受け付けた注文は
// 新料金。それより前に受け付けた注文は旧料金のまま。
// 「受け付けた日時」＝注文ページなら決済リンクを作った時刻（サーバーの現在時刻）。
//
// このファイルは import を持たない純粋な関数だけにしてある（node --test で直接テストするため）。

export type MealKey = "chicken" | "pork" | "porkChilled" | "sukiyaki" | "vegan" | "veganChilled" | "breakfast";

/** 夕食：2名分 base、以降 step 名ごとに +inc（step=2 は偶数名分のみ）。朝食：1人 perPerson。 */
type DinnerRule = { base: number; step: 1 | 2; inc: number };
export type Tariff = {
  id: "2026-11" | "2026-12";
  label: string;
  dinner: Record<Exclude<MealKey, "breakfast">, DinnerRule>;
  breakfastPerPerson: number;
};

/** 新料金が始まる瞬間（2026-12-01 00:00 JST）。 */
export const PRICE_CHANGE_AT = Date.parse("2026-12-01T00:00:00+09:00");
export const PRICE_CHANGE_DATE = "2026-12-01";

export const OLD_TARIFF: Tariff = {
  id: "2026-11",
  label: "旧料金（2026-11-30 23:59 までに受け付けた注文）",
  dinner: {
    chicken: { base: 6000, step: 1, inc: 2000 },
    pork: { base: 8000, step: 1, inc: 3000 },
    porkChilled: { base: 8000, step: 1, inc: 3000 },
    sukiyaki: { base: 10000, step: 2, inc: 8000 }, // 2名10,000・4名18,000・以降2名ごと+8,000
    vegan: { base: 8000, step: 1, inc: 3000 },
    veganChilled: { base: 8000, step: 1, inc: 3000 },
  },
  breakfastPerPerson: 1500,
};

export const NEW_TARIFF: Tariff = {
  id: "2026-12",
  label: "新料金（2026-12-01 0:00 以降に受け付けた注文）",
  dinner: {
    chicken: { base: 7000, step: 1, inc: 3000 },
    pork: { base: 9000, step: 1, inc: 4000 },
    porkChilled: { base: 9000, step: 1, inc: 4000 },
    sukiyaki: { base: 11000, step: 2, inc: 10000 }, // 2名11,000・4名21,000・以降2名ごと+10,000
    vegan: { base: 9000, step: 1, inc: 4000 },
    veganChilled: { base: 9000, step: 1, inc: 4000 },
  },
  breakfastPerPerson: 1500,
};

/** 受け付けた日時 → 料金表。 */
export function tariffAt(at: Date | number): Tariff {
  const t = typeof at === "number" ? at : at.getTime();
  if (!Number.isFinite(t)) throw new Error("tariffAt: invalid date");
  return t >= PRICE_CHANGE_AT ? NEW_TARIFF : OLD_TARIFF;
}

/** メニュー行名・注文確認票の品目 → どの料理か。食事でなければ null。 */
export function mealKeyOf(name: string): MealKey | null {
  const s = String(name ?? "");
  if (/breakfast|ochazuke|朝食|お茶漬/i.test(s)) return "breakfast";
  const vegan = /vegan|ビーガン|ヴィーガン/i.test(s);
  const chilled = /chilled|rei-?shabu|冷しゃぶ|冷製/i.test(s);
  if (vegan) return chilled ? "veganChilled" : "vegan";
  if (/sukiyaki|wagyu|すき焼|牛すき/i.test(s)) return "sukiyaki";
  if (/chicken|鶏鍋/i.test(s)) return "chicken";
  if (chilled) return "porkChilled";
  if (/shabu|pork|豚しゃぶ/i.test(s)) return "pork";
  return null;
}

/**
 * セット（persons 名分）の売値。売っていない人数（すき焼きの奇数名、夕食の1名など）は null。
 * 朝食は persons 人分の合計。
 */
export function setPrice(key: MealKey, persons: number, tariff: Tariff): number | null {
  if (!Number.isInteger(persons) || persons < 1) return null;
  if (key === "breakfast") return tariff.breakfastPerPerson * persons;
  const r = tariff.dinner[key];
  if (persons < 2) return null;
  if ((persons - 2) % r.step !== 0) return null;
  return r.base + ((persons - 2) / r.step) * r.inc;
}

/**
 * 夕食1名分（2026-11-14 社長指示の式：2名分 −（3名分 − 2名分））。
 * すき焼きは「1名あたりの増分」＝ 2名ごとの増分 ÷ 2 で同じ式にする
 * （旧料金で 10,000 − 4,000 = 6,000。従来の計算と一致）。
 */
export function soloDinnerPrice(key: Exclude<MealKey, "breakfast">, tariff: Tariff): number {
  const r = tariff.dinner[key];
  return r.base - r.inc / r.step;
}

/** ある料金表での売値。夕食1名は soloDinnerPrice の式。null＝料金表に無い。 */
export function priceIn(tariff: Tariff, key: MealKey, persons: number): number | null {
  if (key !== "breakfast" && persons === 1) return soloDinnerPrice(key, tariff);
  return setPrice(key, persons, tariff);
}

export type PriceDecision = { price: number | null; candidates?: { old: number; new: number } };

/**
 * 受付日が分からない注文（注文確認票）の売値を、食べる日 servedDate（yyyy-MM-dd）から決める。
 * 夜が 2026-12-01 より前なら注文も必ずそれより前なので旧料金。
 * 12/1以降の夜は、旧・新が同じ金額のときだけ決める。違えば price=null と候補（旧／新）。
 */
export function decideByServedDate(servedDate: string, key: MealKey, persons: number): PriceDecision {
  const oldP = priceIn(OLD_TARIFF, key, persons);
  if (servedDate < PRICE_CHANGE_DATE) return { price: oldP };
  const newP = priceIn(NEW_TARIFF, key, persons);
  if (oldP == null || newP == null) return { price: null };
  if (oldP === newP) return { price: newP };
  return { price: null, candidates: { old: oldP, new: newP } };
}

/** 人に見せる「2名分 / +1名ごと」の表示用の数字。 */
export function priceSummary(tariff: Tariff) {
  const d = tariff.dinner;
  return {
    chicken: { two: d.chicken.base, extra: d.chicken.inc },
    pork: { two: d.pork.base, extra: d.pork.inc },
    porkChilled: { two: d.porkChilled.base, extra: d.porkChilled.inc },
    sukiyaki: { two: d.sukiyaki.base, four: d.sukiyaki.base + d.sukiyaki.inc, extraTwo: d.sukiyaki.inc },
    vegan: { two: d.vegan.base, extra: d.vegan.inc },
    veganChilled: { two: d.veganChilled.base, extra: d.veganChilled.inc },
    breakfast: tariff.breakfastPerPerson,
  };
}

export function yenJp(n: number): string {
  return n.toLocaleString("en-US");
}

// ほなみや値上げ（2026-12-01 0:00 JST）の料金表のテスト。
// 実行: node --experimental-strip-types --test test/
import test from "node:test";
import assert from "node:assert/strict";
import {
  decideByServedDate,
  mealKeyOf,
  NEW_TARIFF,
  OLD_TARIFF,
  PRICE_CHANGE_AT,
  priceIn,
  setPrice,
  tariffAt,
} from "../src/lib/mealPrices.ts";

const JST = (s: string) => Date.parse(s + "+09:00");

test("境目：11/30 23:59:59.999 JST は旧料金、12/1 0:00:00 JST から新料金", () => {
  assert.equal(PRICE_CHANGE_AT, Date.parse("2026-11-30T15:00:00Z"));
  assert.equal(tariffAt(JST("2026-11-30T23:59:59.999")).id, "2026-11");
  assert.equal(tariffAt(JST("2026-12-01T00:00:00")).id, "2026-12");
  assert.equal(tariffAt(JST("2026-12-01T00:00:01")).id, "2026-12");
  assert.equal(tariffAt(JST("2026-11-22T12:00:00")).id, "2026-11");
  assert.equal(tariffAt(new Date("2026-11-30T14:59:59Z")).id, "2026-11"); // UTCで見ても同じ境目
  assert.equal(tariffAt(new Date("2026-11-30T15:00:00Z")).id, "2026-12");
  assert.throws(() => tariffAt(NaN));
});

// 社長が示した新料金（2026-11-22 11:56）をそのまま書いた期待値
const NEW_EXPECT: [string, number, number][] = [
  ["chicken", 2, 7000], ["chicken", 3, 10000], ["chicken", 4, 13000], ["chicken", 6, 19000],
  ["pork", 2, 9000], ["pork", 3, 13000], ["pork", 6, 25000],
  ["porkChilled", 2, 9000], ["porkChilled", 3, 13000],
  ["vegan", 2, 9000], ["vegan", 3, 13000],
  ["veganChilled", 2, 9000], ["veganChilled", 3, 13000],
  ["sukiyaki", 2, 11000], ["sukiyaki", 4, 21000], ["sukiyaki", 6, 31000],
  ["breakfast", 1, 1500], ["breakfast", 3, 4500],
];
// 今の本番（メニューシート・サイト）と同じ旧料金
const OLD_EXPECT: [string, number, number][] = [
  ["chicken", 2, 6000], ["chicken", 3, 8000], ["chicken", 4, 10000],
  ["pork", 2, 8000], ["pork", 3, 11000],
  ["porkChilled", 2, 8000], ["porkChilled", 3, 11000],
  ["vegan", 2, 8000], ["vegan", 3, 11000],
  ["veganChilled", 2, 8000], ["veganChilled", 3, 11000],
  ["sukiyaki", 2, 10000], ["sukiyaki", 4, 18000], ["sukiyaki", 6, 26000],
  ["breakfast", 1, 1500], ["breakfast", 2, 3000],
];

test("新料金の金額", () => {
  for (const [k, n, yen] of NEW_EXPECT) assert.equal(setPrice(k as never, n, NEW_TARIFF), yen, `${k} ${n}名`);
});

test("旧料金の金額（今の本番と同じ）", () => {
  for (const [k, n, yen] of OLD_EXPECT) assert.equal(setPrice(k as never, n, OLD_TARIFF), yen, `${k} ${n}名`);
});

test("境目の前後で同じ注文の金額が切り替わる", () => {
  const before = tariffAt(JST("2026-11-30T23:59:59"));
  const after = tariffAt(JST("2026-12-01T00:00:00"));
  assert.equal(setPrice("chicken", 3, before), 8000);
  assert.equal(setPrice("chicken", 3, after), 10000);
  assert.equal(setPrice("sukiyaki", 4, before), 18000);
  assert.equal(setPrice("sukiyaki", 4, after), 21000);
  assert.equal(setPrice("breakfast", 2, before), 3000);
  assert.equal(setPrice("breakfast", 2, after), 3000);
});

test("売っていない人数は null（すき焼きの奇数名・夕食0/1名・小数）", () => {
  for (const t of [OLD_TARIFF, NEW_TARIFF]) {
    assert.equal(setPrice("sukiyaki", 3, t), null);
    assert.equal(setPrice("sukiyaki", 5, t), null);
    assert.equal(setPrice("chicken", 1, t), null);
    assert.equal(setPrice("chicken", 0, t), null);
    assert.equal(setPrice("chicken", 2.5, t), null);
    assert.equal(setPrice("breakfast", 0, t), null);
  }
});

test("夕食1名（2名分 −（3名分 − 2名分））は従来と同じ式", () => {
  assert.equal(priceIn(OLD_TARIFF, "chicken", 1), 4000);
  assert.equal(priceIn(OLD_TARIFF, "sukiyaki", 1), 6000); // 従来 10,000 − (14,000 − 10,000)
  assert.equal(priceIn(NEW_TARIFF, "chicken", 1), 4000);
  assert.equal(priceIn(NEW_TARIFF, "pork", 1), 5000);
  assert.equal(priceIn(NEW_TARIFF, "sukiyaki", 1), 6000);
});

test("受付日の無い注文（注文確認票）：11/30までの夜は旧、12/1以降で金額が違えば社長に確認", () => {
  assert.deepEqual(decideByServedDate("2026-11-30", "chicken", 2), { price: 6000 });
  assert.deepEqual(decideByServedDate("2026-12-01", "chicken", 2), { price: null, candidates: { old: 6000, new: 7000 } });
  assert.deepEqual(decideByServedDate("2026-12-05", "sukiyaki", 4), { price: null, candidates: { old: 18000, new: 21000 } });
  assert.deepEqual(decideByServedDate("2026-12-05", "breakfast", 2), { price: 3000 }); // 朝食は据え置き
  assert.deepEqual(decideByServedDate("2026-12-05", "sukiyaki", 3), { price: null });
});

test("メニュー行名・注文確認票の品目 → 料理", () => {
  const cases: [string, string][] = [
    ["Dinner - Chicken Hot Pot for 2", "chicken"],
    ["Dinner - Pork Hot Pot (Shabu-shabu) for 3", "pork"],
    ["Dinner - Pork Chilled Pot (Rei-shabu) for 2", "porkChilled"],
    ["Dinner - Wagyu Beef Hot Pot (Sukiyaki) for 4", "sukiyaki"],
    ["Dinner - Vegan Gluten-free Hot Pot for 2", "vegan"],
    ["Dinner - Vegan Gluten-free Chilled Pot for 3", "veganChilled"],
    ["Breakfast - Ochazuke risotto and Miso soup with pickles for 1", "breakfast"],
    ["鶏鍋", "chicken"], ["豚しゃぶ", "pork"], ["冷しゃぶ", "porkChilled"], ["すき焼き", "sukiyaki"],
    ["ビーガン鍋", "vegan"], ["ビーガン冷しゃぶ", "veganChilled"], ["朝食", "breakfast"],
  ];
  for (const [name, key] of cases) assert.equal(mealKeyOf(name), key, name);
  assert.equal(mealKeyOf("Dinner - Pierrot Omurice Course"), null); // 料金表に無い品はシートの価格のまま
});

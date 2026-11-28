// 食事を出せない夜（src/lib/noMealNights.ts）の確認。実行：npx tsx scripts/test-no-meal-nights.ts
import assert from "node:assert/strict";
import { buildNights, priceOrder, type MenuOption } from "../src/lib/mealOrder";

const menu: MenuOption[] = [
  { id: "Dinner - Chicken", label: "Chicken", kind: "dinner", persons: 2, price: 6000, item: "鶏鍋", boardLabel: "Chicken Hot Pot" },
  { id: "Breakfast", label: "Ochazuke", kind: "breakfast", persons: 1, price: 1500, item: "朝食", boardLabel: "Ochazuke Breakfast" },
];
const order = (date: string, optionId: string) => ({ booking: "1", lastName: "Test", arrival: date, lines: [{ date, optionId, sets: 1 }] });
const results: string[] = [];
for (const [date, blocked] of [["2026-12-03", false], ["2026-12-04", true], ["2026-12-05", false], ["2026-12-06", true]] as const) {
  const nights = buildNights(date, 1, "room", 2);
  assert.equal(nights[0].noMeals, blocked, `${date} noMeals`);
  for (const opt of ["Dinner - Chicken", "Breakfast"]) {
    let ok = true;
    try { priceOrder(order(date, opt), nights, menu); } catch { ok = false; }
    assert.equal(ok, !blocked, `${date} ${opt}`);
    results.push(`${date}泊 ${opt.startsWith("Dinner") ? "夕食" : "翌朝の朝食"}: ${ok ? "受付" : "不可"}`);
  }
}
// 12/3から2泊（12/3・12/4）：12/3の分は受付、12/4の分は不可
const two = buildNights("2026-12-03", 2, "room", 2);
assert.deepEqual(two.map((n) => n.noMeals), [false, true]);
results.push("12/3から2泊：12/3は受付・12/4は不可");
console.log(results.join("\n"));
console.log("ALL PASS");

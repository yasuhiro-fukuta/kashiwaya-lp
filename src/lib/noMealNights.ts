// Nights when Kashiwaya cannot serve meals (the caterer, Honamiya, is closed).
// A night here blocks that evening's dinner AND the next morning's breakfast,
// because breakfast is prepared and delivered the evening before.
// The breakfast of the night before (e.g. the morning of 12/4 for a 12/3 stay)
// is NOT blocked — it is delivered on the evening of 12/3.
//
// 日付を足すときは、この一覧に "yyyy-MM-dd": "理由（誰の・いつの連絡か）" を1行足すだけ。
// 過ぎた日付は残しておいてよい（害はない）。
export const NO_MEAL_NIGHTS: Record<string, string> = {
  "2026-12-04": "ほなみや（田中晃さん）休み：2026-11-28 8:14 LINE「12月4日と6日は予定が有り、注文受けられません」",
  "2026-12-06": "ほなみや（田中晃さん）休み：2026-11-28 8:14 LINE「12月4日と6日は予定が有り、注文受けられません」",
};

export function isNoMealNight(date: string): boolean {
  return Object.prototype.hasOwnProperty.call(NO_MEAL_NIGHTS, date);
}

/** Guest-facing message (English + Japanese). Shared by the order page and the server check. */
export const NO_MEAL_MESSAGE_EN =
  "Sorry — we can't serve meals on this night (no dinner, and no breakfast the next morning). Please order delivery from Marusho, a local shop, instead:";
export const NO_MEAL_MESSAGE_JA =
  "この日は食事（夕食・翌朝の朝食）のご用意ができません。配達の「まるしょう」をご利用ください：";

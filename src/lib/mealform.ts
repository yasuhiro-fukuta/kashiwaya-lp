// Fetches the public meal/option order form (Google Forms) and formats its
// questions + choices (menu names carry prices) as a prompt block, so the bot
// can answer meal price questions from the same source guests actually book on.
// The form page embeds its definition as `FB_PUBLIC_LOAD_DATA_`; if Google
// changes that format we fail soft and the bot simply answers without it.

const FORM_URL = process.env.MEAL_FORM_URL ?? "https://forms.gle/KqYFZBWuiVnAshAF9";

export type MealFormData = {
  formTitle: string;
  questions: { title: string; description: string; choices: string[] }[];
};

export async function fetchMealForm(): Promise<MealFormData | null> {
  try {
    const res = await fetch(FORM_URL, {
      next: { revalidate: 3600 },
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (kashiwaya-chatbot)" },
    });
    if (!res.ok) throw new Error(`form fetch ${res.status}`);
    const html = await res.text();

    const m = html.match(/FB_PUBLIC_LOAD_DATA_\s*=\s*(\[[\s\S]*?\])\s*;\s*<\/script>/);
    if (!m) throw new Error("FB_PUBLIC_LOAD_DATA_ not found");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = JSON.parse(m[1]);

    const formTitle = typeof data?.[1]?.[8] === "string" ? data[1][8] : "";
    const questions: MealFormData["questions"] = [];
    for (const q of data?.[1]?.[1] ?? []) {
      const title = typeof q?.[1] === "string" ? q[1].trim() : "";
      if (!title) continue;
      const description = typeof q?.[2] === "string" ? q[2].trim() : "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const choices = (q?.[4]?.[0]?.[1] ?? [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((c: any) => (typeof c?.[0] === "string" ? c[0].trim() : ""))
        .filter(Boolean);
      questions.push({ title, description, choices });
    }
    if (questions.length === 0) throw new Error("no questions parsed");
    return { formTitle, questions };
  } catch (err) {
    console.error("mealform: fetch/parse failed:", err);
    return null;
  }
}

export async function getMealFormBlock(): Promise<string | null> {
  const data = await fetchMealForm();
  if (!data) return null;

  const lines = data.questions.map((q) => {
    const head = q.description ? `${q.title} — ${q.description}` : q.title;
    return q.choices.length
      ? `■ ${head}\n${q.choices.map((c) => `  - ${c}`).join("\n")}`
      : `■ ${head}`;
  });

  return `# 食事・オプション予約フォームの内容(料金の一次情報)
これは柏屋の食事・オプション予約フォーム${data.formTitle ? `「${data.formTitle}」` : ""}の設問と選択肢である。メニュー名に含まれる金額(¥表記)が正式な料金。

- 食事やオプションの料金を聞かれたら、ここに書かれている金額を正確にそのまま答えること。ここに無い料金は推測しない。
- 食事の予約はこのフォームから: ${FORM_URL}(3日前まで受付)
- 選択肢の英語表記はそのまま使ってよい。

${lines.join("\n")}`;
}

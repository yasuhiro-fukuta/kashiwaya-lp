// Diagnostic: shows whether the meal form was fetched and parsed.
// Returns question titles only (the form is public anyway).
import { fetchMealForm } from "@/lib/mealform";

export const runtime = "nodejs";

export async function GET() {
  const data = await fetchMealForm();
  if (!data) return Response.json({ ok: false, reason: "fetch or parse failed" });
  return Response.json({
    ok: true,
    formTitle: data.formTitle,
    questions: data.questions.length,
    titles: data.questions.map((q) => q.title).slice(0, 20),
    sampleChoices: data.questions.find((q) => q.choices.length)?.choices.slice(0, 5) ?? [],
  });
}

import { KNOWLEDGE_FALLBACK } from "@/data/knowledge-fallback";

// The Nagiso information Google Doc — the single source of truth for the
// chatbot. The owner edits this doc directly; changes reach the bot within
// an hour (see revalidate below) with no redeploy.
const KNOWLEDGE_DOC_ID =
  process.env.KNOWLEDGE_DOC_ID ?? "1Ov1jL1LlsIyxElqkaZFjGjz5tXnu6hPYTlqj0enU1PA";

const EXPORT_URL = `https://docs.google.com/document/d/${KNOWLEDGE_DOC_ID}/export?format=txt`;

export async function getKnowledge(): Promise<string> {
  try {
    const res = await fetch(EXPORT_URL, {
      next: { revalidate: 3600 },
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`doc export returned ${res.status}`);
    const text = (await res.text()).trim();
    // A permissions page or empty doc would be short; the real doc is several KB.
    if (text.length < 500) throw new Error("doc export suspiciously short");
    return text;
  } catch (err) {
    console.error("knowledge: falling back to bundled snapshot:", err);
    return KNOWLEDGE_FALLBACK;
  }
}

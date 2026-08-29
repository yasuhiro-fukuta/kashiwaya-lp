"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GREETING =
  "Hello! I'm an AI trained on everything Yakkun — Kashiwaya's manager — has learned from three years of traveling around Nagiso and a year of living here. Almost anything he knows, I can answer! Ask me anything, in any language.\n\nこんにちは！私は柏屋の支配人『やっくん』が、３年ほど南木曽を旅してきた知識とこちらに移住してきてから１年住んだ知識から学習したAIです。彼の知っている事のほとんどは私も答えられます！";

const QUICK_QUESTIONS = [
  "How do I check out?",
  "Dinner recommendations near Kashiwaya?",
  "How can I use the e-bikes?",
  "Can you pick me up at Nagiso Station?",
  "Recommended hiking routes?",
  "食事の予約方法は？",
];

// Render bare URLs in bot answers as clickable links.
function renderWithLinks(text: string) {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g);
  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer">
        {part.length > 48 ? part.slice(0, 45) + "…" : part}
      </a>
    ) : (
      part
    ),
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    setInput("");
    setBusy(true);

    const history: ChatMessage[] = [...messages, { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-20) }),
      });
      if (!res.ok || !res.body) {
        throw new Error(await res.text().catch(() => `HTTP ${res.status}`));
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        const current = answer;
        setMessages([...history, { role: "assistant", content: current }]);
      }
    } catch (err) {
      console.error(err);
      setMessages([
        ...history,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't answer right now. Please try again in a moment, or reach us on WhatsApp: https://wa.me/819038392354",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="chat">
      <div className="chat-scroll" ref={scrollRef}>
        <div className="chat-msg chat-msg-bot">{renderWithLinks(GREETING)}</div>

        {messages.length === 0 && (
          <div className="chat-chips">
            {QUICK_QUESTIONS.map((q) => (
              <button key={q} className="chat-chip" onClick={() => send(q)}>
                {q}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`chat-msg ${m.role === "user" ? "chat-msg-user" : "chat-msg-bot"}`}
          >
            {m.content === "" && m.role === "assistant" ? (
              <span className="chat-typing">…</span>
            ) : (
              renderWithLinks(m.content)
            )}
          </div>
        ))}
      </div>

      <form
        className="chat-inputrow"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question… / 質問をどうぞ…"
          maxLength={2000}
          aria-label="Your question"
        />
        <button className="chat-send" type="submit" disabled={busy || !input.trim()} aria-label="Send">
          <Send size={16} />
        </button>
      </form>

      <div className="chat-foot">
        AI answers may contain mistakes — for bookings &amp; urgent matters,{" "}
        <a href="https://wa.me/819038392354" target="_blank" rel="noopener noreferrer">
          WhatsApp us
        </a>
        .
      </div>
    </div>
  );
}

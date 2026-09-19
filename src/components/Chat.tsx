"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Paperclip, Send, X } from "lucide-react";

type ChatMessage = { role: "user" | "assistant"; content: string; images?: string[] };

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

const MAX_IMAGES = 3;

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

// Shrink an image client-side so payloads stay small (screenshots of emails
// are often several MB; ~1600px JPEG is plenty for the model to read them).
function downscaleToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 1600;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("canvas unavailable"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => reject(new Error("image load failed"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("file read failed"));
    reader.readAsDataURL(file);
  });
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  function autoGrow() {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  }

  async function addImageFiles(files: Iterable<File>) {
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      if (images.length >= MAX_IMAGES) break;
      try {
        const dataUrl = await downscaleToDataUrl(file);
        setImages((prev) => (prev.length < MAX_IMAGES ? [...prev, dataUrl] : prev));
      } catch (err) {
        console.error("image attach failed:", err);
      }
    }
  }

  function onPaste(e: React.ClipboardEvent) {
    const files: File[] = [];
    for (const item of e.clipboardData.items) {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const f = item.getAsFile();
        if (f) files.push(f);
      }
    }
    if (files.length) {
      e.preventDefault();
      addImageFiles(files);
    }
  }

  async function copyAnswer(text: string, index: number) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex((v) => (v === index ? null : v)), 2000);
  }

  async function send(text: string) {
    const question = text.trim();
    const attached = images;
    if ((!question && attached.length === 0) || busy) return;
    setInput("");
    setImages([]);
    requestAnimationFrame(autoGrow);
    setBusy(true);

    const userMsg: ChatMessage = {
      role: "user",
      content: question || "(See attached image / 画像を確認してください)",
      ...(attached.length ? { images: attached } : {}),
    };
    const history: ChatMessage[] = [...messages, userMsg];
    setMessages([...history, { role: "assistant", content: "" }]);

    try {
      // Only the newest message keeps its images in the payload — older
      // screenshots stay visible in the UI but aren't re-sent every turn.
      const payload = history.slice(-20).map((m, i, arr) =>
        i === arr.length - 1 ? m : { role: m.role, content: m.content },
      );
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
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

  function onInputKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter" || e.shiftKey) return;
    if (e.nativeEvent.isComposing) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
    e.preventDefault();
    send(input);
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
            {m.images && m.images.length > 0 && (
              <div className="chat-msg-imgs">
                {m.images.map((src, j) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={j} src={src} alt="attached" />
                ))}
              </div>
            )}
            {m.content === "" && m.role === "assistant" ? (
              <span className="chat-typing">…</span>
            ) : (
              <>
                {renderWithLinks(m.content)}
                {m.role === "assistant" && !(busy && i === messages.length - 1) && (
                  <button
                    className="chat-copy"
                    onClick={() => copyAnswer(m.content, i)}
                    aria-label="Copy answer"
                    title="Copy"
                  >
                    {copiedIndex === i ? (
                      <>
                        <Check size={13} /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> Copy
                      </>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {images.length > 0 && (
        <div className="chat-previews">
          {images.map((src, i) => (
            <span key={i} className="chat-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`attachment ${i + 1}`} />
              <button
                type="button"
                aria-label="Remove image"
                onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      <form
        className="chat-inputrow"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) addImageFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          className="chat-attach"
          onClick={() => fileRef.current?.click()}
          disabled={busy || images.length >= MAX_IMAGES}
          aria-label="Attach image"
          title="Attach image"
        >
          <Paperclip size={16} />
        </button>
        <textarea
          ref={inputRef}
          className="chat-input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            autoGrow();
          }}
          onKeyDown={onInputKeyDown}
          onPaste={onPaste}
          placeholder="Ask a question… / 質問をどうぞ…"
          maxLength={2000}
          rows={1}
          aria-label="Your question"
        />
        <button className="chat-send" type="submit" disabled={busy || (!input.trim() && images.length === 0)} aria-label="Send">
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

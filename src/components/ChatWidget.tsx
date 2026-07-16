"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import Chat from "./Chat";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="chatw-panel" role="dialog" aria-label="Kashiwaya guest assistant">
          <div className="chatw-head">
            <span>
              Ask <em>Kashiwaya</em>
            </span>
            <button className="chatw-close" onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>
          <Chat />
        </div>
      )}
      <button
        className="chatw-fab"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Chat with us"}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  );
}

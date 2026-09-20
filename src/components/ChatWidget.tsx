"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import Chat from "./Chat";
import AvatarLightbox from "./AvatarLightbox";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [avatarZoom, setAvatarZoom] = useState(false);

  return (
    <>
      {open && (
        <div className="chatw-panel" role="dialog" aria-label="Kashiwaya guest assistant">
          <div className="chatw-head">
            <span className="chatw-title">
              <button
                type="button"
                className="chat-avatar-btn"
                onClick={() => setAvatarZoom(true)}
                aria-label="座敷童の画像を拡大 / Enlarge image"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="chatw-avatar" src="/zashikiwarashi.png" alt="" />
              </button>
              柏屋の<em>座敷童</em>
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
      {avatarZoom && (
        <AvatarLightbox src="/zashikiwarashi.png" onClose={() => setAvatarZoom(false)} />
      )}
    </>
  );
}

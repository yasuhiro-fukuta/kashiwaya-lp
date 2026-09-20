"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

// Full-screen enlarged view of the zashiki-warashi avatar.
// Closes on backdrop click, the × button, or Esc.
export default function AvatarLightbox({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="chat-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="柏屋の座敷童"
      onClick={onClose}
    >
      <button className="chat-lightbox-close" aria-label="Close" onClick={onClose}>
        <X size={22} />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="柏屋の座敷童" onClick={(e) => e.stopPropagation()} />
      <div className="chat-lightbox-caption">柏屋の座敷童 · Zashiki-warashi</div>
    </div>
  );
}

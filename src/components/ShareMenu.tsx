"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Facebook,
  Instagram,
  Link2,
  Mail,
  MessageCircle,
  Share2,
  Twitter,
} from "lucide-react";

/** ナビ右上のシェアボタン。Instagramにはウェブ共有URLが無いため、
 *  端末の共有シート(navigator.share、Instagram含む)+リンクコピーで対応。 */
export default function ShareMenu({ lang }: { lang: "en" | "ja" }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNative, setCanNative] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCanNative(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  const pageUrl = () =>
    typeof window !== "undefined" ? window.location.href : "https://kashiwaya-inn.com/";
  const pageTitle = () =>
    typeof document !== "undefined" ? document.title : "Kashiwaya Inn";

  const nativeShare = async () => {
    try {
      await navigator.share({ title: pageTitle(), url: pageUrl() });
    } catch {
      /* ユーザーがキャンセルした場合は何もしない */
    }
    setOpen(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl());
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1200);
    } catch {
      /* クリップボード不可の環境では無視 */
    }
  };

  const enc = encodeURIComponent;
  const whatsapp = () =>
    `https://wa.me/?text=${enc(pageTitle() + " " + pageUrl())}`;
  const email = () =>
    `mailto:?subject=${enc(pageTitle())}&body=${enc(pageUrl())}`;
  const facebook = () =>
    `https://www.facebook.com/sharer/sharer.php?u=${enc(pageUrl())}`;
  const x = () =>
    `https://twitter.com/intent/tweet?text=${enc(pageTitle())}&url=${enc(pageUrl())}`;

  const L = (en: string, ja: string) => (lang === "ja" ? ja : en);

  return (
    <div className="share-wrap" ref={wrapRef}>
      <button
        type="button"
        className="menu-btn share-btn"
        aria-label={L("Share this page", "このページをシェア")}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Share2 size={19} />
      </button>
      {open && (
        <div className="share-menu" role="menu">
          {canNative && (
            <button type="button" onClick={nativeShare} role="menuitem">
              <Instagram size={16} />
              {L("Instagram & more…", "Instagramほか…")}
            </button>
          )}
          <a
            href={whatsapp()}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
          <a href={email()} role="menuitem" onClick={() => setOpen(false)}>
            <Mail size={16} />
            {L("Email", "メール")}
          </a>
          <a
            href={facebook()}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <Facebook size={16} />
            Facebook
          </a>
          <a
            href={x()}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <Twitter size={16} />
            X
          </a>
          <button type="button" onClick={copyLink} role="menuitem">
            {copied ? <Check size={16} /> : <Link2 size={16} />}
            {copied
              ? L("Copied!", "コピーしました")
              : L("Copy link", "リンクをコピー")}
          </button>
        </div>
      )}
    </div>
  );
}

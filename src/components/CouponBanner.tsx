"use client";

import { useState } from "react";
import { Check, Copy, TicketPercent } from "lucide-react";

const CODE = "KISO15";

export default function CouponBanner({ lang }: { lang: "en" | "ja" }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* クリップボード不可の環境ではコード表示のみで足りる */
    }
  };

  return (
    <div className="coupon-banner">
      <div className="coupon-text">
        <TicketPercent size={20} className="coupon-icon" />
        {lang === "ja" ? (
          <p>
            <strong>直接予約特典:</strong> クーポンコード
            <span className="coupon-code">{CODE}</span>で<strong>15%オフ</strong>。
            予約時にコード入力欄でご利用ください。
          </p>
        ) : (
          <p>
            <strong>Direct-booking bonus:</strong> 15% off with coupon code
            <span className="coupon-code">{CODE}</span> — enter it when you
            book your room below.
          </p>
        )}
      </div>
      <button type="button" className="coupon-copy" onClick={copy}>
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? (lang === "ja" ? "コピーしました" : "Copied!") : lang === "ja" ? "コードをコピー" : "Copy code"}
      </button>
    </div>
  );
}

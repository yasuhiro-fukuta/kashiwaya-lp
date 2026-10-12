"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import ShareMenu from "@/components/ShareMenu";
import {
  EBIKE_LP_URL,
  GOOGLE_MAP_URL,
  INSTAGRAM_URL,
  RECRUIT_URL,
  WHATSAPP_URL_EN,
  WHATSAPP_URL_JA,
} from "@/lib/site";

type Lang = "en" | "ja";

/** 現在のパスから EN⇄JA の切替先を作る。 */
function langTargets(pathname: string): { en: string; ja: string } {
  if (pathname === "/ja" || pathname.startsWith("/ja/")) {
    return { en: pathname.replace(/^\/ja/, "") || "/", ja: pathname };
  }
  // /guide/* は英語のみ → 日本語側はトップへ
  if (pathname.startsWith("/guide/")) return { en: pathname, ja: "/ja" };
  return { en: pathname, ja: pathname === "/" ? "/ja" : `/ja${pathname}` };
}

/** 固定ナビ。solid=true のページ(ヒーローなし)では常に不透明スタイル。 */
export function SiteNav({ lang, solid = false }: { lang: Lang; solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() ?? "/";
  const t = langTargets(pathname);

  useEffect(() => {
    if (solid) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [solid]);

  const isJa = lang === "ja";
  return (
    <nav className={`nav ${solid || scrolled ? "scrolled" : ""}`}>
      <Link href={isJa ? "/ja" : "/"} className="brand">
        {isJa ? (
          <>
            柏屋 <em>Kashiwaya</em>
          </>
        ) : (
          <>
            Kashiwaya <em>Inn</em>
          </>
        )}
      </Link>
      <div className="nav-right">
        <div className="nav-lang">
          <Link href={t.en} className={isJa ? "" : "on"}>
            EN
          </Link>
          <span>/</span>
          <Link href={t.ja} className={isJa ? "on" : ""}>
            日本語
          </Link>
        </div>
        <Link href={isJa ? "/ja/stay#book" : "/stay#book"} className="nav-book">
          {isJa ? "予約する" : "Book"} <ArrowRight size={14} />
        </Link>
        <ShareMenu lang={lang} />
      </div>
    </nav>
  );
}

/** 共通フッター。サイト内の主要導線はここに集約する。 */
export function SiteFooter({ lang }: { lang: Lang }) {
  const isJa = lang === "ja";
  const p = (path: string) => (isJa ? `/ja${path}` : path);
  const whatsapp = isJa ? WHATSAPP_URL_JA : WHATSAPP_URL_EN;
  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <div>
          <div className="ft-brand">{isJa ? "柏屋 Kashiwaya Inn" : "Kashiwaya Inn"}</div>
          <p>
            {isJa
              ? "中山道41番目の宿場・三留野宿に建つ築140年の古民家。長野県木曽郡南木曽町 3993。"
              : "A 140-year-old kominka in Midono-juku, the 41st post town on the Nakasendo. Nagiso 3993, Kiso, Nagano."}
          </p>
          <p>
            {isJa
              ? "JR中央本線・南木曽駅から徒歩15分。"
              : "15 minutes' walk from Nagiso Station (JR Chuo line)."}
          </p>
        </div>
        <div>
          <h5>{isJa ? "ページ" : "Pages"}</h5>
          <Link href={p("/stay")}>{isJa ? "泊まる" : "Stay"}</Link>
          <Link href={p("/dining")}>{isJa ? "食べる" : "Dining"}</Link>
          <Link href={p("/explore")}>{isJa ? "周辺を楽しむ" : "Explore"}</Link>
          <Link href={p("/faq")}>
            {isJa ? "よくある質問・アクセス" : "FAQ, facilities & access"}
          </Link>
          <a href={EBIKE_LP_URL} target="_blank" rel="noopener noreferrer">
            Beyond Nakasendo Cycling →
          </a>
        </div>
        <div>
          <h5>{isJa ? "予約・お問い合わせ" : "Book & ask"}</h5>
          <Link href={p("/stay#book")}>
            {isJa ? "空室確認・宿泊予約" : "Check availability & book"}
          </Link>
          <a href={whatsapp} target="_blank" rel="noopener noreferrer">
            WhatsApp · +81 90-3839-2354
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href={GOOGLE_MAP_URL} target="_blank" rel="noopener noreferrer">
            {isJa ? "Google マップ" : "Google Maps"}
          </a>
          <a href={RECRUIT_URL}>
            {isJa ? "求人 — 谷で働く(準備中)" : "Work with us (coming soon)"}
          </a>
        </div>
      </div>
      <div className="ft-bottom">
        {isJa
          ? "© 柏屋 Kashiwaya Inn · 三留野宿 · 南木曽 · 木曽路"
          : "© Kashiwaya Inn · Midono-juku, Nagiso, Kiso Valley."}
      </div>
    </footer>
  );
}

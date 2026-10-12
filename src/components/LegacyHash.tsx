"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** 旧1ページ構成時代のアンカー(#book 等)付きリンクを新ページへ転送する。
 *  トップ(/, /ja)にだけ置く。 */
const MAP: Record<string, string> = {
  book: "/stay#book",
  honest: "/stay#honest",
  gallery: "/stay#gallery",
  house: "/stay#house",
  people: "/stay#people",
  food: "/dining",
  marusho: "/dining#marusho",
  concept: "",
  facilities: "/faq#facilities",
  access: "/faq#access",
  faq: "/faq",
};

export default function LegacyHash({ lang }: { lang: "en" | "ja" }) {
  const router = useRouter();
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash || !(hash in MAP)) return;
    const target = MAP[hash];
    if (!target) return; // トップ内に残る旧アンカーは何もしない
    router.replace(lang === "ja" ? `/ja${target}` : target);
  }, [router, lang]);
  return null;
}

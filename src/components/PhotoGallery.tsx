"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Cat = "1f" | "2f" | "common";

const PHOTOS: { file: string; cat: Cat; en: string; ja: string }[] = [
  { file: "common-exterior.jpg", cat: "common", en: "The house from the street", ja: "外観" },
  { file: "common-engawa-v.jpg", cat: "common", en: "Engawa veranda", ja: "縁側" },
  { file: "common-garden.jpg", cat: "common", en: "Garden", ja: "庭" },
  { file: "common-hallway-v.jpg", cat: "common", en: "Hallway", ja: "廊下" },
  { file: "common-stairs.jpg", cat: "common", en: "Stairs to the 2nd floor", ja: "階段" },
  { file: "common-kitchen.jpg", cat: "common", en: "Shared kitchen", ja: "共用キッチン" },
  { file: "common-kitchen-v.jpg", cat: "common", en: "Shared kitchen", ja: "共用キッチン" },
  { file: "common-sink-v.jpg", cat: "common", en: "Shared sink", ja: "洗面" },
  { file: "common-shower-v.jpg", cat: "common", en: "Shower room", ja: "シャワールーム" },
  { file: "common-notebook-v.jpg", cat: "common", en: "Guest notebook", ja: "ゲストノート" },
  { file: "common-lamp.jpg", cat: "common", en: "Lamp detail", ja: "電球" },
  { file: "1f-chess-room.jpg", cat: "1f", en: "Chess room", ja: "チェスの部屋" },
  { file: "1f-bedroom.jpg", cat: "1f", en: "Bedroom", ja: "寝室" },
  { file: "1f-dining.jpg", cat: "1f", en: "Dining room", ja: "ダイニング" },
  { file: "1f-wood-room.jpg", cat: "1f", en: "Wood-floored room", ja: "板張りの間" },
  { file: "1f-inner-room-v.jpg", cat: "1f", en: "Inner room", ja: "最奥の間" },
  { file: "1f-toilet.jpg", cat: "1f", en: "Private toilet", ja: "トイレ" },
  { file: "1f-incense.jpg", cat: "1f", en: "Mosquito-coil incense", ja: "蚊取り線香" },
  { file: "1f-lamp-v.jpg", cat: "1f", en: "Lamp detail", ja: "電球" },
  { file: "2f-bedroom-v.jpg", cat: "2f", en: "Bedroom", ja: "寝室" },
  { file: "2f-dining.jpg", cat: "2f", en: "Dining", ja: "ダイニング" },
  { file: "2f-sofa.jpg", cat: "2f", en: "Sofa corner", ja: "ソファ" },
  { file: "2f-hanger-v.jpg", cat: "2f", en: "Wardrobe corner", ja: "ハンガー" },
  { file: "2f-toilet.jpg", cat: "2f", en: "Private toilet (on the 1st floor)", ja: "専用トイレ(1階)" },
];

const CATS = [
  { key: "all", en: "All", ja: "すべて" },
  { key: "1f", en: "1st floor", ja: "一階" },
  { key: "2f", en: "2nd floor", ja: "二階" },
  { key: "common", en: "Shared spaces", ja: "共用" },
] as const;

export default function PhotoGallery({ lang }: { lang: "en" | "ja" }) {
  const [cat, setCat] = useState<string>("all");
  const [idx, setIdx] = useState<number | null>(null);

  const list = PHOTOS.filter((p) => cat === "all" || p.cat === cat);
  const label = (p: (typeof PHOTOS)[number]) => (lang === "ja" ? p.ja : p.en);

  const close = useCallback(() => setIdx(null), []);
  const step = useCallback(
    (d: number) =>
      setIdx((i) => (i === null ? null : (i + d + list.length) % list.length)),
    [list.length]
  );

  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, close, step]);

  return (
    <>
      <div className="gallery-tabs">
        {CATS.map((c) => (
          <button
            key={c.key}
            type="button"
            className={cat === c.key ? "active" : ""}
            onClick={() => {
              setCat(c.key);
              setIdx(null);
            }}
          >
            {lang === "ja" ? c.ja : c.en}
          </button>
        ))}
      </div>
      <div className="gallery-grid">
        {list.map((p, i) => (
          <button
            key={p.file}
            type="button"
            className="gallery-thumb"
            onClick={() => setIdx(i)}
            aria-label={label(p)}
          >
            <img
              src={`/gallery/tour/thumbs/${p.file}`}
              alt={label(p)}
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>
      {idx !== null && list[idx] && (
        <div className="lightbox" role="dialog" aria-modal="true">
          <button
            type="button"
            className="lb-close"
            onClick={close}
            aria-label={lang === "ja" ? "閉じる" : "Close"}
          >
            <X size={26} />
          </button>
          <button
            type="button"
            className="lb-nav lb-prev"
            onClick={() => step(-1)}
            aria-label={lang === "ja" ? "前へ" : "Previous"}
          >
            <ChevronLeft size={28} />
          </button>
          <img
            className="lb-img"
            src={`/gallery/tour/${list[idx].file}`}
            alt={label(list[idx])}
          />
          <button
            type="button"
            className="lb-nav lb-next"
            onClick={() => step(1)}
            aria-label={lang === "ja" ? "次へ" : "Next"}
          >
            <ChevronRight size={28} />
          </button>
          <div className="lb-caption">
            {label(list[idx])} · {idx + 1} / {list.length}
          </div>
          <div className="lb-strip">
            {list.map((p, i) => (
              <button
                key={p.file}
                type="button"
                className={i === idx ? "active" : ""}
                onClick={() => setIdx(i)}
                aria-label={label(p)}
              >
                <img src={`/gallery/tour/thumbs/${p.file}`} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ChatWidget from "@/components/ChatWidget";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { EBIKE_LP_URL, WHATSAPP_URL_JA } from "@/lib/site";

export const metadata: Metadata = {
  title: "周辺を楽しむ — 妻籠・馬籠・木曽谷",
  description:
    "妻籠・馬籠の中山道ウォーク、エメラルドの渓谷、マスターと走るE-bike — すべて柏屋の玄関先から。",
  alternates: {
    canonical: "/ja/explore",
    languages: { en: "/explore", ja: "/ja/explore", "x-default": "/explore" },
  },
};

const GORGE_IMG = "/gallery/kakizore.JPG";

const GUIDES = [
  {
    href: "/guide/tsumago-magome-day-walk",
    img: "/gallery/tour/common-engawa-v.jpg",
    title: "妻籠・馬籠 日帰りウォーク(英語)",
    body: "馬籠峠を越える中山道の定番ウォークを、柏屋から荷物なしで歩く方法。",
  },
  {
    href: "/guide/rainy-day-in-kiso",
    img: "/gallery/tour/1f-incense.jpg",
    title: "雨の日の木曽(英語)",
    body: "谷が霧に包まれた日の過ごし方 — 美術館、温泉、古民家の静かな楽しみ。",
  },
  {
    href: "/guide/kiso-valley-ebike-day",
    img: "/gallery/kakizore.JPG",
    title: "渓谷と川をE-bikeで(英語)",
    body: "柿其グリーンと阿寺ブルー — 地元の人だけが知るエメラルドの渓谷へ。",
  },
] as const;

export default function ExplorePage() {
  return (
    <>
      <SiteNav lang="ja" solid />

      <div className="page-head">
        <div className="section-head">
          <span className="eyebrow-dark">周辺を楽しむ</span>
          <h2>
            玄関先から、<em>木曽の谷へ。</em>
          </h2>
          <p>
            柏屋は妻籠宿(4km)と馬籠宿(13km)の間、阿寺渓谷・柿其渓谷へも
            約10km。朝は旧街道を歩き、昼は渓谷で泳ぎ、夜は囲炉裏端の
            夕食に戻ってくる — そんな一日が組める場所です。
          </p>
        </div>
      </div>

      {/* ============ GUIDES ============ */}
      <section className="entries">
        <div className="section-head">
          <span className="eyebrow-dark">ガイド</span>
          <h2>
            谷への<em>3つの入り方。</em>
          </h2>
        </div>
        <div className="entry-grid">
          {GUIDES.map((g) => (
            <Link key={g.href} href={g.href} className="entry-card">
              <div className="entry-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.img} alt={g.title} loading="lazy" decoding="async" />
              </div>
              <div className="entry-body">
                <h3>{g.title}</h3>
                <p>{g.body}</p>
                <span className="entry-more">
                  読む <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ ACTIVITIES CTA → ebike LP ============ */}
      <section className="activities-cta full">
        <div className="activities-cta-inner">
          <div className="activities-cta-text">
            <span className="eyebrow-light">ツアー・E-bike・荷物運び</span>
            <h3>
              <em>冒険</em>の準備はできましたか?
            </h3>
            <p>
              マスターはBeyond Nakasendo Cyclingとして、ガイド付きE-bike
              ツアー、セルフガイドのレンタル、そして手ぶらで歩ける
              荷物シャトルも運営しています。ルート・料金・予約は
              下のサイトでどうぞ。
            </p>
            <a href={EBIKE_LP_URL} target="_blank" rel="noopener noreferrer" className="cta-btn">
              Beyond Nakasendo Cycling を見る <ArrowRight size={16} />
            </a>
          </div>
          <div className="activities-cta-visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GORGE_IMG} alt="大通りから外れた木曽の谷" loading="lazy" decoding="async" />
          </div>
        </div>
      </section>

      <section className="entries" style={{ paddingTop: 0 }}>
        <p className="entries-foot">
          日程に合う過ごし方に迷ったら{" "}
          <a href={WHATSAPP_URL_JA} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>{" "}
          でご相談ください。実用的な情報は{" "}
          <Link href="/ja/faq">よくある質問・アクセス</Link> へ。
        </p>
      </section>

      <SiteFooter lang="ja" />
      <ChatWidget />
    </>
  );
}

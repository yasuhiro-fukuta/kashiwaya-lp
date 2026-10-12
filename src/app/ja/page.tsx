import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import ChatWidget from "@/components/ChatWidget";
import LegacyHash from "@/components/LegacyHash";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { GOOGLE_MAP_URL, WHATSAPP_URL_JA } from "@/lib/site";

/** 日本語トップ。構成は英語版(/)と同一。 */
const HERO_IMG = "/gallery/entrance.JPG";

const ENTRIES = [
  {
    href: "/ja/stay",
    img: "/gallery/1fchess.jpg",
    title: "泊まる",
    body: "客室は2部屋、1フロア1組の貸切感 — 日によっては一棟貸しも。直接予約はコードKISO15で15%オフ。",
    more: "客室・ご予約",
  },
  {
    href: "/ja/dining",
    img: "/gallery/somen.jpg",
    title: "食べる",
    body: "近所のシェフが仕込む鍋の夕食と、お茶漬けの朝食。柏屋のためだけに醸されたクラフトビールと共に。",
    more: "メニュー・ご注文方法",
  },
  {
    href: "/ja/explore",
    img: "/gallery/kakizore.JPG",
    title: "周辺を楽しむ",
    body: "妻籠・馬籠、エメラルドの渓谷、マスターと走るE-bike — すべて玄関先から。",
    more: "周辺ガイド",
  },
] as const;

const TOP_GALLERY = [
  "/gallery/tour/common-engawa-v.jpg",
  "/gallery/tour/1f-dining.jpg",
  "/gallery/tour/common-garden.jpg",
  "/gallery/tour/1f-lamp-v.jpg",
] as const;

export default function Page() {
  return (
    <>
      <LegacyHash lang="ja" />
      <SiteNav lang="ja" />

      {/* ============ HERO ============ */}
      <header className="hero" id="top">
        <div
          className="hero-bg"
          style={{ backgroundImage: `url('${HERO_IMG}')` }}
        />
        <div className="hero-inner">
          <span className="eyebrow">長野 · 木曽路 · 三留野宿</span>
          <h1>
            地元に潜る、<em>ふたりの時間。</em>
          </h1>
          <p className="hero-lede">
            中山道の静かな宿場に建つ、築140年・本陣造りの古民家。
            1フロアを — 日によっては一棟まるごと — ふたりで貸切に。
            囲炉裏端の夕食、この家のためだけのビール、
            誰も起きていない朝の旧街道。
          </p>
          <div className="hero-ctas">
            <Link href="/ja/stay" className="btn-primary">
              宿泊を予約 <ArrowRight size={16} />
            </Link>
            <a
              href={WHATSAPP_URL_JA}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <MessageCircle size={15} /> WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* ============ MARQUEE ============ */}
      <div className="marquee">
        <div className="marquee-inner">
          <span>
            武家のための造り &nbsp;·&nbsp; 1885年 &nbsp;·&nbsp; 中山道41番目の宿場
            三留野宿 &nbsp;·&nbsp; 今も暮らしの続く古民家 &nbsp;·&nbsp;
            地元に潜る &nbsp;·&nbsp;
          </span>
          <span aria-hidden="true">
            武家のための造り &nbsp;·&nbsp; 1885年 &nbsp;·&nbsp; 中山道41番目の宿場
            三留野宿 &nbsp;·&nbsp; 今も暮らしの続く古民家 &nbsp;·&nbsp;
            地元に潜る &nbsp;·&nbsp;
          </span>
        </div>
      </div>

      {/* ============ CONCEPT (short) ============ */}
      <section id="concept">
        <div className="section-head">
          <span className="eyebrow-dark">コンセプト</span>
          <h2>
            ただの宿ではなく、<em>村に入っていくための入口。</em>
          </h2>
          <p>
            多くの旅人は妻籠と馬籠を通り過ぎ、バスが去った後のこの谷を
            知りません。柏屋は「その先」を見たいふたりのための宿です。
            囲炉裏端で鍋を囲む夜、この家限定のクラフトビール、
            そして21時には静けさの戻る、140年ものの旧街道。
          </p>
        </div>
      </section>

      {/* ============ ENTRANCES ============ */}
      <section className="entries">
        <div className="entry-grid">
          {ENTRIES.map((e) => (
            <Link key={e.href} href={e.href} className="entry-card">
              <div className="entry-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.img} alt={e.title} loading="lazy" decoding="async" />
              </div>
              <div className="entry-body">
                <h3>{e.title}</h3>
                <p>{e.body}</p>
                <span className="entry-more">
                  {e.more} <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <p className="entries-foot">
          実用的なご質問は <Link href="/ja/faq">よくある質問・設備・アクセス →</Link>
        </p>
      </section>

      {/* ============ GALLERY STRIP ============ */}
      <section className="gallery">
        <div className="top-gallery">
          {TOP_GALLERY.map((src) => (
            <Link key={src} href="/ja/stay#gallery">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="柏屋の内部" loading="lazy" decoding="async" />
            </Link>
          ))}
        </div>
        <p className="top-access">
          長野県木曽郡南木曽町 3993(三留野宿)— JR南木曽駅から徒歩15分 ·{" "}
          <a href={GOOGLE_MAP_URL} target="_blank" rel="noopener noreferrer">
            地図を開く
          </a>
        </p>
      </section>

      <SiteFooter lang="ja" />
      <ChatWidget />
    </>
  );
}

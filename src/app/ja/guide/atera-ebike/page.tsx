import type { Metadata } from "next";
import Link from "next/link";

/* eslint-disable @next/next/no-img-element */

const WHATSAPP_URL =
  "https://wa.me/819038392354?text=%E9%98%BF%E5%AF%BA%E6%B8%93%E8%B0%B7%E7%94%A8%E3%81%AEE-bike%E3%82%92%E4%BA%88%E7%B4%84%E3%81%97%E3%81%9F%E3%81%84%E3%81%A7%E3%81%99%E3%80%82";
// 公式LINEのURLが決まったらここに入れる(空の間はボタン非表示)
const LINE_URL = "";

export const metadata: Metadata = {
  title: "阿寺渓谷へは、電車&E-bikeがおすすめ!",
  description:
    "奇跡の蒼い川・阿寺渓谷(長野県大桑村)へ、渋滞・駐車場待ちなしで行く方法。野尻駅からE-bikeで坂を楽々登って、阿寺ブルーへダイブ。東京・名古屋からの電車アクセスと予約方法をご紹介します。",
  alternates: { canonical: "/ja/guide/atera-ebike" },
  openGraph: {
    type: "article",
    url: "https://kashiwaya-inn.com/ja/guide/atera-ebike",
    siteName: "Kashiwaya Inn",
    title: "阿寺渓谷へは、電車&E-bikeがおすすめ!",
    description:
      "奇跡の蒼い川・阿寺渓谷へ、渋滞・駐車場待ちなしで。野尻駅からE-bikeで楽々アクセス。",
    locale: "ja_JP",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "阿寺渓谷へは、電車&E-bikeがおすすめ!",
  inLanguage: "ja",
  about: "阿寺渓谷への電車とE-bikeでのアクセス方法",
  author: { "@type": "Organization", name: "Kashiwaya Inn" },
  publisher: { "@type": "Organization", name: "Kashiwaya Inn" },
  mainEntityOfPage: "https://kashiwaya-inn.com/ja/guide/atera-ebike",
};

export default function Page() {
  return (
    <main className="article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/ja" className="article-back">
        ← 柏屋 Kashiwaya Inn
      </Link>
      <span className="article-eyebrow">ガイド · 木曽の渓谷</span>
      <h1>阿寺渓谷へは、電車&E-bikeがおすすめ!</h1>
      <p>
        奇跡の蒼い川、阿寺渓谷。「阿寺ブルー」と呼ばれる透きとおった流れを
        ひと目見ようと、年々訪れる人が増えています。
      </p>

      <div className="photo-ph">[ 写真:夏の渋滞・満車の駐車場 ]</div>

      <p>
        ただ、人気の代償もあります。<strong>夏の週末やお盆は、麓への道が
        渋滞し、駐車場もパンパン</strong>。せっかくの清流の前に、車の列に
        並ぶことになりかねません。
      </p>

      <div className="photo-ph">[ 写真:阿寺渓谷の蒼い流れ ]</div>

      <h2>おすすめは、電車とE-bike!</h2>
      <p>最寄りはJR中央本線・野尻駅。各方面からのアクセスはこちらです。</p>
      <ul>
        <li>
          <strong>東京から</strong> — 新宿から特急で塩尻へ、塩尻から
          各駅停車で野尻まで。
          <br />
          <small>
            ※塩尻では駅舎内で塩尻ワインが楽しめます。乗り換え時間もお楽しみに。
          </small>
        </li>
        <li>
          <strong>大阪・名古屋から</strong> — 名古屋駅から特急しなので
          中津川へ、中津川から各駅停車で野尻駅まで。
        </li>
      </ul>

      <div className="article-note">
        歩くとなかなか大変です — 渓谷内の名所・狸ヶ淵までは、麓の駐車場から
        <strong>登り徒歩30分</strong>。さらに野尻駅から麓までが
        <strong>徒歩40分</strong>。タクシーも、なかなかつかまりません。
      </div>

      <h2>そこでE-bike!</h2>

      <figure className="article-photo">
        <img
          src="/gallery/ebike3.jpg"
          alt="阿寺渓谷行きのE-bike(Votani)"
          loading="lazy"
          decoding="async"
        />
        <figcaption>電動アシストで坂も楽々のE-bike</figcaption>
      </figure>

      <p>野尻駅で受け取って、橋を越え、坂を楽々登り——</p>

      <div className="photo-ph">[ 写真:渓谷への道を走るE-bike ]</div>

      <p>そのまま阿寺渓谷にダイブ!</p>

      <div className="photo-ph">[ 写真:阿寺ブルーを楽しむ ]</div>

      <h2>帰りも、ゆったり</h2>
      <p>泳いだあとは、麓の着替えスペースで着替えて——</p>

      <figure className="article-photo">
        <img
          src="/gallery/ebike4.jpg"
          alt="麓のあてら荘に停めたE-bike"
          loading="lazy"
          decoding="async"
        />
        <figcaption>麓にはあてら荘(日帰り温泉・水曜定休)も</figcaption>
      </figure>

      <p>
        駅近くのおしゃれなカフェで、2時間に1本の電車をゆっくり待ちます。
        この「待ち時間」まで含めて、いい一日になるのが電車旅のいいところ。
      </p>
      <p>
        <strong>
          車や人混みのストレスなしに阿寺渓谷を楽しみたい方、ぜひこちらを
          おすすめします!
        </strong>
      </p>

      <div className="article-note">
        E-bikeは<strong>ご予約制</strong>です。公式LINEまたはWhatsAppから、
        <strong>前日まで</strong>にご予約ください。
      </div>

      <div className="cta-row">
        {LINE_URL && (
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="article-cta"
          >
            公式LINEで予約 →
          </a>
        )}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="article-cta"
        >
          WhatsAppで予約 →
        </a>
        <Link href="/ja#book" className="article-cta">
          柏屋に泊まる →
        </Link>
      </div>
    </main>
  );
}

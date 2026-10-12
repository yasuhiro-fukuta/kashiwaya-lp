import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, UtensilsCrossed, Beer } from "lucide-react";
import ChatWidget from "@/components/ChatWidget";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { MARUSHO_SITE_URL, WHATSAPP_URL_JA } from "@/lib/site";

export const metadata: Metadata = {
  title: "食べる — 夕食・朝食",
  description:
    "近所のシェフが仕込む鍋の夕食とお茶漬けの朝食、柏屋限定のクラフトビール。一棟貸しの日はマルショーの夕食デリバリーを。",
  alternates: {
    canonical: "/ja/dining",
    languages: { en: "/dining", ja: "/ja/dining", "x-default": "/dining" },
  },
};

const FOOD_IMG = "/gallery/somen.jpg";
const DRINK_IMG = "/gallery/beer.jpg";

export default function DiningPage() {
  return (
    <>
      <SiteNav lang="ja" solid />

      <div className="page-head">
        <div className="section-head">
          <span className="eyebrow-dark">食べる</span>
          <h2>
            近所のシェフが仕込む、<em>夕食と朝食。</em>
          </h2>
        </div>
      </div>

      {/* ============ FOOD OPTION ============ */}
      <section className="food-option" id="food">
        <div className="section-head">
          <span className="eyebrow-dark">お食事オプション</span>
          <h2>
            事前予約制、<em>あなたに合わせて。</em>
          </h2>
          <p>
            柏屋のお食事はすべて事前予約制のオプションです。夕食は伝統の鍋、
            朝食はお茶漬け。食事制限にも合わせてお作りします。
            公式サイトからの直接予約なら予約手続きの画面でそのまま追加、
            Booking.com経由の方はWhatsAppでご注文ください。
          </p>
        </div>
        <div className="meal-order">
          <div className="meal-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FOOD_IMG}
              alt="柏屋の夕食 — 冷やしそうめんと季節の一皿"
              loading="lazy"
              decoding="async"
            />
          </div>
          <ul className="food-menu">
            <li>
              <span>鶏鍋の夕食(2名分 / 3名分)</span>
              <span>¥6,000 / ¥8,000</span>
            </li>
            <li>
              <span>豚しゃぶしゃぶの夕食(2名分 / 3名分)</span>
              <span>¥8,000 / ¥11,000</span>
            </li>
            <li>
              <span>豚冷しゃぶの夕食(2名分 / 3名分)</span>
              <span>¥8,000 / ¥11,000</span>
            </li>
            <li>
              <span>和牛すき焼きの夕食(2名分 / 3名分)</span>
              <span>¥10,000 / ¥14,000</span>
            </li>
            <li>
              <span>ビーガン&グルテンフリー鍋の夕食(2名分 / 3名分)</span>
              <span>¥8,000 / ¥11,000</span>
            </li>
            <li>
              <span>ビーガン&グルテンフリー冷製鍋の夕食(2名分 / 3名分)</span>
              <span>¥8,000 / ¥11,000</span>
            </li>
            <li>
              <span>朝食お茶漬けセット(ビーガン&グルテンフリー)</span>
              <span>¥1,500 / 人</span>
            </li>
          </ul>
          <Link href="/ja/stay#book" className="meal-cta">
            宿泊予約へ — お食事は予約時に追加 <ArrowRight size={16} />
          </Link>
          <ul className="meal-note">
            <li>
              <strong>公式サイトからの直接予約の方:</strong>{" "}
              予約手続きの画面でお食事をアドオンとして追加できます
              (各メニュー1滞在につき1回分)。1泊の場合はご連絡不要です。
              連泊の方は、どの日付にどの仕出しがご希望か、WhatsAppで
              ご連絡ください。例: 10月3日〜6日ご宿泊で、3日の夜に
              すき焼き(3名分)・5日の夜に豚しゃぶ(3名分)をご希望なら、
              両方をアドオンして「すき焼きを3日の夜、豚しゃぶを5日の夜に」
              とご連絡を。朝食も同様です。
            </li>
            <li>
              <strong>Booking.com経由の方:</strong>{" "}
              アドオンはご利用いただけないため、
              <a href={WHATSAPP_URL_JA} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              でご注文ください。
            </li>
            <li>
              ご注文は<strong>ご宿泊の3日前まで</strong>。
            </li>
            <li>
              お一人でのご利用は1日1組まで、<strong>2名分の半額</strong>で
              ご案内します — WhatsAppでご相談ください。
            </li>
            <li>キャンセルは4日前まで無料・全額返金。3日前以降は返金不可です。</li>
            <li>
              <strong>荷物の配送</strong>や、チェックイン前後の
              <strong>アクティビティ</strong>もWhatsAppでご相談いただけます。
            </li>
            <li>
              <strong>一棟貸し</strong>の日は柏屋の夕食はご提供できません —
              すぐ下のデリバリーメニューをご覧ください。朝食は通常どおり
              ご注文いただけます。
            </li>
          </ul>
        </div>

        <div className="meal-order" id="marusho">
          <div className="meal-order-head">
            <UtensilsCrossed size={22} className="meal-icon" />
            <h3>一棟貸しの日は — 夕食をデリバリーで</h3>
            <p>
              無人一棟貸しでは柏屋の夕食はご提供できませんが、ご安心を。
              地元の食堂<strong>「マルショー」</strong>が夕食を柏屋まで
              出前してくれます。
            </p>
          </div>
          <a
            href={MARUSHO_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="meal-cta"
          >
            マルショー注文ページを開く <ArrowRight size={16} />
          </a>
          <ul className="meal-note">
            <li>
              注文ページの写真付きメニュー(夕食セット¥1,500〜¥3,500・
              ベジ/ヴィーガン対応、朝食セット¥1,500、ドリンク)から料理と
              数量を選び、日付・配達時間・お名前を入れると、注文メッセージ
              入力済みのWhatsAppが開きます。あとは送信を押すだけ。
            </li>
            <li>
              お支払いはマルショーへの現地払いです(クレジットカード可・
              カード手数料5%)。なるべく事前のご注文をお願いします。
            </li>
            <li>
              柏屋の<strong>朝食お茶漬けセット(お一人¥1,500)</strong>も
              一棟貸しでご注文いただけます — 直接予約なら予約時に
              アドオンで、Booking.com経由ならWhatsAppでどうぞ。
            </li>
          </ul>
        </div>
      </section>

      {/* ============ FOOD CHAPTER ============ */}
      <section className="chapter reverse">
        <div className="chapter-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOOD_IMG} alt="地元の台所、季節の食事" loading="lazy" decoding="async" />
        </div>
        <div className="chapter-text">
          <span className="chapter-num">食</span>
          <h3>
            この谷の家族が<em>ハレの日に食べるもの。</em>
          </h3>
          <p>
            和食レストランのメニューではなく、この谷の家族がお祝いの日に
            食卓に並べる料理を。夕食は伝統の鍋、朝食はお茶漬け。
            静かで、季節に寄り添う、丁寧な食事です。
          </p>
          <p>
            和牛からビーガン、グルテンフリーまで — ご予約時にお知らせいただければ、
            あなたに合わせてお作りします。
          </p>
          <div className="note">
            <UtensilsCrossed
              size={14}
              style={{ display: "inline", verticalAlign: "-2px", marginRight: "0.4rem" }}
            />
            夕食:伝統の鍋 · 朝食:お茶漬け
          </div>
        </div>
      </section>

      {/* ============ DRINK CHAPTER ============ */}
      <section className="chapter">
        <div className="chapter-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={DRINK_IMG} alt="柏屋限定クラフトビール" loading="lazy" decoding="async" />
        </div>
        <div className="chapter-text">
          <span className="chapter-num">酒</span>
          <h3>
            柏屋のためだけに醸された<em>3種のクラフトビール。</em>
          </h3>
          <p>
            オーナー家族の営むブルワリーが、柏屋限定のビールを3種類
            造っています。ここでしか飲めません。あわせて、マスターが
            選んだ地元の日本酒とワインも少しだけ。
          </p>
          <div className="note">
            <Beer
              size={14}
              style={{ display: "inline", verticalAlign: "-2px", marginRight: "0.4rem" }}
            />
            限定クラフトビール3種 · 地元の日本酒とワイン
          </div>
        </div>
      </section>

      <SiteFooter lang="ja" />
      <ChatWidget />
    </>
  );
}

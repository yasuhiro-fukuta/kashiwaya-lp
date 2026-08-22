"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BedDouble,
  Instagram,
  MapPin,
  UtensilsCrossed,
  Beer,
} from "lucide-react";
import Link from "next/link";
import ChatWidget from "@/components/ChatWidget";
import LodgifyBox from "@/components/LodgifyBox";

/** 日本語版LP。構成は英語版(/)と同一。リンク・画像は英語版と共通。 */
const INSTAGRAM_URL = "https://www.instagram.com/kashiwaya_nakasendo";
const GOOGLE_MAP_URL = "https://maps.app.goo.gl/ViXN6oJNxvjQkv2SA?g_st=ac";
const EBIKE_LP_URL = "https://kiso-ebike-lp.vercel.app/";
const WHATSAPP_URL =
  "https://wa.me/819038392354?text=%E6%9F%8F%E5%B1%8B%E3%81%95%E3%82%93%E3%80%81%E5%AE%BF%E6%B3%8A%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6%E8%B3%AA%E5%95%8F%E3%81%8C%E3%81%82%E3%82%8A%E3%81%BE%E3%81%99%E3%80%82";
const MEAL_FORM_URL = "https://forms.gle/7fK7JEcQ9yMG2wFu9";

const HERO_IMG = "/gallery/entrance.JPG";
const HOUSE_IMG = "/gallery/1stfloor.JPG";
const FOOD_IMG = "/gallery/somen.jpg";
const DRINK_IMG = "/gallery/beer.jpg";
const GORGE_IMG = "/gallery/kakizore.JPG";

const PEOPLE = [
  {
    name: "Shu Ichikawa",
    role: "オーナー",
    body: [
      "柏屋を営んできた市川家の4代目。",
      "海外・東京・南木曽を行き来しながら、時代の変化の中でこの家を守り続けてきた。",
    ],
  },
  {
    name: "Kaku Ichikawa",
    role: "クラフトビール開発",
    body: [
      "オーナーの長男。",
      "東京で美容室とブルワリーを営み、柏屋限定のクラフトビール3種を造り上げた。",
    ],
  },
  {
    name: "Hiroshi Kumagai",
    role: "改修者",
    body: [
      "2015年に東京から移住し、南木曽で3軒の古民家を改修。そのうちの1軒が柏屋。",
      "現在は南木曽の象徴的な古民家ゲストハウス「Yui-an」を営む。",
    ],
  },
  {
    name: "Yasuhiro Fukuta",
    role: "マスター",
    body: [
      "現在の柏屋の運営者。",
      "名古屋から南木曽に何度も通ううちに二拠点生活を始め、二足のわらじを履きながらHiroshi Kumagaiに師事。",
      "アメリカ・ウェストバージニアでの1年間の暮らしに感銘を受け、「地元に深く潜る」体験をこの南木曽で形にすることをミッションとしている。",
    ],
  },
] as const;

export default function Page() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ============ NAV ============ */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <a href="#top" className="brand">
          柏屋 <em>Kashiwaya</em>
        </a>
        <div className="nav-links">
          <a href="#book">予約</a>
          <a href="#concept">コンセプト</a>
          <a href="#house">建物</a>
          <a href="#people">人</a>
          <a href="#access">アクセス</a>
          <Link href="/">EN</Link>
        </div>
        <a href="#book" className="nav-book">
          予約する <ArrowRight size={14} />
        </a>
      </nav>

      {/* ============ FLOATING BOOK ============ */}
      <a href="#book" className="float-book">
        <BedDouble size={16} /> 宿泊予約
      </a>

      {/* ============ HERO ============ */}
      <header className="hero" id="top">
        <div
          className="hero-bg"
          style={{ backgroundImage: `url('${HERO_IMG}')` }}
        />
        <div className="hero-inner">
          <span className="eyebrow">長野 · 木曽路 · 三留野宿</span>
          <h1>
            地元に潜り、<em>歴史に加わる。</em>
          </h1>
          <p className="hero-lede">
            中山道41番目の宿場・三留野宿に建つ、築140年の古民家。
            本陣にならった造りのまま、今も人の暮らしが続く家に泊まる。
            何百年も旅人が行き交ってきた街道の上で。
          </p>
          <div className="hero-ctas">
            <a href="#book" className="btn-primary">
              宿泊を予約 <ArrowRight size={16} />
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <Instagram size={15} /> Instagram
            </a>
            <a href={GOOGLE_MAP_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <MapPin size={15} /> アクセス
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

      {/* ============ BOOK DIRECT ============ */}
      <section className="book-direct" id="book">
        <div className="book-direct-inner">
          <span className="eyebrow-dark">直接予約</span>
          <h2>
            仲介なし、<em>私たちから直接。</em>
          </h2>
          <p className="book-direct-lede">
            予約サイトを介さず、最初のメッセージから最後の朝まで、
            私たちが直接おもてなしします。1軒の古民家に客室は2部屋。
            お好みの方をお選びください。
          </p>

          {/* ----- Step 1 · 部屋 ----- */}
          <div className="book-step">
            <span className="step-num">1</span> お部屋の予約
          </div>

          <div className="room-grid">
            <div className="room-card">
              <div className="room-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/gallery/1fchess.jpg"
                  alt="和室 — 歴史ある1階"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="room-body">
                <h3>和室</h3>
                <div className="room-sub">歴史ある1階</div>
                <ul className="room-feats">
                  <li>80㎡ · 歴史ある1階をまるごと貸切</li>
                  <li>畳の和室 · 中庭向き · 布団</li>
                  <li>プライベートトイレ · 洗濯乾燥機 · ボードゲーム</li>
                </ul>
                <LodgifyBox rentalId="793793" language="ja" />
              </div>
            </div>

            <div className="room-card">
              <div className="room-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/gallery/2ndfloor.JPG"
                  alt="スーペリアファミリールーム — モダンな2階"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="room-body">
                <h3>スーペリアファミリールーム</h3>
                <div className="room-sub">モダンな2階</div>
                <ul className="room-feats">
                  <li>60㎡ · 大人3名まで · 布団4組</li>
                  <li>バルコニー・山の眺め · 専用トイレは1階 · 階段のみ</li>
                </ul>
                <LodgifyBox rentalId="793801" language="ja" />
              </div>
            </div>
          </div>

          <p className="meal-lead">
            ご宿泊の方は、下のステップ2からお食事もご予約ください。
            ご注文の際に宿泊予約の確認番号が必要になります。
          </p>

          {/* ----- Step 2 · 食事 ----- */}
          <div className="book-step">
            <span className="step-num">2</span> お食事の予約
          </div>

          <div className="meal-order">
            <div className="meal-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/gallery/somen.jpg"
                alt="柏屋の夕食 — 冷やしそうめんと季節の一皿"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="meal-order-head">
              <UtensilsCrossed size={22} className="meal-icon" />
              <h3>夕食と朝食</h3>
              <p>
                お部屋とお食事は別々のご予約です。お部屋が決まったら、
                こちらからお食事をどうぞ — 夕食は伝統の鍋、朝食はお茶漬け。
                食事制限にも合わせてお作りします。
              </p>
            </div>

            <a
              href={MEAL_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="meal-cta"
            >
              お食事を予約 <ArrowRight size={16} />
            </a>

            <ul className="meal-note">
              <li>
                ご注文は<strong>ご宿泊の3日前まで</strong>にお願いします。
              </li>
              <li>
                宿泊予約と<strong>同じメールアドレス・お名前</strong>でご注文ください。
              </li>
              <li>
                連泊の場合は<strong>1泊ごとに別々のご注文</strong>をお願いします。
              </li>
            </ul>
          </div>

          <p className="book-direct-foot">
            ご質問は{" "}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              WhatsApp →
            </a>{" "}
            へお気軽に。
          </p>
        </div>
      </section>

      {/* ============ CONCEPT ============ */}
      <section id="concept">
        <div className="section-head">
          <span className="eyebrow-dark">コンセプト</span>
          <h2>
            ただの宿ではなく、<em>村に入っていくための入口。</em>
          </h2>
          <p>
            多くの旅人は妻籠と馬籠を通り過ぎ、バスが去った後のこの谷を知りません。
            柏屋は「その先」を見たい人のための宿です。この土地の家族が食べるものを食べ、
            地元の人が飲むものを飲み、140年間この街道を見つめてきた家で眠る。
          </p>
        </div>
      </section>

      {/* ============ HOUSE (chapter 1) ============ */}
      <section className="chapter" id="house">
        <div className="chapter-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HOUSE_IMG} alt="築140年の古民家・柏屋" loading="lazy" decoding="async" />
        </div>
        <div className="chapter-text">
          <span className="chapter-num">第一章 · 建物</span>
          <h3>
            1885年築、<em>本陣にならった造り。</em>
          </h3>
          <p>
            柏屋が建つ三留野宿は、馬籠宿・妻籠宿に続く中山道41番目の宿場。
            江戸と京都を結んだこの街道で、武家の旅人が泊まった本陣と
            同じ形式で建てられた家です。
          </p>
          <p>
            度重なる大火で古い家々の多くは失われましたが、
            今も暮らしの続く古民家がわずかに残っています。柏屋はその一つ。
            南木曽駅から歩いて15分です。
          </p>
          <div className="note">
            三留野宿 · Midono-juku · 中山道41番目の宿場
          </div>
        </div>
      </section>

      {/* ============ FOOD (chapter 2) ============ */}
      <section className="chapter reverse">
        <div className="chapter-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOOD_IMG} alt="地元の台所、季節の食事" loading="lazy" decoding="async" />
        </div>
        <div className="chapter-text">
          <span className="chapter-num">第二章 · 食</span>
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

      {/* ============ DRINK (chapter 3) ============ */}
      <section className="chapter">
        <div className="chapter-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={DRINK_IMG} alt="柏屋限定クラフトビール" loading="lazy" decoding="async" />
        </div>
        <div className="chapter-text">
          <span className="chapter-num">第三章 · 酒</span>
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

      {/* ============ ACTIVITIES CTA → ebike LP ============ */}
      <section className="activities-cta full">
        <div className="activities-cta-inner">
          <div className="activities-cta-text">
            <span className="eyebrow-light">日中の過ごし方</span>
            <h3>
              <em>アクティビティ</em>をお探しですか?
            </h3>
            <p>
              マスターは日中、ガイド付きE-bikeツアーとレンタルも
              運営しています — ここで育った人しか知らないルートへ。
              チェックイン前・チェックアウト後のアクティビティは
              下のサイトからどうぞ。
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

      {/* ============ PEOPLE ============ */}
      <section className="people" id="people">
        <div className="people-inner">
          <div className="section-head">
            <span className="eyebrow-dark">人</span>
            <h2>
              この家を支える<em>手。</em>
            </h2>
            <p>4人の人間が、4世代にわたって、1軒の家に暮らしをつないでいます。</p>
          </div>
          <div className="people-grid">
            {PEOPLE.map((p) => (
              <div key={p.name} className="person">
                <div className="person-role">{p.role}</div>
                <h4>{p.name}</h4>
                {p.body.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ GOOD TO KNOW (facilities & rules) ============ */}
      <section className="facilities" id="facilities">
        <div className="section-head">
          <span className="eyebrow-dark">設備・ご案内</span>
          <h2>
            柏屋の詳細を<em>ひと目で。</em>
          </h2>
        </div>
        <div className="quote-grid">
          <div className="quote-card">
            <blockquote>
              「2階をまるごと貸切で、とても広くて素敵でした。古い家なので
              少し心配していましたが、清潔で、嬉しい驚きでした。」
            </blockquote>
            <cite>Katerina さん · 日本</cite>
          </div>
          <div className="quote-card">
            <blockquote>
              「本物の日本の古民家。部屋から部屋へ歩き、伝統的な引き戸を
              開け、静かな夕食を楽しむ——まるで魔法のようでした。」
            </blockquote>
            <cite>Fabrizio さん · イギリス</cite>
          </div>
        </div>
        <p className="quote-source">Booking.com のクチコミより</p>
        <div className="amenities-grid">
          <div className="amenity-group">
            <h4>客室</h4>
            <ul>
              <li>布団・リネン</li>
              <li>タオル・スリッパ・耳栓・バスアメニティ</li>
              <li>エアコン・暖房</li>
              <li>ドライヤー・扇風機</li>
              <li>ダイニングテーブル・ワイングラス</li>
              <li>枕元コンセント・衣類ラック・物干し</li>
            </ul>
          </div>
          <div className="amenity-group">
            <h4>水回り</h4>
            <ul>
              <li>トイレは各室プライベート</li>
              <li>シャワールームは共用</li>
              <li>洗面・キッチンは共用</li>
              <li>バスタブなし(車で行ける日帰り温泉あり)</li>
            </ul>
          </div>
          <div className="amenity-group">
            <h4>館内</h4>
            <ul>
              <li>無料Wi-Fi</li>
              <li>1フロア1組 — 全2室の貸切感</li>
              <li>洗濯乾燥機(1階客室)</li>
              <li>ボードゲーム・パズル</li>
              <li>荷物預かり</li>
              <li>各室に火災警報器・消火器</li>
              <li>屋内禁煙</li>
            </ul>
          </div>
          <div className="amenity-group">
            <h4>屋外・駐車場</h4>
            <ul>
              <li>無料専用駐車場(要事前予約)</li>
              <li>庭・テラス</li>
              <li>バルコニー・山の眺め(2階)</li>
            </ul>
          </div>
          <div className="amenity-group">
            <h4>アクティビティ・サービス</h4>
            <ul>
              <li>E-bikeレンタル&ガイドツアー(有料)</li>
              <li>宿を出てすぐハイキング・サイクリング</li>
              <li>習字体験(開催日はご相談)</li>
              <li>駅送迎・荷物転送</li>
              <li>英語・日本語対応</li>
            </ul>
          </div>
        </div>
        <div className="rules-card">
          <h4>ハウスルール</h4>
          <ul>
            <li>チェックイン 16:00〜18:00 · チェックアウト 10:00まで</li>
            <li>チェックイン時に写真付き身分証と予約時のクレジットカードをご提示ください</li>
            <li>到着予定時刻を事前にお知らせください(キーボックスによるセルフチェックインも相談可)</li>
            <li>お子様歓迎(年齢制限なし)· ベビーベッドなし・追加布団は数に限りあり</li>
            <li>ペット不可 · パーティー等不可 · 屋内禁煙(中庭は可)</li>
            <li>2階客室へは階段のみ</li>
          </ul>
        </div>
      </section>

      {/* ============ LOCATION ============ */}
      <section className="location" id="access">
        <div className="section-head">
          <span className="eyebrow-dark">アクセス</span>
          <h2>
            旧中山道の、<em>静かな通りに。</em>
          </h2>
          <p>
            長野県木曽郡南木曽町 3993(三留野宿)。
            JR南木曽駅から約1km、徒歩15分です。
          </p>
        </div>
        <div className="map-embed">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6487.241362023977!2d137.6134136005096!3d35.61242230192019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601cc792f7fe924b%3A0xa2f12b3f1d333f0d!2zS2FzaGl3YXlhIElubiBOYWdpc28g5p-P5bGL44Kk44Oz!5e0!3m2!1sja!2sjp!4v1787387096800!5m2!1sja!2sjp"
            title="地図 — 柏屋(南木曽)"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <div className="dist-grid">
          <div className="dist-item">
            <span className="dist-name">JR南木曽駅</span>
            <span className="dist-km">1km · 徒歩15分</span>
          </div>
          <div className="dist-item">
            <span className="dist-name">妻籠宿</span>
            <span className="dist-km">4km</span>
          </div>
          <div className="dist-item">
            <span className="dist-name">馬籠宿</span>
            <span className="dist-km">13km</span>
          </div>
          <div className="dist-item">
            <span className="dist-name">阿寺渓谷・柿其渓谷</span>
            <span className="dist-km">約10km</span>
          </div>
          <div className="dist-item">
            <span className="dist-name">松本空港</span>
            <span className="dist-km">82km</span>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="faq" id="faq">
        <div className="section-head">
          <span className="eyebrow-dark">ご案内</span>
          <h2>
            知っておくと<em>良いこと。</em>
          </h2>
        </div>
        <details className="faq-item">
          <summary>アクセスは?</summary>
          <p>
            JR中央本線・南木曽駅から徒歩15分、三留野宿(南木曽3993)にあります。
            送迎をご希望の場合は事前にお知らせください。
          </p>
        </details>
        <details className="faq-item">
          <summary>チェックイン・チェックアウトの時間は?</summary>
          <p>
            チェックインは16:00〜18:00です。早く着いた場合は荷物を置いて
            散策していただけます(16時以降にハウスツアーとチェックインを行います)。
            遅くなる場合は、到着時にWhatsAppでご連絡ください —
            スタッフはすぐ向かいの家におります。チェックアウトは10:00まで、
            手続きは不要です。
          </p>
        </details>
        <details className="faq-item">
          <summary>駅や妻籠から送迎はありますか?</summary>
          <p>
            はい。南木曽駅・妻籠宿・十二兼駅は、16時から18時の間、
            無料送迎エリアです。事前にご相談ください。
            ご出発時はタクシーの手配をお手伝いします。
          </p>
        </details>
        <details className="faq-item">
          <summary>食事の予約方法は?</summary>
          <p>
            お食事はお部屋とは別のご予約です。予約セクションの
            「お食事を予約」から、宿泊予約と同じメールアドレス・お名前で、
            宿泊日と食事制限を添えてご注文ください。
            ご宿泊の3日前まで受け付けています。
          </p>
        </details>
        <details className="faq-item">
          <summary>食事の料金は?</summary>
          <p>
            夕食セットは2名分で、鶏鍋の6,000円から和牛BBQの10,000円まで
            (しゃぶしゃぶ、和牛すき焼き、ビーガンセットなど)。
            お一人でのご利用は1日1組まで、2名分の半額でご案内します。
            朝食のお茶漬けセット(ビーガン&グルテンフリー)は3,000円です。
          </p>
        </details>
        <details className="faq-item">
          <summary>食事のキャンセルはできますか?</summary>
          <p>
            ご宿泊の4日前までは無料・全額返金です。3日前以降は準備が
            始まっているため返金できません。キャンセルはWhatsAppで
            ご連絡ください。
          </p>
        </details>
        <details className="faq-item">
          <summary>食事制限(ビーガン・グルテンフリーなど)に対応できますか?</summary>
          <p>
            はい。ご予約時またはWhatsAppでお知らせください。
            和牛からビーガン・グルテンフリーまで、あなたに合わせてお作りします。
          </p>
        </details>
        <details className="faq-item">
          <summary>E-bikeをレンタルできますか?</summary>
          <p>
            はい。マスターがBeyond Nakasendo Cyclingとして、ガイド付き
            E-bikeツアーとレンタルを運営しています(10:00 — 15:00、
            1台4,000円/日)。同サイトからご予約ください。
          </p>
        </details>
        <details className="faq-item">
          <summary>Wi-Fiはありますか?</summary>
          <p>あります。館内で無料でお使いいただけます。</p>
        </details>
        <details className="faq-item">
          <summary>現金は必要ですか?</summary>
          <p>
            柏屋でのお支払い(食事・ドリンク)はカードもご利用いただけますが、
            周辺の飲食店の多くと、バス・電車はすべて現金のみです。
            千円札より大きいお札は使えないため、千円札のご用意をおすすめします。
            最寄りのATMは徒歩20分ほどのセブンイレブンにあります。
          </p>
        </details>
        <details className="faq-item">
          <summary>水回りは共用ですか?お風呂はありますか?</summary>
          <p>
            シャワー・シンク・キッチンは共用、トイレは各室プライベートです
            (2階のお客様専用トイレは1階にあります)。バスタブはありませんが、
            車で少し行ったところに天然の日帰り温泉があります。
            タクシー手配のほか、手が空いていれば送迎も可能です。
          </p>
        </details>
        <details className="faq-item">
          <summary>洗濯はできますか?</summary>
          <p>
            1階のお客様は洗濯乾燥機をご利用いただけます。
            徒歩15分のところにコインランドリーもあります。
          </p>
        </details>
        <details className="faq-item">
          <summary>荷物を次の宿泊地へ送れますか?</summary>
          <p>
            馬籠〜妻籠間は予約不要の荷物シャトルがあります。
            南木曽駅〜野尻駅間は当宿が運営していますので、お気軽にどうぞ。
            木曽エリア全域(松本〜中津川)は、NLTS・Walk Liteの
            荷物配送サービス(要予約)がご利用いただけます。
          </p>
        </details>
        <details className="faq-item">
          <summary>熊は出ますか?</summary>
          <p>
            この山域にはツキノワグマが生息していますが、馬籠峠は
            トレイル上に固定の鐘が設置されており、ここ10年ほど目撃されていません。
            熊は人を恐れ、たいてい先に逃げていきます。ご心配な方には
            熊鈴・熊スプレーのレンタルもあります。
          </p>
        </details>
        <details className="faq-item">
          <summary>馬籠峠の難易度は?</summary>
          <p>
            やさしいコースです。スニーカーで十分ですが、サンダルはおすすめしません。
            冬は凍結対策として外付けスパイクを推奨します(レンタルあり)。
          </p>
        </details>
        <details className="faq-item">
          <summary>ハウスルールは?(喫煙・ペット・静粛時間)</summary>
          <p>
            ペットはご遠慮ください。木造建築のため屋内は禁煙です(中庭は可)。
            写真・動画の撮影は大歓迎です。近隣の方は朝が早いので、
            21時以降はお静かにお願いします。
          </p>
        </details>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div>
            <div className="ft-brand">柏屋 Kashiwaya Inn</div>
            <p>
              中山道41番目の宿場・三留野宿に建つ築140年の古民家。
              長野県木曽郡南木曽町 3993。
            </p>
            <p>JR中央本線・南木曽駅から徒歩15分。</p>
          </div>
          <div>
            <h5>予約・お問い合わせ</h5>
            <a href="#book">空室確認・宿泊予約</a>
            <a href={MEAL_FORM_URL} target="_blank" rel="noopener noreferrer">
              お食事の予約
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              WhatsApp · +81 90-3839-2354
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href={GOOGLE_MAP_URL} target="_blank" rel="noopener noreferrer">
              Google マップ
            </a>
          </div>
          <div>
            <h5>日中の過ごし方</h5>
            <a href={EBIKE_LP_URL} target="_blank" rel="noopener noreferrer">
              Beyond Nakasendo Cycling →
            </a>
            <p style={{ marginTop: "0.4rem" }}>
              マスターが営むガイド付きE-bikeツアー&レンタル。
            </p>
            <p style={{ marginTop: "1.2rem" }}>
              <Link href="/">English page →</Link>
            </p>
          </div>
        </div>
        <div className="ft-bottom">
          © 柏屋 Kashiwaya Inn · 三留野宿 · 南木曽 · 木曽路
        </div>
      </footer>

      <ChatWidget />
    </>
  );
}

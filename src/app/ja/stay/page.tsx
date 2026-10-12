import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BedDouble } from "lucide-react";
import LodgifyBox from "@/components/LodgifyBox";
import PhotoGallery from "@/components/PhotoGallery";
import CouponBanner from "@/components/CouponBanner";
import ChatWidget from "@/components/ChatWidget";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { MARUSHO_SITE_URL, WHATSAPP_URL_JA } from "@/lib/site";

export const metadata: Metadata = {
  title: "泊まる — 客室・一棟貸し",
  description:
    "築140年の古民家に客室は2部屋、1フロア1組の貸切感。日によっては一棟貸しも。直接予約はコードKISO15で15%オフ。",
  alternates: {
    canonical: "/ja/stay",
    languages: { en: "/stay", ja: "/ja/stay", "x-default": "/stay" },
  },
};

const HOUSE_IMG = "/gallery/1stfloor.JPG";

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

export default function StayPage() {
  return (
    <>
      <SiteNav lang="ja" solid />

      <a href="#book" className="float-book">
        <BedDouble size={16} /> 宿泊予約
      </a>

      <div className="page-head">
        <div className="section-head">
          <span className="eyebrow-dark">泊まる</span>
          <h2>
            1フロアを貸切に — <em>あるいは、一棟まるごと。</em>
          </h2>
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
            さらに日によっては、一棟貸しもご用意しています。
          </p>

          <CouponBanner lang="ja" />

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

            <div className="room-card">
              <div className="room-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/gallery/tour/common-exterior.jpg"
                  alt="一棟貸し — 築140年の古民家をまるごと"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="room-body">
                <h3>一棟貸し</h3>
                <div className="room-sub">1階+2階 まるごと</div>
                <ul className="room-feats">
                  <li>築140年の家を、1組様で貸切</li>
                  <li>両フロア(計140㎡)· 庭もキッチンも独占</li>
                  <li>週に1日ほどの限定販売</li>
                  <li>無人運営 — キーボックスでセルフチェックイン</li>
                  <li>
                    柏屋の夕食はご提供なし —{" "}
                    <a
                      href={MARUSHO_SITE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      地元「マルショー」の夕食デリバリー
                    </a>
                    が利用可。朝食(お茶漬けセット)はご注文いただけます
                  </li>
                </ul>
                <LodgifyBox rentalId="850548" language="ja" />
              </div>
            </div>
          </div>

          <p className="meal-lead">
            一棟貸しの日は各部屋の販売を止めています(逆も同様)。
            ご希望日に空きが見えない場合は、もう一方の掲載もご確認ください。
          </p>

          <p className="meal-lead">
            公式サイトからのご予約なら、予約手続きの画面でそのまま
            お食事を追加できます — メニューは
            「<Link href="/ja/dining">食べる</Link>」ページをご覧ください。
          </p>

          <p className="book-direct-foot">
            ご質問は{" "}
            <a href={WHATSAPP_URL_JA} target="_blank" rel="noopener noreferrer">
              WhatsApp →
            </a>{" "}
            へお気軽に。
          </p>
        </div>
      </section>

      {/* ============ HONEST NOTES ============ */}
      <section className="honest" id="honest">
        <div className="section-head">
          <span className="eyebrow-dark">予約の前に</span>
          <h2>
            正直にお伝えします。<em>ここはホテルではなく、築140年の家です。</em>
          </h2>
          <p>
            柏屋は、合う方には最高の宿ですが、合わない方もいます。
            ご予約の前に、次の4点だけご確認ください。
          </p>
        </div>
        <div className="honest-card">
          <ul className="meal-note">
            <li>
              <strong>キッチン・洗面台・シャワールームは共用です</strong>
              (部屋貸しの場合)。各階1組限定なので、共有するのは最大で
              もう1組だけ。トイレは各部屋専用です。浴槽はなく、日帰り温泉が
              車で約15分の場所にあります。
            </li>
            <li>
              <strong>2階のお部屋のトイレは1階にあります。</strong>
              夜中も階段の上り下りが必要です。トイレ自体は専用で、
              他のお客様のエリアを通ることはありません。
            </li>
            <li>
              <strong>階段は昔のままで、急で狭いです。</strong>
              足腰に不安のある方は1階のお部屋をお選びください。
            </li>
            <li>
              <strong>断熱・防音には築140年の木造家屋なりの限界があります。</strong>
              夏は各部屋のエアコンで快適ですが、冬は石油ストーブと電気毛布が
              頼りで、朝晩は冷え込みます。家のきしみや、もう1組の生活音が
              聞こえることもあります——だから21時以降は静かに過ごす宿です。
            </li>
          </ul>
          <p className="honest-foot">
            ここまで読んで大丈夫そうなら、きっと気に入っていただけます。
            囲炉裏端の夜、静かな宿場の朝、そして1885年から旅人を
            泊めてきた家の時間を。
          </p>
        </div>
      </section>

      {/* ============ HOUSE ============ */}
      <section className="chapter" id="house">
        <div className="chapter-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HOUSE_IMG} alt="築140年の古民家・柏屋" loading="lazy" decoding="async" />
        </div>
        <div className="chapter-text">
          <span className="chapter-num">建物</span>
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

      {/* ============ GALLERY ============ */}
      <section className="gallery" id="gallery">
        <div className="section-head">
          <span className="eyebrow-dark">ギャラリー</span>
          <h2>
            部屋から部屋へ、<em>家を歩く。</em>
          </h2>
        </div>
        <PhotoGallery lang="ja" />
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

      {/* ============ POINTER TO FAQ ============ */}
      <section className="entries" style={{ paddingTop: 0 }}>
        <p className="entries-foot">
          キャンセルポリシー: 到着7日前まで前払い金を全額返金、以降は返金不可。
          設備・ハウスルール・アクセスなどの詳細は{" "}
          <Link href="/ja/faq">
            よくある質問・アクセス <ArrowRight size={13} style={{ display: "inline", verticalAlign: "-2px" }} />
          </Link>
        </p>
      </section>

      <SiteFooter lang="ja" />
      <ChatWidget />
    </>
  );
}

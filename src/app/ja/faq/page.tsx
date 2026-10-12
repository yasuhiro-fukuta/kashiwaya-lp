import type { Metadata } from "next";
import Link from "next/link";
import ChatWidget from "@/components/ChatWidget";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { WHATSAPP_URL_JA } from "@/lib/site";

export const metadata: Metadata = {
  title: "よくある質問・設備・アクセス",
  description:
    "柏屋の設備・ハウスルール・アクセス地図と、チェックイン・食事・荷物・キャンセルなど実用的なご質問への回答。",
  alternates: {
    canonical: "/ja/faq",
    languages: { en: "/faq", ja: "/ja/faq", "x-default": "/faq" },
  },
};

export default function FaqPage() {
  return (
    <>
      <SiteNav lang="ja" solid />

      <div className="page-head">
        <div className="section-head">
          <span className="eyebrow-dark">設備・ご案内</span>
          <h2>
            柏屋の詳細を<em>ひと目で。</em>
          </h2>
        </div>
      </div>

      {/* ============ FACILITIES & RULES ============ */}
      <section className="facilities" id="facilities">
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
            <li>キャンセル: 到着7日前まで前払い金を全額返金 · 以降は返金不可</li>
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
          <summary>到着前にやっておくことはありますか?</summary>
          <p>
            <a href={WHATSAPP_URL_JA} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            で到着時刻をお知らせください。荷物の配送や、チェックイン前後の
            アクティビティのご希望もあわせてどうぞ。お食事は公式サイトなら
            予約時にアドオンで追加、Booking.com経由の方はWhatsAppで
            ご注文ください。
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
          <summary>チェックイン前・チェックアウト後に荷物を置けますか?</summary>
          <p>
            はい。エントランスを入ってすぐの棚に置いてください。
            お預かり中の荷物の賠償はお一人様10万円までとさせていただきます。
          </p>
        </details>
        <details className="faq-item">
          <summary>一棟貸しはできますか?</summary>
          <p>
            はい。週に1日ほど、家をまるごと1組様に貸し切る「一棟貸し」の日を
            設けています。両フロア・庭・キッチンすべてお使いいただけます。
            その日は各部屋の販売を止めているため、一棟貸しのカレンダーに
            空きが出ている日が対象です。
            「<Link href="/ja/stay#book">泊まる</Link>」ページからお部屋と
            同じようにご予約ください。なお、一棟貸しは無人運営(キーボックスでの
            セルフチェックイン)で、柏屋の夕食はご提供できません。
            代わりに地元の食堂「マルショー」の出前(¥1,500〜¥3,500、
            「<Link href="/ja/dining#marusho">食べる</Link>」ページ参照)が
            ご利用いただけます。朝食のお茶漬けセットはご注文可能、
            キッチン付きなので自炊もできます。
          </p>
        </details>
        <details className="faq-item">
          <summary>宿泊のキャンセルポリシーは?</summary>
          <p>
            到着7日前までのキャンセルは、前払い金を全額(100%)返金します。
            それ以降のキャンセルは返金できません。
            (お食事のご注文は別ポリシーです — ご宿泊の4日前まで無料、
            3日前以降は返金不可。)
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
            公式サイトからの直接予約なら、予約手続きの画面でお食事を
            アドオンとして追加できます。1泊の場合はそれだけでOK。
            連泊の方は、どの日付にどの仕出しがご希望か、WhatsAppで
            ご連絡ください。例: 10月3日〜6日ご宿泊で、3日の夜に
            すき焼き・5日の夜に豚しゃぶをご希望なら、両方をアドオンして
            「すき焼きを3日の夜、豚しゃぶを5日の夜に」とご連絡を。
            朝食も同様です。Booking.com経由の方は、宿泊予約と同じ
            お名前で、宿泊日と食事制限を添えてWhatsAppでご注文ください。
            ご宿泊の3日前まで受け付けています。メニューは
            「<Link href="/ja/dining">食べる</Link>」ページをご覧ください。
          </p>
        </details>
        <details className="faq-item">
          <summary>食事の料金は?</summary>
          <p>
            夕食セットは2名分と3名分をご用意:鶏鍋 6,000円/8,000円、
            豚しゃぶしゃぶ・豚冷しゃぶ 8,000円/11,000円、和牛すき焼き
            10,000円/14,000円、ビーガン&グルテンフリーの鍋・冷製鍋
            8,000円/11,000円(2名分/3名分)。お一人でのご利用は1日1組まで、
            2名分の半額でご案内します。朝食のお茶漬けセット
            (ビーガン&グルテンフリー)はお一人1,500円です。
          </p>
        </details>
        <details className="faq-item">
          <summary>Booking.comのGenius特典で「朝食無料」と表示されました。</summary>
          <p>
            申し訳ありませんが、朝食は無料ではありません。Genius レベル2〜3の
            ご予約では、当宿との取り決めなくBooking.com側のシステムが
            「朝食無料」特典を表示することがあります。柏屋には朝食付きプランは
            なく、お食事(夕食・朝食)はすべて事前予約制の有料サービスです。
            紛らわしい表示となりご迷惑をおかけします。
          </p>
        </details>
        <details className="faq-item">
          <summary>夕食は外で食べられますか?</summary>
          <p>
            ご注意ください — 周辺のレストランは夜の営業が不定期です。
            当宿の夕食(3日前まで予約可)か、当日注文できるデリバリーの
            ご利用をおすすめします。ご滞在日にどこが開いているかは
            お気軽にお尋ねください。
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
            (2階のお客様専用トイレは1階にあります。他のお客様のスペースを
            通らずにご利用いただけます)。バスタブはありませんが、車で約15分の
            ところに天然の日帰り温泉があります(水曜定休)。
            タクシー手配もできます。
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

      <SiteFooter lang="ja" />
      <ChatWidget />
    </>
  );
}

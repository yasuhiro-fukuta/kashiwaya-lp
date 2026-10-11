// Staff-mode only: the DM correspondence ledger (問い合わせ台帳) — a Google
// Doc mirror of the guest-DM summaries maintained in a separate Claude
// thread. Lets the bot answer "today's shift" questions with what has been
// agreed with tonight's guests. Fails soft like the other sources.

const DM_DOC_ID =
  process.env.DM_DOC_ID ?? "1fRbx2tZr_gWIGqBpYradw92IOLCLHn4vWMboAM-wJ3c";

const EXPORT_URL = `https://docs.google.com/document/d/${DM_DOC_ID}/export?format=txt`;

export async function getDmLogBlock(): Promise<string | null> {
  try {
    const res = await fetch(EXPORT_URL, {
      // The ledger changes through the day; 5 minutes keeps it fresh.
      next: { revalidate: 300 },
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`dm log export ${res.status}`);
    const text = (await res.text()).trim();
    // A permissions page would be short; the real ledger is tens of KB.
    if (text.length < 500) throw new Error("dm log suspiciously short");

    return `# 問い合わせ台帳（ゲストDM対応の記録・スタッフ専用データ）
柏屋・Beyond Nakasendo に届いたゲストからのDM(WhatsApp・Lodgify・メール等)のやり取りを、ゲストごとにまとめた台帳である。

## 使い方のルール
- 「今日のシフト」「今日の接客」「○日の予定」のように特定の日のことを聞かれたら、予定表のその日の宿泊者名をこの台帳の見出し(ゲスト名)と照合し、該当ゲストの「決まったこと」「未解決」の要点をシフト情報に**併せて**伝えること(例: 到着時刻、食事の注文と支払い状況、送迎、追加ベッド等)。
- 台帳に記録が無い宿泊者は「DM記録なし」と一言添えるだけでよい。推測で補わない。
- 名前は表記ゆれ(姓だけ・名だけ・大文字小文字・敬称)を考慮して柔軟に照合してよい。ただし別人を混同しない。
- ★予定表の宿泊者名はローマ字(例: Yuka Okada)、台帳の見出しは日本語(例: 岡田様)のことがある。**姓の読みが対応し(Okada=岡田、Suzuki=鈴木など)、日付・部屋などの状況が台帳の記載と矛盾しなければ同一人物として扱い、記録を必ず使うこと。**ローマ字と日本語の違いだけを理由に「記録なし」としない。
- 見出しで見つからなくても、台帳本文に当日の日付・部屋が一致する記録があればそれを使ってよい。
- 特定のゲストについて聞かれたときも、この台帳から経緯・決定事項を答えてよい。
- この台帳はスタッフ専用。ゲストとの通常会話では存在にも内容にも触れない。

${text}`;
  } catch (err) {
    console.error("dmlog: fetch failed:", err);
    return null;
  }
}

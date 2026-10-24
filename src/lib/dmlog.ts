// Staff-mode only: the DM correspondence ledger (問い合わせ台帳). Since
// 2026-10-24 it lives in kashiwaya_master_v2 as three sheets (DM台帳 /
// お客様台帳 / 返信ルール) and is read through the sheet read-API
// (kashiwayasheet WebApi.gs, ?part=dmledger). The old Google Doc ledger is
// no longer read.

// Injected instead of the ledger when it cannot be fetched, so the bot says
// so instead of silently dropping the DM section (indistinguishable from
// "no records" otherwise).
export const DMLOG_UNAVAILABLE_NOTE = `# 問い合わせ台帳 接続エラー（内部情報）
現在、ゲストDM対応の台帳（問い合わせ台帳）への接続に一時的に失敗している。シフトや特定の日の予定を答えるときは、回答の最後に「## DM記録」の節を設け、「台帳に一時的に接続できないため確認できません。少し時間をおいてもう一度聞いてください」とだけ書くこと。「記録なし」とは書かない（記録が無いのか読めていないのか区別できないため）。`;

// Staff questions read the ledger only when they ask for it ("DM履歴も調べて"
// etc.). Reply mode (【スタッフ返信】) always reads it.
export function wantsDmLog(text: string): boolean {
  // Any mention of DM / the ledger / messages is enough ("DMも見て", "DM履歴も調べて", "台帳見て"…).
  return /DM|ＤＭ|ディーエム|台帳|やり取り|メッセージ|WhatsApp|ワッツアップ|Lodgify|ロジファイ/i.test(text);
}

// Injected in staff mode when the ledger was deliberately not read.
export const DMLOG_NOT_LOADED_NOTE = `# 問い合わせ台帳（DM記録）は今回読んでいない（内部情報）
ゲストとのDMのやり取り（到着時刻・送迎・DMで受けた注文・支払い状況など）は、この回答では確認していない。回答に「## DM記録」の節は作らない。「権限がない」「参照できない」「やっくんに確認して」とは書かない（読んでいないだけで、聞けば読める）。代わりに回答の最後に1行だけ「※DMのやり取りは見ていません。必要なら「DMも見て」と付けて聞いてください」と添える。`;

type DmLedgerData = {
  generatedAt?: string;
  today?: string;
  dmSince?: string;
  error?: string;
  guests?: Record<string, string>[];
  rules?: { 区分: string; 内容: string }[];
  dms?: { 日時: string; 名前: string; キー: string; 媒体: string; 方向: string; 状態: string; 本文: string }[];
};

export async function fetchDmLogText(bypassCache = false): Promise<string> {
  const url = process.env.SHEET_API_URL;
  const token = process.env.SHEET_API_TOKEN;
  if (!url || !token) throw new Error("SHEET_API_URL / SHEET_API_TOKEN not set");
  const sep = url.includes("?") ? "&" : "?";
  const res = await fetch(`${url}${sep}part=dmledger&days=10&token=${encodeURIComponent(token)}`, {
    // The ledger changes through the day; 5 minutes keeps it fresh.
    ...(bypassCache ? { cache: "no-store" as const } : { next: { revalidate: 300 } }),
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`dm ledger api ${res.status}`);
  const data = (await res.json()) as DmLedgerData;
  if (data.error) throw new Error(`dm ledger api: ${data.error}`);
  if (!Array.isArray(data.guests)) throw new Error("dm ledger api: no guests");
  return formatLedger(data);
}

// Render the three sheets as one plain-text ledger, in the same spirit as the
// old Google Doc: rules first, then one block per guest, then recent messages.
export function formatLedger(d: DmLedgerData): string {
  const out: string[] = [];
  out.push(`問い合わせ台帳（kashiwaya_master_v2 の DM台帳・お客様台帳・返信ルール。${d.generatedAt ?? ""} 時点）`);
  const rules = d.rules ?? [];
  for (const kind of ["返信方針", "前例", "未確認"]) {
    const rs = rules.filter((r) => r.区分 === kind);
    if (!rs.length) continue;
    out.push("", `## ${kind}`);
    rs.forEach((r) => out.push(`- ${r.内容}`));
  }
  out.push("", "## お客様（対応中・今後の予約・直近7日に終わった人。実施日順）");
  for (const g of d.guests ?? []) {
    out.push("", `### ${g["対象の名前"] || g["連絡先キー"]}（${g["連絡先キー"]}${g["別名・ほかの連絡先"] && g["別名・ほかの連絡先"] !== g["対象の名前"] ? "／" + g["別名・ほかの連絡先"] : ""}）［${g["区分"]}］`);
    if (g["実施日"]) out.push(`実施日：${g["実施日"]}`);
    if (g["サービス"]) out.push(`サービス：${g["サービス"]}`);
    if (g["決まったこと"]) out.push(`決まったこと：${g["決まったこと"]}`);
    if (g["未解決"]) out.push(`未解決：${g["未解決"]}`);
    if (g["経緯（要約）"]) out.push(`経緯：${g["経緯（要約）"]}`);
  }
  const dms = d.dms ?? [];
  if (dms.length) {
    out.push("", `## 直近のメッセージ（${d.dmSince ?? ""} 以降。受＝お客様から、返＝こちらから）`);
    dms.forEach((m) => out.push(`${m.日時}｜${m.媒体}｜${m.名前 || m.キー}｜${m.方向}｜${m.状態}｜${m.本文.replace(/\s+/g, " ").slice(0, 300)}`));
  }
  out.push(
    "",
    "（終わったお客さん：実施日から7日より前の人は省略。過去のお客様の記録は座敷童では読めない。聞かれたら「スプレッドシートのお客様台帳を見てください」と答える）",
  );
  return out.join("\n");
}

export async function getDmLogBlock(): Promise<string | null> {
  try {
    let text: string;
    try {
      text = await fetchDmLogText();
    } catch (err) {
      console.error("dmlog: fetch failed, retrying uncached:", err);
      text = await fetchDmLogText(true);
    }

    return `# 問い合わせ台帳（ゲストDM対応の記録・スタッフ専用データ）
柏屋・Beyond Nakasendo に届いたゲストからのDM(WhatsApp・Lodgify・メール等)のやり取りを、ゲストごとにまとめた台帳である。

## 使い方のルール
- ★「今日のシフト」「今日の接客」「○日の予定」のように特定の日のことを聞かれたら、**回答の最後に必ず「## DM記録」の節を設けること（省略禁止）**。その日の宿泊者ごとに、この台帳の該当記録の要点（到着時刻、食事の注文と支払い状況、送迎、追加ベッド、未解決事項など）を書く。
- 台帳に記録が無い宿泊者は「記録なし」とだけ明記する。推測で補わない。
- ★★DM記録に書いてよいのは**この台帳に実際に書かれている内容だけ**。台帳に無い日付・経緯・発言を創作することを固く禁じる。日付・金額は台帳の表記をそのまま写す。台帳の「返信方針」(一般ルール)を特定のゲストの経緯として書かない。確信が持てない場合は「記録なし」とする。
- 名前は表記ゆれ(姓だけ・名だけ・大文字小文字・敬称)を考慮して柔軟に照合してよい。ただし別人を混同しない。
- ★予定表の宿泊者名はローマ字(例: Yuka Okada)、台帳の見出しは日本語(例: 岡田様)のことがある。**姓の読みが対応し(Okada=岡田、Suzuki=鈴木など)、日付・部屋などの状況が台帳の記載と矛盾しなければ同一人物として扱い、記録を必ず使うこと。**ローマ字と日本語の違いだけを理由に「記録なし」としない。
- 見出しで見つからなくても、台帳本文に当日の日付・部屋が一致する記録があればそれを使ってよい。
- 特定のゲストについて聞かれたときも、この台帳から経緯・決定事項を答えてよい。
- ★★食事の注文はGoogleフォームだけではない。台帳に「受付」「受付済み」「注文済み」と書かれた食事は、フォームや予定表の食事欄に無くても**確定した注文**として扱う。予定表と食い違うときは「⚠予定表に未反映の注文（要仕込み）」と明記する。ただし**仕出し屋に実際に届いているかは「注文確認票」が正**であり、台帳で受けた注文が注文確認票に無いときは「⚠注文確認票に無い＝仕出し屋に未連絡の可能性」と必ず書く。「フォーム未送信の可能性」「ゲストに注文が届いているか確認」のように、ゲスト側の手続き漏れとして扱ってはならない（反映漏れは柏屋側の責任）。
- この台帳はスタッフ専用。ゲストとの通常会話では存在にも内容にも触れない。

${text}`;
  } catch (err) {
    console.error("dmlog: fetch failed:", err);
    return null;
  }
}

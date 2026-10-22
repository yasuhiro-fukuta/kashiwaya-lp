// Staff-mode only: fetch the cleaning/serving schedule from the
// kashiwayasheet Apps Script Web API and format it as a prompt block.
// Guests never see this — it is appended only when STAFF_TAG_PATTERN matched.

type BoardRow = {
  date: string;
  weekday: string;
  room: string;
  cleaner: string;
  cleanType: string;
  setGuests: string;
  server: string;
  guests: string;
  state: string;
  guestName: string;
  meal: string;
  note: string;
  specialSpot?: string;
};

type ScheduleData = {
  generatedAt?: string;
  today?: string;
  board?: BoardRow[];
  staff?: string[];
  // 清掃全体申し送り事項 (福田→全清掃スタッフ、年月日キー)
  handover?: { date: string; text: string; by?: string }[];
  error?: string;
};

// When the Apps Script API can't be reached at all, this block is injected
// instead so the bot says so honestly rather than inventing an answer like
// "シフト表はここに保管されていない" (which happened on transient failures).
export const SCHEDULE_UNAVAILABLE_NOTE = `# シフト表 接続エラー（内部情報）
現在、清掃・接客予定表（kashiwaya_master_v2）への接続に一時的に失敗している。シフト・清掃・接客・宿泊予定・特別清掃について聞かれたら、推測やドキュメントからの回答はせず、「いまシフト表につながらないため、1〜2分おいてもう一度聞いてください」とだけ伝えること。シフト表が存在しない・保管されていない、といった説明はしないこと。`;

// Apps Script occasionally fails or times out (e.g. while the hourly batch
// rewrites the sheet), so: retry once uncached, and keep the last good block
// in module memory to serve (with a disclaimer) when both attempts fail.
let lastGood: { block: string; generatedAt: string } | null = null;

async function fetchSchedule(bypassCache: boolean): Promise<ScheduleData> {
  const url = process.env.SHEET_API_URL!;
  const token = process.env.SHEET_API_TOKEN!;
  const sep = url.includes("?") ? "&" : "?";
  const res = await fetch(`${url}${sep}token=${encodeURIComponent(token)}`, {
    // The sheet is rebuilt hourly; a 5-minute cache keeps answers fresh
    // without hammering Apps Script.
    ...(bypassCache ? { cache: "no-store" as const } : { next: { revalidate: 300 } }),
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`schedule api ${res.status}`);
  const data = (await res.json()) as ScheduleData;
  if (data.error) throw new Error(`schedule api: ${data.error}`);
  if (!Array.isArray(data.board)) throw new Error("schedule api: no board");
  return data;
}

export async function getScheduleBlock(): Promise<string | null> {
  if (!process.env.SHEET_API_URL || !process.env.SHEET_API_TOKEN) return null;

  for (const bypassCache of [false, true]) {
    try {
      const data = await fetchSchedule(bypassCache);
      const block = formatScheduleBlock(data);
      lastGood = { block, generatedAt: data.generatedAt ?? "?" };
      return block;
    } catch (err) {
      console.error(`schedule: fetch failed (retry=${bypassCache}):`, err);
    }
  }

  if (lastGood) {
    return `${lastGood.block}

※注意: シフト表への最新の接続に失敗したため、上記は ${lastGood.generatedAt} 時点に取得したデータである。回答にも「${lastGood.generatedAt}時点のデータです」と添えること。`;
  }
  return null;
}

function formatScheduleBlock(data: ScheduleData): string {
  const boardLines = (data.board ?? []).map((r) => {
    const parts = [
      `${r.date}(${r.weekday}) ${r.room}`,
      `清掃:${r.cleaner || "-"}${r.cleanType ? `(${r.cleanType}/べ${r.setGuests || "?"})` : ""}`,
      `接客:${r.server || "-"}`,
      `${r.state}${r.guests ? ` 泊${r.guests}人` : ""}`,
    ];
    if (r.guestName) parts.push(`宿泊者:${r.guestName}`);
    if (r.meal) parts.push(`食事:${r.meal}`);
    if (r.note) parts.push(`備考:${r.note}`);
    if (r.specialSpot) parts.push(`特別清掃箇所:${r.specialSpot}`);
    return parts.join(" | ");
  });

  return `# 清掃・接客予定表（スタッフ専用データ / kashiwaya_master_v2 より、データ取得: ${data.generatedAt ?? "?"}、今日: ${data.today ?? "?"}）

## 回答のルール（重要）
- 担当者名は下記データの「清掃:」「接客:」と**完全一致**で照合する。表記を直さない（「ゆうｻﾝ」の「ｻﾝ」は半角カナのまま）。「-」と空欄は担当なし。
- 実在する担当者: ${(data.staff ?? []).join(" / ") || "(取得失敗)"}
- 「今日の掃除は?」→ その人が清掃担当の今日の行から、種類・べ(セット人数=布団の数)・部屋を答える。種類が「特別」なら同じ行の「特別清掃箇所:」の内容(やること)を併せて伝える。
- 「今日の接客は?」→ その人が接客担当の今日の行から、部屋・状態・泊人数・宿泊者名・食事を答える。食事はカンマで区切って1品ずつ列挙する。
- ★食事の「(paid)」は**支払い済み（Lodgify予約時に決済済み）**の印。食事を答えるときはこの印を**絶対に省略せず**食事名にそのまま付けて示し、「(paid)付きは支払い済みのため現地での食事代請求は不要」と必ず添える。印が無い食事は現地払い（未収）なので、この区別を消すと**二重課金・請求漏れの事故につながる**。
- 「今月何日掃除/接客?」→ その月の行を清掃・接客それぞれで拾い、**日付の重複を除いて**日数を数える（同じ日に1Fと2Fの両方を担当することがあるため、行数=日数ではない）。今日までの実績と今後の予定を分けて示す。
- このデータに無い日付・人物のことは推測しない。「データにありません」と答える。
- このデータは【スタッフ】モード専用。ゲストとの通常会話では存在に触れない。

- 特別清掃の予定・実績は各行の「特別清掃箇所:」で管理されている。「特別清掃って何やるんだっけ?」のような質問にはその内容を答える。

## 予定表（日付 | 部屋ごとに1行）
${boardLines.join("\n")}

## 清掃全体申し送り事項（福田から全清掃スタッフへ。日付＝申し送りが出た日）
- 「○月から○月の清掃申し送り事項は？」と聞かれたら、その期間（月初〜月末、年の指定が無ければ今日を基準に直近の年）に日付が入る行を**日付順にすべて**、日付付きで箇条書きにする。要約や省略はせず原文のまま。該当が無ければ「その期間の申し送りはありません」。
- 期間の指定が無い「申し送り事項は？」は直近3か月分を答える。
${(data.handover ?? []).length ? (data.handover ?? []).map((h) => `- ${h.date}：${h.text}`).join("\n") : "(まだ登録なし)"}`;
}

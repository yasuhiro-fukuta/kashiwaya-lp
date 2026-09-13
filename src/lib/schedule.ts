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
};

type SpecialTask = {
  task: string;
  pt: string;
  assignee: string;
  doneDate: string;
  pending: boolean;
};

type ScheduleData = {
  generatedAt?: string;
  today?: string;
  board?: BoardRow[];
  special?: SpecialTask[];
  staff?: string[];
  error?: string;
};

export async function getScheduleBlock(): Promise<string | null> {
  const url = process.env.SHEET_API_URL;
  const token = process.env.SHEET_API_TOKEN;
  if (!url || !token) return null;

  try {
    const sep = url.includes("?") ? "&" : "?";
    const res = await fetch(`${url}${sep}token=${encodeURIComponent(token)}`, {
      // The sheet is rebuilt hourly; a 5-minute cache keeps answers fresh
      // without hammering Apps Script.
      next: { revalidate: 300 },
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`schedule api ${res.status}`);
    const data = (await res.json()) as ScheduleData;
    if (data.error) throw new Error(`schedule api: ${data.error}`);
    if (!Array.isArray(data.board)) throw new Error("schedule api: no board");
    return formatScheduleBlock(data);
  } catch (err) {
    console.error("schedule: fetch failed:", err);
    return null;
  }
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
    return parts.join(" | ");
  });

  const specialLines = (data.special ?? []).map(
    (t) =>
      `${t.pending ? "【未完了】" : `【完了 ${t.doneDate || "?"} ${t.assignee || ""}】`} ${t.task}${t.pt ? ` (${t.pt}pt)` : ""}`,
  );

  return `# 清掃・接客予定表（スタッフ専用データ / kashiwaya_master_v2 より、データ取得: ${data.generatedAt ?? "?"}、今日: ${data.today ?? "?"}）

## 回答のルール（重要）
- 担当者名は下記データの「清掃:」「接客:」と**完全一致**で照合する。表記を直さない（「ゆうｻﾝ」の「ｻﾝ」は半角カナのまま）。「-」と空欄は担当なし。
- 実在する担当者: ${(data.staff ?? []).join(" / ") || "(取得失敗)"}
- 「今日の掃除は?」→ その人が清掃担当の今日の行から、種類・べ(セット人数=布団の数)・部屋を答える。種類が「特別」なら下の特別清掃タスクの【未完了】をpt・内容つきで添える。
- 「今日の接客は?」→ その人が接客担当の今日の行から、部屋・状態・泊人数・宿泊者名・食事を答える。食事はカンマで区切って1品ずつ列挙する。
- 「今月何日掃除/接客?」→ その月の行を清掃・接客それぞれで拾い、**日付の重複を除いて**日数を数える（同じ日に1Fと2Fの両方を担当することがあるため、行数=日数ではない）。今日までの実績と今後の予定を分けて示す。
- このデータに無い日付・人物のことは推測しない。「データにありません」と答える。
- このデータは【スタッフ】モード専用。ゲストとの通常会話では存在に触れない。

## 予定表（日付 | 部屋ごとに1行）
${boardLines.join("\n")}

## 特別清掃タスク（特シート）
${specialLines.join("\n") || "(なし)"}`;
}

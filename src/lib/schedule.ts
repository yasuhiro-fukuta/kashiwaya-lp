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

// 「-」などの記号は「担当なし」を明示したもので、人名ではない。
// kashiwayasheet 側の CONFIG.STAFF.IGNORE と揃えてある。
const NONE_MARKS = new Set(["-", "ー", "―", "—", "none", "なし", "無し", "ナシ"]);

function isRealName(v: string): boolean {
  const s = v.trim();
  return s !== "" && !NONE_MARKS.has(s.toLowerCase());
}

type DutyKey = "清掃" | "接客";

type DutyBucket = {
  /** 日付 -> 曜日。同じ日に1Fと2Fの両方を担当しても1日として数えるため Map */
  days: Map<string, string>;
};

/**
 * 担当者別・種別(清掃/接客)別・月別に「担当した日付」を集計する。
 *
 * ここを決め打ちで作るのが要点。
 * 以前は予定表(日付×部屋で1行、200行超)をそのまま渡して
 * 「ゆかの10月のシフトは」をモデルに数えさせていたが、
 * 担当者名が「清掃:」と「接客:」の2箇所に出るうえ
 * 同じ日に1F/2Fの2行があるため、拾い漏れ・他人の日の混入が起きていた。
 * (実例: 10/3 が 1F だけになり、まるこの 10/2・10/7 が混ざった)
 *
 * ★清掃は種類(入替/リネン/特別)を問わず全部入れる。
 *   A列に名前が入っていれば清掃担当である。「特別」を除外しない。
 * ★名前は正規化しない。半角カナ(「ゆうｻﾝ」)はそのまま突き合わせる。
 */
export function buildDutySummary(rows: BoardRow[], today: string): string[] {
  // name -> duty -> 'yyyy-MM' -> bucket
  const byName = new Map<string, Map<DutyKey, Map<string, DutyBucket>>>();

  const put = (name: string, duty: DutyKey, date: string, weekday: string) => {
    if (!isRealName(name) || !date) return;
    const key = name.trim();
    const month = date.slice(0, 7);

    let duties = byName.get(key);
    if (!duties) { duties = new Map(); byName.set(key, duties); }
    let months = duties.get(duty);
    if (!months) { months = new Map(); duties.set(duty, months); }
    let bucket = months.get(month);
    if (!bucket) { bucket = { days: new Map() }; months.set(month, bucket); }
    bucket.days.set(date, weekday);
  };

  rows.forEach((r) => {
    put(r.cleaner, "清掃", r.date, r.weekday);
    put(r.server, "接客", r.date, r.weekday);
  });

  const lines: string[] = [];
  const names = [...byName.keys()].sort();

  names.forEach((name) => {
    const duties = byName.get(name)!;
    const nameLines: string[] = [];

    (["清掃", "接客"] as DutyKey[]).forEach((duty) => {
      const months = duties.get(duty);
      if (!months) return;
      [...months.keys()].sort().forEach((month) => {
        const days = [...months.get(month)!.days.entries()].sort(
          (a, b) => (a[0] < b[0] ? -1 : 1),
        );
        // 実績 = 今日まで / 予定 = 明日以降
        const done = days.filter(([d]) => d <= today);
        const todo = days.filter(([d]) => d > today);
        const fmt = (list: [string, string][]) =>
          list.map(([d, w]) => `${d.slice(5).replace("-", "/")}(${w})`).join(" ");
        nameLines.push(
          `- ${duty} ${month}: 実績 ${done.length}日` +
            (done.length ? ` (${fmt(done)})` : "") +
            ` / 予定 ${todo.length}日` +
            (todo.length ? ` (${fmt(todo)})` : ""),
        );
      });
    });

    if (nameLines.length) lines.push(`### ${name}`, ...nameLines);
  });

  return lines;
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

  const dutyLines = buildDutySummary(data.board ?? [], data.today ?? "9999-12-31");

  const specialLines = (data.special ?? []).map(
    (t) =>
      `${t.pending ? "【未完了】" : `【完了 ${t.doneDate || "?"} ${t.assignee || ""}】`} ${t.task}${t.pt ? ` (${t.pt}pt)` : ""}`,
  );

  return `# 清掃・接客予定表（スタッフ専用データ / kashiwaya_master_v2 より、データ取得: ${data.generatedAt ?? "?"}、今日: ${data.today ?? "?"}）

## 回答のルール（重要）
- 担当者名は下記データと**完全一致**で照合する。表記を直さない（「ゆうｻﾝ」の「ｻﾝ」は半角カナのまま）。「-」と空欄は担当なし。
- 実在する担当者: ${(data.staff ?? []).join(" / ") || "(取得失敗)"}
- このデータに無い日付・人物のことは推測しない。「データにありません」と答える。
- このデータは【スタッフ】モード専用。ゲストとの通常会話では存在に触れない。

### 人で聞かれたとき（「ゆかの10月のシフトは」「今月何日掃除?」など）
- **必ず「## 担当者別の担当日一覧」だけを使う。** 下の予定表を自分で数え直さないこと。
  あちらは日付×部屋で1行あり、同じ人が「清掃」と「接客」の両方に出てくるため、
  目視で拾うと取りこぼしと他人の日の混入が起きる。
- 部屋(1F/2F)と清掃の種類(入替/リネン/特別)は**書かない**。日付だけでよい。
- ただし**清掃と接客は必ず分けて**示す。どちらか一方しか聞かれていなければその方だけでよい。
- 日数は一覧の「実績 N日 / 予定 N日」をそのまま使う。数え直さない。

### 日付で聞かれたとき（「10月3日のシフトは」「今日の掃除は?」など）
- 下の「## 予定表」の該当日の行から答える。こちらは部屋・種類・べ(セット人数=布団の数)を含めてよい。
- 種類が「特別」なら、下の特別清掃タスクの【未完了】をpt・内容つきで添える。
- 接客を聞かれたら、部屋・状態・泊人数・宿泊者名・食事を答える。食事はカンマで区切って1品ずつ列挙する。

## 担当者別の担当日一覧（集計済み。人で聞かれたらここを使う）
- 日付の重複は除去済み（同じ日に1Fと2Fの両方を担当しても1日）。
- 清掃は種類（入替 / リネン / 特別）を問わず**すべて**含む。「特別」も清掃である。
- 実績 = 今日 (${data.today ?? "?"}) までに担当した日 / 予定 = 明日以降に担当する日。
${dutyLines.join("\n") || "(担当者の割り当てなし)"}

## 予定表（日付 | 部屋ごとに1行。日付で聞かれたときだけ使う）
${boardLines.join("\n")}

## 特別清掃タスク（特シート）
${specialLines.join("\n") || "(なし)"}`;
}

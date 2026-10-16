import { createHash } from "crypto";

// スタッフモードは合言葉付きのタグでだけ入れる。
//   「【スタッフ:合言葉】あずまやの定休日いつだっけ」
//   「【スタッフ返信:合言葉】<ゲストからのメッセージ>」
// 2026-10-16 まではタグだけで誰でも入れて、問い合わせ台帳（客の氏名・
// 電話番号・鍵番号）を聞き出せた。リポジトリは公開なので合言葉そのものは
// 置かず、SHA-256 だけを置く。合言葉を変えるときは STAFF_PASSPHRASE_SHA256
// を Vercel の環境変数で上書きする。
const PASSPHRASE_SHA256 =
  process.env.STAFF_PASSPHRASE_SHA256 ?? "9529f75f637917160e6476b832da076f4e01baefa23aa3b0f4690e10d8ba5961";

const TAG = /^\s*[【\[［]\s*(スタッフ返信|staff\s*reply|スタッフ|staff)\s*[:：]\s*([^】\]］]+?)\s*[】\]］]/i;

export type StaffAuth = { staffMode: boolean; replyMode: boolean };

export function checkStaffTag(text: string): StaffAuth {
  const m = TAG.exec(text);
  if (!m) return { staffMode: false, replyMode: false };
  const hash = createHash("sha256").update(m[2]).digest("hex");
  if (hash !== PASSPHRASE_SHA256) return { staffMode: false, replyMode: false };
  const replyMode = /返信|reply/i.test(m[1]);
  return { staffMode: true, replyMode };
}

// 鍵・暗証番号らしき数字は、どのモードでもモデルに渡す前に伏せる。
// 番号はWhatsAppで直接伝える運用なので、ボットが知っている必要はない。
const SECRET_NUMBER =
  /((?:鍵|暗証|ダイヤル|ロック|lock|code|combination|pin)[^0-9\n]{0,8})(\d{3,8})/gi;

export function redactSecrets(text: string): string {
  return text.replace(SECRET_NUMBER, (_, pre: string, num: string) => pre + "＊".repeat(num.length));
}

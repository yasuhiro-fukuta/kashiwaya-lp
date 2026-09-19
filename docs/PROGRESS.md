# 柏屋ゲスト向けチャットボット「Ask Kashiwaya」進捗メモ

最終更新: 2026-07-16

## 現在のステータス: 🚀 本番リリース済み(2026-07-16)

本番ドメイン: **https://kashiwaya-inn.com**(2026-07-16 に Vercel で購入)。
右下の💬ボタンまたは https://kashiwaya-inn.com/chat から利用できる。
※ 旧表記の kashiwayainn.com(ハイフン無し)は未購入のまま放置されていた
ダミー登録で、実在しない。https://kashiwaya-lp.vercel.app も同じ本番を指す。

## 環境とURL

| 環境 | URL | 更新方法 |
|---|---|---|
| ステージング | https://kashiwaya-lp-git-staging-yakkuns-projects.vercel.app | `staging` ブランチにプッシュで自動更新 |
| 本番 | https://www.kashiwayainn.com | `staging` → `main` にマージで反映 |

チャット画面: 各URLの右下💬ボタン、または `/chat`

## 何を作ったか

柏屋の検討中・予約済み・宿泊中のお客様の質問に、南木曽情報のGoogleドキュメントを
最優先情報源として回答するAIチャットボット。多言語対応(お客様の言語で回答)。

- 設計書: `kiso-ebike-lp` リポジトリの `docs/chatbot-architecture.md`
  (ブランチ `claude/kashiwaya-chatbot-architecture-397uym`)
- 実装ファイル:
  - `src/app/api/chat/route.ts` — Claude API 呼び出し(ストリーミング、
    モデル `claude-haiku-4-5`、プロンプトキャッシュ、IPごと10回/分のレート制限)
  - `src/lib/knowledge.ts` — Googleドキュメントを1時間ごとに取得。
    **ドキュメントを編集するだけでボットの知識が自動更新される**(再デプロイ不要)
  - `src/data/knowledge-fallback.ts` — 取得失敗時のスナップショット
  - `src/lib/prompt.ts` — システムプロンプト(情報源に無いことは答えず
    WhatsApp +81 90 3839 2354 へ誘導、料金・時間は原文どおり、手続きは人間へ)
  - `src/components/Chat.tsx` / `ChatWidget.tsx` — チャットUI(よくある質問チップ、
    URL自動リンク化、WhatsApp導線常設)
  - `src/app/chat/page.tsx` — 全画面チャットページ

## 完了した設定

- [x] Anthropic Console でAPIキー発行(名前: `kashiwaya-chatbot`)
- [x] Vercel 環境変数 `ANTHROPIC_API_KEY` 設定(Production / Preview)
- [x] クレジット $50 入金・Auto-reload 有効
- [x] ステージングで回答品質・UI確認(2026-07-16)
- [x] 「Book a Stay」ボタンとチャットボタンの重なり修正
- [x] **本番リリース**: `staging` → `main` へマージ(2026-07-16)

## 残タスク
- [ ] **⚠️ APIキーの更新**: 現在のキーは30日期限で **2026-08-15 に失効**。
      本番運用前に期限なしのキーを作り直し、Vercelの値を差し替えること
- [ ] Googleドキュメントの共有設定が「リンクを知っている全員が閲覧可」に
      なっているか確認(未設定でもフォールバックで動くが、自動更新が効かない)
- [ ] 導線の整備: 館内QRコード(`/chat` へ)、Booking.com のDMテンプレにURL追記
- [ ] (任意) `staging.kashiwayainn.com` ドメインを staging ブランチに割り当て
- [ ] (任意) 会話ログの確認運用 — 答えられなかった質問をGoogleドキュメントに
      追記する改善ループ(Vercel の Logs で確認可能)

## WhatsApp自動応答(構築中 2026-07-17〜)

方針: ゲスト連絡をWhatsAppに統一。Booking.com / Lodgify の初回メールで
ボット用WhatsApp番号(社用スマホの番号)を案内し、以降の質問はボットが自動応答。
答えられない質問はやっくん直通 (+81 90 3839 2354) を案内(A案)。

- 実装: `src/app/api/whatsapp/route.ts`(Meta WhatsApp Cloud API の Webhook。
  チャットボットと同じ知識・プロンプトを再利用。会話履歴は現状保持しない)
- 必要な Vercel 環境変数:
  - `WHATSAPP_ACCESS_TOKEN` — Meta System User の永続トークン
  - `WHATSAPP_PHONE_NUMBER_ID` — Cloud API の電話番号ID
  - `WHATSAPP_VERIFY_TOKEN` — Webhook検証用の合言葉(任意の文字列)
- セットアップ状況:
  - [x] 社用スマホ購入(ボット用番号)
  - [ ] Meta Business Portfolio 作成
  - [ ] developers.facebook.com でアプリ作成(WhatsApp追加)
  - [ ] ボット番号の登録・SMS認証
  - [ ] 永続アクセストークン発行(System User)
  - [ ] Vercel に環境変数3つを設定
  - [ ] Webhook URL 登録・検証(messages を購読)
  - [ ] テスト送信で自動応答を確認
  - [ ] Booking.com / Lodgify の初回メールテンプレにボット番号を記載

## スタッフモード

メッセージの先頭に **【スタッフ】** を付けると、ゲスト対応ではなくスタッフ支援
モードで回答する(Webチャット・WhatsApp共通)。
例: 「【スタッフ】あずまやの定休日いつだっけ」「【スタッフ】ゲストに送る英語の
返信文を作って: 明日の送迎は16時にお願いしたい」

- スタッフモードでは: 日本語で率直に回答 / ドキュメントに無いことは「推測」と
  明示した上で提案可 / ゲスト向け返信ドラフト作成可 / FAQ追記の提案も可
- 注意: タグは誰でも打てる(パスワードではない)。知識ドキュメントには
  ゲストに見られて困る情報を書かないこと。機密を扱いたくなったら
  合言葉方式に拡張する。

## 勤務予定表の連携(スタッフモード)

【スタッフ】モードのとき、清掃・接客予定表(kashiwaya_master_v2)を読んで
「今日の掃除は?」「今日の接客は?」「今月何日働いた?」に答えられる。

- 仕組み: kashiwayasheet リポジトリの `gas/WebApi.gs`(読み取り専用doGet、
  バッチ非干渉)→ Vercel が5分キャッシュで取得 → スタッフモードの
  プロンプトに注入。担当者名は完全一致・日数は日付重複除去(HANDOFF.md準拠)
- 必要な Vercel 環境変数: `SHEET_API_URL`(ウェブアプリのURL)、
  `SHEET_API_TOKEN`(Apps Script の Script Property `WEB_API_TOKEN` と同じ値)
- 未設定のときは従来どおり(予定表なしのスタッフモード)で動く
- ⚠ 合言葉なし(【スタッフ】タグのみ)で運用する判断済み(2026-09-13)。
  タグを知る第三者には勤務・宿泊者情報が見える点は承知の上
- ⚠ gas/WebApi.gs を変更したときは Apps Script で
  「デプロイを管理 → 新バージョン」をしないと公開URLに反映されない

## 食事料金の参照(2026-09-15)

食事・オプション予約フォーム(https://forms.gle/KqYFZBWuiVnAshAF9)の設問と
選択肢(¥入りメニュー名)を1時間ごとに取得し、ゲスト・スタッフ両モードの
プロンプトに注入。**フォームを編集すれば料金の回答も自動更新**される。

- 実装: `src/lib/mealform.ts`(公開フォームページの埋め込みデータを解析。
  Google側の形式変更時は静かに無効化され、ボットは従来どおり動く)
- 動作確認: `/api/mealform-check`(設問数とタイトルを返すだけ)
- フォームを別のものに差し替える場合: 環境変数 `MEAL_FORM_URL`

## 画像添付(2026-09-19)

Webチャットで画像を添付して質問できる(📎ボタン / PCはコピペでも可、最大3枚)。
ゲストのメール・Booking.comメッセージのスクショを貼って
「【スタッフ】これに返信文作って」のような使い方が本命。
ショートカット: **【スタッフ返信】+ 本文(またはスクショ添付のみ)** で、
指示文なしでそのまま送れる返信ドラフトを生成する(署名 Yasuhiro (Kashiwaya Inn)、
不確定事項は【要確認: ○○】プレースホルダ入り)。
画像は送信時に端末側で縮小(長辺1600px JPEG)するので通信も軽い。
※ WhatsAppボット側の画像対応は未実装(必要になったら追加)。

## キャラクター「柏屋の座敷童」(2026-09-19)

ゲスト向けチャットのペルソナ。天井裏に140年住む座敷童で、家のことや観光の
知識はマスターやっくんからの盗み聞き、という設定。

- 画像: `public/zashikiwarashi.png`(Drive の zashikiwarashi.png を512pxに最適化)
- 表示: ウィジェットのヘッダーと、ボットの各メッセージ横のアバター
- プロンプト: `buildSystemPrompt` にキャラクター節を追加。**情報の正確さが
  常に優先**(数字に脚色しない・キャラのために曖昧にしない)というガード付き。
  分からないことは「やっくん本人に聞いて」→ WhatsApp誘導
- スタッフモード(【スタッフ】/【スタッフ返信】)は従来どおり実務口調のまま

## 運用メモ

- FAQの更新 = **Googleドキュメントを編集するだけ**(最大1時間で反映)
- モデル変更: Vercel 環境変数 `CHAT_MODEL`(既定 `claude-haiku-4-5`。
  品質を上げたい場合は `claude-sonnet-5` などに変更して再デプロイ)
- ドキュメントを別のものに差し替える場合: 環境変数 `KNOWLEDGE_DOC_ID`
- コスト目安: 1日30会話程度で月数百円〜千円台。Anthropic Console の
  Usage / Spend で確認可能

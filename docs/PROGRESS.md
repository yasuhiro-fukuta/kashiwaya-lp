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

## 運用メモ

- FAQの更新 = **Googleドキュメントを編集するだけ**(最大1時間で反映)
- モデル変更: Vercel 環境変数 `CHAT_MODEL`(既定 `claude-haiku-4-5`。
  品質を上げたい場合は `claude-sonnet-5` などに変更して再デプロイ)
- ドキュメントを別のものに差し替える場合: 環境変数 `KNOWLEDGE_DOC_ID`
- コスト目安: 1日30会話程度で月数百円〜千円台。Anthropic Console の
  Usage / Spend で確認可能

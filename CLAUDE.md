# CLAUDE.md

## デプロイリンクの共有ルール

変更をコミット & プッシュしてビルド確認が終わったら、ユーザーがVercelを開かなくて済むよう、**必ずデプロイURLをチャットに貼ること**。

- ブランチのプレビューURL: PRが存在する場合、VercelボットのPRコメントまたはコミットのチェック(GitHub MCPで取得可能)からプレビューURLを取得して貼る。
- PRがまだない場合はプレビューURLを特定できないので、その旨を伝えてPR作成を提案する。
- 本番URL(mainマージ後)も併記するとよい。
- 注意: リモート実行環境のネットワークポリシーで `vercel.app` への直接アクセスはブロックされていることがある。その場合、リンクの動作確認はできない旨を一言添える。

## URL一覧

- 本番LP: https://kashiwaya-lp.vercel.app/
- E-bikeツアーLP(Beyond Nakasendo Cycling): https://kiso-ebike-lp.vercel.app/
- GitHubリポジトリ: https://github.com/yasuhiro-fukuta/kashiwaya-lp

## 画像の追加・管理ルール

- ギャラリー画像は `/public/gallery/` に置く(Vercelではファイル名の大文字小文字が区別される)。
- カメラ原寸の画像(5MB超)をそのままコミットしない。コミット前に必ず圧縮すること:
  - 長辺 2000px に縮小(`fit: inside`、拡大はしない)
  - JPEG 品質 80(mozjpeg)で再エンコード
  - `sharp` の `.rotate()` でEXIFの回転を反映してからメタデータを削除
- 目安: 1枚 0.1〜0.6MB 程度。2026-07 に全42枚を再圧縮済み(208MB → 9.4MB)。

# Codex向け指示書：ピラミッド判決の写真ダウンロード

## 目的
YouTube動画「ハビ判事：ピラミッド判決」で使う写真52枚を、Wikimedia Commons からダウンロードしてリポジトリに入れる。
（Claude側の環境ではCommonsのアクセス制限で取得できないため、Codexにお願いする作業です。）

## 作業場所
- リポジトリ：`tubex-cpu/TUBEX`
- ブランチ：`claude/nice-wright-du0dch`（このブランチで作業し、同じブランチにプッシュする）
- 作業フォルダ：`habi-pyramid/`

## 手順
1. ブランチを最新にする。
   ```bash
   git fetch origin claude/nice-wright-du0dch
   git checkout claude/nice-wright-du0dch
   git pull origin claude/nice-wright-du0dch
   cd habi-pyramid
   ```
2. Pillow が無ければ入れる：`pip install pillow`
3. ダウンロードスクリプトを実行する。
   ```bash
   python3 scripts/fetch-photos.py
   ```
   - 取得する写真の一覧は `scripts/photo-picks.json` にある（保存名 → Commonsのファイル名）。
   - 写真は `public/photos/<保存名>.jpg` に保存される（長辺2400pxまで縮小）。
   - 作者・ライセンス・出典ページは `public/photos/credits.json` に記録される。
   - 429（アクセス過多）が出ても、スクリプトが自動で待って再試行する。途中で止まった場合は、同じコマンドをもう一度実行すれば続きから再開する。
4. 最後に「完了：52/52枚」と出ることを確認する。
   - 「FAIL」になった写真があれば、`写真リスト.md` の該当ページをブラウザで開き、ファイル名が変わっていないか確認する。変わっていれば `scripts/photo-picks.json` のファイル名を直して再実行する。
   - どうしても取れない写真は、そのまま残して報告する（代わりの写真を勝手に選ばない）。
5. コミットしてプッシュする。
   ```bash
   git add public/photos scripts/photo-picks.json
   git commit -m "ピラミッド判決：Commonsの写真を追加"
   git push -u origin claude/nice-wright-du0dch
   ```

## 守ること
- **Commons以外のサイトから画像を取らない。** 指定の54枚だけを取得する。
- **ライセンスの確認**：`credits.json` の `license` が「Public domain／PD／CC0／CC BY／CC BY-SA」のいずれか以外（例：「Fair use」「No license」など）の写真があれば、使わずに報告する。
- 写真の中身を加工しない（縮小以外のトリミング・文字入れはしない）。
- `public/photos` 以外のファイル（`src/` のコードなど）は変更しない。
- User-Agent は スクリプトのまま使う（個人のメールアドレスなどを入れない）。
- 連続アクセスを避けるため、スクリプトの待ち時間（1枚ごとに5秒）を短くしない。

## 完了報告に書くこと
- 取得できた枚数（例：52/52）
- 失敗した写真の保存名と理由（あれば）
- ライセンスが対象外だった写真（あれば）
- プッシュしたコミットのハッシュ

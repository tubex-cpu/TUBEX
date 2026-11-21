# 素材・ライセンスのメモ（sleep-emotion-60s）

| 素材 | 出どころ | ライセンス・条件 | 動画内の表記 |
|---|---|---|---|
| ナレーション音声 | HTS voice **tohoku-f01（neutral）**＋ Open JTalk（Debian パッケージ `open-jtalk`, 辞書 `open-jtalk-mecab-naist-jdic`） | 音声モデル：© 2015 東北大学 伊藤・能勢研究室（Intelligent Communication Network Laboratory）、**CC BY 4.0**（クレジット・ライセンスへのリンク・変更の有無の表示が必要）。Open JTalk は修正BSD | 最終2秒の画面下に表記。概要欄にも「音声：HTS voice tohoku-f01（東北大学 伊藤・能勢研究室）CC BY 4.0 https://creativecommons.org/licenses/by/4.0/ ／ Open JTalk で合成・無音区間の除去と音量調整を加工」と書く |
| 音声モデルの入手経路 | npm パッケージ `@nmemonica/voice-ja@0.1.14` の wasm に同梱されたもの（GitHub 本家 icn-lab/htsvoice-tohoku-f01 はこの環境のネットワーク制限で取得不可）。`scripts/extract_voice.py` で取り出し。`voice/tohoku-f01-neutral.htsvoice` sha256 `1c76d4d5646c46e13410651c4232b95af8b878e67afd370a605b5de792ba17ee` | 同上（パッケージの README にライセンス全文あり） | — |
| BGM・効果音 | `scripts/make_audio.py` で numpy 合成（固定シード） | 自作 | — |
| 3DCG（人物・寝室・机・MRI・街並み・家具・キャラクター） | コードで自作。人物は符号付き距離関数（SDF）で彫刻し、surface nets で多角形化（`src/three/sdf.ts`・`personSdf.ts`）。画像生成・外部モデル・有料素材なし | 自作 | 画面左上に「再現映像（CG）」「測定の再現（CG）」 |
| 環境光（HDRI） | Poly Haven の HDRI（apartment / lab / night）を `@pmndrs/assets@1`（npm）経由で使用。照明と映り込みの計算だけに使い、背景としては表示しない | **CC0**（クレジット不要） | — |
| 脳の3Dモデル | `src/three/Brain3D.tsx` で手続き的に自作（楕円体＋ノイズで脳溝・脳回、小脳、脳幹）。外部の脳モデル・画像・医用データは不使用 | 自作 | 「脳のCGモデル（自作の模式。部位の位置はおおよそ）」と表示 |
| グラフ・波形・時計 | SVG で自作（論文の図の転載なし） | 自作 | 「説明図」「模式図」と表示 |
| フィルムグレイン | `public/grain/` numpy で固定シード生成 | 自作 | — |
| フォント | Noto Sans CJK JP（Debian `fonts-noto-cjk`） | SIL OFL 1.1 | — |
| ライブラリ | Remotion 4.0.534 / three 0.176 / @react-three/fiber 9 | Remotion は個人・小規模チームは無料ライセンス（会社規模により有料ライセンスが必要。規約の確認は公開前に社長側で） | — |

## キャラクター
- 承認画像 `crt-mascot-3d-v1.png` は**この作業環境から開けなかった**（Mac 上のパスで、クラウド環境に共有されていない）。
- そのため、依頼文の文字情報（顔なし・大きな丸い頭・小さな耳・短い手足・丸い胴・全身の白黒 CRT ノイズ）だけからモデルを作った。**耳の位置・頭身・胴の形・ノイズの粒度は承認画像と照合していない**。照合後に `src/three/Mascot.tsx` の寸法を合わせる必要がある。
- 名前は付けていない（画面では「AI」「観察ログ」とだけ表記）。

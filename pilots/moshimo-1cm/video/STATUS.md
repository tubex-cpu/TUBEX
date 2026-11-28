# 動画制作の状況：もしも全人類が1cmになったら

## 第1版（2026-11-26）
- 社長指示（2026-11-26）「候補１動画制作まで進めて、他が出さないうちに配信できるように急ぎましょう」。台本は `../03_script.md`（15場面＝章0〜14、章15＝エンドカード）
- ナレーションは作成済み（`/home/user/work_neko/out_1cm/timeline.json`・`nar/`・`narration.wav`、VOICEVOX 玄野武宏。概要欄に「VOICEVOX:玄野武宏」必須）。作り直していない
- 書き出し（git 外）：`../outputs/1cm_v1_full_1080p.mp4`、軽量版 `../outputs/1cm_v1_preview_720p.mp4`

## 作り方
- 猫回の仕組み（`pilots/moshimo-neko-meow/video/`）を環境変数で切り替える。`bash run_1cm.sh`（描画 → 字幕・テロップ合成 → コマ削除を3並列、できた seg はとばす。最後に audio.py と compose.py final）
- 部品 `tk.py`（心臓回の `hk.py` を読み込む）、カット `t1.py`（章0〜7）・`t2.py`（章8〜15）、カット表 `shots_1cm.py`（58カット）、テロップ `telops_1cm.py`
- 縮尺：人は s=1（身長1.7）のまま、世界を K=170 倍で作る（`giant()` の中で kit の部品を作ると K 倍になる）。ベッドの高さ・階段一段（背の20倍）・アリ（同じ大きさ）・アシダカグモ（脚の幅 背の10倍以上）・スズメ（10倍以上）・カラスの電線は実寸×K
- 家の猫は茶トラ（`tora()`：金色の目・黒い瞳・白いひげ）。SCENE 01・13・14・15 とエンドカードで同じ猫
- 人も猫も animate_life で呼吸・首・まばたき・しっぽ。寄りの猫の画（目の大写し）は `cat_still()` で小さな首の揺れ・まばたき・ひげ・呼吸だけにする（大きな首振りで目が画面から外れないように）
- BGM：短調なし。3区間で楽器を変える（`telops_1cm.SECTIONS`）：章0〜4 ピチカートと木琴／章5〜9 マリンバと鉄琴／章10〜15 ピアノとオルゴール
- 音：心臓の音なし（beats=0）。猫ののどのゴロゴロ（meta の `purr`）を `audio.py` に追加（purr を持たない他企画には影響なし）。雨は 'sea'、夜は 'night' の環境音
- 1カットだけ試す：`cd pilots/moshimo-neko-meow/video && NEKO_VER=v5 NEKO_OUT=/home/user/work_neko/out_1cm NEKO_PROJECT_DIR=/home/user/TUBEX/pilots/moshimo-1cm/video NEKO_SHOTS=shots_1cm NEKO_TELOPS=telops_1cm /home/user/work_neko/venv/bin/python render_shot.py <カット> --test --res 640 360`
- 描き直すとき：`/home/user/work_neko/out_1cm/seg/<カット>.mp4` を消して `bash run_1cm.sh`（残りの seg は使い回す）

## 弱いところ（第2版の候補）
- 人と動物は低ポリゴン。スズメ・カラス・ネズミ・クモは単純な形。おにぎりは三角の板
- 階段（SCENE 04）の跳び降りは見上げる画で、段の形が分かりにくいコマがある
- SCENE 13 の「猫の前足が床に下りる」・SCENE 14 の「棚の上の人と下の猫」は、人が小さく、猫と人が同じ画に入りにくい
- 金色の目の「光る」は半透明の淡い輪で表現（Workbench に発光がない）
- 布団・部屋は Workbench の光のため、やや灰色がかる

## 第1版 完成（2026-11-26）
- 通し描画 58カット、10:04 UTC 完了（途中で描画が止まったため 09:39 に再開。済みのカットは使い回し）
- 出力（git に入れない）：`outputs/1cm_v1_full_1080p.mp4`（1920×1080・24fps・8分49秒）、`outputs/1cm_v1_preview_720p.mp4`
- 音量：−17.5 LUFS
- 概要欄：`07_description.md`

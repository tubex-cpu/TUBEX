# 概要欄（案・3D版）：chizu-005-bermuda-roof-water 長尺版 v3

- 2026-11-21 Claude 作成（社長「3D版の概要欄とサムネの依頼を進めて」）。もとの概要欄 `07_description_v3_long.md` を3D版（`pilots/chizu-3d/preview_bm_3d.mp4`）に合わせた版。もとの概要欄は残す
- 3D版で変わったもの：映像（地図の模型・浮かぶカード・立体の数字・光のある地球儀・見せ場の3D場面）と BGM・効果音。台本・ナレーション・字幕・数字は承認済みの版と同じ
- **公開前の保留**：地球儀と地図の下地に、陰影図 shadedrelief.jpg（basemap-data 2.0.0 同梱、原典は shadedrelief.com）を使っている（`pilots/chizu-3d/scripts/assets.py` が地球儀の画像をこのファイルから作り、地図の元映像も承認済みの描画プログラムの陰影図を下地にしている）。shadedrelief.com の利用条件の本文は未確認（この環境から接続できない）。チャンネルのルール（2026-11-15、`channels/chizu/CHANNEL.md` 末尾）により、**条件を確認するか、地図を確認済みの素材に差し替えるまで、この版は公開しない**。下の「地図・図について」は実際に使った素材をそのまま書いている
- 公開前QC の要確認：S20「一トンの水が一度の雨でタンクに」、S18「屋根の五分の四」「家の下」（`STATUS.md`「## 公開前QC」）。下の出典の「根拠法令は公開前に確認」も未解決
- タイトル：未確定（`04_titles.md`「3組（2026-11-21）」から社長が選ぶ）

---

大西洋の島バミューダには、川も淡水の湖もありません。白い階段状の屋根で雨を集め、家の下のタンクにためる。足りないときは給水トラックと、海水からつくる水が支えます。島の水の行き先を、地図で追いかけます。

■ 地図・図について
・地図の模型・浮かぶカード・立体の数字・地球儀・見せ場の3D場面は、地図と図をもとにコンピューターで作った映像です（実際の空撮や衛星画像ではありません）
・地球儀と広域の地図：地形の陰影図（shadedrelief.com が原典、Python パッケージ basemap-data 2.0.0 同梱）。衛星画像ではありません
・島と海岸線：Natural Earth（パブリックドメイン、1:1000万。海岸線は簡略化しています）
・ハッテラス岬からの距離（約1,050km）は、地図上の2点の大円距離の計算値です
・屋根1平方メートルあたりのタンクの量（約390リットル・米領ヴァージン諸島の約410〜610リットル）、風速・雨量のメートル法への換算、タンクの容積の例は、自前の計算です
・屋根・タンク・地下の淡水の図は、仕組みを説明する模式図です（大きさ・縮尺は正確ではありません）

■ 主な出典
・面積・位置・人口：Bermuda 2016 Census Preliminary Report（バミューダ政府）ほか
・川も淡水の湖もない／地下の淡水の層：Florida Trend「Rain on the roof」、Wikipedia「Architecture of Bermuda」
・屋根のつくり：This Old House「This roof resists hurricanes, collects water」、The Bermudian
・家の下のタンク：enterbermuda.com「How Bermuda gets its water」
・法律で決まったタンク：Public Health (Water Storage) Regulations 1951 ほか（根拠法令は公開前に確認）
・給水トラック（約4万人）・タインズ・ベイのプラント：バミューダ政府「Summer Water Shortage」（2018年）、bernews 2018-06
・2025年2月の故障：bernews 2025-02「Ministry Works To Resolve Water Issues」、Royal Gazette
・2026年5月の新しい出口：bernews 2026-05「New Southside Water Outlet Opens For Truckers」
・節水の呼びかけ：バミューダ政府「Ministry Encourages Water Conservation and Advanced Planning Amid Dry Conditions」、bernews 2025-07
・給水トラック業者の勧め：Royal Gazette 2025-02-12「Water truckers urge public to monitor tanks」
・島の成り立ち（海山の上の石灰岩・風成の石灰岩）：NOAA Ocean Explorer ほか
・淡水レンズの1対40の関係：USGS、NGWA
・デヴォンシャー・レンズ・水資源法（1975年）・水利権：Frontiers 2024 の論文、バミューダ政府
・シー・ヴェンチャー号（1609年）・入植（1612年）：各種歴史資料
・1951年の公衆衛生（貯水）規則：FAOLEX、国連会合資料（2019年）、Royal Gazette
・屋根とタンクの手入れ・消毒・蚊の対策：バミューダ政府（保健当局・環境衛生局）
・2008年のタンクの水の研究：Lévesque ほか、Canadian Journal of Microbiology 54巻6号
・ハリケーン：米国立ハリケーンセンター（NHC）ほか
・政府の水道・タインズ・ベイ：大臣声明（2018年・2021年）、政府の入札資料
・ジブラルタルの集水面：AquaGib ほか
・マジュロ・ツバル：各国・国際機関の資料、報道
・米領ヴァージン諸島：V.I. Code 第29編 §308（2019年版）
・オーストラリア：オーストラリア統計局（2013年）
・両国国技館・雨水の利用の推進に関する法律：墨田区、国土交通省
・世界の淡水化：Jones ほか（2019年、Science of the Total Environment）
・マルタ：マルタの水道当局の資料ほか
・IPCC 第6次評価報告書、海洋・雪氷圏特別報告書（2019年）、バミューダ海洋科学研究所（BIOS）「Climate Change and Bermuda」（2023年）、バミューダ政府の気候変動の調査（Smith Warner International）
・ガーディアン紙「Weatherwatch」（2019年4月）
（各URLは制作資料 `01_research.md`・`research_long_A_geo_history.md`・`research_long_B_water_system.md`・`research_long_C_world_future.md`）

■ 音楽・効果音
・BGM：このチャンネルで作曲（MIDI を FluidSynth と音源 FluidR3_GM〈Copyright © 2000-2002, 2008 Frank Wen、MIT License〉で演奏）
・効果音：自作の合成音

■ 音声
VOICEVOX:雀松朱司

#地球の事情 #バミューダ #地理

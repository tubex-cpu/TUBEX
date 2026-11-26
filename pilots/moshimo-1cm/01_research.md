# 資料表・制作メモ：もしも全人類が1cmになったら

- 調査日：2026-11-26。調査担当：Claude Code
- **確認の状態**
  - 「確認済み」：原文のページを開き、該当の記述を見たもの（この環境で開けたのは en.wikipedia.org・ja.wikipedia.org）。
  - 「未確認（検索結果のみ）」：検索エンジンの抜粋しか見ていないもの。原文は開いていない。確認済みとして扱わない。
- 開けなかった原資料（名前解決できず）：www.marxists.org・www.cs.utexas.edu（Haldane の随筆の全文）、en.wikiquote.org、petfood.or.jp（ペットフード協会）。文部科学省「日本食品標準成分表」の原表も開いていない。ネットワークの設定は変えていない。
- **記号**：【F◯】出典のある事実／【R◯】事実からの推論（計算）。推論は語りで事実として言い切らない。使うときは `03_plan.md` の「もしもの仮定」として扱う。
- 使う場面の欄は台本前のため「未定」とし、想定の用途だけ書く。

---

## 1. 資料表

| 番号 | 事実 | 出典 | 確認状態 | 使う場面 |
|---|---|---|---|---|
| F1 | 基礎代謝量は体重の3/4乗に比例する（クライバーの法則）。近似式 BMR ≈ 3.4 w^(3/4) W（w は kg）。体重が猫は鼠の100倍でも、使うエネルギーは約32倍だけ（＝小さい動物ほど1kgあたりの代謝が高い）。最小の動物の代謝はこの法則の予測より高い傾向がある | https://en.wikipedia.org/wiki/Kleiber%27s_law （"the basal metabolic rate scales to the 3⁄4 power of the animal's mass" / "a cat having a mass 100 times that of a mouse will consume only about 32 times the energy the mouse uses" / "the metabolic rates of the smallest animals tend to be greater than expected from the power-law scaling"） | 確認済み | 食べ物・燃費の場面（R3〜R6 の根拠） |
| F2 | コビトジャコウネズミ（Etruscan shrew）：体重は通常約1.8g、体長3〜5.2cm（尾を除く）。心拍は最大毎分1,511回（毎秒25回）。1日に体重の1.5〜2.0倍の食べ物を食べる必要がある。常に低体温の危険にさらされ、極めて速い代謝がなければすぐに低体温で死ぬ | https://en.wikipedia.org/wiki/Etruscan_shrew （"usually about 1.8 g" / "up to 1511 beats/min (25 beats/s)" / "must eat 1.5–2.0 times its body weight in food per day" / "is at a constant risk of hypothermia" / "would quickly die of hypothermia if not for its extremely rapid metabolism"） | 確認済み | 寒さ・空腹・心拍の場面（比較対象） |
| F3 | トガリネズミ類は、同程度の小型哺乳類から予想されるより代謝が高い。飼育下で1日に自分の体重の1/2〜2倍を食べ、ほとんど絶えず食べ続ける必要がある | https://en.wikipedia.org/wiki/Shrew （"Shrews have unusually high metabolic rates" / "can eat 1⁄2 to 2 times their own body weight in food daily" / "they need to eat almost constantly"） | 確認済み | 空腹の場面 |
| F4 | 二乗三乗の法則：大きさを倍率で変えると、表面積は倍率の2乗、体積は倍率の3乗に比例する。小さいもの（模型の蒸気機関の筒）は表面積の比が大きく熱を失いやすい。アリのような小さな動物は、どの高さから落とされても地面との衝突で深刻なけがをしない | https://en.wikipedia.org/wiki/Square%E2%80%93cube_law （"its new surface area is proportional to the square of the multiplier" / "its new volume is proportional to the cube of the multiplier" / "a small animal like an ant cannot be seriously injured from impact with the ground after being dropped from any height"） | 確認済み | 落下の場面・寒さの場面 |
| F5 | Haldane（1926年の随筆「On Being the Right Size」）：ネズミ（mouse）を1,000ヤードの立坑に落としても、地面が柔らかければ軽い衝撃を受けて歩き去る。小さい動物では落下への抵抗が駆動力に比べて相対的に10倍大きい | https://en.wikipedia.org/wiki/Terminal_velocity （Haldane の引用："You can drop a mouse down a thousand-yard mine shaft" / "it gets a slight shock and walks away" / "the resistance to falling in the case of the small animal is relatively ten times greater than the driving force"） | 確認済み（Terminal velocity の記事中の引用で確認。随筆の原文は開けず） | 落下の場面 |
| F5b | 同随筆の続き：ラット（rat）は死に、人は骨が砕け、馬は飛び散る | 検索結果（marxists.org の転載 https://www.marxists.org/archive/haldane/works/1920s/right-size.htm ） | 未確認（検索結果のみ） | 落下の場面（言うなら確認後） |
| F6 | 同随筆：風呂から出た人は厚さ約1/50インチの水の膜をまとい、その重さは約1ポンド。濡れたネズミは自分の体重ほどの水を運ばなければならない。水を飲みに行く昆虫は、食べ物を求めて崖から身を乗り出す人と同じくらい危険で、一度表面張力につかまる（＝濡れる）と溺れるまで抜け出せないことが多い | 検索結果（https://www.cs.utexas.edu/~witchel/S25-380L/papers/right-size.html ほかの転載の抜粋。"An insect going for a drink is in as great danger as a man leaning out over a precipice in search of food. If it once falls into the grip of the surface tension of the water—that is to say, gets wet—it is likely to remain so until it drowns."） | 未確認（検索結果のみ） | 雨・水たまりの場面（R8 の根拠） |
| F7 | 同随筆を扱う記事：昆虫は小さいので、酸素を運ぶ血流を持たない。多くの例は二乗三乗の法則に基づく | https://en.wikipedia.org/wiki/On_Being_the_Right_Size （"Insects, being so small, do not have oxygen-carrying bloodstreams."） | 確認済み | 語りでは不使用（予備） |
| F8 | 終端速度：同じ形・材質なら終端速度は大きいほど大きい。腹ばいのスカイダイバーの終端速度は約55m/s | https://en.wikipedia.org/wiki/Terminal_velocity （"the terminal velocity of an object increases with size" / "about 55 m/s (180 ft/s)"） | 確認済み | 落下の場面 |
| F9 | 雨粒の直径はふつう0.5〜4mm。2〜2.5mmを超えると少ない。最大は約6mmに限られる（記録上の最大は8.8mm）。直径3mmの雨粒の終端速度は約8m/s。約2mm未満はほぼ球形 | https://en.wikipedia.org/wiki/Raindrop （"Raindrop sizes typically range from 0.5 mm to 4 mm" / "effectively limiting the largest raindrops to about 6 mm diameter" / "a terminal velocity of approximately 8 m/s"） | 確認済み | 雨の場面（R7） |
| F10 | 炊いた白米100gは130kcal（米国の栄養表、長粒種・無塩で炊飯） | https://en.wikipedia.org/wiki/White_rice （"130 kcal (540 kJ)"）、https://en.wikipedia.org/wiki/Rice （中粒種 炊飯 "544 kJ (130 kcal)"） | 確認済み | 米粒の場面 |
| F11 | 精白米（うるち米）100gは358kcal（日本食品標準成分表2015年版（七訂）） | https://ja.wikipedia.org/wiki/白米 | 確認済み（ウィキペディア上の転載） | 米粒の場面（予備値） |
| F11b | 精白米（うるち米）100gは342kcal（日本食品標準成分表2020年版（八訂））。ごはん100gは156kcal（八訂） | 検索結果（米穀安定供給確保支援機構 https://www.komenet.jp/nandemobook/documents/ip_14-15w.pdf 。156kcal は検索でも確認できず） | 未確認（検索結果のみ） | 米粒の場面（R5 は342kcal で計算） |
| F12 | 玄米の千粒重（1,000粒の重さ）は一般米で約22g | 検索結果（酒類総合研究所 https://www.sbj.or.jp/wp-content/uploads/file/sbj/9705/9705_biomedia_5.pdf 、茨城県 https://www.pref.ibaraki.jp/nourinsuisan/noken/seika/h17pdf/documents/8.pdf ） | 未確認（検索結果のみ） | 米粒の場面（R5） |
| F13 | 日本人の平均身長（平成30年国民健康・栄養調査）：20歳以上男性168.0cm、20〜29歳男性171.7cm、20歳以上女性154.5cm | https://ja.wikipedia.org/wiki/身長 | 確認済み（ウィキペディア上の転載） | 冒頭・縮尺（R1） |
| F14 | 日本人20歳以上の平均体重（2019年、実測）：男性67.4kg、女性53.6kg。世界の成人平均は62.0kg（2005年データ、Walpole et al. 2012） | https://en.wikipedia.org/wiki/Human_body_weight （"67.4 kg" / "53.6 kg" / "62.0 kg"） | 確認済み | 縮尺（R2） |
| F15 | 日本人の基礎代謝量（基準体重）：18〜29歳男性1,510kcal/日（63.0kg）、30〜49歳男性1,530kcal/日（68.5kg）、18〜29歳女性1,120kcal/日、30〜49歳女性1,150kcal/日（厚生労働省「日本人の食事摂取基準（2010年版）」） | https://ja.wikipedia.org/wiki/基礎代謝 | 確認済み（ウィキペディア上の転載） | 食べ物の場面（R3・R4） |
| F16 | 日本の総人口は2025年7月時点で123,367,000人（総務省統計局 人口推計） | https://ja.wikipedia.org/wiki/日本の人口統計 （「2025年（令和7年）7月の時点で123,367,000人である」） | 確認済み（ウィキペディア上の転載） | 日本全体の場面（R6） |
| F17 | 世界人口は2026年時点で約83億人（大まかな近似）。2025年の表の値は8,231,613,070人。国連によると2022年11月15日に80億人に達した | https://en.wikipedia.org/wiki/World_population （"As of 2026, the world population is approximately 8.3 billion"） | 確認済み | 冒頭・世界の場面（R6） |
| F18 | 家猫の頭胴長は平均約46cm、体高23〜25cm（肩か頭かの記載なし）、成猫の体重はふつう4〜5kg。主に鳥と齧歯類などの小さな獲物を狩り、トカゲ・ヘビ・昆虫も獲物になる。聴覚は55Hz〜79kHz | https://en.wikipedia.org/wiki/Cat （"23–25 cm (9.1–9.8 in) in height" / "Cats hunt small prey, primarily birds and rodents" / "lizards, snakes and insects, may also become prey" / "55 Hz to 79 kHz"） | 確認済み | 猫の場面（R9） |
| F19 | 猫は米国で年に13億〜37億羽の鳥と63億〜223億匹の哺乳類を殺すと推計（Loss et al. 2013, Nature Communications）。大半は飼い主のいない猫による。猫は哺乳類・鳥・魚・爬虫類・両生類・無脊椎動物まで幅広く狩る | https://en.wikipedia.org/wiki/Cat_predation_on_wildlife （"cats kill between 1.3 and 3.7 billion birds and between 6.3 and 22.3 billion mammals each year"） | 確認済み | 猫の場面 |
| F20 | 日本の猫の推計飼育数は約915万匹（ペットフード協会「令和6年 全国犬猫飼育実態調査」、外猫を含まない）。2022年は883万7千頭 | 検索結果（日本食糧新聞 https://news.nissyoku.co.jp/news/yokoyama20250403121726914 、協会PDF https://petfood.or.jp/pdf/data/2024/1.pdf は開けず） | 未確認（検索結果のみ） | 猫の場面 |
| F21 | アシダカグモ：体長はメス20〜30mm、オス10〜25mm。脚を広げると約10〜15cm。網を張らず、近づいた昆虫を捕食。ゴキブリ・ハエ・ガ・カ・ハサミムシなどを食べ、本州では主に家の中のクロゴキブリを食べる | https://ja.wikipedia.org/wiki/アシダカグモ （「体長はメスで20 - 30 mm」「左右の歩脚を伸ばすと約100 mm（10 cm）ないし15 cm程度になる」） | 確認済み | 家の中の場面（R9） |
| F22 | ハエトリグモ類の体長はおおむね1〜25mm。肉食が主で、アリを専門に狩る種もいる。節足動物で最も優れた視覚の一つを持ち、色も見える。体長の38倍跳んだ個体の報告がある | https://en.wikipedia.org/wiki/Salticidae （"The body length of jumping spiders generally ranges from 1 to 25 mm"） | 確認済み | 家の中の場面 |
| F23 | スズメ：全長14〜15cm、体重25g程度。雑食で、イネ科などの種子や虫を食べる。繁殖期には子育てのために虫を好んで捕まえる | https://ja.wikipedia.org/wiki/スズメ （「全長14cm〜15cm」「体重は25 g程度」） | 確認済み | 屋外の場面（R9） |
| F24 | ハシブトガラス：全長57cm。雑食で木の実から昆虫、鳥の卵や小動物、人間の残飯まで食べる。ハシボソガラスより肉食傾向が強い | https://ja.wikipedia.org/wiki/ハシブトガラス （「全長57cm」） | 確認済み | 屋外の場面（R9） |
| F25 | クロオオアリ：働きアリの体長6〜16mm。日本列島に分布するアリの中で最大。雑食で昆虫や他種のアリも食べる。住宅地・公園など都市部でもよく見られる | https://ja.wikipedia.org/wiki/クロオオアリ | 確認済み | 屋外の場面（R9） |
| F26 | 住宅の階段は建築基準法で、蹴上げ230mm以下、踏面150mm以上、有効幅750mm以上などと定められている。家庭用階段の勾配は45度前後 | https://ja.wikipedia.org/wiki/階段 （「踏上寸法は230[mm]以下、踏みづら寸法は150mm以上」）。条文（建築基準法施行令第23条）の原文は開いていない | 確認済み（ウィキペディア上の記述。条文番号は未確認） | 家の中の場面（R9） |
| F27 | 声帯の長さは声の高さに影響する（弦楽器と同じ）。男性の声帯は1.75〜2.5cm、女性は1.25〜1.75cm、子どもはずっと短い。基本周波数は成人男性で平均約125Hz、成人女性約210Hz、子ども300Hz超 | https://en.wikipedia.org/wiki/Vocal_folds （"The length of the vocal cords affects the pitch of voice, similar to a stringed musical instrument." / "about 125 Hz in an adult male, 210 Hz in adult females, and over 300 Hz in children"） | 確認済み | 声の場面（R10） |

---

## 2. 推論（計算）

すべて推論。体の形・密度・体温がそのまま縮むと仮定した単純計算で、現実の動物の値ではない。モデルの人は「身長170cm・体重65kg」（F13・F14の日本人男性の値を丸めた仮定）とする。

| 番号 | 推論 | 計算 | 根拠 |
|---|---|---|---|
| R1 | 縮尺は1/170。体積・体重は1/170³＝1/4,913,000 | 170cm → 1cm。170³＝4,913,000 | F13 |
| R2 | 1cmの人の体重は約13mg（0.013g） | 65kg ÷ 4,913,000 ＝ 65,000,000mg ÷ 4,913,000 ≒ 13.2mg | F14・R1 |
| R2b | コビトジャコウネズミ（約1.8g）は1cmの人の約136倍重い。1cmの人は地上最小級の哺乳類よりはるかに小さい | 1,800mg ÷ 13.2mg ≒ 136 | F2・R2 |
| R3 | 1日の基礎代謝（クライバーの3/4乗で縮める）は約0.014kcal（約14cal） | 1,500kcal × (1/4,913,000)^0.75 ＝ 1,500 × 170^(−2.25) ≒ 1,500 × 9.58×10⁻⁶ ≒ 0.0144kcal。検算：近似式 3.4 × (1.32×10⁻⁵ kg)^0.75 ≒ 7.46×10⁻⁴ W → ×86,400秒 ÷ 4,184J ≒ 0.0154kcal/日（同じ式で65kgは約1,607kcal/日となり、F15 の約1,500kcal と近い） | F1・F15・R2 |
| R3b | 体重にそのまま比例させると約0.0003kcal（0.3cal）。クライバーの法則では体重比例の約47倍のエネルギーが要る。体重1kgあたりで見ると、ふつうの人の約47倍燃費が悪い | 1,500 ÷ 4,913,000 ≒ 0.000305kcal。0.0144 ÷ 0.000305 ≒ 47（＝170^0.75） | F1・R1 |
| R3c | 最小の動物の代謝は3/4乗の予測より高い傾向があり（F1）、トガリネズミ類は体重の0.5〜2倍を毎日食べる（F2・F3）。R3 の値は少なめの見積もりである | 定性的な推論 | F1〜F3 |
| R4 | 1日に要る生米の量は約4.2mg＝自分の体重の約3分の1 | 0.0144kcal ÷ 3.42kcal/g ≒ 0.0042g ＝ 4.2mg。4.2 ÷ 13.2 ≒ 0.32 | R3・F11b |
| R5 | 米1粒（約0.022g・約0.075kcal）で、クライバー計算なら約5日、体重比例なら約250日暮らせる | 0.022g × 3.42kcal/g ≒ 0.0752kcal。0.0752 ÷ 0.0144 ≒ 5.2日。0.0752 ÷ 0.000305 ≒ 246日。※千粒重22g は玄米の値（F12、未確認）。炊いても粒のエネルギーはほぼ同じ（水を吸うだけ）と仮定 | F12・F11b・R3 |
| R6 | 日本全員（約1億2,337万人）が1日に要るエネルギーは約177万kcal＝ふつうの人約1,200人分（クライバー）。体重比例なら約3.8万kcal＝約25人分。米粒にすると約2,360万粒＝生米約520kg/日 | 123,367,000 × 0.0144kcal ≒ 1,773,000kcal → ÷1,500 ≒ 1,182人分。÷0.0752 ≒ 2,357万粒 → ×0.022g ≒ 518kg。体重比例：123,367,000 × 0.000305 ≒ 37,700kcal → ÷1,500 ≒ 25人分 | F16・R3・R5 |
| R6b | 世界全員（約82億3,161万人）なら約1.18億kcal/日＝ふつうの人約7万9千人分（クライバー）、生米約35トン/日。体重比例なら約1,675人分 | 8,231,613,070 × 0.0144 ≒ 1.183×10⁸kcal → ÷1,500 ≒ 78,900人分。÷0.0752 × 0.022g ≒ 34.6t。体重比例：×0.000305 ≒ 2.51×10⁶kcal → ÷1,500 ≒ 1,675人分 | F17・R3・R5 |
| R7 | 直径3mmの雨粒は約14mgで、1cmの人（約13mg）とほぼ同じ重さ。2mmは約4mg、4mmは約34mg（人の約2.5倍）、最大級6mmは約113mg（約8.5倍）。それが約8m/sで落ちてくる | 体積 (4/3)π r³、水 1g/cm³。3mm：(4/3)π(0.15cm)³ ≒ 0.0141cm³ ＝ 14.1mg。2mm 4.2mg、4mm 33.5mg、6mm 113mg | F9・R2 |
| R8 | 水の膜の厚さが同じなら、濡れた1cmの人は自分の体重以上（約1.2倍）の水をまとう | 普通の人の膜 約1ポンド＝0.454kg（F6、未確認）。表面積は1/170²なので 0.454kg ÷ 28,900 ≒ 15.7mg。15.7 ÷ 13.2 ≒ 1.19倍 | F6・F4・R2 |
| R9 | 1cmの目線を170cmの人に置き換えると：猫の体高23〜25cm → 約39〜43m（13〜14階建て程度。1階≒3mは仮定）。ハシブトガラス57cm → 約97m。スズメ14〜15cm → 約24〜26m。階段の蹴上げ最大23cm → 約39m の段。アシダカグモ（脚を広げて10〜15cm） → 約17〜26m。クロオオアリ働きアリ6〜16mm → 約1.0〜2.7m（人と同じか大きい） | 実寸(cm) ÷ 1cm × 1.7m。例：25 × 1.7 ＝ 42.5m、57 × 1.7 ＝ 96.9m、23 × 1.7 ＝ 39.1m、0.6〜1.6 × 1.7 ＝ 1.02〜2.72m | F18・F21・F23〜F26 |
| R10 | 声帯も1/170（男性で約0.10〜0.15mm）。声の高さが弦のように長さに反比例すると単純化すると、男性の約125Hzは約2万1千Hzになる（猫には聞こえる範囲＝F18 の上限79kHz 以内）。※反比例は単純化で、F27 は「長さが高さに影響する」までしか言っていない | 1.75cm ÷ 170 ≒ 0.103mm、2.5cm ÷ 170 ≒ 0.147mm。125Hz × 170 ＝ 21,250Hz | F27・F18 |
| R11 | 落下：F4・F5 から、1cmの人は高い所から落ちても衝突で深刻なけがをしにくい側に入る（アリ・ネズミと同じ側）。終端速度は大きいほど大きい（F8）ので、人の約55m/sよりずっと遅い。具体的な速度は出典がないため言わない | 定性的な推論 | F4・F5・F8 |

## 3. 使わない・注意

- 「ネズミは死なず、ラットは死に、人は砕け、馬は飛び散る」（F5b）と「濡れると溺れる」（F6）は随筆原文を開けていない。語りで使う前に原文を確認する。
- ごはん100g＝156kcal（八訂）は検索でも確認できていない。語りではエネルギーの数字ではなく「米1粒で何日」（R5）のように身近なものに例える。
- R3 と R3b で結果が約47倍違う。語りで使う場合はクライバーの値（R3〜R6）を採り、体重比例の値は使わない。

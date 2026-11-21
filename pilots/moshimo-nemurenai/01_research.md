# 資料表・制作メモ：もしも人類が、眠れなくなったら？

- 調査日：2026-11-20。調査担当：Claude Code（調査用のサブエージェント＋本体での追加確認）
- **確認の状態**
  - 「確認済み」：原文のページを開き、文言を見たもの。この環境で開けたのは www.mlit.go.jp・en.wikipedia.org・www.jstage.jst.go.jp だけ。
  - 「二次資料で確認」：英語版 Wikipedia を開いて記述を確かめたもの。原典の論文は見ていない。
  - 「未確認（検索結果のみ）」：検索エンジンの抜粋・要約しか見ていないもの。サブエージェントの調査（S1〜S45）は、ページを開けなかったため、すべてこれにあたる。
- **開けなかった原資料**：pubmed.ncbi.nlm.nih.gov・pmc.ncbi.nlm.nih.gov・www.frontiersin.org・www.mhlw.go.jp・www.nhtsa.gov など。この環境のネットワークで遮断されている。許可先を広げるのは権限の拡張にあたるため、行っていない。
- **記号**
  - 【S◯】裏付けのある事実
  - 【P◯】制作上の仮定（`03_plan.md`「世界の前提」）
  - 【R◯】推論
  - 創作：物語の出来事
- **語りで研究・数字を使わない方針**
  - 台本のナレーションには、研究の名前・数字・「研究によると」を一切入れていない（CLAUDE.md の3D「もしも」動画ルール②）。
  - 研究は次の3つにだけ使う。
    - 症状の順番
    - 「分かっていないこと」の線引き
    - 時間軸と結末の設計

---

## 1. 急性の完全断眠（認知・感情・幻覚・マイクロスリープ）

- **S1★** 起きていて17〜19時間で、一部の課題成績が血中アルコール濃度（BAC）0.05%相当以下に落ちた。被験者39人（運輸業30・陸軍9）、最大28時間断眠と、BAC約0.1%までの飲酒を同じ人で比較（Williamson & Feyer 2000, Occup Environ Med 57:649-655）。「全課題でそう」ではなく「一部〜大半の課題」。17〜19時間は22:30〜1:00にあたり、体内時計の低下と分離できないという注記あり。
  URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC1739867 ／ 豪州政府版報告 https://www.infrastructure.gov.au/infrastructure-transport-vehicles/road-transport-infrastructure/safety/publications/2000/Fatig_Alc — 未確認（検索結果のみ）
- **S2** さらに長く起きていると、成績は投与した最大量（BAC 0.1%）相当に達した（同論文アブストラクト）。「0.1%相当は約18〜20時間で到達と予測」という記述も検索要約にあるが、どの課題かは未確認。
  URL: 同上 — 未確認（検索結果のみ）
- **S3** Dawson & Reid 1997「Fatigue, alcohol and performance impairment」Nature 388:235。書誌のみ確認。よく引用される「24時間起床≒BAC 0.10%」は米空軍安全記事など二次資料での表現で、原典の数値は検索で確認できず。
  URL: https://www.safety.af.mil/News/Features/Display/Article/434514/oh-man-am-i-beat/ （二次資料）／ NIOSH看護師研修 https://www.cdc.gov/niosh/work-hour-training-for-nurses/longhours/mod3/08.html — 未確認（検索結果のみ）。**「24時間＝0.1%」は原典確認まで台本に使わない。**
- **S4★** 断眠研究のシステマティックレビュー（Waters et al. 2018, Front Psychiatry 9:303）：対象は24時間〜11夜の断眠、計760人（平均72〜92時間）。知覚のゆがみ・不安・いらだち・離人感・時間の見当識障害は24〜48時間で始まり、48〜90時間で複雑な幻覚と思考の乱れ、72時間以降で妄想。最終的に急性精神病に似た状態。感覚別では視覚90%、体性感覚52%、聴覚33%の研究で変化。通常の睡眠で多くは回復したが全例ではない。極端な断眠実験は20世紀前半に多く、現在は非倫理的として行われない。（抜粋一致）
  URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC6048360 ／ https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2018.00303/full — 未確認（検索結果のみ）
- **S5** ランディ・ガードナー（1964年、17歳）は264時間（11日）起き続けた。一次報告は Gulevich, Dement & Johnson 1966。観察記録には4日目ごろの幻覚・妄想・注意持続の低下（ロス海軍少佐の記録）がある一方、デメントは「精神医学的な問題は起きなかった」と述べており、記述が観察者で食い違う。分析力・知覚・意欲・記憶・運動制御は低下。ギネスはこの種の記録を危険として認定・監視しなくなった。
  URL: https://www.npr.org/2024/01/28/1227217274/sleep-deprivation-record ／ https://www.psychiatrictimes.com/sleep-deprivation-psychosis-and-mental-efficiency ／ https://guinnessworldrecords.com/news/2023/1/whats-the-limit-to-how-long-a-human-can-stay-awake-733188 — 未確認（検索結果のみ）。**ガードナーは単一事例で、脳波上はマイクロスリープが出ていた可能性が論じられることがある（未確認）。本作の前提と違う条件の記録として扱う。**
- **S6★ マイクロスリープの定義** 15秒以下（文献により1〜15秒など幅あり）の短い睡眠の断片。脳波では覚醒時のα波（8〜13Hz）がθ波（4〜7Hz）に置き換わる。本人は眠ったと気づかないことがある。断眠後に起こりやすいが、十分寝ていても単調作業で起こりうる。検出法・定義は研究間で統一されていない。運転など持続的な注意が必要な場面で危険。
  URL: https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2021.564098/pdf ／ https://www.sleepfoundation.org/how-sleep-works/microsleep — 未確認（検索結果のみ）
  → 本作の前提表記案：「現実の寝不足の人は、数秒だけ勝手に眠る『マイクロスリープ』で少しずつ脳を休めている。この世界では、その数秒すら起きない」（前提は設定＝フィクションとして明示）。
- **S7** 35時間断眠した人は、嫌な画像を見たときの扁桃体の反応が強く、内側前頭前野と扁桃体の結合が弱まった（Yoo, Gujar, Walker 2007, Curr Biol 17:R877）。「60%以上反応が強い」はウォーカーの報道発表での発言で、論文の正確な指標は未確認。
  URL: https://newsarchive.berkeley.edu/news/media/releases/2007/10/22_sleeploss.shtml ／ https://www.sciencedaily.com/releases/2007/10/071022124729.htm — 未確認（検索結果のみ）

## 2. 慢性の部分断眠

- **S8★** 1日6時間以下（ベッド時間）を14日続けると、最大で2夜連続の完全断眠に相当する認知成績の低下。眠気の自己評価は頭打ちで、本人は低下にほとんど気づかない。注意の途切れは「15.84時間を超えた累積覚醒時間」に比例。4h/6h/8hの3群×14日＋3夜完全断眠群（Van Dongen et al. 2003, Sleep 26:117-126）。「up to（最大で）」が付く。
  URL: https://www.med.upenn.edu/uep/assets/user-content/documents/Van_Dongen_Dinges_Sleep_26_3_2003.pdf ／ https://pubmed.ncbi.nlm.nih.gov/12683469/ — 未確認（検索結果のみ）
- **S9** 66人を3/5/7/9時間（ベッド時間）×7日→8時間×3日で回復。3時間群は反応速度・注意の途切れが7日間悪化し続け、回復3日後も元に戻らず5〜7時間群並みで止まった。9時間群は基準のまま（Belenky et al. 2003, J Sleep Res 12:1-12）。
  URL: https://jhanley.biostat.mcgill.ca/bios601/Surveys/Belenky2003.pdf ／ https://pubmed.ncbi.nlm.nih.gov/12603781/ — 未確認（検索結果のみ）

## 3. 身体への影響（短期研究）

- **S10** 健康な若年男性11人、ベッド4時間×6夜で、十分寝た後より糖負荷への耐性が低下（p<0.02）、夕方のコルチゾール上昇、交感神経活動上昇（Spiegel, Leproult, Van Cauter 1999, Lancet 354:1435）。大学発表では「老化に似た変化」。
  URL: https://pubmed.ncbi.nlm.nih.gov/10543671/ ／ https://www.uchicagomedicine.org/forefront/news/1999/october/lack-of-sleep-alters-hormones-metabolism-simulates-effects-of-aging — 未確認（検索結果のみ）
- **S11** 若年男性12人、睡眠制限2日で食欲を抑えるレプチン18%減、食欲を増すグレリン28%増、空腹感24%増。高炭水化物の食べ物への欲求が特に増加（Spiegel et al. 2004, Ann Intern Med 141:846）。（抜粋一致）
  URL: https://pubmed.ncbi.nlm.nih.gov/15583226/ ／ https://www.uchicagomedicine.org/forefront/news/2004/december/sleep-loss-boosts-appetite-may-encourage-weight-gain — 未確認（検索結果のみ）
- **S12** 7日間の睡眠をアクチグラフで測ってから風邪ウイルスを鼻に入れた研究で、睡眠が短い人ほど風邪をひきやすかった（Prather et al. 2015, Sleep 38:1353）。報道では「5〜6時間の人は約4倍」。正確な倍率（4.2倍説）は未確認。
  URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC4531398 ／ https://www.ucsf.edu/news/2015/08/131411/short-sleepers-are-four-times-more-likely-catch-cold — 未確認（検索結果のみ）
- **S13** ワクチン：睡眠制限でインフルエンザワクチンの抗体反応が弱まった（Spiegel 2002 JAMA）。7研究のメタ解析で、客観的に測った短い睡眠は18〜60歳の抗体反応低下と関連（男性で明確、女性は有意でない）（Spiegel et al. 2023 Curr Biol）。
  URL: https://news.uchicago.edu/story/not-getting-enough-sleep-can-dilute-antibody-response-vaccination-study-finds — 未確認（検索結果のみ）
- **S14** 血圧：一晩の完全断眠で安静時血圧が上昇（例：平均82→86mmHg、8人、Kato et al. 2000 Hypertension）。筋交感神経活動はむしろ低下し、圧受容器反射の設定変更と解釈（Ogawa 2003 Sleep）。
  URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC3362107 ／ https://pure.fujita-hu.ac.jp/en/publications/total-sleep-deprivation-elevates-blood-pressure-through-arterial-/ — 未確認（検索結果のみ）
- **S15** 体温調節：人では結果が混在。寒冷下で1夜断眠後に深部体温が早く下がる研究がある一方、同研究は低体温の大きな危険因子ではないと結論。安静時に人の深部体温が下がり続けるという直接証拠は見つからず。ラットの長期断眠では進行性の体温低下が特徴（動物）。
  URL: https://pubmed.ncbi.nlm.nih.gov/33745159/ ／ https://pmc.ncbi.nlm.nih.gov/articles/PMC3490360 — 未確認（検索結果のみ）。**「人は眠れないと体温が下がり続ける」とは言わない。**
- **S16【動物研究】** マウスでは自然睡眠中（と麻酔中）に脳細胞間のすき間が約60%広がり、βアミロイドの除去が速まった（Xie et al. 2013, Science 342:373）。いわゆるグリンパティック系。人で同じ規模かは未確定。
  URL: https://pubmed.ncbi.nlm.nih.gov/24136970/ ／ https://www.nih.gov/news-events/news-releases/brain-may-flush-out-toxins-during-sleep — 未確認（検索結果のみ）

## 4. 致死性の証拠と限界

- **S17【動物研究】** ラットをディスク・オーバー・ウォーター法で完全断眠させると、中止しない限り全個体が死亡または死の兆候を示し、通常2〜3週間（Rechtschaffen & Bergmann 2002, Sleep 25:68 の総括）。摂食量増加にもかかわらず体重減少など。死因は未解明（感染説を抗生物質で検証した1996年研究などあり）。
  URL: https://www.gwern.net/doc/zeo/2002-rechtschaffen.pdf ／ https://pubmed.ncbi.nlm.nih.gov/7546318/ — 未確認（検索結果のみ。「2〜3週間」の文は抜粋で途中切れ）
- **S18【動物研究】** ハエとマウスで、断眠により腸に活性酸素（ROS）がたまる。ハエでは抗酸化物質の経口投与や腸での抗酸化酵素発現で、ほぼ眠らなくても通常寿命に戻った。マウスは腸のROS上昇の確認まで（死亡までの実験はハエ中心）。なぜ腸なのか、なぜ致死的かは未解明と著者自身が述べる（Vaccaro et al. 2020, Cell 181:1307）。
  URL: https://news.harvard.edu/gazette/story/2020/06/study-reveals-guts-role-in-causing-death-by-sleep-deprivation ／ https://hms.harvard.edu/news/sleep-death-gut — 未確認（検索結果のみ）
- **S19** 致死性家族性不眠症（FFI）：PRNP遺伝子のD178N変異（同じアレルのコドン129がメチオニン）によるプリオン病。主に視床の特定の核が変性し、進行性の不眠と自律神経障害。発症から死亡まで数か月〜数年（6〜36か月など資料により幅）。不眠だけでなく神経変性そのものが病態で、「眠れないから死ぬ」とは切り分けられない。
  URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC4601199 ／ https://pubmed.ncbi.nlm.nih.gov/29887141/ — 未確認（検索結果のみ）
- **S20** モルヴァン症候群：CASPR2抗体などが関わる自己免疫疾患で、重い不眠（agrypnia excitata）。1974年の1例で、睡眠ポリグラフ上ほぼすべての睡眠リズムが最長4か月消えたという報告（単一事例・二次資料経由）。治療で回復する例もある。
  URL: https://medlink.com/articles/morvan-syndrome-and-related-disorders-associated-with-caspr2-antibodies ／ https://en.wikipedia.org/wiki/Morvan%27s_syndrome — 未確認（検索結果のみ。Wikipedia経由の数字は台本に使わない）
- **S21** 人が完全断眠でどれだけ生きられるかは分かっていない。断眠そのもので人が死亡した確認例は見つからない（事故を除く）。48時間を超える断眠実験は現在非倫理的とされる（Waters 2018 ほか）。
  URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC6048360 ／ https://www.scientificamerican.com/article/how-long-can-humans-stay/ — 未確認（検索結果のみ）

## 5. 安全が重要な仕事

- **S22★** 米NHTSA：2017年、警察報告で眠気運転が関わる衝突9万1,000件、負傷約5万人、死者約800人（795人は二次資料）。2023年は633人。
  URL: https://www.nhtsa.gov/risky-driving/drowsy-driving — 未確認（検索結果のみ）
- **S23** 公式統計は過少とされ、AAA交通安全財団は2009〜2013年の死亡事故の21%に眠気運転が関与と推計（2014年）。2017〜2021年は17.6%（2024年報告）。GHSA 2026年報告は2023年の死者を6,300人超と推計（公式633人の約10倍）。推計値と公式値を混ぜない。
  URL: https://newsroom.aaa.com/2014/11/one-five-fatal-crashes-involve-drowsy-drivers/ ／ https://aaafoundation.org/?p=3159 ／ https://www.ghsa.org/sites/default/files/2026-02/Wake_Up_Call_2026_Update.pdf — 未確認（検索結果のみ）
- **S24★** 日本の自動車運送事業：事業者は、疾病・疲労・睡眠不足などで安全に運転できないおそれがある運転者を乗務させてはならない。乗務前点呼で睡眠不足の有無を確認する。「睡眠不足」は2018年6月1日施行の改正で追加（旅客自動車運送事業運輸規則・貨物自動車運送事業輸送安全規則）。条・項番号は未確認。
  URL: https://www.mlit.go.jp/common/001030085.pdf ／ https://wwwtb.mlit.go.jp/hokushin/niigata/unnsou/news/2018051603%20suimin.pdf ／ https://www.rodo.co.jp/news/45316/ — 未確認（検索結果のみ）
  → もしもの世界では「全員が睡眠不足」状態＝規則どおりなら誰も乗務できない、という推論は「推論」として扱う。
- **S25** 航空：ICAO は疲労を「睡眠不足・長時間覚醒・概日リズム・作業負荷などによって精神的・身体的な遂行能力が低下した生理的状態」と定義（後半の文言は抜粋途中切れ）。FRMS＝データに基づき疲労関連の安全リスクを継続的に監視・管理する仕組み（附属書6第I部）。
  URL: https://www.icao.int/safety/fatiguemanagement/frms%20tools/doc%209966.frms.2011%20edition.en.pdf ／ https://skybrary.aero/articles/fatigue-risk-management-system-frms — 未確認（検索結果のみ）
- **S26★** 研修医：24時間以上の連続勤務がある従来の勤務表では、なくした勤務表に比べICUでの重大医療過誤が35.9%多く（1,000患者日あたり136.0 vs 100.1）、重大な診断ミスは5.6倍（18.6 vs 3.3）（Landrigan et al. 2004, NEJM 351:1838）。（抜粋一致）
  URL: https://pubmed.ncbi.nlm.nih.gov/15509817/ ／ https://psnet.ahrq.gov/issue/effect-reducing-interns-work-hours-serious-medical-errors-intensive-care-units — 未確認（検索結果のみ）
- **S27** 同じ研修医20人で、連続勤務を16時間以内にすると週の労働が19.5時間減り、睡眠が週5.8時間増え、当直夜の注意の途切れ（ゆっくりした眼球運動）が半分未満に（Lockley et al. 2004, NEJM 351:1829）。5.8時間は「1晩」ではなく「1週」。
  URL: https://stacks.cdc.gov/view/cdc/197041 ／ https://psnet.ahrq.gov/issue/effect-reducing-interns-weekly-work-hours-sleep-and-attentional-failures — 未確認（検索結果のみ）
- **S28** 日本の医師の働き方改革（2024年4月〜）：勤務医の時間外・休日労働の上限は原則年960時間（A水準）、特例のB・連携B・C水準は年1,860時間。追加的健康確保措置として連続勤務28時間制限・勤務間インターバル9時間など（水準により義務/努力義務が異なる）。
  URL: https://www.mhlw.go.jp/content/10800000/000794598.pdf ／ https://iryou-kinmukankyou.mhlw.go.jp/ — 未確認（検索結果のみ）
- **S29 事故と疲労（信頼度に注意）**
  - エクソン・バルディーズ（1989年3月24日座礁）：NTSB 報告 MAR-90/04 は推定原因の一つに「三等航海士が疲労と過大な作業負荷のため適切に操船しなかった」を挙げる（他に船長の飲酒による見張り不備、会社の人員配置）。三等航海士は直前24時間で5〜6時間しか眠れなかった可能性。→ **疲労は公式報告で原因の一つ。比較的信頼できる**が、原文未確認。
    URL: https://ntsb.gov/safety/safety-recs/recletters/M90_32_43.pdf ／ https://evostc.state.ak.us/oil-spill-facts/details-about-the-accident/ — 未確認（検索結果のみ）
  - スリーマイル島（1979年3月28日午前4時）：大統領委員会（ケメニー報告）は機械の故障に運転員の判断ミス・訓練・管理の問題が重なったとする。疲労を原因とした記述は検索で見つからず。→ **「疲労が原因」と言わない。** 言えるのは「午前4時に始まった」まで。
    URL: https://tmi2kml.inl.gov/Documents/Common/Presidents%20Commission,%20(Main%20Report)%20The%20Need%20For%20Change,%20The%20Legacy%20of%20TMI-2%20(1979-10-30).pdf — 未確認（検索結果のみ）
  - チェルノブイリ：疲労原因説は通俗的で、公式調査の結論ではないとする資料あり。→ **言わない。**
  - これらを「深夜帯に起きた事故」として挙げた総説：Mitler et al. 1988「Catastrophes, Sleep, and Public Policy」Sleep 11:100（深夜の脳の状態との時間的一致を指摘したもので、因果を証明したものではない）。
    URL: https://www.scilit.net/publications/13e09ab7ec6456bb18debbb3eef7d4fd — 未確認（検索結果のみ）
- **S30** 日本の居眠り運転の全国件数（警察庁）は検索で取れず。令和7年の交通事故死者2,547人（統計のある1948年以降最少）は警察白書で見つかったが居眠り内訳なし。
  URL: https://www.npa.go.jp/publications/whitepaper/r08/pdf/08_dai5sho.pdf — 未確認（検索結果のみ）。**居眠り事故の日本の数字は使わない。**

## 6. 眠気の仕組み・麻酔

- **S31** 二過程モデル（Borbély 1982）：睡眠は、起きている間にたまり眠ると減る「睡眠圧（プロセスS）」と、体内時計の「プロセスC」の組み合わせで決まる。Sは脳波の徐波活動から導かれた。
  URL: https://pubmed.ncbi.nlm.nih.gov/26762182/ ／ https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9540767/ — 未確認（検索結果のみ）
  → 本作の前提との関係：眠気（S）は起きている限りたまり続け、体内時計（C）による波も残る、という設定は現実の仕組みと矛盾しない（ただし「眠れない」部分は架空）。
- **S32** アデノシン：長く起きていると前脳基底部・大脳皮質で細胞外アデノシンが増え、眠ると減る。眠気を生む物質の一つとして広く受け入れられているが、睡眠恒常性への直接の関与には議論あり。カフェインはアデノシン受容体（主にA1・A2A）をふさぐ拮抗薬で、眠気の信号を一時的に感じにくくするだけで、睡眠圧そのものは消さない（後半は一般的理解。文言の原典確認要）。
  URL: https://pubmed.ncbi.nlm.nih.gov/35575450/ ／ https://pmc.ncbi.nlm.nih.gov/articles/PMC2769007 — 未確認（検索結果のみ）
- **S33** 全身麻酔は自然な睡眠ではなく「薬で起こす可逆的な昏睡」に近い。麻酔科医は患者を安心させるため「眠る」と呼ぶ（Brown, Lydic, Schiff 2010, NEJM 363:2638）。
  URL: https://pmc.ncbi.nlm.nih.gov/articles/3162622 — 未確認（検索結果のみ）
- **S34【動物研究・限定的】** ラット32匹を24時間断眠後、6時間のプロポフォール麻酔をかけた群は、自然に眠らせた群と同じように断眠の回復（リバウンド睡眠の消失）を示した（Tung et al. 2004, Anesthesiology 100:1419）。他の麻酔薬（イソフルランなど）では結果が違う研究もある（未確認）。人で麻酔が睡眠負債を返せるかは未確立。
  URL: https://scilit.com/publications/6cc0da3458d8c04a68ef4317d83d708c — 未確認（検索結果のみ）

## 7. 社会

- **S35★** 厚労省「健康づくりのための睡眠ガイド2023」：成人は6時間以上を目安に必要な睡眠時間を確保。高齢者は寝床にいる時間を8時間以内を目安に（長すぎる床上時間がリスク）。小学生9〜12時間、中学・高校生8〜10時間。
  URL: https://www.mhlw.go.jp/content/001305530.pdf ／ https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/suimin/index.html — 未確認（検索結果のみ）
- **S36** 日本の平均睡眠はOECD比較で442分（7時間22分）、比較国で最短（2019年公表データ、nippon.com の二次記事）。米国528分など。OECDのデータは2024年に日本2021年分で更新済みのため現行値は要確認。
  URL: https://www.nippon.com/en/japan-data/h00424/ ／ https://www.oecd.org/en/data/datasets/time-use-database.html — 未確認（検索結果のみ）
- **S37** 国民健康・栄養調査（令和元年）：1日の平均睡眠が6時間未満の人は男性37.5%、女性40.6%。令和5年の数値は概要PDF19ページ以降にあるが抜粋に数字なし。
  URL: https://www.mhlw.go.jp/content/10900000/001338334.pdf（令和5年概要）— 未確認（検索結果のみ）
- **S38** #7119（救急安心センター事業）：医師・看護師・相談員が救急車を呼ぶべきかを助言し医療機関を案内する電話相談。2009年モデル事業から。2020年10月時点で17地域・人口カバー率46.0%（最新値は未確認）。
  URL: https://www.fdma.go.jp/publication/hakusho/r3/chapter2/section5/63762.html — 未確認（検索結果のみ）
- **S39** 睡眠薬市場規模：信頼できる公的数値は見つからず。**使わない。**

## 8. 家族・感情

- **S40** 一晩の完全断眠で、表情の感情の読み取りが落ちた。特に中程度の強さの「喜び」「怒り」で顕著、女性で目立ち、一晩の回復睡眠で戻った（van der Helm, Gujar, Walker 2010, Sleep 33:335）。男性では有意差なし。
  URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC2831427 — 未確認（検索結果のみ）
- **S41** 約100組の交際中カップルの日誌研究で、眠れなかった翌日は相手との衝突が多かった。実験室研究では、よく眠れなかった人と相手は衝突の話し合いで互いに否定的になり、解決が難しかった。ストレス・不安・抑うつでは説明されなかった（Gordon & Chen 2014, Soc Psychol Personal Sci 5:168）。
  URL: https://news.berkeley.edu/2013/07/08/sleep-fights/ ／ https://spsp.org/news-center/character-context-blog/how-your-sleep-affecting-your-relationship — 未確認（検索結果のみ）
- **S42** 出産後の睡眠：ドイツのパネル調査（母2,541人・父2,118人）で、最初の子の誕生後3か月、母親は妊娠前より平均約1時間、父親は約15分睡眠が短く、6年後も母約20分・父約15分短いまま（Richter et al. 2019, Sleep）。
  URL: https://warwick.ac.uk/newsandevents/pressreleases/new_parents_face ／ https://wrap.warwick.ac.uk/113259 — 未確認（検索結果のみ）
- **S43** 幼児：30〜36か月児10人で、昼寝を抜いた日は、楽しい画像への喜びが減り、解けないパズルでの怒り・不満が増えるなど感情表出が変化（Berger et al. 2012, J Sleep Res）。小規模。
  URL: https://pubmed.ncbi.nlm.nih.gov/21988087/ ／ https://pmc.ncbi.nlm.nih.gov/articles/PMC3258474 — 未確認（検索結果のみ。結果の具体的方向は要原典確認）

## 9. 高齢者・子ども・せん妄

- **S44** 健康な高齢者（65〜76歳11人）は若者（18〜29歳26人）より26時間覚醒による注意の低下が小さかった（Duffy et al. 2009, J Am Geriatr Soc）。慢性制限でも若者のほうが注意の失敗が多かった（Zitting et al. 2018, Sci Rep）。→「高齢者がいちばん弱い」とは言えない。
  URL: https://news.harvard.edu/gazette/story/2009/05/older-adults-found-to-fare-better-under-sleep-deprivation-than-younger-adults ／ https://pmc.ncbi.nlm.nih.gov/articles/PMC6056541 — 未確認（検索結果のみ）
- **S45** せん妄：入院中の高齢者の最大50%（一般病棟）・最大70%（ICU）に起きる。睡眠の分断はせん妄の、改善可能かもしれない危険因子とされるが、因果は未確立で双方向の可能性。
  URL: https://pmc.ncbi.nlm.nih.gov/articles/PMC7382993 ／ https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7530631/ — 未確認（検索結果のみ）

---

## まとめ：台本での扱いの区別

### (a) 現実の断眠で分かっていること（出典確認後に言い切ってよい）
- 起きている時間が延びると注意・反応が落ち、17〜19時間で一部課題が酒気帯び（BAC0.05%）相当（S1）。
- 24〜48時間で知覚のゆがみ・いらだち、48〜90時間で幻覚、72時間以降で妄想が出る傾向（S4）。
- 寝不足の人は数秒の「マイクロスリープ」が勝手に起きる（S6）。
- 6時間睡眠を2週間続けると最大2夜徹夜相当まで落ち、本人は気づきにくい（S8）。
- 寝不足で食欲ホルモン・糖代謝・血圧・免疫反応・感情の読み取り・夫婦げんかが悪い方向に動く（S10〜S14, S40, S41）。いずれも短期・少人数研究。
- 長時間勤務の研修医はミスが増える（S26, S27）。日本の運送業では睡眠不足の運転者を乗務させてはならない（S24）。

### (b) 分かっていないこと
- 人が完全に眠れない状態でどれだけ生きられるか（S21）。倫理的に実験できない。
- マイクロスリープすら起きない完全不眠が人に何を起こすか（現実の断眠実験はすべてマイクロスリープ込み）。
- 断眠が動物を死なせる仕組み（S17, S18）。
- 麻酔が人の睡眠の代わりになるか（S33, S34）。
- 人の脳の老廃物除去が睡眠でどれだけ変わるか（S16はマウス）。
- 日本の居眠り運転の全国件数、睡眠薬市場（S30, S39）。

### (c) 事実として言ってはいけないこと
- 「人は○日眠れないと死ぬ」「○週間で全滅」など死亡までの期限。ラットの2〜3週間（S17）、FFIの数か月（S19）、モルヴァンの4か月（S20）を人の期限に置き換えない。
- 「ガードナーは11日起きても平気だった」（記述が観察者で食い違う、S5）。
- 「24時間起きていると飲酒運転と同じ」「24時間＝BAC0.1%」（原典未確認、S3）。言えるのは「17〜19時間で一部課題が0.05%相当」まで。
- 「スリーマイル島・チェルノブイリは寝不足が原因」（S29）。
- 「眠れないと体温が下がり続ける」（人の証拠なし、S15）。
- 「麻酔で眠れば回復できる」（ラット1研究、S34）。
- 「高齢者が一番危ない」（S44は逆の結果）。
- Wikipedia・報道発表の数字（60%、4倍など）を原典確認なしに台本の数字にすること。
- もしもの世界の展開（物流停止、病院の崩壊など）は推論であり、現実の研究結果のように語らない。前提（眠気はあるが眠れない、マイクロスリープも起きない）はフィクションの設定として明示する。

---

## 本体での追加確認（2026-11-20）
- **S46 運送事業の睡眠不足の運転者**：バス・タクシー・トラック事業について、睡眠不足の乗務員を乗務させてはならないこと等を明確化し、点呼簿の記録事項に睡眠不足の状況を追加（平成30年4月20日発表）。国交省報道発表「睡眠不足に起因する事故の防止対策を強化します!!」 https://www.mlit.go.jp/report/press/jidosha02_hh_000341.html — **確認済み**（S24 を原文で確認）。
  - 一律の睡眠時間の基準は設けず、自己申告や普段との違いで判断する。この点と、施行日（平成30年6月1日）は検索結果のみ。
  - 第5章の「睡眠が足りず、安全に運転できない運転士は、ハンドルを握らせない決まりです」と、2〜3日目は本人の申告で乗務した設定の根拠。
- **S47 ランディ・ガードナーの記録**：1963年12月〜1964年1月、17歳で11日と25分（264.4時間）起き続けた。デメントは影響は小さいと報告した一方、健康管理のロス少佐は、気分の変化・集中と短期記憶の問題・妄想・幻覚を記録した。11日目には、100から7を引き続ける課題を65で止め、何をしていたか忘れたと答えた。ギネスは1997年以降この種の挑戦を受け付けていない。英語版 Wikipedia "Randy Gardner sleep deprivation experiment" https://en.wikipedia.org/wiki/Randy_Gardner_sleep_deprivation_experiment — **二次資料で確認**。
  - 原典 Gulevich et al. 1966（Arch Gen Psychiatry 15:29）は未読。
  - 期間の設計（P2：記録より短い9日間）の根拠。
- **S48 マイクロスリープ**：数秒程度の突然の短い睡眠またはまどろみで、感覚の入力に反応せず意識を失う。運転中に起きると、本人は数秒が過ぎたことに後で気づき、眠っていたとは分からない。英語版 Wikipedia "Microsleep" https://en.wikipedia.org/wiki/Microsleep — **二次資料で確認**。
  - S6 と合わせて、前提 P1「数秒の居眠りも起きない」の定義に使う。
- **S49 断眠の影響の一覧**：不安・いらだち・行動の乱れ・認知の低下・精神病様のエピソードなど。英語版 Wikipedia "Sleep deprivation" https://en.wikipedia.org/wiki/Sleep_deprivation — **二次資料で確認**（S4 の方向性の裏付け。数字は使わない）。
- **S50 致死性家族性不眠症**：不眠に加えて、パニック・妄想・幻覚・急な体重減少・認知症。発症から死亡まで通常7〜36か月（Wikipedia では要出典の記述）。同上 — **二次資料で確認**。人の期限に置き換えない（S19）。

---

## 時間軸の設計

| 画面の時間 | 物語の出来事 | 現実の研究との関係 |
|---|---|---|
| 1日目 午後11時〜2日目 朝 | 眠りに落ちる一瞬が来ない | 前提 P1（創作） |
| 2日目 | 増えた時間を楽しむ。同じ問題の答えが毎回違う | 起きている時間が長いと注意・作業成績が落ちる（S1・S8、未確認）。時期は合わせていない |
| 3日目 | 家事・仕事・服薬の小さなミス。ブレーキの遅れ、点滴の桁の誤り | 同上。研修医の長時間勤務でミスが増える（S26、未確認）。失敗は「反応の遅れ・読み違え」で描き、マイクロスリープ（意識の途切れ）としては描かない（P1） |
| 4日目 | 運休（決まりによる） | S46（確認済み） |
| 4日目 夜 | 表情を読み違える・口論 | 断眠で表情の感情を読み取りにくくなる（S40）、寝不足の翌日はカップルの衝突が増える（S41）。どちらも未確認 |
| 6日目 | 見えるもの・聞こえるもののゆがみ | 断眠で知覚のゆがみ→幻覚の順に出る傾向（S4、未確認／S49 二次資料で確認）。研究ではもっと早い時期に出るが、研究はマイクロスリープを含む条件なので、時期を合わせない |
| 7〜9日目 | 救急車の遅れ、薬の取り違えかけ、手術の延期、夜中の混乱 | 推論・創作（R1〜R3） |
| 10日目 夜 | 眠りが戻る | 前提 P2（創作）。人の完全な断眠の記録（S47：264時間、マイクロスリープを含む条件）より短くとどめ、死の期限を描かない |

**描かないこと（S の (c) と同じ）**：「◯日で死ぬ」。ラット（S17）、FFI（S19・S50）、モルヴァン（S20）の経過を人の期限にすること。「24時間起きていると飲酒運転と同じ」。

## 章ごとの事実・仮定・創作の整理

| 章 | 語りの内容 | 根拠 |
|---|---|---|
| 00・01 | 眠いのに眠れない、うとうともしない、意識が途切れない | P1（創作）、S6・S48（マイクロスリープの定義） |
| 02 | 夜も使える、答えが毎回違う、眠気はたまり続ける | P1、S8・S31（睡眠圧がたまる仕組み、未確認） |
| 03 | おつりの間違い、鍋の火、薬の二度飲み | 創作。S1・S8（未確認）の方向性 |
| 04 | ブレーキの遅れ、二人で読み上げる確認 | 創作。S26（未確認） |
| 05 | 睡眠が足りず安全に運転できない運転士は乗せない決まり | **S46（確認済み）**。電車・飛行機の減便・欠航は作中の判断 |
| 06 | 疲れた顔が怒った顔に見える、短い返事が冷たく聞こえる | S40・S41（未確認）の言い換え |
| 07 | 学校が休み、答えを消して同じ答え | 創作 |
| 08 | 麻酔で意識をなくすことは、眠ることとは違う | S33（未確認）。目覚めた後も眠気が消えないのは P3（創作） |
| 08 | 体の中で何が起きているのか、まだ誰にも分からない | S21（未確認）＋本作の条件が未知であること |
| 09 | 横切る影、知らない子ども、名前を呼ばれる | S4（未確認）・S49（二次資料で確認）。時期は合わせていない |
| 10 | 荷物が減る、集会所で分け合う | R3（推論）・創作 |
| 11 | 救急車が遅れる、AED、胸骨圧迫 | 創作。救急隊の判断は P4 |
| 12 | 浄水場の操作を最小限に、手術の延期 | 創作（P4）。実在の組織の方針ではない |
| 13 | 夜中に家に帰ると言う祖母 | 創作。高齢者のせん妄と睡眠の関係は因果が未確立（S45）なので、原因を語らない |
| 14・15 | 眠りが戻る、9日間に戻らないもの | P2（創作） |

## 推論（R）
- **R1**：全員が眠れない → 運転・医療・設備監視の人も同じ状態 → 失敗の確率が上がる（S1・S26 の方向性）。数字は言わない。
- **R2**：運送事業には睡眠不足の運転者を乗務させない決まりがある（S46）→ 全員が当てはまれば、運休が決まりから導かれる。
- **R3**：運休・減便 → 通院・物流・救急の遅れ → 別の命が待たされる。

## 未確認事項（公開前に原文で確認する）
- S1〜S45（論文・厚労省資料）は検索結果のみ。特に、時間軸の設計に使った S4（Waters 2018）、S6、S8、S33、S40、S41。
- S46 の施行日（平成30年6月1日）と、一律の睡眠時間の基準がないこと。
- 確認には pmc.ncbi.nlm.nih.gov・pubmed.ncbi.nlm.nih.gov・www.mhlw.go.jp を開ける環境が必要。

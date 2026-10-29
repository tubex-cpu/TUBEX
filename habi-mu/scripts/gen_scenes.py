# テンプレート（仁徳天皇陵判決のもの）。新しい動画では habi-<題材>/scripts/ にコピーし、場面・素材・文言を書き換えて使う。
# 使い方: python3 gen_scenes.py habi-<題材>
# ムー大陸判決：シーンファイルをまとめて生成する
import collections, sys, re
root = sys.argv[1]
A1 = 'MuArt1'; A2 = 'MuArt2'; A3 = 'MuArt3'; A4 = 'MuArt4'
def arts_of(path):
    return set(re.findall(r'^export const (\w+)', open(path).read(), re.M))
a1set = arts_of(f'{root}/src/components/{A1}.tsx'); a2set = arts_of(f'{root}/src/components/{A2}.tsx'); a3set = arts_of(f'{root}/src/components/{A3}.tsx'); a4set = arts_of(f'{root}/src/components/{A4}.tsx')

# (from, to or None, 'p'/'a'/'v', photoId or ArtName or verdict, label, move)
S = {
 'Intro': ('introCaptions', None, None, [
  (0,0,'a','MuRises','1万2000年前の太平洋',None),
  (1,2,'a','MuCities','7つの大都市、6400万人',None),
  (3,4,'a','MuSinking','ひと晩で、海の底へ',None),
  (5,5,'a','MuNameReveal','その名は、ムー',None),
  (6,6,'a','SurvivorsFlee','生き残りは、島々へ？',None),
  (7,7,'p','nanmadol-a','ムーの都の跡？','out'),
  (8,8,'p','nanmadol-b','墓を暴いた男','left'),
  (9,9,'p','tongariki-a','海に背を向ける石像',None),
  (10,10,'p','yonaguni-a','海の底の、巨大な階段',None),
  (11,11,'a','JapanRootsClaim','日本人のルーツは、ムー？',None),
  (12,12,'a','LastFragment','最後のかけら？',None),
  (13,14,'a','NoOldRecord','古い記録が、ない？',None),
  (15,15,'a','WhoCounted','誰が、数えた？',None),
  (16,16,'p','madrid-a','名前は、どこで生まれた？','out'),
  (17,17,'p','nanmadol-c','本当に1万2000年前？',None),
  (18,19,'a','WalkingStatueTease','石像は、歩いた？',None),
  (20,None,'p','pacific-night','今夜は、長い法廷になる','out')]),
 'Clue1Name': ('clue1NameCaptions','第1の手がかり','ムーは、古代から語り継がれてきた？', [
  (0,1,'p','churchward-mapbook','映画、漫画、雑誌の定番','out'),
  (2,2,'a','MuuEmpire','海の底の「ムウ帝国」',None),
  (3,4,'a','AncientLegend','何千年も前から？',None),
  (5,5,'a','Back160','160年前へ',None),
  (6,6,'p','brasseur','フランスの神父',None),
  (7,7,'p','palenque','中米のマヤ文明','out'),
  (8,8,'a','UnreadGlyphs','誰にも読めない文字',None),
  (9,9,'p','madrid-museum','マドリードの図書館で','left'),
  (10,10,'p','landa','宣教師ランダ',None),
  (11,12,'p','landa-alphabet','文字とアルファベットの対応表？',None),
  (13,13,'a','KeyFound','これで読める？',None),
  (14,15,'p','madrid-b','マヤの絵文書','out'),
  (16,17,'a','ReadAsMu','ある文字を「ムー」と',None),
  (18,19,'a','NameBirth','名前の、はじまり',None),
  (20,22,'v','wrong',None,None),
  (23,None,'p','madrid-c','本には、何が書かれていた？',None)]),
 'Clue2Maya': ('clue2MayaCaptions','第2の手がかり','マヤの本には、沈んだ大陸が書かれていた？', [
  (0,1,'p','landa-alphabet-2','表の、落とし穴',None),
  (2,3,'a','NotAlphabet','アルファベットでは、ない？',None),
  (4,4,'a','KanjiKana','漢字とかなに近い',None),
  (5,6,'a','WrongKey','合わない鍵',None),
  (7,9,'a','CrossedAnswers','すれ違った質問と答え',None),
  (10,10,'p','codex-calendar','沈んだ土地の物語は？',None),
  (11,12,'a','Knorozov1952','1952年、新しい読み方',None),
  (13,14,'a','BeRoad','「B」と聞かれて',None),
  (15,16,'p','knorozov','解読を進めた研究者',None),
  (17,17,'p','copan-stela','王の名前、即位の日付','out'),
  (18,19,'a','KeyReborn','解読の鍵に',None),
  (20,22,'v','wrong',None,None),
  (23,None,'p','stela-catherwood','物語は、どう広まった？',None)]),
 'Clue3Queen': ('clue3QueenCaptions','第3の手がかり','ムーの女王は、エジプトに文明を伝えた？', [
  (0,0,'p','leplongeon','探検家ル・プロンジョン',None),
  (1,1,'p','alice','妻のアリス',None),
  (2,3,'p','lp-chichen','チチェン・イッツァで','out'),
  (4,5,'a','MayaEgyptOlder','マヤは、エジプトより古い？',None),
  (6,7,'p','queenmoo-naga','女王ムーの物語',None),
  (8,9,'a','QueenRoute','海を渡って、エジプトへ？',None),
  (10,10,'p','sphinx','スフィンクスも、マヤから？','out'),
  (11,12,'p','queenmoo-wings','1896年の本',None),
  (13,15,'p','queenmoo-rain','壁画と彫刻の、本当の意味',None),
  (16,16,'a','NoContact','つなぐ遺物は？',None),
  (17,17,'a','MayaEgyptGap','時代も、合わない',None),
  (18,18,'p','sphinx-1839','今の考古学の見方',None),
  (19,20,'p','lp-monjas','写真は、本物の記録','out'),
  (21,23,'v','wrong',None,None),
  (24,None,'a','PhotosRemain','マヤの女王が、太平洋へ？',None)]),
 'Clue4Churchward': ('clue4ChurchwardCaptions','第4の手がかり','6400万人が暮らす大陸があった？', [
  (0,1,'a','MuBook1926','1926年、1冊の本',None),
  (2,3,'p','churchward','ジェームズ・チャーチワード',None),
  (4,5,'a','MuExtent','太平洋のまんなかに',None),
  (6,7,'p','churchward-map','本に描かれたムー大陸',None),
  (8,11,'a','GasChambers','なぜ、沈んだ？',None),
  (12,12,'p','nanmadol-d','南の島々の遺跡は、名残？',None),
  (13,14,'a','MuSeries','ムーの本は、続いた',None),
  (15,18,'a','MuInJapan','日本にも届いた',None),
  (19,20,'a','WhereFrom','どこから来た数字？',None),
  (21,22,'p','churchward-2','答えは、本の中に',None),
  (23,24,'a','OneManReading','ひとりの読み解き',None),
  (25,27,'v','wrong',None,None),
  (28,None,'a','TwoRecords','すべての土台',None)]),
 'Clue5Tablets': ('clue5TabletsCaptions','第5の手がかり','ムーの記録が刻まれた粘土板がある？', [
  (0,2,'p','india-temple','インドの寺院の粘土板？','out'),
  (3,4,'a','OnlyThreeReaders','読めるのは、ほかに2人だけ？',None),
  (5,7,'p','niven','鉱物の研究者ニーヴン',None),
  (8,8,'p','mexico-valley','メキシコの石の板','out'),
  (9,10,'a','WhereNow','今、どこにある？',None),
  (11,13,'a','MissingEvidence','確かめる手がかりは？',None),
  (14,17,'a','ReburiedTablets','埋め戻された石の板',None),
  (18,20,'a','FakeSuspicion','本物か、偽物か',None),
  (21,22,'a','TwoPillars','大陸を支えた2本の柱',None),
  (23,25,'v','wrong',None,None),
  (26,None,'p','nanmadol-e','南の海の、黒い石の都','out')]),
 'Clue6NanMadol': ('clue6NanMadolCaptions','第6の手がかり','南の海の石の都は、ムーの都だった？', [
  (0,0,'a','PohnpeiMap','ミクロネシアのポンペイ島',None),
  (1,2,'p','nanmadol-f','人の手で造られた、100の島','out'),
  (3,4,'p','nanmadol-g','太平洋のベネチア',None),
  (5,6,'a','BasaltCrib','井げたに積んだ玄武岩',None),
  (7,8,'a','MuCapitalClaim','ムーの都の跡？',None),
  (9,10,'p','nanmadol-h','いつ造られた？','left'),
  (11,13,'a','UThClock','サンゴの時計',None),
  (14,16,'a','NanMadolDates','年代は？',None),
  (17,18,'a','HeianKamakura','日本でいえば',None),
  (19,19,'a','Not12000','1万2000年前？',None),
  (20,23,'a','SaudeleurRule','島を治めた王たち',None),
  (24,24,'a','BasaltTons','75万トンの石',None),
  (25,25,'a','QuarryRoute','石は、どこから？',None),
  (26,26,'a','HowMoved','どうやって運んだ？',None),
  (27,28,'p','nanmadol-i','築いたのは、島の人々',None),
  (29,31,'a','DangerList','危機にさらされた世界遺産',None),
  (32,34,'v','wrong',None,None),
  (35,None,'p','nanmadol-j','墓を暴いた男','out')]),
 'Clue7Curse': ('clue7CurseCaptions','第7の手がかり','墓を暴いた男は、呪いで命を落とした？', [
  (0,0,'a','GermanColony','ドイツの植民地',None),
  (1,1,'p','ponape-1899','ドイツの役人ベルク',None),
  (2,3,'a','KingTomb','王の墓',None),
  (4,5,'p','nanmadol-k','1907年4月',None),
  (6,7,'a','NightOfCurse','墓の主の怒り？',None),
  (8,10,'p','nanmadol-l','作り話ではない','left'),
  (11,12,'a','DeathRecord','記録に残る死因',None),
  (13,13,'a','SunAndStone','赤道に近い島',None),
  (14,16,'a','NoChainDeaths','その後に調べた人々は？',None),
  (17,20,'a','AncestorsPlace','呪いの話が伝えるもの',None),
  (21,23,'v','wrong',None,None),
  (24,None,'p','nanmadol-m','もうひとつの宝の話','out')]),
 'Clue8Platinum': ('clue8PlatinumCaptions','第8の手がかり','海の底に、プラチナの棺が眠る？', [
  (0,2,'a','PlatinumCoffin','白く光る棺？',None),
  (3,6,'a','JapaneseDiverClaim','日本の潜水夫が見つけた？',None),
  (7,9,'a','NanyoMap','南洋群島',None),
  (10,12,'a','NoEvidenceList','証拠は？',None),
  (13,13,'a','LostInWar','「記録は失われた」',None),
  (14,16,'a','LidarFields','森の下に広がるもの',None),
  (17,19,'v','wrong',None,None),
  (20,None,'p','moai-nau','ムーの生き残りの島？','out')]),
 'Clue9Moai': ('clue9MoaiCaptions','第9の手がかり','モアイは、沈んだ大陸を見張っている？', [
  (0,0,'p','rapanui-land','イースター島、ラパ・ヌイ','out'),
  (1,2,'a','EasterMap','太平洋にぽつんと',None),
  (3,3,'p','tongariki-b','900体以上の巨大な石像',None),
  (4,5,'a','MountainTop','大陸の山の頂？',None),
  (6,7,'a','FacingClaim','海に背を向ける',None),
  (8,10,'a','WatchOrBarrier','何を見張っている？',None),
  (11,14,'p','tongariki-c','本当に、内陸を向いている','left'),
  (15,16,'p','moai-akahanga','一族の祖先の姿',None),
  (17,19,'a','FacingVillage','見つめていたのは、村',None),
  (20,22,'p','akivi','海を見る7体',None),
  (23,24,'p','raraku-south','ラノ・ララク','out'),
  (25,26,'p','raraku-moai','造りかけのモアイ',None),
  (27,29,'v','wrong',None,None),
  (30,None,'p','tongariki-d','どうやって運んだ？','out')]),
 'Clue10Walk': ('clue10WalkCaptions','第10の手がかり','重いモアイは、引きずって運ばれた？', [
  (0,1,'a','MoaiSize','10メートル、数十トン',None),
  (2,3,'a','SledgeTheory','寝かせて、引きずった？',None),
  (4,5,'a','WalkedLegend','島の言い伝え',None),
  (6,7,'p','raraku-volcano','2025年秋の研究',None),
  (8,9,'a','RoadMoaiCount','道のモアイ',None),
  (10,12,'a','DBaseLean','前に傾く体',None),
  (13,14,'a','RopeWalk','ロープで左右に',None),
  (15,16,'a','EighteenPeople','18人で、歩いた',None),
  (17,18,'a','ConcaveRoad','道にも、秘密',None),
  (19,20,'p','moai-traveling','反論もある','left'),
  (21,21,'a','ThreeAgree','3つの証拠',None),
  (22,24,'v','wrong',None,None),
  (25,None,'p','tongariki-e','歩かせた人々は、どこから？',None)]),
 'Clue11Settle': ('clue11SettleCaptions','第11の手がかり','イースター島の人々は、沈んだ大陸から逃げてきた？', [
  (0,2,'a','SurvivorClaim','ムーの生き残り？',None),
  (3,5,'p','rapanui-hills','島に人が来たのは、いつ？','out'),
  (6,6,'a','CleanSamples','まちがいやすい試料を除く',None),
  (7,7,'a','SettleDate','およそ800年前',None),
  (8,8,'a','Again800','ここでも、800年前',None),
  (9,11,'a','VoyagingSkills','星、波、風、鳥',None),
  (12,13,'p','hokulea','ホクレア号','out'),
  (14,15,'a','NoInstruments','羅針盤も、地図も、機械もなし',None),
  (16,16,'p','mau','航海士マウ・ピアイルグ',None),
  (17,17,'a','HokuleaRoute','ハワイからタヒチへ',None),
  (18,19,'a','BeyondHorizon','自分たちの意思で',None),
  (20,22,'v','wrong',None,None),
  (23,None,'p','rapanui-coast','もうひとつの、恐ろしい話','out')]),
 'Clue12Collapse': ('clue12CollapseCaptions','第12の手がかり','イースター島の人々は、木を切りつくして滅んだ？', [
  (0,2,'a','ForestGone','森は、どこへ？',None),
  (3,8,'a','CollapseStory','広く知られた「崩壊」',None),
  (9,12,'a','GenomeNoCrash','遺伝子に残る記録',None),
  (13,15,'a','FarmCapacity','島で養える人数',None),
  (16,16,'a','RockGarden','石を並べた畑',None),
  (17,20,'a','ToSouthAmerica','南アメリカまで',None),
  (21,21,'a','RealDecline','人口を減らしたもの',None),
  (22,22,'p','rapanui-people','今も島に暮らす人々',None),
  (23,25,'v','wrong',None,None),
  (26,None,'a','YonaguniMap','日本の海へ',None)]),
 'Clue13Yonaguni': ('clue13YonaguniCaptions','第13の手がかり','沖縄の海の底に、ムーの遺跡がある？', [
  (0,1,'p','yonaguni-island','日本のいちばん西','out'),
  (2,4,'a','UnderwaterSteps','水深25メートルの階段',None),
  (5,7,'p','yonaguni-b','1986年、ダイバーが見つけた',None),
  (8,13,'a','KimuraClaim','人工か、自然か',None),
  (14,17,'a','SandstoneJoints','自然にできる階段',None),
  (18,18,'a','Kuroshio','黒潮',None),
  (19,20,'p','yonaguni-c','意見は、分かれている','left'),
  (21,27,'a','SeaLevelRise','海面は、120メートル上がった',None),
  (28,30,'v','wrong',None,None),
  (31,None,'a','ForbiddenRumor','近づけない島',None)]),
 'Clue14Forbidden': ('clue14ForbiddenCaptions','第14の手がかり','上陸禁止の島が、ムーの証拠を隠している？', [
  (0,3,'p','okinoshima-sea','上陸禁止の島は、ある？','out'),
  (4,4,'a','OkinoshimaMap','玄界灘の沖ノ島',None),
  (5,6,'p','okitsumiya','宗像大社の沖津宮',None),
  (7,9,'a','OkinoshimaRules','島の掟',None),
  (10,12,'a','EightyThousand','海の正倉院',None),
  (13,16,'a','SentinelMap','インド洋の島',None),
  (17,20,'a','ProtectReasons','何を守っている？',None),
  (21,23,'v','wrong',None,None),
  (24,None,'p','coralsea','地図から消された島','out')]),
 'Clue15Sandy': ('clue15SandyCaptions','第15の手がかり','太平洋には、地図から消された島がある？', [
  (0,0,'a','SandyMap','サンゴの海',None),
  (1,4,'a','ChartWithIsland','100年以上、地図に',None),
  (5,7,'a','ChartErased','2012年、消えた',None),
  (8,11,'p','southern-surveyor','研究船サザン・サーベイヤー号',None),
  (12,15,'a','DepthSounding','そこには、何もなかった',None),
  (16,18,'a','SandyTimeline','気づいていた人々',None),
  (19,20,'a','OnlyOnPaper','地図の上だけの島',None),
  (21,23,'v','half',None,None),
  (24,None,'p','sclater','科学者も信じた？',None)]),
 'Clue16Lemuria': ('clue16LemuriaCaptions','第16の手がかり','科学者も、海に沈んだ大陸を信じていた？', [
  (0,2,'a','LemuriaBridge','もうひとつの消えた大陸',None),
  (3,5,'p','lemur','レムールの化石','out'),
  (6,7,'a','LemurPuzzle','沈んだ陸の橋？',None),
  (8,9,'a','FixedContinents','動かない大陸',None),
  (10,10,'p','madagascar','人類の故郷？','out'),
  (11,12,'p','wegener','ヴェーゲナー',None),
  (13,14,'a','DriftApart','大陸が、動く',None),
  (15,17,'a','PlateAccepted','プレートテクトニクス',None),
  (18,20,'v','correct',None,None),
  (21,None,'p','pacific-sea','太平洋の海の底へ','out')]),
 'Clue17Seafloor': ('clue17SeafloorCaptions','第17の手がかり','太平洋の海の底に、大陸が沈んでいる？', [
  (0,2,'a','GraniteMu','花こう岩の大陸？',None),
  (3,3,'p','granite','大きな手がかり',None),
  (4,7,'a','CrustSection','大陸の岩、海の底の岩',None),
  (8,10,'a','WoodAndStone','木は浮き、石は沈む',None),
  (11,11,'p','pillow-basalt','花こう岩は浮かぶ',None),
  (12,13,'a','NoSunkenCrust','太平洋の海底は？',None),
  (14,16,'p','hess','地質学者ハリー・ヘス',None),
  (17,20,'a','EchoSounder','音で深さを測る',None),
  (21,21,'p','guyot-map','ギヨー',None),
  (22,24,'a','GuyotStory','なぜ平らなのか',None),
  (25,26,'a','CoralOnTop','頂上のサンゴ',None),
  (27,28,'p','seamount','沈んだ島は、本当にある','out'),
  (29,31,'v','wrong',None,None),
  (32,None,'a','RingOfFire','日本は？',None)]),
 'Clue18Japan': ('clue18JapanCaptions','第18の手がかり','次に沈むのは、日本列島？', [
  (0,2,'p','japan-space','火山と地震の帯のまんなか','out'),
  (3,4,'a','JapanAncestors','日本人のルーツは？',None),
  (5,7,'a','Subduction','地震が起きる仕組み',None),
  (8,10,'a','NotGasCollapse','ムーの仕組みとは別物',None),
  (11,14,'a','PrepareReal','本当に備えるべきこと',None),
  (15,17,'a','NoMuNoRoots','ないものは、ルーツにならない',None),
  (18,19,'p','japan-coast','長い旅の物語','out'),
  (20,22,'v','wrong',None,None),
  (23,23,'a','EighteenDone','18の手がかりの、その先',None),
  (24,None,'p','pacific-wave','海は、大陸を呑み込んでいた','out')]),
 'RootsStory': ('rootsStoryCaptions','本当の物語','本当に沈んでいた大陸', [
  (0,2,'p','nz-alps','2017年の論文','out'),
  (3,4,'a','ZealandiaMap','ジーランディア',None),
  (5,7,'a','Zealandia94','94％が、海の下',None),
  (8,8,'p','newcaledonia','海の上に出ている、ほんの一部',None),
  (9,11,'a','GondwanaStretch','何千万年もかけて',None),
  (12,14,'p','nz-coast','沈んだ大陸は、本当にあった','left'),
  (15,15,'p','northsea','沈んだのは、大陸だけではない','out'),
  (16,20,'a','Doggerland','ドッガーランド',None),
  (21,22,'p','moai-stars','本当の話のほうが、面白い',None),
  (23,23,'p','nanmadol-n','海の上の石の都',None),
  (24,24,'p','hokulea-2','星を読む航海',None),
  (25,25,'p','tongariki-f','歩いた石像',None),
  (26,None,'a','RealStories','そして、本物の大陸',None)]),
 'UnsolvedMystery': ('unsolvedMysteryCaptions','未決','まだ解けていない謎', [
  (0,1,'p','rapanui-land-2','ボクにも、まだ判決が出せない謎','out'),
  (2,4,'p','rongo-b','木の板に刻まれた記号',None),
  (5,5,'p','rongo-c','ロンゴロンゴ',None),
  (6,7,'a','UnderThirty','30点未満、誰にも読めない',None),
  (8,10,'a','IndusClaim','インダス文字と、そっくり？',None),
  (11,12,'p','rongo-staff','いつ生まれた？',None),
  (13,14,'a','RomeTablets','1枚だけ、古い木',None),
  (15,15,'a','BeforeEuropeans','ヨーロッパの船より前',None),
  (16,17,'p','rongo-aruku','自分たちの力で、文字を？',None),
  (18,19,'a','ScriptInventions','文字をゼロから生んだ場所',None),
  (20,20,'a','WhenCarved','刻まれたのは、いつ？',None),
  (21,None,'p','tongariki-night','新しい発見があったら、また判決を','out')]),
}
EXTRA = dict(a.split('=') for a in sys.argv[2:])
used = collections.Counter()
for sc,(var,label,title,beats) in S.items():
    beats = [(f,t,k,EXTRA.get(x,x),lab,mv) for (f,t,k,x,lab,mv) in beats]
    arts = sorted({b[3] for b in beats if b[2]=='a'})
    for a in arts: assert a in a1set or a in a2set or a in a3set or a in a4set, a
    hasv = any(b[2]=='v' for b in beats)
    imp = []
    if hasv: imp.append("import {useVideoConfig} from 'remotion';")
    imp.append("import {Beat%s} from '../components/Beat';" % (', captionFrame' if hasv else ''))
    if hasv: imp.append("import {GavelVerdict} from '../components/GavelVerdict';")
    a1 = [a for a in arts if a in a1set]; a2 = [a for a in arts if a in a2set and a not in a1set]
    if a1: imp.append("import {%s} from '../components/%s';" % (', '.join(a1), A1))
    if a2: imp.append("import {%s} from '../components/%s';" % (', '.join(a2), A2))
    a3 = [a for a in arts if a in a3set]
    if a3: imp.append("import {%s} from '../components/%s';" % (', '.join(a3), A3))
    a4 = [a for a in arts if a in a4set]
    if a4: imp.append("import {%s} from '../components/%s';" % (', '.join(a4), A4))
    if any(b[2]=='p' for b in beats): imp.append("import {Photo} from '../components/Photo';")
    if arts: imp.append("import {Visual} from '../components/Scenery';")
    imp.append("import {SceneFrame} from '../components/SceneFrame';")
    imp.append("import {%s as c} from '../data/captions';" % var)
    imp.sort(key=lambda l: l.split("from '")[1])
    body=[]
    for (f,t,k,x,lab,mv) in beats:
        rng = f" from={{{f}}}" + (f" to={{{t}}}" if t is not None else '')
        if k=='p':
            used[x]+=1
            m = f' move="{mv}"' if mv else ''
            el = f'<Photo id="{x}"{m} label="{lab}" />'
            name = lab[:12]
        elif k=='a':
            el = f'<Visual label="{lab}">\n\t\t\t\t\t<{x} />\n\t\t\t\t</Visual>'
            name = x
        else:
            el = f'<GavelVerdict verdict="{x}" strikeAt={{captionFrame(c, {f}, {f+1}, fps)}} />'
            name = '判決'
        body.append(f'\t\t\t<Beat name="{name}" captions={{c}}{rng}>\n\t\t\t\t{el}\n\t\t\t</Beat>')
    hdr = f' label="{label}" title="{title}"' if label else ''
    comp = sc
    if hasv:
        out = '\n'.join(imp)+f"\n\n// {title or '謎の先出し'}（素材はすべてこの場面だけで使う）\nexport const {comp} = () => {{\n\tconst {{fps}} = useVideoConfig();\n\treturn (\n\t\t<SceneFrame captions={{c}} voice=\"{comp}\"{hdr}>\n"+'\n'.join(body)+"\n\t\t</SceneFrame>\n\t);\n};\n"
    else:
        b2='\n'.join(l[1:] for l in '\n'.join(body).split('\n'))
        out = '\n'.join(imp)+f"\n\n// {title or '謎の先出し'}（素材はすべてこの場面だけで使う）\nexport const {comp} = () => (\n\t<SceneFrame captions={{c}} voice=\"{comp}\"{hdr}>\n"+b2+"\n\t</SceneFrame>\n);\n"
    open(f'{root}/src/scenes/{sc}.tsx','w').write(out)
print('dup', [k for k,v in used.items() if v>1])
print('used', len(used))

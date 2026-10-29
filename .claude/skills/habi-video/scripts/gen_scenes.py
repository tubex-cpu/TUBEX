# テンプレート（仁徳天皇陵判決のもの）。新しい動画では habi-<題材>/scripts/ にコピーし、場面・素材・文言を書き換えて使う。
# 使い方: python3 gen_scenes.py habi-<題材>
# 仁徳天皇陵：シーンファイルをまとめて生成する
import collections, sys, re
root = sys.argv[1]
A1 = 'NintokuArt1'; A2 = 'NintokuArt2'; A3 = 'NintokuArt3'; A4 = 'NintokuArt4'
def arts_of(path):
    return set(re.findall(r'^export const (\w+)', open(path).read(), re.M))
a1set = arts_of(f'{root}/src/components/{A1}.tsx'); a2set = arts_of(f'{root}/src/components/{A2}.tsx'); a3set = arts_of(f'{root}/src/components/{A3}.tsx'); a4set = arts_of(f'{root}/src/components/{A4}.tsx')

# (from, to or None, 'p'/'a'/'v', photoId or ArtName or verdict, label, move)
S = {
 'Intro': ('introCaptions', None, None, [
  (0,0,'p','sakai-city','住宅街に、巨大な森？','out'),
  (1,1,'a','KeepOut','その先へは、入れない',None),
  (2,2,'p','kisaragi-3','教科書の、あの古墳','out'),
  (3,3,'p','daisen-h1','眠るのは、仁徳天皇？',None),
  (4,5,'p','daisen-b7','確かめた人は、いない？','out'),
  (6,7,'a','RyoboCount','なぜ、1500年も解けない？',None),
  (8,10,'p','moat-4','調べるほど、合わない？','left'),
  (11,11,'a','WhoSleeps','この墓の主は、誰？',None),
  (12,12,'a','WhereIsNintoku','本当の仁徳天皇は、どこに？',None),
  (13,13,'p','omotezuka-2','一度だけ、口を開けた墓','out'),
  (14,14,'a','MissingTreasure','消えた宝は、どこへ？',None),
  (15,16,'a','RedReliefTease','ついに動いた、国の調査',None),
  (17,18,'a','HiddenBurial','もうひとりの誰か？',None),
  (19,19,'p','maruhoyama-moat','そこに眠るのは、誰？',None),
  (20,None,'a','SealedTimeline','今夜は、長い法廷になる',None)]),
'Clue1Size': ('clue1SizeCaptions','第1の手がかり','世界最大の墓だった？', [
  (0,1,'p','park-4','住宅街の真ん中の森','out'),
  (2,2,'a','KeyholeParts','空から見ると？',None),
  (3,4,'a','KofunEra','前方後円墳の時代',None),
  (5,6,'p','daisen-h2','これが、仁徳天皇陵古墳',None),
  (7,10,'a','KofunDimensions','どれほど大きい？',None),
  (11,11,'p','moat-1','三重の濠','right'),
  (12,12,'p','mozu-aster','宇宙からも、見える？',None),
  (13,13,'p','kisaragi-4','甲子園球場、およそ12個分',None),
  (14,15,'p','city-hall','形を見るには、どこから？','out'),
  (16,16,'p','city-hall-view','空から見下ろす',None),
  (17,17,'p','konda','2番目に大きい古墳は？','out'),
  (18,18,'p','kamiishizu','3番目は？',None),
  (19,19,'p','tsukuriyama','4番目は、岡山に',None),
  (20,20,'a','TopThree','巨大古墳は、大阪に集まる',None),
  (21,22,'p','moat-8','「世界最大の墓」？',None),
  (23,24,'p','pyramid','世界三大墳墓','out'),
  (25,25,'p','terracotta','始皇帝の墓のまわりに',None),
  (26,26,'p','qin','ひとりの王のために',None),
  (27,28,'a','FourRulers','何で比べる？',None),
  (29,30,'a','LengthCompare','長さで比べると？',None),
  (31,32,'a','UnderwaterSkirt','水の下に、何が？',None),
  (33,34,'a','HeightCompare','高さで比べると？',None),
  (35,36,'a','VolumeCompare','体積では？',None),
  (37,38,'a','NumbersVary','数字は、資料で変わる',None),
  (39,41,'v','half',None,None),
  (42,None,'p','pyramid-2','人の手だけで、どれだけ？',None)]),
 'Clue2Build': ('clue2BuildCaptions','第2の手がかり','造るのに15年以上かかった？', [
  (0,0,'p','daisen-z2','1500年以上前の墓',None),
  (1,3,'a','BuildSteps','どうやって造った？',None),
  (4,5,'p','moat-2','古代と同じ方法なら？','right'),
  (6,6,'a','ConstructionPeriod','工期は？',None),
  (7,8,'a','WorkerStats','人と費用は？',None),
  (9,9,'a','Crowd','現場にいた人々',None),
  (10,11,'a','AncientVsModern','現代の機械なら？',None),
  (12,13,'a','HaniwaUncounted','まだ数えていないもの',None),
  (14,15,'p','goshiki-2','ただの土の山ではない',None),
  (16,17,'a','StonesAndHaniwa','斜面と堤に並んだもの',None),
  (18,19,'p','goshiki-1','造られた当時の姿は？','out'),
  (20,20,'p','goshiki-3','石と埴輪の山',None),
  (21,21,'p','moat-10','今は、森に見えるけれど',None),
  (22,22,'a','ShipView','海からも見えた？',None),
  (23,25,'v','correct',None,None),
  (26,None,'p','iron-swords','工事を支えたのは？',None)]),
'Clue3Craft': ('clue3CraftCaptions','第3の手がかり','古墳の時代、堺は最先端の工業地帯だった？', [
  (0,1,'p','sue-jar','造り出しから見つかったもの',None),
  (2,2,'p','suemura-cup','須恵器',None),
  (3,4,'a','SueVsHaji','何が違う？',None),
  (5,5,'a','TechRoute','技術は、どこから？',None),
  (6,6,'a','SuemuraMap','その生産地は？',None),
  (7,8,'p','suemura-tg61','陶邑窯跡群','out'),
  (9,9,'a','KilnYears','どれほど長く？',None),
  (10,10,'p','suemura-tk73','最も古い窯のひとつ',None),
  (11,11,'p','suemura-pot','海を越えてきた技術',None),
  (12,13,'p','sue-jar-2','須恵器の大きなかめ',None),
  (14,15,'a','Hirakata2025','2025年10月、枚方で',None),
  (16,16,'a','KilnSection','トンネルのような窯',None),
  (17,18,'p','kiln-site','窯の跡','left'),
  (19,19,'a','Workforce','古墳を造った人々',None),
  (20,20,'p','suemura-spout','最先端の技術が集まる',None),
  (21,23,'v','correct',None,None),
  (24,None,'p','haniwa-early','埴輪は、何のため？',None)]),
 'Clue4Haniwa': ('clue4HaniwaCaptions','第4の手がかり','埴輪は、いけにえの身代わりだった？', [
  (0,0,'p','nihonshoki','日本書紀に書かれた、埴輪の始まり',None),
  (1,2,'p','saki-misasagi','皇后が亡くなった',None),
  (3,5,'a','HaniwaLegend','どうするべきか？',None),
  (6,7,'p','saki-haisho','「土師」という名前',None),
  (8,8,'p','sumo','相撲の神様',None),
  (9,10,'p','nisanzai','土師ニサンザイ古墳','out'),
  (11,11,'p','haniwa-horse','人の形の、身代わり？',None),
  (12,13,'p','haniwa-takara','最初に現れた埴輪は？',None),
  (14,14,'a','KidaiToHaniwa','もとになったのは？',None),
  (15,16,'a','HaniwaOrder','埴輪が現れた順番',None),
  (17,18,'a','HaniwaFence','何のために並べた？',None),
  (19,20,'p','haniwa-shield','順番が、逆？',None),
  (21,21,'p','haniwa-shieldman','神話として',None),
  (22,23,'a','NintokuHaniwa','仁徳天皇陵の埴輪は？',None),
  (24,25,'p','haniwa-woman','最も古い、人の形？',None),
  (26,28,'v','wrong',None,None),
  (29,None,'p','moat-3','寄りそう小さな古墳たち',None)]),
 'Clue5Baicho': ('clue5BaichoCaptions','第5の手がかり','周りの小さな古墳は、家来の墓？', [
  (0,2,'a','BaichoMap','巨大古墳のまわりに',None),
  (3,4,'p','osamezuka-5','家来の墓？',None),
  (5,7,'p','tsukamawari','塚廻古墳',None),
  (8,9,'a','TsukamawariFinds','中から見つかったもの',None),
  (10,11,'p','magatama','身分の高い人物？',None),
  (12,14,'p','nagayama','永山古墳','out'),
  (15,17,'a','NagayamaOrder','順番は？',None),
  (18,18,'p','kisaragi-1','ほとんどが、発掘されていない',None),
  (19,21,'v','half',None,None),
  (22,None,'p','daisen-h3','この古墳の主は？',None)]),
 'Clue6Nintoku': ('clue6NintokuCaptions','第6の手がかり','眠っているのは仁徳天皇？', [
  (0,0,'p','nintoku-chikanobu','16代目の天皇',None),
  (1,1,'p','nintoku-gekko','「民のかまど」',None),
  (2,5,'a','KamadoSmoke','かまどの煙',None),
  (6,6,'p','kozu-1910','「聖帝」とたたえられた',None),
  (7,10,'p','nintoku-matsuoka','鳥の名前を持つ天皇',None),
  (11,11,'p','kozu','難波の高津宮','left'),
  (12,13,'p','deer','工事の日、鹿が',None),
  (14,16,'p','shrike','鹿の耳から、モズ？','out'),
  (17,18,'p','iha','宮内庁が管理する墓',None),
  (19,20,'p','kamiishizu-h','すぐ南の、もうひとつの巨大古墳','right'),
  (21,22,'a','BuildOrder','順番が、合わない？',None),
  (23,24,'p','mozu-hachiman','年代を知る手がかり',None),
  (25,27,'a','NoNameTag','誰の墓？',None),
  (28,29,'p','haniwa-young','名前は、見つかっていない',None),
  (30,31,'p','songshu','中国の歴史書『宋書』',None),
  (32,34,'a','FiveKings','5人の倭の王',None),
  (35,35,'a','TwoChronicles','2つの国の記録',None),
  (36,38,'v','wrong',None,None),
  (39,None,'p','daisen-h4','いつから、造られた？','out')]),
'Clue7Juryo': ('clue7JuryoCaptions','第7の手がかり','王は、生きているうちに自分の墓を造った？', [
  (0,2,'a','ShokiTwentyYears','日本書紀の記録',None),
  (3,4,'p','moat-5','亡くなる前から？',None),
  (5,6,'p','qin-portrait','始皇帝も','out'),
  (7,8,'a','FifteenVsTwenty','不思議と近い数字',None),
  (9,10,'a','Reign87','注意が必要',None),
  (11,12,'p','kisaragi-2','考古学では？',None),
  (13,15,'v','half',None,None),
  (16,None,'p','liu-yu','中国の皇帝と倭の王',None)]),
 'Clue8Kings': ('clue8KingsCaptions','第8の手がかり','倭の王は、中国の皇帝の家来だった？', [
  (0,1,'a','EastAsia5th','5世紀の東アジア',None),
  (2,5,'a','KingsTimeline','5人の王の使い',None),
  (6,8,'a','BuLetter','武の手紙',None),
  (9,9,'p','goguryeo','北の強国、高句麗',None),
  (10,10,'a','TitleCompare','求めた位と、認められた位',None),
  (11,12,'p','silla-crown','ねらいは、どこに？',None),
  (13,13,'p','baekje-burner','朝鮮半島をめぐる争い',None),
  (14,15,'p','nintoku-02','海の向こうへ、力を見せる？',None),
  (16,18,'v','half',None,None),
  (19,None,'p','tadeiyama','誰が「仁徳天皇の墓」と決めた？',None)]),
 'Clue9Name': ('clue9NameCaptions','第9の手がかり','天皇陵の名前は、昔から伝わっていた？', [
  (0,2,'a','EngishikiCard','平安時代の記録',None),
  (3,5,'a','EightChoSquare','どれほど広い？',None),
  (6,8,'a','NorthMidSouth','なぜ「中」？',None),
  (9,12,'a','RyoboSurveys','わからなくなった墓',None),
  (13,13,'p','izumi-zue','江戸時代の観光ガイド',None),
  (14,14,'p','utsunomiya','幕末の大事業',None),
  (15,15,'p','toda','言い出したのは？',None),
  (16,16,'p','daisen-h5','拝所の始まり','left'),
  (17,19,'p','shoryobu','国が管理する墓',None),
  (20,22,'v','half',None,None),
  (23,None,'p','daisen-2024','墓の中を見た人は？',None)]),
 'Clue10Inside': ('clue10InsideCaptions','第10の手がかり','中を見た人は誰もいない？', [
  (0,2,'a','NoEntryLine','研究者でも、入れない？',None),
  (3,4,'a','Meiji1872','明治5年、何が起きた？',None),
  (5,5,'a','TwoTheories','きっかけは？',None),
  (6,6,'p','sarcophagus','長持形石棺とは？',None),
  (7,7,'a','ChamberFinds','見つかった品々',None),
  (8,10,'p','meiji-drawing','描き残された石室と石棺',None),
  (11,11,'p','helmet-ise','小さな飾りが下がる冑',None),
  (12,12,'p','cuirass','鋲で留めた甲',None),
  (13,13,'p','okinoshima-view','2026年、沖ノ島で',None),
  (14,15,'p','mint','明治5年、もうひとつの巡り合わせ',None),
  (16,17,'a','Gowland1872','イギリスから来た技師',None),
  (18,18,'p','silla-jar-bm','大英博物館に',None),
  (19,19,'p','alps','「日本アルプス」の名付け親',None),
  (20,22,'a','LidReburied','棺の中は？',None),
  (23,25,'a','FrontAndBack','見つかったのは、どこ？',None),
  (26,28,'v','wrong',None,None),
  (29,None,'p','glass-bowl','宝は、どこへ？',None)]),
 'Clue11Boston': ('clue11BostonCaptions','第11の手がかり','宝はアメリカに渡った？', [
  (0,0,'p','boston','アメリカ・ボストン',None),
  (1,1,'a','BostonItems','美術館にある品々',None),
  (2,2,'p','mirror-1','細い線で描かれた獣の鏡',None),
  (3,3,'p','mfa-2','「伝・仁徳天皇陵出土品」','left'),
  (4,5,'a','Magazine1938','1938年の雑誌',None),
  (6,7,'a','RumorCloud','広まった噂',None),
  (8,9,'a','ToBoston','どうやって渡った？',None),
  (10,10,'p','okakura','買ったのは、誰？',None),
  (11,12,'p','book-of-tea','『茶の本』',None),
  (13,14,'p','tenshin-en','ボストン美術館の日本美術',None),
  (15,15,'a','PurchaseRecord','記録に残っていたのは？',None),
  (16,16,'p','mirror-2','2010年、宮内庁の調査',None),
  (17,18,'a','BostonTimeline','年代は、合うのか？',None),
  (19,19,'a','LowChance','結果は？',None),
  (20,22,'v','half',None,None),
  (23,None,'p','helmet-met','本物の宝は、どこへ？',None)]),
 'Clue12Treasure': ('clue12TreasureCaptions','第12の手がかり','明治5年の宝は、すべて失われた？', [
  (0,1,'p','otsukayama-armor','古墳時代の甲',None),
  (2,3,'p','osamezuka-3','残されたのは、絵だけ？',None),
  (4,5,'a','News2025','2025年6月、思いがけない発表',None),
  (6,7,'p','kokugakuin','目利きの遺品',None),
  (8,9,'a','WrapperNote','包み紙に書かれていたのは？',None),
  (10,11,'a','KnifeDiagram','中に入っていたもの',None),
  (12,13,'p','masuda','木の箱に押された印',None),
  (14,14,'a','TreasurePath','宝がたどった道',None),
  (15,17,'p','sakai-museum','堺市博物館で、初めての公開',None),
  (18,20,'v','wrong',None,None),
  (21,None,'p','gosashi','今も、誰も入れない？',None)]),
'Clue13Entry': ('clue13EntryCaptions','第13の手がかり','天皇陵には、今も誰も入れない？', [
  (0,1,'p','konda-haisho','「生きた墓」',None),
  (2,3,'p','moat-7','研究者たちの願い',None),
  (4,6,'a','EntryTimeline','扉が開きはじめた',None),
  (7,8,'a','LowestTier','どこまで入れる？',None),
  (9,11,'a','BoatCrossing','2025年3月7日',None),
  (12,13,'p','haniwa-warrior','墳丘で見たものは？',None),
  (14,14,'p','magodayu','積み直された石',None),
  (15,15,'p','haniwa-inari','1500年の時を越えて',None),
  (16,18,'v','wrong',None,None),
  (19,None,'p','osamezuka','まわりの古墳は、どうなった？',None)]),
 'Clue14Lost': ('clue14LostCaptions','第14の手がかり','百舌鳥古墳群は、昔のまま残っている？', [
  (0,0,'p','nagatsuka','世界遺産の古墳群',None),
  (1,2,'a','KofunCount','いくつ、残っている？',None),
  (3,5,'a','LostTimeline','いつ、消えた？',None),
  (6,7,'p','otsukayama-beads','消えた大塚山古墳',None),
  (8,9,'p','moat-13','最後に消えた古墳',None),
  (10,11,'p','itasuke','市民が守った古墳','out'),
  (12,13,'p','itasuke-2026','こわされそうになった',None),
  (14,15,'a','SaveCampaign','立ち上がったのは？',None),
  (16,17,'p','itasuke-2','運動の記念',None),
  (18,18,'p','tanuki','タヌキが見られる？',None),
  (19,21,'p','moat-12','濠の水は、何のため？',None),
  (22,24,'v','wrong',None,None),
  (25,None,'p','haniwa-house','世界遺産で、何が変わった？',None)]),
 'Clue15Heritage': ('clue15HeritageCaptions','第15の手がかり','世界遺産になって、発掘が進んだ？', [
  (0,1,'p','wh-flag','2019年7月6日',None),
  (2,3,'a','HeritageAreas','百舌鳥と古市',None),
  (4,4,'p','furuichi','高く評価されたもの',None),
  (5,6,'p','wh-monument','発掘は、進んだ？',None),
  (7,8,'p','wh-monument-2','守るためのルール',None),
  (9,12,'a','BufferZone','2026年2月、市民からの提案',None),
  (13,13,'p','maruhoyama-moat-3','未来へ守り伝える約束',None),
  (14,16,'v','wrong',None,None),
  (17,None,'p','konda-haisho-2','仁徳天皇陵そのものは？',None)]),
'Clue16Now': ('clue16NowCaptions','第16の手がかり','仁徳天皇陵は、造られたときの姿のまま？', [
  (0,1,'p','komoyamazuka','森に変わった山',None),
  (2,3,'p','moat-11','くずれの原因は？',None),
  (4,6,'a','MoatVolume','濠の水は、どれだけ？',None),
  (7,7,'p','maruhoyama','水に削られる墳丘',None),
  (8,10,'a','WaterSupply','水の悩み',None),
  (11,12,'p','kusunoki','今も続く、守る仕事',None),
  (13,15,'v','wrong',None,None),
  (16,None,'a','FiveCluesDone','16の手がかりを、全てたどった',None)]),
'RootsStory': ('rootsStoryCaptions','調査の先に','動き出した巨大古墳', [
  (0,0,'p','maruhoyama-moat-2','答えは、見つからなかった',None),
  (1,2,'p','gobyoyama-balloon','閉ざされた古墳が、動き出す','out'),
  (3,5,'p','moat-9','2018年、初めての共同発掘',None),
  (6,7,'a','Dig2018','どこを掘った？',None),
  (8,9,'a','HaniwaRowFound','地面の下から',None),
  (10,12,'a','StonePaving','堤の上には？',None),
  (13,14,'a','OneToRow','1本から、列へ',None),
  (15,15,'p','haniwa-woman-2','1500年以上前の埴輪',None),
  (16,16,'p','moat-6','世界遺産へ',None),
  (17,18,'a','Dig2021','2021年、2回目の調査',None),
  (19,19,'p','omotezuka','そして2025年',None),
  (20,20,'p','mozu-gobyo','近代の堺の展覧会',None),
  (21,22,'p','osamezuka-2','近づいて知る古墳へ',None),
  (23,26,'a','ReliefMethod','「赤色立体図」とは？',None),
  (27,28,'a','DodanReveal','浮かび上がったのは？',None),
  (29,30,'a','PrecedentCheck','前例は、あるのか？',None),
  (31,32,'a','OjinPrecedent','応神天皇陵とされる古墳では',None),
  (33,34,'p','muroto','昭和10年の記録',None),
  (35,37,'a','ErodedEdges','まだ、わからないこと',None),
  (38,38,'p','magodayu-2','森の下に隠れた形','out'),
  (39,None,'p','omotezuka-moat','1500年前の人々の手仕事',None)]),
'UnsolvedMystery': ('unsolvedMysteryCaptions','未決','まだ解けていない謎', [
  (0,1,'p','magodayu-3','ボクにも、まだ判決が出せない謎','out'),
  (2,3,'a','UnknownChamber','記録も、絵もない',None),
  (4,7,'a','DateGap','年代の、ずれ',None),
  (8,9,'p','osamezuka-4','天皇陵の多くは、中を調べられていない',None),
  (10,11,'p','omotezuka-moat-2','長い年月をかけて造った墓','left'),
  (12,14,'a','SameOrNot','土壇の下には？',None),
  (15,17,'a','WhichTomb','ボストンの宝は、どこから？',None),
  (18,None,'p','kusunoki-2','新しい発見があったら、もう一度判決を',None)]),
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

"""元寇判決：第2の手がかり〜まだ解けていない謎の場面ファイル（src/scenes/*.tsx）を作る。
  python3 scripts/gen_scenes_genko.py
ビート： (from, to, 種類, ...)  to=None はその場面の最後まで
  ('p', 写真ID, テロップ, 動き)            写真
  ('a', 'JSXの図解', テロップ, 下に置くか)  図解（全画面）
  ('v', 'right'|'half'|'wrong')          判決（from は「この手がかりの判決。」の行）
同じ写真・同じ図解を2回使うと止まる。冒頭3場面（手書き）で使った写真も重複チェックに含める。"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
KIT = {'Cards', 'TimeBar', 'Figures', 'MapScene'}
ART3 = set(re.findall(r'^export const (\w+)', (ROOT / 'src/components/GenkoArt3.tsx').read_text(), re.M))
ART4 = set(re.findall(r'^export const (\w+)', (ROOT / 'src/components/GenkoArt4.tsx').read_text(), re.M))

S = {
 'Clue2Islands': ('第2の手がかり', '最初に襲われたのは博多だった？', [
  (0, 1, 'a', "<MapScene cam={{lon: 129.2, lat: 34.6, zoom: 2.2}} to={{lon: 129.3, lat: 34.5, zoom: 2.6}} routes={[{from: 'gappo', to: 'tsushima'}]} fleet={{key: 'tsushima', n: 40, at: 60}} pins={[{key: 'gappo', name: '合浦', dx: -150}, {key: 'tsushima', name: '対馬', at: 70, big: true}]} />", '900隻が向かった先は？', True),
  (2, 2, 'p', 'mongol-chainmail', '寄せ集めの大軍', 'in'),
  (3, 4, 'p', 'izuhara', '博多ではなかった？', 'right'),
  (5, 5, 'p', 'komoda-1', '10月5日、小茂田浜', 'in'),
  (6, 7, 'a', "<Figures figs={[{value: '80', label: '騎ほど', small: '宗資国の手勢'}, {value: '数千', label: 'の大軍', accent: true}]} mid='対' tone='ember' />", 'わずかな兵で？', False),
  (8, 8, 'p', 'komoda-2', '小茂田浜神社', 'out'),
  (9, 9, 'p', 'komoda-statue', '島を守った人', 'in'),
  (10, 10, 'a', "<MapScene cam={{lon: 129.5, lat: 34.1, zoom: 2.4}} routes={[{from: 'tsushima', to: 'iki'}]} pins={[{key: 'tsushima', name: '対馬', dx: -130}, {key: 'iki', name: '壱岐', at: 60, big: true}]} />", '次に襲われたのは？', True),
  (11, 11, 'p', 'iki-tojinbaru', '唐人原', 'right'),
  (12, 13, 'p', 'iki-kagetaka', '城が落ちる前に', 'in'),
  (14, 14, 'p', 'iki-senninzuka', '亡くなった人々の塚', 'out'),
  (15, 16, 'p', 'iki-koraibashi', '島が、戦場になった', 'left'),
  (17, 17, 'a', "<MapScene cam={{lon: 130.0, lat: 33.8, zoom: 2.6}} routes={[{from: 'iki', to: 'hakata'}]} fleet={{key: 'hakata', n: 50, at: 50}} pins={[{key: 'iki', name: '壱岐', dx: -130}, {key: 'hakata', name: '博多湾', at: 50, big: true}]} />", '10月20日、ついに', True),
  (18, None, 'v', 'wrong'),
  (21, None, 'p', 'hakata-bay-1', '博多の武士は、どう戦った？', 'out'),
 ]),
 'Clue3Samurai': ('第3の手がかり', '鎌倉武士は一騎打ちで負けた？', [
  (0, 0, 'a', "<TimeBar stops={[{label: '10月20日', sub: '文永11年（1274年）'}, {label: '11月下旬', sub: '今の暦では', accent: true}]} tone='ember' />", '何月の戦いだった？', False),
  (1, 1, 'a', "<MapScene cam={{lon: 130.36, lat: 33.63, zoom: 5}} pins={[{key: 'momochi', name: '百道原', big: true}, {key: 'hakata', name: '博多', at: 30, dx: 20}]} fleet={{key: 'momochi', n: 30, at: 20}} />", '元軍は、どこに上陸？', True),
  (2, 2, 'p', 'borui-momochi', '九州の御家人が駆けつけた', 'in'),
  (3, 3, 'p', 'sohara-2', '赤坂、鳥飼、祖原', 'right'),
  (4, 5, 'p', 'ekotoba-e8', 'よく語られる話', 'in'),
  (6, 7, 'a', '<SoloVsGroup />', '名乗りと一騎打ち？', False),
  (8, 8, 'p', 'mohon-fukuda-3', '何度も見てきた場面', 'left'),
  (9, 12, 'a', "<Cards cards={[{head: '八幡愚童訓', body: '八幡の神の\\nありがたさを\\n説くための本', tone: 'gold'}, {head: '研究者は', body: 'そのまま\\n信じてよいか\\n疑問', tone: 'dark'}]} tone='ink' />", 'その話の、出どころは？', False),
  (13, 15, 'p', 'ekotoba-hakozaki-w', '戦った本人が残した絵巻', 'scroll'),
  (16, 18, 'p', 'ekotoba-e13', '仲間と一緒に', 'in'),
  (19, 20, 'p', 'crossbow-mouko', '元軍の武器', 'in'),
  (21, 21, 'p', 'hakozaki-hama-w', '筥崎宮が焼かれるほどの戦い', 'out'),
  (22, None, 'v', 'half'),
  (25, None, 'p', 'mohon-ndl-e6-w', '見たことのない武器とは？', 'left'),
 ]),
 'Clue4Tetsuhau': ('第4の手がかり', 'てつはうは音だけのこけおどし？', [
  (0, 2, 'p', 'mohon-ndl-e7-w', 'いちばん有名な場面', 'scroll'),
  (3, 4, 'p', 'tetsuhau-tnm', '炎を上げる、丸い玉', 'in'),
  (5, 6, 'a', '<TetsuhauCut />', '中に、何が？', False),
  (7, 7, 'p', 'tetsuhau-kyuhaku', '音で驚かすだけ？', 'in'),
  (8, 10, 'p', 'tetsuhau-1', '海の底から、実物が', 'in'),
  (11, 12, 'a', '<CTSlice />', '割らずに、中を見ると？', False),
  (13, 14, 'a', '<Shrapnel />', '爆発すると、どうなる？', False),
  (15, 16, 'p', 'tetsuhau-2', '溶かした鉄の破片', 'in'),
  (17, 19, 'p', 'tetsuhau-kyuhaku-2', '威力は、どれほど？', 'out'),
  (20, 20, 'p', 'helmet-takashima', '本当に、戦場で', 'in'),
  (21, None, 'v', 'wrong'),
  (24, None, 'p', 'tapestry-mouko', 'あの絵は、本当に？', 'in'),
 ]),
 'Clue5Ekotoba': ('第5の手がかり', '教科書のあの絵は、見たままを描いた？', [
  (0, 2, 'a', '<ThreeSoldiers />', '教科書の、あの場面', False),
  (3, 4, 'p', 'ekotoba-e19-w', '季長が描かせた絵巻', 'scroll'),
  (5, 6, 'p', 'ekotoba-e14-w', 'ある疑い', 'left'),
  (7, 8, 'p', 'ekotoba-e21', '紙のつなぎ目を、調べる', 'in'),
  (9, 12, 'a', '<PaperSeam />', 'おかしなこととは？', False),
  (13, 14, 'a', "<Cards cards={[{head: '3人の兵士', body: '装備が違う\\n筆の運びも違う', tone: 'red'}, {head: 'ほかの元の兵士', body: '同じ絵巻の\\n描き方', tone: 'dark'}]} tone='ember' />", '何が、違う？', False),
  (15, 15, 'a', "<Cards cards={[{head: '多くの研究者', body: '江戸時代に\\n描き足された', tone: 'gold'}, {head: '服部英雄', body: '同じころに\\n描かれた', tone: 'dark'}]} tone='ink' />", '反論も', False),
  (16, 18, 'p', 'sadahide-mouko-w', '700年の長い旅', 'left'),
  (19, 20, 'p', 'ekotoba-kono-w', '本当は、どんな場面？', 'scroll'),
  (21, 23, 'p', 'takashima-museum', 'てつはうは、作り話ではない', 'in'),
  (24, 24, 'p', 'ekotoba-e20', '2021年、国宝に', 'in'),
  (25, None, 'v', 'half'),
  (28, None, 'p', 'genkai-3', 'なぜ、一日で引き揚げた？', 'out'),
 ]),
 'Clue6Storm': ('第6の手がかり', '1度目の元軍は、嵐で追い返された？', [
  (0, 1, 'a', '<NightRetreat />', '翌朝、何が起きていた？', False),
  (2, 3, 'p', 'typhoon-soulik', '1度目の神風？', 'in'),
  (4, 7, 'a', "<Cards cards={[{head: '嵐を書いた記録', body: '高麗史\\n勘仲記', tone: 'gold'}, {head: '', body: '？', tone: 'dark'}]} tone='night' />", '記録を読み比べると？', False),
  (8, 11, 'a', "<Cards cards={[{head: '嵐を書いていない', body: '元史\\n八幡愚童訓', tone: 'red'}, {head: '元史には', body: '軍が整わず\\n矢も尽きた', tone: 'dark'}]} tone='ink' />", '書いていない記録も？', False),
  (12, 12, 'a', "<MapScene cam={{lon: 128.6, lat: 34.2, zoom: 1.6}} storm={{key: 'tsushima', at: 15}} pins={[{key: 'hakata', name: '日本の近く？', at: 30}, {key: 'gappo', name: '帰る途中？', at: 50, dx: -230}]} />", 'どこで吹いた嵐？', True),
  (13, 15, 'a', '<SeasonDial />', '台風の季節か？', False),
  (16, 18, 'a', "<TimeBar stops={[{label: '1958年', sub: '気象学者 荒川秀俊\\n「台風は来なかった」'}, {label: '2017年', sub: '歴史学者 服部英雄\\n『蒙古襲来と神風』', accent: true}]} />", '研究者たちの議論', False),
  (19, 22, 'a', "<Cards cards={[{head: '理由1', body: '副司令官が\\n矢を受けて負傷', tone: 'dark'}, {head: '理由2', body: '矢が\\n尽きかけた', tone: 'dark'}, {head: '理由3', body: '指揮官の\\n意見が合わない', tone: 'dark'}]} tone='ember' size={44} />", 'ほかの理由は？', False),
  (23, 23, 'p', 'genkai-4', '風雨は、あったのか', 'out'),
  (24, None, 'v', 'half'),
  (27, None, 'p', 'engakuji-butsunichian', '元が去ったあと、日本は？', 'in'),
 ]),
 'Clue7Envoys': ('第7の手がかり', '幕府は、元の使いを斬った？', [
  (0, 1, 'a', '<EnvoyBoat />', 'また、使いが来た', False),
  (2, 3, 'p', 'ryukoji-gate', '鎌倉、龍ノ口', 'in'),
  (4, 6, 'a', "<Cards cards={[{head: '幕府の答え', body: '話し合いには\\n応じない', tone: 'red'}]} tone='ink' size={60} />", '使いの命を奪う意味は？', False),
  (7, 7, 'p', 'ryukoji-hondo', '処刑場の跡に、寺', 'out'),
  (8, 8, 'p', 'genshizuka', '元使塚', 'in'),
  (9, 9, 'p', 'joryuji-hondo', '故郷に帰ることなく', 'left'),
  (10, 11, 'p', 'joryuji-gate', '1279年、ふたたび', 'in'),
  (12, 14, 'a', "<MapScene cam={{lon: 120.5, lat: 30.5, zoom: 1.1}} shade={{lon: 118.5, lat: 29.5, r: 200, label: '南宋', at: 10}} pins={[{key: 'keigen', name: '慶元', at: 40}]} />", '南宋が、元のものに', True),
  (15, None, 'v', 'right'),
  (18, None, 'p', 'borui-imazu-1', '次の戦いに備えて', 'out'),
 ]),
 'Clue8Wall': ('第8の手がかり', '博多湾に、20キロの石の壁を築いた？', [
  (0, 1, 'p', 'borui-imazu-2', '1276年3月、博多湾', 'right'),
  (2, 2, 'p', 'borui-iki-1', '石築地', 'in'),
  (3, 3, 'a', "<MapScene cam={{lon: 130.37, lat: 33.6, zoom: 5.5}} routes={[{from: 'imazu', via: ['ikinomatsubara', 'momochi', 'hakata'], to: 'kashii', at: 10}]} pins={[{key: 'imazu', name: '今津', dx: -120, at: 5}, {key: 'kashii', name: '香椎', at: 70}]} />", 'どこからどこまで？', True),
  (4, 5, 'a', "<Figures figs={[{value: '9', label: 'か国の御家人', small: '九州の国々'}, {value: '20', label: 'キロ', small: '今津から香椎まで', accent: true}]} />", '誰が、どれだけ？', False),
  (6, 6, 'p', 'borui-iki-2', '生の松原は、肥後の武士', 'in'),
  (7, 8, 'a', "<TimeBar stops={[{label: '3月', sub: '1276年 工事開始'}, {label: '8月ごろ', sub: 'ひと通り完成', accent: true}]} tone='moss' />", 'わずか半年？', False),
  (9, 11, 'a', '<WallSection />', '壁の形は？', False),
  (12, 12, 'p', 'borui-imajuku', '場所ごとに違う積み方', 'in'),
  (13, 13, 'p', 'borui-meinohama', '砂に埋もれた壁', 'left'),
  (14, 15, 'p', 'borui-imazu-5', '今も見られる石の壁', 'in'),
  (16, 16, 'p', 'borui-hakozaki', '消えたと考えられていた', 'out'),
  (17, 19, 'p', 'borui-kyudai', '100年前の見立て', 'in'),
  (20, 20, 'p', 'borui-imazu-4', '2021年、国の史跡に', 'right'),
  (21, 22, 'p', 'iki-noroshi', '海を見張る', 'in'),
  (23, 23, 'p', 'borui-nishijin-1', '戦い方を、根本から', 'in'),
  (24, None, 'v', 'right'),
  (27, None, 'p', 'borui-nishijin-2', '2度目の軍は、どれほど？', 'out'),
 ]),
 'Clue9Fleet': ('第9の手がかり', '2度目は、14万人の大軍だった？', [
  (0, 1, 'a', "<MapScene cam={{lon: 126.5, lat: 32.5, zoom: 0.95}} routes={[{from: 'gappo', to: 'iki', at: 10}, {from: 'keigen', to: 'hirado', at: 40, color: '#ff8f80'}]} pins={[{key: 'gappo', name: '東路軍', dx: -190, at: 10}, {key: 'keigen', name: '江南軍', at: 40, color: '#ff8f80'}, {key: 'iki', name: '壱岐', at: 80}]} />", '2つの軍', True),
  (2, 6, 'a', "<Figures figs={[{value: '4万人', label: '東路軍', small: '船 900隻'}, {value: '10万人', label: '江南軍', small: '船 3500隻', accent: true}]} note='元や高麗の側の記録の数字' />", 'あわせて、14万人？', False),
  (7, 7, 'p', 'map-strait', '海を越える、最大級の攻撃', 'in'),
  (8, 9, 'a', "<TimeBar stops={[{label: '5月3日', sub: '東路軍 出発'}, {label: '6月18日', sub: '江南軍 出発', accent: true}]} note='1か月半の遅れ' />", '出発は、そろった？', False),
  (10, 12, 'a', "<Cards cards={[{head: '記録の数字', body: '14万人\\n4400隻', tone: 'gold'}, {head: 'コンランの見方', body: 'もっと\\nずっと小さい？', tone: 'dark'}]} tone='ink' />", '本当に14万人？', False),
  (13, 14, 'p', 'anchor-mouko', '海の底の証拠', 'in'),
  (15, 15, 'p', 'sword-mouko-w', '空前の大軍', 'left'),
  (16, 17, 'p', 'song-bowl', '国を滅ぼされた兵たち', 'in'),
  (18, None, 'v', 'half'),
  (21, None, 'p', 'shikanoshima-1', '嵐だけで、敗れたのか？', 'out'),
 ]),
 'Clue10Kamikaze': ('第10の手がかり', '2度目は、嵐だけで勝った？', [
  (0, 1, 'p', 'nokonoshima-view-w', '博多湾の入り口', 'left'),
  (2, 3, 'p', 'borui-iki-4', '石の壁が、ずらりと', 'in'),
  (4, 4, 'p', 'shikanoshima-air', '志賀島へ', 'in'),
  (5, 5, 'a', '<NightRaid />', '夜のうちに？', False),
  (6, 6, 'p', 'shikanoshima-2', '海の中道', 'right'),
  (7, 7, 'p', 'ekotoba-e16-w', '敵の船に乗り込む', 'scroll'),
  (8, 8, 'a', "<MapScene cam={{lon: 129.9, lat: 33.6, zoom: 2.8}} routes={[{from: 'shika', via: ['iki'], to: 'takashima', at: 10}]} pins={[{key: 'shika', name: '志賀島', dx: 20, at: 5}, {key: 'iki', name: '壱岐', at: 30}, {key: 'takashima', name: '鷹島', at: 60, big: true}]} />", '元軍は、どこへ？', True),
  (9, 11, 'a', "<TimeBar stops={[{label: '6月初め', sub: '博多湾に現れる'}, {label: '7月', sub: '病気・食料の不足'}, {label: '7月末', sub: '江南軍と合流', accent: true}]} tone='sea' />", '海の上で、2か月', False),
  (12, 12, 'a', "<MapScene cam={{lon: 129.7, lat: 33.45, zoom: 5}} fleet={{key: 'takashima', n: 90, at: 10}} pins={[{key: 'takashima', name: '鷹島', big: true}, {key: 'hirado', name: '平戸', at: 40, dx: -150}]} />", '鷹島に集まった大船団', True),
  (13, 15, 'a', '<TyphoonStrike />', 'そして、7月30日の夜', False),
  (16, 16, 'p', 'typhoon-nanmadol', '台風だった', 'in'),
  (17, 17, 'p', 'imari-bay-w', '2度目の神風は、本当に', 'left'),
  (18, 20, 'a', "<TimeBar stops={[{label: '6月初め', sub: 'もし上陸できていたら'}, {label: '8月下旬', sub: '台風の季節', accent: true}]} tone='night' note='石の壁と夜襲が、上陸を阻んだ' />", 'もし、石の壁がなかったら？', False),
  (21, 22, 'p', 'borui-mukaihama-w', 'とどめになった台風', 'right'),
  (23, None, 'v', 'wrong'),
  (26, None, 'p', 'takashima-1', '海に残された元軍は？', 'out'),
 ]),
 'Clue11Survivors': ('第11の手がかり', '嵐で、元軍は全滅した？', [
  (0, 0, 'p', 'takashima-bridge-view', '嵐が去った海', 'out'),
  (1, 2, 'a', '<Escape />', '総大将は、どうした？', False),
  (3, 4, 'p', 'takashima-2', '鷹島に上陸した兵', 'right'),
  (5, 5, 'p', 'takashima-3', '島に残る言い伝え', 'left'),
  (6, 7, 'a', "<Figures figs={[{value: '10万', label: 'の兵のうち'}, {value: '3人？', label: 'だけ生還', accent: true}]} note='そのまま信じることはできない' tone='ink' />", 'よく聞く話は、本当？', False),
  (8, 9, 'a', "<Cards cards={[{head: '総大将たち', body: '船で\\n帰っている', tone: 'gold'}, {head: '高麗の記録', body: '帰らなかった者\\n7000人あまり', tone: 'dark'}]} tone='ink' />", '記録では？', False),
  (10, 11, 'p', 'helmet-captured', '命を落とし、捕らえられた', 'in'),
  (12, 13, 'a', "<Cards cards={[{head: '北条時宗の命令書', body: '元の船の多くは\\nすでに去った', tone: 'paper'}]} tone='ember' size={56} />", '嵐のあとの命令書', False),
  (14, 14, 'p', 'ainoshima-kuyoto', '海の底に、眠り続ける', 'in'),
  (15, None, 'v', 'wrong'),
  (18, None, 'p', 'kozaki-site-2', '沈んだ船は、見つかる？', 'out'),
 ]),
 'Clue12Wrecks': ('第12の手がかり', '海に沈んだ元の船は、見つからない？', [
  (0, 1, 'p', 'takashima-bridge-1', '伊万里湾の入り口、鷹島', 'right'),
  (2, 2, 'a', "<MapScene cam={{lon: 129.75, lat: 33.4, zoom: 4}} to={{lon: 129.75, lat: 33.43, zoom: 7}} pins={[{key: 'takashima', name: '鷹島', big: true}]} />", '1281年の夏、この島で', True),
  (3, 5, 'p', 'seal-mouko', '砂の中から、銅の印', 'in'),
  (6, 6, 'p', 'woodseal-mouko', '元の軍の持ち物', 'in'),
  (7, 8, 'p', 'takashima-port', '1980年、海の底の調査', 'left'),
  (9, 10, 'p', 'arrows-mouko', 'およそ4000点', 'in'),
  (11, 15, 'a', '<Wreck1 />', '2011年、大発見', False),
  (16, 17, 'a', "<Figures figs={[{value: '2012', label: '年', small: '国の史跡に'}, {value: '38万', label: '平方メートル', small: '鷹島神崎遺跡', accent: true}]} />", '海の中の遺跡が、初めて', False),
  (18, 20, 'a', '<TakashimaWrecks />', '3隻目も', False),
  (21, 22, 'p', 'brick-mouko', '泥の中こそ、保管庫', 'in'),
  (23, None, 'v', 'wrong'),
  (26, None, 'p', 'bow-mouko', 'どうやって、見つける？', 'in'),
 ]),
 'Clue13Search': ('第13の手がかり', '海の底の船は、潜って探せば見つかる？', [
  (0, 3, 'a', '<MurkyDive />', '潜れば、見つかる？', False),
  (4, 7, 'a', '<SonarScan />', '音で、泥の下を探る', False),
  (8, 8, 'a', '<Magnetometer />', '金属に反応する探査', False),
  (9, 10, 'a', '<DiverDredge />', '泥を、少しずつ', False),
  (11, 11, 'a', '<PhotoMosaic />', '写真から、立体の姿を', False),
  (12, 12, 'a', '<TetheredROV />', '無人の潜水機', False),
  (13, 16, 'p', 'anchor-mouko-2', '引き揚げたものを調べる', 'in'),
  (17, 19, 'a', "<Figures figs={[{value: '47万', label: 'か所', small: '日本の遺跡'}, {value: '400', label: 'か所', small: '海や湖の中の遺跡', accent: true}]} tone='sea' />", '海の中の遺跡は、どれだけ？', False),
  (20, None, 'v', 'wrong'),
  (23, None, 'p', 'anchorstone-shotenji', 'どんな船だった？', 'in'),
 ]),
 'Clue14Ships': ('第14の手がかり', '元の船は、急いで造った手抜きの船だった？', [
  (0, 2, 'p', 'anchorstone-kushida-2', '急いで造った船？', 'in'),
  (3, 6, 'a', '<HullSection />', '高麗の船ではなかった？', False),
  (7, 8, 'a', '<DoublePlank />', '船の底を調べると？', False),
  (9, 12, 'a', '<KeelJoint />', '2025年の新発見', False),
  (13, 14, 'p', 'anchorstone-kushida-1-w', '碇石', 'scroll'),
  (15, 17, 'a', '<SugarSoak />', '木の形を、どう守る？', False),
  (18, 20, 'p', 'sinan-1', '当時の中国の造船技術', 'in'),
  (21, 21, 'a', '<CrowdedBay />', '狭い湾に、何百隻も', False),
  (22, None, 'v', 'wrong'),
  (25, None, 'p', 'lion-mouko', '乗っていたのは、どんな人？', 'in'),
 ]),
 'Clue15Board': ('第15の手がかり', '元の船には、文字は残っていない？', [
  (0, 2, 'p', 'deer-mouko', '文字は、残らない？', 'in'),
  (3, 4, 'p', 'takashima-bridge-2', '2026年4月、松浦市が公表', 'left'),
  (5, 6, 'a', '<BoardActual />', '一枚の、杉の板', False),
  (7, 8, 'a', "<Cards cards={[{head: '墨の文字', body: 'ほとんどが\\n薄れて\\n読めない', tone: 'dark'}]} tone='ink' size={56} />", '何が書かれていた？', False),
  (9, 11, 'a', "<TimeBar stops={[{label: '至元十二年', sub: '1275年'}, {label: '至元十三年', sub: '1276年'}]} tone='ember' note='赤外線の撮影で、最後の行に読み取れた' />", '浮かび上がった年号は？', False),
  (12, 15, 'a', "<Cards cards={[{head: '広島大学 舩田善之 准教授', body: 'これまでになかった\\n唯一無二の資料', tone: 'gold'}]} tone='ink' size={54} />", '読み解いた研究者は？', False),
  (16, 16, 'p', 'goryeo-celadon-2', '船の中の決まりごと', 'in'),
  (17, 21, 'a', "<TimeBar stops={[{label: '1275〜76年', sub: '板の年号'}, {label: '1281年', sub: '船が沈む', accent: true}]} note='5年以上の差' />", '年号が、合わない？', False),
  (22, None, 'v', 'wrong'),
  (25, None, 'p', 'song-celadon-2', '積まれていた武器は？', 'in'),
 ]),
 'Clue16Arrows': ('第16の手がかり', '元軍は、滅ぼした国の武器まで使っていた？', [
  (0, 2, 'a', '<SieveMud />', '船底の泥を、ふるうと？', False),
  (3, 8, 'a', "<Cards cards={[{head: '色', body: '黒い漆\\n端に赤い漆', tone: 'dark'}, {head: '矢筈', body: '溝がなく\\n皿のように浅い', tone: 'gold'}, {head: '羽根', body: '鳥の羽ではなく\\n木の板', tone: 'dark'}]} tone='ember' size={44} />", 'どんな矢だった？', False),
  (9, 9, 'p', 'mongol-bow', '武器の改良', 'in'),
  (10, 12, 'a', '<ArmsFlow />', 'なぜ、元の船に？', False),
  (13, 16, 'p', 'mongol-helmet-2', '南宋の兵が、南宋の矢を', 'in'),
  (17, 19, 'a', "<MapScene cam={{lon: 125.5, lat: 31.5, zoom: 1.0}} routes={[{from: 'keigen', to: 'takashima', at: 10, color: '#ff8f80'}]} pins={[{key: 'keigen', name: '慶元（今の寧波）', at: 5, big: true}, {key: 'takashima', name: '鷹島', at: 70}]} />", '江南軍の旅の跡', True),
  (20, None, 'v', 'right'),
  (23, None, 'p', 'kushida-1', '戦うだけの集団？', 'in'),
 ]),
 'Clue17Games': ('第17の手がかり', '元の兵士は、戦うだけの集団だった？', [
  (0, 2, 'a', '<ThreeNations />', '2026年10月、国をこえた調査', False),
  (3, 7, 'a', '<SternHalf />', '3号船の正体は？', False),
  (8, 12, 'a', '<TinyPieces />', '船の中から、何が？', False),
  (13, 15, 'a', '<Galley />', 'すぐそばには？', False),
  (16, 19, 'a', '<LanternGame />', '船の中の暮らし', False),
  (20, None, 'v', 'wrong'),
  (23, None, 'p', 'kameyama-statue-3', '勝った日本の側は？', 'in'),
 ]),
 'Clue18Bakufu': ('第18の手がかり', '元に勝った幕府は、強くなった？', [
  (0, 4, 'a', '<NoNewLand />', 'ほうびの土地は？', False),
  (5, 7, 'p', 'ekotoba-amanawa-w', '季長、鎌倉へ', 'scroll'),
  (8, 10, 'p', 'ekotoba-uma-w', '安達泰盛に、直訴', 'right'),
  (11, 12, 'p', 'ekotoba-borui-w', '絵巻に込めた思い', 'scroll'),
  (13, 15, 'a', "<TimeBar stops={[{label: '1284年', sub: '北条時宗が亡くなる'}, {label: '1285年', sub: '霜月騒動\\n安達泰盛が滅ぶ', accent: true}]} tone='ember' />", '恩人は、どうなった？', False),
  (16, 17, 'a', "<TimeBar stops={[{label: '1297年', sub: '永仁の徳政令'}]} tone='ink' note='御家人の苦しさは、救えなかった' />", '幕府の手は？', False),
  (18, 19, 'a', "<Cards cards={[{head: '3度目の計画', body: '船や食料を\\n集めていた', tone: 'red'}, {head: 'けれども', body: 'ベトナムの戦いを\\n優先して中止', tone: 'dark'}]} tone='ink' />", '元は、あきらめた？', False),
  (20, 21, 'p', 'iki-suketoki', '終わらない守りの負担', 'in'),
  (22, 23, 'a', "<TimeBar stops={[{label: '1274年', sub: '文永の役'}, {label: '1281年', sub: '弘安の役'}, {label: '1333年', sub: '鎌倉幕府が滅ぶ', accent: true}]} tone='night' />", 'そして、幕府は', False),
  (24, None, 'v', 'wrong'),
  (27, None, 'p', 'hakozaki-romon-1', '神風という言葉は、どこから？', 'in'),
 ]),
 'Clue19Shinkoku': ('第19の手がかり', '神風は、昔からの信仰だった？', [
  (0, 2, 'a', "<Cards cards={[{head: '武士', body: '戦った手柄に\\nほうびを', tone: 'dark'}, {head: '寺や神社', body: '祈った手柄に\\nほうびを', tone: 'gold'}]} tone='ember' />", 'ほうびを求めたのは？', False),
  (3, 4, 'p', 'hakozaki-hoanden', '神に守られた国？', 'in'),
  (5, 5, 'p', 'hakozaki-tekikoku', '敵国降伏', 'in'),
  (6, 6, 'p', 'kameyama', '亀山上皇の祈り', 'in'),
  (7, 8, 'p', 'kameyama-statue-1', '明治時代、ふたたび', 'in'),
  (9, 9, 'p', 'genko-monument', '学校や歌で', 'in'),
  (10, 12, 'a', "<TimeBar stops={[{label: '1281年', sub: '弘安の役'}, {label: '明治時代', sub: '元寇の物語が\\n広く語られる'}, {label: '太平洋戦争', sub: '「神風」の名の\\n部隊', accent: true}]} tone='ink' />", '時代とともに、どう使われた？', False),
  (13, 14, 'p', 'genko-museum-1-w', '神風の陰に', 'left'),
  (15, 16, 'p', 'borui-jigyo', '石の壁を築いた人々', 'in'),
  (17, None, 'v', 'half'),
 ]),
 'RootsStory': (None, None, [
  (0, 1, 'a', "<Cards cards={[{head: '1度目', body: '嵐が追い返したとは\\n言えない', tone: 'dark'}, {head: '2度目', body: '台風は吹いた\\nでも、その前に…', tone: 'gold'}]} tone='night' />", '神風は、本当に吹いたのか', False),
  (2, 3, 'p', 'mouko-zuka', '本当の物語は、どこに？', 'in'),
  (4, 5, 'a', "<Cards cards={[{head: '2024年度', body: '水中スクーターで\\n濁りを払う', tone: 'dark'}]} tone='sea' size={56} />", '調べにくい海', False),
  (6, 8, 'a', '<CopperNet />', '泥から出すと、どうなる？', False),
  (9, 10, 'a', "<Cards cards={[{head: '引き揚げ', body: 'できる', tone: 'dark'}, {head: '保存・展示の施設', body: '足りない', tone: 'red'}]} tone='ink' />", 'なぜ、引き揚げない？', False),
  (11, 13, 'a', "<TimeBar stops={[{label: '1974', sub: '印'}, {label: '1980', sub: '調査開始'}, {label: '2011', sub: '1号船'}, {label: '2015', sub: '2号船'}, {label: '2023', sub: '3号船'}, {label: '2026', sub: '板・矢・遊び道具', accent: true}]} tone='sea' />", '少しずつ、確実に', False),
  (14, 16, 'a', "<Cards cards={[{head: '750年前', body: '敵どうし\\nとして\\n向き合った', tone: 'red'}, {head: '今', body: '同じ海の底を\\n一緒に\\n調べている', tone: 'gold'}]} tone='sea' />", 'かつての敵どうしが', False),
  (17, 18, 'p', 'komoda-stele', '神風の物語', 'in'),
  (19, 21, 'p', 'genko-museum-2', '海の底が語る、別の物語', 'in'),
  (22, None, 'p', 'borui-imazu-3-w', 'たくさんの人々の物語', 'left'),
 ]),
 'UnsolvedMystery': (None, None, [
  (0, 0, 'a', "<Cards cards={[{head: '謎1', body: '木の板', tone: 'dark'}, {head: '謎2', body: '3号船', tone: 'dark'}, {head: '謎3', body: '1度目の撤退', tone: 'dark'}]} tone='night' size={52} />", 'まだ判決を出せない謎', False),
  (1, 5, 'a', "<Cards cards={[{head: '木の板', body: '決まりごと？\\n名簿？', tone: 'gold'}, {head: 'もし名簿なら', body: '乗っていた人の\\n名前が？', tone: 'dark'}]} tone='ember' />", '板には、何が書かれていた？', False),
  (6, 10, 'a', "<Cards cards={[{head: '3号船', body: '全長およそ30m\\n母船の可能性', tone: 'gold'}, {head: 'わからないこと', body: 'いつ、どこで造られ\\nどんな旅をした？', tone: 'dark'}]} tone='sea' />", '3号船は、誰の船？', False),
  (11, 14, 'a', "<Cards cards={[{head: '嵐？', body: '', tone: 'dark'}, {head: '矢が尽きた？', body: '', tone: 'dark'}, {head: '指揮官の対立？', body: '', tone: 'dark'}, {head: '最初から計画？', body: '', tone: 'dark'}]} tone='night' height={160} top={460} />", '1度目、なぜ引き揚げた？', False),
  (15, None, 'p', 'hakata-bay-2-w', 'まだ眠る船が、ある', 'left'),
 ]),
}

INTRO_PHOTOS = set()
for f in ('Intro', 'JudgeEntrance', 'Clue1Letter'):
    INTRO_PHOTOS |= set(re.findall(r'Photo id="([^"]+)"', (ROOT / f'src/scenes/{f}.tsx').read_text()))
known = set(re.findall(r"^\t'([\w-]+)':", (ROOT / 'src/data/photos.ts').read_text(), re.M))
caps = (ROOT / 'src/data/captions.ts').read_text()


def ncaps(var):
    a = caps.index(f'export const {var}')
    return caps[a:caps.index('];', a)].count('"startMs"')


used_p, used_a, errors = list(INTRO_PHOTOS), [], []
for scene, (label, title, beats) in S.items():
    var = scene[0].lower() + scene[1:] + 'Captions'
    n = ncaps(var)
    imp_kit, imp3, imp4 = set(), set(), set()
    body = []
    has_v = False
    for b in beats:
        fr, to, kind = b[0], b[1], b[2]
        if fr >= n or (to is not None and to >= n):
            errors.append(f'{scene}: 字幕番号が範囲外 {fr}-{to}（{n}文）')
        if kind == 'v':
            has_v = True
            body.append(f'\t\t\t<Beat name="判決" captions={{c}} from={{{fr}}} to={{{fr + 2}}}>\n\t\t\t\t<GavelVerdict verdict="{'correct' if b[3] == 'right' else b[3]}" strikeAt={{captionFrame(c, {fr}, {fr + 1}, fps)}} />\n\t\t\t</Beat>')
            continue
        rng = f'from={{{fr}}}' + (f' to={{{to}}}' if to is not None else '')
        if kind == 'p':
            pid, lab, mv = b[3], b[4], b[5]
            if pid not in known:
                errors.append(f'{scene}: 写真がない {pid}')
            if pid in used_p:
                errors.append(f'{scene}: 写真の重複 {pid}')
            used_p.append(pid)
            body.append(f'\t\t\t<Beat name="{lab}" captions={{c}} {rng}>\n\t\t\t\t<Photo id="{pid}" move="{mv}" label="{lab}" />\n\t\t\t</Beat>')
        else:
            jsx, lab, bottom = b[3], b[4], b[5]
            if jsx in used_a:
                errors.append(f'{scene}: 図解の重複 {jsx[:40]}')
            used_a.append(jsx)
            comp = re.match(r'<(\w+)', jsx).group(1)
            (imp_kit if comp in KIT else imp3 if comp in ART3 else imp4 if comp in ART4 else errors.append(f'不明な図解 {comp}') or set()).add(comp)
            body.append(f'\t\t\t<Beat name="{lab}" captions={{c}} {rng}>\n\t\t\t\t<Stage label="{lab}"{" labelBottom" if bottom else ""}>\n\t\t\t\t\t{jsx}\n\t\t\t\t</Stage>\n\t\t\t</Beat>')
    imports = []
    if has_v:
        imports.append("import {useVideoConfig} from 'remotion';")
        imports.append("import {Beat, captionFrame} from '../components/Beat';")
    else:
        imports.append("import {Beat} from '../components/Beat';")
    imports.append("import {Stage} from '../components/Cinema';")
    if imp3:
        imports.append(f"import {{{', '.join(sorted(imp3))}}} from '../components/GenkoArt3';")
    if imp4:
        imports.append(f"import {{{', '.join(sorted(imp4))}}} from '../components/GenkoArt4';")
    if imp_kit:
        imports.append(f"import {{{', '.join(sorted(imp_kit))}}} from '../components/GenkoKit';")
    if has_v:
        imports.append("import {GavelVerdict} from '../components/GavelVerdict';")
    imports.append("import {Photo} from '../components/Photo';")
    imports.append("import {SceneFrame} from '../components/SceneFrame';")
    imports.append(f"import {{{var} as c}} from '../data/captions';")
    head = f'label="{label}" title="{title}"' if label else ''
    fps = '\tconst {fps} = useVideoConfig();\n' if has_v else ''
    src = '\n'.join(imports) + f"\n\n// {title or scene}（素材はすべてこの場面だけで使う。scripts/gen_scenes_genko.py が作る）\nexport const {scene} = () => {{\n{fps}\treturn (\n\t\t<SceneFrame captions={{c}} voice=\"{scene}\" {head}>\n" + '\n'.join(body) + '\n\t\t</SceneFrame>\n\t);\n};\n'
    (ROOT / f'src/scenes/{scene}.tsx').write_text(src)

if errors:
    print('\n'.join(errors))
    sys.exit(1)
unused = sorted(known - set(used_p))
print('写真', len(set(used_p)), '／未使用', len(unused), ' '.join(unused))
print('図解', len(used_a))

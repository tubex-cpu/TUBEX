import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Figures, TimeBar} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {rootsStoryCaptions as c} from '../data/captions';

// RootsStory（素材はすべてこの場面だけで使う。scripts/gen_scenes_machu.py が作る）
export const RootsStory = () => {
	return (
		<SceneFrame captions={c} voice="RootsStory" >
			<Beat name="手がかりを、つなぐと" captions={c} from={0} to={0}>
				<Stage label="手がかりを、つなぐと">
					<ReliefMap view='cusco' focus={P.ollantay} zoom={1.05} pins={[{at: P.cusco, name: 'クスコ', t: 10, dx: -90}, {at: P.machu, name: 'マチュピチュ', big: true, t: 30}]} lines={[{pts: [P.cusco, P.ollantay, P.machu], t: 20, len: 70}]} />
				</Stage>
			</Beat>
			<Beat name="15世紀のはじめ" captions={c} from={1} to={1}>
				<Photo id="pachacuti-statue" move="in" label="15世紀のはじめ" />
			</Beat>
			<Beat name="尾根の上の離宮" captions={c} from={2} to={3}>
				<Photo id="intipunku" move="in" label="尾根の上の離宮" />
			</Beat>
			<Beat name="帝国中から集められた人々" captions={c} from={4} to={5}>
				<Photo id="llama-2" move="in" label="帝国中から集められた人々" />
			</Beat>
			<Beat name="離宮から、人が消えた" captions={c} from={6} to={9}>
				<Stage label="離宮から、人が消えた">
					<TimeBar stops={[{label: '1420年ごろ', sub: '暮らしが\n始まる'}, {label: '1532年', sub: 'スペインの\n征服'}, {label: '16世紀', sub: '書類に\n「ピチュ」'}, {label: '?', sub: '人の姿が\n消える', accent: true}]} tone='moss' />
				</Stage>
			</Beat>
			<Beat name="畑を耕し続けた人々" captions={c} from={10} to={10}>
				<Photo id="ollanta-2" move="in" label="畑を耕し続けた人々" />
			</Beat>
			<Beat name="そして1911年" captions={c} from={11} to={11}>
				<Photo id="bingham-lc" move="in" label="そして1911年" />
			</Beat>
			<Beat name="およそ100年後の縁" captions={c} from={12} to={13}>
				<Stage label="およそ100年後の縁">
					<Figures figs={[{value: '1917', label: '年ごろ', small: '野内与吉、ペルーへ'}, {value: '2026', label: '年', small: '日本のレーザー調査', accent: true}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="500年をかけて紡いだ都市" captions={c} from={14}>
				<Photo id="qeswachaka" move="in" label="500年をかけて紡いだ都市" />
			</Beat>
		</SceneFrame>
	);
};

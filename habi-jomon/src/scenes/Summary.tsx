import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {VerdictBoard} from '../components/VerdictBoard';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {summaryCaptions as c} from '../data/captions';

type Row = {q: string; v: 'right' | 'half' | 'wrong'};
const g0: Row[] = [
	{q: '1万年以上続いた？', v: 'right'},
	{q: '世界最古の土器？', v: 'half'},
	{q: '暮らしは変わらなかった？', v: 'wrong'},
	{q: '文明と呼べる？', v: 'half'},
	{q: '狩りで暮らした？', v: 'half'},
	{q: '移動しながら暮らした？', v: 'wrong'},
	{q: 'クリの森を育てた？', v: 'right'},
	{q: '木の実を貯めた？', v: 'right'},
];
const g1: Row[] = [
	{q: '漆を使いこなした？', v: 'right'},
	{q: 'でんぷんを食べこなせた？', v: 'half'},
	{q: '寒さに強い体？', v: 'half'},
	{q: '大災害でも滅びなかった？', v: 'right'},
	{q: '戦争がなかった？', v: 'half'},
	{q: '平和主義だった？', v: 'half'},
	{q: '遠くの村とやりとり？', v: 'right'},
	{q: '争いは弥生から？', v: 'right'},
];
const g2: Row[] = [
	{q: '土偶は宇宙人？', v: 'wrong'},
	{q: '土偶はわざと壊された？', v: 'half'},
	{q: '大人になると歯を抜いた？', v: 'right'},
	{q: 'ストーンサークルは暦？', v: 'half'},
	{q: '人の数は激減した？', v: 'right'},
	{q: '終わらせたのは寒さ？', v: 'half'},
	{q: '弥生人に滅ぼされた？', v: 'wrong'},
	{q: '縄文人は消滅した？', v: 'wrong'},
];

// まとめ：24の判決を、3つのまとまりごとに、ナレーションに合わせて1つずつ灯す
export const Summary = () => {
	const {fps} = useVideoConfig();
	const at = (rows: Row[], from: number, first: number) => rows.map((_, i) => captionFrame(c, from, first + i, fps));
	return (
		<SceneFrame captions={c} voice="Summary">
			<Beat name="暮らしの長さと形" captions={c} from={0} to={8}>
				<Stage>
					<VerdictBoard title="暮らしの長さと形" rows={g0} first={1} startAt={at(g0, 0, 1)} />
				</Stage>
			</Beat>
			<Beat name="技術・体・争い" captions={c} from={9} to={16}>
				<Stage>
					<VerdictBoard title="技術・体・争い" rows={g1} first={9} startAt={at(g1, 9, 9)} />
				</Stage>
			</Beat>
			<Beat name="祈りと、暮らしの終わり" captions={c} from={17} to={24}>
				<Stage>
					<VerdictBoard title="祈りと、暮らしの終わり" rows={g2} first={17} startAt={at(g2, 17, 17)} />
				</Stage>
			</Beat>
			<Beat name="消えたもの" captions={c} from={25} to={25}>
				<Photo id="matome-oyu-closeup" move="in" label="消えたのは、何だったのか" />
			</Beat>
			<Beat name="本当の話" captions={c} from={26}>
				<Photo id="end-sunrise-yatsugatake" move="in" label="本当の話は、作り話より面白い" />
			</Beat>
		</SceneFrame>
	);
};

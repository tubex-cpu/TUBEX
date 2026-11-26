import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {VerdictBoard} from '../components/VerdictBoard';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {summaryCaptions as c} from '../data/captions';

type Row = {q: string; v: 'right' | 'half' | 'wrong'};
const g0: Row[] = [
	{q: '百枚もらった？', v: 'right'},
	{q: '239年？', v: 'half'},
	{q: '使いが持ち帰った？', v: 'wrong'},
	{q: '景初三年の鏡がある？', v: 'right'},
	{q: '正始元年の鏡もある？', v: 'right'},
	{q: '景初四年は偽物？', v: 'wrong'},
	{q: '百枚しかない？', v: 'wrong'},
	{q: '中国で1枚も出ない？', v: 'half'},
	{q: '徐州と洛陽と書いてある？', v: 'right'},
];
const g1: Row[] = [
	{q: '鉛で作った場所が分かる？', v: 'wrong'},
	{q: '中国製と日本製は見分けられる？', v: 'wrong'},
	{q: '33枚が棺を囲んだ？', v: 'right'},
	{q: '大切なのは三角縁？', v: 'wrong'},
	{q: '故郷はもう分からない？', v: 'wrong'},
	{q: 'すぐに墓に入れた？', v: 'wrong'},
	{q: '魔鏡だった？', v: 'half'},
	{q: '鏡は神そのもの？', v: 'right'},
];
const g2: Row[] = [
	{q: '兄弟の鏡が全国に？', v: 'right'},
	{q: '奈良の王が配った？', v: 'half'},
	{q: '卑弥呼の墓から出た？', v: 'wrong'},
	{q: '箸墓は卑弥呼の死のころ？', v: 'half'},
	{q: '纒向に大きな町？', v: 'right'},
	{q: '最大の鏡は九州？', v: 'right'},
	{q: '吉野ヶ里に王の墓？', v: 'half'},
	{q: '特別展で解けた？', v: 'wrong'},
];

// まとめ：25の判決を、3つのまとまりごとに、ナレーションに合わせて1つずつ灯す
export const Summary = () => {
	const {fps} = useVideoConfig();
	const at = (rows: Row[], from: number, first: number) => rows.map((_, i) => captionFrame(c, from, first + i, fps));
	return (
		<SceneFrame captions={c} voice="Summary">
			<Beat name="魏志倭人伝と鏡の数" captions={c} from={0} to={9}>
				<Stage>
					<VerdictBoard title="魏志倭人伝と鏡の数" rows={g0} first={1} startAt={at(g0, 0, 1)} />
				</Stage>
			</Beat>
			<Beat name="鏡を調べる" captions={c} from={10} to={17}>
				<Stage>
					<VerdictBoard title="鏡を調べる" rows={g1} first={10} startAt={at(g1, 10, 10)} />
				</Stage>
			</Beat>
			<Beat name="邪馬台国はどこか" captions={c} from={18} to={25}>
				<Stage>
					<VerdictBoard title="邪馬台国はどこか" rows={g2} first={18} startAt={at(g2, 18, 18)} />
				</Stage>
			</Beat>
			<Beat name="天秤はまだ揺れている" captions={c} from={26}>
				<Photo id="end-makimuku-sunset" move="in" label="天秤は、まだ揺れている" />
			</Beat>
		</SceneFrame>
	);
};

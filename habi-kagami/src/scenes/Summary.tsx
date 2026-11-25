import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {VerdictBoard} from '../components/VerdictBoard';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {summaryCaptions as c} from '../data/captions';

type Row = {q: string; v: 'right' | 'half' | 'wrong'};
const g0: Row[] = [
	{q: '十数体しかない？', v: 'right'},
	{q: '湯殿山の行者が生んだ？', v: 'half'},
	{q: '御神体は語れない？', v: 'right'},
	{q: '湯殿山と羽黒山の争い？', v: 'right'},
	{q: '位の高い僧だった？', v: 'wrong'},
	{q: '木の実と草で何年も？', v: 'right'},
	{q: '漆を飲んだ？', v: 'wrong'},
	{q: '土の中で鉦を鳴らした？', v: 'half'},
	{q: '必ず土に埋めた？', v: 'wrong'},
];
const g1: Row[] = [
	{q: '本明海は藩主の身代わり？', v: 'wrong'},
	{q: '真如海は飢饉の年に？', v: 'right'},
	{q: '鉄門海は目をくりぬいた？', v: 'right'},
	{q: '鉄門海は生きたまま土へ？', v: 'wrong'},
	{q: '同時代の人はあがめた？', v: 'half'},
	{q: '鉄竜海は自然にミイラに？', v: 'wrong'},
	{q: '忠海は乾いていた？', v: 'wrong'},
	{q: '円明海は木食行の果てに？', v: 'half'},
	{q: '体の中にハエの殻？', v: 'right'},
	{q: '死後に整えられた？', v: 'right'},
	{q: '弘智法印は最古？', v: 'right'},
	{q: '宥貞は棺で鉦を？', v: 'wrong'},
	{q: '鉄門海は本人と確認？', v: 'right'},
];
const g2: Row[] = [
	{q: '明治天皇が禁じた？', v: 'wrong'},
	{q: '仏海は生きたまま土へ？', v: 'wrong'},
	{q: '仏海は58年後に発掘？', v: 'right'},
	{q: '土中入定と同じ信仰？', v: 'wrong'},
	{q: '中国の僧のミイラが日本に？', v: 'half'},
	{q: '仏像の中に僧の遺体？', v: 'right'},
	{q: 'タイの僧は自らミイラに？', v: 'wrong'},
	{q: '失われた即身仏がある？', v: 'right'},
	{q: 'すべて寺が守る？', v: 'wrong'},
	{q: 'いまも衣を替える？', v: 'right'},
	{q: '広く知られたのは明治以降？', v: 'half'},
];

// まとめ：33の判決を、3つのまとまりごとに、ナレーションに合わせて1つずつ灯す
export const Summary = () => {
	const {fps} = useVideoConfig();
	const at = (rows: Row[], from: number, first: number) => rows.map((_, i) => captionFrame(c, from, first + i, fps));
	return (
		<SceneFrame captions={c} voice="Summary">
			<Beat name="伝承と湯殿山" captions={c} from={0} to={9}>
				<Stage>
					<VerdictBoard title="伝承と湯殿山" rows={g0} first={1} startAt={at(g0, 0, 1)} />
				</Stage>
			</Beat>
			<Beat name="即身仏を調べる" captions={c} from={10} to={22}>
				<Stage>
					<VerdictBoard title="即身仏を調べる" rows={g1} first={10} startAt={at(g1, 10, 10)} />
				</Stage>
			</Beat>
			<Beat name="明治から現代へ" captions={c} from={23} to={33}>
				<Stage>
					<VerdictBoard title="明治から現代へ" rows={g2} first={23} startAt={at(g2, 23, 23)} />
				</Stage>
			</Beat>
			<Beat name="伝説ではなかった" captions={c} from={34}>
				<Photo id="yonezawa-shinpukuji" move="in" label="守り続けた人々の思い" />
			</Beat>
		</SceneFrame>
	);
};

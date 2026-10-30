import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {VerdictBoard} from '../components/GenkoArt4';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {summaryCaptions as c} from '../data/captions';

const rows = [
	{q: '元は、いきなり攻めてきた？', v: 'wrong'},
	{q: '最初に襲われたのは博多？', v: 'wrong'},
	{q: '鎌倉武士は一騎打ちで負けた？', v: 'half'},
	{q: 'てつはうは音だけ？', v: 'wrong'},
	{q: '教科書の絵は、見たまま？', v: 'half'},
	{q: '1度目は、嵐で追い返された？', v: 'half'},
	{q: '幕府は、元の使いを斬った？', v: 'right'},
	{q: '20キロの石の壁を築いた？', v: 'right'},
	{q: '2度目は14万人の大軍？', v: 'half'},
	{q: '2度目は、嵐だけで勝った？', v: 'wrong'},
	{q: '嵐で、元軍は全滅した？', v: 'wrong'},
	{q: '沈んだ船は、見つからない？', v: 'wrong'},
	{q: '潜って探せば見つかる？', v: 'wrong'},
	{q: '元の船は、手抜きの船？', v: 'wrong'},
	{q: '元の船に、文字は残らない？', v: 'wrong'},
	{q: '滅ぼした国の武器を使った？', v: 'right'},
	{q: '兵士は、戦うだけの集団？', v: 'wrong'},
	{q: '勝った幕府は、強くなった？', v: 'wrong'},
	{q: '神風は、昔からの信仰？', v: 'half'},
] as const;

// まとめ：19の判決を、ナレーションに合わせて1つずつ灯す
export const Summary = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Summary">
			<Beat name="今夜の判決" captions={c} from={0} to={19}>
				<Stage>
					<VerdictBoard rows={rows} startAt={rows.map((_, i) => captionFrame(c, 0, i + 1, fps))} />
				</Stage>
			</Beat>
			<Beat name="神風だけではなかった" captions={c} from={20} to={21}>
				<Photo id="kameyama-statue-2" move="out" label="日本を救ったのは？" />
			</Beat>
			<Beat name="今も上がり続ける証拠" captions={c} from={22}>
				<Photo id="nokonoshima-air" move="in" label="海の底から、今も" />
			</Beat>
		</SceneFrame>
	);
};

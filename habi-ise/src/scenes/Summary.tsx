import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {VerdictBoard} from '../components/VerdictBoard';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {summaryCaptions as c} from '../data/captions';

const rows = [
	{q: 'マチュピチュを発見したのは、ビンガム？', v: 'wrong'},
	{q: 'マチュピチュは、インカ時代からの名前？', v: 'wrong'},
	{q: 'インカ最後の要塞だった？', v: 'wrong'},
	{q: '建てられたのは、王の即位のあと？', v: 'half'},
	{q: '太陽に仕える女性たちの都市？', v: 'wrong'},
	{q: '住人は、地元の人々だった？', v: 'wrong'},
	{q: 'スペイン人に知られていなかった？', v: 'half'},
	{q: '崩れないのは、石組みのおかげ？', v: 'half'},
	{q: 'マチュピチュと日本は、つながりがない？', v: 'wrong'},
	{q: '全体像は、もう分かっている？', v: 'wrong'},
] as const;

// まとめ：10の判決を、ナレーションに合わせて1つずつ灯す
export const Summary = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Summary">
			<Beat name="今夜の判決" captions={c} from={0} to={10}>
				<Stage>
					<VerdictBoard rows={rows} startAt={rows.map((_, i) => captionFrame(c, 0, i + 1, fps))} />
				</Stage>
			</Beat>
			<Beat name="伝説の隠れ家ではなかった" captions={c} from={11} to={12}>
				<Photo id="mp-sunset-pan-w" move="scroll" label="伝説の隠れ家ではなかった" />
			</Beat>
			<Beat name="新しい姿" captions={c} from={13}>
				<Photo id="mp-fog-beatriz" move="in" label="いまも、新しい姿を見せる" />
			</Beat>
		</SceneFrame>
	);
};

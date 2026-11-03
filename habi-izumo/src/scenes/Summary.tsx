import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {VerdictBoard} from '../components/VerdictBoard';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {summaryCaptions as c} from '../data/captions';

const rows = [
	{q: '神無月は、神様がいない月？', v: 'wrong'},
	{q: '集まる話は、古事記にある？', v: 'wrong'},
	{q: '古事記の3分の1は出雲？', v: 'half'},
	{q: '出雲は、神が引き寄せた？', v: 'half'},
	{q: 'オロチは、暴れ川？', v: 'half'},
	{q: '出雲に、大きな国はなかった？', v: 'wrong'},
	{q: '358本の銅剣は、武器？', v: 'wrong'},
	{q: '銅剣の国と銅鐸の国は別？', v: 'wrong'},
	{q: '加茂岩倉の銅鐸は出雲製？', v: 'wrong'},
	{q: '2つの谷は、関係がない？', v: 'wrong'},
	{q: '青銅器は、敵から隠した？', v: 'half'},
	{q: '出雲には、王がいた？', v: 'right'},
	{q: '出雲は、閉ざされた国？', v: 'wrong'},
	{q: '出雲の力は、鉄から？', v: 'half'},
	{q: '出雲は、国を譲った？', v: 'half'},
	{q: '出雲大社は、48mだった？', v: 'half'},
	{q: '神殿は、何度も倒れた？', v: 'right'},
	{q: '宮司の家は、神の子孫？', v: 'half'},
	{q: '神在月は、縁結びの会議？', v: 'half'},
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
			<Beat name="神話そのものではなかった" captions={c} from={20} to={21}>
				<Photo id="taisha-keidai" move="out" label="神々が集まる、本当の理由" />
			</Beat>
			<Beat name="今も見つかり続ける証拠" captions={c} from={22}>
				<Photo id="kojindani-site-replica" move="in" label="出雲の土の中から、今も" />
			</Beat>
		</SceneFrame>
	);
};

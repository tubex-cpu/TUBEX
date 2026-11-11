import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {VerdictBoard} from '../components/VerdictBoard';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {summaryCaptions as c} from '../data/captions';

const rows = [
	{q: '冬至の朝日に合わせて、宇治橋は作られた？', v: 'half'},
	{q: '伊勢神宮は、最初から伊勢にあった？', v: 'wrong'},
	{q: '三種の神器は、すべて皇居にある？', v: 'wrong'},
	{q: '八咫鏡は、天皇でさえ見られない？', v: 'half'},
	{q: '八咫鏡の裏に、ヘブライ文字？', v: 'wrong'},
	{q: '草薙剣は、祟る？', v: 'half'},
	{q: '草薙剣は、壇ノ浦に永遠に沈んだ？', v: 'wrong'},
	{q: '草薙剣を、実際に見た人がいる？', v: 'half'},
	{q: '遷宮の木は、伊勢の山から？', v: 'half'},
] as const;

// まとめ：10の判決を、ナレーションに合わせて1つずつ灯す
export const Summary = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Summary">
			<Beat name="今夜の判決" captions={c} from={0} to={9}>
				<Stage>
					<VerdictBoard rows={rows} startAt={rows.map((_, i) => captionFrame(c, 0, i + 1, fps))} />
				</Stage>
			</Beat>
			<Beat name="守り、語り継ぐ" captions={c} from={10} to={10}>
				<Photo id="sengyo-kuniyoshi" move="in" label="1300年、守り語り継ぐ" />
			</Beat>
			<Beat name="今年の冬至" captions={c} from={11}>
				<Photo id="isewan-sunrise" move="in" label="今年の冬至の朝も" />
			</Beat>
		</SceneFrame>
	);
};

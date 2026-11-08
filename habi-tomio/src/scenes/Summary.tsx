import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {VerdictBoard} from '../components/VerdictBoard';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {summaryCaptions as c} from '../data/captions';

const rows = [
	{q: '富雄丸山古墳は、日本最大の古墳？', v: 'wrong'},
	{q: '巨大古墳だと、昔から知られていた？', v: 'wrong'},
	{q: '巨大な剣は、戦いの武器？', v: 'wrong'},
	{q: '蛇行剣は、南九州で生まれた？', v: 'half'},
	{q: '盾の形の鏡は、中国から来た？', v: 'wrong'},
	{q: '木の棺は、もう残っていない？', v: 'wrong'},
	{q: '棺の鏡は、古墳と同じ時代？', v: 'wrong'},
	{q: '墓の主は、女性だった？', v: 'half'},
	{q: '天理の鏡は、この古墳から出た？', v: 'half'},
] as const;

// まとめ：19の判決を、ナレーションに合わせて1つずつ灯す
export const Summary = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Summary">
			<Beat name="今夜の判決" captions={c} from={0} to={9}>
				<Stage>
					<VerdictBoard rows={rows} startAt={rows.map((_, i) => captionFrame(c, 0, i + 1, fps))} />
				</Stage>
			</Beat>
			<Beat name="守るための剣" captions={c} from={10} to={11}>
				<Photo id="PHOTO_SUM1" move="out" label="守るための剣" />
			</Beat>
			<Beat name="4世紀の奈良" captions={c} from={12}>
				<Photo id="PHOTO_SUM2" move="in" label="土の中の証拠が語ること" />
			</Beat>
		</SceneFrame>
	);
};

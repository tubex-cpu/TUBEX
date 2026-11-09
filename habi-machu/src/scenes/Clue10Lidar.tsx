import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {Candidates, LidarScan} from '../components/MachuArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue10LidarCaptions as c} from '../data/captions';

// マチュピチュの全体像は、もう分かっている？（素材はすべてこの場面だけで使う。scripts/gen_scenes_machu.py が作る）
export const Clue10Lidar = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue10Lidar" label="第10の手がかり" title="マチュピチュの全体像は、もう分かっている？">
			<Beat name="調べ尽くされた遺跡？" captions={c} from={0} to={1}>
				<Photo id="mp-80-crop" move="in" label="調べ尽くされた遺跡？" />
			</Beat>
			<Beat name="森に覆われた斜面" captions={c} from={2} to={3}>
				<Photo id="terrace-2" move="in" label="森に覆われた斜面" />
			</Beat>
			<Beat name="空からレーザーで" captions={c} from={4} to={5}>
				<Stage label="空からレーザーで">
					<LidarScan />
				</Stage>
			</Beat>
			<Beat name="北東の段々畑" captions={c} from={6} to={6}>
				<Photo id="mpmtn-preben" move="in" label="北東の段々畑" />
			</Beat>
			<Beat name="月の神殿の近くで" captions={c} from={7} to={7}>
				<Photo id="moon-temple-1" move="in" label="月の神殿の近くで" />
			</Beat>
			<Beat name="見つかった「候補」" captions={c} from={8} to={11}>
				<Stage label="見つかった「候補」">
					<Candidates />
				</Stage>
			</Beat>
			<Beat name="2026年8月の発表" captions={c} from={12} to={14}>
				<Stage label="2026年8月の発表" labelBottom>
					<ReliefMap view='machupicchu' focus={P.machu} zoom={1.3} pins={[{at: P.machu, name: 'マチュピチュ遺跡', big: true, t: 10}]} areas={[{at: P.mandor, r: 150, t: 45, label: 'マンドールの壁の周辺', dy: -170}]} />
				</Stage>
			</Beat>
			<Beat name="インカの道" captions={c} from={15} to={17}>
				<Photo id="inca-bridge-2" move="in" label="インカの道" />
			</Beat>
			<Beat name="判決" captions={c} from={18} to={20}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 18, 19, fps)} />
			</Beat>
		</SceneFrame>
	);
};

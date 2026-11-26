import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue12FunkaCaptions as c} from '../data/captions';

// 縄文人は、大災害でも滅びなかった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue12Funka = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue12Funka" label="第12の手がかり" title="縄文人は、大災害でも滅びなかった？">
			<Beat name="鹿児島の南の海" captions={c} from={0} to={0}>
				<Stage label="鹿児島の南の海" labelBottom>
					<ReliefMap view='kyushu' zoom={1.05} focus={P.kikai} pins={[{at: P.kikai, name: '鬼界カルデラ', sub: '約7300年前', big: true, t: 8, color: '#ff8f80'}]} />
				</Stage>
			</Beat>
			<Beat name="世界最大級の噴火" captions={c} from={1} to={1}>
				<Stage label="世界最大級の噴火" labelBottom>
					<ReliefMap view='archipelago' zoom={1.02} pins={[{at: P.kikai, name: '鬼界カルデラ', t: 6, color: '#ff8f80'}, {at: P.oyu, name: '東北', t: 50}]} lines={[{pts: [P.kikai, P.oyu], t: 14, dash: true, label: '火山灰'}]} />
				</Stage>
			</Beat>
			<Beat name="暮らしを滅ぼした？" captions={c} from={2} to={2}>
				<Photo id="c12-uenohara-layer" move="in" label="暮らしを滅ぼした？" />
			</Beat>
			<Beat name="2026年10月 九州大学など" captions={c} from={3} to={3}>
				<Photo id="c12-varve" move="in" label="2026年10月 九州大学など" />
			</Beat>
			<Beat name="火山に近い南九州" captions={c} from={4} to={4}>
				<Photo id="c12-iodake" move="right" label="火山に近い南九州" />
			</Beat>
			<Beat name="生き残った人々は" captions={c} from={5} to={5}>
				<Stage label="生き残った人々は" labelBottom>
					<ReliefMap view='kyushus' zoom={1.04} pins={[{at: P.uenohara, name: '南九州', sub: '人の数が落ち込む', t: 6, color: '#ff8f80', dx: 160}, {at: P.nagasaki, name: '九州の北西の海沿い', sub: '噴火のあとも増える', big: true, t: 40, dx: -120, dy: 80}]} lines={[{pts: [P.uenohara, P.nagasaki], t: 70, arrow: true, dash: true}]} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={6} to={8}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 6, 7, fps)} />
			</Beat>
			<Beat name="争わなかったのか" captions={c} from={9}>
				<Photo id="c14-ofune-field" move="in" label="争わなかったのか" />
			</Beat>
		</SceneFrame>
	);
};

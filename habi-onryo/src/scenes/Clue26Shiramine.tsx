import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {BigYears} from '../components/OnryoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue26ShiramineCaptions as c} from '../data/captions';

// 明治天皇は、崇徳上皇の霊を京都に迎えるために神社を建てた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue26Shiramine = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue26Shiramine" label="第26の手がかり" title="明治天皇は、崇徳上皇の霊を京都に迎えるために神社を建てた？">
			<Beat name="亡くなってから" captions={c} from={0} to={0}>
				<Stage label="亡くなってから">
					<BigYears value={700} unit='年後' caption='江戸時代の終わり' tone='shrine' />
				</Stage>
			</Beat>
			<Beat name="孝明天皇の願い" captions={c} from={1} to={3}>
				<Photo id="seiryoden-painting" move="in" label="孝明天皇の願い" />
			</Beat>
			<Beat name="1868年8月 讃岐へ使い" captions={c} from={4} to={4}>
				<Stage label="1868年8月 讃岐へ使い" labelBottom>
					<ReliefMap view='west' zoom={1.3} focus={P.shiramine} pins={[{at: P.shiramine, name: '白峯陵', big: true, t: 6}, {at: P.kyoto, name: '京都', t: 40}]} lines={[{pts: [P.shiramine, P.kyoto], t: 14, len: 40, arrow: true}]} />
				</Stage>
			</Beat>
			<Beat name="飛鳥井家の屋敷の跡" captions={c} from={5} to={5}>
				<Photo id="shiramine-jingu-gate" move="in" label="飛鳥井家の屋敷の跡" />
			</Beat>
			<Beat name="新しい時代の直前" captions={c} from={6} to={6}>
				<Stage label="新しい時代の直前">
					<TimeBar stops={[{label: '9月6日', sub: '霊が京都に鎮まる', accent: true}, {label: '9月8日', sub: '元号が「明治」に'}]} tone='shrine' />
				</Stage>
			</Beat>
			<Beat name="天皇みずから参拝" captions={c} from={7} to={8}>
				<Photo id="shiramine-jingu-haiden" move="in" label="天皇みずから参拝" />
			</Beat>
			<Beat name="なぜ、このときだったのか" captions={c} from={9} to={10}>
				<Photo id="kamigoryo-lanterns" move="in" label="なぜ、このときだったのか" />
			</Beat>
			<Beat name="判決" captions={c} from={11} to={13}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 11, 12, fps)} />
			</Beat>
			<Beat name="その後の天皇は" captions={c} from={14}>
				<Stage label="その後の天皇は">
					<BigYears value={1964} unit='年' caption='崇徳上皇の没後800年' tone='night' />
				</Stage>
			</Beat>
		</SceneFrame>
	);
};

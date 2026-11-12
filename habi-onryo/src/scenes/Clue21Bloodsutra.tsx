import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {Scroll} from '../components/OnryoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue21BloodsutraCaptions as c} from '../data/captions';

// 崇徳上皇は、自分の血で呪いの経を書いた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue21Bloodsutra = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue21Bloodsutra" label="第21の手がかり" title="崇徳上皇は、自分の血で呪いの経を書いた？">
			<Beat name="1156年7月23日" captions={c} from={0} to={0}>
				<Stage label="1156年7月23日" labelBottom>
					<ReliefMap view='west' zoom={1.15} focus={P.sanuki} pins={[{at: P.kyoto, name: '京', t: 6}, {at: P.sanuki, name: '讃岐', sub: 'いまの香川県', big: true, t: 40}]} lines={[{pts: [P.kyoto, P.sanuki], t: 12, len: 40, arrow: true}]} />
				</Stage>
			</Beat>
			<Beat name="都に納めてほしい" captions={c} from={1} to={2}>
				<Stage label="都に納めてほしい">
					<Cards cards={[{head: '五部大乗経', body: '讃岐で書き写し\n都の寺へ'}, {head: '都の人々', body: '呪いを疑い\n送り返した？', tone: 'red'}]} tone='ink' size={46} height={330} top={370} />
				</Stage>
			</Beat>
			<Beat name="経典に書きつけた言葉？" captions={c} from={3} to={3}>
				<Stage label="経典に書きつけた言葉？">
					<Scroll text={'日本国の大魔縁となり\n皇を取って民となし\n民を皇となさん'} source='『保元物語』より' tone='shrine' />
				</Stage>
			</Beat>
			<Beat name="生きながら天狗の姿に？" captions={c} from={4} to={4}>
				<Photo id="sutoku-thunder" move="in" label="生きながら天狗の姿に？" />
			</Beat>
			<Beat name="『保元物語』の写本" captions={c} from={5} to={6}>
				<Stage label="『保元物語』の写本">
					<Cards cards={[{head: 'ある写本', body: '舌の血で書いた'}, {head: '別の写本', body: '墨で書いた', tone: 'gold'}]} tone='ink' size={48} height={300} top={390} />
				</Stage>
			</Beat>
			<Beat name="本当に血で書いたのか" captions={c} from={7} to={7}>
				<Photo id="yasui-ema-2" move="in" label="本当に血で書いたのか" />
			</Beat>
			<Beat name="判決" captions={c} from={8} to={10}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 8, 9, fps)} />
			</Beat>
			<Beat name="讃岐での最期" captions={c} from={11}>
				<Photo id="tonshoji-lantern" move="in" label="讃岐での最期" />
			</Beat>
		</SceneFrame>
	);
};

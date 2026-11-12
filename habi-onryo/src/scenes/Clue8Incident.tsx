import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, TimeBar} from '../components/IzumoKit';
import {Flow} from '../components/OnryoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue8IncidentCaptions as c} from '../data/captions';

// 2026年、将門塚で騒いだ男に、罰が下った？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue8Incident = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue8Incident" label="第8の手がかり" title="2026年、将門塚で騒いだ男に、罰が下った？">
			<Beat name="2026年8月19日 夜" captions={c} from={0} to={2}>
				<Photo id="kubizuka-new" move="in" label="2026年8月19日 夜" />
			</Beat>
			<Beat name="その後の経過" captions={c} from={3} to={5}>
				<Stage label="その後の経過">
					<TimeBar stops={[{label: '8月19日', sub: '騒ぎと配信'}, {label: '8月21日', sub: '警察に相談'}, {label: '10月23日', sub: '書類送検', accent: true}, {label: '11月6日', sub: '報道'}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="刑法の決まり" captions={c} from={6} to={7}>
				<Stage label="刑法の決まり">
					<Cards cards={[{head: '礼拝所不敬罪', body: '神社・寺・墓などで\n人前で敬いを欠く行い'}, {head: '将門塚', body: '東京都の旧跡\n人々が手を合わせる場所', tone: 'gold'}]} tone='ink' size={44} height={340} top={360} />
				</Stage>
			</Beat>
			<Beat name="罰は、決まったのか？" captions={c} from={8} to={10}>
				<Stage label="罰は、決まったのか？">
					<Flow steps={[{head: '警察', body: '捜査'}, {head: '書類送検', body: 'いまここ', hot: true}, {head: '検察', body: '罪に問うか\n判断'}, {head: '裁判', body: '罰が決まる', dim: true}]} />
				</Stage>
			</Beat>
			<Beat name="なぜ「祟り」を口にするのか" captions={c} from={11}>
				<Photo id="kanda-matsuri-mikoshi" move="in" label="なぜ「祟り」を口にするのか" />
			</Beat>
			<Beat name="判決" captions={c} from={12} to={14}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 12, 13, fps)} />
			</Beat>
			<Beat name="将門を祀る神社は" captions={c} from={15}>
				<Photo id="kanda-panorama-w" move="scroll" label="将門を祀る神社は" />
			</Beat>
		</SceneFrame>
	);
};

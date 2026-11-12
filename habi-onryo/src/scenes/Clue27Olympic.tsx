import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, TimeBar} from '../components/IzumoKit';
import {Flow} from '../components/OnryoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue27OlympicCaptions as c} from '../data/captions';

// 昭和天皇は、東京オリンピックの成功を祈って崇徳上皇を慰霊した？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue27Olympic = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue27Olympic" label="第27の手がかり" title="昭和天皇は、東京オリンピックの成功を祈って崇徳上皇を慰霊した？">
			<Beat name="1964年、同じ年の秋" captions={c} from={0} to={3}>
				<Stage label="1964年、同じ年の秋">
					<TimeBar stops={[{label: '9月21日', sub: '没後800年の祭り'}, {label: '10月', sub: '東京オリンピック', accent: true}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="本当にそうだったのか" captions={c} from={4} to={6}>
				<Stage label="本当にそうだったのか">
					<Cards cards={[{head: '式年祭', body: '天皇の墓で\n100年ごとの祭り'}, {head: '800年目', body: '1164年から\n1964年'}]} tone='ink' size={48} height={330} top={370} />
				</Stage>
			</Beat>
			<Beat name="記録に残っているのは" captions={c} from={7} to={7}>
				<Stage label="記録に残っているのは">
					<Flow steps={[{head: '1164年', body: '崇徳上皇\n亡くなる'}, {head: '1964年', body: '800年の祭り', hot: true}, {head: '五輪のため？', body: '公式の記録は？', dim: true}]} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={8} to={10}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 8, 9, fps)} />
			</Beat>
			<Beat name="白峯神宮は、いま" captions={c} from={11}>
				<Photo id="shiramine-balls" move="in" label="白峯神宮は、いま" />
			</Beat>
		</SceneFrame>
	);
};

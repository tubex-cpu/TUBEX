import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Figures} from '../components/IzumoKit';
import {PopWave} from '../components/JomonArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue21JinkoCaptions as c} from '../data/captions';

// 縄文の終わりごろ、人の数は激減した？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue21Jinko = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue21Jinko" label="第21の手がかり" title="縄文の終わりごろ、人の数は激減した？">
			<Beat name="遺跡が減っていく" captions={c} from={0} to={0}>
				<Photo id="c21-komakino-winter" move="in" label="遺跡が減っていく" />
			</Beat>
			<Beat name="2019年 東京大学など" captions={c} from={1} to={1}>
				<Stage label="2019年 東京大学など">
					<Figures figs={[{value: '345人', label: 'いまの日本人の男性', small: '男性だけに受け継がれる遺伝子'}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="昔の人の数を逆算" captions={c} from={2} to={2}>
				<Photo id="c21-futatsumori" move="in" label="昔の人の数を逆算" />
			</Beat>
			<Beat name="縄文系の男性の数" captions={c} from={3} to={3}>
				<Stage label="縄文系の男性の数">
					<PopWave marks={[{year: 3200, label: '約3200年前', red: true}]} />
				</Stage>
			</Beat>
			<Beat name="増えて、減る波" captions={c} from={4} to={4}>
				<Photo id="c21-kiusu-forest" move="in" label="増えて、減る波" />
			</Beat>
			<Beat name="判決" captions={c} from={5} to={7}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 5, 6, fps)} />
			</Beat>
			<Beat name="寒さだったのか" captions={c} from={8}>
				<Photo id="c22-funagata-beech" move="in" label="寒さだったのか" />
			</Beat>
		</SceneFrame>
	);
};

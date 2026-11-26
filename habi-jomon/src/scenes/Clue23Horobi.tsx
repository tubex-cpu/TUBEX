import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Figures} from '../components/IzumoKit';
import {MixStream} from '../components/JomonArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue23HorobiCaptions as c} from '../data/captions';

// 縄文人は、弥生人に滅ぼされた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue23Horobi = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue23Horobi" label="第23の手がかり" title="縄文人は、弥生人に滅ぼされた？">
			<Beat name="紀元前10世紀ごろ 九州北部" captions={c} from={0} to={0}>
				<Photo id="c23-nabatake-paddy" move="in" label="紀元前10世紀ごろ 九州北部" />
			</Beat>
			<Beat name="新しい道具と人々" captions={c} from={1} to={1}>
				<Photo id="c23-nabatake-rice" move="in" label="新しい道具と人々" />
			</Beat>
			<Beat name="2026年1月 長崎県" captions={c} from={2} to={2}>
				<Photo id="c23-nagasaki-harbour" move="left" label="2026年1月 長崎県" />
			</Beat>
			<Beat name="遺伝子を読むと" captions={c} from={3} to={3}>
				<Stage label="遺伝子を読むと">
					<Figures figs={[{value: '4人', label: '弥生時代の人骨'}, {value: '2人', label: 'その遺伝子は？', accent: true}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="新しく来た人々と" captions={c} from={4} to={4}>
				<Photo id="c23-itazuke" move="in" label="新しく来た人々と" />
			</Beat>
			<Beat name="2500年前から" captions={c} from={5} to={6}>
				<Stage label="2500年前から">
					<MixStream a='縄文の人々' b='海を渡ってきた人々' out='いまへ' />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="本当に消えた？" captions={c} from={10}>
				<Photo id="c24-tohoku-beech" move="in" label="本当に消えた？" />
			</Beat>
		</SceneFrame>
	);
};

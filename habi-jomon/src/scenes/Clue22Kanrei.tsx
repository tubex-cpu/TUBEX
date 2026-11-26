import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {BigYears} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue22KanreiCaptions as c} from '../data/captions';

// 縄文の暮らしを終わらせたのは、寒さ？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue22Kanrei = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue22Kanrei" label="第22の手がかり" title="縄文の暮らしを終わらせたのは、寒さ？">
			<Beat name="何が起きた？" captions={c} from={0} to={0}>
				<Stage label="何が起きた？">
					<BigYears value={4200} unit='年前' caption='世界の各地で、気候が変わる' tone='sea' />
				</Stage>
			</Beat>
			<Beat name="青森の海の水温" captions={c} from={1} to={1}>
				<Stage label="青森の海の水温" labelBottom>
					<ReliefMap view='tohoku' zoom={1.15} focus={P.sannai} pins={[{at: P.sannai, name: '三内丸山遺跡', sub: '大きな村の終わり', big: true, t: 8}]} />
				</Stage>
			</Beat>
			<Beat name="クリからトチへ" captions={c} from={2} to={2}>
				<Photo id="c22-tochi-fruits" move="in" label="クリからトチへ" />
			</Beat>
			<Beat name="家の数が減ったのは" captions={c} from={3} to={3}>
				<Photo id="c22-tochi-carbonized" move="in" label="家の数が減ったのは" />
			</Beat>
			<Beat name="海の向こうから" captions={c} from={4} to={4}>
				<Photo id="c22-seedlings" move="right" label="海の向こうから" />
			</Beat>
			<Beat name="判決" captions={c} from={5} to={7}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 5, 6, fps)} />
			</Beat>
			<Beat name="滅ぼされたのか" captions={c} from={8}>
				<Photo id="spare-yayoi-pottery" move="in" label="滅ぼされたのか" />
			</Beat>
		</SceneFrame>
	);
};

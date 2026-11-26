import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue15KoekiCaptions as c} from '../data/captions';

// 縄文人は、遠くの村と品物をやりとりしていた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue15Koeki = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue15Koeki" label="第15の手がかり" title="縄文人は、遠くの村と品物をやりとりしていた？">
			<Beat name="新潟県糸魚川市 ヒスイ" captions={c} from={0} to={0}>
				<Photo id="c15-jade-raw" move="in" label="新潟県糸魚川市 ヒスイ" />
			</Beat>
			<Beat name="北から南まで" captions={c} from={1} to={1}>
				<Stage label="北から南まで" labelBottom>
					<ReliefMap view='wide' zoom={1.08} focus={P.itoigawa} pins={[{at: P.itoigawa, name: '糸魚川', big: true, t: 6}, {at: P.hokkaido, name: '北海道', t: 40}, {at: P.okinawa, name: '沖縄', t: 60}]} lines={[{pts: [P.itoigawa, P.hokkaido], t: 30, arrow: true}, {pts: [P.itoigawa, P.okinawa], t: 50, arrow: true}]} />
				</Stage>
			</Beat>
			<Beat name="三内丸山のヒスイ" captions={c} from={2} to={2}>
				<Photo id="c15-sannai-jade" move="in" label="三内丸山のヒスイ" />
			</Beat>
			<Beat name="海を渡った石" captions={c} from={3} to={3}>
				<Stage label="海を渡った石">
					<ReliefMap view='nsea' zoom={1.04} pins={[{at: P.okiIsl, name: '隠岐の島', sub: '黒曜石', big: true, t: 6}, {at: P.vladivostok, name: 'ウラジオストクの近く', t: 50, dy: 80}]} lines={[{pts: [P.okiIsl, P.vladivostok], t: 26, arrow: true, dash: true}]} />
				</Stage>
			</Beat>
			<Beat name="文字もお金もない時代に" captions={c} from={4} to={4}>
				<Photo id="c15-obsidian-koshidake" move="in" label="文字もお金もない時代に" />
			</Beat>
			<Beat name="判決" captions={c} from={5} to={7}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 5, 6, fps)} />
			</Beat>
			<Beat name="争いが増えたのは？" captions={c} from={8}>
				<Photo id="c16-yoshinogari-arrowheads" move="in" label="争いが増えたのは？" />
			</Beat>
		</SceneFrame>
	);
};

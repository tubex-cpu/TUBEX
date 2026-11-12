import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {LegendGap} from '../components/OnryoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue5FlyingCaptions as c} from '../data/captions';

// 将門の首は、京から東京まで飛んできた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue5Flying = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue5Flying" label="第5の手がかり" title="将門の首は、京から東京まで飛んできた？">
			<Beat name="首は、どこへ飛んだ？" captions={c} from={0} to={2}>
				<Stage label="首は、どこへ飛んだ？" labelBottom>
					<ReliefMap view='honshu' zoom={1.05} pins={[{at: P.kyoto, name: '京', t: 6, dx: -70}, {at: P.ogaki, name: '大垣 御首神社', sub: '首が落ちた伝説', t: 40, dx: 60, dy: -90}, {at: P.tsuka, name: '大手町', sub: '芝崎村', big: true, t: 70}]} lines={[{pts: [P.kyoto, P.tsuka], t: 14, len: 60, arrow: true, dash: true, bend: 0.12}]} />
				</Stage>
			</Beat>
			<Beat name="首が飛んだ話は、いつ？" captions={c} from={3} to={4}>
				<Stage label="首が飛んだ話は、いつ？">
					<LegendGap from={900} to={1750} marks={[{year: 940, label: '将門が討たれる'}, {year: 1370, label: '首が笑う', sub: '『太平記』', story: true}, {year: 1690, label: '首が飛ぶ', sub: '『前太平記』など', story: true}]} gapLabel='およそ700年後の物語' />
				</Stage>
			</Beat>
			<Beat name="首塚は、ひとつではない" captions={c} from={5} to={7}>
				<Photo id="kubizuka-1920s-front" move="in" label="首塚は、ひとつではない" />
			</Beat>
			<Beat name="1307年、1309年" captions={c} from={8} to={9}>
				<Photo id="kanda-hiroshige-snow" move="in" label="1307年、1309年" />
			</Beat>
			<Beat name="判決" captions={c} from={10} to={12}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 10, 11, fps)} />
			</Beat>
			<Beat name="なぜ「祟り」の話が？" captions={c} from={13}>
				<Photo id="quake-map" move="in" label="なぜ「祟り」の話が？" />
			</Beat>
		</SceneFrame>
	);
};

import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {BigYears} from '../components/OnryoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue18TobiumeCaptions as c} from '../data/captions';

// 道真の梅は、京都から大宰府まで飛んできた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue18Tobiume = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue18Tobiume" label="第18の手がかり" title="道真の梅は、京都から大宰府まで飛んできた？">
			<Beat name="飛梅" captions={c} from={0} to={0}>
				<Photo id="dazaifu-plum" move="in" label="飛梅" />
			</Beat>
			<Beat name="一夜で飛んだ？" captions={c} from={1} to={1}>
				<Stage label="一夜で飛んだ？" labelBottom>
					<ReliefMap view='west' zoom={1.1} focus={P.dazaifu} pins={[{at: P.kyoto, name: '京の屋敷', t: 6}, {at: P.dazaifu, name: '大宰府', big: true, t: 40}]} lines={[{pts: [P.kyoto, P.dazaifu], t: 12, len: 40, arrow: true, dash: true, bend: -0.15}]} />
				</Stage>
			</Beat>
			<Beat name="歌は平安時代の歌集に" captions={c} from={2} to={2}>
				<Photo id="michizane-moon" move="in" label="歌は平安時代の歌集に" />
			</Beat>
			<Beat name="大きな節目" captions={c} from={3} to={3}>
				<Photo id="dazaifu-honden" move="in" label="大きな節目" />
			</Beat>
			<Beat name="檜の皮の屋根を、すべて" captions={c} from={4} to={4}>
				<Stage label="檜の皮の屋根を、すべて">
					<BigYears value={124} unit='年ぶり' caption='2023年5月 本殿の大改修' tone='moss' />
				</Stage>
			</Beat>
			<Beat name="屋根に森をのせた仮殿" captions={c} from={5} to={5}>
				<Photo id="dazaifu-kariden" move="in" label="屋根に森をのせた仮殿" />
			</Beat>
			<Beat name="2026年9月19日 参拝再開" captions={c} from={6} to={6}>
				<Photo id="dazaifu-kariden-front" move="in" label="2026年9月19日 参拝再開" />
			</Beat>
			<Beat name="2027年 没後1125年" captions={c} from={7} to={7}>
				<Photo id="dazaifu-kariden-wide" move="in" label="2027年 没後1125年" />
			</Beat>
			<Beat name="動き続ける天神さま" captions={c} from={8} to={8}>
				<Stage label="動き続ける天神さま">
					<Cards cards={[{head: '太宰府天満宮', body: '2027年\n没後1125年'}, {head: '北野天満宮', body: '2027年\n大きな祭り'}, {head: '京都国立博物館', body: '2026年春\n絵巻の全巻公開', tone: 'gold'}]} tone='shrine' size={42} height={340} top={360} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={9} to={11}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 9, 10, fps)} />
			</Beat>
			<Beat name="3人目の怨霊" captions={c} from={12}>
				<Photo id="sutoku-portrait" move="in" label="3人目の怨霊" />
			</Beat>
		</SceneFrame>
	);
};

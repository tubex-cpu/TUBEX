import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {Flow} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue9UrushiCaptions as c} from '../data/captions';

// 縄文人は、漆を使いこなしていた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Clue9Urushi = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue9Urushi" label="第9の手がかり" title="縄文人は、漆を使いこなしていた？">
			<Beat name="1万2600年前の枝" captions={c} from={0} to={0}>
				<Stage label="1万2600年前の枝" labelBottom>
					<ReliefMap view='japansea' zoom={1.1} focus={P.torihama} pins={[{at: P.torihama, name: '鳥浜貝塚', sub: '福井県若狭町', big: true, t: 8}]} />
				</Stage>
			</Beat>
			<Beat name="赤く塗った器" captions={c} from={1} to={1}>
				<Photo id="c09-red-lacquer" move="in" label="赤く塗った器" />
			</Beat>
			<Beat name="東京都 下宅部遺跡" captions={c} from={2} to={2}>
				<Photo id="c09-shimoyakebe-pot" move="in" label="東京都 下宅部遺跡" />
			</Beat>
			<Beat name="漆の使い道" captions={c} from={3} to={3}>
				<Stage label="漆の使い道">
					<Flow steps={[{head: '樹液をとる'}, {head: '色をつける'}, {head: '塗る・接着する', hot: true}]} tone='ember' />
				</Stage>
			</Beat>
			<Beat name="水にも強い" captions={c} from={4} to={4}>
				<Photo id="c09-torihama-lake" move="left" label="水にも強い" />
			</Beat>
			<Beat name="判決" captions={c} from={5} to={7}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 5, 6, fps)} />
			</Beat>
			<Beat name="体は何を語る？" captions={c} from={8}>
				<Photo id="c09-korekawa-site" move="in" label="体は何を語る？" />
			</Beat>
		</SceneFrame>
	);
};

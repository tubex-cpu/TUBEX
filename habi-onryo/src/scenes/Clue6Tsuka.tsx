import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue6TsukaCaptions as c} from '../data/captions';

// 将門塚を動かそうとすると、祟りが起きる？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue6Tsuka = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue6Tsuka" label="第6の手がかり" title="将門塚を動かそうとすると、祟りが起きる？">
			<Beat name="1923年9月 関東大震災" captions={c} from={0} to={0}>
				<Photo id="quake-tokyo-1923" move="in" label="1923年9月 関東大震災" />
			</Beat>
			<Beat name="塚の上に、仮の庁舎" captions={c} from={1} to={3}>
				<Photo id="quake-marunouchi" move="in" label="塚の上に、仮の庁舎" />
			</Beat>
			<Beat name="記録に残っているのは" captions={c} from={4} to={7}>
				<Stage label="記録に残っているのは">
					<Cards cards={[{head: '1926年', body: '大蔵大臣が\n在任中に死去'}, {head: '1927年', body: '工事の技術者が\n死去'}, {head: '2年で14人？', body: '根拠となる\n記録なし', tone: 'red'}]} tone='ink' size={44} height={360} top={340} />
				</Stage>
			</Beat>
			<Beat name="1927年 将門鎮魂碑" captions={c} from={8} to={9}>
				<Photo id="kubizuka-1920s-back" move="in" label="1927年 将門鎮魂碑" />
			</Beat>
			<Beat name="1940年6月 官庁街に落雷" captions={c} from={10} to={11}>
				<Photo id="tokyo-station-1914" move="in" label="1940年6月 官庁街に落雷" />
			</Beat>
			<Beat name="国税庁の注釈" captions={c} from={12}>
				<Photo id="lightning-2" move="in" label="国税庁の注釈" />
			</Beat>
			<Beat name="判決" captions={c} from={13} to={15}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 13, 14, fps)} />
			</Beat>
			<Beat name="戦後のもうひとつの話" captions={c} from={16}>
				<Photo id="kubizuka-2012" move="in" label="戦後のもうひとつの話" />
			</Beat>
		</SceneFrame>
	);
};

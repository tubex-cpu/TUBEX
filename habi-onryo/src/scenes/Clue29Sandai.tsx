import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Table} from '../components/OnryoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue29SandaiCaptions as c} from '../data/captions';

// 「日本三大怨霊」は、昔からそう呼ばれていた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue29Sandai = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue29Sandai" label="第29の手がかり" title="「日本三大怨霊」は、昔からそう呼ばれていた？">
			<Beat name="昔から決まっていた？" captions={c} from={0} to={2}>
				<Photo id="sawara-mausoleum" move="in" label="昔から決まっていた？" />
			</Beat>
			<Beat name="顔ぶれは、どう変わった？" captions={c} from={3} to={6}>
				<Stage label="顔ぶれは、どう変わった？">
					<Table head={['年', '挙げられた3人']} widths={[360, 1240]} rows={[['1962年', '菅原道真・藤原元方・藤原顕光'], ['1984年', '聖徳太子・菅原道真・俊寛 など'], ['2000年', '菅原道真・早良親王・崇徳上皇'], ['2000年代〜', '平将門・菅原道真・崇徳上皇']]} hot={3} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="怨霊を祀る考え方は" captions={c} from={10}>
				<Photo id="sawara-zue" move="in" label="怨霊を祀る考え方は" />
			</Beat>
		</SceneFrame>
	);
};

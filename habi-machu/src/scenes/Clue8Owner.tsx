import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue8OwnerCaptions as c} from '../data/captions';

// 墓の主は、女性だった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_tomio.py が作る）
export const Clue8Owner = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue8Owner" label="第8の手がかり" title="墓の主は、女性だった？">
			<Beat name="人の骨は、残っていなかった" captions={c} from={0} to={1}>
				<Photo id="dig-todaiji" move="in" label="人の骨は、残っていなかった" />
			</Beat>
			<Beat name="武器が、ひとつもない" captions={c} from={2} to={3}>
				<Photo id="miko-seya" move="in" label="武器が、ひとつもない" />
			</Beat>
			<Beat name="2人の墓の主？" captions={c} from={4} to={5}>
				<Stage label="2人の墓の主？">
					<Cards cards={[{head: '墳頂の埋葬', body: '政治や軍事を\n担った男性？', tone: 'dark'}, {head: '造り出しの埋葬', body: 'まじないや\nまつりを担った？', tone: 'gold'}]} tone='ember' />
				</Stage>
			</Beat>
			<Beat name="側近のような存在？" captions={c} from={6} to={6}>
				<Photo id="bujin-kamishiba" move="in" label="側近のような存在？" />
			</Beat>
			<Beat name="櫛があれば、女性？" captions={c} from={7} to={8}>
				<Photo id="miko-koshikake" move="in" label="櫛があれば、女性？" />
			</Beat>
			<Beat name="性別は分かる？" captions={c} from={9} to={9}>
				<Photo id="haniwa-kushitama" move="in" label="性別は分かる？" />
			</Beat>
			<Beat name="判決" captions={c} from={10} to={12}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 10, 11, fps)} />
			</Beat>
			<Beat name="もう一つの鏡の謎" captions={c} from={13}>
				<Photo id="tenri-hondori" move="in" label="もう一つの鏡の謎" />
			</Beat>
		</SceneFrame>
	);
};

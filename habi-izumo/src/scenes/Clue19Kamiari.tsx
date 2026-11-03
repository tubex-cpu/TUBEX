import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {KamiFlow} from '../components/IzumoArt3';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue19KamiariCaptions as c} from '../data/captions';

// 神在月、神々は縁結びの会議を開く？（素材はすべてこの場面だけで使う。scripts/gen_scenes_izumo.py が作る）
export const Clue19Kamiari = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue19Kamiari" label="第19の手がかり" title="神在月、神々は縁結びの会議を開く？">
			<Beat name="2026年11月18日" captions={c} from={0} to={1}>
				<Stage label="2026年11月18日">
					<KamiFlow />
				</Stage>
			</Beat>
			<Beat name="剣を突き立てた、あの浜" captions={c} from={2} to={2}>
				<Photo id="benten-torii" move="in" label="剣を突き立てた、あの浜" />
			</Beat>
			<Beat name="神々を迎える" captions={c} from={3} to={3}>
				<Photo id="inasa-crowd" move="in" label="神々を迎える" />
			</Beat>
			<Beat name="神々を先導するのは？" captions={c} from={4} to={4}>
				<Photo id="seasnake-beach" move="in" label="神々を先導するのは？" />
			</Beat>
			<Beat name="龍蛇様の正体は？" captions={c} from={5} to={6}>
				<Photo id="seasnake-1" move="in" label="龍蛇様の正体は？" />
			</Beat>
			<Beat name="神様の通り道" captions={c} from={7} to={7}>
				<Photo id="kamimukae-road" move="in" label="神様の通り道" />
			</Beat>
			<Beat name="神々の宿" captions={c} from={8} to={9}>
				<Photo id="jukusha-1" move="in" label="神々の宿" />
			</Beat>
			<Beat name="神議り" captions={c} from={10} to={11}>
				<Photo id="benten-2" move="in" label="神議り" />
			</Beat>
			<Beat name="神々を送り出す" captions={c} from={12} to={12}>
				<Photo id="jukusha-2" move="in" label="神々を送り出す" />
			</Beat>
			<Beat name="それぞれの国へ" captions={c} from={13} to={13}>
				<Photo id="mankusen-shrine" move="in" label="それぞれの国へ" />
			</Beat>
			<Beat name="佐太神社でも" captions={c} from={14} to={15}>
				<Photo id="sada-shrine-2" move="in" label="佐太神社でも" />
			</Beat>
			<Beat name="お忌みさん" captions={c} from={16} to={17}>
				<Photo id="taisha-haiden-honden" move="in" label="お忌みさん" />
			</Beat>
			<Beat name="縁結びの会議は、いつから？" captions={c} from={18} to={18}>
				<Photo id="taisha-haiden" move="in" label="縁結びの会議は、いつから？" />
			</Beat>
			<Beat name="判決" captions={c} from={19} to={21}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 19, 20, fps)} />
			</Beat>
		</SceneFrame>
	);
};

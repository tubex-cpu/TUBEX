import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {Balance} from '../components/KagamiArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue20HakaCaptions as c} from '../data/captions';

// 三角縁神獣鏡は、卑弥呼の墓から出ている？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue20Haka = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue20Haka" label="第20の手がかり" title="三角縁神獣鏡は、卑弥呼の墓から出ている？">
			<Beat name="大きな塚" captions={c} from={0} to={0}>
				<Photo id="c20-hashihaka-farm" move="in" label="大きな塚" />
			</Beat>
			<Beat name="箸墓古墳 宮内庁が管理" captions={c} from={1} to={2}>
				<Photo id="c20-hashihaka-entrance" move="in" label="箸墓古墳 宮内庁が管理" />
			</Beat>
			<Beat name="時代がずれる" captions={c} from={3} to={3}>
				<Stage label="時代がずれる">
					<TimeBar stops={[{label: '247年ごろ', sub: '卑弥呼が亡くなる', accent: true}, {label: '3世紀後半', sub: '黒塚古墳'}, {label: '4世紀', sub: '鏡が墓に入る'}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="なぜ何十年も後に？" captions={c} from={4} to={5}>
				<Photo id="c20-hashihaka-kiidai" move="in" label="なぜ何十年も後に？" />
			</Beat>
			<Beat name="判決" captions={c} from={6} to={8}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 6, 7, fps)} />
			</Beat>
			<Beat name="重りが揺らぐ" captions={c} from={9} to={9}>
				<Stage label="重りが揺らぐ">
					<Balance from={-0.6} to={-0.4} left={[{text: '三角縁神獣鏡の中心', shaky: true, gone: true}, {text: '鏡を配った王権', shaky: true}]} right={[]} note='鏡と卑弥呼の時代がずれる' />
				</Stage>
			</Beat>
			<Beat name="墓そのものの年代は" captions={c} from={10}>
				<Photo id="c21-hashihaka-pond" move="in" label="墓そのものの年代は" />
			</Beat>
		</SceneFrame>
	);
};

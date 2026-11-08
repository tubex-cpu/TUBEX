import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {MirrorMatch} from '../components/TomioArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue9TenriCaptions as c} from '../data/captions';

// 天理の三角縁神獣鏡は、この古墳から出た？（素材はすべてこの場面だけで使う。scripts/gen_scenes_tomio.py が作る）
export const Clue9Tenri = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue9Tenri" label="第9の手がかり" title="天理の三角縁神獣鏡は、この古墳から出た？">
			<Beat name="天理参考館" captions={c} from={0} to={0}>
				<Photo id="sankokan-1" move="in" label="天理参考館" />
			</Beat>
			<Beat name="卑弥呼の鏡？" captions={c} from={1} to={1}>
				<Photo id="kurozuka" move="in" label="卑弥呼の鏡？" />
			</Beat>
			<Beat name="「伝」とされてきた鏡" captions={c} from={2} to={2}>
				<Photo id="tomio-ryuko" move="in" label="「伝」とされてきた鏡" />
			</Beat>
			<Beat name="2026年1月30日" captions={c} from={3} to={4}>
				<Photo id="microscope" move="in" label="2026年1月30日" />
			</Beat>
			<Beat name="磨いた跡を比べると？" captions={c} from={5} to={5}>
				<Stage label="磨いた跡を比べると？">
					<MirrorMatch />
				</Stage>
			</Beat>
			<Beat name="京都国立博物館で" captions={c} from={6} to={7}>
				<Photo id="knm-1" move="in" label="京都国立博物館で" />
			</Beat>
			<Beat name="「伝」が薄まった" captions={c} from={8} to={9}>
				<Photo id="magatama" move="in" label="「伝」が薄まった" />
			</Beat>
			<Beat name="判決" captions={c} from={10} to={12}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 10, 11, fps)} />
			</Beat>
		</SceneFrame>
	);
};

import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {LegendGap, Scroll} from '../components/OnryoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue4LaughCaptions as c} from '../data/captions';

// 将門の首は、笑い、胴を探して叫んだ？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue4Laugh = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue4Laugh" label="第4の手がかり" title="将門の首は、笑い、胴を探して叫んだ？">
			<Beat name="都に運ばれた首" captions={c} from={0} to={2}>
				<Photo id="rajomon-model" move="in" label="都に運ばれた首" />
			</Beat>
			<Beat name="恐ろしい伝説" captions={c} from={3} to={5}>
				<Photo id="takiyasha-kuniyoshi" move="scroll" label="恐ろしい伝説" />
			</Beat>
			<Beat name="首に詠みかけた歌" captions={c} from={6} to={7}>
				<Stage label="首に詠みかけた歌">
					<Scroll text={'将門は米かみよりぞ\n斬られける\n俵藤太が謀にて'} source='『太平記』巻16' />
				</Stage>
			</Beat>
			<Beat name="首が笑った話は、いつ？" captions={c} from={8} to={10}>
				<Stage label="首が笑った話は、いつ？">
					<LegendGap from={900} to={1450} marks={[{year: 940, label: '将門が討たれ\n首が京へ', sub: '『貞信公記』'}, {year: 1370, label: '首が笑う話', sub: '『太平記』', story: true}]} gapLabel='およそ400年の空白' />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={11} to={13}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 11, 12, fps)} />
			</Beat>
			<Beat name="首は空を飛んだ？" captions={c} from={14}>
				<Photo id="mikubi-shrine" move="in" label="首は空を飛んだ？" />
			</Beat>
		</SceneFrame>
	);
};

import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue6Keisho4Captions as c} from '../data/captions';

// 存在しない年号、景初四年の鏡は、偽物？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue6Keisho4 = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue6Keisho4" label="第6の手がかり" title="存在しない年号、景初四年の鏡は、偽物？">
			<Beat name="景初は三年で終わった" captions={c} from={0} to={1}>
				<Stage label="景初は三年で終わった">
					<TimeBar stops={[{label: '景初三年', sub: '239年'}, {label: '景初四年', sub: '存在しない', accent: true}, {label: '正始元年', sub: '240年'}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="1986年 広峯15号墳" captions={c} from={2} to={2}>
				<Photo id="c06-keisho4-mirror" move="in" label="1986年 広峯15号墳" />
			</Beat>
			<Beat name="同じ型の鏡がもう1枚" captions={c} from={3} to={4}>
				<Photo id="c06-banryu-mochida" move="in" label="同じ型の鏡がもう1枚" />
			</Beat>
			<Beat name="正式な発掘で出た鏡" captions={c} from={5} to={7}>
				<Photo id="c07-higashinomiya" move="in" label="正式な発掘で出た鏡" />
			</Beat>
			<Beat name="判決" captions={c} from={8} to={10}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 8, 9, fps)} />
			</Beat>
			<Beat name="全部でいくつ？" captions={c} from={11}>
				<Photo id="c07-mirror-display" move="in" label="全部でいくつ？" />
			</Beat>
		</SceneFrame>
	);
};

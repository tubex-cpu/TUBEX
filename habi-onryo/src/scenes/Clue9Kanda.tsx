import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, TimeBar} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue9KandaCaptions as c} from '../data/captions';

// 神田明神は、将門を神の座から外したことがある？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue9Kanda = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue9Kanda" label="第9の手がかり" title="神田明神は、将門を神の座から外したことがある？">
			<Beat name="江戸総鎮守" captions={c} from={0} to={1}>
				<Photo id="kanda-matsuri-ukiyoe" move="scroll" label="江戸総鎮守" />
			</Beat>
			<Beat name="1874年 明治天皇の参拝" captions={c} from={2} to={4}>
				<Photo id="kanda-haiden" move="in" label="1874年 明治天皇の参拝" />
			</Beat>
			<Beat name="将門は、どこへ？" captions={c} from={5} to={6}>
				<Stage label="将門は、どこへ？">
					<Cards cards={[{head: '本殿', body: '大己貴命\n少彦名命'}, {head: '境内の小さな社', body: '平将門', tone: 'red'}]} tone='shrine' size={50} height={320} top={370} />
				</Stage>
			</Beat>
			<Beat name="氏子たちの願い" captions={c} from={7} to={9}>
				<Stage label="氏子たちの願い">
					<TimeBar stops={[{label: '1309年', sub: '神として祀る'}, {label: '1874年', sub: '本殿から外す', accent: true}, {label: '1984年', sub: '三の宮に'}]} tone='shrine' />
				</Stage>
			</Beat>
			<Beat name="1984年" captions={c} from={10} to={10}>
				<Photo id="kanda-matsuri-float" move="in" label="1984年" />
			</Beat>
			<Beat name="判決" captions={c} from={11} to={13}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 11, 12, fps)} />
			</Beat>
			<Beat name="もうひとつの言い伝え" captions={c} from={14}>
				<Photo id="takiyasha-kunisada" move="in" label="もうひとつの言い伝え" />
			</Beat>
		</SceneFrame>
	);
};

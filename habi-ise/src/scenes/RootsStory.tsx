import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {rootsStoryCaptions as c} from '../data/captions';

// RootsStory（素材はすべてこの場面だけで使う。scripts/gen_scenes_ise.py が作る）
export const RootsStory = () => {
	return (
		<SceneFrame captions={c} voice="RootsStory" >
			<Beat name="手がかりを、つなぐと" captions={c} from={0} to={0}>
				<Photo id="futami-sunrise" move="in" label="手がかりを、つなぐと" />
			</Beat>
			<Beat name="宮中の外へ" captions={c} from={1} to={1}>
				<Photo id="motoise-kotai-snow" move="in" label="宮中の外へ" />
			</Beat>
			<Beat name="倭姫命の長い旅" captions={c} from={2} to={2}>
				<Photo id="kono-jinja" move="in" label="倭姫命の長い旅" />
			</Beat>
			<Beat name="三つの場所に分かれて" captions={c} from={3} to={3}>
				<Stage label="三つの場所に分かれて">
					<Cards cards={[{head: '伊勢', body: '八咫鏡'}, {head: '熱田', body: '草薙剣'}, {head: '皇居', body: '八尺瓊勾玉\nと形代'}]} tone='night' size={48} height={320} top={390} />
				</Stage>
			</Beat>
			<Beat name="焼けた鏡、沈んだ剣" captions={c} from={4} to={4}>
				<Photo id="akama-jingu" move="in" label="焼けた鏡、沈んだ剣" />
			</Beat>
			<Beat name="人の目に触れずに" captions={c} from={5} to={6}>
				<Photo id="daijokyu-2019" move="in" label="人の目に触れずに" />
			</Beat>
			<Beat name="語り継がれた物語" captions={c} from={7} to={7}>
				<Photo id="futami-ukiyoe" move="in" label="語り継がれた物語" />
			</Beat>
			<Beat name="新しい器と、新しい宮" captions={c} from={8} to={9}>
				<Photo id="oshiraishi-2013" move="in" label="新しい器と、新しい宮" />
			</Beat>
			<Beat name="守り続けた人々" captions={c} from={10}>
				<Photo id="naiku-cedar-steps" move="in" label="守り続けた人々" />
			</Beat>
		</SceneFrame>
	);
};

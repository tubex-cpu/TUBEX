import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {DigSection} from '../components/IzumoArt1';
import {Figures} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue6KojindaniCaptions as c} from '../data/captions';

// 出雲に、大きな力を持つ国はなかった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_izumo.py が作る）
export const Clue6Kojindani = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue6Kojindani" label="第6の手がかり" title="出雲に、大きな力を持つ国はなかった？">
			<Beat name="1983年、農道の工事の前に" captions={c} from={0} to={1}>
				<Stage label="1983年、農道の工事の前に" labelBottom>
					<ReliefMap view='izumo' focus={P.kojindani} zoom={1.7} pins={[{at: P.taisha, name: '出雲大社', t: 10}, {at: P.kojindani, name: '斐川町', t: 30, big: true}]} />
				</Stage>
			</Beat>
			<Beat name="古い焼き物のかけら" captions={c} from={2} to={2}>
				<Photo id="sueki-misakiyama" move="in" label="古い焼き物のかけら" />
			</Beat>
			<Beat name="小さな谷の斜面" captions={c} from={3} to={4}>
				<Photo id="kojindani-site-1" move="in" label="小さな谷の斜面" />
			</Beat>
			<Beat name="粘土の層から？" captions={c} from={5} to={6}>
				<Stage label="粘土の層から？">
					<DigSection />
				</Stage>
			</Beat>
			<Beat name="358本は、どれほどの数？" captions={c} from={7} to={10}>
				<Stage label="358本は、どれほどの数？">
					<Figures figs={[{value: '358', label: '本', small: '荒神谷の谷ひとつ', accent: true}, {value: '300', label: '本ほど', small: 'それまでの全国'}]} mid='対' tone='ember' />
				</Stage>
			</Beat>
			<Beat name="大きな国は、なかった？" captions={c} from={11} to={12}>
				<Photo id="yayoi-diorama" move="in" label="大きな国は、なかった？" />
			</Beat>
			<Beat name="見方が、変わり始めた" captions={c} from={13} to={14}>
				<Photo id="museum-ext-3" move="in" label="見方が、変わり始めた" />
			</Beat>
			<Beat name="神話は、本当にあった？" captions={c} from={15} to={15}>
				<Photo id="izumo-coast" move="in" label="神話は、本当にあった？" />
			</Beat>
			<Beat name="判決" captions={c} from={16} to={18}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 16, 17, fps)} />
			</Beat>
			<Beat name="何に使われた？" captions={c} from={19}>
				<Photo id="yoshinogari-sword-w" move="scroll" label="何に使われた？" />
			</Beat>
		</SceneFrame>
	);
};

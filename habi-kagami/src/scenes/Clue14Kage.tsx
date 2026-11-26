import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {BigYears} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue14KageCaptions as c} from '../data/captions';

// どこから出たか分からない鏡の故郷は、もう突き止められない？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue14Kage = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue14Kage" label="第14の手がかり" title="どこから出たか分からない鏡の故郷は、もう突き止められない？">
			<Beat name="出どころの分からない3枚" captions={c} from={0} to={1}>
				<Photo id="c14-tomio-mirror2" move="in" label="出どころの分からない3枚" />
			</Beat>
			<Beat name="故郷が分かった" captions={c} from={2} to={2}>
				<Stage label="故郷が分かった">
					<BigYears value={2026} unit='年' caption='1月30日 天理参考館・奈良市の発表' tone='bronze' />
				</Stage>
			</Beat>
			<Beat name="鏡の面に残った影" captions={c} from={3} to={4}>
				<Photo id="c14-tomio-ryuko" move="in" label="鏡の面に残った影" />
			</Beat>
			<Beat name="京都国立博物館の銅の板" captions={c} from={5} to={5}>
				<Photo id="c14-kyohaku" move="in" label="京都国立博物館の銅の板" />
			</Beat>
			<Beat name="顕微鏡が見た磨きの跡" captions={c} from={6} to={7}>
				<Photo id="spare-tomio-ryuko-b" move="in" label="顕微鏡が見た磨きの跡" />
			</Beat>
			<Beat name="判決" captions={c} from={8} to={10}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 8, 9, fps)} />
			</Beat>
			<Beat name="すぐ墓に入れた？" captions={c} from={11}>
				<Photo id="c15-tomio-funkyu" move="in" label="すぐ墓に入れた？" />
			</Beat>
		</SceneFrame>
	);
};

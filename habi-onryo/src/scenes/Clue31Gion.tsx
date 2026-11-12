import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, TimeBar} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue31GionCaptions as c} from '../data/captions';

// 京都の祇園祭は、怨霊を鎮める祭りから始まった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue31Gion = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue31Gion" label="第31の手がかり" title="京都の祇園祭は、怨霊を鎮める祭りから始まった？">
			<Beat name="京都の祇園祭" captions={c} from={0} to={0}>
				<Photo id="gion-hoko" move="in" label="京都の祇園祭" />
			</Beat>
			<Beat name="怨霊を鎮める祭り？" captions={c} from={1} to={2}>
				<Photo id="yasaka-nishiromon" move="in" label="怨霊を鎮める祭り？" />
			</Beat>
			<Beat name="869年 66本の矛" captions={c} from={3} to={3}>
				<Photo id="gion-1920s" move="in" label="869年 66本の矛" />
			</Beat>
			<Beat name="6年の差" captions={c} from={4} to={5}>
				<Stage label="6年の差">
					<TimeBar stops={[{label: '863年', sub: '神泉苑の御霊会'}, {label: '869年', sub: '66本の矛', accent: true}]} tone='shrine' />
				</Stage>
			</Beat>
			<Beat name="始まりの年は" captions={c} from={6} to={6}>
				<Stage label="始まりの年は">
					<Cards cards={[{head: '869年', body: '八坂神社の\n言い伝え'}, {head: '970年', body: 'とする記録も'}]} tone='ink' size={50} height={300} top={390} />
				</Stage>
			</Beat>
			<Beat name="疫病の神をなぐさめる" captions={c} from={7} to={8}>
				<Photo id="gion-yoiyama" move="in" label="疫病の神をなぐさめる" />
			</Beat>
			<Beat name="判決" captions={c} from={9} to={11}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 9, 10, fps)} />
			</Beat>
		</SceneFrame>
	);
};

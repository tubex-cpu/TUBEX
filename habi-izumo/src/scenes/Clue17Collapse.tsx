import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {CollapseMarks, ShrineFall} from '../components/IzumoArt3';
import {TimeBar} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue17CollapseCaptions as c} from '../data/captions';

// 巨大な神殿は、何度も倒れた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_izumo.py が作る）
export const Clue17Collapse = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue17Collapse" label="第17の手がかり" title="巨大な神殿は、何度も倒れた？">
			<Beat name="1031年、都に届いた知らせ" captions={c} from={0} to={2}>
				<Photo id="hinomisaki-cape" move="in" label="1031年、都に届いた知らせ" />
			</Beat>
			<Beat name="なぜ、倒れた？" captions={c} from={3} to={4}>
				<Stage label="なぜ、倒れた？">
					<ShrineFall />
				</Stage>
			</Beat>
			<Beat name="倒れたのは、一度だけ？" captions={c} from={5} to={6}>
				<Stage label="倒れたのは、一度だけ？">
					<CollapseMarks />
				</Stage>
			</Beat>
			<Beat name="高く、大きかった証拠？" captions={c} from={7} to={8}>
				<Photo id="taisha-honden-roofs" move="in" label="高く、大きかった証拠？" />
			</Beat>
			<Beat name="稲佐の浜に流れ着いた大木" captions={c} from={9} to={11}>
				<Photo id="inasa-sanbe-dawn" move="in" label="稲佐の浜に流れ着いた大木" />
			</Beat>
			<Beat name="平成の大遷宮" captions={c} from={12} to={12}>
				<Photo id="taisha-karihaiden" move="in" label="平成の大遷宮" />
			</Beat>
			<Beat name="遷宮は、何年に一度？" captions={c} from={13} to={13}>
				<Stage label="遷宮は、何年に一度？">
					<TimeBar stops={[{label: '1744年', sub: '今の本殿'}, {label: '1953年', sub: '昭和の遷宮'}, {label: '2013年', sub: '平成の大遷宮', accent: true}]} tone='shrine' />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={14} to={16}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 14, 15, fps)} />
			</Beat>
			<Beat name="神殿を守り続けた人々は？" captions={c} from={17}>
				<Photo id="taisha-snow" move="in" label="神殿を守り続けた人々は？" />
			</Beat>
		</SceneFrame>
	);
};

import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue30LostCaptions as c} from '../data/captions';

// 即身仏の中には、失われたものがある？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue30Lost = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue30Lost" label="第30の手がかり" title="即身仏の中には、失われたものがある？">
			<Beat name="守り抜かれたのか" captions={c} from={0} to={0}>
				<Photo id="dokyo-hoyo" move="in" label="守り抜かれたのか" />
			</Beat>
			<Beat name="火事と博覧会" captions={c} from={1} to={3}>
				<Stage label="火事と博覧会">
					<TimeBar stops={[{label: '1875年', sub: '大日坊の大火 2体'}, {label: '1880年', sub: '津川の大火'}, {label: '1921年', sub: '博覧会へ・行方不明', accent: true}]} tone='ember' />
				</Stage>
			</Beat>
			<Beat name="2011年 東日本大震災" captions={c} from={4} to={4}>
				<Photo id="quake-2011-iwaki" move="in" label="2011年 東日本大震災" />
			</Beat>
			<Beat name="自然の力、人の欲" captions={c} from={5} to={6}>
				<Photo id="quake-2011-shinkansen" move="in" label="自然の力、人の欲" />
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="誰が守っているのか" captions={c} from={10}>
				<Photo id="uesugi-shrine" move="in" label="誰が守っているのか" />
			</Beat>
		</SceneFrame>
	);
};

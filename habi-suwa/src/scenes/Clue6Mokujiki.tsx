import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue6MokujikiCaptions as c} from '../data/captions';

// 行者たちは、木の実や草だけで何年も暮らした？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue6Mokujiki = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue6Mokujiki" label="第6の手がかり" title="行者たちは、木の実や草だけで何年も暮らした？">
			<Beat name="仙人沢" captions={c} from={0} to={0}>
				<Photo id="gassan-valley-w" move="scroll" label="仙人沢" />
			</Beat>
			<Beat name="1962年の報告" captions={c} from={1} to={1}>
				<Photo id="murakami-city-view" move="in" label="1962年の報告" />
			</Beat>
			<Beat name="千日・二千日・三千日" captions={c} from={2} to={2}>
				<Stage label="千日・二千日・三千日">
					<TimeBar stops={[{label: '五穀断ち', sub: '米・麦・粟・黍・豆'}, {label: '十穀断ち', sub: 'さらに10の穀物'}, {label: '木の実と草', sub: '最後は食を断つ', accent: true}]} tone='moss' />
				</Stage>
			</Beat>
			<Beat name="木食行" captions={c} from={3} to={3}>
				<Photo id="buna-funagata" move="in" label="木食行" />
			</Beat>
			<Beat name="脂肪を落とす" captions={c} from={4} to={4}>
				<Photo id="tochi-seeds" move="in" label="脂肪を落とす" />
			</Beat>
			<Beat name="最後は食を断つ" captions={c} from={5} to={5}>
				<Photo id="chestnut-crenata" move="in" label="最後は食を断つ" />
			</Beat>
			<Beat name="修行の中身は" captions={c} from={6} to={6}>
				<Photo id="acorn-crispula" move="in" label="修行の中身は" />
			</Beat>
			<Beat name="90代も、50代も" captions={c} from={7} to={7}>
				<Photo id="walnut-wellcome" move="in" label="90代も、50代も" />
			</Beat>
			<Beat name="判決" captions={c} from={8} to={10}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 8, 9, fps)} />
			</Beat>
			<Beat name="漆を飲んだ？" captions={c} from={11}>
				<Photo id="urushi-tree" move="in" label="漆を飲んだ？" />
			</Beat>
		</SceneFrame>
	);
};

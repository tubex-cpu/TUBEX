import {Beat} from '../components/Beat';
import {HiddenBurial, RedReliefTease} from '../components/NintokuArt1';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {introCaptions as c} from '../data/captions';

// 謎の先出し（素材はすべてこの場面だけで使う）
export const Intro = () => (
	<SceneFrame captions={c} voice="Intro">
		<Beat name="2026年5月、堺市で何" captions={c} from={0} to={0}>
			<Photo id="sakai-city" label="2026年5月、堺市で何が？" />
		</Beat>
		<Beat name="RedReliefTease" captions={c} from={1} to={1}>
			<Visual label="前方部に、何かある？">
				<RedReliefTease />
			</Visual>
		</Beat>
		<Beat name="HiddenBurial" captions={c} from={2} to={3}>
			<Visual label="もうひとつの埋葬？">
				<HiddenBurial />
			</Visual>
		</Beat>
		<Beat name="誰もが知る、あの古墳" captions={c} from={4} to={4}>
			<Photo id="kisaragi-3" move="out" label="誰もが知る、あの古墳" />
		</Beat>
		<Beat name="眠っているのは、誰？" captions={c} from={5} to={5}>
			<Photo id="daisen-h1" label="眠っているのは、誰？" />
		</Beat>
		<Beat name="一度だけ、口を開けた墓" captions={c} from={6} to={6}>
			<Photo id="moat-4" move="left" label="一度だけ、口を開けた墓" />
		</Beat>
		<Beat name="なぜ、アメリカに？" captions={c} from={7} to={7}>
			<Photo id="mfa" label="なぜ、アメリカに？" />
		</Beat>
		<Beat name="世界最大の墓に、何が隠さ" captions={c} from={8}>
			<Photo id="daisen-b7" move="out" label="世界最大の墓に、何が隠されている？" />
		</Beat>
	</SceneFrame>
);

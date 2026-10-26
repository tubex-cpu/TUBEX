import {Beat} from '../components/Beat';
import {HiddenBurial, RedReliefTease} from '../components/NintokuArt1';
import {RyoboCount} from '../components/NintokuArt3';
import {KeepOut, MissingTreasure, SealedTimeline, WhereIsNintoku, WhoSleeps} from '../components/NintokuArt4';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {introCaptions as c} from '../data/captions';

// 謎の先出し（素材はすべてこの場面だけで使う）
export const Intro = () => (
	<SceneFrame captions={c} voice="Intro">
		<Beat name="住宅街に、巨大な森？" captions={c} from={0} to={0}>
			<Photo id="sakai-city" move="out" label="住宅街に、巨大な森？" />
		</Beat>
		<Beat name="KeepOut" captions={c} from={1} to={1}>
			<Visual label="その先へは、入れない">
				<KeepOut />
			</Visual>
		</Beat>
		<Beat name="教科書の、あの古墳" captions={c} from={2} to={2}>
			<Photo id="kisaragi-3" move="out" label="教科書の、あの古墳" />
		</Beat>
		<Beat name="眠るのは、仁徳天皇？" captions={c} from={3} to={3}>
			<Photo id="daisen-h1" label="眠るのは、仁徳天皇？" />
		</Beat>
		<Beat name="確かめた人は、いない？" captions={c} from={4} to={5}>
			<Photo id="daisen-b7" move="out" label="確かめた人は、いない？" />
		</Beat>
		<Beat name="RyoboCount" captions={c} from={6} to={7}>
			<Visual label="なぜ、1500年も解けない？">
				<RyoboCount />
			</Visual>
		</Beat>
		<Beat name="調べるほど、合わない？" captions={c} from={8} to={10}>
			<Photo id="moat-4" move="left" label="調べるほど、合わない？" />
		</Beat>
		<Beat name="WhoSleeps" captions={c} from={11} to={11}>
			<Visual label="この墓の主は、誰？">
				<WhoSleeps />
			</Visual>
		</Beat>
		<Beat name="WhereIsNintoku" captions={c} from={12} to={12}>
			<Visual label="本当の仁徳天皇は、どこに？">
				<WhereIsNintoku />
			</Visual>
		</Beat>
		<Beat name="一度だけ、口を開けた墓" captions={c} from={13} to={13}>
			<Photo id="omotezuka-2" move="out" label="一度だけ、口を開けた墓" />
		</Beat>
		<Beat name="MissingTreasure" captions={c} from={14} to={14}>
			<Visual label="消えた宝は、どこへ？">
				<MissingTreasure />
			</Visual>
		</Beat>
		<Beat name="RedReliefTease" captions={c} from={15} to={16}>
			<Visual label="ついに動いた、国の調査">
				<RedReliefTease />
			</Visual>
		</Beat>
		<Beat name="HiddenBurial" captions={c} from={17} to={18}>
			<Visual label="もうひとりの誰か？">
				<HiddenBurial />
			</Visual>
		</Beat>
		<Beat name="そこに眠るのは、誰？" captions={c} from={19} to={19}>
			<Photo id="maruhoyama-moat" label="そこに眠るのは、誰？" />
		</Beat>
		<Beat name="SealedTimeline" captions={c} from={20}>
			<Visual label="今夜は、長い法廷になる">
				<SealedTimeline />
			</Visual>
		</Beat>
	</SceneFrame>
);

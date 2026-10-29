import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {Again800, BeyondHorizon, CleanSamples, HokuleaRoute, NoInstruments, SettleDate, SurvivorClaim, VoyagingSkills} from '../components/MuArt3';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue11SettleCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// イースター島の人々は、沈んだ大陸から逃げてきた？（素材はすべてこの場面だけで使う）
export const Clue11Settle = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue11Settle" label="第11の手がかり" title="イースター島の人々は、沈んだ大陸から逃げてきた？">
			<Beat name="SurvivorClaim" captions={c} from={0} to={2}>
				<Visual label="ムーの生き残り？">
					<SurvivorClaim />
				</Visual>
			</Beat>
			<Beat name="島に人が来たのは、いつ？" captions={c} from={3} to={5}>
				<Photo id="rapanui-hills" move="out" label="島に人が来たのは、いつ？" />
			</Beat>
			<Beat name="CleanSamples" captions={c} from={6} to={6}>
				<Visual label="まちがいやすい試料を除く">
					<CleanSamples />
				</Visual>
			</Beat>
			<Beat name="SettleDate" captions={c} from={7} to={7}>
				<Visual label="およそ800年前">
					<SettleDate />
				</Visual>
			</Beat>
			<Beat name="Again800" captions={c} from={8} to={8}>
				<Visual label="ここでも、800年前">
					<Again800 />
				</Visual>
			</Beat>
			<Beat name="VoyagingSkills" captions={c} from={9} to={11}>
				<Visual label="星、波、風、鳥">
					<VoyagingSkills />
				</Visual>
			</Beat>
			<Beat name="ホクレア号" captions={c} from={12} to={13}>
				<Photo id="hokulea" move="out" label="ホクレア号" />
			</Beat>
			<Beat name="NoInstruments" captions={c} from={14} to={15}>
				<Visual label="羅針盤も、地図も、機械もなし">
					<NoInstruments />
				</Visual>
			</Beat>
			<Beat name="航海士マウ・ピアイルグ" captions={c} from={16} to={16}>
				<Photo id="mau" label="航海士マウ・ピアイルグ" />
			</Beat>
			<Beat name="HokuleaRoute" captions={c} from={17} to={17}>
				<Visual label="ハワイからタヒチへ">
					<HokuleaRoute />
				</Visual>
			</Beat>
			<Beat name="BeyondHorizon" captions={c} from={18} to={19}>
				<Visual label="自分たちの意思で">
					<BeyondHorizon />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={20} to={22}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 20, 21, fps)} />
			</Beat>
			<Beat name="もうひとつの、恐ろしい話" captions={c} from={23}>
				<Photo id="rapanui-coast" move="out" label="もうひとつの、恐ろしい話" />
			</Beat>
		</SceneFrame>
	);
};

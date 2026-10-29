import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {BasaltCrib, BasaltTons, DangerList, HeianKamakura, HowMoved, MuCapitalClaim, NanMadolDates, Not12000, PohnpeiMap, QuarryRoute, SaudeleurRule, UThClock} from '../components/MuArt2';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue6NanMadolCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 南の海の石の都は、ムーの都だった？（素材はすべてこの場面だけで使う）
export const Clue6NanMadol = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue6NanMadol" label="第6の手がかり" title="南の海の石の都は、ムーの都だった？">
			<Beat name="PohnpeiMap" captions={c} from={0} to={0}>
				<Visual label="ミクロネシアのポンペイ島">
					<PohnpeiMap />
				</Visual>
			</Beat>
			<Beat name="人の手で造られた、100" captions={c} from={1} to={2}>
				<Photo id="nanmadol-f" move="out" label="人の手で造られた、100の島" />
			</Beat>
			<Beat name="太平洋のベネチア" captions={c} from={3} to={4}>
				<Photo id="nanmadol-g" label="太平洋のベネチア" />
			</Beat>
			<Beat name="BasaltCrib" captions={c} from={5} to={6}>
				<Visual label="井げたに積んだ玄武岩">
					<BasaltCrib />
				</Visual>
			</Beat>
			<Beat name="MuCapitalClaim" captions={c} from={7} to={8}>
				<Visual label="ムーの都の跡？">
					<MuCapitalClaim />
				</Visual>
			</Beat>
			<Beat name="いつ造られた？" captions={c} from={9} to={10}>
				<Photo id="nanmadol-h" move="left" label="いつ造られた？" />
			</Beat>
			<Beat name="UThClock" captions={c} from={11} to={13}>
				<Visual label="サンゴの時計">
					<UThClock />
				</Visual>
			</Beat>
			<Beat name="NanMadolDates" captions={c} from={14} to={16}>
				<Visual label="年代は？">
					<NanMadolDates />
				</Visual>
			</Beat>
			<Beat name="HeianKamakura" captions={c} from={17} to={18}>
				<Visual label="日本でいえば">
					<HeianKamakura />
				</Visual>
			</Beat>
			<Beat name="Not12000" captions={c} from={19} to={19}>
				<Visual label="1万2000年前？">
					<Not12000 />
				</Visual>
			</Beat>
			<Beat name="SaudeleurRule" captions={c} from={20} to={23}>
				<Visual label="島を治めた王たち">
					<SaudeleurRule />
				</Visual>
			</Beat>
			<Beat name="BasaltTons" captions={c} from={24} to={24}>
				<Visual label="75万トンの石">
					<BasaltTons />
				</Visual>
			</Beat>
			<Beat name="QuarryRoute" captions={c} from={25} to={25}>
				<Visual label="石は、どこから？">
					<QuarryRoute />
				</Visual>
			</Beat>
			<Beat name="HowMoved" captions={c} from={26} to={26}>
				<Visual label="どうやって運んだ？">
					<HowMoved />
				</Visual>
			</Beat>
			<Beat name="築いたのは、島の人々" captions={c} from={27} to={28}>
				<Photo id="nanmadol-i" label="築いたのは、島の人々" />
			</Beat>
			<Beat name="DangerList" captions={c} from={29} to={31}>
				<Visual label="危機にさらされた世界遺産">
					<DangerList />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={32} to={34}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 32, 33, fps)} />
			</Beat>
			<Beat name="墓を暴いた男" captions={c} from={35}>
				<Photo id="nanmadol-j" move="out" label="墓を暴いた男" />
			</Beat>
		</SceneFrame>
	);
};

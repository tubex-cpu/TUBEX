import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {ClayTablet, CompareCards} from '../components/Illustrations';
import {FloodRain, KingList, MuseumShelves, NoisyHumans, RoundArk, SmithExcited} from '../components/NoahArt';
import {Photo} from '../components/Photo';
import {OldBook, Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {clue2TabletCaptions as c} from '../data/captions';
import {colors} from '../theme';

// 第2の手がかり 聖書より古い洪水物語（素材はすべてこの場面だけで使う）
export const Clue2Tablet = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue2Tablet" label="第2の手がかり" title="聖書より古い“方舟”の物語？">
			<Beat name="大英博物館" captions={c} from={0} to={1}>
				<Visual label="1872年、ロンドンの博物館で">
					<MuseumShelves />
				</Visual>
			</Beat>
			<Beat name="ジョージ・スミス" captions={c} from={2} to={3}>
				<Photo id="george-smith" label="独学で古代文字を読んだ男" />
			</Beat>
			<Beat name="かけら" captions={c} from={4} to={5}>
				<Photo id="flood-tablet" move="out" label="あるかけらに、信じられない一文が" />
			</Beat>
			<Beat name="服を脱いだ" captions={c} from={6} to={6}>
				<Visual label="思わず、服を脱ぎはじめた？" labelColor={colors.goldSoft}>
					<SmithExcited />
				</Visual>
			</Beat>
			<Beat name="ニネヴェへ" captions={c} from={7} to={8}>
				<Photo id="kuyunjik" move="right" label="新聞社のお金で、古代の都の跡へ" />
			</Beat>
			<Beat name="カルデアの創世記" captions={c} from={9} to={9}>
				<Photo id="chaldean-genesis" label="彼が読んだ粘土板には、何が？" />
			</Beat>
			<Beat name="第11の粘土板" captions={c} from={10} to={11}>
				<Photo id="tablet11" move="left" label="ギルガメシュ叙事詩・第11の粘土板" />
			</Beat>
			<Beat name="神々の決定" captions={c} from={12} to={14}>
				<Visual label="神々が決めた、人間の終わり">
					<FloodRain />
				</Visual>
			</Beat>
			<Beat name="嵐" captions={c} from={15} to={17}>
				<Photo id="aivazovsky-deluge" move="out" label="嵐は、六日六晩つづいた" />
			</Beat>
			<Beat name="鳩" captions={c} from={18} to={18}>
				<Photo id="dove" label="1羽目は、鳩" />
			</Beat>
			<Beat name="ツバメ" captions={c} from={19} to={19}>
				<Photo id="swallow" move="right" label="2羽目は、ツバメ" />
			</Beat>
			<Beat name="カラス" captions={c} from={20} to={20}>
				<Photo id="raven" move="left" label="3羽目のカラスは、戻らなかった" />
			</Beat>
			<Beat name="鳥（聖書）" captions={c} from={21} to={21}>
				<Photo id="dore-dove" label="聖書のノアも、鳥を放っていた" />
			</Beat>
			<Beat name="どちらが古い" captions={c} from={22} to={23}>
				<CompareCards
					left={<ClayTablet width={380} />}
					right={<div style={{zoom: 0.6}}><OldBook title="創世記" /></div>}
					leftLabel="ギルガメシュ叙事詩"
					rightLabel="聖書（ノアの方舟）"
					leftColor={colors.gold}
					rightColor={colors.text}
					vs="→"
				/>
			</Beat>
			<Beat name="アトラ・ハシース" captions={c} from={24} to={27}>
				<Visual label="神々が洪水を起こした、意外な理由">
					<NoisyHumans />
				</Visual>
			</Beat>
			<Beat name="王名表の写真" captions={c} from={28} to={29}>
				<Photo id="king-list" label="王の名簿に刻まれた、ある一文" />
			</Beat>
			<Beat name="王名表" captions={c} from={30} to={31}>
				<Visual label="歴史を「前」と「後」に分けた出来事">
					<KingList />
				</Visual>
			</Beat>
			<Beat name="方舟の粘土板" captions={c} from={32} to={35}>
				<Photo id="bm-exterior" move="out" label="2014年、博物館が発表した一枚" />
			</Beat>
			<Beat name="丸い方舟" captions={c} from={36} to={37}>
				<Visual label="方舟は、丸かった？" labelColor={colors.goldSoft}>
					<RoundArk />
				</Visual>
			</Beat>
			<Beat name="丸い小舟" captions={c} from={38} to={39}>
				<Photo id="quffa" move="right" label="メソポタミアの川の、丸い小舟" />
			</Beat>
			<Beat name="判決" captions={c} from={40} to={42}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 40, 41, fps)} />
			</Beat>
			<Beat name="本物の洪水は？" captions={c} from={43}>
				<Photo id="tigris-painting" move="left" label="では、本物の大洪水はあったのか？" />
			</Beat>
		</SceneFrame>
	);
};

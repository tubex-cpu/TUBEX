import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {Center, ClayTablet, CompareCards, Label} from '../components/Illustrations';
import {BirdsRelease, FloodRain, KingList, MuseumShelves, RoundArk, SmithExcited} from '../components/NoahArt';
import {Photo} from '../components/Photo';
import {OldBook, Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {clue2TabletCaptions as c} from '../data/captions';
import {colors} from '../theme';

// 第2の手がかり 聖書より古い洪水物語
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
				<Photo id="george-smith" label="独学で古代文字を読んだ男">
					<Center>
						<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
							<ClayTablet width={440} />
							<Label size={54}>独学で古代文字を読んだ男</Label>
						</div>
					</Center>
				</Photo>
			</Beat>
			<Beat name="かけら" captions={c} from={4} to={5}>
				<Photo id="flood-tablet" label="あるかけらに、信じられない一文が">
					<Center>
						<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
							<ClayTablet width={440} />
							<Label size={54}>あるかけらに、信じられない一文が</Label>
						</div>
					</Center>
				</Photo>
			</Beat>
			<Beat name="服を脱いだ" captions={c} from={6} to={6}>
				<Visual label="思わず、服を脱ぎはじめた？" labelColor={colors.goldSoft}>
					<SmithExcited />
				</Visual>
			</Beat>
			<Beat name="スミスの旅" captions={c} from={7} to={9}>
				<Photo id="george-smith" move="out" label="36歳で世を去った男が、読んだもの">
					<Visual label="36歳で世を去った男が、読んだもの">
						<SmithExcited />
					</Visual>
				</Photo>
			</Beat>
			<Beat name="第11の粘土板" captions={c} from={10} to={12}>
				<Photo id="flood-tablet" move="out" label="ギルガメシュ叙事詩・第11の粘土板">
					<Center>
						<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
							<ClayTablet width={480} />
							<Label size={54}>ギルガメシュ叙事詩・第11の粘土板</Label>
						</div>
					</Center>
				</Photo>
			</Beat>
			<Beat name="神々の洪水" captions={c} from={13} to={17}>
				<Photo id="deluge-art" label="神々が決めた、人間の終わり">
					<Visual label="神々が決めた、人間の終わり">
						<FloodRain />
					</Visual>
				</Photo>
			</Beat>
			<Beat name="鳥（ギルガメシュ）" captions={c} from={18} to={20}>
				<Visual label="3羽の鳥のうち、1羽だけ戻らなかった">
					<BirdsRelease />
				</Visual>
			</Beat>
			<Beat name="鳥（聖書）" captions={c} from={21} to={22}>
				<Visual label="聖書のノアも、鳥を放っていた">
					<BirdsRelease bible />
				</Visual>
			</Beat>
			<Beat name="どちらが古い" captions={c} from={23} to={23}>
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
				<Photo id="flood-tablet" label="神々が洪水を起こした、意外な理由">
					<Center>
						<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
							<ClayTablet width={480} />
							<Label size={54}>神々が洪水を起こした、意外な理由</Label>
						</div>
					</Center>
				</Photo>
			</Beat>
			<Beat name="王名表" captions={c} from={28} to={31}>
				<Visual label="王の名簿に刻まれた、ある一文">
					<KingList />
				</Visual>
			</Beat>
			<Beat name="方舟の粘土板" captions={c} from={32} to={35}>
				<Photo id="ark-tablet" label="方舟のつくり方を書いた粘土板">
					<Visual label="方舟のつくり方を書いた粘土板">
						<RoundArk withSize={false} />
					</Visual>
				</Photo>
			</Beat>
			<Beat name="丸い方舟" captions={c} from={36} to={37}>
				<Visual label="方舟は、丸かった？" labelColor={colors.goldSoft}>
					<RoundArk />
				</Visual>
			</Beat>
			<Beat name="丸い小舟" captions={c} from={38} to={39}>
				<Photo id="quffa" label="メソポタミアの川の、丸い小舟">
					<Visual label="メソポタミアの川の、丸い小舟">
						<RoundArk withSize={false} />
					</Visual>
				</Photo>
			</Beat>
			<Beat name="判決" captions={c} from={40} to={42}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 40, 41, fps)} />
			</Beat>
			<Beat name="本物の洪水は？" captions={c} from={43}>
				<Visual label="では、本物の大洪水はあったのか？">
					<FloodRain />
				</Visual>
			</Beat>
		</SceneFrame>
	);
};

import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {DatingDebate, DayNight, FiveCluesDone, HashihakaDating, HimikoTomb, ImmortalIsland, KeyholeOverlay, LockedTomb, NinetyMeter, NotInChina, PacesToMeters, PeachDating, Watarido} from '../components/YamataiArt2';
import {clue5HashihakaCaptions as c} from '../data/captions';

// 第5の手がかり 箸墓古墳（素材はすべてこの場面だけで使う）
export const Clue5Hashihaka = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue5Hashihaka" label="第5の手がかり" title="箸墓古墳は、卑弥呼の墓？">
			<Beat name="卑弥呼の最期" captions={c} from={0} to={2}>
				<Visual label="卑弥呼の最期は、どう書かれていた？">
					<HimikoTomb />
				</Visual>
			</Beat>
			<Beat name="百余歩" captions={c} from={3} to={3}>
				<Visual label="百余歩は、何メートル？">
					<PacesToMeters />
				</Visual>
			</Beat>
			<Beat name="纒向遺跡" captions={c} from={4} to={4}>
				<Photo id="makimuku-tsuji" move="left" label="奈良県桜井市、纒向遺跡" />
			</Beat>
			<Beat name="箸墓古墳" captions={c} from={5} to={5}>
				<Photo id="hashihaka-zenkei2" label="全長およそ280メートルの古墳" />
			</Beat>
			<Beat name="丸い部分" captions={c} from={6} to={6}>
				<Visual label="丸い部分の直径は？">
					<KeyholeOverlay />
				</Visual>
			</Beat>
			<Beat name="年代" captions={c} from={7} to={8}>
				<Visual label="つくられたのは、いつ？">
					<HashihakaDating />
				</Visual>
			</Beat>
			<Beat name="大きな建物" captions={c} from={9} to={10}>
				<Photo id="makimuku-b" move="out" label="3世紀の、大きな建物の跡" />
			</Beat>
			<Beat name="モモの種" captions={c} from={11} to={12}>
				<Visual label="なぜ、こんなにモモの種が？">
					<PeachDating />
				</Visual>
			</Beat>
			<Beat name="都市" captions={c} from={13} to={13}>
				<Photo id="makimuku-tsuji2" move="right" label="全国から人が集まる、都市？" />
			</Beat>
			<Beat name="2月19日" captions={c} from={14} to={14}>
				<Photo id="hashihaka-entrance" label="2026年2月19日、新しい発見" />
			</Beat>
			<Beat name="渡り土堤" captions={c} from={15} to={16}>
				<Visual label="堀の中に、土の道？">
					<Watarido />
				</Visual>
			</Beat>
			<Beat name="仙人の島" captions={c} from={17} to={19}>
				<Visual label="古墳は、海に浮かぶ島だった？">
					<ImmortalIsland />
				</Visual>
			</Beat>
			<Beat name="鏡" captions={c} from={20} to={20}>
				<Photo id="akamon-mirror" label="畿内の、もうひとつの証拠" />
			</Beat>
			<Beat name="三角縁神獣鏡" captions={c} from={21} to={21}>
				<Photo id="sankaku-higashi" label="ふちのとがった、大きな鏡" />
			</Beat>
			<Beat name="景初三年" captions={c} from={22} to={22}>
				<Photo id="sankaku-kambara" label="刻まれた年号は、卑弥呼の時代？" />
			</Beat>
			<Beat name="黒塚古墳" captions={c} from={23} to={23}>
				<Photo id="kurozuka-zenkei" move="left" label="ひとつの古墳から、33枚" />
			</Beat>
			<Beat name="中国にない" captions={c} from={24} to={24}>
				<Visual label="本場の中国からは……">
					<NotInChina />
				</Visual>
			</Beat>
			<Beat name="昼と夜" captions={c} from={25} to={26}>
				<Visual label="昼は人が、夜は神が？">
					<DayNight />
				</Visual>
			</Beat>
			<Beat name="9割" captions={c} from={27} to={28}>
				<Visual label="専門家は、どこまで言い切った？">
					<NinetyMeter />
				</Visual>
			</Beat>
			<Beat name="掘れない" captions={c} from={29} to={31}>
				<Visual label="決定的な問題">
					<LockedTomb />
				</Visual>
			</Beat>
			<Beat name="年代の異論" captions={c} from={32} to={32}>
				<Visual label="年代は、本当に合う？">
					<DatingDebate />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={33} to={35}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 33, 34, fps)} />
			</Beat>
			<Beat name="5つの手がかり" captions={c} from={36}>
				<Visual label="5つの手がかりを、全てたどった">
					<FiveCluesDone />
				</Visual>
			</Beat>
		</SceneFrame>
	);
};

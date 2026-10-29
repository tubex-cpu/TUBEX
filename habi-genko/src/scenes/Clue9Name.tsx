import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {EightChoSquare, EngishikiCard, NorthMidSouth, RyoboSurveys} from '../components/NintokuArt3';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue9NameCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 天皇陵の名前は、昔から伝わっていた？（素材はすべてこの場面だけで使う）
export const Clue9Name = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue9Name" label="第9の手がかり" title="天皇陵の名前は、昔から伝わっていた？">
			<Beat name="EngishikiCard" captions={c} from={0} to={2}>
				<Visual label="平安時代の記録">
					<EngishikiCard />
				</Visual>
			</Beat>
			<Beat name="EightChoSquare" captions={c} from={3} to={5}>
				<Visual label="どれほど広い？">
					<EightChoSquare />
				</Visual>
			</Beat>
			<Beat name="NorthMidSouth" captions={c} from={6} to={8}>
				<Visual label="なぜ「中」？">
					<NorthMidSouth />
				</Visual>
			</Beat>
			<Beat name="RyoboSurveys" captions={c} from={9} to={12}>
				<Visual label="わからなくなった墓">
					<RyoboSurveys />
				</Visual>
			</Beat>
			<Beat name="江戸時代の観光ガイド" captions={c} from={13} to={13}>
				<Photo id="izumi-zue" label="江戸時代の観光ガイド" />
			</Beat>
			<Beat name="幕末の大事業" captions={c} from={14} to={14}>
				<Photo id="utsunomiya" label="幕末の大事業" />
			</Beat>
			<Beat name="言い出したのは？" captions={c} from={15} to={15}>
				<Photo id="toda" label="言い出したのは？" />
			</Beat>
			<Beat name="拝所の始まり" captions={c} from={16} to={16}>
				<Photo id="daisen-h5" move="left" label="拝所の始まり" />
			</Beat>
			<Beat name="国が管理する墓" captions={c} from={17} to={19}>
				<Photo id="shoryobu" label="国が管理する墓" />
			</Beat>
			<Beat name="判決" captions={c} from={20} to={22}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 20, 21, fps)} />
			</Beat>
			<Beat name="墓の中を見た人は？" captions={c} from={23}>
				<Photo id="daisen-2024" label="墓の中を見た人は？" />
			</Beat>
		</SceneFrame>
	);
};

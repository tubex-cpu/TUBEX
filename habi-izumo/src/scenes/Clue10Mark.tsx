import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {LinkChain, MarkGrid} from '../components/IzumoArt2';
import {Cards} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue10MarkCaptions as c} from '../data/captions';

// 荒神谷と加茂岩倉は、関係がない？（素材はすべてこの場面だけで使う。scripts/gen_scenes_izumo.py が作る）
export const Clue10Mark = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue10Mark" label="第10の手がかり" title="荒神谷と加茂岩倉は、関係がない？">
			<Beat name="まっすぐ測ると？" captions={c} from={0} to={2}>
				<Stage label="まっすぐ測ると？">
					<ReliefMap view='kojindani' zoom={1.12} pins={[{at: P.kojindani, name: '荒神谷', big: true, t: 6, dx: -170, dy: 18}, {at: P.kamo, name: '加茂岩倉', big: true, t: 20, dy: 80}]} measure={{a: P.kojindani, b: P.kamo, label: '約3.3km', t: 40}} />
				</Stage>
			</Beat>
			<Beat name="結びつける証拠は？" captions={c} from={3} to={3}>
				<Photo id="bronze-display" move="in" label="結びつける証拠は？" />
			</Beat>
			<Beat name="遠く離れた淡路島から" captions={c} from={4} to={4}>
				<Photo id="matsuho-dotaku-2" move="in" label="遠く離れた淡路島から" />
			</Beat>
			<Beat name="2015年、7個の銅鐸" captions={c} from={5} to={6}>
				<Photo id="matsuho-dotaku-w" move="scroll" label="2015年、7個の銅鐸" />
			</Beat>
			<Beat name="淡路をはさむと？" captions={c} from={7} to={7}>
				<Stage label="淡路をはさむと？">
					<LinkChain />
				</Stage>
			</Beat>
			<Beat name="2026年10月10日、雲南市" captions={c} from={8} to={10}>
				<Photo id="kanbara-shrine" move="in" label="2026年10月10日、雲南市" />
			</Beat>
			<Beat name="あのバツの印が？" captions={c} from={11} to={13}>
				<Stage label="あのバツの印が？">
					<MarkGrid />
				</Stage>
			</Beat>
			<Beat name="分けて埋めた？" captions={c} from={14} to={16}>
				<Stage label="分けて埋めた？">
					<Cards cards={[{head: '印のある銅鐸', body: '14個', tone: 'gold'}, {head: '印のない銅鐸', body: '25個', tone: 'dark'}]} tone='bronze' size={80} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={17} to={19}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 17, 18, fps)} />
			</Beat>
			<Beat name="なぜ、埋めた？" captions={c} from={20}>
				<Photo id="kamo-dotaku-8" move="in" label="なぜ、埋めた？" />
			</Beat>
		</SceneFrame>
	);
};

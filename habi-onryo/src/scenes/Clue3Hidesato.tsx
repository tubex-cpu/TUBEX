import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {Relations} from '../components/OnryoArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue3HidesatoCaptions as c} from '../data/captions';

// 将門を討ち取ったのは、大ムカデを退治した英雄・俵藤太？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue3Hidesato = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue3Hidesato" label="第3の手がかり" title="将門を討ち取ったのは、大ムカデを退治した英雄・俵藤太？">
			<Beat name="将門と戦ったのは" captions={c} from={0} to={1}>
				<Stage label="将門と戦ったのは">
					<Relations heads={[{x: 520, text: '朝廷の側'}, {x: 1400, text: '新皇', red: true}]} nodes={[{id: 's', x: 520, y: 480, name: '平貞盛', sub: '将門のいとこ'}, {id: 'h', x: 520, y: 720, name: '藤原秀郷', sub: '下野の武士'}, {id: 'k', x: 1400, y: 600, name: '平将門', hot: true}]} edges={[{a: 's', b: 'k', red: true}, {a: 'h', b: 'k', red: true}]} />
				</Stage>
			</Beat>
			<Beat name="俵藤太の大ムカデ退治" captions={c} from={2} to={3}>
				<Photo id="hidesato-centipede" move="scroll" label="俵藤太の大ムカデ退治" />
			</Beat>
			<Beat name="将門の最期の言い伝え" captions={c} from={4} to={4}>
				<Photo id="takiyasha-katata" move="in" label="将門の最期の言い伝え" />
			</Beat>
			<Beat name="弱点は、こめかみ？" captions={c} from={5} to={6}>
				<Photo id="hidesato-dragon" move="in" label="弱点は、こめかみ？" />
			</Beat>
			<Beat name="当時に近い記録では" captions={c} from={7} to={8}>
				<Stage label="当時に近い記録では" labelBottom>
					<ReliefMap view='kanto' zoom={1.25} focus={P.iwai} pins={[{at: P.iwai, name: '坂東市 岩井', sub: '940年2月', big: true, t: 10}]} areas={[{at: P.iwai, r: 120, t: 20, label: '最後の戦い', dy: 160}]} />
				</Stage>
			</Beat>
			<Beat name="誰が射た矢か" captions={c} from={9} to={10}>
				<Photo id="enmeiin-dozuka" move="in" label="誰が射た矢か" />
			</Beat>
			<Beat name="戦いのあと" captions={c} from={11} to={11}>
				<Photo id="hidesato-audience" move="in" label="戦いのあと" />
			</Beat>
			<Beat name="判決" captions={c} from={12} to={14}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 12, 13, fps)} />
			</Beat>
			<Beat name="討たれた将門の首は？" captions={c} from={15}>
				<Photo id="takiyasha-seiu" move="in" label="討たれた将門の首は？" />
			</Beat>
		</SceneFrame>
	);
};

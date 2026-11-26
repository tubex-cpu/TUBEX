import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {Balance} from '../components/KagamiArt';
import {BigYears} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue22MakimukuCaptions as c} from '../data/captions';

// 奈良の纒向に、卑弥呼の時代の大きな町があった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const Clue22Makimuku = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue22Makimuku" label="第22の手がかり" title="奈良の纒向に、卑弥呼の時代の大きな町があった？">
			<Beat name="3世紀の巨大な遺跡" captions={c} from={0} to={0}>
				<Stage label="3世紀の巨大な遺跡" labelBottom>
					<ReliefMap view='nara' zoom={1.2} focus={P.makimuku} pins={[{at: P.makimuku, name: '纒向遺跡', big: true, t: 6}, {at: P.hashihaka, name: '箸墓古墳', t: 24}, {at: P.kurozuka, name: '黒塚古墳', t: 40}]} areas={[{at: P.makimuku, r: 70, t: 10, label: '東西2キロ'}]} />
				</Stage>
			</Beat>
			<Beat name="各地から運ばれた土器" captions={c} from={1} to={1}>
				<Photo id="c22-makimuku-pit4" move="in" label="各地から運ばれた土器" />
			</Beat>
			<Beat name="2009年 東西に並ぶ建物" captions={c} from={2} to={2}>
				<Photo id="c22-makimuku-c" move="in" label="2009年 東西に並ぶ建物" />
			</Beat>
			<Beat name="2800個ほどの桃の種" captions={c} from={3} to={3}>
				<Photo id="c22-peach-stone" move="in" label="2800個ほどの桃の種" />
			</Beat>
			<Beat name="放射性炭素で測る" captions={c} from={4} to={4}>
				<Stage label="放射性炭素で測る">
					<BigYears value={135} unit='〜230年' caption='桃の種の年代（名古屋大学など 2018年）' tone='night' />
				</Stage>
			</Beat>
			<Beat name="邪気をはらう果物" captions={c} from={5} to={5}>
				<Photo id="c22-peach-fruit" move="in" label="邪気をはらう果物" />
			</Beat>
			<Beat name="文字は出ていない" captions={c} from={6} to={6}>
				<Photo id="c22-makimuku-group" move="in" label="文字は出ていない" />
			</Beat>
			<Beat name="判決" captions={c} from={7} to={9}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 7, 8, fps)} />
			</Beat>
			<Beat name="天秤は大きく" captions={c} from={10} to={10}>
				<Stage label="天秤は大きく">
					<Balance from={-0.65} to={-0.9} left={[{text: '三角縁神獣鏡の中心', shaky: true}, {text: '鏡を配った王権', shaky: true}, {text: '箸墓古墳の年代'}, {text: '纒向の大集落', fresh: true}]} right={[]} note='九州の皿も、まだ空ではない' />
				</Stage>
			</Beat>
			<Beat name="九州には？" captions={c} from={11}>
				<Photo id="c22-makimuku-tsuji" move="in" label="九州には？" />
			</Beat>
		</SceneFrame>
	);
};

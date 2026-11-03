import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {BookGap} from '../components/IzumoArt1';
import {Cards} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue2OkugiCaptions as c} from '../data/captions';

// 神々が出雲に集まる話は、古事記に書いてある？（素材はすべてこの場面だけで使う。scripts/gen_scenes_izumo.py が作る）
export const Clue2Okugi = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue2Okugi" label="第2の手がかり" title="神々が出雲に集まる話は、古事記に書いてある？">
			<Beat name="出雲の神話といえば？" captions={c} from={0} to={0}>
				<Photo id="taisha-torii-haiden" move="in" label="出雲の神話といえば？" />
			</Beat>
			<Beat name="712年、古事記" captions={c} from={1} to={1}>
				<Photo id="kojiki-shinpukuji" move="in" label="712年、古事記" />
			</Beat>
			<Beat name="720年、日本書紀" captions={c} from={2} to={2}>
				<Photo id="nihonshoki-tanaka" move="in" label="720年、日本書紀" />
			</Beat>
			<Beat name="733年、出雲国風土記" captions={c} from={3} to={4}>
				<Photo id="fudoki-book" move="in" label="733年、出雲国風土記" />
			</Beat>
			<Beat name="どこかに、書いてある？" captions={c} from={5} to={5}>
				<Stage label="どこかに、書いてある？">
					<Cards cards={[{head: '古事記', body: '神々が\n出雲に\n集まる話？', tone: 'dark'}, {head: '日本書紀', body: '神々が\n出雲に\n集まる話？', tone: 'dark'}, {head: '出雲国風土記', body: '神々が\n出雲に\n集まる話？', tone: 'dark'}]} tone='ink' size={44} />
				</Stage>
			</Beat>
			<Beat name="いつ、文字になった？" captions={c} from={6} to={10}>
				<Stage label="いつ、文字になった？">
					<BookGap />
				</Stage>
			</Beat>
			<Beat name="まず、佐太神社に？" captions={c} from={11} to={12}>
				<Photo id="sada-shrine" move="in" label="まず、佐太神社に？" />
			</Beat>
			<Beat name="どうやって、広まった？" captions={c} from={13} to={14}>
				<Photo id="hiroshige-izumo" move="in" label="どうやって、広まった？" />
			</Beat>
			<Beat name="御師が、全国へ？" captions={c} from={15} to={16}>
				<Stage label="御師が、全国へ？" labelBottom>
					<ReliefMap view='nihonkai' focus={P.kinki} zoom={1.2} pins={[{at: P.taisha, name: '出雲大社', big: true, t: 6}]} lines={[{pts: [P.taisha, P.kyoto], t: 20, arrow: true}, {pts: [P.taisha, P.nara], t: 28, arrow: true, bend: -0.2}, {pts: [P.taisha, P.osaka], t: 36, arrow: true, bend: -0.25}, {pts: [P.taisha, P.kyushu], t: 44, arrow: true, bend: -0.2}, {pts: [P.taisha, P.toyama], t: 52, arrow: true}, {pts: [P.taisha, P.suwa], t: 60, arrow: true, bend: 0.12}, {pts: [P.taisha, P.ise], t: 68, arrow: true, bend: -0.15}, {pts: [P.taisha, P.tokushima], t: 76, arrow: true, bend: -0.3}]} />
				</Stage>
			</Beat>
			<Beat name="江戸時代の中ごろには" captions={c} from={17} to={17}>
				<Photo id="taisha-1922" move="out" label="江戸時代の中ごろには" />
			</Beat>
			<Beat name="判決" captions={c} from={18} to={20}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 18, 19, fps)} />
			</Beat>
			<Beat name="古事記の出雲の神話は？" captions={c} from={21}>
				<Photo id="iwato-kunisada" move="left" label="古事記の出雲の神話は？" />
			</Beat>
		</SceneFrame>
	);
};

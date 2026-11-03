import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {P, ReliefMap} from '../components/IzumoMap';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue4KunibikiCaptions as c} from '../data/captions';

// 出雲の国は、神が引き寄せて作った？（素材はすべてこの場面だけで使う。scripts/gen_scenes_izumo.py が作る）
export const Clue4Kunibiki = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue4Kunibiki" label="第4の手がかり" title="出雲の国は、神が引き寄せて作った？">
			<Beat name="ほぼ完全に残る風土記" captions={c} from={0} to={1}>
				<Photo id="matsue-pano-w" move="scroll" label="ほぼ完全に残る風土記" />
			</Beat>
			<Beat name="国引きの神話" captions={c} from={2} to={4}>
				<Photo id="yumigahama-hill" move="in" label="国引きの神話" />
			</Beat>
			<Beat name="綱で、土地を引き寄せた？" captions={c} from={5} to={8}>
				<Stage label="綱で、土地を引き寄せた？">
					<ReliefMap view='izumo' focus={P.taisha} zoom={1.25} lines={[{pts: [[132.55, 35.7], [132.7, 35.47]], t: 10, arrow: true, color: '#ffcf7a', label: '新羅から'}, {pts: [P.sanbe, [132.69, 35.39]], t: 60, color: '#e9dcc0', width: 7, bend: 0.05, label: '綱＝薗の長浜'}]} pins={[{at: P.sanbe, name: '三瓶山', sub: '杭', t: 50, big: true}, {at: P.taisha, name: '出雲大社のあたり', t: 30, dx: 40}]} />
				</Stage>
			</Beat>
			<Beat name="最後は、越の国から" captions={c} from={9} to={11}>
				<Stage label="最後は、越の国から" labelBottom>
					<ReliefMap view='izumo' focus={P.miho} zoom={1.25} lines={[{pts: [[133.6, 35.8], [133.33, 35.57]], t: 10, arrow: true, color: '#ffcf7a', label: '越の国から'}, {pts: [P.daisen, [133.3, 35.53]], t: 60, color: '#e9dcc0', width: 7, bend: -0.05, label: '綱＝弓ヶ浜'}]} pins={[{at: P.daisen, name: '大山', sub: '杭', t: 50, big: true}, {at: P.miho, name: '美保関', t: 30}]} />
				</Stage>
			</Beat>
			<Beat name="土地が、引かれてきた？" captions={c} from={12} to={12}>
				<Photo id="mihonoseki-meotoiwa" move="in" label="土地が、引かれてきた？" />
			</Beat>
			<Beat name="2つの湖" captions={c} from={13} to={14}>
				<Photo id="shinji-sunset-2" move="in" label="2つの湖" />
			</Beat>
			<Beat name="6000年前の出雲は？" captions={c} from={15} to={16}>
				<Stage label="6000年前の出雲は？" labelBottom>
					<ReliefMap view='izumo' zoom={1.1} overlay={{src: 'maps/izumo-jomon.png', t: 30}} pins={[{at: [132.75, 35.37], name: '海だった低地', t: 70, big: true}]} />
				</Stage>
			</Beat>
			<Beat name="神話と地形の一致？" captions={c} from={17} to={18}>
				<Photo id="sonnonagahama" move="in" label="神話と地形の一致？" />
			</Beat>
			<Beat name="判決" captions={c} from={19} to={21}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 19, 20, fps)} />
			</Beat>
			<Beat name="あの怪物の正体は？" captions={c} from={22}>
				<Photo id="hii-river-2" move="in" label="あの怪物の正体は？" />
			</Beat>
		</SceneFrame>
	);
};

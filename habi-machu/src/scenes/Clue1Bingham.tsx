import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {TimeBar} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue1BinghamCaptions as c} from '../data/captions';

// マチュピチュを発見したのは、ビンガム？（素材はすべてこの場面だけで使う。scripts/gen_scenes_machu.py が作る）
export const Clue1Bingham = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue1Bingham" label="第1の手がかり" title="マチュピチュを発見したのは、ビンガム？">
			<Beat name="1911年7月24日" captions={c} from={0} to={0}>
				<Photo id="bingham-portrait" move="in" label="1911年7月24日" />
			</Beat>
			<Beat name="探していたのは、別の都市" captions={c} from={1} to={1}>
				<Photo id="bingham-espiritu" move="in" label="探していたのは、別の都市" />
			</Beat>
			<Beat name="ウルバンバ川の谷" captions={c} from={2} to={3}>
				<Photo id="uru-valley-1" move="in" label="ウルバンバ川の谷" />
			</Beat>
			<Beat name="すでに、人が住んでいた" captions={c} from={4} to={5}>
				<Photo id="old-three-windows-1911" move="in" label="すでに、人が住んでいた" />
			</Beat>
			<Beat name="壁に残された文字" captions={c} from={6} to={9}>
				<Photo id="lizarraga" move="in" label="壁に残された文字" />
			</Beat>
			<Beat name="1874年の地図" captions={c} from={10} to={10}>
				<Photo id="map-gohring" move="scroll" label="1874年の地図" />
			</Beat>
			<Beat name="では、ビンガムは何をした？" captions={c} from={11} to={11}>
				<Stage label="では、ビンガムは何をした？">
					<TimeBar stops={[{label: '1874年', sub: '地図に\n山の名前'}, {label: '1902年', sub: 'リサラガの\n書き込み'}, {label: '1911年', sub: 'ビンガムが\n到着', accent: true}, {label: '1913年', sub: '雑誌で\n世界へ'}]} tone='ember' />
				</Stage>
			</Beat>
			<Beat name="1913年4月" captions={c} from={12} to={13}>
				<Photo id="ng-cover-1913" move="in" label="1913年4月" />
			</Beat>
			<Beat name="世界が初めて見た姿" captions={c} from={14} to={14}>
				<Photo id="old-mp-1912" move="in" label="世界が初めて見た姿" />
			</Beat>
			<Beat name="アメリカへ渡った品々" captions={c} from={15} to={15}>
				<Photo id="peabody-full" move="in" label="アメリカへ渡った品々" />
			</Beat>
			<Beat name="クスコへ帰る" captions={c} from={16} to={16}>
				<Photo id="quipu-casaconcha" move="in" label="クスコへ帰る" />
			</Beat>
			<Beat name="判決" captions={c} from={17} to={19}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 17, 18, fps)} />
			</Beat>
			<Beat name="本当の名前だった？" captions={c} from={20}>
				<Photo id="mp-sunrise-45" move="in" label="本当の名前だった？" />
			</Beat>
		</SceneFrame>
	);
};

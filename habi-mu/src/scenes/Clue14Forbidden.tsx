import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {EightyThousand, OkinoshimaMap, OkinoshimaRules, ProtectReasons, SentinelMap} from '../components/MuArt3';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue14ForbiddenCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 上陸禁止の島が、ムーの証拠を隠している？（素材はすべてこの場面だけで使う）
export const Clue14Forbidden = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue14Forbidden" label="第14の手がかり" title="上陸禁止の島が、ムーの証拠を隠している？">
			<Beat name="上陸禁止の島は、ある？" captions={c} from={0} to={3}>
				<Photo id="okinoshima-sea" move="out" label="上陸禁止の島は、ある？" />
			</Beat>
			<Beat name="OkinoshimaMap" captions={c} from={4} to={4}>
				<Visual label="玄界灘の沖ノ島">
					<OkinoshimaMap />
				</Visual>
			</Beat>
			<Beat name="宗像大社の沖津宮" captions={c} from={5} to={6}>
				<Photo id="okitsumiya" label="宗像大社の沖津宮" />
			</Beat>
			<Beat name="OkinoshimaRules" captions={c} from={7} to={9}>
				<Visual label="島の掟">
					<OkinoshimaRules />
				</Visual>
			</Beat>
			<Beat name="EightyThousand" captions={c} from={10} to={12}>
				<Visual label="海の正倉院">
					<EightyThousand />
				</Visual>
			</Beat>
			<Beat name="SentinelMap" captions={c} from={13} to={16}>
				<Visual label="インド洋の島">
					<SentinelMap />
				</Visual>
			</Beat>
			<Beat name="ProtectReasons" captions={c} from={17} to={20}>
				<Visual label="何を守っている？">
					<ProtectReasons />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={21} to={23}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 21, 22, fps)} />
			</Beat>
			<Beat name="地図から消された島" captions={c} from={24}>
				<Photo id="coralsea" move="out" label="地図から消された島" />
			</Beat>
		</SceneFrame>
	);
};

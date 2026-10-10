import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {HaploTree, ReedMarsh} from '../components/Illustrations';
import {DnaHelix, EgyptGenome, FatherSon, Footprints, HotBone, MesopotamiaMap, Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {VerdictStamp} from '../components/VerdictStamp';
import {clue5DNACaptions as c} from '../data/captions';
import {colors} from '../theme';

// 16:38 第5の手がかり 神の遺伝子
export const Clue5DNA = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} label="第5の手がかり" title="日本人だけの「神の遺伝子」？" tint="#2a1f3d">
			<Beat name="神の遺伝子" captions={c} from={0} to={2}>
				<Visual label="日本人だけが持つ「神の遺伝子」？" labelColor={colors.goldSoft}>
					<DnaHelix halo />
				</Visual>
			</Beat>
			<Beat name="Y染色体D" captions={c} from={3} to={4}>
				<Visual label="父から息子へ、何万年も受け継がれる“印”">
					<FatherSon />
				</Visual>
			</Beat>
			<Beat name="YAP説" captions={c} from={5} to={7}>
				<Visual label="この印が、シュメールにつながる……？">
					<DnaHelix mark="YAP" />
				</Visual>
			</Beat>
			<Beat name="Dの家系図" captions={c} from={8} to={10}>
				<HaploTree emphasize="D" />
			</Beat>
			<Beat name="シュメールの側" captions={c} from={11} to={12}>
				<Visual label="シュメール人の子孫が、今も暮らす場所">
					<MesopotamiaMap />
				</Visual>
			</Beat>
			<Beat name="葦の原" captions={c} from={13} to={15}>
				<ReedMarsh />
			</Beat>
			<Beat name="DとJ" captions={c} from={16} to={18}>
				<HaploTree emphasize="both" />
			</Beat>
			<Beat name="まだ読まれていない" captions={c} from={19} to={21}>
				<Visual label="シュメール人のDNAは、まだ誰も読めていない">
					<HotBone />
				</Visual>
			</Beat>
			<Beat name="古代エジプト人" captions={c} from={22} to={23}>
				<Visual label="古代エジプト人の5分の1は、どこから来た？">
					<EgyptGenome />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={24} to={27}>
				<VerdictStamp verdict="wrong" from={captionFrame(c, 24, 25, fps)} premountFor={fps} />
			</Beat>
			<Beat name="珍しい≠優れている" captions={c} from={28}>
				<Visual label="遺伝子が、本当に記録しているもの">
					<Footprints />
				</Visual>
			</Beat>
		</SceneFrame>
	);
};

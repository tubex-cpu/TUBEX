import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Escape} from '../components/GenkoArt4';
import {Cards, Figures} from '../components/GenkoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue11SurvivorsCaptions as c} from '../data/captions';

// 嵐で、元軍は全滅した？（素材はすべてこの場面だけで使う。scripts/gen_scenes_genko.py が作る）
export const Clue11Survivors = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue11Survivors" label="第11の手がかり" title="嵐で、元軍は全滅した？">
			<Beat name="嵐が去った海" captions={c} from={0} to={0}>
				<Photo id="takashima-bridge-view" move="out" label="嵐が去った海" />
			</Beat>
			<Beat name="総大将は、どうした？" captions={c} from={1} to={2}>
				<Stage label="総大将は、どうした？">
					<Escape />
				</Stage>
			</Beat>
			<Beat name="鷹島に上陸した兵" captions={c} from={3} to={4}>
				<Photo id="takashima-2" move="right" label="鷹島に上陸した兵" />
			</Beat>
			<Beat name="島に残る言い伝え" captions={c} from={5} to={5}>
				<Photo id="takashima-3" move="left" label="島に残る言い伝え" />
			</Beat>
			<Beat name="よく聞く話は、本当？" captions={c} from={6} to={7}>
				<Stage label="よく聞く話は、本当？">
					<Figures figs={[{value: '10万', label: 'の兵のうち'}, {value: '3人？', label: 'だけ生還', accent: true}]} note='そのまま信じることはできない' tone='ink' />
				</Stage>
			</Beat>
			<Beat name="記録では？" captions={c} from={8} to={9}>
				<Stage label="記録では？">
					<Cards cards={[{head: '総大将たち', body: '船で\n帰っている', tone: 'gold'}, {head: '高麗の記録', body: '帰らなかった者\n7000人あまり', tone: 'dark'}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="命を落とし、捕らえられた" captions={c} from={10} to={11}>
				<Photo id="helmet-captured" move="in" label="命を落とし、捕らえられた" />
			</Beat>
			<Beat name="嵐のあとの命令書" captions={c} from={12} to={13}>
				<Stage label="嵐のあとの命令書">
					<Cards cards={[{head: '北条時宗の命令書', body: '元の船の多くは\nすでに去った', tone: 'paper'}]} tone='ember' size={56} />
				</Stage>
			</Beat>
			<Beat name="海の底に、眠り続ける" captions={c} from={14} to={14}>
				<Photo id="ainoshima-kuyoto" move="in" label="海の底に、眠り続ける" />
			</Beat>
			<Beat name="判決" captions={c} from={15} to={17}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 15, 16, fps)} />
			</Beat>
			<Beat name="沈んだ船は、見つかる？" captions={c} from={18}>
				<Photo id="kozaki-site-2" move="out" label="沈んだ船は、見つかる？" />
			</Beat>
		</SceneFrame>
	);
};

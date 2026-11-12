import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Figures, TimeBar} from '../components/IzumoKit';
import {P, ReliefMap} from '../components/IzumoMap';
import {LegendGap} from '../components/OnryoArt';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {rootsStoryCaptions as c} from '../data/captions';

// RootsStory（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const RootsStory = () => {
	return (
		<SceneFrame captions={c} voice="RootsStory" >
			<Beat name="怨霊の本当の物語" captions={c} from={0} to={2}>
				<Stage label="怨霊の本当の物語">
					<TimeBar stops={[{label: '785年', sub: '早良親王'}, {label: '863年', sub: '御霊会'}, {label: '903年', sub: '菅原道真'}, {label: '940年', sub: '平将門'}, {label: '1164年', sub: '崇徳上皇', accent: true}]} tone='shrine' />
				</Stage>
			</Beat>
			<Beat name="903年 大宰府" captions={c} from={3} to={5}>
				<Photo id="michizane-tenpai-met" move="in" label="903年 大宰府" />
			</Beat>
			<Beat name="3人が祀られた地" captions={c} from={6} to={7}>
				<Stage label="3人が祀られた地" labelBottom>
					<ReliefMap view='honshu' zoom={1.04} pins={[{at: P.tsuka, name: '大手町', sub: '平将門', t: 6}, {at: P.kyoto, name: '京都', sub: '北野・白峯', big: true, t: 30}, {at: P.shiramine, name: '白峯', sub: '崇徳上皇', t: 50}, {at: P.dazaifu, name: '大宰府', sub: '菅原道真', t: 70}]} />
				</Stage>
			</Beat>
			<Beat name="恐れが生まれるまで" captions={c} from={8} to={9}>
				<Stage label="恐れが生まれるまで">
					<Figures figs={[{value: '20年', label: '道真の霊が記録されるまで'}, {value: '13年', label: '崇徳の霊が恐れられるまで'}, {value: '400年', label: '将門の首が笑うまで', accent: true}]} />
				</Stage>
			</Beat>
			<Beat name="いつ、ふくらんだのか" captions={c} from={10} to={12}>
				<Stage label="いつ、ふくらんだのか">
					<LegendGap from={1150} to={2050} marks={[{year: 1220, label: '血の経', sub: '『保元物語』', story: true}, {year: 1690, label: '首が飛ぶ', sub: '『前太平記』', story: true}, {year: 1776, label: '天狗の上皇', sub: '『雨月物語』', story: true}, {year: 1926, label: '塚の祟りの噂', story: true}, {year: 2005, label: '三大怨霊', story: true}]} gapLabel='物語がふくらんだ時代' />
				</Stage>
			</Beat>
			<Beat name="恐れたからこそ、祀ってきた" captions={c} from={13}>
				<Photo id="yasui-enkiri" move="in" label="恐れたからこそ、祀ってきた" />
			</Beat>
		</SceneFrame>
	);
};

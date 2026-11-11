import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Figures, TimeBar} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue10UnescoCaptions as c} from '../data/captions';

// 神楽は、もう世界遺産になった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_takachiho.py が作る）
export const Clue10Unesco = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue10Unesco" label="第10の手がかり" title="神楽は、もう世界遺産になった？">
			<Beat name="神楽を守る知事の連合" captions={c} from={0} to={0}>
				<Photo id="yk-iwami-smoke" move="in" label="神楽を守る知事の連合" />
			</Beat>
			<Beat name="2025年11月28日" captions={c} from={1} to={2}>
				<Stage label="2025年11月28日">
					<Figures figs={[{value: '25', label: '都道県', small: '提案の対象'}, {value: '40', label: '件', small: '神楽（報道）', accent: true}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="まだ登録されていない" captions={c} from={3} to={5}>
				<Stage label="まだ登録されていない">
					<TimeBar stops={[{label: '2025年3月', sub: '知事の\n連合'}, {label: '2025年11月', sub: '提案候補に'}, {label: '2026年3月', sub: '提案書\n（予定）'}, {label: '2028年', sub: '審査の\n見込み', accent: true}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="答えが出るのは2年後" captions={c} from={6} to={7}>
				<Photo id="yk-tsunoyama" move="in" label="答えが出るのは2年後" />
			</Beat>
			<Beat name="判決" captions={c} from={8} to={10}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 8, 9, fps)} />
			</Beat>
		</SceneFrame>
	);
};

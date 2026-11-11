import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Figures} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue9FutureCaptions as c} from '../data/captions';

// 高千穂の夜神楽は、消えかけている？（素材はすべてこの場面だけで使う。scripts/gen_scenes_takachiho.py が作る）
export const Clue9Future = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue9Future" label="第9の手がかり" title="高千穂の夜神楽は、消えかけている？">
			<Beat name="集落の人々が支える" captions={c} from={0} to={1}>
				<Photo id="yk-masked-actor" move="in" label="集落の人々が支える" />
			</Beat>
			<Beat name="夜神楽を守る人々" captions={c} from={2} to={2}>
				<Stage label="夜神楽を守る人々">
					<Figures figs={[{value: '31', label: '団体', small: '夜神楽の保存会'}, {value: '500', label: '人', small: '舞い手（報道）'}]} tone='ember' />
				</Stage>
			</Beat>
			<Beat name="過疎と高齢化" captions={c} from={3} to={4}>
				<Photo id="miya-country" move="in" label="過疎と高齢化" />
			</Beat>
			<Beat name="新しい保存会" captions={c} from={5} to={6}>
				<Photo id="yk-daidai" move="in" label="新しい保存会" />
			</Beat>
			<Beat name="2026年2月" captions={c} from={7} to={7}>
				<Stage label="2026年2月">
					<Figures figs={[{value: '14', label: '保存会', small: '子ども伝承の集い'}, {value: '100', label: '人', small: '2026年2月'}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="高校生も舞を奉納" captions={c} from={8} to={8}>
				<Photo id="yk-suzu" move="in" label="高校生も舞を奉納" />
			</Beat>
			<Beat name="判決" captions={c} from={9} to={11}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 9, 10, fps)} />
			</Beat>
			<Beat name="世界はどう見ている？" captions={c} from={12}>
				<Photo id="yk-iwami-orochi" move="in" label="世界はどう見ている？" />
			</Beat>
		</SceneFrame>
	);
};

import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Figures, TimeBar} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue2HistoryCaptions as c} from '../data/captions';

// 夜神楽は、神話の時代から続いている？（素材はすべてこの場面だけで使う。scripts/gen_scenes_takachiho.py が作る）
export const Clue2History = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue2History" label="第2の手がかり" title="夜神楽は、神話の時代から続いている？">
			<Beat name="神話を題材にした舞" captions={c} from={0} to={1}>
				<Photo id="art-toyokuni-w" move="scroll" label="神話を題材にした舞" />
			</Beat>
			<Beat name="いつから舞われてきた？" captions={c} from={2} to={2}>
				<Photo id="yk-mask-kami-pair" move="in" label="いつから舞われてきた？" />
			</Beat>
			<Beat name="どれだけ古い？" captions={c} from={3} to={4}>
				<Stage label="どれだけ古い？">
					<Figures figs={[{value: '800', label: '年以上', small: '高千穂の夜神楽の歴史とされる'}]} tone='ember' />
				</Stage>
			</Beat>
			<Beat name="神話の時代と呼ぶには？" captions={c} from={5} to={8}>
				<Stage label="神話の時代と呼ぶには？">
					<TimeBar stops={[{label: '712年', sub: '古事記'}, {label: '720年', sub: '日本書紀'}, {label: '約800年前', sub: '夜神楽の\n記録', accent: true}, {label: '1978年', sub: '国の文化財'}, {label: '2026年', sub: 'いまも続く'}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={9} to={11}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 9, 10, fps)} />
			</Beat>
			<Beat name="天岩戸は、高千穂に？" captions={c} from={12}>
				<Photo id="art-toshimasa" move="in" label="天岩戸は、高千穂に？" />
			</Beat>
		</SceneFrame>
	);
};

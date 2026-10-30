import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {BoardActual} from '../components/GenkoArt4';
import {Cards, TimeBar} from '../components/GenkoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue15BoardCaptions as c} from '../data/captions';

// 元の船には、文字は残っていない？（素材はすべてこの場面だけで使う。scripts/gen_scenes_genko.py が作る）
export const Clue15Board = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue15Board" label="第15の手がかり" title="元の船には、文字は残っていない？">
			<Beat name="文字は、残らない？" captions={c} from={0} to={2}>
				<Photo id="deer-mouko" move="in" label="文字は、残らない？" />
			</Beat>
			<Beat name="2026年4月、松浦市が公表" captions={c} from={3} to={4}>
				<Photo id="takashima-bridge-2" move="left" label="2026年4月、松浦市が公表" />
			</Beat>
			<Beat name="一枚の、杉の板" captions={c} from={5} to={6}>
				<Stage label="一枚の、杉の板">
					<BoardActual />
				</Stage>
			</Beat>
			<Beat name="何が書かれていた？" captions={c} from={7} to={8}>
				<Stage label="何が書かれていた？">
					<Cards cards={[{head: '墨の文字', body: 'ほとんどが\n薄れて\n読めない', tone: 'dark'}]} tone='ink' size={56} />
				</Stage>
			</Beat>
			<Beat name="浮かび上がった年号は？" captions={c} from={9} to={11}>
				<Stage label="浮かび上がった年号は？">
					<TimeBar stops={[{label: '至元十二年', sub: '1275年'}, {label: '至元十三年', sub: '1276年'}]} tone='ember' note='赤外線の撮影で、最後の行に読み取れた' />
				</Stage>
			</Beat>
			<Beat name="読み解いた研究者は？" captions={c} from={12} to={15}>
				<Stage label="読み解いた研究者は？">
					<Cards cards={[{head: '広島大学 舩田善之 准教授', body: 'これまでになかった\n唯一無二の資料', tone: 'gold'}]} tone='ink' size={54} />
				</Stage>
			</Beat>
			<Beat name="船の中の決まりごと" captions={c} from={16} to={16}>
				<Photo id="goryeo-celadon-2" move="in" label="船の中の決まりごと" />
			</Beat>
			<Beat name="年号が、合わない？" captions={c} from={17} to={21}>
				<Stage label="年号が、合わない？">
					<TimeBar stops={[{label: '1275〜76年', sub: '板の年号'}, {label: '1281年', sub: '船が沈む', accent: true}]} note='5年以上の差' />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={22} to={24}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 22, 23, fps)} />
			</Beat>
			<Beat name="積まれていた武器は？" captions={c} from={25}>
				<Photo id="song-celadon-2" move="in" label="積まれていた武器は？" />
			</Beat>
		</SceneFrame>
	);
};

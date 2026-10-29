import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {BuLetter, EastAsia5th, KingsTimeline, TitleCompare} from '../components/NintokuArt3';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue8KingsCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 倭の王は、中国の皇帝の家来だった？（素材はすべてこの場面だけで使う）
export const Clue8Kings = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue8Kings" label="第8の手がかり" title="倭の王は、中国の皇帝の家来だった？">
			<Beat name="EastAsia5th" captions={c} from={0} to={1}>
				<Visual label="5世紀の東アジア">
					<EastAsia5th />
				</Visual>
			</Beat>
			<Beat name="KingsTimeline" captions={c} from={2} to={5}>
				<Visual label="5人の王の使い">
					<KingsTimeline />
				</Visual>
			</Beat>
			<Beat name="BuLetter" captions={c} from={6} to={8}>
				<Visual label="武の手紙">
					<BuLetter />
				</Visual>
			</Beat>
			<Beat name="北の強国、高句麗" captions={c} from={9} to={9}>
				<Photo id="goguryeo" label="北の強国、高句麗" />
			</Beat>
			<Beat name="TitleCompare" captions={c} from={10} to={10}>
				<Visual label="求めた位と、認められた位">
					<TitleCompare />
				</Visual>
			</Beat>
			<Beat name="ねらいは、どこに？" captions={c} from={11} to={12}>
				<Photo id="silla-crown" label="ねらいは、どこに？" />
			</Beat>
			<Beat name="朝鮮半島をめぐる争い" captions={c} from={13} to={13}>
				<Photo id="baekje-burner" label="朝鮮半島をめぐる争い" />
			</Beat>
			<Beat name="海の向こうへ、力を見せる" captions={c} from={14} to={15}>
				<Photo id="nintoku-02" label="海の向こうへ、力を見せる？" />
			</Beat>
			<Beat name="判決" captions={c} from={16} to={18}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 16, 17, fps)} />
			</Beat>
			<Beat name="誰が「仁徳天皇の墓」と決" captions={c} from={19}>
				<Photo id="tadeiyama" label="誰が「仁徳天皇の墓」と決めた？" />
			</Beat>
		</SceneFrame>
	);
};

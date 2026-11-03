import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {NakagoMark, RowsDiagram} from '../components/IzumoArt1';
import {Cards} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue7SwordsCaptions as c} from '../data/captions';

// 358本の銅剣は、戦いの武器だった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_izumo.py が作る）
export const Clue7Swords = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue7Swords" label="第7の手がかり" title="358本の銅剣は、戦いの武器だった？">
			<Beat name="長さ50センチほどの剣" captions={c} from={0} to={1}>
				<Photo id="korea-bronze-swords" move="in" label="長さ50センチほどの剣" />
			</Beat>
			<Beat name="埋め方が、おかしい？" captions={c} from={2} to={4}>
				<Stage label="埋め方が、おかしい？">
					<RowsDiagram />
				</Stage>
			</Beat>
			<Beat name="持ち手の部分に？" captions={c} from={5} to={5}>
				<Stage label="持ち手の部分に？">
					<NakagoMark />
				</Stage>
			</Beat>
			<Beat name="戦いに、向いていた？" captions={c} from={6} to={8}>
				<Stage label="戦いに、向いていた？">
					<Cards cards={[{head: '青銅', body: '作りたては\n金色\nやわらかい', tone: 'gold'}, {head: '鉄', body: 'かたく\n折れにくい', tone: 'dark'}]} tone='bronze' />
				</Stage>
			</Beat>
			<Beat name="武器の形をした、何か？" captions={c} from={9} to={10}>
				<Photo id="yoshitake-bronze" move="in" label="武器の形をした、何か？" />
			</Beat>
			<Beat name="武器の形の意味は？" captions={c} from={11} to={13}>
				<Photo id="sword-mold-saga" move="in" label="武器の形の意味は？" />
			</Beat>
			<Beat name="判決" captions={c} from={14} to={16}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 14, 15, fps)} />
			</Beat>
			<Beat name="剣だけだった？" captions={c} from={17}>
				<Photo id="kojindani-hoko-display" move="in" label="剣だけだった？" />
			</Beat>
		</SceneFrame>
	);
};

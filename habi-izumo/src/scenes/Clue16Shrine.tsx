import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {CarbonClock, HeightCompare, NinePillars, PillarBundle, Podium} from '../components/IzumoArt3';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue16ShrineCaptions as c} from '../data/captions';

// 出雲大社は、高さ48メートルの神殿だった？（素材はすべてこの場面だけで使う。scripts/gen_scenes_izumo.py が作る）
export const Clue16Shrine = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue16Shrine" label="第16の手がかり" title="出雲大社は、高さ48メートルの神殿だった？">
			<Beat name="970年、子どもの教科書" captions={c} from={0} to={2}>
				<Photo id="heian-jingu" move="in" label="970年、子どもの教科書" />
			</Beat>
			<Beat name="大きい順に並べると？" captions={c} from={3} to={4}>
				<Stage label="大きい順に並べると？">
					<Podium />
				</Stage>
			</Beat>
			<Beat name="大仏殿よりも大きい？" captions={c} from={5} to={5}>
				<Photo id="todaiji-daibutsuden" move="in" label="大仏殿よりも大きい？" />
			</Beat>
			<Beat name="言い伝えの高さは？" captions={c} from={6} to={7}>
				<Stage label="言い伝えの高さは？">
					<HeightCompare />
				</Stage>
			</Beat>
			<Beat name="2000年4月、八足門の前で" captions={c} from={8} to={9}>
				<Photo id="taisha-yatsuashimon" move="in" label="2000年4月、八足門の前で" />
			</Beat>
			<Beat name="3本の杉を束ねた柱？" captions={c} from={10} to={12}>
				<Stage label="3本の杉を束ねた柱？">
					<PillarBundle />
				</Stage>
			</Beat>
			<Beat name="いつの柱？" captions={c} from={13} to={15}>
				<Stage label="いつの柱？">
					<CarbonClock />
				</Stage>
			</Beat>
			<Beat name="1248年の本殿" captions={c} from={16} to={17}>
				<Photo id="kamakura-honden-model" move="in" label="1248年の本殿" />
			</Beat>
			<Beat name="古い図面には？" captions={c} from={18} to={20}>
				<Stage label="古い図面には？">
					<NinePillars />
				</Stage>
			</Beat>
			<Beat name="本当に48メートル？" captions={c} from={21} to={24}>
				<Photo id="taisha-model-1" move="in" label="本当に48メートル？" />
			</Beat>
			<Beat name="判決" captions={c} from={25} to={27}>
				<GavelVerdict verdict="half" strikeAt={captionFrame(c, 25, 26, fps)} />
			</Beat>
			<Beat name="立ち続けられた？" captions={c} from={28}>
				<Photo id="taisha-roofs" move="in" label="立ち続けられた？" />
			</Beat>
		</SceneFrame>
	);
};

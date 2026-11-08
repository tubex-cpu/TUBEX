import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Figures} from '../components/IzumoKit';
import {DiameterUpdate} from '../components/TomioArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue2HistoryCaptions as c} from '../data/captions';

// 巨大な古墳だと、昔から知られていた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_tomio.py が作る）
export const Clue2History = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue2History" label="第2の手がかり" title="巨大な古墳だと、昔から知られていた？">
			<Beat name="平穏ではなかった歴史" captions={c} from={0} to={1}>
				<Photo id="tomio-survey-a" move="in" label="平穏ではなかった歴史" />
			</Beat>
			<Beat name="持ち出された品" captions={c} from={2} to={2}>
				<Photo id="kajiya-ishi" move="in" label="持ち出された品" />
			</Beat>
			<Beat name="1972年、団地の工事" captions={c} from={3} to={4}>
				<Photo id="knm-3" move="in" label="1972年、団地の工事" />
			</Beat>
			<Beat name="およそ何メートル？" captions={c} from={5} to={6}>
				<Stage label="およそ何メートル？">
					<Figures figs={[{value: '86', label: 'm', small: '1972年の報告'}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="2017年度、調査が始まる" captions={c} from={7} to={8}>
				<Photo id="lidar-plane" move="in" label="2017年度、調査が始まる" />
			</Beat>
			<Beat name="空からレーザーで" captions={c} from={9} to={9}>
				<Photo id="halo" move="in" label="空からレーザーで" />
			</Beat>
			<Beat name="本当の大きさは？" captions={c} from={10} to={12}>
				<Stage label="本当の大きさは？">
					<DiameterUpdate />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={13} to={15}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 13, 14, fps)} />
			</Beat>
			<Beat name="あの巨大な剣は？" captions={c} from={16}>
				<Photo id="tomio-survey-u" move="in" label="あの巨大な剣は？" />
			</Beat>
		</SceneFrame>
	);
};

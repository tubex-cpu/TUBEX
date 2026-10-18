import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {RadarDepth, RetractionReasons, SubterraneanChamber, UndergroundClaim} from '../components/PyramidArt1';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {clue2UndergroundCaptions as c} from '../data/captions';

// 第2の手がかり 地下2キロに巨大な構造物？（素材はすべてこの場面だけで使う）
export const Clue2Underground = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue2Underground" label="第2の手がかり" title="地下2キロに巨大な構造物？">
			<Beat name="カフラー王" captions={c} from={0} to={1}>
				<Photo id="khafre-sphinx" label="カフラー王のピラミッドの地下に？" />
			</Beat>
			<Beat name="縦穴と部屋" captions={c} from={2} to={4}>
				<Visual label="地下に広がる、巨大な施設？">
					<UndergroundClaim />
				</Visual>
			</Beat>
			<Beat name="地下都市" captions={c} from={5} to={5}>
				<Photo id="khafre-jb" move="out" label="失われた地下都市？" />
			</Beat>
			<Beat name="ヘロドトス" captions={c} from={6} to={8}>
				<Photo id="herodotus" label="2500年前から続く、地下のうわさ" />
			</Beat>
			<Beat name="レーダー" captions={c} from={9} to={10}>
				<Visual label="人工衛星は、どこまで見える？">
					<RadarDepth />
				</Visual>
			</Beat>
			<Beat name="地下の部屋" captions={c} from={11} to={11}>
				<Visual label="地下にある、本当の部屋">
					<SubterraneanChamber />
				</Visual>
			</Beat>
			<Beat name="反論" captions={c} from={12} to={14}>
				<Photo id="khafre-jb2" move="left" label="専門家たちは、どう見た？" />
			</Beat>
			<Beat name="撤回" captions={c} from={15} to={18}>
				<Visual label="2026年8月、何が起きた？">
					<RetractionReasons />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={19} to={21}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 19, 20, fps)} />
			</Beat>
			<Beat name="本物の科学" captions={c} from={22}>
				<Photo id="giza-lumo" move="right" label="本物の科学は、何を見つけた？" />
			</Beat>
		</SceneFrame>
	);
};

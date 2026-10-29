import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {MayaEgyptGap, MayaEgyptOlder, NoContact, PhotosRemain, QueenRoute} from '../components/MuArt1';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue3QueenCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// ムーの女王は、エジプトに文明を伝えた？（素材はすべてこの場面だけで使う）
export const Clue3Queen = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue3Queen" label="第3の手がかり" title="ムーの女王は、エジプトに文明を伝えた？">
			<Beat name="探検家ル・プロンジョン" captions={c} from={0} to={0}>
				<Photo id="leplongeon" label="探検家ル・プロンジョン" />
			</Beat>
			<Beat name="妻のアリス" captions={c} from={1} to={1}>
				<Photo id="alice" label="妻のアリス" />
			</Beat>
			<Beat name="チチェン・イッツァで" captions={c} from={2} to={3}>
				<Photo id="lp-chichen" move="out" label="チチェン・イッツァで" />
			</Beat>
			<Beat name="MayaEgyptOlder" captions={c} from={4} to={5}>
				<Visual label="マヤは、エジプトより古い？">
					<MayaEgyptOlder />
				</Visual>
			</Beat>
			<Beat name="女王ムーの物語" captions={c} from={6} to={7}>
				<Photo id="queenmoo-naga" label="女王ムーの物語" />
			</Beat>
			<Beat name="QueenRoute" captions={c} from={8} to={9}>
				<Visual label="海を渡って、エジプトへ？">
					<QueenRoute />
				</Visual>
			</Beat>
			<Beat name="スフィンクスも、マヤから" captions={c} from={10} to={10}>
				<Photo id="sphinx" move="out" label="スフィンクスも、マヤから？" />
			</Beat>
			<Beat name="1896年の本" captions={c} from={11} to={12}>
				<Photo id="queenmoo-wings" label="1896年の本" />
			</Beat>
			<Beat name="壁画と彫刻の、本当の意味" captions={c} from={13} to={15}>
				<Photo id="queenmoo-rain" label="壁画と彫刻の、本当の意味" />
			</Beat>
			<Beat name="NoContact" captions={c} from={16} to={16}>
				<Visual label="つなぐ遺物は？">
					<NoContact />
				</Visual>
			</Beat>
			<Beat name="MayaEgyptGap" captions={c} from={17} to={17}>
				<Visual label="時代も、合わない">
					<MayaEgyptGap />
				</Visual>
			</Beat>
			<Beat name="今の考古学の見方" captions={c} from={18} to={18}>
				<Photo id="sphinx-1839" label="今の考古学の見方" />
			</Beat>
			<Beat name="写真は、本物の記録" captions={c} from={19} to={20}>
				<Photo id="lp-monjas" move="out" label="写真は、本物の記録" />
			</Beat>
			<Beat name="判決" captions={c} from={21} to={23}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 21, 22, fps)} />
			</Beat>
			<Beat name="PhotosRemain" captions={c} from={24}>
				<Visual label="マヤの女王が、太平洋へ？">
					<PhotosRemain />
				</Visual>
			</Beat>
		</SceneFrame>
	);
};

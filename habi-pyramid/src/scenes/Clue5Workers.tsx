import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {AlienClaim, FilmImage, FiveCluesDone, HealedBone, HerodotusNumbers, ShiftRotation, TitleInscription, WhipImage, WorkersTown} from '../components/PyramidArt3';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {clue5WorkersCaptions as c} from '../data/captions';

// 第5の手がかり 奴隷が造った？（素材はすべてこの場面だけで使う）
export const Clue5Workers = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue5Workers" label="第5の手がかり" title="ピラミッドは奴隷が造った？">
			<Beat name="宇宙人" captions={c} from={0} to={1}>
				<Visual label="2020年、ある投稿が世界をさわがせた">
					<AlienClaim />
				</Visual>
			</Beat>
			<Beat name="墓がある" captions={c} from={2} to={2}>
				<Photo id="giza-mastabas-1903" label="造った人々には、墓がある？" />
			</Beat>
			<Beat name="奴隷のイメージ" captions={c} from={3} to={4}>
				<Visual label="むちで打たれる奴隷？">
					<WhipImage />
				</Visual>
			</Beat>
			<Beat name="ヘロドトス" captions={c} from={5} to={6}>
				<Photo id="herodotus-2" label="このイメージは、どこから？" />
			</Beat>
			<Beat name="10万人" captions={c} from={7} to={8}>
				<Visual label="その数字は、いつ書かれた？">
					<HerodotusNumbers />
				</Visual>
			</Beat>
			<Beat name="映画" captions={c} from={9} to={9}>
				<Visual label="イメージを広めたのは？">
					<FilmImage />
				</Visual>
			</Beat>
			<Beat name="1990年" captions={c} from={10} to={12}>
				<Photo id="sphinx-khafre-plateau" move="out" label="1990年、馬がつまずいた壁" />
			</Beat>
			<Beat name="パンとビール" captions={c} from={13} to={13}>
				<Photo id="bread-mould" label="墓に供えられていたのは？" />
			</Beat>
			<Beat name="肩書き" captions={c} from={14} to={15}>
				<Visual label="墓に刻まれた、仕事の肩書き">
					<TitleInscription />
				</Visual>
			</Beat>
			<Beat name="骨" captions={c} from={16} to={17}>
				<Visual label="骨が語る、意外な事実">
					<HealedBone />
				</Visual>
			</Beat>
			<Beat name="労働者の町" captions={c} from={18} to={19}>
				<Visual label="ピラミッドの南に、町があった？">
					<WorkersTown />
				</Visual>
			</Beat>
			<Beat name="班の名前" captions={c} from={20} to={21}>
				<Photo id="menkaure" move="left" label="班の名前は「酔っぱらいたち」？" />
			</Beat>
			<Beat name="交代で" captions={c} from={22} to={23}>
				<Visual label="自由な働き手、だった？">
					<ShiftRotation />
				</Visual>
			</Beat>
			<Beat name="判決" captions={c} from={24} to={26}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 24, 25, fps)} />
			</Beat>
			<Beat name="5つの手がかり" captions={c} from={27}>
				<Visual label="5つの手がかりを、全てたどった">
					<FiveCluesDone />
				</Visual>
			</Beat>
		</SceneFrame>
	);
};

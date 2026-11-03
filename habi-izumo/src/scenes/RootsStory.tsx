import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {LongRoad} from '../components/IzumoArt3';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {rootsStoryCaptions as c} from '../data/captions';

// RootsStory（素材はすべてこの場面だけで使う。scripts/gen_scenes_izumo.py が作る）
export const RootsStory = () => {
	return (
		<SceneFrame captions={c} voice="RootsStory" >
			<Beat name="手がかりを、つなぐと" captions={c} from={0} to={0}>
				<Photo id="sanbe-1" move="in" label="手がかりを、つなぐと" />
			</Beat>
			<Beat name="2000年の流れ" captions={c} from={1} to={4}>
				<Stage label="2000年の流れ">
					<LongRoad />
				</Stage>
			</Beat>
			<Beat name="ヤマトの時代へ" captions={c} from={5} to={6}>
				<Photo id="mukibanda-village" move="in" label="ヤマトの時代へ" />
			</Beat>
			<Beat name="天にとどく宮殿に祭られる" captions={c} from={7} to={8}>
				<Photo id="kaguraden-shimenawa" move="in" label="天にとどく宮殿に祭られる" />
			</Beat>
			<Beat name="特別な神々の国" captions={c} from={9} to={10}>
				<Photo id="hinomisaki-shrine" move="in" label="特別な神々の国" />
			</Beat>
			<Beat name="神々は、出雲に行く" captions={c} from={11} to={13}>
				<Photo id="taisha-kagura" move="in" label="神々は、出雲に行く" />
			</Beat>
			<Beat name="何もないところからではない" captions={c} from={14} to={16}>
				<Photo id="shinji-yomegashima" move="in" label="何もないところからではない" />
			</Beat>
			<Beat name="今年も、神々を迎える火" captions={c} from={17} to={17}>
				<Photo id="benten-aerial" move="in" label="今年も、神々を迎える火" />
			</Beat>
			<Beat name="生まれ変わった博物館" captions={c} from={18}>
				<Photo id="museum-ext-1" move="in" label="生まれ変わった博物館" />
			</Beat>
		</SceneFrame>
	);
};

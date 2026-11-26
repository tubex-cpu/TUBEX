import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, TimeBar} from '../components/IzumoKit';
import {Flow} from '../components/SokushinArt';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {rootsStoryCaptions as c} from '../data/captions';

// RootsStory（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const RootsStory = () => {
	return (
		<SceneFrame captions={c} voice="RootsStory" label="本当の物語" title="">
			<Beat name="二つの問いに、判決を" captions={c} from={0} to={0}>
				<Photo id="story-sunrise-mountains" move="in" label="二つの問いに、判決を" />
			</Beat>
			<Beat name="1万年の流れ" captions={c} from={1} to={2}>
				<Stage label="1万年の流れ">
					<TimeBar stops={[{label: '1万6000年前', sub: '土器が生まれる'}, {label: '7300年前', sub: '大噴火'}, {label: '4200年前', sub: '寒さ'}, {label: '3000年前', sub: '米づくり', accent: true}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="暮らしの組み合わせ" captions={c} from={3} to={3}>
				<Stage label="暮らしの組み合わせ">
					<Flow steps={[{head: '村', body: '住み続ける'}, {head: 'クリの林', body: '育てる'}, {head: 'たくわえ', body: '穴にためる'}, {head: 'やりとり', body: 'ヒスイ\n黒曜石', hot: true}]} tone='moss' />
				</Stage>
			</Beat>
			<Beat name="動いて、生き延びた" captions={c} from={4} to={4}>
				<Photo id="story-sannai-blue" move="in" label="動いて、生き延びた" />
			</Beat>
			<Beat name="奪い合わない" captions={c} from={5} to={5}>
				<Photo id="story-kiusu" move="in" label="奪い合わない" />
			</Beat>
			<Beat name="一つ目の問い" captions={c} from={6} to={6}>
				<Photo id="story-isedotai" move="in" label="一つ目の問い" />
			</Beat>
			<Beat name="判決" captions={c} from={7} to={7}>
				<Stage label="判決">
					<Cards cards={[{head: '一つ目の判決', body: '森を育て、たくわえ\n分け合い、動く', tone: 'gold'}]} tone='moss' size={52} height={340} top={360} />
				</Stage>
			</Beat>
			<Beat name="二つ目の問い" captions={c} from={8} to={8}>
				<Photo id="c24-okinawa-kouri" move="in" label="二つ目の問い" />
			</Beat>
			<Beat name="そこへ" captions={c} from={9} to={9}>
				<Stage label="そこへ">
					<Flow steps={[{head: '寒さ'}, {head: '人の数が減る'}, {head: '米づくりと\n新しい人々', hot: true}]} tone='sea' />
				</Stage>
			</Beat>
			<Beat name="混ざり合っていった" captions={c} from={10} to={10}>
				<Photo id="c20-oyu-pillars" move="in" label="混ざり合っていった" />
			</Beat>
			<Beat name="判決" captions={c} from={11} to={11}>
				<Stage label="判決">
					<Cards cards={[{head: '二つ目の判決', body: '消えたのは\n縄文の暮らし方', tone: 'red'}]} tone='ink' size={52} height={340} top={360} />
				</Stage>
			</Beat>
			<Beat name="いまも流れる血" captions={c} from={12}>
				<Photo id="c22-tochimochi" move="in" label="いまも流れる血" />
			</Beat>
		</SceneFrame>
	);
};

import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {CopperNet} from '../components/GenkoArt4';
import {Cards, TimeBar} from '../components/GenkoKit';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {rootsStoryCaptions as c} from '../data/captions';

// RootsStory（素材はすべてこの場面だけで使う。scripts/gen_scenes_genko.py が作る）
export const RootsStory = () => {
	return (
		<SceneFrame captions={c} voice="RootsStory" >
			<Beat name="神風は、本当に吹いたのか" captions={c} from={0} to={1}>
				<Stage label="神風は、本当に吹いたのか">
					<Cards cards={[{head: '1度目', body: '嵐が追い返したとは\n言えない', tone: 'dark'}, {head: '2度目', body: '台風は吹いた\nでも、その前に…', tone: 'gold'}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="本当の物語は、どこに？" captions={c} from={2} to={3}>
				<Photo id="mouko-zuka" move="in" label="本当の物語は、どこに？" />
			</Beat>
			<Beat name="調べにくい海" captions={c} from={4} to={5}>
				<Stage label="調べにくい海">
					<Cards cards={[{head: '2024年度', body: '水中スクーターで\n濁りを払う', tone: 'dark'}]} tone='sea' size={56} />
				</Stage>
			</Beat>
			<Beat name="泥から出すと、どうなる？" captions={c} from={6} to={8}>
				<Stage label="泥から出すと、どうなる？">
					<CopperNet />
				</Stage>
			</Beat>
			<Beat name="なぜ、引き揚げない？" captions={c} from={9} to={10}>
				<Stage label="なぜ、引き揚げない？">
					<Cards cards={[{head: '引き揚げ', body: 'できる', tone: 'dark'}, {head: '保存・展示の施設', body: '足りない', tone: 'red'}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="少しずつ、確実に" captions={c} from={11} to={13}>
				<Stage label="少しずつ、確実に">
					<TimeBar stops={[{label: '1974', sub: '印'}, {label: '1980', sub: '調査開始'}, {label: '2011', sub: '1号船'}, {label: '2015', sub: '2号船'}, {label: '2023', sub: '3号船'}, {label: '2026', sub: '板・矢・遊び道具', accent: true}]} tone='sea' />
				</Stage>
			</Beat>
			<Beat name="かつての敵どうしが" captions={c} from={14} to={16}>
				<Stage label="かつての敵どうしが">
					<Cards cards={[{head: '750年前', body: '敵どうし\nとして\n向き合った', tone: 'red'}, {head: '今', body: '同じ海の底を\n一緒に\n調べている', tone: 'gold'}]} tone='sea' />
				</Stage>
			</Beat>
			<Beat name="神風の物語" captions={c} from={17} to={18}>
				<Photo id="komoda-stele" move="in" label="神風の物語" />
			</Beat>
			<Beat name="海の底が語る、別の物語" captions={c} from={19} to={21}>
				<Photo id="genko-museum-2" move="in" label="海の底が語る、別の物語" />
			</Beat>
			<Beat name="たくさんの人々の物語" captions={c} from={22}>
				<Photo id="borui-imazu-3-w" move="left" label="たくさんの人々の物語" />
			</Beat>
		</SceneFrame>
	);
};

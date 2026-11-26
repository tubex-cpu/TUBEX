import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {Balance} from '../components/KagamiArt';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {rootsStoryCaptions as c} from '../data/captions';

// 本当の物語（素材はすべてこの場面だけで使う。scripts/gen_scenes_kagami.py が作る）
export const RootsStory = () => {
	return (
		<SceneFrame captions={c} voice="RootsStory" >
			<Beat name="二つの問いに判決を" captions={c} from={0} to={1}>
				<Photo id="story-itoshima-sea" move="in" label="二つの問いに判決を" />
			</Beat>
			<Beat name="240年 鏡は倭に届いた" captions={c} from={2} to={3}>
				<Photo id="story-shorinzan" move="in" label="240年 鏡は倭に届いた" />
			</Beat>
			<Beat name="百枚はどの鏡か" captions={c} from={4} to={5}>
				<Photo id="story-kanbara-replica" move="in" label="百枚はどの鏡か" />
			</Beat>
			<Beat name="一つ目の問い" captions={c} from={6} to={7}>
				<Stage label="一つ目の問い">
					<Cards cards={[{head: '年号', body: '卑弥呼の時代'}, {head: '数', body: '5倍以上', tone: 'red'}, {head: '中国', body: '出ない', tone: 'red'}, {head: '墓', body: '死より後', tone: 'red'}]} tone='ink' size={44} height={300} top={380} />
				</Stage>
			</Beat>
			<Beat name="答えはまだ地面の下" captions={c} from={8} to={9}>
				<Photo id="unsolved-otsuki-mirror" move="in" label="答えはまだ地面の下" />
			</Beat>
			<Beat name="二つ目の問い" captions={c} from={10} to={14}>
				<Stage label="二つ目の問い">
					<Balance from={0} to={-0.45} left={[{text: '三角縁神獣鏡の中心', shaky: true}, {text: '箸墓古墳の年代'}, {text: '纒向の大集落'}]} right={[{text: '弥生の鏡の中心'}, {text: '国宝の巨大な鏡'}, {text: '吉野ヶ里の墓'}]} note='邪馬台国の文字は、まだ1文字も出ていない' />
				</Stage>
			</Beat>
			<Beat name="決着の重りは、まだ" captions={c} from={15}>
				<Photo id="story-shiroishi" move="in" label="決着の重りは、まだ" />
			</Beat>
		</SceneFrame>
	);
};

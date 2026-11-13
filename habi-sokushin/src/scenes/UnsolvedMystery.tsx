import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, TimeBar} from '../components/IzumoKit';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {unsolvedMysteryCaptions as c} from '../data/captions';

// UnsolvedMystery（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const UnsolvedMystery = () => {
	return (
		<SceneFrame captions={c} voice="UnsolvedMystery" >
			<Beat name="まだ解けていない謎" captions={c} from={0} to={2}>
				<Stage label="まだ解けていない謎">
					<Cards cards={[{head: '本明海上人', body: '亡くなり方は？'}, {head: '真如海上人', body: '亡くなり方は？'}, {head: '宥貞法印', body: 'CTの結果は？', tone: 'red'}]} tone='ink' size={44} height={330} top={360} />
				</Stage>
			</Beat>
			<Beat name="2019年の画像" captions={c} from={3} to={3}>
				<Photo id="kahaku-snow" move="in" label="2019年の画像" />
			</Beat>
			<Beat name="即身仏の危機" captions={c} from={4} to={4}>
				<Stage label="即身仏の危機">
					<Cards cards={[{head: 'カビ', body: '大部分で\n除去が必要', tone: 'red'}, {head: '記録', body: 'CT・年代測定\nDNA'}]} tone='ink' size={46} height={330} top={360} />
				</Stage>
			</Beat>
			<Beat name="研究は続く" captions={c} from={5} to={6}>
				<Stage label="研究は続く">
					<TimeBar stops={[{label: '1960年代', sub: '学術調査'}, {label: '2022年', sub: '国立科学博物館の目録'}, {label: '2025年7月', sub: '内藤正敏氏が亡くなる'}, {label: '2025年12月', sub: '新しい研究の本', accent: true}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="伝承と科学のあいだ" captions={c} from={7}>
				<Photo id="haguro-torii-mist" move="in" label="伝承と科学のあいだ" />
			</Beat>
		</SceneFrame>
	);
};

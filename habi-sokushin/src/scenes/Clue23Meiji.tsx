import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, TimeBar} from '../components/IzumoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue23MeijiCaptions as c} from '../data/captions';

// 明治天皇が、即身仏を禁じた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue23Meiji = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue23Meiji" label="第23の手がかり" title="明治天皇が、即身仏を禁じた？">
			<Beat name="ばらばらの年" captions={c} from={0} to={1}>
				<Stage label="ばらばらの年">
					<Cards cards={[{body: '明治10年？'}, {body: '明治11年？'}, {body: '明治12年？'}]} tone='ink' size={54} height={260} top={400} />
				</Stage>
			</Beat>
			<Beat name="命令は記録に？" captions={c} from={2} to={3}>
				<Stage label="命令は記録に？">
					<Cards cards={[{head: '天皇の命令', body: '一次資料\n見つからず', tone: 'red'}, {head: '明治元年の禁止令', body: '名前・番号を\n示す資料なし', tone: 'red'}]} tone='ink' size={46} height={330} top={360} />
				</Stage>
			</Beat>
			<Beat name="新しい刑法" captions={c} from={4} to={5}>
				<Photo id="daishinin" move="in" label="新しい刑法" />
			</Beat>
			<Beat name="自殺の手助け、墓をあばく罪" captions={c} from={6} to={6}>
				<Stage label="自殺の手助け、墓をあばく罪">
					<TimeBar stops={[{label: '1880年', sub: '旧刑法を公布'}, {label: '1882年', sub: '施行', accent: true}]} tone='ink' />
				</Stage>
			</Beat>
			<Beat name="閉ざされた道" captions={c} from={7} to={7}>
				<Photo id="old-tsuruoka-police" move="in" label="閉ざされた道" />
			</Beat>
			<Beat name="判決" captions={c} from={8} to={10}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 8, 9, fps)} />
			</Beat>
			<Beat name="最後の即身仏" captions={c} from={11}>
				<Photo id="miomote-river" move="in" label="最後の即身仏" />
			</Beat>
		</SceneFrame>
	);
};

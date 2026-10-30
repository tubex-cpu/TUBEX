import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/GenkoKit';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {unsolvedMysteryCaptions as c} from '../data/captions';

// UnsolvedMystery（素材はすべてこの場面だけで使う。scripts/gen_scenes_genko.py が作る）
export const UnsolvedMystery = () => {
	return (
		<SceneFrame captions={c} voice="UnsolvedMystery" >
			<Beat name="まだ判決を出せない謎" captions={c} from={0} to={0}>
				<Stage label="まだ判決を出せない謎">
					<Cards cards={[{head: '謎1', body: '木の板', tone: 'dark'}, {head: '謎2', body: '3号船', tone: 'dark'}, {head: '謎3', body: '1度目の撤退', tone: 'dark'}]} tone='night' size={52} />
				</Stage>
			</Beat>
			<Beat name="板には、何が書かれていた？" captions={c} from={1} to={5}>
				<Stage label="板には、何が書かれていた？">
					<Cards cards={[{head: '木の板', body: '決まりごと？\n名簿？', tone: 'gold'}, {head: 'もし名簿なら', body: '乗っていた人の\n名前が？', tone: 'dark'}]} tone='ember' />
				</Stage>
			</Beat>
			<Beat name="3号船は、誰の船？" captions={c} from={6} to={10}>
				<Stage label="3号船は、誰の船？">
					<Cards cards={[{head: '3号船', body: '全長およそ30m\n母船の可能性', tone: 'gold'}, {head: 'わからないこと', body: 'いつ、どこで造られ\nどんな旅をした？', tone: 'dark'}]} tone='sea' />
				</Stage>
			</Beat>
			<Beat name="1度目、なぜ引き揚げた？" captions={c} from={11} to={14}>
				<Stage label="1度目、なぜ引き揚げた？">
					<Cards cards={[{head: '嵐？', body: '', tone: 'dark'}, {head: '矢が尽きた？', body: '', tone: 'dark'}, {head: '指揮官の対立？', body: '', tone: 'dark'}, {head: '最初から計画？', body: '', tone: 'dark'}]} tone='night' height={160} top={460} />
				</Stage>
			</Beat>
			<Beat name="まだ眠る船が、ある" captions={c} from={15}>
				<Photo id="hakata-bay-2-w" move="left" label="まだ眠る船が、ある" />
			</Beat>
		</SceneFrame>
	);
};

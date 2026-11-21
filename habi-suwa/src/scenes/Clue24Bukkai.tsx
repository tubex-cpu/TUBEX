import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, TimeBar} from '../components/IzumoKit';
import {Flow, Scroll} from '../components/SokushinArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue24BukkaiCaptions as c} from '../data/captions';

// 最後の即身仏・仏海上人は、生きたまま土に入った？（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Clue24Bukkai = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue24Bukkai" label="第24の手がかり" title="最後の即身仏・仏海上人は、生きたまま土に入った？">
			<Beat name="仏海上人" captions={c} from={0} to={1}>
				<Stage label="仏海上人">
					<TimeBar stops={[{label: '1828年', sub: '村上に生まれる'}, {label: '18歳', sub: '注連寺に入る'}, {label: '1888年', sub: '注連寺の再建'}, {label: '1903年', sub: '76歳で亡くなる', accent: true}]} tone='ember' />
				</Stage>
			</Beat>
			<Beat name="仙人沢で2度の千日行" captions={c} from={2} to={2}>
				<Photo id="gassan-summer-snow" move="in" label="仙人沢で2度の千日行" />
			</Beat>
			<Beat name="生前に用意したもの" captions={c} from={3} to={3}>
				<Stage label="生前に用意したもの">
					<Flow steps={[{head: '石の部屋'}, {head: '木の棺'}, {head: '空気の竹筒', hot: true}]} />
				</Stage>
			</Beat>
			<Beat name="止められた入定" captions={c} from={4} to={5}>
				<Stage label="止められた入定">
					<Scroll text={'当局より\n禁止された'} source='小片保『民族衛生』1962年' tone='ember' />
				</Stage>
			</Beat>
			<Beat name="1903年3月20日" captions={c} from={6} to={7}>
				<Photo id="murakami-anzen-koji" move="in" label="1903年3月20日" />
			</Beat>
			<Beat name="研究者の指摘" captions={c} from={8} to={8}>
				<Stage label="研究者の指摘">
					<Cards cards={[{head: '墓の造り', body: '中で息が\nできない'}, {head: '証言', body: '亡くなったあとに\n体を清めた', tone: 'red'}]} tone='ink' size={46} height={330} top={360} />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={9} to={11}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 9, 10, fps)} />
			</Beat>
			<Beat name="その後の遺体は" captions={c} from={12}>
				<Photo id="paraffin" move="in" label="その後の遺体は" />
			</Beat>
		</SceneFrame>
	);
};

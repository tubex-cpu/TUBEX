import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {introCaptions as c} from '../data/captions';

// Intro（素材はすべてこの場面だけで使う。scripts/gen_scenes_onryo.py が作る）
export const Intro = () => {
	return (
		<SceneFrame captions={c} voice="Intro" >
			<Beat name="2026年8月19日、夜" captions={c} from={0} to={0}>
				<Photo id="kubizuka-new-front" move="in" label="2026年8月19日、夜" />
			</Beat>
			<Beat name="東京・大手町 将門塚" captions={c} from={1} to={1}>
				<Photo id="kubizuka-new-stone" move="in" label="東京・大手町 将門塚" />
			</Beat>
			<Beat name="日本三大怨霊" captions={c} from={2} to={2}>
				<Stage label="日本三大怨霊">
					<Cards cards={[{head: '平将門', body: '940年没\n関東'}, {head: '菅原道真', body: '903年没\n大宰府'}, {head: '崇徳上皇', body: '1164年没\n讃岐', tone: 'red'}]} tone='shrine' size={54} height={340} top={360} />
				</Stage>
			</Beat>
			<Beat name="空を飛んだ首？" captions={c} from={3} to={3}>
				<Photo id="masakado-yoshitoshi-horse" move="in" label="空を飛んだ首？" />
			</Beat>
			<Beat name="雷となった学者の霊？" captions={c} from={4} to={4}>
				<Photo id="michizane-kunisada-thunder" move="in" label="雷となった学者の霊？" />
			</Beat>
			<Beat name="血で書いた呪い？" captions={c} from={5} to={5}>
				<Photo id="sutoku-yoshitsuya" move="in" label="血で書いた呪い？" />
			</Beat>
			<Beat name="記録をたどると" captions={c} from={6} to={8}>
				<Stage label="記録をたどると">
					<Cards cards={[{head: '清涼殿の落雷', body: '当時の記録に\n道真の名は？', tone: 'red'}, {head: '将門を祀る神社', body: '明治に将門を\n神の座から外した？'}]} tone='ink' size={46} height={340} top={360} />
				</Stage>
			</Beat>
			<Beat name="祟った者を、神に？" captions={c} from={9} to={9}>
				<Photo id="kitano-gate" move="in" label="祟った者を、神に？" />
			</Beat>
			<Beat name="学問の神、東京の大社の神" captions={c} from={10} to={10}>
				<Photo id="kanda-zuishinmon-night" move="in" label="学問の神、東京の大社の神" />
			</Beat>
			<Beat name="祟りは、本当にあったのか" captions={c} from={11} to={11}>
				<Photo id="lightning-1" move="in" label="祟りは、本当にあったのか" />
			</Beat>
			<Beat name="2026年、国宝の絵巻が全巻公開" captions={c} from={12} to={12}>
				<Photo id="engi-raijin" move="in" label="2026年、国宝の絵巻が全巻公開" />
			</Beat>
			<Beat name="「祟り」の物語の意外な姿" captions={c} from={13}>
				<Photo id="heiankyo-model-w" move="scroll" label="「祟り」の物語の意外な姿" />
			</Beat>
		</SceneFrame>
	);
};

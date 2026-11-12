import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards} from '../components/IzumoKit';
import {Flow} from '../components/OnryoArt';
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
			<Beat name="その夜、何が起きたのか" captions={c} from={2} to={3}>
				<Stage label="その夜、何が起きたのか">
					<Flow steps={[{head: '8月19日', body: '塚で騒ぎ\n生配信'}, {head: '8月21日', body: '警察に相談'}, {head: '10月23日', body: '書類送検', hot: true}]} />
				</Stage>
			</Beat>
			<Beat name="「将門の祟りが起きる」" captions={c} from={4} to={5}>
				<Photo id="quake-whirlwind" move="in" label="「将門の祟りが起きる」" />
			</Beat>
			<Beat name="日本三大怨霊" captions={c} from={6} to={7}>
				<Stage label="日本三大怨霊">
					<Cards cards={[{head: '平将門', body: '940年没\n関東'}, {head: '菅原道真', body: '903年没\n大宰府'}, {head: '崇徳上皇', body: '1164年没\n讃岐', tone: 'red'}]} tone='shrine' size={54} height={340} top={360} />
				</Stage>
			</Beat>
			<Beat name="空を飛んだ首？" captions={c} from={8} to={8}>
				<Photo id="masakado-yoshitoshi-horse" move="in" label="空を飛んだ首？" />
			</Beat>
			<Beat name="雷となった学者の霊？" captions={c} from={9} to={9}>
				<Photo id="michizane-kunisada-thunder" move="in" label="雷となった学者の霊？" />
			</Beat>
			<Beat name="血で書いた呪い？" captions={c} from={10} to={10}>
				<Photo id="sutoku-yoshitsuya" move="in" label="血で書いた呪い？" />
			</Beat>
			<Beat name="祟った者を、神に？" captions={c} from={11} to={11}>
				<Photo id="kitano-gate" move="in" label="祟った者を、神に？" />
			</Beat>
			<Beat name="学問の神、東京の大社の神" captions={c} from={12} to={12}>
				<Photo id="kanda-zuishinmon-night" move="in" label="学問の神、東京の大社の神" />
			</Beat>
			<Beat name="祟りは、本当にあったのか" captions={c} from={13} to={13}>
				<Photo id="lightning-1" move="in" label="祟りは、本当にあったのか" />
			</Beat>
			<Beat name="2026年、国宝の絵巻が全巻公開" captions={c} from={14} to={14}>
				<Photo id="engi-raijin" move="in" label="2026年、国宝の絵巻が全巻公開" />
			</Beat>
			<Beat name="「祟り」の物語の正体" captions={c} from={15}>
				<Photo id="heiankyo-model-w" move="scroll" label="「祟り」の物語の正体" />
			</Beat>
		</SceneFrame>
	);
};

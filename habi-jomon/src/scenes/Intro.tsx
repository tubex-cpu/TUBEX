import {Beat} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Cards, Figures, TimeBar} from '../components/IzumoKit';
import {BigYears} from '../components/SokushinArt';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {introCaptions as c} from '../data/captions';

// Intro（素材はすべてこの場面だけで使う。scripts/gen_scenes_jomon.py が作る）
export const Intro = () => {
	return (
		<SceneFrame captions={c} voice="Intro" >
			<Beat name="吹雪の夜" captions={c} from={0} to={0}>
				<Photo id="open-snow-pithouse" move="in" label="吹雪の夜" />
			</Beat>
			<Beat name="地面を掘り下げた家" captions={c} from={1} to={1}>
				<Photo id="spare-uenohara-house" move="left" label="地面を掘り下げた家" />
			</Beat>
			<Beat name="電気も、米も、文字もない" captions={c} from={2} to={2}>
				<Photo id="open-snow-forest-a" move="right" label="電気も、米も、文字もない" />
			</Beat>
			<Beat name="冬を越し続けた" captions={c} from={3} to={3}>
				<Photo id="spare-torihama-houses" move="in" label="冬を越し続けた" />
			</Beat>
			<Beat name="その長さ" captions={c} from={4} to={5}>
				<Stage label="その長さ">
					<BigYears value={10000} unit='年以上' caption='続いた暮らし' tone='moss' />
				</Stage>
			</Beat>
			<Beat name="骨に残る、争いの跡は？" captions={c} from={6} to={6}>
				<Photo id="spare-mimizuku" move="in" label="骨に残る、争いの跡は？" />
			</Beat>
			<Beat name="なぜ、1万年も？" captions={c} from={7} to={7}>
				<Photo id="spare-isedotai-a" move="out" label="なぜ、1万年も？" />
			</Beat>
			<Beat name="何が起きたのか" captions={c} from={8} to={8}>
				<Stage label="何が起きたのか">
					<TimeBar stops={[{label: '1万6000年前', sub: '暮らしの始まり'}, {label: '3000年前', sub: '人の数が減っていく', accent: true}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="暮らしを終わらせたのは" captions={c} from={9} to={9}>
				<Stage label="暮らしを終わらせたのは">
					<Cards cards={[{head: '寒さ？', body: '冷えていく\n気候'}, {head: '飢え？', body: '減っていく\n食べ物'}, {head: '海を渡った人々？', body: '米づくりと\n新しい人々', tone: 'red'}]} tone='ink' size={44} height={340} top={360} />
				</Stage>
			</Beat>
			<Beat name="本当に、消えたのか" captions={c} from={10} to={10}>
				<Photo id="spare-plate-dogu" move="in" label="本当に、消えたのか" />
			</Beat>
			<Beat name="2026年 相次ぐ発表" captions={c} from={11} to={11}>
				<Photo id="open-dna-blue" move="in" label="2026年 相次ぐ発表" />
			</Beat>
			<Beat name="世界の科学誌に" captions={c} from={12} to={12}>
				<Stage label="世界の科学誌に">
					<Figures figs={[{value: '8000年以上前', label: '女性の遺伝子'}, {value: '42人', label: '縄文人の遺伝子'}, {value: '7300年前', label: '大噴火', accent: true}]} tone='night' />
				</Stage>
			</Beat>
			<Beat name="1万年の暮らしの秘密" captions={c} from={13} to={13}>
				<Photo id="spare-shakoki-ebisuda" move="in" label="1万年の暮らしの秘密" />
			</Beat>
			<Beat name="1万年続いた暮らしは、なぜ終わったのか" captions={c} from={14}>
				<Photo id="open-oyu-snow" move="in" label="1万年続いた暮らしは、なぜ終わったのか" />
			</Beat>
		</SceneFrame>
	);
};

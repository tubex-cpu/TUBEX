import {Beat, captionFrame} from '../components/Beat';
import {GavelVerdict} from '../components/GavelVerdict';
import {Hirakata2025, KilnSection, KilnYears, SueVsHaji, SuemuraMap, TechRoute, Workforce} from '../components/NintokuArt3';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {Visual} from '../components/Scenery';
import {clue3CraftCaptions as c} from '../data/captions';
import {useVideoConfig} from 'remotion';

// 古墳の時代、堺は最先端の工業地帯だった？（素材はすべてこの場面だけで使う）
export const Clue3Craft = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue3Craft" label="第3の手がかり" title="古墳の時代、堺は最先端の工業地帯だった？">
			<Beat name="造り出しから見つかったも" captions={c} from={0} to={1}>
				<Photo id="sue-jar" label="造り出しから見つかったもの" />
			</Beat>
			<Beat name="須恵器" captions={c} from={2} to={2}>
				<Photo id="suemura-cup" label="須恵器" />
			</Beat>
			<Beat name="SueVsHaji" captions={c} from={3} to={4}>
				<Visual label="何が違う？">
					<SueVsHaji />
				</Visual>
			</Beat>
			<Beat name="TechRoute" captions={c} from={5} to={5}>
				<Visual label="技術は、どこから？">
					<TechRoute />
				</Visual>
			</Beat>
			<Beat name="SuemuraMap" captions={c} from={6} to={6}>
				<Visual label="その生産地は？">
					<SuemuraMap />
				</Visual>
			</Beat>
			<Beat name="陶邑窯跡群" captions={c} from={7} to={8}>
				<Photo id="suemura-tg61" move="out" label="陶邑窯跡群" />
			</Beat>
			<Beat name="KilnYears" captions={c} from={9} to={9}>
				<Visual label="どれほど長く？">
					<KilnYears />
				</Visual>
			</Beat>
			<Beat name="最も古い窯のひとつ" captions={c} from={10} to={10}>
				<Photo id="suemura-tk73" label="最も古い窯のひとつ" />
			</Beat>
			<Beat name="海を越えてきた技術" captions={c} from={11} to={11}>
				<Photo id="suemura-pot" label="海を越えてきた技術" />
			</Beat>
			<Beat name="須恵器の大きなかめ" captions={c} from={12} to={13}>
				<Photo id="sue-jar-2" label="須恵器の大きなかめ" />
			</Beat>
			<Beat name="Hirakata2025" captions={c} from={14} to={15}>
				<Visual label="2025年10月、枚方で">
					<Hirakata2025 />
				</Visual>
			</Beat>
			<Beat name="KilnSection" captions={c} from={16} to={16}>
				<Visual label="トンネルのような窯">
					<KilnSection />
				</Visual>
			</Beat>
			<Beat name="窯の跡" captions={c} from={17} to={18}>
				<Photo id="kiln-site" move="left" label="窯の跡" />
			</Beat>
			<Beat name="Workforce" captions={c} from={19} to={19}>
				<Visual label="古墳を造った人々">
					<Workforce />
				</Visual>
			</Beat>
			<Beat name="最先端の技術が集まる" captions={c} from={20} to={20}>
				<Photo id="suemura-spout" label="最先端の技術が集まる" />
			</Beat>
			<Beat name="判決" captions={c} from={21} to={23}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 21, 22, fps)} />
			</Beat>
			<Beat name="埴輪は、何のため？" captions={c} from={24}>
				<Photo id="haniwa-early" label="埴輪は、何のため？" />
			</Beat>
		</SceneFrame>
	);
};

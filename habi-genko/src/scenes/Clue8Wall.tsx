import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {WallSection} from '../components/GenkoArt3';
import {Figures, MapScene, TimeBar} from '../components/GenkoKit';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue8WallCaptions as c} from '../data/captions';

// 博多湾に、20キロの石の壁を築いた？（素材はすべてこの場面だけで使う。scripts/gen_scenes_genko.py が作る）
export const Clue8Wall = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue8Wall" label="第8の手がかり" title="博多湾に、20キロの石の壁を築いた？">
			<Beat name="1276年3月、博多湾" captions={c} from={0} to={1}>
				<Photo id="borui-imazu-2" move="right" label="1276年3月、博多湾" />
			</Beat>
			<Beat name="石築地" captions={c} from={2} to={2}>
				<Photo id="borui-iki-1" move="in" label="石築地" />
			</Beat>
			<Beat name="どこからどこまで？" captions={c} from={3} to={3}>
				<Stage label="どこからどこまで？" labelBottom>
					<MapScene cam={{lon: 130.37, lat: 33.6, zoom: 5.5}} routes={[{from: 'imazu', via: ['ikinomatsubara', 'momochi', 'hakata'], to: 'kashii', at: 10}]} pins={[{key: 'imazu', name: '今津', dx: -120, at: 5}, {key: 'kashii', name: '香椎', at: 70}]} />
				</Stage>
			</Beat>
			<Beat name="誰が、どれだけ？" captions={c} from={4} to={5}>
				<Stage label="誰が、どれだけ？">
					<Figures figs={[{value: '9', label: 'か国の御家人', small: '九州の国々'}, {value: '20', label: 'キロ', small: '今津から香椎まで', accent: true}]} />
				</Stage>
			</Beat>
			<Beat name="生の松原は、肥後の武士" captions={c} from={6} to={6}>
				<Photo id="borui-iki-2" move="in" label="生の松原は、肥後の武士" />
			</Beat>
			<Beat name="わずか半年？" captions={c} from={7} to={8}>
				<Stage label="わずか半年？">
					<TimeBar stops={[{label: '3月', sub: '1276年 工事開始'}, {label: '8月ごろ', sub: 'ひと通り完成', accent: true}]} tone='moss' />
				</Stage>
			</Beat>
			<Beat name="壁の形は？" captions={c} from={9} to={11}>
				<Stage label="壁の形は？">
					<WallSection />
				</Stage>
			</Beat>
			<Beat name="場所ごとに違う積み方" captions={c} from={12} to={12}>
				<Photo id="borui-imajuku" move="in" label="場所ごとに違う積み方" />
			</Beat>
			<Beat name="砂に埋もれた壁" captions={c} from={13} to={13}>
				<Photo id="borui-meinohama" move="left" label="砂に埋もれた壁" />
			</Beat>
			<Beat name="今も見られる石の壁" captions={c} from={14} to={15}>
				<Photo id="borui-imazu-5" move="in" label="今も見られる石の壁" />
			</Beat>
			<Beat name="消えたと考えられていた" captions={c} from={16} to={16}>
				<Photo id="borui-hakozaki" move="out" label="消えたと考えられていた" />
			</Beat>
			<Beat name="100年前の見立て" captions={c} from={17} to={19}>
				<Photo id="borui-kyudai" move="in" label="100年前の見立て" />
			</Beat>
			<Beat name="2021年、国の史跡に" captions={c} from={20} to={20}>
				<Photo id="borui-imazu-4" move="right" label="2021年、国の史跡に" />
			</Beat>
			<Beat name="海を見張る" captions={c} from={21} to={22}>
				<Photo id="iki-noroshi" move="in" label="海を見張る" />
			</Beat>
			<Beat name="戦い方を、根本から" captions={c} from={23} to={23}>
				<Photo id="borui-nishijin-1" move="in" label="戦い方を、根本から" />
			</Beat>
			<Beat name="判決" captions={c} from={24} to={26}>
				<GavelVerdict verdict="correct" strikeAt={captionFrame(c, 24, 25, fps)} />
			</Beat>
			<Beat name="2度目の軍は、どれほど？" captions={c} from={27}>
				<Photo id="borui-nishijin-2" move="out" label="2度目の軍は、どれほど？" />
			</Beat>
		</SceneFrame>
	);
};

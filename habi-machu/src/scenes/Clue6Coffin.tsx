import {useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {Stage} from '../components/Cinema';
import {Figures} from '../components/IzumoKit';
import {CoffinRooms, Preservation} from '../components/TomioArt';
import {GavelVerdict} from '../components/GavelVerdict';
import {Photo} from '../components/Photo';
import {SceneFrame} from '../components/SceneFrame';
import {clue6CoffinCaptions as c} from '../data/captions';

// 1600年前の木の棺は、もう残っていない？（素材はすべてこの場面だけで使う。scripts/gen_scenes_tomio.py が作る）
export const Clue6Coffin = () => {
	const {fps} = useVideoConfig();
	return (
		<SceneFrame captions={c} voice="Clue6Coffin" label="第6の手がかり" title="1600年前の木の棺は、もう残っていない？">
			<Beat name="棺の中へ" captions={c} from={0} to={1}>
				<Photo id="dig-nakanishi" move="in" label="棺の中へ" />
			</Beat>
			<Beat name="割竹形木棺" captions={c} from={2} to={2}>
				<Photo id="mokkan-sakurai" move="in" label="割竹形木棺" />
			</Beat>
			<Beat name="コウヤマキ" captions={c} from={3} to={3}>
				<Photo id="koyamaki-trunk" move="in" label="コウヤマキ" />
			</Beat>
			<Beat name="どれだけ残っていた？" captions={c} from={4} to={5}>
				<Stage label="どれだけ残っていた？">
					<Figures figs={[{value: '5.54', label: 'm', small: '残っていた長さ', accent: true}, {value: '5.86', label: 'm', small: '本来の長さ（推定）'}]} tone='ember' />
				</Stage>
			</Beat>
			<Beat name="3つの部屋" captions={c} from={6} to={7}>
				<Stage label="3つの部屋">
					<CoffinRooms />
				</Stage>
			</Beat>
			<Beat name="2026年4月" captions={c} from={8} to={8}>
				<Photo id="nabunken" move="in" label="2026年4月" />
			</Beat>
			<Beat name="4つの機関が手を組む" captions={c} from={9} to={9}>
				<Photo id="gangoji-hondo" move="in" label="4つの機関が手を組む" />
			</Beat>
			<Beat name="棺を未来に残すには？" captions={c} from={10} to={11}>
				<Stage label="棺を未来に残すには？">
					<Preservation />
				</Stage>
			</Beat>
			<Beat name="判決" captions={c} from={12} to={14}>
				<GavelVerdict verdict="wrong" strikeAt={captionFrame(c, 12, 13, fps)} />
			</Beat>
			<Beat name="棺の中には、何が？" captions={c} from={15}>
				<Photo id="koyamaki-leaf" move="in" label="棺の中には、何が？" />
			</Beat>
		</SceneFrame>
	);
};

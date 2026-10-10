import {Beat} from '../components/Beat';
import {Center, ClayTablet, CompareCards, Label, PetroglyphRock, TwoLands} from '../components/Illustrations';
import {PersonSilhouette, SumerCity, SumerianStatue, VanishingPeople, Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {introCaptions as c} from '../data/captions';
import {colors} from '../theme';

// 0:00 謎の先出し
export const Intro = () => (
	<SceneFrame captions={c}>
		<Beat name="5000年前の町" captions={c} from={0} to={0}>
			<Visual label="5000年前、突然現れた謎の民族" labelColor={colors.gold}>
				<SumerCity />
			</Visual>
		</Beat>
		<Beat name="粘土板" captions={c} from={1} to={2}>
			<Center>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<ClayTablet width={500} />
					<Label>人類最古の文字を生んだのは……</Label>
				</div>
			</Center>
		</Beat>
		<Beat name="消えた民族" captions={c} from={3} to={4}>
			<Visual label="そしてある日、歴史から消えた">
				<VanishingPeople />
			</Visual>
		</Beat>
		<Beat name="シュメール人" captions={c} from={5} to={5}>
			<Visual label="シュメール人――その正体は、今も不明" labelColor={colors.gold}>
				<SumerianStatue size={560} />
			</Visual>
		</Beat>
		<Beat name="ふたつの土地" captions={c} from={6} to={8}>
			<TwoLands />
		</Beat>
		<Beat name="説の提示" captions={c} from={9} to={9}>
			<CompareCards
				left={<PersonSilhouette size={460} />}
				right={<SumerianStatue size={460} />}
				leftLabel="日本人"
				rightLabel="シュメール人"
				vs="の祖先？"
			/>
		</Beat>
		<Beat name="岩の予告" captions={c} from={10} to={10}>
			<Center>
				<PetroglyphRock highlight />
			</Center>
		</Beat>
		<Beat name="体の中の血" captions={c} from={11}>
			<Visual label="あなたの血にも、5000年前の謎が？">
				<PersonSilhouette dna size={560} />
			</Visual>
		</Beat>
	</SceneFrame>
);

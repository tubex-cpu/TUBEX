import {Beat} from '../components/Beat';
import {Photo} from '../components/Photo';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {DebateCounter, SailOffSouth, TwoCandidatesMap} from '../components/YamataiMaps';
import {introCaptions as c} from '../data/captions';

// 謎の先出し（素材はすべてこの場面だけで使う）
export const Intro = () => (
	<SceneFrame captions={c} voice="Intro">
		<Beat name="箸墓古墳" captions={c} from={0} to={1}>
			<Photo id="hashihaka-zenkei" label="卑弥呼の墓かもしれない古墳で、何が？" />
		</Beat>
		<Beat name="吉野ヶ里" captions={c} from={2} to={3}>
			<Photo id="yoshinogari-kitanaikaku" move="left" label="「謎のエリア」の石の棺の正体は？" />
		</Beat>
		<Beat name="2日続けて" captions={c} from={4} to={4}>
			<Visual label="二大候補地で、2日続けて何が？">
				<TwoCandidatesMap />
			</Visual>
		</Beat>
		<Beat name="300年と50か所" captions={c} from={5} to={6}>
			<Visual label="終わらない論争">
				<DebateCounter />
			</Visual>
		</Beat>
		<Beat name="海の上" captions={c} from={7} to={7}>
			<Visual label="記録どおりに進むと、海の上？">
				<SailOffSouth />
			</Visual>
		</Beat>
		<Beat name="金の印" captions={c} from={8} to={8}>
			<Photo id="shikanoshima-aerial" move="out" label="女王の金の印は、どこへ消えた？" />
		</Beat>
		<Beat name="1300年前の歴史家" captions={c} from={9} to={9}>
			<Photo id="nihonshoki-1286" label="1300年前の歴史家も、頭を悩ませていた？" />
		</Beat>
		<Beat name="今夜の問い" captions={c} from={10}>
			<Photo id="hashihaka-distance" move="right" label="邪馬台国は、どこにあったのか" />
		</Beat>
	</SceneFrame>
);

import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Beat, captionFrame} from '../components/Beat';
import {RoundArk, SmithExcited} from '../components/NoahArt';
import {Photo} from '../components/Photo';
import {Visual} from '../components/Scenery';
import {SceneFrame} from '../components/SceneFrame';
import {summaryCaptions as c} from '../data/captions';
import {colors, gothicFamily, minchoFamily} from '../theme';

const rows = [
	{clue: 'アララト山の船の形', note: '今のところ、自然の地形', mark: 'まちがい', color: colors.wrong},
	{clue: '聖書より古い洪水物語', note: '粘土板に本当にあった。方舟は丸かった', mark: '正しい', color: colors.correct},
	{clue: '洪水の地層', note: '本当にあった。でも地域の洪水', mark: '半分正しい', color: '#d98a12'},
	{clue: '黒海大洪水', note: '水の変化は本当。ノアとのつながりは不明', mark: '半分正しい', color: '#d98a12'},
	{clue: '全ての動物を乗せた船', note: '世界の大洪水の証拠はない', mark: 'まちがい', color: colors.wrong},
];

const VerdictBoard = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<div style={{position: 'absolute', left: 110, right: 110, top: 140, display: 'flex', flexDirection: 'column', gap: 14}}>
			{rows.map((r, i) => {
				const at = captionFrame(c, 0, i + 1, fps);
				return (
					<div key={r.clue} style={{display: 'flex', alignItems: 'center', gap: 36, padding: '6px 36px', borderRadius: 18, background: 'rgba(244,236,220,0.08)', opacity: interpolate(frame, [at - 20, at - 5], [0.25, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
						<div style={{width: 230, fontFamily: gothicFamily, fontWeight: 900, fontSize: 40, color: '#fff', background: r.color, borderRadius: 12, padding: '8px 0', textAlign: 'center', whiteSpace: 'nowrap', scale: interpolate(frame, [at, at + 8, at + 12], [0, 1.25, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>{r.mark}</div>
						<div style={{width: 540, fontFamily: minchoFamily, fontWeight: 800, fontSize: 44, whiteSpace: 'nowrap', color: colors.text}}>{r.clue}</div>
						<div style={{fontFamily: gothicFamily, fontWeight: 700, fontSize: 32, color: colors.muted}}>{r.note}</div>
					</div>
				);
			})}
		</div>
	);
};

// まとめ
export const Summary = () => (
	<SceneFrame captions={c} voice="Summary" label="閉廷" title="今夜の判決">
		<Beat name="判決ボード" captions={c} from={0} to={5}>
			<VerdictBoard />
		</Beat>
		<Beat name="見つからなかった" captions={c} from={6} to={7}>
			<Visual label="船は見つからなかった。でも――">
				<SmithExcited />
			</Visual>
		</Beat>
		<Beat name="祖先の物語" captions={c} from={8} to={8}>
			<Visual label="海がのぼる時代を生き延びた、祖先の物語" labelColor={colors.goldSoft}>
				<RoundArk />
			</Visual>
		</Beat>
		<Beat name="結論" captions={c} from={9}>
			<Photo id="noah-art" label="本当の話は、作り話に負けないくらい、面白い。">
				<Visual label="本当の話は、作り話に負けないくらい、面白い。">
					<RoundArk />
				</Visual>
			</Photo>
		</Beat>
	</SceneFrame>
);

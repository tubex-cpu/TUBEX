import {AbsoluteFill, Easing, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import timeline from '../../data/timeline_full.json';
import {FONT} from '../theme';
import {SceneProps} from './kit';
import {SCENES_A} from './ScenesA';
import {SCENES_B} from './ScenesB';
import {SCENES_C} from './ScenesC';

const FPS = 30;
const XF = 8;
export const FULL_FRAMES = Math.ceil(timeline.duration * FPS);
type Chunk = {sub: string; seg: {t: string; c: string}[]; start: number; end: number};
type Line = {id: string; start: number; end: number; chunks: Chunk[]};
const LINES = timeline.lines as Line[];
const lineById = new Map(LINES.map((l) => [l.id, l]));
const SCENES = timeline.scenes as {id: string; start: number; line: string}[];
const ALL: Record<string, React.FC<SceneProps>> = {...SCENES_A, ...SCENES_B, ...SCENES_C};
// scenes with a bright background: subtitles there get a faint shadow (owner 2026-11-04), elsewhere none
const LIGHT = new Set(['k1_cards', 'k1_timer', 'k2_mascot', 'k6_memo', 'k6_planner', 'k9_park']);

export const FadeIn: React.FC<{children: React.ReactNode; first: boolean}> = ({children, first}) => {
  const f = useCurrentFrame();
  const o = first ? 1 : interpolate(f, [0, XF], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const sc = first ? 1 : interpolate(f, [0, XF * 3], [1.03, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return <AbsoluteFill style={{opacity: o, transform: `scale(${sc})`}}>{children}</AbsoluteFill>;
};
const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{pointerEvents: 'none', opacity: 0.06, mixBlendMode: 'overlay', backgroundImage: `url(${staticFile(`grain/g${f % 4}.png`)})`, backgroundPosition: `${(f * 137) % 512}px ${(f * 251) % 512}px`, backgroundSize: '512px 512px'}} />;
};

const SceneBox: React.FC<{id: string; start: number; end: number; lead: number}> = ({id, start, end, lead}) => {
  const f = useCurrentFrame() - lead;
  const s0 = Math.round(start * FPS);
  const T = (lid: string, k = 0) => {
    const l = lineById.get(lid);
    if (!l) return 0;
    const c = l.chunks[Math.min(k, l.chunks.length - 1)];
    return Math.round(c.start * FPS) - s0;
  };
  const E = (lid: string) => Math.round((lineById.get(lid)?.end ?? 0) * FPS) - s0;
  const C = ALL[id];
  return C ? <C f={f} dur={Math.round((end - start) * FPS)} T={T} E={E} /> : <AbsoluteFill style={{background: '#300', color: '#fff', fontSize: 60}}>{id}</AbsoluteFill>;
};

// zoom punch when a red-highlighted line starts (>= 4 s apart, same rule as the sound accents)
const PUNCHES: number[] = (() => {
  const out: number[] = [];
  let last = -9;
  for (const l of LINES) for (const c of l.chunks) {
    const kinds = new Set(c.seg.map((x) => x.c));
    if (c.start - last < 4 || c.start < 6) continue;
    if (kinds.has('r')) { out.push(c.start); last = c.start; } else if (kinds.has('y')) last = c.start;
  }
  return out;
})();
const Punch: React.FC<{children: React.ReactNode}> = ({children}) => {
  const t = useCurrentFrame() / FPS;
  let s = 1;
  for (const p of PUNCHES) {
    const d = t - p;
    if (d >= 0 && d < 0.6) s = Math.max(s, 1 + 0.035 * Math.exp(-d * 7) * Math.min(1, d * 30));
  }
  return <AbsoluteFill style={{transform: `scale(${s})`}}>{children}</AbsoluteFill>;
};

// chapter title cards (2.4 s)
const Bumpers: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {(timeline.chapters as {line: string; num: string; title: string; at: number}[]).map(({line, num, title, at}) => {
        const d = f - Math.round(at * FPS);
        if (d < -4 || d > 74) return null;
        const a = interpolate(d, [-4, 4, 60, 74], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const slide = interpolate(d, [-4, 8], [-80, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
        const bar = interpolate(d, [0, 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
        return (
          <AbsoluteFill key={line} style={{opacity: a, pointerEvents: 'none'}}>
            <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(5,6,10,0.92) 0%, rgba(5,6,10,0.78) 55%, rgba(5,6,10,0) 100%)', clipPath: `inset(34% ${100 - bar * 100}% 34% 0)`}} />
            <div style={{position: 'absolute', left: 110 + slide, top: 395, fontFamily: FONT}}>
              <div style={{fontSize: 46, fontWeight: 900, color: '#e8c46a', letterSpacing: '0.12em'}}>{num}</div>
              <div style={{fontSize: 72, fontWeight: 900, color: '#ffffff', marginTop: 6, textShadow: '0 4px 18px rgba(0,0,0,0.8)'}}>{title}</div>
              <div style={{height: 6, width: 520 * bar, background: '#e0533d', marginTop: 18, borderRadius: 3}} />
            </div>
          </AbsoluteFill>
        );
      })}
    </>
  );
};

const PowerOff: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame() - Math.round(at * FPS);
  if (f < 0) return null;
  const sy = interpolate(f, [0, 5], [1, 0.006], {extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
  const sx = interpolate(f, [5, 11], [1, 0.0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic)});
  const glow = interpolate(f, [4, 10, 18], [1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${Math.max(sx, 0.002)}, ${sy})`, background: '#e8ecf5', opacity: f < 5 ? 0.35 : glow, boxShadow: '0 0 60px 20px rgba(220,230,255,0.8)'}} />
    </AbsoluteFill>
  );
};

export const SUB_CHUNKS = LINES.flatMap((l) => l.chunks);
const sceneAt = (t: number) => {
  let id = SCENES[0].id;
  for (const s of SCENES) if (s.start <= t) id = s.id;
  return id;
};
// subtitle cards: frame i = chunk i on a transparent background (for the subtitle overlay pass)
export const SubCard: React.FC = () => {
  const i = useCurrentFrame();
  const c = SUB_CHUNKS[i];
  if (!c) return null;
  const segs = c.seg.map((s) => ({...s, t: s.t.replace(/[、。，]/g, '')})).filter((s) => s.t.length > 0);
  const len = segs.reduce((n, s) => n + [...s.t].length, 0);
  const size = Math.min(74, Math.floor(1700 / Math.max(1, len * 1.04)));
  const col = (k: string) => (k === 'r' ? '#ff3b30' : k === 'y' ? '#ffd60a' : '#ffffff');
  const light = LIGHT.has(sceneAt((c.start + c.end) / 2));
  const shadow = light ? '0 2px 8px rgba(0,0,0,0.55), 0 0 3px rgba(0,0,0,0.5)' : 'none';
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 46}}>
      <div style={{fontFamily: '"Noto Sans JP", sans-serif', fontWeight: 900, fontSize: size, lineHeight: 1.2, whiteSpace: 'nowrap', letterSpacing: '0.04em'}}>
        {segs.map((s, k) => (
          <span key={k} style={{color: col(s.c), WebkitTextStroke: `${Math.max(1, Math.round(size * 0.018))}px ${col(s.c)}`, paintOrder: 'stroke fill', textShadow: shadow}}>{s.t}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
// preview with subtitles drawn live (for checks)
const Subs: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const i = SUB_CHUNKS.findIndex((c, k) => t >= c.start - 0.05 && t < Math.min(c.end + 0.25, SUB_CHUNKS[k + 1] ? SUB_CHUNKS[k + 1].start - 0.03 : 1e9));
  if (i < 0) return null;
  return <Sequence from={f - i} layout="none"><SubCard /></Sequence>;
};

export const Full: React.FC<{withSubs?: boolean; grain?: boolean}> = ({withSubs = false, grain = true}) => {
  const {durationInFrames} = useVideoConfig();
  const off = (timeline as {off_at?: number}).off_at ?? timeline.duration - 2.2;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Punch>
        {SCENES.map((s, i) => {
          const end = i + 1 < SCENES.length ? SCENES[i + 1].start : timeline.duration;
          const from = Math.round(s.start * FPS);
          return (
            <Sequence key={s.id} name={s.id} from={Math.max(0, from - (i === 0 ? 0 : XF))} durationInFrames={Math.round(end * FPS) - from + (i === 0 ? 0 : XF)}>
              <FadeIn first={i === 0}><SceneBox id={s.id} start={s.start} end={end} lead={i === 0 ? 0 : XF} /></FadeIn>
            </Sequence>
          );
        })}
      </Punch>
      {grain && <Grain />}
      <Bumpers />
      {withSubs && <Subs />}
      <PowerOff at={off} />
      <AbsoluteFill style={{pointerEvents: 'none'}} data-frames={durationInFrames} />
    </AbsoluteFill>
  );
};

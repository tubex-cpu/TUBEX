import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import timeline from '../../data/timeline_full.json';
import {FadeIn, Grain, SCENES} from '../Main';
import {SCENES_P2} from '../scenes/Part2';
import {Cafe} from '../three/Cafe';
import {CameraRig} from '../three/common';
import {Apartment} from '../three/Sets';
import {FONT} from '../theme';
import {CHAPTER_SCENES, SceneProps} from './Chapters';

const FPS = 30;
const XF = 8;
export const FULL_FRAMES = Math.ceil(timeline.duration * FPS);
type Line = {id: string; start: number; end: number; chunks: {sub: string; start: number; end: number}[]};
const LINES = timeline.lines as Line[];
const lineById = new Map(LINES.map((l) => [l.id, l]));
const CH_SCENES = timeline.scenes.filter((s) => s.start >= 172) as {id: string; start: number}[];
const SHIFT = (timeline as {shift?: number}).shift ?? 0;
const SHIFT_F = Math.round(SHIFT * FPS);
const P2_START = 60 + SHIFT;
const P2_END = 172.0 + SHIFT;

// one subtitle line at a time, shown exactly while it is spoken
const Subs: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const i = SUB_CHUNKS.findIndex((c, k) => t >= c.start - 0.05 && t < Math.min(c.end + 0.25, SUB_CHUNKS[k + 1] ? SUB_CHUNKS[k + 1].start - 0.03 : 1e9));
  if (i < 0) return null;
  return <Sequence from={f - i} layout="none"><SubCard /></Sequence>;
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

const Credit: React.FC = () => (
  <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'flex-end', padding: '0 40px 22px 0', fontFamily: FONT, fontSize: 22, color: 'rgba(255,255,255,0.8)', textShadow: '0 1px 2px #000'}}>
    音声：VOICEVOX:ナースロボ＿タイプＴ
  </AbsoluteFill>
);

const ChapterScene: React.FC<{id: string; start: number; end: number}> = ({id, start, end}) => {
  const f = useCurrentFrame() - XF;
  const s0 = Math.round(start * FPS);
  const T = (lid: string, k = 0) => {
    const l = lineById.get(lid);
    if (!l) return 0;
    const c = l.chunks[Math.min(k, l.chunks.length - 1)];
    return Math.round(c.start * FPS) - s0;
  };
  const E = (lid: string) => Math.round((lineById.get(lid)?.end ?? 0) * FPS) - s0;
  const C = CHAPTER_SCENES[id];
  const props: SceneProps = {f, dur: Math.round((end - start) * FPS), T, E};
  return C ? <C {...props} /> : <AbsoluteFill style={{background: '#300'}} />;
};

export const Full: React.FC<{withSubs?: boolean}> = ({withSubs = false}) => {
  const {durationInFrames} = useVideoConfig();
  const off = (timeline as {off_at?: number}).off_at ?? timeline.duration - 2.2;
  // chapter scenes start a little before their first line ("pre") — their start is the line start minus the pre-roll
  const starts = CH_SCENES.map((s, i) => {
    const pre = i === 0 ? 3.0 : 0.0;
    return {id: s.id, start: Math.max(P2_END, s.start - pre - preOf(s.id))};
  });
  return (
    <AbsoluteFill style={{background: '#000'}}>
     <Punch>
      {SCENES.map(({id, from, to, C}, i) => {
        const after = from >= 555;
        const f0 = from + (after ? SHIFT_F : 0);
        const t0 = to + (to >= 555 ? SHIFT_F : 0);
        return (
          <Sequence key={id} name={`P1 ${id}`} from={Math.max(0, f0 - XF)} durationInFrames={t0 - f0 + XF}>
            <FadeIn first={i === 0}>{after ? <Delay by={0}><C /></Delay> : <C />}</FadeIn>
          </Sequence>
        );
      })}
      <HalfOverlay />
      {SCENES_P2.map(({id, from, to, C}) => (
        <Sequence key={id} name={`P2 ${id}`} from={Math.round(P2_START * FPS) + from - XF} durationInFrames={to - from + XF}>
          <FadeIn first={false}><C /></FadeIn>
        </Sequence>
      ))}
      {starts.map((s, i) => {
        const end = i + 1 < starts.length ? starts[i + 1].start : timeline.duration;
        const from = Math.round(s.start * FPS);
        return (
          <Sequence key={s.id} name={s.id} from={from - XF} durationInFrames={Math.round(end * FPS) - from + XF}>
            <FadeIn first={false}><ChapterScene id={s.id} start={s.start} end={end} /></FadeIn>
          </Sequence>
        );
      })}
     </Punch>
      <Grain />
      <Bumpers />
      {withSubs && <Subs />}
      <PowerOff at={off} />
      <AbsoluteFill style={{pointerEvents: 'none'}} data-frames={durationInFrames} />
    </AbsoluteFill>
  );
};

// seconds of picture before the scene's first spoken line (from script_full "pre")
const PRE: Record<string, number> = {c3_quote: 2.6, c3_phone: 1.8, c4b_phone: 3.0, c4b_office: 2.4, c5_chat: 9.0, c6b_year: 1.0, c7_title: 2.0, c7_phone4: 6.0, c7_phone2: 5.0, c8_phone: 4.0, c9_cards: 1.5};
function preOf(id: string) { return PRE[id] ?? 0.4; }

// still backgrounds for the phone scenes (rendered once with renderStill)
export const BgCafe: React.FC = () => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <ThreeCanvas width={width} height={height} shadows gl={{toneMapping: THREE.ACESFilmicToneMapping, antialias: true}}>
        <CameraRig pos={[0.0, 1.2, 0.9]} target={[0, 1.0, -0.6]} fov={44} />
        <Cafe showYou={false} friend={{expr: {smile: 0.5, open: 0, lid: 0}, gaze: [0, 0.05], head: [0.03, 0.02, 0.04]}} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
export const BgApartment: React.FC = () => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <ThreeCanvas width={width} height={height} shadows gl={{toneMapping: THREE.ACESFilmicToneMapping, antialias: true}}>
        <CameraRig pos={[0.3, 1.15, 1.1]} target={[0, 0.9, -1.2]} fov={46} />
        <Apartment />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

const Delay: React.FC<{by: number; children: React.ReactNode}> = ({children}) => <>{children}</>;

// zoom punch when a red-highlighted line starts (same spacing rule as the sound accents: >= 4 s apart)
const PUNCHES: number[] = (() => {
  const out: number[] = [];
  let last = -9;
  for (const l of LINES) for (const c of l.chunks as {start: number; seg?: {c: string}[]}[]) {
    const kinds = new Set((c.seg ?? []).map((x) => x.c));
    if (c.start - last < 4 || c.start < 2) continue;
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

// chapter title cards (2.4 s) at the first line of each chapter
const CHAPTERS: [string, string, string][] = [
  ['Q1', '第1章', 'あなたで試す思考実験'],
  ['C2_1', '第2章', 'フレネミーの脳の中① 人の成功は「痛み」になる'],
  ['C3_1', '第3章', 'フレネミーの脳の中② あなたの不幸は「報酬」になる'],
  ['C4_1', '第4章', 'なぜフレネミーは「近い人」から生まれるのか'],
  ['C5_1', '第5章', 'フレネミーの正体 「でもさ」はなぜ出るのか'],
  ['C6_1', '第6章', 'フレネミーが横にいるだけで、体に起きること'],
  ['C6b_1', '第6章②', 'なぜ、フレネミーにはだまされるのか'],
  ['C7_1', '第7章', 'これが当てはまるならフレネミー「いい知らせテスト」'],
  ['C8_1', '第8章', 'あなたがフレネミーにならないために'],
  ['C9_1', '第9章', 'まとめ フレネミーの正体'],
];
const Bumpers: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {CHAPTERS.map(([lid, num, title]) => {
        const l = lineById.get(lid);
        if (!l) return null;
        const at = Math.round((l.start - 0.3) * FPS);
        const d = f - at;
        if (d < -4 || d > 74) return null;
        const a = interpolate(d, [-4, 4, 60, 74], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const slide = interpolate(d, [-4, 8], [-80, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
        const bar = interpolate(d, [0, 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
        return (
          <AbsoluteFill key={lid} style={{opacity: a, pointerEvents: 'none'}}>
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

// the new opening line: "親しい人の中の半分はフレネミー"
const HalfOverlay: React.FC = () => {
  const f = useCurrentFrame();
  const l = lineById.get('L4b');
  if (!l) return null;
  const s0 = Math.round(l.chunks[1].start * FPS), e0 = Math.round((l.end + 0.4) * FPS);
  if (f < s0 - 6 || f > e0 + 8) return null;
  const a = interpolate(f, [s0 - 6, s0 + 4, e0, e0 + 8], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: a, background: 'rgba(5,6,10,0.55)', alignItems: 'center', fontFamily: FONT}}>
      <div style={{marginTop: 150, fontSize: 64, fontWeight: 900, color: '#fff', textShadow: '0 4px 16px #000'}}>あなたの親しい人の中の</div>
      <div style={{display: 'flex', gap: 26, marginTop: 50}}>
        {Array.from({length: 10}, (_, i) => {
          const on = f > s0 + 10 + i * 3;
          const red = i % 2 === 1 && f > s0 + 50;
          return (
            <svg key={i} width={110} height={130} viewBox="0 0 100 115" style={{opacity: on ? 1 : 0, filter: red ? 'drop-shadow(0 0 14px rgba(224,83,61,0.9))' : undefined}}>
              <circle cx="50" cy="30" r="18" fill={red ? '#e0533d' : '#c9d3e6'} />
              <path d="M 18 112 C 18 70 30 56 50 56 C 70 56 82 70 82 112 Z" fill={red ? '#e0533d' : '#c9d3e6'} />
            </svg>
          );
        })}
      </div>
      <div style={{marginTop: 40, fontSize: 92, fontWeight: 900, color: '#e0533d', opacity: f > s0 + 55 ? 1 : 0, textShadow: '0 4px 20px #000'}}>半分はフレネミー</div>
    </AbsoluteFill>
  );
};

// subtitle cards: frame i = chunk i on a transparent background (for the subtitle overlay pass)
export const SUB_CHUNKS = LINES.flatMap((l) => l.chunks) as {sub: string; seg: {t: string; c: string}[]; start: number; end: number}[];
export const SubCard: React.FC = () => {
  const i = useCurrentFrame();
  const c = SUB_CHUNKS[i];
  if (!c) return null;
  const segs = c.seg.map((s) => ({...s, t: s.t.replace(/[、。,.，．]/g, '')})).filter((s) => s.t.length > 0);
  const len = segs.reduce((n, s) => n + [...s.t].length, 0);
  const size = Math.min(74, Math.floor(1700 / Math.max(1, len * 1.04)));
  const col = (k: string) => (k === 'r' ? '#ff3b30' : k === 'y' ? '#ffd60a' : '#ffffff');
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 46}}>
      <div style={{fontFamily: '"Noto Sans JP", sans-serif', fontWeight: 900, fontSize: size, lineHeight: 1.2, whiteSpace: 'nowrap', letterSpacing: '0.04em'}}>
        {segs.map((s, k) => (
          <span key={k} style={{color: col(s.c), WebkitTextStroke: `${Math.max(2, Math.round(size * 0.035))}px ${col(s.c)}`, paintOrder: 'stroke fill', textShadow: '0 0 14px rgba(0,0,0,0.75), 0 0 4px rgba(0,0,0,0.6), 0 3px 6px rgba(0,0,0,0.5)'}}>{s.t}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

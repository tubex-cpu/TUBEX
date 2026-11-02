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
const P2_START = 60;
const P2_END = 172.0;

// one subtitle line at a time, shown exactly while it is spoken
const Subs: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const chunks = LINES.flatMap((l) => l.chunks);
  const i = chunks.findIndex((c, k) => t >= c.start - 0.05 && t < Math.min(c.end + 0.25, chunks[k + 1] ? chunks[k + 1].start - 0.03 : 1e9));
  if (i < 0) return null;
  const c = chunks[i];
  const a = interpolate(t, [c.start - 0.05, c.start + 0.05], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 56, pointerEvents: 'none'}}>
      <div style={{opacity: a, fontFamily: FONT, fontWeight: 700, fontSize: 48, lineHeight: 1.35, color: '#fff', whiteSpace: 'nowrap', letterSpacing: '0.02em',
        padding: '10px 30px', borderRadius: 12, background: 'rgba(10,13,20,0.58)',
        textShadow: '0 0 2px #000, 0 2px 4px rgba(0,0,0,0.9)', WebkitTextStroke: '1.2px rgba(0,0,0,0.8)', paintOrder: 'stroke fill'}}>{c.sub}</div>
    </AbsoluteFill>
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

export const Full: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  const off = (timeline as {off_at?: number}).off_at ?? timeline.duration - 2.2;
  // chapter scenes start a little before their first line ("pre") — their start is the line start minus the pre-roll
  const starts = CH_SCENES.map((s, i) => {
    const pre = i === 0 ? 3.0 : 0.0;
    return {id: s.id, start: Math.max(P2_END, s.start - pre - preOf(s.id))};
  });
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SCENES.map(({id, from, to, C}, i) => (
        <Sequence key={id} name={`P1 ${id}`} from={Math.max(0, from - XF)} durationInFrames={to - from + XF}>
          <FadeIn first={i === 0}><C /></FadeIn>
        </Sequence>
      ))}
      {SCENES_P2.map(({id, from, to, C}) => (
        <Sequence key={id} name={`P2 ${id}`} from={P2_START * FPS + from - XF} durationInFrames={to - from + XF}>
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
      <Grain />
      <Subs />
      <Sequence from={Math.round((off - 6) * FPS)} durationInFrames={Math.round(6 * FPS)}><Credit /></Sequence>
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

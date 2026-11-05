import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useVideoConfig} from 'remotion';
import {Brain3D, ExtraGlow, projectToScreen} from '../three/Brain3D';
import {CameraRig, ease} from '../three/common';
import {FONT} from '../theme';
import {K, clamp} from './ui';

export type SceneProps = {f: number; dur: number; T: (id: string, k?: number) => number; E: (id: string) => number};
export const W = 1920, H = 1080;
export const seg = (f: number, a: number, b: number) => ease((f - a) / Math.max(1, b - a));
export const GL = {toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0, antialias: true, preserveDrawingBuffer: true};
export const Canvas: React.FC<{children: React.ReactNode; shadows?: boolean}> = ({children, shadows = false}) => (
  <ThreeCanvas width={W} height={H} shadows={shadows ? {type: THREE.PCFSoftShadowMap} : false} gl={GL} style={{position: 'absolute', inset: 0}}>{children}</ThreeCanvas>
);

// CG still with a slow push-in (and optional blur / darkening)
export const Still: React.FC<{src: string; f: number; dur: number; blur?: number; dark?: number; from?: number; to?: number; ox?: number; oy?: number}> = ({src, f, dur, blur = 0, dark = 0.2, from = 1.02, to = 1.1, ox = 50, oy = 50}) => {
  const s = interpolate(f, [0, Math.max(1, dur)], [from, to], clamp);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: `${ox}% ${oy}%`, filter: blur ? `blur(${blur}px)` : undefined}}>
        <Img src={staticFile(`bg/${src}.png`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: `rgba(4,6,10,${dark})`}} />
    </AbsoluteFill>
  );
};

// bright studio (the "thought experiment" room) drawn in 2D
export const WhiteStudio: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #e9e8e4 0%, #f3f2ef 58%, #e2e0db 58.2%, #ecebe7 100%)', fontFamily: FONT, color: '#1d2230'}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 60%)'}} />
    {children}
  </AbsoluteFill>
);

// dark board with a soft key light; content kept above the subtitle band
export const DarkBoard: React.FC<{children?: React.ReactNode; tint?: string}> = ({children, tint = '#222838'}) => (
  <AbsoluteFill style={{fontFamily: FONT, color: K.ink, background: `radial-gradient(ellipse at 50% 18%, ${tint} 0%, #0c0f16 62%, #07080b 100%)`}}>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 108%, rgba(232,196,106,0.10) 0%, rgba(0,0,0,0) 45%)'}} />
    {children}
  </AbsoluteFill>
);

export const Title: React.FC<{f: number; at?: number; text: React.ReactNode; y?: number; size?: number; color?: string}> = ({f, at = 0, text, y = 120, size = 64, color = K.ink}) => {
  const a = interpolate(f - at, [0, 12], [0, 1], clamp);
  return <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', fontSize: size, fontWeight: 900, color, opacity: a, transform: `translateY(${(1 - a) * 16}px)`, fontFamily: FONT, textShadow: '0 4px 18px rgba(0,0,0,0.45)'}}>{text}</div>;
};

// ---------- short-video feed ----------
const FEED = [
  {bg: ['#ff7a59', '#ffd166'], icon: '🍜', cap: '深夜の爆速ラーメン'}, {bg: ['#3a7bd5', '#00d2ff'], icon: '🐱', cap: '猫が箱に入るだけ'},
  {bg: ['#8e2de2', '#ff6fd8'], icon: '💄', cap: '3秒で変わるメイク'}, {bg: ['#11998e', '#38ef7d'], icon: '⚽', cap: '神トラップ集'},
  {bg: ['#f12711', '#f5af19'], icon: '🎮', cap: '最強キャラ決定'}, {bg: ['#232526', '#414345'], icon: '😂', cap: '寝起きドッキリ'},
  {bg: ['#614385', '#516395'], icon: '🎤', cap: 'サビだけ歌ってみた'}, {bg: ['#ee0979', '#ff6a00'], icon: '🍰', cap: '1分で作るケーキ'},
  {bg: ['#1d976c', '#93f9b9'], icon: '🐶', cap: '犬の全力ダッシュ'}, {bg: ['#373b44', '#4286f4'], icon: '🚗', cap: '駐車が神すぎる'},
];
export const FeedTile: React.FC<{i: number; w: number; h: number; f: number; bore?: boolean}> = ({i, w, h, f, bore = false}) => {
  const it = FEED[((i % FEED.length) + FEED.length) % FEED.length];
  const bob = Math.sin((f + i * 17) / 9) * 8;
  return (
    <div style={{position: 'absolute', width: w, height: h, overflow: 'hidden', background: bore ? 'linear-gradient(160deg, #4a4d55, #2a2c31)' : `linear-gradient(160deg, ${it.bg[0]}, ${it.bg[1]})`}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: h * 0.26 + bob, textAlign: 'center', fontSize: w * 0.42, filter: bore ? 'grayscale(1) brightness(0.7)' : undefined}}>{it.icon}</div>
      <div style={{position: 'absolute', left: 26, bottom: 120, right: 90, fontSize: w * 0.06, fontWeight: 800, color: '#fff', textShadow: '0 2px 6px rgba(0,0,0,0.6)'}}>{bore ? '……' : it.cap}</div>
      <div style={{position: 'absolute', right: 22, bottom: 160, display: 'flex', flexDirection: 'column', gap: 28, alignItems: 'center'}}>
        {['♥', '💬', '↗'].map((s, k) => <div key={k} style={{width: w * 0.12, height: w * 0.12, borderRadius: '50%', background: 'rgba(0,0,0,0.25)', color: '#fff', fontSize: w * 0.06, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{s}</div>)}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 8, background: 'rgba(255,255,255,0.25)'}}><div style={{width: `${((f * 0.7 + i * 23) % 100)}%`, height: '100%', background: '#fff'}} /></div>
    </div>
  );
};

// the phone in your hand (POV). Each flick pushes the next video up.
export const PhonePOV: React.FC<{f: number; x?: number; y?: number; scale?: number; flick?: number; start?: number; clock?: string; tilt?: number; bore?: (i: number) => boolean; glow?: number; thumb?: boolean; screen?: React.ReactNode}> = ({
  f, x = 760, y = 40, scale = 1, flick = 26, start = 0, clock, tilt = -4, bore, glow = 1, thumb = true, screen,
}) => {
  const w = 400, h = 820;
  const k = flick > 0 ? Math.max(0, f - start) / flick : 0;
  const idx = Math.floor(k), ph = k - idx;
  const sw = flick > 0 ? ease(Math.min(1, ph / 0.35)) : 0;
  const off = -sw * h;
  const th = flick > 0 ? interpolate(ph, [0, 0.12, 0.35, 0.6, 1], [0, 1, 1, 0, 0]) : 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h + 220, transform: `scale(${scale}) rotate(${tilt}deg)`, transformOrigin: '50% 40%'}}>
      <div style={{position: 'absolute', left: -120, top: -80, width: w + 240, height: h + 160, borderRadius: 200, background: `radial-gradient(ellipse, rgba(120,170,255,${0.22 * glow}) 0%, rgba(0,0,0,0) 65%)`}} />
      <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, borderRadius: 56, background: '#0d0f13', boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 3px #2b2f37'}} />
      <div style={{position: 'absolute', left: 14, top: 14, width: w - 28, height: h - 28, borderRadius: 44, overflow: 'hidden', background: '#000'}}>
        {screen ?? (
          <>
            <div style={{position: 'absolute', left: 0, top: off}}><FeedTile i={idx} w={w - 28} h={h - 28} f={f} bore={bore?.(idx)} /></div>
            <div style={{position: 'absolute', left: 0, top: off + h - 28}}><FeedTile i={idx + 1} w={w - 28} h={h - 28} f={f} bore={bore?.(idx + 1)} /></div>
          </>
        )}
        {clock && <div style={{position: 'absolute', left: 0, right: 0, top: 14, textAlign: 'center', fontSize: 22, fontWeight: 800, color: '#fff', textShadow: '0 1px 3px #000', fontFamily: FONT}}>{clock}</div>}
      </div>
      {thumb && (
        <svg width={260} height={300} viewBox="0 0 260 300" style={{position: 'absolute', left: w - 150, top: h - 130 - th * 120, overflow: 'visible'}}>
          <path d="M 70 300 C 60 220 50 150 70 90 C 80 60 118 58 126 92 L 140 170 C 170 160 210 170 230 210 L 250 300 Z" fill="#d9a888" />
          <path d="M 70 90 C 80 60 118 58 126 92 L 128 104 C 112 92 88 92 72 104 Z" fill="#c48f72" opacity={0.6} />
        </svg>
      )}
    </div>
  );
};

// a digital clock that jumps
export const Clock: React.FC<{text: string; x: number; y: number; size?: number; color?: string; a?: number}> = ({text, x, y, size = 90, color = '#ff6b4a', a = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, padding: '10px 26px', borderRadius: 14, background: 'rgba(8,10,14,0.85)', border: '2px solid rgba(255,255,255,0.12)', fontFamily: '"Noto Sans JP", monospace', fontWeight: 900, fontSize: size, color, opacity: a, letterSpacing: '0.04em', boxShadow: `0 0 40px ${color}44`}}>{text}</div>
);

// ---------- brain ----------
export const BRAIN_CAM = {pos: [-2.75, 0.55, 1.25] as [number, number, number], target: [0.02, -0.12, 0.0] as [number, number, number], fov: 30};
export const BRAIN_SIDE = {pos: [-3.0, 0.25, 0.15] as [number, number, number], target: [0.0, -0.1, 0.0] as [number, number, number], fov: 30};
export const R = {
  str: [[-0.14, -0.06, 0.26], [0.14, -0.06, 0.26]] as [number, number, number][],
  acc: [[-0.05, 0.22, 0.32], [0.05, 0.22, 0.32]] as [number, number, number][],
  ofc: [[-0.14, -0.22, 0.56], [0.14, -0.22, 0.56]] as [number, number, number][],
  ins: [[-0.4, -0.06, 0.16], [0.4, -0.06, 0.16]] as [number, number, number][],
  itg: [[-0.46, -0.36, -0.06], [0.46, -0.36, -0.06]] as [number, number, number][],
  phg: [[-0.22, -0.34, -0.08], [0.22, -0.34, -0.08]] as [number, number, number][],
};
export type Label = {pos: [number, number, number]; text: string; note?: string; color: string; k: number; dx?: number; dy?: number};
export const BrainShot: React.FC<{f: number; glows: ExtraGlow[]; labels?: Label[]; rot?: number; cam?: typeof BRAIN_CAM; x?: number; bg?: string; dim?: number}> = ({f, glows, labels = [], rot, cam = BRAIN_CAM, x = 0, bg = 'radial-gradient(ellipse at 45% 45%, #1b2133 0%, #07080b 75%)', dim = 0}) => {
  const r = rot ?? 0.25 - 0.35 * seg(f, 0, 420);
  return (
    <AbsoluteFill style={{background: bg}}>
      <AbsoluteFill style={{transform: `translateX(${x}px)`}}>
        <Canvas>
          <CameraRig pos={cam.pos} target={cam.target} fov={cam.fov} />
          <hemisphereLight args={['#c9d6ff', '#20263a', 0.65]} />
          <directionalLight position={[-3, 3, 2.5]} intensity={1.5} color="#fff4ea" />
          <directionalLight position={[2.5, 1.2, -3]} intensity={1.6} color="#7fa2ff" />
          <Brain3D t={f / 30} rotY={r} amyg={0} extra={glows.map((g) => ({...g, k: g.k * (1 - dim)}))} />
        </Canvas>
        <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
          {labels.map((l, i) => {
            const p = projectToScreen(l.pos, r, cam, W, H);
            const dx = l.dx ?? 260, dy = l.dy ?? -180;
            return (
              <g key={i} opacity={l.k}>
                <line x1={p[0]} y1={p[1]} x2={p[0] + dx} y2={p[1] + dy} stroke="rgba(255,255,255,0.75)" strokeWidth={3} />
                <circle cx={p[0]} cy={p[1]} r={7} fill="#fff" />
              </g>
            );
          })}
        </svg>
        {labels.map((l, i) => {
          const p = projectToScreen(l.pos, r, cam, W, H);
          const dx = l.dx ?? 260, dy = l.dy ?? -180;
          const left = dx >= 0;
          return (
            <div key={i} style={{position: 'absolute', left: left ? p[0] + dx + 12 : undefined, right: left ? undefined : W - (p[0] + dx) + 12, top: p[1] + dy - 50, opacity: l.k, fontFamily: FONT, textAlign: left ? 'left' : 'right'}}>
              <div style={{fontSize: 50, fontWeight: 900, color: l.color, textShadow: '0 2px 10px rgba(0,0,0,0.7)'}}>{l.text}</div>
              {l.note && <div style={{fontSize: 30, color: K.ink, marginTop: 4, textShadow: '0 2px 8px rgba(0,0,0,0.7)'}}>{l.note}</div>}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- charts ----------
export const Bars: React.FC<{f: number; at: number; items: {label: string; v: number; text?: string; color: string}[]; max: number; x?: number; y?: number; w?: number; h?: number; light?: boolean}> = ({f, at, items, max, x = 360, y = 230, w = 1200, h = 520, light = false}) => {
  const bw = Math.min(220, (w / items.length) * 0.6);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, fontFamily: FONT}}>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 70, height: 3, background: light ? '#9aa0aa' : 'rgba(255,255,255,0.35)'}} />
      {items.map((it, i) => {
        const g = seg(f, at + i * 10, at + i * 10 + 26);
        const bh = (h - 150) * (it.v / max) * g;
        const cx = (w / items.length) * (i + 0.5);
        return (
          <div key={i}>
            <div style={{position: 'absolute', left: cx - bw / 2, bottom: 73, width: bw, height: bh, background: it.color, borderRadius: '10px 10px 0 0', boxShadow: `0 0 30px ${it.color}55`}} />
            <div style={{position: 'absolute', left: cx - 200, width: 400, bottom: 85 + bh, textAlign: 'center', fontSize: 50, fontWeight: 900, color: light ? '#1d2230' : K.ink, opacity: g}}>{it.text ?? ''}</div>
            <div style={{position: 'absolute', left: cx - 200, width: 400, bottom: 10, textAlign: 'center', fontSize: 32, fontWeight: 800, color: light ? '#333a48' : K.sub}}>{it.label}</div>
          </div>
        );
      })}
    </div>
  );
};

// numbered step card (experiment procedure)
export const StepCard: React.FC<{f: number; at: number; n: string; text: string; x?: number; y?: number; w?: number; light?: boolean}> = ({f, at, n, text, x = 120, y = 90, w = 760, light = false}) => {
  const {fps} = useVideoConfig();
  if (f < at) return null;
  const s = spring({frame: f - at, fps, config: {damping: 16, stiffness: 120}});
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, opacity: Math.min(1, s * 1.2), transform: `translateY(${(1 - s) * 24}px)`, display: 'flex', alignItems: 'center', gap: 22, fontFamily: FONT,
      padding: '22px 30px', borderRadius: 18, background: light ? 'rgba(255,255,255,0.92)' : 'rgba(16,20,30,0.86)', border: `2px solid ${light ? '#d8d4cc' : 'rgba(255,255,255,0.12)'}`, boxShadow: '0 14px 40px rgba(0,0,0,0.35)'}}>
      <div style={{flex: '0 0 auto', padding: '6px 18px', borderRadius: 10, background: K.gold, color: '#141820', fontSize: 30, fontWeight: 900}}>{n}</div>
      <div style={{fontSize: 38, fontWeight: 800, color: light ? '#1d2230' : K.ink, lineHeight: 1.35}}>{text}</div>
    </div>
  );
};

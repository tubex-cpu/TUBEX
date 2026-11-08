import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useVideoConfig} from 'remotion';
import {CameraRig} from '../three/common';
import {Mascot, Pose} from '../three/Mascot';
import {FONT} from '../theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const fadeIn = (f: number, at: number, d = 10) => interpolate(f, [at, at + d], [0, 1], clamp);
export const K = {bg: '#0c0f16', ink: '#f2efe9', sub: '#aeb8cc', gold: '#e8c46a', red: '#e0533d', blue: '#6fa8dc', teal: '#5fc6b4', card: '#161b26', line: 'rgba(255,255,255,0.12)'};

// dark "ヒト図鑑" board with soft top light and floor ring
export const Board: React.FC<{children?: React.ReactNode; tone?: 'dark' | 'light'}> = ({children, tone = 'dark'}) => (
  <AbsoluteFill style={{fontFamily: FONT, color: tone === 'dark' ? K.ink : '#1d2230',
    background: tone === 'dark' ? 'radial-gradient(ellipse at 50% 18%, #222838 0%, #0c0f16 62%, #07080b 100%)' : 'radial-gradient(ellipse at 50% 20%, #ffffff 0%, #eeece8 60%, #dedbd5 100%)'}}>
    <AbsoluteFill style={{background: tone === 'dark' ? 'radial-gradient(ellipse at 50% 108%, rgba(232,196,106,0.10) 0%, rgba(0,0,0,0) 45%)' : 'none'}} />
    {/* diagrams live in the top 84% so they never sit under the subtitles */}
    <AbsoluteFill style={{transform: 'scale(0.84)', transformOrigin: '50% 2%'}}>{children}</AbsoluteFill>
  </AbsoluteFill>
);

// chapter / step chip at top-left
export const Chip: React.FC<{f: number; text: string; sub?: string; color?: string}> = ({f, text, sub, color = K.gold}) => {
  const a = fadeIn(f, 0, 12);
  return (
    <div style={{position: 'absolute', left: 64, top: 52, opacity: a, transform: `translateY(${(1 - a) * -10}px)`, display: 'flex', alignItems: 'center', gap: 18}}>
      <div style={{padding: '10px 22px', borderRadius: 10, background: color, color: '#141820', fontSize: 30, fontWeight: 900}}>{text}</div>
      {sub && <div style={{fontSize: 34, fontWeight: 800, color: K.ink, textShadow: '0 2px 8px rgba(0,0,0,0.6)'}}>{sub}</div>}
    </div>
  );
};

export const Pop: React.FC<{f: number; at: number; children: React.ReactNode; style?: React.CSSProperties; from?: 'up' | 'left' | 'right' | 'scale'}> = ({f, at, children, style, from = 'up'}) => {
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 16, stiffness: 120}});
  const tr = from === 'up' ? `translateY(${(1 - s) * 30}px)` : from === 'left' ? `translateX(${(1 - s) * -60}px)` : from === 'right' ? `translateX(${(1 - s) * 60}px)` : `scale(${0.7 + 0.3 * s})`;
  if (f < at) return null;
  return <div style={{...style, opacity: Math.min(1, s * 1.2), transform: `${style?.transform ?? ''} ${tr}`}}>{children}</div>;
};

// simple person icon (svg)
export const PersonIcon: React.FC<{size?: number; color?: string; star?: boolean; glow?: number; label?: string; dim?: number}> = ({size = 140, color = '#c9d3e6', star = false, glow = 0, label, dim = 0}) => (
  <div style={{width: size, textAlign: 'center', opacity: 1 - 0.6 * dim}}>
    <svg width={size} height={size * 1.15} viewBox="0 0 100 115" style={{overflow: 'visible', filter: glow > 0 ? `drop-shadow(0 0 ${18 * glow}px rgba(224,83,61,${0.9 * glow}))` : undefined}}>
      <circle cx="50" cy="30" r="18" fill={glow > 0.5 ? '#ff7a64' : color} />
      <path d="M 18 112 C 18 70 30 56 50 56 C 70 56 82 70 82 112 Z" fill={glow > 0.5 ? '#e0533d' : color} />
      {star && <path d="M 82 6 l 5 11 12 1 -9 8 3 12 -11 -6 -11 6 3 -12 -9 -8 12 -1 Z" fill={K.gold} />}
    </svg>
    {label && <div style={{fontSize: 30, fontWeight: 800, marginTop: 6}}>{label}</div>}
  </div>
);

// path arrow (same or different direction)
export const PathArrow: React.FC<{dir: 'same' | 'diff'; width?: number; color?: string}> = ({dir, width = 200, color = K.gold}) => (
  <svg width={width} height={70} viewBox="0 0 200 70">
    <path d={dir === 'same' ? 'M 10 35 L 170 35' : 'M 10 60 C 80 60 120 10 170 10'} stroke={color} strokeWidth={8} fill="none" strokeLinecap="round" />
    <path d={dir === 'same' ? 'M 160 20 L 190 35 L 160 50 Z' : 'M 162 -2 L 192 8 L 168 28 Z'} fill={color} />
  </svg>
);

// smartphone with a chat thread (2D). msgs: {from: 'me'|'them', text, at (local frame), typing?: frames shown "入力中…" before}
export type Msg = {from: 'me' | 'them'; text: string; at: number; typing?: number; name?: string; time?: string; sticker?: boolean};
export const Phone: React.FC<{f: number; msgs: Msg[]; x?: number; y?: number; scale?: number; title?: string; input?: string; caret?: boolean; inputSend?: number}> = ({f, msgs, x = 702, y = 36, scale = 0.86, title = 'トーク', input, caret, inputSend}) => {
  const visible = msgs.filter((m) => f >= m.at);
  const typingNow = msgs.find((m) => m.typing && f >= m.at - m.typing && f < m.at);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 600, height: 960, transform: `scale(${scale})`, transformOrigin: 'top left', fontFamily: FONT}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 64, background: '#111318', boxShadow: '0 30px 80px rgba(0,0,0,0.55), inset 0 0 0 3px #2a2e36'}} />
      <div style={{position: 'absolute', left: 22, top: 22, right: 22, bottom: 22, borderRadius: 46, overflow: 'hidden', background: '#e9e4dc'}}>
        <div style={{height: 110, background: '#f7f4ef', borderBottom: '1px solid #ddd6cc', display: 'flex', alignItems: 'flex-end', padding: '0 30px 18px', fontSize: 30, fontWeight: 800, color: '#2a2a2a'}}>{title}</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 120, bottom: input !== undefined ? 110 : 20, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 22px', gap: 16}}>
          {visible.map((m, i) => {
            const a = interpolate(f, [m.at, m.at + 6], [0, 1], clamp);
            const me = m.from === 'me';
            return (
              <div key={i} style={{alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: '82%', opacity: a, transform: `translateY(${(1 - a) * 12}px)`}}>
                {m.name && !me && <div style={{fontSize: 20, color: '#7a746c', marginBottom: 4, marginLeft: 6}}>{m.name}</div>}
                <div style={{display: 'flex', alignItems: 'flex-end', gap: 8, flexDirection: me ? 'row-reverse' : 'row'}}>
                  {m.sticker ? <div style={{fontSize: 96}}>{m.text}</div> : (
                    <div style={{padding: '16px 22px', borderRadius: 26, background: me ? '#9be38a' : '#ffffff', color: '#1d1d1d', fontSize: 30, lineHeight: 1.45, fontWeight: 600, boxShadow: '0 2px 4px rgba(0,0,0,0.08)'}}>{m.text}</div>
                  )}
                  {m.time && <div style={{fontSize: 18, color: '#8a847b', whiteSpace: 'nowrap'}}>{m.time}</div>}
                </div>
              </div>
            );
          })}
          {typingNow && (
            <div style={{alignSelf: 'flex-start', padding: '14px 22px', borderRadius: 26, background: '#ffffff', fontSize: 26, color: '#8a847b'}}>
              入力中{'.'.repeat(1 + (Math.floor(f / 8) % 3))}
            </div>
          )}
        </div>
        {input !== undefined && (
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 100, background: '#f7f4ef', borderTop: '1px solid #ddd6cc', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14}}>
            <div style={{flex: 1, minHeight: 60, borderRadius: 30, background: '#ffffff', border: '2px solid #ddd6cc', padding: '10px 20px', fontSize: 26, color: '#1d1d1d', lineHeight: 1.4}}>
              {input}{caret && Math.floor(f / 12) % 2 === 0 ? '｜' : ''}
            </div>
            <div style={{width: 60, height: 60, borderRadius: 30, background: inputSend !== undefined && f >= inputSend ? '#4caf50' : '#bdb6ab', color: '#fff', fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>➤</div>
          </div>
        )}
      </div>
    </div>
  );
};

// background still (pre-rendered CG) with a slow push-in
export const BgStill: React.FC<{src: string; f: number; dur: number; blur?: number; dark?: number}> = ({src, f, dur, blur = 0, dark = 0.35}) => {
  const s = interpolate(f, [0, dur], [1.04, 1.12], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `scale(${s})`, filter: blur ? `blur(${blur}px)` : undefined}}>
        <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: `rgba(6,8,12,${dark})`}} />
    </AbsoluteFill>
  );
};

// the observer, rendered in a small transparent 3D canvas (cheap compared with a full 3D scene)
export const MascotOverlay: React.FC<{f: number; x: number; y: number; w?: number; h?: number; pose?: Pose; rotY?: number; mark?: '?' | '!' | ''; tone?: 'dark' | 'light'}> = ({f, x, y, w = 420, h = 460, pose = {}, rotY = -0.35, mark = '', tone = 'dark'}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
    <ThreeCanvas width={w} height={h} gl={{toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0, antialias: true, alpha: true, preserveDrawingBuffer: true}} style={{position: 'absolute', inset: 0}}>
      <CameraRig pos={[0, 0.95, 4.6]} target={[0, 0.72, 0]} fov={27} />
      <hemisphereLight args={tone === 'dark' ? ['#c8d4ff', '#202030', 0.6] : ['#ffffff', '#cfcac2', 1.0]} />
      <directionalLight position={[-2, 4, 3]} intensity={1.8} />
      <directionalLight position={[3, 1.5, -2.5]} intensity={tone === 'dark' ? 2.2 : 1.0} color="#ffd2a8" />
      <Mascot rotationY={rotY + 0.03 * Math.sin(f / 40)} pose={{bob: 0.004 * Math.sin(f / 12), ...pose}} castShadow={false} />
    </ThreeCanvas>
    {mark && <div style={{position: 'absolute', left: w / 2 - 30, top: -10, fontSize: 80, fontWeight: 900, color: tone === 'dark' ? '#ffffff' : '#1d2230', fontFamily: FONT}}>{mark === '?' ? '？' : '！'}</div>}
  </div>
);

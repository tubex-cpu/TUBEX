import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {C, FONT, TAG} from '../theme';

export type SceneProps = {f: number; dur: number; T: (id: string, k?: number) => number; E: (id: string) => number};
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = (x: number) => Easing.inOut(Easing.cubic)(Math.max(0, Math.min(1, x)));
export const easeOut = (x: number) => Easing.out(Easing.cubic)(Math.max(0, Math.min(1, x)));
export const appear = (f: number, at: number, d = 10) => easeOut((f - at) / d);
// a seal coming down: big and transparent -> slam -> settle
export const slam = (f: number, at: number) => {
  const d = f - at;
  const s = interpolate(d, [0, 6, 9, 13], [2.4, 0.92, 1.04, 1], clamp);
  const o = interpolate(d, [0, 4], [0, 1], clamp);
  const shake = d > 5 && d < 14 ? Math.sin(d * 2.4) * (14 - d) * 0.9 : 0;
  return {s, o, shake};
};

// navy room with a soft light from above; everything is kept above the subtitle band (y < 880)
export const Room: React.FC<{children?: React.ReactNode; light?: number; warm?: number}> = ({children, light = 1, warm = 0}) => (
  <AbsoluteFill style={{fontFamily: FONT, color: C.white, background: C.navy}}>
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, rgba(60,96,150,${0.55 * light}) 0%, rgba(15,27,45,0) 62%)`}} />
    {warm > 0 && <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(242,193,78,${0.22 * warm}) 0%, rgba(229,57,53,${0.10 * warm}) 40%, rgba(15,27,45,0) 75%)`}} />}
    <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)', backgroundSize: '64px 64px'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)'}} />
    {children}
  </AbsoluteFill>
);

// the red seal with a white 改 (the channel icon)
export const Seal: React.FC<{size: number; char?: string; rough?: boolean}> = ({size, char = '改', rough = true}) => (
  <div style={{width: size, height: size, background: C.red, borderRadius: size * 0.08, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.45)', position: 'relative',
    WebkitMaskImage: rough ? 'radial-gradient(circle at 30% 70%, rgba(0,0,0,0.82) 0 2%, black 2.5%), radial-gradient(circle at 80% 20%, rgba(0,0,0,0.85) 0 1.5%, black 2%)' : undefined}}>
    <div style={{position: 'absolute', inset: size * 0.06, border: `${size * 0.035}px solid rgba(255,255,255,0.92)`, borderRadius: size * 0.05}} />
    <span style={{fontFamily: FONT, fontWeight: 900, fontSize: size * 0.66, color: C.white, lineHeight: 1}}>{char}</span>
  </div>
);

// a person drawn with flat shapes. role decides the marker
export type Role = 'doctor' | 'clerk' | 'builder' | 'manager' | 'you' | 'plain' | 'guard' | 'care' | 'young' | 'senior';
export const Person: React.FC<{role: Role; h?: number; dim?: number; ghost?: boolean}> = ({role, h = 300, dim = 0, ghost = false}) => {
  const w = h * 0.5;
  const body = role === 'doctor' ? '#e9eef5' : role === 'clerk' ? '#3aa17e' : role === 'builder' ? '#5a6b82' : role === 'manager' ? '#2b3a55' : role === 'guard' ? '#28406b' : role === 'care' ? '#6fb3c9' : role === 'young' ? '#c46b8f' : role === 'senior' ? '#7c6a58' : role === 'you' ? C.gold : '#7d8aa0';
  const skin = '#d9b99a';
  const st = ghost ? {fill: 'none', stroke: 'rgba(255,255,255,0.55)', strokeWidth: 3, strokeDasharray: '10 8'} : null;
  return (
    <svg width={w} height={h} viewBox="0 0 100 200" style={{opacity: 1 - dim, overflow: 'visible'}}>
      <circle cx="50" cy="38" r="24" {...(st ?? {fill: skin})} />
      <path d="M12 196 Q10 92 50 84 Q90 92 88 196 Z" {...(st ?? {fill: body})} />
      {!ghost && role === 'doctor' && <><path d="M40 86 L50 120 L60 86" fill="#9fb7d6" /><path d="M34 96 Q32 140 46 146" stroke="#2c3e5c" strokeWidth="4" fill="none" /><circle cx="47" cy="148" r="5" fill="#2c3e5c" /></>}
      {!ghost && role === 'clerk' && <rect x="28" y="112" width="44" height="60" rx="6" fill="#f2f2f2" />}
      {!ghost && role === 'builder' && <><path d="M24 30 Q26 8 50 8 Q74 8 76 30 L80 34 L20 34 Z" fill={C.gold} /><rect x="22" y="120" width="56" height="10" fill="#f6c343" /></>}
      {!ghost && role === 'manager' && <path d="M46 86 L54 86 L58 140 L50 150 L42 140 Z" fill={C.red} />}
      {!ghost && role === 'guard' && <><path d="M26 28 Q28 10 50 10 Q72 10 74 28 L84 30 L16 30 Z" fill="#1b2a47" /><rect x="40" y="96" width="20" height="10" fill={C.gold} /></>}
      {!ghost && role === 'care' && <path d="M38 104 h24 v8 h-8 v8 h-8 v-8 h-8 z" fill="#ffffff" />}
      {!ghost && role === 'senior' && <path d="M28 28 Q50 4 72 28" stroke="#d8d8d8" strokeWidth="8" fill="none" />}
      {!ghost && role === 'you' && <circle cx="50" cy="38" r="29" fill="none" stroke={C.white} strokeWidth="4" />}
    </svg>
  );
};

// pay envelope (給料袋)
export const Envelope: React.FC<{w?: number; label?: string; color?: string}> = ({w = 120, label, color = C.gold}) => (
  <div style={{width: w, height: w * 0.66, background: color, borderRadius: 8, position: 'relative', boxShadow: '0 8px 20px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: '42%', background: 'rgba(0,0,0,0.10)', clipPath: 'polygon(0 0, 100% 0, 50% 100%)'}} />
    {label && <span style={{fontFamily: FONT, fontWeight: 900, fontSize: w * 0.2, color: C.navy, marginTop: w * 0.12}}>{label}</span>}
  </div>
);

export const Chip: React.FC<{k: string; size?: number}> = ({k, size = 30}) => {
  const t = TAG[k] ?? TAG['推論'];
  return <span style={{display: 'inline-block', background: t.bg, color: t.fg, fontFamily: FONT, fontWeight: 900, fontSize: size, padding: `${size * 0.18}px ${size * 0.55}px`, borderRadius: size * 0.3, marginRight: size * 0.3, letterSpacing: '0.06em', whiteSpace: 'nowrap', flexShrink: 0}}>{k}</span>;
};

export const Big: React.FC<{children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties}> = ({children, size = 90, color = C.white, style}) => (
  <div style={{fontFamily: FONT, fontWeight: 900, fontSize: size, color, lineHeight: 1.15, textShadow: '0 6px 24px rgba(0,0,0,0.5)', WebkitTextStroke: `${Math.round(size * 0.02)}px rgba(15,27,45,0.9)`, paintOrder: 'stroke fill', ...style}}>{children}</div>
);

// wait for the Japanese web font (all glyphs used on canvas textures) before drawing anything
import {continueRender, delayRender} from 'remotion';
import {useEffect, useState} from 'react';
export const useFont = (text: string) => {
  const [ready, setReady] = useState(false);
  const [h] = useState(() => delayRender('font'));
  useEffect(() => {
    Promise.all([document.fonts.load(`900 100px "Noto Sans JP"`, text)]).then(() => document.fonts.ready).then(() => { setReady(true); continueRender(h); });
  }, []);
  return ready;
};

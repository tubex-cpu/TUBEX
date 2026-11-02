import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import timings from '../../data/timings.json';
import {C, FONT} from '../theme';

export const Subtitles: React.FC<{data?: {start: number; end: number; sub: string}[]; plate?: boolean}> = ({data, plate = false}) => {
  const timingsData = data ?? timings;
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const cur = timingsData.find((x, i) => {
    const next = timingsData[i + 1];
    const end = Math.min(x.end + 0.35, next ? next.start - 0.05 : 1e9);
    return t >= x.start - 0.08 && t < end;
  });
  if (!cur) return null;
  const a = interpolate(t, [cur.start - 0.08, cur.start + 0.06], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 52, pointerEvents: 'none'}}>
      <div style={{
        opacity: a, fontFamily: FONT, fontWeight: 700, fontSize: 46, lineHeight: 1.42, color: '#fff', textAlign: 'center',
        maxWidth: 1560, whiteSpace: 'pre-line', letterSpacing: '0.02em',
        textShadow: '0 0 2px #000, 0 0 2px #000, 0 2px 4px rgba(0,0,0,0.9), 0 0 18px rgba(0,0,0,0.55)',
        WebkitTextStroke: '1.5px rgba(0,0,0,0.85)', paintOrder: 'stroke fill',
        background: plate ? 'rgba(12,16,26,0.62)' : 'transparent', padding: plate ? '10px 28px' : 0, borderRadius: plate ? 12 : 0,
      }}>{cur.sub}</div>
    </AbsoluteFill>
  );
};

// Small tag that tells what kind of picture this is (re-enactment / schematic / study figure).
export const Tag: React.FC<{text: string; sub?: string; delay?: number}> = ({text, sub, delay = 0}) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame - delay, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 56, top: 48, opacity: a, display: 'flex', gap: 14, alignItems: 'center', fontFamily: FONT}}>
      <div style={{padding: '8px 16px', borderRadius: 8, background: 'rgba(10,14,26,0.72)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontSize: 26, fontWeight: 700}}>{text}</div>
      {sub && <div style={{color: 'rgba(255,255,255,0.88)', fontSize: 23, textShadow: '0 1px 3px #000'}}>{sub}</div>}
    </div>
  );
};

// The observer's log: typed text, no voice. Struck-through lines show a revised prediction.
export type LogLine = {text: string; at: number; strike?: number; color?: string};
export const ObsLog: React.FC<{lines: LogLine[]; x?: number; y?: number; width?: number; title?: string}> = ({lines, x = 64, y = 60, width = 760, title = '観察ログ'}) => {
  const frame = useCurrentFrame();
  const first = Math.min(...lines.map((l) => l.at));
  const a = interpolate(frame - first, [-6, 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: x, top: y, width, opacity: a, fontFamily: FONT, padding: '22px 28px', borderRadius: 14,
      background: 'rgba(12,14,20,0.78)', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 12px 40px rgba(0,0,0,0.45)'}}>
      <div style={{fontSize: 22, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.6)', marginBottom: 10}}>{title}</div>
      {lines.map((l, i) => {
        const n = Math.max(0, Math.floor((frame - l.at) * 1.1));
        if (frame < l.at) return null;
        const shown = l.text.slice(0, n);
        const strike = l.strike !== undefined ? interpolate(frame - l.strike, [0, 10], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
        const cursor = n < l.text.length && Math.floor(frame / 8) % 2 === 0;
        return (
          <div key={i} style={{position: 'relative', fontSize: 36, lineHeight: 1.5, color: strike > 0 ? 'rgba(255,255,255,0.45)' : l.color ?? '#f3f5f9', fontWeight: 700}}>
            {shown}{cursor ? '▍' : ''}
            {strike > 0 && <div style={{position: 'absolute', left: 0, top: '52%', height: 3, width: `${strike}%`, background: C.warn}} />}
          </div>
        );
      })}
    </div>
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)', pointerEvents: 'none'}} />
);

export const Fade: React.FC<{dur: number; inF?: number; outF?: number; color?: string}> = ({dur, inF = 6, outF = 6, color = '#000'}) => {
  const frame = useCurrentFrame();
  const o = Math.max(
    inF ? interpolate(frame, [0, inF], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0,
    outF ? interpolate(frame, [dur - outF, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0,
  );
  return <AbsoluteFill style={{background: color, opacity: o, pointerEvents: 'none'}} />;
};

// speech caption for the friend's line (the friend has no voice; text only)
export const Bubble: React.FC<{text: string; at: number; out: number; x: number; y: number; tail?: 'left' | 'right'; tone?: 'warm' | 'cold'}> = ({text, at, out, x, y, tail = 'left', tone = 'warm'}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > out) return null;
  const a = interpolate(frame, [at, at + 5, out - 5, out], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sc = interpolate(frame, [at, at + 6], [0.85, 1], {extrapolateRight: 'clamp'});
  const bg = tone === 'warm' ? 'rgba(255,250,242,0.95)' : 'rgba(225,230,240,0.92)';
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: a, transform: `scale(${sc})`, transformOrigin: tail === 'left' ? '0% 100%' : '100% 100%', fontFamily: FONT}}>
      <div style={{padding: '18px 30px', borderRadius: 28, background: bg, color: '#2a2420', fontSize: 46, fontWeight: 800, boxShadow: '0 10px 30px rgba(0,0,0,0.35)', whiteSpace: 'nowrap'}}>{text}</div>
      <div style={{position: 'absolute', bottom: -16, [tail]: 34, width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: `18px solid ${bg}`}} />
    </div>
  );
};

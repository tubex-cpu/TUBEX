import {AbsoluteFill, interpolate} from 'remotion';
import {AMYG, VSTR} from '../three/Brain3D';
import {FONT} from '../theme';
import {Vignette} from '../ui/Overlay';
import {BrainShot, DarkBoard, R, SceneProps, StepCard, Still, WhiteStudio, seg} from './kit';
import {K, MascotOverlay, PersonIcon, Phone, Pop, clamp} from './ui';

// ep006 八つの枢要罪. No real faces, no portraits of the monks or popes, no feed-scrolling phones, no labels such as 再現/注記.
// On-screen text carries no 、。 (owner 2026-11-04).
export const LT = (T: SceneProps['T'], id: string, k: number, c = 0) => T(`${id}_${k}`, c);
export const TXT = (s: React.CSSProperties = {}): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontWeight: 900, textShadow: '0 4px 22px rgba(0,0,0,0.85)', ...s});
export const NAMES: [string, string][] = [['暴食', 'ぼうしょく'], ['色欲', 'しきよく'], ['強欲', 'ごうよく'], ['憂鬱', 'ゆううつ'], ['憤怒', 'ふんぬ'], ['怠惰', 'たいだ'], ['虚飾', 'きょしょく'], ['傲慢', 'ごうまん']];
export const KAN = ['一', '二', '三', '四', '五', '六', '七', '八'];
export const SKIN = '#d9a888';
export const INK = '#5a3a1c';

export const Card: React.FC<{f: number; at: number; text: React.ReactNode; x?: number; y?: number; w?: number; color?: string; size?: number; light?: boolean}> = ({f, at, text, x = 0, y = 0, w = 800, color, size = 44, light = false}) => (
  <Pop f={f} at={at} style={{position: 'absolute', left: x, top: y, width: w, padding: '24px 34px', borderRadius: 18, background: light ? 'rgba(255,255,255,0.94)' : 'rgba(16,20,30,0.88)', border: `2px solid ${color ?? (light ? '#d8d4cc' : 'rgba(255,255,255,0.14)')}`, boxShadow: '0 14px 40px rgba(0,0,0,0.3)', fontFamily: FONT, fontSize: size, fontWeight: 900, color: color ?? (light ? '#1d2230' : K.ink), lineHeight: 1.35}}>{text}</Pop>
);
export const Big: React.FC<{f: number; at: number; text: React.ReactNode; y: number; size?: number; color?: string; light?: boolean}> = ({f, at, text, y, size = 80, color = K.ink, light = false}) => (
  <Pop f={f} at={at} from="scale" style={TXT({top: y, fontSize: size, color, textShadow: light ? '0 4px 24px rgba(255,255,255,0.9)' : '0 4px 22px rgba(0,0,0,0.85)'})}>{text}</Pop>
);

// ---------- the old paper card ----------
export const SinCard: React.FC<{n: number; p: number; w?: number; glow?: number; dim?: number; front?: React.ReactNode; crumble?: number; showName?: boolean}> = ({n, p, w = 190, glow = 0, dim = 0, front, crumble = 0, showName = true}) => {
  const h = w * 1.48;
  const ang = (1 - p) * Math.PI;
  const sx = Math.max(0.02, Math.abs(Math.cos(ang)));
  const faceUp = p >= 0.5;
  const [nm, kana] = NAMES[n];
  return (
    <div style={{width: w, height: h, position: 'relative', transform: `scaleX(${sx})`, opacity: 1 - crumble, filter: `brightness(${1 + 0.25 * glow - 0.5 * dim}) blur(${crumble * 6}px)`}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: w * 0.06, overflow: 'hidden',
        background: faceUp ? 'radial-gradient(ellipse at 40% 30%, #f1e6cc 0%, #dcc79c 70%, #c3a978 100%)' : 'radial-gradient(ellipse at 50% 40%, #5a3d26 0%, #3a2616 80%)',
        boxShadow: glow > 0 ? `0 0 ${60 * glow}px rgba(255,214,120,${0.9 * glow}), 0 14px 34px rgba(0,0,0,0.4)` : '0 14px 34px rgba(0,0,0,0.4)'}}>
        <div style={{position: 'absolute', inset: w * 0.05, borderRadius: w * 0.03, border: `${Math.max(2, w * 0.012)}px solid ${faceUp ? 'rgba(90,58,28,0.55)' : 'rgba(232,196,106,0.55)'}`}} />
        {!faceUp && <div style={{position: 'absolute', left: 0, right: 0, top: h * 0.36, textAlign: 'center', fontSize: w * 0.34, color: 'rgba(232,196,106,0.75)', fontFamily: FONT}}>✦</div>}
        {faceUp && (front ?? (showName ? (
          <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: INK}}>
            <div style={{fontSize: w * 0.12, fontWeight: 900, opacity: 0.7}}>{KAN[n]}</div>
            <div style={{fontSize: w * 0.3, fontWeight: 900, letterSpacing: '0.04em', marginTop: w * 0.04}}>{nm}</div>
            <div style={{fontSize: w * 0.085, fontWeight: 800, opacity: 0.75, marginTop: w * 0.03}}>{kana}</div>
          </div>
        ) : null))}
        {faceUp && <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(80,50,20,0.25) 100%)'}} />}
      </div>
      {crumble > 0 && Array.from({length: 26}, (_, i) => (
        <div key={i} style={{position: 'absolute', left: ((i * 37) % 100) / 100 * w, top: h * 0.2 + ((i * 53) % 80) / 100 * h + crumble * 160 * (0.5 + (i % 5) / 5), width: 6, height: 6, borderRadius: 3, background: '#c3a978', opacity: 1 - crumble}} />
      ))}
    </div>
  );
};

// a row of the eight cards on the white table. state(i) -> {p, glow, dim, crumble, lift}
export type CS = {p?: number; glow?: number; dim?: number; crumble?: number; lift?: number; hide?: boolean};
export const CardRow: React.FC<{state: (i: number) => CS; y?: number; w?: number; gap?: number; shift?: number; mascot?: {f: number; x: number; y: number; rotY?: number} | null}> = ({state, y = 250, w = 180, gap = 32, shift = 0, mascot}) => {
  const total = 8 * w + 7 * gap;
  const x0 = (1920 - total) / 2 + shift;
  return (
    <WhiteStudio>
      <div style={{position: 'absolute', left: x0 - 60, width: total + 120, top: y + w * 1.48 - 40, height: 70, borderRadius: 12, background: 'linear-gradient(180deg, #cfc9bf, #b8b2a7)', boxShadow: '0 20px 40px rgba(0,0,0,0.15)'}} />
      <div style={{position: 'absolute', left: x0, top: y, display: 'flex', gap}}>
        {Array.from({length: 8}, (_, i) => {
          const s = state(i);
          return <div key={i} style={{transform: `translateY(${-(s.lift ?? 0)}px)`, visibility: s.hide ? 'hidden' : 'visible'}}><SinCard n={i} p={s.p ?? 0} w={w} glow={s.glow} dim={s.dim} crumble={s.crumble} /></div>;
        })}
      </div>
      {mascot && <MascotOverlay f={mascot.f} x={mascot.x} y={mascot.y} w={360} h={420} rotY={mascot.rotY ?? -0.6} tone="light" />}
    </WhiteStudio>
  );
};

// chapter opener: the white room, card n turns over (chapters 3-10)
export const FlipRoom: React.FC<{f: number; n: number; extra?: React.ReactNode}> = ({f, n, extra}) => {
  const p = seg(f, 6, 26);
  const zoom = interpolate(f, [0, 70], [1, 1.12], clamp);
  return (
    <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: `${(1920 - 8 * 180 - 7 * 32) / 2 / 19.2 + (n * 212 + 90) / 19.2}% 40%`}}>
      <CardRow state={(i) => (i < n ? {p: 1, dim: 0.35} : i === n ? {p, glow: p, lift: 30 * p} : {p: 0})} />
      {extra}
    </AbsoluteFill>
  );
};

// ---------- hands (no faces anywhere) ----------
export const Hand: React.FC<{x: number; y: number; rot?: number; scale?: number; point?: boolean; sleeve?: string}> = ({x, y, rot = 0, scale = 1, point = false, sleeve = '#3a4256'}) => (
  <svg width={300} height={420} viewBox="0 0 300 420" style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg) scale(${scale})`, transformOrigin: '50% 100%', overflow: 'visible'}}>
    <rect x={92} y={250} width={120} height={200} rx={30} fill={sleeve} />
    <path d="M 95 260 C 80 200 82 150 100 120 L 112 60 C 116 40 140 40 140 62 L 142 110 L 150 40 C 154 18 182 20 180 44 L 176 112 L 192 60 C 198 40 224 46 218 70 L 206 130 C 222 110 246 118 238 142 C 226 182 214 220 205 262 Z" fill={SKIN} />
    {point && <path d="M 150 40 L 150 -40 C 152 -60 178 -58 178 -40 L 176 44 Z" fill={SKIN} />}
    <path d="M 100 120 C 120 140 170 140 205 130" stroke="rgba(150,100,70,0.35)" strokeWidth={4} fill="none" />
  </svg>
);

// ---------- night kitchen (fridge light) ----------
export const Kitchen: React.FC<{f: number; reach?: number; stop?: boolean}> = ({f, reach = 1, stop = false}) => {
  const r = stop ? Math.min(reach, 0.75) : reach;
  return (
    <AbsoluteFill style={{background: '#06070a'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 22% 45%, rgba(210,230,255,0.42) 0%, rgba(120,150,190,0.12) 35%, rgba(0,0,0,0) 62%)'}} />
      <div style={{position: 'absolute', left: 120, top: 80, width: 520, height: 820, background: 'linear-gradient(90deg, #cfe0f2, #9fb6cf)', boxShadow: '0 0 140px 30px rgba(200,225,255,0.35)'}}>
        {[0, 1, 2, 3].map((k) => <div key={k} style={{position: 'absolute', left: 20, right: 20, top: 120 + k * 170, height: 8, background: 'rgba(255,255,255,0.7)'}} />)}
        <div style={{position: 'absolute', left: 60, top: 150, width: 90, height: 120, borderRadius: 10, background: '#e9eef3'}} />
        <div style={{position: 'absolute', left: 300, top: 320, width: 120, height: 130, borderRadius: 60, background: '#f3d9a8'}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 760, height: 320, background: 'linear-gradient(180deg, #2a2620, #120f0c)'}} />
      {/* snack bag on the counter */}
      <div style={{position: 'absolute', left: 1080, top: 560, width: 260, height: 300, borderRadius: '30px 30px 16px 16px', background: 'linear-gradient(160deg, #e8783c, #b8442a)', transform: 'rotate(-8deg)', boxShadow: '0 0 60px rgba(200,225,255,0.18)'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 34, background: 'repeating-linear-gradient(90deg, #f0a070 0 10px, #c85a34 10px 20px)', borderRadius: '30px 30px 0 0'}} />
        <div style={{position: 'absolute', left: 50, top: 110, width: 160, height: 90, borderRadius: 45, background: 'rgba(255,230,160,0.85)'}} />
      </div>
      <Hand x={1460 - 320 * r} y={640 - 120 * r} rot={-50 + 10 * Math.sin(f / 30)} scale={1.1} />
      <Vignette />
    </AbsoluteFill>
  );
};

// ---------- desert at dusk, stone huts ----------
export const Desert: React.FC<{f: number; dusk?: number}> = ({f, dusk = 1}) => (
  <AbsoluteFill style={{background: `linear-gradient(180deg, #2b2a4a 0%, #8a5a5a ${30 + 10 * dusk}%, #e09a5a 58%, #c98a50 60%, #9a6a3c 100%)`}}>
    <div style={{position: 'absolute', left: 1280, top: 300 + f * 0.05, width: 170, height: 170, borderRadius: 85, background: 'radial-gradient(circle, #ffd28a 0%, #ff9a50 60%, rgba(255,140,60,0) 72%)'}} />
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <path d="M 0 640 L 220 420 L 360 470 L 520 330 L 700 520 L 820 600 L 0 700 Z" fill="#6a4a3a" />
      <path d="M 0 660 L 260 470 L 400 520 L 560 380 L 760 600 L 0 720 Z" fill="#5a3c2e" opacity={0.8} />
      <path d="M 0 700 C 400 640 800 690 1200 650 C 1500 620 1750 660 1920 640 L 1920 1080 L 0 1080 Z" fill="#b07a46" />
      <path d="M 0 820 C 500 760 1000 840 1920 780 L 1920 1080 L 0 1080 Z" fill="#9a6838" />
    </svg>
    {[[300, 610, 1], [520, 640, 0.8], [760, 600, 0.7], [1000, 660, 1.1], [1240, 630, 0.75], [1500, 650, 0.9]].map(([x, y, s], i) => (
      <div key={i} style={{position: 'absolute', left: x, top: y, width: 120 * s, height: 80 * s, background: 'linear-gradient(180deg, #8a6a50, #5a4232)', borderRadius: `${30 * s}px ${30 * s}px 4px 4px`, boxShadow: '0 8px 16px rgba(0,0,0,0.3)'}}>
        <div style={{position: 'absolute', left: '40%', top: '45%', width: '22%', height: '55%', background: i === 3 ? `rgba(255,190,90,${0.7 + 0.2 * Math.sin(f / 7)})` : '#2a1c12', borderRadius: '6px 6px 0 0'}} />
      </div>
    ))}
    <div style={{position: 'absolute', left: 1640, top: 690, width: 14, height: 46, borderRadius: 7, background: '#2a1c12', filter: 'blur(1px)'}} />
    <div style={{position: 'absolute', left: 1636, top: 676, width: 22, height: 22, borderRadius: 11, background: '#2a1c12', filter: 'blur(1px)'}} />
    <Vignette />
  </AbsoluteFill>
);

// parchment with handwritten strokes (abstract, not a real text)
export const Parchment: React.FC<{f: number; lines?: number; scroll?: number; x?: number; y?: number; w?: number; h?: number; words?: string[]; wordsAt?: number; wordSize?: number}> = ({f, lines = 9, scroll = 0, x = 460, y = 60, w = 1000, h = 760, words, wordsAt = 0, wordSize}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, overflow: 'hidden', borderRadius: 10, background: 'radial-gradient(ellipse at 45% 40%, #efe0bc 0%, #d8c08c 70%, #b89a64 100%)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)'}}>
    <svg width={w} height={h * 3} style={{position: 'absolute', left: 0, top: -scroll}}>
      {Array.from({length: words ? 0 : lines * 3}, (_, i) => {
        const yy = 70 + i * 74;
        const len = (0.55 + 0.4 * ((i * 37) % 10) / 10) * (w - 140);
        const shown = i < lines ? seg(f, i * 14, i * 14 + 40) : 1;
        let d = `M 70 ${yy}`;
        for (let k = 0; k < 40; k++) d += ` q 6 ${-14 + ((k * 7 + i) % 9) * 2} 12 0 t ${(len / 40) - 12} ${((k + i) % 3) - 1}`;
        return <path key={i} d={d} stroke={INK} strokeWidth={4} fill="none" opacity={0.75} strokeDasharray={len * 3} strokeDashoffset={len * 3 * (1 - shown)} />;
      })}
    </svg>
    {words && (
      <div style={{position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', alignContent: 'center', gap: '18px 40px', padding: 50, fontFamily: FONT, color: INK}}>
        {words.map((t, i) => <div key={i} style={{fontSize: wordSize ?? w * 0.075, whiteSpace: 'nowrap', fontWeight: 900, opacity: interpolate(f - wordsAt - i * 8, [0, 10], [0, 1], clamp), textAlign: 'center'}}>{t}</div>)}
      </div>
    )}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(70,40,10,0.35) 100%)'}} />
  </div>
);

export const Candle: React.FC<{f: number; x: number; y: number}> = ({f, x, y}) => (
  <div style={{position: 'absolute', left: x, top: y}}>
    <div style={{position: 'absolute', left: -200, top: -220, width: 440, height: 440, borderRadius: 220, background: 'radial-gradient(circle, rgba(255,190,90,0.35) 0%, rgba(255,160,60,0) 65%)'}} />
    <div style={{position: 'absolute', left: 6, top: -36 + Math.sin(f / 3) * 2, width: 26, height: 46, borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%', background: 'radial-gradient(ellipse at 50% 70%, #fff6c8 0%, #ffb648 60%, rgba(255,120,40,0) 100%)', transform: `scaleX(${1 + 0.08 * Math.sin(f / 2)})`}} />
    <div style={{position: 'absolute', left: 0, top: 10, width: 38, height: 120, borderRadius: 6, background: 'linear-gradient(90deg, #efe3c8, #c9b892)'}} />
  </div>
);

// ---------- MRI-room monitor ----------
export const MriMonitor: React.FC<{f: number; children: React.ReactNode; x?: number; y?: number; w?: number; h?: number}> = ({children, x = 980, y = 90, w = 820, h = 520}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 18, border: '18px solid #20242c', background: '#0b0e14', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.6)'}}>{children}</div>
);
// the brain shots are drawn smaller so the brain never sits under the subtitles
export const BrainBox: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 45% 45%, #1b2133 0%, #07080b 75%)'}}>
    <AbsoluteFill style={{transform: 'scale(0.84)', transformOrigin: '50% 0%'}}>{children}</AbsoluteFill>
  </AbsoluteFill>
);
export const MriBg: React.FC<{f: number; dur: number}> = ({f, dur}) => <Still src="mri" f={f} dur={dur} dark={0.55} />;

// =============== 0. オープニング ===============
const S00: React.FC<SceneProps> = ({f, dur}) => (
  <AbsoluteFill style={{transform: `scale(${interpolate(f, [0, dur], [1.0, 1.08], clamp)})`}}>
    <Kitchen f={f} reach={seg(f, 20, dur - 10)} />
  </AbsoluteFill>
);

const Pane: React.FC<{children: React.ReactNode; bg?: string}> = ({children, bg = 'radial-gradient(ellipse at 50% 30%, #2a2f3c 0%, #0c0f16 70%)'}) => <AbsoluteFill style={{background: bg, fontFamily: FONT}}>{children}<Vignette /></AbsoluteFill>;
const S01: React.FC<SceneProps> = ({f, T, dur}) => {
  const cuts = [0, 1, 2, 3, 4, 5, 6, 7].map((k) => (k === 0 ? 0 : LT(T, 's01', k) - 8));
  let k = 0;
  for (let i = 0; i < cuts.length; i++) if (f >= cuts[i]) k = i;
  const lf = f - cuts[k];
  const body = (() => {
    switch (k) {
      case 0: return ( // convenience-store shelf, the feet stop
        <Pane bg="linear-gradient(180deg, #e9eef2 0%, #c8d2da 60%, #8a949c 100%)">
          {[0, 1, 2].map((r) => <div key={r} style={{position: 'absolute', left: 160, right: 160, top: 90 + r * 180, height: 150, background: '#f7f9fa', borderBottom: '14px solid #b8c0c8', display: 'flex', gap: 30, padding: '20px 40px'}}>{Array.from({length: 9}, (_, i) => <div key={i} style={{width: 120, height: 110, borderRadius: 10, background: `hsl(${(i * 47 + r * 90) % 360},65%,58%)`}} />)}</div>)}
          {[0, 1].map((i) => <div key={i} style={{position: 'absolute', left: 820 + i * 170, top: 760 - Math.max(0, 40 - lf) * 3 * (i ? 1 : 0.5), width: 130, height: 220, borderRadius: '60px 60px 20px 20px', background: '#2a2f3a'}} />)}
        </Pane>
      );
      case 1: return ( // the "buy" button, the finger stops
        <Pane>
          <div style={{position: 'absolute', left: 560, top: 70, width: 800, height: 640, borderRadius: 20, background: '#f4f5f7', padding: 40, boxShadow: '0 30px 80px rgba(0,0,0,0.5)'}}>
            <div style={{height: 300, borderRadius: 14, background: 'linear-gradient(135deg, #8aa0c8, #556a94)'}} />
            <div style={{marginTop: 30, height: 30, width: 420, borderRadius: 8, background: '#d0d4dc'}} />
            <div style={{marginTop: 18, height: 30, width: 260, borderRadius: 8, background: '#e0b04c'}} />
            <div style={{position: 'absolute', left: 200, right: 200, bottom: 50, height: 100, borderRadius: 50, background: '#f0a020', color: '#1d1d1d', fontSize: 44, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>購入する</div>
          </div>
          <Hand x={880} y={720 - 80 * seg(lf, 0, 20)} rot={-8} point scale={0.95} />
        </Pane>
      );
      case 2: return ( // delivered boxes, next "want"
        <Pane>
          {[[360, 520, 1], [600, 560, 0.8], [460, 380, 0.7]].map(([x, y, s], i) => <div key={i} style={{position: 'absolute', left: x, top: y, width: 300 * s, height: 220 * s, background: 'linear-gradient(160deg, #c8a06a, #9a7448)', borderRadius: 8, boxShadow: '0 14px 30px rgba(0,0,0,0.4)'}}><div style={{position: 'absolute', left: '45%', top: 0, bottom: 0, width: '10%', background: 'rgba(240,230,200,0.6)'}} /></div>)}
          <div style={{position: 'absolute', left: 1120, top: 120, width: 520, height: 600, borderRadius: 20, background: '#f4f5f7', padding: 30}}>
            {[0, 1, 2].map((i) => <div key={i} style={{display: 'flex', gap: 20, marginBottom: 24, opacity: interpolate(lf - i * 8, [0, 8], [0, 1], clamp)}}><div style={{width: 140, height: 140, borderRadius: 10, background: `hsl(${200 + i * 50},45%,60%)`}} /><div><div style={{width: 260, height: 26, borderRadius: 6, background: '#d0d4dc'}} /><div style={{width: 140, height: 26, borderRadius: 6, background: '#e0b04c', marginTop: 14}} /></div></div>)}
          </div>
        </Pane>
      );
      case 3: return ( // the album folder of an old love (blurred, no faces)
        <Pane bg="radial-gradient(ellipse at 50% 30%, #2a2a38 0%, #0c0c12 70%)">
          <div style={{position: 'absolute', left: 360, top: 90, display: 'grid', gridTemplateColumns: 'repeat(4, 280px)', gap: 24, filter: 'blur(5px) saturate(0.6)'}}>
            {Array.from({length: 8}, (_, i) => <div key={i} style={{height: 220, borderRadius: 12, background: `linear-gradient(135deg, hsl(${20 + i * 25},50%,62%), hsl(${200 + i * 15},40%,42%))`}} />)}
          </div>
          <Pop f={lf} at={8} style={TXT({top: 640, fontSize: 70, color: K.sub})}>何度も 何度も</Pop>
        </Pane>
      );
      case 4: return ( // a long angry message typed out
        <Pane bg="radial-gradient(ellipse at 50% 30%, #3a2224 0%, #0e0a0c 70%)">
          <Phone f={lf} x={700} y={20} scale={0.9} title="メモ" msgs={[]} input={'あのさ 前から言おうと思ってたけど あの言い方は本当にありえないと思う そもそも最初に頼んできたのはそっちだし こっちは何回も確認したよね それなのに'.slice(0, Math.floor(lf * 2.2))} caret />
        </Pane>
      );
      case 5: return ( // the deadline file open, eyes go to the window
        <Pane bg="linear-gradient(180deg, #1c2230, #0c0f16)">
          <div style={{position: 'absolute', left: 1180, top: 80, width: 560, height: 520, background: 'linear-gradient(180deg, #8fb4d8, #d8e6f0)', border: '18px solid #3a3f4a'}} />
          <div style={{position: 'absolute', left: 200, top: 160, width: 820, height: 520, borderRadius: 14, background: '#f4f5f7', border: '16px solid #2a2f3a', padding: 30, transform: `translateX(${-seg(lf, 10, 40) * 40}px)`}}>
            <div style={{fontSize: 34, fontWeight: 900, color: '#333'}}>資料（締め切り 本日）</div>
            {[0, 1, 2, 3].map((i) => <div key={i} style={{marginTop: 26, height: 22, width: 600 - i * 70, borderRadius: 6, background: '#d6dae2'}} />)}
          </div>
        </Pane>
      );
      case 6: return ( // in front of the mirror, fixing the bangs again
        <Pane bg="linear-gradient(180deg, #2b3038, #1a1d23)">
          <div style={{position: 'absolute', left: 560, top: 60, width: 800, height: 720, borderRadius: 24, border: '16px solid #c9c4ba', background: 'linear-gradient(180deg, rgba(196,212,228,0.55), rgba(120,136,156,0.5))', overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: 230, top: -40, width: 340, height: 400, borderRadius: 170, background: 'rgba(36,42,54,0.92)'}} />
            <div style={{position: 'absolute', left: 120, top: 400, width: 560, height: 400, borderRadius: '260px 260px 0 0', background: 'rgba(44,52,66,0.88)'}} />
          </div>
          <Hand x={760 + 50 * Math.sin(lf / 5)} y={150} rot={170} scale={0.8} />
        </Pane>
      );
      default: return ( // meeting notes
        <Pane bg="linear-gradient(180deg, #2a2a24, #12110e)">
          <Notebook x={500} y={60} w={920} h={760} lines={['会議メモ', '・来期の予算', '・担当の割り振り']} />
          <div style={{position: 'absolute', left: 600, top: 470, fontSize: 60, fontWeight: 900, color: '#c0392b', fontFamily: FONT}}>{'こいつ分かってない'.slice(0, Math.floor(lf / 3))}</div>
          <Hand x={1000 + Math.min(9, Math.floor(lf / 3)) * 30} y={420} rot={-30} scale={0.8} />
        </Pane>
      );
    }
  })();
  return <AbsoluteFill style={{background: '#000'}}><AbsoluteFill style={{opacity: interpolate(lf, [0, 6], [k === 0 ? 1 : 0, 1], clamp)}}>{body}</AbsoluteFill>{dur < 0 && null}</AbsoluteFill>;
};

export const Notebook: React.FC<{x: number; y: number; w: number; h: number; lines?: string[]; children?: React.ReactNode}> = ({x, y, w, h, lines = [], children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: '#fbf9f2', borderRadius: 8, boxShadow: '0 30px 70px rgba(0,0,0,0.55)', backgroundImage: 'repeating-linear-gradient(180deg, rgba(0,0,0,0) 0 78px, rgba(80,110,160,0.25) 78px 80px)', fontFamily: FONT}}>
    <div style={{position: 'absolute', left: 80, top: 0, bottom: 0, width: 3, background: 'rgba(200,80,80,0.35)'}} />
    {lines.map((t, i) => <div key={i} style={{position: 'absolute', left: 110, top: 18 + i * 80, fontSize: 44, fontWeight: 800, color: '#2a3550'}}>{t}</div>)}
    {children}
  </div>
);

const S02: React.FC<SceneProps> = ({f, T}) => {
  const list = f >= LT(T, 's02', 1) && f < LT(T, 's02', 3);
  const seven = f >= LT(T, 's02', 3) && f < LT(T, 's02', 5);
  const lab = f >= LT(T, 's02', 5) && f < LT(T, 's02', 7);
  const prom = f >= LT(T, 's02', 7);
  if (prom) return (
    <WhiteStudio>
      <Pop f={f} at={LT(T, 's02', 7)} style={TXT({top: 50, fontSize: 64, color: '#1d2230', textShadow: 'none'})}>八つの枢要罪</Pop>
      <div style={{position: 'absolute', left: 230, top: 170, width: 1460}}>
        {['七つの大罪はもともと八つ 消えた罪は何で なぜ消されたのか', '八つの考えが あなたの脳と心に何をしているのか', '我慢が強い人と弱い人は 何が違うのか', '八つの考えに負けないために 今日から何をすればいいのか'].map((t, i) => (
          <Card key={i} f={f} at={LT(T, 's02', 8 + i)} light x={0} y={i * 150} w={1460} size={42} text={<><span style={{color: '#c0392b'}}>{['一つ目', '二つ目', '三つ目', '四つ目'][i]}</span>　{t}</>} />
        ))}
      </div>
    </WhiteStudio>
  );
  if (lab) return (
    <DarkBoard>
      <BrainBox><BrainShot f={f - LT(T, 's02', 5)} x={0} glows={[{pos: VSTR, color: '#ffd166', k: 0.5 + 0.4 * Math.sin(f / 6), size: 0.45}, {pos: AMYG, color: '#ff5a3d', k: 0.5 + 0.4 * Math.sin(f / 7 + 1), size: 0.4}]} /></BrainBox>
      <Big f={f} at={LT(T, 's02', 6)} y={700} size={64} color="#ff7a64" text="1600年前の人も 今のあなたも" />
    </DarkBoard>
  );
  if (list || seven) return (
    <AbsoluteFill>
      <Desert f={f} />
      <AbsoluteFill style={{background: 'rgba(0,0,0,0.35)'}} />
      {list && <Parchment f={f - LT(T, 's02', 1)} x={560} y={150} w={800} h={660} words={NAMES.map((n) => n[0])} wordsAt={LT(T, 's02', 2) - LT(T, 's02', 1)} />}
      {list && <Big f={f} at={LT(T, 's02', 1) + 10} y={40} size={56} color={K.gold} text="1600年以上前" />}
      {seven && <Big f={f} at={LT(T, 's02', 4)} y={300} size={150} color="#ffd060" text="「七つの大罪」" />}
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill>
      <Kitchen f={f + 200} reach={0.9} />
      <AbsoluteFill style={{background: 'rgba(0,0,0,0.3)'}} />
      <MascotOverlay f={f} x={1500} y={330} w={380} h={440} rotY={-0.9} />
    </AbsoluteFill>
  );
};

// =============== 1. あなたで試す ===============
const CHECK = ['お腹が空いていないのに 目に入ったものをつい食べる', 'その場の気分で決めたことを あとで「なんであんなことを」と後悔する', '買ったばかりなのに もう次に欲しいものを探している', '終わったことや 手に入らなかったものを 何度も思い返す', '腹が立ったら 人に話したり書き込んだりして発散する', 'やることがあるのに 何もせず時計ばかり見ている', '人にどう見られているかが 一日に何度も気になる', '自分は周りより分かっている と感じることが多い'];
export const MROW = {w: 160, gap: 28, shift: -170};
const S03: React.FC<SceneProps> = ({f}) => <CardRow state={() => ({p: 0})} y={280} {...MROW} mascot={{f, x: 1540, y: 330, rotY: -0.9}} />;
// landscape check cards (4 x 2) so the statements stay readable; the names rise on the same cards at the end
const CheckCard: React.FC<{i: number; p: number; nm: number; cur: boolean}> = ({i, p, nm, cur}) => {
  const ang = (1 - p) * Math.PI;
  const up = p >= 0.5;
  return (
    <div style={{width: 430, height: 260, position: 'relative', transform: `scaleX(${Math.max(0.02, Math.abs(Math.cos(ang)))}) scale(${cur ? 1.05 : 1})`}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 18, overflow: 'hidden', fontFamily: FONT,
        background: up ? 'radial-gradient(ellipse at 40% 30%, #f1e6cc 0%, #dcc79c 70%, #c3a978 100%)' : 'radial-gradient(ellipse at 50% 40%, #5a3d26 0%, #3a2616 80%)',
        boxShadow: cur ? '0 0 50px rgba(255,214,120,0.9), 0 14px 34px rgba(0,0,0,0.35)' : '0 14px 34px rgba(0,0,0,0.35)'}}>
        <div style={{position: 'absolute', inset: 10, borderRadius: 12, border: `3px solid ${up ? 'rgba(90,58,28,0.5)' : 'rgba(232,196,106,0.55)'}`}} />
        {!up && <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontSize: 90, color: 'rgba(232,196,106,0.75)'}}>✦</div>}
        {up && (
          <>
            <div style={{position: 'absolute', inset: 0, padding: '26px 30px', color: INK, opacity: 1 - nm}}>
              <span style={{fontSize: 36, fontWeight: 900, color: '#a0392b'}}>{['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧'][i]} </span>
              <span style={{fontSize: 34, fontWeight: 900, lineHeight: 1.42}}>{CHECK[i]}</span>
            </div>
            <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: INK, opacity: nm, transform: `scale(${0.8 + 0.2 * nm})`}}>
              <div style={{fontSize: 104, fontWeight: 900, lineHeight: 1}}>{NAMES[i][0]}</div>
              <div style={{fontSize: 30, fontWeight: 800, opacity: 0.75, marginTop: 10}}>{NAMES[i][1]}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
const S04: React.FC<SceneProps> = ({f, T}) => {
  let cur = -1;
  for (let i = 0; i < 8; i++) if (f >= LT(T, 's04', i) - 6 && f < LT(T, 's04', 8)) cur = i;
  const names = f >= LT(T, 's04', 10) ? LT(T, 's04', 11) : -1;
  return (
    <WhiteStudio>
      <div style={{position: 'absolute', left: 60, top: 70, display: 'grid', gridTemplateColumns: 'repeat(4, 430px)', gap: '40px 30px'}}>
        {CHECK.map((_, i) => {
          const at = LT(T, 's04', i);
          return <CheckCard key={i} i={i} p={seg(f, at - 6, at + 10)} nm={names >= 0 ? seg(f, names + i * 9, names + i * 9 + 14) : 0} cur={i === cur} />;
        })}
      </div>
      {f >= LT(T, 's04', 8) && f < LT(T, 's04', 10) && <Big f={f} at={LT(T, 's04', 8)} y={680} size={66} color="#c0392b" light text="いくつ当てはまりましたか？" />}
    </WhiteStudio>
  );
};
const S05: React.FC<SceneProps> = ({f, T}) => {
  const q = f >= LT(T, 's05', 2, 1);
  const hl = q ? Math.floor((f - LT(T, 's05', 2, 1)) / 14) % 8 : -1;
  return (
    <AbsoluteFill>
      <CardRow state={(i) => ({p: 1, glow: i === hl ? 0.8 : 0, lift: i === hl ? 24 : 0})} y={170} />
      {q && <Big f={f} at={LT(T, 's05', 2, 1)} y={640} size={74} color="#c0392b" light text="何番目でしたか？" />}
      {!q && <Big f={f} at={LT(T, 's05', 1)} y={640} size={60} color="#1d2230" light text="当てはまったカードに注意" />}
    </AbsoluteFill>
  );
};

// =============== 2. 1,600年前 ===============
const S06: React.FC<SceneProps> = ({f, T, dur}) => {
  const inside = f >= LT(T, 's06', 2);
  if (!inside) return <AbsoluteFill style={{transform: `scale(${interpolate(f, [0, 400], [1, 1.08], clamp)})`}}><Desert f={f} /><Big f={f} at={LT(T, 's06', 0)} y={90} size={64} color="#ffe2a8" text="4世紀 エジプトの砂漠" /></AbsoluteFill>;
  const lf = f - LT(T, 's06', 2);
  const deed = f >= LT(T, 's06', 5);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 40% 50%, #3a2616 0%, #120a05 70%)'}}>
      <Candle f={f} x={260} y={300} />
      {!deed && <Parchment f={lf} x={560} y={60} w={900} h={720} wordSize={52} words={f >= LT(T, 's06', 4) ? ['食べ物への欲', '性の欲', 'お金と物への欲', '悲しみ', '怒り', '無気力', 'よく見られたい', '自分は偉い'] : undefined} wordsAt={LT(T, 's06', 4) - LT(T, 's06', 2)} lines={8} />}
      {!deed && f < LT(T, 's06', 4) && <Hand x={1100 + 120 * Math.sin(lf / 18)} y={480 + 40 * Math.sin(lf / 9)} rot={-35} scale={0.75} />}
      {deed && (
        <>
          <div style={{position: 'absolute', left: 520, top: 200, display: 'flex', gap: 60, alignItems: 'center', fontFamily: FONT}}>
            <Pop f={f} at={LT(T, 's06', 5, 1)} style={{padding: '30px 50px', borderRadius: 20, border: `4px solid ${K.gold}`, color: K.gold, fontSize: 70, fontWeight: 900}}>考え</Pop>
            <Pop f={f} at={LT(T, 's06', 5, 1) + 10} style={{fontSize: 80, color: K.ink}}>→</Pop>
            <Pop f={f} at={LT(T, 's06', 5, 1) + 16} style={{padding: '30px 50px', borderRadius: 20, border: '4px solid #6b7488', color: '#aeb8cc', fontSize: 70, fontWeight: 900}}>行い</Pop>
          </div>
          <Big f={f} at={LT(T, 's06', 5, 4)} y={480} size={70} color="#ff7a64" text="勝負は 行動の前に始まっている" />
        </>
      )}
      {dur < 0 && null}
      <Vignette />
    </AbsoluteFill>
  );
};
const S07: React.FC<SceneProps> = ({f, T, dur}) => {
  const items = ['どの考えが', 'いつ来て', 'どれくらい強くて', 'いつ弱まるのか', 'どの考えのあとに どの考えが続くのか'];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, #3a2616 0%, #120a05 75%)'}}>
      <AbsoluteFill style={{transform: `scale(${interpolate(f, [0, dur], [1.15, 1.3], clamp)})`}}><Parchment f={400} x={160} y={0} w={1600} h={1080} lines={14} scroll={f * 0.6} /></AbsoluteFill>
      <AbsoluteFill style={{background: 'rgba(10,6,2,0.55)'}} />
      {f >= LT(T, 's07', 1) && f < LT(T, 's07', 2) && (
        <div style={{position: 'absolute', left: 300, top: 70, width: 1320}}>
          <Pop f={f} at={LT(T, 's07', 1)} style={{fontFamily: FONT, fontSize: 80, fontWeight: 900, color: K.gold, textAlign: 'center', marginBottom: 30}}>自分の考えを見張りなさい</Pop>
          {items.map((t, i) => <Pop key={i} f={f} at={LT(T, 's07', 1, 1) + i * 12} style={{fontFamily: FONT, fontSize: 50, fontWeight: 900, color: K.ink, textAlign: 'center', marginBottom: 14}}>{t}</Pop>)}
        </div>
      )}
      {f >= LT(T, 's07', 2) && <Big f={f} at={LT(T, 's07', 2)} y={300} size={86} color={K.gold} text="自分の心を 記録して観察する" />}
    </AbsoluteFill>
  );
};
const S08: React.FC<SceneProps> = ({f, T}) => {
  const c = (k: number) => seg(f, LT(T, 's08', k), LT(T, 's08', k) + 40);
  const vain = c(2), sloth = c(3), envy = c(4);
  const back = f >= LT(T, 's08', 8) ? seg(f, LT(T, 's08', 8), LT(T, 's08', 8) + 30) : 0;
  const total = 8 * 180 + 7 * 32;
  const showMerge = f >= LT(T, 's08', 1) && f < LT(T, 's08', 6);
  return (
    <AbsoluteFill>
      <CardRow state={(i) => (i === 6 ? {p: 1, crumble: vain} : i === 5 ? {p: 1, crumble: sloth * (1 - back), glow: back} : {p: 1})} y={170} />
      {showMerge && vain > 0.2 && <Pop f={f} at={LT(T, 's08', 2) + 10} style={{position: 'absolute', left: (1920 - total) / 2 + 6 * 212 - 120, top: 640, fontFamily: FONT, fontSize: 40, fontWeight: 900, color: '#1d2230'}}>虚飾 → 傲慢の中へ</Pop>}
      {showMerge && sloth > 0.2 && <Pop f={f} at={LT(T, 's08', 3) + 10} style={{position: 'absolute', left: (1920 - total) / 2 + 3 * 212 - 60, top: 640, fontFamily: FONT, fontSize: 40, fontWeight: 900, color: '#1d2230'}}>怠惰 → 憂鬱の中へ</Pop>}
      {envy > 0 && (
        <div style={{position: 'absolute', left: (1920 - total) / 2 + 6 * 212, top: 170 - 60 * (1 - envy), opacity: envy}}>
          <div style={{width: 180, height: 266, borderRadius: 11, background: 'radial-gradient(ellipse at 40% 30%, #f1e6cc 0%, #dcc79c 70%, #c3a978 100%)', boxShadow: '0 0 40px rgba(120,200,140,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, color: INK}}>
            <div style={{fontSize: 22, fontWeight: 900, color: '#2a7a4a'}}>新しく</div>
            <div style={{fontSize: 56, fontWeight: 900}}>嫉妬</div>
            <div style={{fontSize: 16, fontWeight: 800}}>しっと</div>
          </div>
        </div>
      )}
      {f >= LT(T, 's08', 5) && f < LT(T, 's08', 8) && <Big f={f} at={LT(T, 's08', 5)} y={640} size={72} color="#c0392b" light text={f >= LT(T, 's08', 6) ? '名前ごと消えた 虚飾と怠惰' : '今の「七つの大罪」'} />}
      {back > 0 && f < LT(T, 's08', 9) && <Big f={f} at={LT(T, 's08', 8)} y={640} size={60} color="#1d2230" light text="怠惰はのちに 憂鬱と入れ替わって戻る" />}
      {f >= LT(T, 's08', 9) && <Big f={f} at={LT(T, 's08', 9)} y={640} size={66} color="#c0392b" light text="消えた二つこそ 今のあなたの毎日に" />}
    </AbsoluteFill>
  );
};
const S09: React.FC<SceneProps> = ({f, T}) => {
  const res = f >= LT(T, 's09', 6);
  const ring = f >= LT(T, 's09', 4) && f < LT(T, 's09', 6);
  if (res) {
    const last = f >= LT(T, 's09', 9);
    return (
      <DarkBoard>
        {!last ? (
          <>
            <Card f={f} at={LT(T, 's09', 7)} x={260} y={90} w={1400} text="「〜したい」は 一日中 何度も起きている" />
            <Card f={f} at={LT(T, 's09', 7, 2)} x={260} y={240} w={1400} color={K.gold} text="目標とぶつかる欲求に 抵抗したのは およそ半分" />
            <Card f={f} at={LT(T, 's09', 8)} x={260} y={390} w={1400} color="#ff7a64" text="一番負けていたのは メディアを見たい欲求と 仕事の欲求" />
          </>
        ) : (
          <>
            <Parchment f={300} x={200} y={120} w={640} h={520} lines={7} />
            <div style={{position: 'absolute', left: 900, top: 330, fontSize: 90, color: K.ink, fontFamily: FONT}}>＝</div>
            <Notebook x={1060} y={120} w={640} h={520} lines={['今日', 'もう一本だけ', 'あとで やる']} />
            <Big f={f} at={LT(T, 's09', 9, 2)} y={700} size={60} color={K.gold} text="中身は違って見えても 形は同じ" />
          </>
        )}
      </DarkBoard>
    );
  }
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #2a2e36 0%, #1a1d22 60%, #3a3026 60.2%, #2a2018 100%)'}}>
      <div style={{position: 'absolute', left: 300, top: 560, width: 260, height: 150, borderRadius: 22, background: '#2c3038', border: '6px solid #4a505c', transform: `translateX(${ring ? Math.sin(f * 2.4) * 4 : 0}px)`, boxShadow: ring ? '0 0 50px rgba(120,220,160,0.5)' : 'none'}}>
        <div style={{position: 'absolute', left: 20, top: 20, right: 20, height: 70, borderRadius: 8, background: ring ? '#9fe6b8' : '#4a6a58', fontFamily: FONT, fontSize: 30, fontWeight: 900, color: '#13301e', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{ring ? 'いま答えて' : ''}</div>
      </div>
      <Notebook x={700} y={420} w={760} h={520} lines={['今 何をしたいか', f >= LT(T, 's09', 5) ? '・動画を見たい' : '', f >= LT(T, 's09', 5, 1) ? '・目標とぶつかる' : '']} />
      {f >= LT(T, 's09', 5) && <Hand x={1260} y={560} rot={-30} scale={0.75} />}
      <div style={{position: 'absolute', left: 0, right: 0, top: 40}}>
        <StepCard f={f} at={LT(T, 's09', 1)} n="大人205人" text="小さな端末を 1週間持つ" x={110} y={20} w={860} />
        <StepCard f={f} at={LT(T, 's09', 4)} n="合図" text="一日のあいだ ランダムに鳴る" x={1000} y={20} w={810} />
        <StepCard f={f} at={LT(T, 's09', 5)} n="答える" text="したい気持ちは？ 目標とぶつかる？ 我慢した？ どうした？" x={110} y={180} w={1700} />
      </div>
    </AbsoluteFill>
  );
};

// =============== 3. 暴食 ===============
const S11: React.FC<SceneProps> = ({f, T, dur}) => {
  if (f < LT(T, 's11', 1)) return <FlipRoom f={f} n={0} />;
  const res = f >= LT(T, 's11', 5);
  if (res) return (
    <DarkBoard>
      <div style={{position: 'absolute', left: 260, top: 100, display: 'flex', alignItems: 'center', gap: 50, fontFamily: FONT}}>
        <Pop f={f} at={LT(T, 's11', 6)} style={{fontSize: 150}}>👀</Pop>
        <Pop f={f} at={LT(T, 's11', 6) + 8} style={{fontSize: 70, color: K.gold, fontWeight: 900}}>→</Pop>
        <Pop f={f} at={LT(T, 's11', 6) + 14} style={{padding: '24px 40px', borderRadius: 18, border: `4px solid ${K.gold}`, color: K.gold, fontSize: 60, fontWeight: 900}}>「食べたい」</Pop>
        <Pop f={f} at={LT(T, 's11', 6) + 22} style={{fontSize: 70, color: '#ff7a64', fontWeight: 900}}>→</Pop>
        <Pop f={f} at={LT(T, 's11', 6) + 28} style={{fontSize: 150}}>🍩</Pop>
      </div>
      <Card f={f} at={LT(T, 's11', 6, 1)} x={260} y={380} w={1400} text="反応が強い人ほど そのあと たくさん食べる" />
      <Big f={f} at={LT(T, 's11', 7)} y={560} size={70} color="#ff7a64" text="食べすぎは 目に入った瞬間に始まる" />
    </DarkBoard>
  );
  const study = f >= LT(T, 's11', 3);
  return (
    <AbsoluteFill style={{background: '#0a0b10'}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #1a1d26 0%, #0e1016 100%)'}} />
      <div style={{position: 'absolute', left: 520, top: 180, width: 880, height: 420, borderRadius: 24, background: 'linear-gradient(180deg, rgba(255,214,140,0.95), rgba(255,170,80,0.85))', boxShadow: '0 0 160px 40px rgba(255,190,100,0.45)', padding: 30, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20}}>
        {['🍗', '🥟', '🍢', '🌭', '🍗', '🥐', '🍢', '🍗'].map((e, i) => <div key={i} style={{fontSize: 110, textAlign: 'center', transform: `translateY(${Math.sin((f + i * 10) / 12) * 3}px)`}}>{e}</div>)}
      </div>
      <div style={{position: 'absolute', left: 480, top: 600, width: 960, height: 60, background: '#5a5f6a'}} />
      {[0, 1].map((i) => <div key={i} style={{position: 'absolute', left: 820 + i * 170, top: 860 - seg(f, LT(T, 's11', 1), LT(T, 's11', 1) + 30) * 60, width: 130, height: 260, borderRadius: '60px 60px 20px 20px', background: '#20242c'}} />)}
      {study && <AbsoluteFill style={{background: 'rgba(5,6,10,0.65)'}} />}
      {study && <Card f={f} at={LT(T, 's11', 3)} x={260} y={90} w={1400} text="食べ物と「食べたい」の研究を たくさん集めて まとめ直す" />}
      {study && <Card f={f} at={LT(T, 's11', 4)} x={260} y={250} w={1400} color={K.gold} text="見る・におう → 体と心の反応 → そのあと食べる量を予測する？" />}
      {!study && f >= LT(T, 's11', 2) && <Big f={f} at={LT(T, 's11', 2)} y={60} size={64} color={K.ink} text="空いているから？ 目に入ったから？" />}
      {dur < 0 && null}
      <Vignette />
    </AbsoluteFill>
  );
};
const S12: React.FC<SceneProps> = ({f, dur, T}) => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #1c1a24 0%, #2a2430 50%, #3a3430 100%)', transform: `scale(${interpolate(f, [0, dur], [1, 1.06], clamp)})`}}>
    <div style={{position: 'absolute', left: 300, top: 120, width: 1320, height: 640, borderRadius: 16, background: 'linear-gradient(180deg, #ffd9a0, #e6a35a)', boxShadow: '0 0 200px 40px rgba(255,190,110,0.35)'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 90, background: '#7a3f1c', color: '#ffe8c0', fontFamily: FONT, fontSize: 48, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: '0.3em'}}>BAKERY</div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 200, display: 'flex', justifyContent: 'space-around', fontSize: 140}}>{['🥐', '🍞', '🥖', '🥯'].map((e, i) => <span key={i}>{e}</span>)}</div>
    </div>
    {Array.from({length: 7}, (_, i) => {
      const t = ((f + i * 40) % 160) / 160;
      return <div key={i} style={{position: 'absolute', left: 500 + i * 150 + Math.sin(t * 6 + i) * 40, top: 520 - t * 420, width: 200, height: 200, borderRadius: 100, background: 'radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 70%)', opacity: Math.sin(t * Math.PI), transform: `scale(${1 + t * 1.5})`}} />;
    })}
    <Hand x={1380} y={760 - seg(f, LT(T, 's12', 1), LT(T, 's12', 1) + 40) * 120} rot={-20} scale={0.9} />
    <Vignette />
  </AbsoluteFill>
);
const MonitorPics: React.FC<{f: number; icons: string[]; per?: number}> = ({f, icons, per = 20}) => {
  const i = Math.floor(f / per) % icons.length;
  return <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 260}}>{icons[i]}</AbsoluteFill>;
};
const S13: React.FC<SceneProps> = ({f, T, dur}) => (
  <AbsoluteFill>
    <MriBg f={f} dur={dur} />
    <MriMonitor f={f} x={1040} y={90} w={760} h={480}>
      <MonitorPics f={f} icons={['🍩', '🚬', '🍔', '🚬', '🍰', '🚬']} per={22} />
      {f >= LT(T, 's13', 4) && <div style={{position: 'absolute', left: 0, right: 0, bottom: 20, textAlign: 'center', fontFamily: FONT, fontSize: 40, fontWeight: 900, color: f >= LT(T, 's13', 5) ? '#7fd1c7' : '#ffd166'}}>{f >= LT(T, 's13', 5) ? 'ずっと続けた先は？' : '今すぐ口にしたら？'}</div>}
    </MriMonitor>
    <StepCard f={f} at={LT(T, 's13', 3)} n="手順1" text="たばこを吸う人が 装置の中で 食べ物とたばこの写真を見る" x={80} y={90} w={900} />
    <StepCard f={f} at={LT(T, 's13', 4)} n="手順2" text="ある回は「今すぐ口にしたら」" x={80} y={300} w={900} />
    <StepCard f={f} at={LT(T, 's13', 5)} n="手順3" text="別の回は「続けた先の 長い目で見た結果」" x={80} y={450} w={900} />
    <StepCard f={f} at={LT(T, 's13', 6)} n="比べる" text="欲しい気持ちと 脳の働き" x={80} y={600} w={900} />
  </AbsoluteFill>
);
export const DLPFC: [number, number, number][] = [[-0.36, 0.26, 0.44], [0.36, 0.26, 0.44]];
const S14: React.FC<SceneProps> = ({f, T}) => {
  const k = seg(f, LT(T, 's14', 2), LT(T, 's14', 2) + 60);
  return (
    <AbsoluteFill>
      <BrainBox><BrainShot f={f} x={-260} glows={[{pos: DLPFC, color: '#3fd6c4', k: 0.15 + 1.0 * k, size: 0.5}, {pos: VSTR, color: '#ffb648', k: 1.1 - 0.85 * k, size: 0.45}]}
        labels={[{pos: DLPFC[0], text: '考えをまとめる場所', note: '働きが上がる', color: '#3fd6c4', k, dx: 300, dy: -200}, {pos: VSTR[0], text: '欲しい気持ちの場所', note: '働きが下がる', color: '#ffb648', k, dx: 380, dy: 160}]} /></BrainBox>
      {f < LT(T, 's14', 3) && <Card f={f} at={LT(T, 's14', 1)} x={1180} y={560} w={680} size={38} text="長い目で考えると たばこも食べ物も 欲しい気持ちが下がった" />}
      {f >= LT(T, 's14', 3) && <Big f={f} at={LT(T, 's14', 3)} y={700} size={66} color={K.gold} text="欲しい気持ちは 考え方で変えられる" />}
    </AbsoluteFill>
  );
};
const S15: React.FC<SceneProps> = ({f, T}) => (
  <AbsoluteFill>
    <Kitchen f={f} reach={0.75} stop />
    {f >= LT(T, 's15', 1) && <Big f={f} at={LT(T, 's15', 1)} y={150} size={70} color="#ffe2a8" text="目の前の一口しか 見ていない" />}
    {f >= LT(T, 's15', 1, 2) && <Big f={f} at={LT(T, 's15', 1, 2)} y={300} size={64} color="#ff7a64" text="意志ではなく「今」だけを見ているから" />}
  </AbsoluteFill>
);

// =============== 4. 色欲 ===============
const Thermo: React.FC<{v: number; color: string; x: number; label: string}> = ({v, color, x, label}) => (
  <div style={{position: 'absolute', left: x - 80, top: 90, width: 360, fontFamily: FONT, textAlign: 'center'}}>
    <div style={{position: 'relative', margin: '0 auto', width: 80, height: 520, borderRadius: 40, background: 'rgba(255,255,255,0.1)', border: '6px solid rgba(255,255,255,0.35)'}}>
      <div style={{position: 'absolute', left: 14, right: 14, bottom: 14, height: `${8 + 82 * v}%`, borderRadius: 26, background: color, boxShadow: `0 0 40px ${color}`}} />
    </div>
    <div style={{width: 140, height: 140, borderRadius: 70, background: color, margin: '-40px auto 0', boxShadow: `0 0 50px ${color}`}} />
    <div style={{marginTop: 20, fontSize: 40, fontWeight: 900, color: K.ink}}>{label}</div>
  </div>
);
const S17: React.FC<SceneProps> = ({f, T}) => {
  if (f < LT(T, 's17', 1)) return <FlipRoom f={f} n={1} />;
  const hot = seg(f, LT(T, 's17', 6), LT(T, 's17', 6) + 60);
  return (
    <DarkBoard tint="#2a2230">
      <Thermo v={0.2} color="#4a8cff" x={240} label="落ち着いた状態" />
      <Thermo v={0.2 + 0.7 * hot} color="#ff4a3d" x={1480} label="高まった状態" />
      {f >= LT(T, 's17', 2) && f < LT(T, 's17', 3) && <Big f={f} at={LT(T, 's17', 2)} y={260} size={64} text="欲が高まると 判断はどう変わるか" />}
      <StepCard f={f} at={LT(T, 's17', 3)} n="男子大学生" text="二つの状態で 同じ質問に答える" x={560} y={120} w={800} />
      <StepCard f={f} at={LT(T, 's17', 5)} n="1回目" text="ふだんの状態で「こういう場面で こうするか」" x={560} y={290} w={800} />
      {f >= LT(T, 's17', 5, 2) && <Card f={f} at={LT(T, 's17', 5, 2)} x={560} y={460} w={800} size={34} color="#ff7a64" text="ふだんなら「絶対にしない」危ない選択や だます選択も入っている" />}
      <StepCard f={f} at={LT(T, 's17', 6)} n="2回目" text="別の日 気持ちが高まった状態で 同じ質問" x={560} y={640} w={800} />
    </DarkBoard>
  );
};
// no bar chart: the study gives no numbers here (owner rule) — two cards instead
const S18: React.FC<SceneProps> = ({f, T}) => (
  <DarkBoard tint="#2a2230">
    <div style={{position: 'absolute', left: 200, top: 80, width: 700, padding: 30, borderRadius: 20, background: 'rgba(40,70,140,0.35)', border: '3px solid #4a8cff', fontFamily: FONT}}>
      <div style={{fontSize: 42, fontWeight: 900, color: '#9fc0ff'}}>落ち着いた状態</div>
      <div style={{fontSize: 64, fontWeight: 900, color: K.ink, marginTop: 20}}>「しない」</div>
    </div>
    <Pop f={f} at={LT(T, 's18', 1)} from="right" style={{position: 'absolute', left: 1020, top: 80, width: 700, padding: 30, borderRadius: 20, background: 'rgba(160,40,30,0.35)', border: '3px solid #ff4a3d', fontFamily: FONT}}>
      <div style={{fontSize: 42, fontWeight: 900, color: '#ff9a8a'}}>高まった状態</div>
      <div style={{fontSize: 64, fontWeight: 900, color: '#ff4a3d', marginTop: 20}}>「する」が大きく増えた</div>
    </Pop>
    {f >= LT(T, 's18', 3) && f < LT(T, 's18', 4) && <Big f={f} at={LT(T, 's18', 3)} y={400} size={66} color={K.gold} text="落ち着いた本人は 予測できなかった" />}
    {f >= LT(T, 's18', 4) && f < LT(T, 's18', 5) && <Card f={f} at={LT(T, 's18', 4)} x={360} y={400} w={1200} size={38} text="男子学生だけ 質問への答えを比べた研究（実際の行動ではない）" />}
    {f >= LT(T, 's18', 5) && <Big f={f} at={LT(T, 's18', 5, 1)} y={420} size={72} color="#ff7a64" text="高まったときの自分は 知らない人" />}
  </DarkBoard>
);
const S19: React.FC<SceneProps> = ({f, T, dur}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Still src="bed" f={f} dur={dur} dark={0.7} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 55% 55%, rgba(110,150,230,0.2) 0%, rgba(0,0,0,0) 40%)', mixBlendMode: 'screen'}} />
    <Hand x={900} y={560} rot={-15 + 3 * Math.sin(f / 20)} point scale={0.8} />
    {f >= LT(T, 's19', 1) && f < LT(T, 's19', 3) && <Big f={f} at={LT(T, 's19', 1)} y={120} size={60} color="#ffe2a8" text="勢いで送ったメッセージ 勢いで決めた約束" />}
    {f >= LT(T, 's19', 3) && <Big f={f} at={LT(T, 's19', 3)} y={140} size={74} color={K.gold} text="大事な決断は 夜にしない" />}
    <Vignette />
  </AbsoluteFill>
);

// =============== 5. 強欲 ===============
const Shop: React.FC<{f: number; at: (k: number) => number}> = ({f, at}) => {
  const items = [['🍫', '120円'], ['📕', '1,800円'], ['🔦', '4,500円']];
  const i = Math.max(0, Math.floor((f - at(0)) / 90)) % items.length;
  const lf = (f - at(0)) % 90;
  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center', fontSize: 200}}>{items[i][0]}</div>
      {lf > 30 && <div style={{position: 'absolute', left: 0, right: 0, top: 270, textAlign: 'center', fontSize: 70, fontWeight: 900, color: '#ffd166'}}>{items[i][1]}</div>}
      {lf > 55 && <div style={{position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', justifyContent: 'center', gap: 40}}>{['買う', '買わない'].map((t, k) => <div key={k} style={{padding: '12px 40px', borderRadius: 14, background: k ? '#4a505c' : '#2e9a5a', color: '#fff', fontSize: 40, fontWeight: 900}}>{t}</div>)}</div>}
    </AbsoluteFill>
  );
};
const S21: React.FC<SceneProps> = ({f, T, dur}) => {
  if (f < LT(T, 's21', 1)) return <FlipRoom f={f} n={2} />;
  return (
    <AbsoluteFill>
      <MriBg f={f} dur={dur} />
      <MriMonitor f={f} x={1040} y={90} w={760} h={480}><Shop f={f} at={() => LT(T, 's21', 1)} /></MriMonitor>
      <StepCard f={f} at={LT(T, 's21', 2)} n="26人" text="実験用のお金を渡す（本当に買える）" x={80} y={90} w={900} />
      <StepCard f={f} at={LT(T, 's21', 5)} n="装置の中で" text="商品 → 数秒後に値段 → 買うか選ぶ" x={80} y={260} w={900} />
      <StepCard f={f} at={LT(T, 's21', 6)} n="くり返す" text="たくさんの商品で" x={80} y={430} w={900} />
    </AbsoluteFill>
  );
};
const S22: React.FC<SceneProps> = ({f, T}) => {
  const want = seg(f, LT(T, 's22', 1), LT(T, 's22', 1) + 30);
  const pain = seg(f, LT(T, 's22', 2), LT(T, 's22', 2) + 30);
  const pred = f >= LT(T, 's22', 3);
  return (
    <AbsoluteFill>
      <BrainBox><BrainShot f={f} x={-280} glows={[{pos: VSTR, color: '#ffd166', k: 0.1 + 1.0 * want * (1 + 0.15 * Math.sin(f / 5)), size: 0.48}, {pos: R.ins, color: '#ff3b30', k: 0.05 + 1.0 * pain, size: 0.45}]}
        labels={[{pos: VSTR[0], text: 'ごほうびを期待', note: '欲しい商品を見た瞬間', color: '#ffd166', k: want, dx: 360, dy: -220}, {pos: R.ins[0], text: '嫌なことに反応', note: '値段が高すぎる', color: '#ff7a64', k: pain, dx: 420, dy: 140}]} /></BrainBox>
      {pred && <Card f={f} at={LT(T, 's22', 3)} x={1160} y={110} w={700} size={38} color={K.gold} text="脳の働きを見るほうが 本人に聞くより正確に「買うか」を予測できた" />}
      {f >= LT(T, 's22', 4) && <Big f={f} at={LT(T, 's22', 4)} y={700} size={62} color="#ff7a64" text="決める前に 綱引きはもう終わっている" />}
    </AbsoluteFill>
  );
};
export const Boxes: React.FC<{x?: number; y?: number; s?: number}> = ({x = 300, y = 420, s = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 700 * s, height: 460 * s}}>
    {[[0, 200, 1], [320, 230, 0.9], [120, 20, 0.85], [420, 60, 0.7]].map(([bx, by, k], i) => <div key={i} style={{position: 'absolute', left: bx * s, top: by * s, width: 300 * k * s, height: 220 * k * s, background: 'linear-gradient(160deg, #c8a06a, #8a6438)', borderRadius: 8, boxShadow: '0 14px 30px rgba(0,0,0,0.4)'}}><div style={{position: 'absolute', left: '45%', top: 0, bottom: 0, width: '10%', background: 'rgba(240,230,200,0.55)'}} /></div>)}
  </div>
);
const S23: React.FC<SceneProps> = ({f, T}) => {
  const res = f >= LT(T, 's23', 2);
  return (
    <AbsoluteFill>
      <Still src="living" f={f} dur={600} dark={0.55} />
      <Boxes x={200} y={430} s={0.95} />
      <MascotOverlay f={f} x={880} y={380} w={380} h={440} rotY={-0.4} />
      {!res && <Big f={f} at={LT(T, 's23', 0)} y={90} size={66} text="手に入れ続けると 幸せになる？" />}
      {res && (
        <>
          <Card f={f} at={LT(T, 's23', 3)} x={1100} y={90} w={760} size={38} color="#ff7a64" text="お金や物を大事にする人ほど 幸福感が低い" />
          <Card f={f} at={LT(T, 's23', 3, 2)} x={1100} y={260} w={760} size={34} text="体に悪い行動・浪費・自分を低く見る気持ちとの結びつきは特に強い" />
          {f >= LT(T, 's23', 4) && <Card f={f} at={LT(T, 's23', 4)} x={1100} y={460} w={760} size={32} color={K.gold} text="結びつき 原因と証明したものではない" />}
        </>
      )}
    </AbsoluteFill>
  );
};
const S24: React.FC<SceneProps> = ({f, T, dur}) => {
  const put = seg(f, 30, 90);
  return (
    <AbsoluteFill>
      <Still src="living" f={f} dur={dur} dark={0.6} />
      <Boxes x={140} y={460} s={0.8} />
      <div style={{position: 'absolute', left: 1000 - 500 * put, top: 520 + 120 * put, width: 360, height: 240, background: 'linear-gradient(160deg, #d2ac76, #9a7448)', borderRadius: 8, transform: `rotate(${-6 * put}deg)`}} />
      <Hand x={1260 - 500 * put} y={480 + 100 * put} rot={-40} scale={0.85} />
      {f >= LT(T, 's24', 1) && f < LT(T, 's24', 2) && <Big f={f} at={LT(T, 's24', 1)} y={120} size={60} text="届いた次の日には 気にもしていない" />}
      {f >= LT(T, 's24', 2) && <Big f={f} at={LT(T, 's24', 2, 1)} y={120} size={76} color="#ff7a64" text="強欲は 満たすほど止まらない" />}
      <Vignette />
    </AbsoluteFill>
  );
};

export const SCENES_S1: Record<string, React.FC<SceneProps>> = {s00: S00, s01: S01, s02: S02, s03: S03, s04: S04, s05: S05, s06: S06, s07: S07, s08: S08, s09: S09, s11: S11, s12: S12, s13: S13, s14: S14, s15: S15, s17: S17, s19: S19, s18: S18, s21: S21, s22: S22, s23: S23, s24: S24};
// keep unused imports referenced for the type checker
export const _unused = [PersonIcon, AMYG];

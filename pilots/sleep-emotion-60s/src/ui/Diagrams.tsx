import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Board: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, #16213a 0%, ${C.ink} 75%)`, fontFamily: FONT, color: C.text}}>
    <AbsoluteFill style={{backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`, backgroundSize: '64px 64px'}} />
    {children}
  </AbsoluteFill>
);

export const Cite: React.FC<{text?: string}> = ({text = 'Yoo, Gujar, Hu, Jolesz & Walker (2007) Current Biology 17, R877–R878'}) => (
  <div style={{position: 'absolute', right: 56, top: 54, fontSize: 22, color: C.sub, fontFamily: FONT}}>{text}</div>
);

// ---------- brain (self-drawn schematic, sagittal view, front = left) ----------
const BRAIN = 'M 92 250 C 70 168 122 88 212 58 C 292 30 392 34 462 70 C 532 106 566 172 556 236 C 549 280 521 300 481 306 C 471 336 441 350 401 346 C 381 361 341 366 321 351 L 304 392 C 298 408 278 410 271 396 L 264 346 C 222 341 192 331 172 316 C 132 311 100 290 92 250 Z';
const GYRI = [
  'M 150 130 C 190 150 200 190 180 230', 'M 230 80 C 250 120 240 160 260 200', 'M 320 60 C 320 110 300 150 330 190',
  'M 400 70 C 390 120 420 160 410 210', 'M 470 110 C 450 150 480 190 470 240', 'M 200 260 C 260 240 320 250 380 280',
];
export const Brain: React.FC<{x: number; y: number; scale?: number; amyg?: number; pfc?: number; link?: number; linkDim?: number; labels?: boolean}> = ({x, y, scale = 1, amyg = 0, pfc = 0, link = 0, linkDim = 0, labels = true}) => (
  <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible'}} width={640 * scale} height={440 * scale} viewBox="0 0 640 440">
    <defs>
      <radialGradient id="ag"><stop offset="0" stopColor={C.amyg} stopOpacity="0.95" /><stop offset="1" stopColor={C.amyg} stopOpacity="0" /></radialGradient>
      <radialGradient id="pg"><stop offset="0" stopColor={C.pfc} stopOpacity="0.9" /><stop offset="1" stopColor={C.pfc} stopOpacity="0" /></radialGradient>
    </defs>
    <path d={BRAIN} fill="#1e2a44" stroke="#8aa0c8" strokeWidth={3} />
    {GYRI.map((d, i) => <path key={i} d={d} fill="none" stroke="#3d4f74" strokeWidth={3} strokeLinecap="round" />)}
    {link > 0 && (
      <path d="M 150 190 C 190 240 250 290 300 292" fill="none" stroke={`rgba(220,230,255,${0.85 * link * (1 - 0.7 * linkDim)})`} strokeWidth={6 - 3.5 * linkDim} strokeDasharray={linkDim > 0 ? '10 10' : undefined} strokeLinecap="round" />
    )}
    {pfc > 0 && <circle cx={150} cy={188} r={30 + 26 * pfc} fill="url(#pg)" opacity={pfc} />}
    {pfc > 0 && <circle cx={150} cy={188} r={12} fill={C.pfc} opacity={pfc} />}
    <circle cx={302} cy={292} r={22 + 50 * amyg} fill="url(#ag)" opacity={Math.min(1, 0.3 + amyg)} />
    <ellipse cx={302} cy={292} rx={15} ry={10} fill={C.amyg} transform="rotate(-20 302 292)" />
    {labels && (
      <g fontFamily={FONT} fontWeight={700} fontSize={28} fill={C.text}>
        <text x={330} y={346}>扁桃体</text>
        {pfc > 0 && <text x={40} y={140} fill={C.pfc} opacity={pfc}>前頭前野（内側）</text>}
      </g>
    )}
  </svg>
);

// ---------- people icon ----------
const Person: React.FC<{x: number; y: number; s?: number; color?: string; o?: number}> = ({x, y, s = 1, color = '#c9d6ee', o = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <circle cx={0} cy={-36} r={13} fill={color} />
    <path d="M -22 12 C -22 -10 -12 -19 0 -19 C 12 -19 22 -10 22 12 Q 0 17 -22 12 Z" fill={color} />
    <circle cx={-4} cy={-40} r={4} fill="rgba(255,255,255,0.35)" />
  </g>
);

export const Conditions: React.FC<{f: number}> = ({f}) => {
  const {fps} = useVideoConfig();
  // phase 1: 26 participants; phase 2 (from L4): two conditions
  const p2 = 140; // frames from scene start when L4 begins (19.25s - 14.4s ≈ 4.85s)
  const icons = Array.from({length: 26}, (_, i) => i);
  const up = interpolate(f, [p2 - 10, p2 + 10], [0, 1], clamp);
  return (
    <Board>
      <Cite />
      <div style={{position: 'absolute', left: 56, top: 48, padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', fontSize: 26, fontWeight: 700}}>研究の条件（模式図）</div>
      <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080}>
        {icons.map((i) => {
          const sp = spring({frame: f - 4 - i * 1.2, fps, config: {damping: 14}});
          const col = i % 13, row = Math.floor(i / 13);
          const bx = 960 - 6 * 92 + col * 92, by = 300 + row * 120;
          const ty = interpolate(up, [0, 1], [by, 205 + row * 62]);
          const tx = interpolate(up, [0, 1], [bx, 960 - 6 * 50 + col * 50]);
          return <Person key={i} x={tx} y={ty} s={interpolate(up, [0, 1], [1.25, 0.66]) * sp} o={sp} />;
        })}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: interpolate(up, [0, 1], [580, 330]), textAlign: 'center', fontSize: interpolate(up, [0, 1], [54, 38]), fontWeight: 800,
        opacity: interpolate(f, [18, 30], [0, 1], clamp)}}>健康な18〜30歳　26人</div>
      {/* two conditions */}
      {[
        {label: '断眠グループ', color: C.wake, text: '約35時間、連続で起きている', sleep: false, d: 0},
        {label: '通常睡眠グループ', color: C.sleep, text: '夜は普段どおり眠る', sleep: true, d: 22},
      ].map((g, i) => {
        const a = interpolate(f, [p2 + g.d, p2 + g.d + 14], [0, 1], clamp);
        const grow = interpolate(f, [p2 + g.d + 6, p2 + g.d + 60], [0, 1], clamp);
        const top = 420 + i * 180;
        return (
          <div key={i} style={{position: 'absolute', left: 120, top, width: 1300, height: 150, opacity: a, transform: `translateY(${(1 - a) * 20}px)`}}>
            <div style={{position: 'absolute', left: 0, top: 0, fontSize: 38, fontWeight: 800, color: g.color}}>{g.label}</div>
            <div style={{position: 'absolute', left: 0, top: 70, width: 1300, height: 54, borderRadius: 27, background: 'rgba(255,255,255,0.07)', overflow: 'hidden'}}>
              {!g.sleep && <div style={{height: '100%', width: `${grow * 100}%`, background: `linear-gradient(90deg, ${C.wake}cc, ${C.wake})`}} />}
              {g.sleep && (
                <>
                  <div style={{position: 'absolute', left: 0, height: '100%', width: `${Math.min(grow / 0.4, 1) * 40}%`, background: `${C.wake}88`}} />
                  <div style={{position: 'absolute', left: '40%', height: '100%', width: `${Math.max(0, Math.min((grow - 0.4) / 0.25, 1)) * 25}%`, background: `linear-gradient(90deg, #2c4a7a, ${C.sleep})`}} />
                  <div style={{position: 'absolute', left: '65%', height: '100%', width: `${Math.max(0, (grow - 0.65) / 0.35) * 35}%`, background: `${C.wake}88`}} />
                </>
              )}
              <div style={{position: 'absolute', left: 30, top: 6, fontSize: 32, fontWeight: 700, color: '#0b1020', opacity: interpolate(grow, [0.5, 0.8], [0, 1], clamp)}}>
                {g.sleep ? '' : g.text}
              </div>
              {g.sleep && (
                <div style={{position: 'absolute', left: '41%', top: 6, fontSize: 30, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 10, opacity: interpolate(grow, [0.55, 0.75], [0, 1], clamp)}}>
                  <svg width={30} height={30} viewBox="0 0 30 30"><path d="M 20 4 A 12 12 0 1 0 26 21 A 10 10 0 1 1 20 4 Z" fill="#fff6d8" /></svg>
                  {g.text}
                </div>
              )}
            </div>
          </div>
        );
      })}
      <Clock f={f - p2 - 6} />
      <div style={{position: 'absolute', left: 120, top: 800, fontSize: 26, color: C.sub, opacity: interpolate(f, [p2 + 70, p2 + 85], [0, 1], clamp)}}>
        その後、両グループともMRI装置の中で画像を見て、脳の反応を測定
      </div>
    </Board>
  );
};

// 35-hour counter dial for the sleep-deprived condition (day/night ring)
const Clock: React.FC<{f: number}> = ({f}) => {
  const k = interpolate(f, [0, 54], [0, 1], clamp);
  const hours = Math.round(35 * k);
  const a = interpolate(f, [-8, 4], [0, 1], clamp);
  const cx = 1610, cy = 560, r = 120;
  const arc = (frac: number) => {
    const ang = frac * Math.PI * 2 * (35 / 24) - Math.PI / 2;
    return ang;
  };
  // ring: draws 35/24 turns; second lap drawn inside
  const lap = (from: number, to: number, rr: number) => {
    if (to <= from) return null;
    const a0 = from * Math.PI * 2 - Math.PI / 2, a1 = to * Math.PI * 2 - Math.PI / 2;
    const large = to - from > 0.5 ? 1 : 0;
    return <path d={`M ${cx + rr * Math.cos(a0)} ${cy + rr * Math.sin(a0)} A ${rr} ${rr} 0 ${large} 1 ${cx + rr * Math.cos(a1)} ${cy + rr * Math.sin(a1)}`} fill="none" stroke={C.wake} strokeWidth={16} strokeLinecap="round" />;
  };
  const turns = (35 / 24) * k;
  void arc;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, opacity: a}} width={1920} height={1080} fontFamily={FONT}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={16} />
      <circle cx={cx} cy={cy} r={r - 26} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
      {lap(0, Math.min(1, turns) - 0.0001, r)}
      {turns > 1 && <path d={(() => { const rr = r - 26; const a0 = -Math.PI / 2, a1 = (turns - 1) * Math.PI * 2 - Math.PI / 2; return `M ${cx + rr * Math.cos(a0)} ${cy + rr * Math.sin(a0)} A ${rr} ${rr} 0 ${turns - 1 > 0.5 ? 1 : 0} 1 ${cx + rr * Math.cos(a1)} ${cy + rr * Math.sin(a1)}`; })()} fill="none" stroke={C.wake} strokeOpacity={0.75} strokeWidth={10} strokeLinecap="round" />}
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize={64} fontWeight={900} fill={C.text}>{hours}</text>
      <text x={cx} y={cy + 48} textAnchor="middle" fontSize={21} fontWeight={700} fill={C.sub}>時間 起きている</text>
      <text x={cx} y={cy - r - 30} textAnchor="middle" fontSize={26} fontWeight={800} fill={C.wake}>断眠グループ</text>
    </svg>
  );
};

// ---------- result: index bars ----------
export const Result: React.FC<{f: number}> = ({f}) => {
  const {fps} = useVideoConfig();
  const g1 = spring({frame: f - 14, fps, config: {damping: 14, stiffness: 90, mass: 0.8}});
  const g2 = spring({frame: f - 70, fps, config: {damping: 14, stiffness: 70, mass: 0.9}});
  const base = 770, unit = 2.55; // px per index point
  const bar = (v: number, x: number, color: string, label: string, grow: number, prefix: string) => (
    <g>
      <defs>
        <linearGradient id={`bg${x}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} /><stop offset="1" stopColor={color} stopOpacity={0.7} /></linearGradient>
      </defs>
      <rect x={x} y={base - v * unit * grow} width={170} height={Math.max(0, v * unit * grow)} rx={10} fill={`url(#bg${x})`} />
      <rect x={x} y={base - v * unit * grow} width={170} height={6} rx={3} fill="rgba(255,255,255,0.45)" opacity={grow > 0.05 ? 1 : 0} />
      <text x={x + 85} y={base + 50} textAnchor="middle" fontSize={34} fontWeight={800} fill={C.text}>{label}</text>
      <text x={x + 85} y={base - v * unit * grow - 22} textAnchor="middle" fontSize={56} fontWeight={900} fill={color} opacity={interpolate(grow, [0.1, 0.4], [0, 1], clamp)}>
        {grow > 0.98 ? prefix : ''}{Math.round(v * Math.min(1, grow))}
      </text>
    </g>
  );
  const bracketLen = 2 * 45 + 60 * unit;
  const bk = interpolate(f, [108, 126], [0, 1], clamp);
  return (
    <Board>
      <Cite />
      <div style={{position: 'absolute', left: 56, top: 48, padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', fontSize: 26, fontWeight: 700}}>結果（説明図）</div>
      <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080} fontFamily={FONT}>
        <text x={860} y={170} fontSize={36} fontWeight={800} fill={C.text}>不快な画像への扁桃体の反応</text>
        <text x={860} y={214} fontSize={26} fill={C.sub}>通常睡眠グループ＝100とした指数</text>
        <line x1={860} x2={1420} y1={base} y2={base} stroke="#8aa0c8" strokeWidth={3} />
        <line x1={860} x2={1420} y1={base - 100 * unit} y2={base - 100 * unit} stroke="rgba(255,255,255,0.25)" strokeDasharray="8 8" strokeWidth={2} />
        {bar(100, 910, C.sleep, '通常睡眠', g1, '')}
        {bar(160, 1170, C.wake, '断眠', g2, '約')}
        <g>
          <path strokeDasharray={bracketLen} strokeDashoffset={bracketLen * (1 - bk)} d={`M 1355 ${base - 100 * unit} L 1400 ${base - 100 * unit} L 1400 ${base - 160 * unit} L 1355 ${base - 160 * unit}`} fill="none" stroke={C.warn} strokeWidth={3} />
          <text x={1415} y={base - 133 * unit} fontSize={36} fontWeight={900} fill={C.warn} opacity={interpolate(f, [120, 130], [0, 1], clamp)}>約60%</text>
          <text x={1415} y={base - 133 * unit + 42} fontSize={36} fontWeight={900} fill={C.warn} opacity={interpolate(f, [120, 130], [0, 1], clamp)}>大きい</text>
        </g>
      </svg>
      <div style={{position: 'absolute', left: 860, top: 236, width: 900, fontSize: 22, lineHeight: 1.5, color: C.sub, opacity: interpolate(f, [24, 40], [0, 1], clamp)}}>
        「約60%大きい」を指数にした説明図（fMRIの信号値ではありません）
      </div>
    </Board>
  );
};

// ---------- connectivity: co-varying activity (schematic waves) ----------
const wave = (t: number, seed: number) => Math.sin(t * 1.3 + seed) * 0.6 + Math.sin(t * 2.9 + seed * 2.1) * 0.3 + Math.sin(t * 5.3 + seed * 0.7) * 0.15;
const Trace: React.FC<{f: number; x: number; y: number; w: number; h: number; coupled: boolean}> = ({f, x, y, w, h, coupled}) => {
  const t0 = f / 30;
  const N = 120;
  const pts = (fn: (t: number) => number, off: number) =>
    Array.from({length: N + 1}, (_, i) => {
      const t = t0 + (i / N) * 6;
      return `${x + (i / N) * w},${y + off - fn(t) * h * 0.28}`;
    }).join(' ');
  const pfc = (t: number) => wave(t, 0.3);
  const amy = coupled ? (t: number) => wave(t, 0.3) * 0.95 + wave(t, 4.0) * 0.12 : (t: number) => wave(t, 2.4) * 1.25;
  return (
    <g>
      <polyline points={pts(pfc, h * 0.3)} fill="none" stroke={C.pfc} strokeWidth={4} />
      <polyline points={pts(amy, h * 0.72)} fill="none" stroke={C.amyg} strokeWidth={4} />
    </g>
  );
};
export const Connectivity: React.FC<{f: number}> = ({f}) => {
  const a = interpolate(f, [6, 20], [0, 1], clamp);
  const b = interpolate(f, [40, 56], [0, 1], clamp);
  return (
    <Board>
      <Cite />
      <div style={{position: 'absolute', left: 56, top: 48, padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', fontSize: 26, fontWeight: 700}}>機能的結合（模式図）</div>
      <svg style={{position: 'absolute', left: 0, top: 0}} width={1920} height={1080} fontFamily={FONT}>
        {[{label: '通常睡眠', coupled: true, y: 190, o: a, col: C.sleep, verdict: '活動が一緒に動く'}, {label: '断眠', coupled: false, y: 500, o: b, col: C.wake, verdict: '一緒に動きにくい'}].map((p) => (
          <g key={p.label} opacity={p.o}>
            <rect x={780} y={p.y} width={1080} height={260} rx={16} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" />
            <text x={810} y={p.y + 50} fontSize={34} fontWeight={800} fill={p.col}>{p.label}</text>
            <text x={1830} y={p.y + 50} fontSize={30} fontWeight={800} fill={C.text} textAnchor="end">{p.verdict}</text>
            <Trace f={f} x={810} y={p.y + 70} w={1020} h={180} coupled={p.coupled} />
          </g>
        ))}
        <g fontSize={24} fontWeight={700}>
          <rect x={810} y={790} width={22} height={6} fill={C.pfc} /><text x={842} y={800} fill={C.text}>前頭前野（内側）</text>
          <rect x={1060} y={790} width={22} height={6} fill={C.amyg} /><text x={1092} y={800} fill={C.text}>扁桃体</text>
        </g>
      </svg>
      <div style={{position: 'absolute', left: 780, top: 815, width: 1080, fontSize: 23, lineHeight: 1.5, color: C.sub}}>
        機能的結合＝2つの部位の活動が、時間とともに一緒に変動する度合い。<br />波形は説明用の模式で、実測データではありません。神経の配線が切れるという意味でもありません。
      </div>
    </Board>
  );
};

// ---------- what we can / cannot say ----------
export const Limits: React.FC<{f: number}> = ({f}) => {
  const items = (arr: string[], start: number, mark: string, color: string) =>
    arr.map((s, i) => {
      const o = interpolate(f, [start + i * 10, start + i * 10 + 10], [0, 1], clamp);
      return (
        <div key={i} style={{display: 'flex', gap: 18, alignItems: 'flex-start', fontSize: 38, fontWeight: 700, lineHeight: 1.4, marginTop: 26, opacity: o, transform: `translateX(${(1 - o) * 16}px)`}}>
          <span style={{color, fontWeight: 900, width: 40}}>{mark}</span><span>{s}</span>
        </div>
      );
    });
  return (
    <Board>
      <Cite />
      <div style={{position: 'absolute', left: 120, top: 150, width: 780}}>
        <div style={{fontSize: 40, fontWeight: 900, color: C.pfc, borderBottom: `3px solid ${C.pfc}`, paddingBottom: 12}}>この研究で言えること</div>
        {items(['一晩眠らないと、不快な画像への扁桃体の反応が大きかった', '扁桃体と前頭前野の活動の連動が弱かった'], 6, '○', C.pfc)}
      </div>
      <div style={{position: 'absolute', left: 1020, top: 150, width: 780}}>
        <div style={{fontSize: 40, fontWeight: 900, color: C.wake, borderBottom: `3px solid ${C.wake}`, paddingBottom: 12}}>言えないこと</div>
        {items(['怒りが60%増える', '性格が変わる', 'どの年代・どんな状況でも同じになる'], 60, '×', C.wake)}
      </div>
      <div style={{position: 'absolute', left: 120, right: 120, top: 760, fontSize: 26, color: C.sub, opacity: interpolate(f, [90, 105], [0, 1], clamp)}}>
        対象：健康な18〜30歳の26人／条件：約35時間の断眠と通常睡眠の比較／測定：画像を見ているときのfMRI
      </div>
    </Board>
  );
};

// ---------- "100 images" strip during the MRI re-enactment ----------
export const ImageStrip: React.FC<{f: number}> = ({f}) => {
  const count = Math.min(100, Math.max(1, Math.floor(interpolate(f, [20, 140], [1, 100], clamp))));
  const u = (count - 1) / 99;
  const tone = (k: number) => {
    // abstract tiles only: from calm grey-blue (neutral) to dark red (unpleasant)
    const r = Math.round(interpolate(k, [0, 1], [150, 120])), g = Math.round(interpolate(k, [0, 1], [165, 40])), b = Math.round(interpolate(k, [0, 1], [185, 45]));
    return `rgb(${r},${g},${b})`;
  };
  const a = interpolate(f, [8, 20], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', right: 70, top: 150, width: 520, opacity: a, fontFamily: FONT, padding: 24, borderRadius: 16, background: 'rgba(10,14,26,0.78)', border: '1px solid rgba(255,255,255,0.2)'}}>
      <div style={{fontSize: 26, fontWeight: 700, color: '#fff'}}>見る画像（模式）</div>
      <div style={{display: 'flex', gap: 10, marginTop: 16}}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{width: 110, height: 80, borderRadius: 8, background: tone(Math.min(1, u * 1.0 + i * 0.06)), boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.15)'}} />
        ))}
      </div>
      <div style={{marginTop: 16, height: 14, borderRadius: 7, background: `linear-gradient(90deg, ${tone(0)}, ${tone(1)})`}} />
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#dfe6f3', marginTop: 8}}><span>中立</span><span>不快</span></div>
      <div style={{fontSize: 56, fontWeight: 900, color: '#fff', marginTop: 8}}>{count}<span style={{fontSize: 30}}> / 100枚</span></div>
      <div style={{fontSize: 20, color: C.sub, marginTop: 6}}>実際の刺激画像ではありません</div>
    </div>
  );
};

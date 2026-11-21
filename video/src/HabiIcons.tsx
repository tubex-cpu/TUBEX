import React from 'react';

// Original flat illustrations for ① ハビ判事 episodes (no paid/licensed assets).
// Illustrations only: they do not pretend to be photographs, maps or research images.
// The shoebill judge is a stand-in until the owner provides the official character image.

export type HabiIconName =
  | 'shoebill'
  | 'ruins'
  | 'sinking'
  | 'island'
  | 'book'
  | 'tablet'
  | 'codex'
  | 'moai'
  | 'canoe'
  | 'steps'
  | 'sealevel'
  | 'map'
  | 'continents'
  | 'crust'
  | 'guyot'
  | 'wave'
  | 'zealandia'
  | 'glyphs';

const C = {
  moon: '#e9d8a6',
  basalt: '#2b3440',
  basaltLight: '#46525f',
  sea: '#1f5b66',
  seaDeep: '#0c2730',
  foam: '#9fd3cf',
  clay: '#b9895a',
  clayDark: '#7d5634',
  stone: '#8d8a80',
  paper: '#d9c7a0',
  ink: '#3a2a1a',
  land: '#6f8a5a',
  crustLight: '#c9a77a',
  crustDark: '#4a4f5c',
};

const Water: React.FC<{y: number; t: number; opacity?: number}> = ({y, t, opacity = 0.85}) => (
  <g>
    <rect x="0" y={y} width="400" height={400 - y} fill={C.sea} opacity={opacity} />
    <path
      d={`M0 ${y} ${Array.from({length: 9}, (_, i) => `Q ${i * 50 + 25} ${y + Math.sin(t / 14 + i) * 5 - 5} ${(i + 1) * 50} ${y}`).join(' ')}`}
      stroke={C.foam}
      strokeWidth="3"
      fill="none"
      opacity="0.6"
    />
  </g>
);

const Shoebill: React.FC<{t: number}> = ({t}) => {
  const blink = Math.floor(t / 4) % 45 === 0 ? 0.15 : 1;
  const nod = Math.sin(t / 40) * 2;
  return (
    <g transform={`rotate(${nod} 210 260)`}>
      {/* legs */}
      <rect x="185" y="300" width="9" height="80" fill="#3b3f45" />
      <rect x="215" y="300" width="9" height="80" fill="#3b3f45" />
      {/* body */}
      <path d="M150 210 C 140 290 180 320 215 318 C 260 316 285 280 270 220 C 260 180 165 170 150 210 Z" fill="#7d8a96" />
      <path d="M232 200 C 270 215 290 260 268 300 C 258 270 245 240 232 200 Z" fill="#5f6b77" />
      {/* neck + head */}
      <path d="M175 215 C 170 170 180 135 205 125 L 225 140 C 205 160 205 190 210 220 Z" fill="#8995a1" />
      <ellipse cx="205" cy="118" rx="42" ry="38" fill="#8995a1" />
      <path d="M180 88 q -6 -14 6 -18 q 2 10 8 14 Z" fill="#8995a1" />
      {/* the shoe-shaped bill */}
      <path d="M225 100 C 290 96 330 118 334 140 C 336 152 322 156 314 150 C 290 150 250 150 225 140 Z" fill="#d8c79c" />
      <path d="M226 128 C 260 134 300 140 322 146" stroke="#a8956a" strokeWidth="3" fill="none" />
      <path d="M326 134 q 12 8 6 18" stroke="#a8956a" strokeWidth="4" fill="none" />
      {/* the famous stare */}
      <circle cx="214" cy="108" r="9" fill="#f4f0d8" />
      <ellipse cx="216" cy="108" rx="4.5" ry={4.5 * blink} fill="#1a1f24" />
      <path d="M203 98 L 226 101" stroke="#4d5660" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
};

const Ruins: React.FC<{t: number}> = ({t}) => {
  const logs = (x: number, y: number, w: number, rows: number, flip = false) =>
    Array.from({length: rows}, (_, r) => (
      <rect
        key={`${x}-${r}`}
        x={x + (r % 2 === (flip ? 1 : 0) ? 0 : 6)}
        y={y - r * 16}
        width={w}
        height={14}
        rx={6}
        fill={r % 2 ? C.basalt : C.basaltLight}
      />
    ));
  return (
    <g>
      <circle cx="320" cy="70" r="34" fill={C.moon} opacity={0.85 + Math.sin(t / 30) * 0.1} />
      {logs(40, 290, 150, 9)}
      {logs(210, 300, 150, 7, true)}
      <rect x="120" y="230" width="60" height="70" fill={C.seaDeep} opacity="0.8" />
      <Water y={300} t={t} />
    </g>
  );
};

const Sinking: React.FC<{t: number}> = ({t}) => {
  const sink = (Math.sin(t / 50) + 1) * 8;
  return (
    <g>
      <rect x="0" y="0" width="400" height="400" fill={C.seaDeep} opacity="0.4" />
      <path d={`M40 ${180 + sink} L 110 ${130 + sink} L 170 ${160 + sink} L 250 ${120 + sink} L 340 ${170 + sink} L 360 ${260 + sink} L 40 ${260 + sink} Z`} fill={C.land} opacity="0.75" />
      <Water y={175} t={t} opacity={0.7} />
      {Array.from({length: 6}, (_, i) => (
        <circle key={i} cx={70 + i * 50} cy={330 - ((t * 1.5 + i * 40) % 140)} r={4 + (i % 3)} fill={C.foam} opacity="0.5" />
      ))}
    </g>
  );
};

const Island: React.FC<{t: number}> = ({t}) => (
  <g>
    <circle cx="80" cy="80" r="26" fill={C.moon} opacity="0.8" />
    <path d="M110 260 C 140 170 190 140 220 150 C 260 160 290 210 310 260 Z" fill={C.land} />
    <path d="M190 160 l 10 -40 l 12 40 Z" fill="#4f6a43" />
    <ellipse cx="210" cy="262" rx="120" ry="10" fill="none" stroke={C.moon} strokeWidth="3" strokeDasharray="10 10" opacity={0.6 + Math.sin(t / 10) * 0.3} />
    <Water y={260} t={t} />
  </g>
);

const Book: React.FC<{t: number}> = ({t}) => (
  <g transform={`translate(0 ${Math.sin(t / 25) * 4})`}>
    <rect x="110" y="80" width="190" height="250" rx="8" fill="#5a3b2a" />
    <rect x="122" y="92" width="166" height="226" rx="4" fill="none" stroke={C.moon} strokeWidth="3" />
    <circle cx="205" cy="190" r="44" fill="none" stroke={C.moon} strokeWidth="4" />
    <path d="M161 190 h 88 M205 146 v 88" stroke={C.moon} strokeWidth="3" />
    <rect x="300" y="88" width="14" height="236" fill="#e8dcc0" />
    <text x="205" y="290" textAnchor="middle" fontSize="26" fill={C.moon} fontFamily="serif">1926</text>
  </g>
);

const Tablet: React.FC<{t: number}> = ({t}) => (
  <g transform={`rotate(${Math.sin(t / 40) * 2} 200 200)`}>
    <path d="M100 90 Q 95 80 110 78 L 300 70 Q 315 70 312 85 L 318 310 Q 318 325 303 326 L 108 330 Q 92 330 94 315 Z" fill={C.clay} />
    {Array.from({length: 7}, (_, r) => (
      <g key={r}>
        {Array.from({length: 6}, (_, c) => (
          <path key={c} d={`M${125 + c * 30} ${105 + r * 30} l 14 6 l -14 6 Z`} fill={C.clayDark} opacity={0.35 + ((r + c) % 3) * 0.2} />
        ))}
      </g>
    ))}
    <path d="M110 200 L 300 190" stroke="#1a1208" strokeWidth="6" opacity="0.35" />
    <text x="205" y="365" textAnchor="middle" fontSize="40" fill={C.moon} opacity={0.6 + Math.sin(t / 12) * 0.3}>?</text>
  </g>
);

const Codex: React.FC<{t: number}> = ({t}) => {
  const panels = [0, 1, 2, 3];
  return (
    <g transform={`translate(0 ${Math.sin(t / 25) * 4})`}>
      {panels.map((i) => (
        <g key={i} transform={`translate(${50 + i * 78} ${100 + (i % 2) * 14}) skewY(${i % 2 ? -6 : 6})`}>
          <rect width="74" height="200" fill={C.paper} stroke="#9b7d4f" strokeWidth="2" />
          {[0, 1, 2, 3].map((r) => (
            <g key={r}>
              <rect x="10" y={14 + r * 46} width="24" height="24" rx="8" fill="#8c3b2a" opacity="0.75" />
              <rect x="40" y={14 + r * 46} width="24" height="24" rx="8" fill="#2f5d62" opacity="0.7" />
            </g>
          ))}
        </g>
      ))}
    </g>
  );
};

const Moai: React.FC<{t: number}> = ({t}) => (
  <g>
    <circle cx="330" cy="70" r="28" fill={C.moon} opacity="0.8" />
    <rect x="30" y="300" width="340" height="30" fill="#5d5a52" />
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${70 + i * 100} 0)`}>
        <path d="M10 300 L 14 170 Q 14 120 40 112 L 62 112 Q 78 118 76 150 L 80 300 Z" fill={C.stone} />
        <rect x="16" y="104" width="58" height="16" fill="#7a776e" />
        <path d="M30 150 L 62 150" stroke="#55534c" strokeWidth="6" />
        <path d="M58 158 L 68 200 L 54 202" stroke="#55534c" strokeWidth="5" fill="none" />
        <path d="M36 222 L 64 222" stroke="#55534c" strokeWidth="5" />
      </g>
    ))}
    <Water y={340} t={t} />
  </g>
);

const Canoe: React.FC<{t: number}> = ({t}) => {
  const bob = Math.sin(t / 12) * 4;
  return (
    <g>
      {Array.from({length: 12}, (_, i) => (
        <circle key={i} cx={(i * 83) % 400} cy={30 + ((i * 47) % 130)} r={2 + (i % 2)} fill={C.moon} opacity={0.4 + 0.4 * Math.sin(t / 9 + i)} />
      ))}
      <g transform={`translate(0 ${bob})`}>
        <path d="M200 120 L 200 250" stroke="#6b4a2f" strokeWidth="6" />
        <path d="M200 125 L 290 240 L 200 240 Z" fill="#c7a46a" />
        <path d="M200 140 L 130 240 L 200 240 Z" fill="#a5844f" />
        <path d="M80 262 Q 200 300 320 262 L 310 276 Q 200 306 90 276 Z" fill="#5b3a22" />
        <path d="M90 250 Q 200 284 310 250 L 304 262 Q 200 292 96 262 Z" fill="#6f4a2c" />
      </g>
      <Water y={280} t={t} />
    </g>
  );
};

const Steps: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect x="0" y="0" width="400" height="400" fill={C.sea} opacity="0.55" />
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={60 + i * 50} y={150 + i * 40} width={290 - i * 50} height={250 - i * 40} fill={i % 2 ? '#3f5560' : '#4c6470'} />
    ))}
    {Array.from({length: 8}, (_, i) => (
      <circle key={i} cx={40 + i * 45} cy={360 - ((t * 1.2 + i * 50) % 330)} r={3 + (i % 3)} fill={C.foam} opacity="0.45" />
    ))}
    <path d="M0 40 Q 100 20 200 40 T 400 40" stroke={C.foam} strokeWidth="3" fill="none" opacity="0.5" />
  </g>
);

const SeaLevel: React.FC<{t: number}> = ({t}) => {
  const rise = 260 - ((Math.sin(t / 40) + 1) / 2) * 90;
  return (
    <g>
      <path d="M0 230 L 80 200 L 160 220 L 240 180 L 320 210 L 400 190 L 400 400 L 0 400 Z" fill={C.land} />
      <path d="M120 215 l 0 -24 l 10 0 l 0 24" stroke="#4f6a43" strokeWidth="6" fill="none" />
      <Water y={rise} t={t} opacity={0.8} />
      <path d="M370 360 L 370 170" stroke={C.moon} strokeWidth="4" />
      <path d="M360 185 L 370 165 L 380 185 Z" fill={C.moon} />
    </g>
  );
};

const ChartMap: React.FC<{t: number}> = ({t}) => {
  const fade = 0.15 + ((Math.sin(t / 20) + 1) / 2) * 0.7;
  return (
    <g>
      <rect x="40" y="60" width="320" height="280" fill={C.paper} />
      {[1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <line x1={40 + i * 53} y1="60" x2={40 + i * 53} y2="340" stroke="#a48b5f" strokeWidth="1.5" />
          <line x1="40" y1={60 + i * 47} x2="360" y2={60 + i * 47} stroke="#a48b5f" strokeWidth="1.5" />
        </g>
      ))}
      <path d="M60 280 C 90 250 100 300 130 290 L 120 340 L 60 340 Z" fill="#9db08a" />
      <path d="M210 160 C 225 150 240 175 232 200 C 226 225 214 230 208 210 C 204 190 200 170 210 160 Z" fill="#9db08a" stroke={C.ink} strokeWidth="2" strokeDasharray="5 4" opacity={fade} />
      <text x="250" y="190" fontSize="20" fill={C.ink} opacity={fade}>?</text>
    </g>
  );
};

const Continents: React.FC<{t: number}> = ({t}) => {
  const gap = (Math.sin(t / 35) + 1) * 30;
  return (
    <g>
      <rect x="0" y="0" width="400" height="400" fill={C.sea} opacity="0.45" />
      <path d={`M${60 - gap} 110 C ${110 - gap} 80 ${170 - gap} 120 ${190 - gap} 170 C ${200 - gap} 230 ${150 - gap} 300 ${90 - gap} 290 C ${50 - gap} 260 ${40 - gap} 170 ${60 - gap} 110 Z`} fill={C.land} />
      <path d={`M${215 + gap} 150 C ${260 + gap} 120 ${330 + gap} 150 ${340 + gap} 200 C ${345 + gap} 260 ${290 + gap} 300 ${240 + gap} 280 C ${205 + gap} 250 ${200 + gap} 190 ${215 + gap} 150 Z`} fill="#86a06e" />
      <path d={`M${180} 330 L ${220} 330`} stroke={C.moon} strokeWidth="4" />
      <path d="M170 330 l 14 -8 l 0 16 Z M230 330 l -14 -8 l 0 16 Z" fill={C.moon} />
    </g>
  );
};

const Crust: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect x="0" y="250" width="400" height="150" fill="#7a3b2a" opacity="0.6" />
    <rect x="20" y="110" width="170" height="150" fill={C.crustLight} transform={`translate(0 ${Math.sin(t / 30) * 3})`} />
    <path d="M20 110 L 60 80 L 110 100 L 150 70 L 190 110 Z" fill={C.land} />
    <rect x="190" y="200" width="190" height="45" fill={C.crustDark} />
    <rect x="190" y="130" width="190" height="70" fill={C.sea} opacity="0.85" />
    <text x="105" y="200" textAnchor="middle" fontSize="22" fill="#4a3422">大陸</text>
    <text x="285" y="232" textAnchor="middle" fontSize="20" fill="#e6e6e6">海底</text>
  </g>
);

const Guyot: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect x="0" y="60" width="400" height="340" fill={C.seaDeep} opacity="0.85" />
    <path d={`M0 60 ${Array.from({length: 8}, (_, i) => `Q ${i * 50 + 25} ${55 + Math.sin(t / 14 + i) * 4} ${(i + 1) * 50} 60`).join(' ')}`} stroke={C.foam} strokeWidth="3" fill="none" />
    <path d="M60 380 L 150 190 L 250 190 L 340 380 Z" fill="#3e4b55" />
    <rect x="150" y="182" width="100" height="10" fill="#d9a7a0" opacity="0.8" />
    <path d="M200 70 L 200 175" stroke={C.moon} strokeWidth="3" strokeDasharray="8 8" />
  </g>
);

const Wave: React.FC<{t: number}> = ({t}) => (
  <g>
    <path d="M40 300 L 40 240 L 90 210 L 140 240 L 140 300 Z" fill="#c9b48a" />
    <rect x="75" y="260" width="28" height="40" fill="#6b4a2f" />
    <path d="M220 300 C 240 200 330 170 380 220 C 340 215 320 240 330 270 L 380 300 Z" fill={C.sea} />
    <path d="M330 270 C 320 240 340 215 380 220" stroke={C.foam} strokeWidth="6" fill="none" transform={`translate(${Math.sin(t / 15) * 5} 0)`} />
    <rect x="0" y="300" width="400" height="100" fill="#5d5a52" />
    <path d="M150 340 L 170 320 L 190 340" stroke={C.moon} strokeWidth="6" fill="none" />
  </g>
);

const Zealandia: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect x="0" y="0" width="400" height="400" fill={C.seaDeep} opacity="0.6" />
    <path d="M40 260 C 60 200 120 170 200 175 C 280 180 350 210 370 270 C 300 300 120 305 40 260 Z" fill="#5f7d6a" opacity="0.55" />
    <path d="M150 180 L 175 150 L 190 178 Z M230 182 L 255 140 L 275 185 Z" fill={C.land} />
    <Water y={180} t={t} opacity={0.55} />
    <text x="200" y="250" textAnchor="middle" fontSize="40" fill={C.moon} fontWeight="900">94%</text>
  </g>
);

const Glyphs: React.FC<{t: number}> = ({t}) => (
  <g transform={`rotate(-4 200 200)`}>
    <rect x="60" y="110" width="290" height="180" rx="40" fill="#6b4a2f" />
    {[0, 1, 2, 3].map((r) => (
      <g key={r} opacity={0.5 + 0.4 * Math.sin(t / 15 + r)}>
        {Array.from({length: 8}, (_, c) => {
          const x = 90 + c * 31;
          const y = 140 + r * 38;
          const k = (r * 8 + c) % 4;
          return k === 0 ? (
            <path key={c} d={`M${x} ${y + 20} l 8 -20 l 8 20 M${x + 8} ${y} v -6`} stroke={C.paper} strokeWidth="3" fill="none" />
          ) : k === 1 ? (
            <path key={c} d={`M${x} ${y + 10} q 10 -14 18 0 q -8 12 -18 0`} stroke={C.paper} strokeWidth="3" fill="none" />
          ) : k === 2 ? (
            <circle key={c} cx={x + 9} cy={y + 10} r="8" stroke={C.paper} strokeWidth="3" fill="none" />
          ) : (
            <path key={c} d={`M${x} ${y} l 18 20 M${x + 18} ${y} l -18 20`} stroke={C.paper} strokeWidth="3" />
          );
        })}
      </g>
    ))}
  </g>
);

const MAP: Record<HabiIconName, React.FC<{t: number}>> = {
  shoebill: Shoebill,
  ruins: Ruins,
  sinking: Sinking,
  island: Island,
  book: Book,
  tablet: Tablet,
  codex: Codex,
  moai: Moai,
  canoe: Canoe,
  steps: Steps,
  sealevel: SeaLevel,
  map: ChartMap,
  continents: Continents,
  crust: Crust,
  guyot: Guyot,
  wave: Wave,
  zealandia: Zealandia,
  glyphs: Glyphs,
};

export const isHabiIcon = (name: string): name is HabiIconName => name in MAP;

export const HabiIcon: React.FC<{name: HabiIconName; t: number; size?: number}> = ({name, t, size = 520}) => {
  const Comp = MAP[name];
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" style={{borderRadius: 32, overflow: 'hidden'}}>
      <Comp t={t} />
    </svg>
  );
};

// Small judge in the corner for verdict scenes.
export const JudgeBadge: React.FC<{t: number; size?: number}> = ({t, size = 260}) => (
  <svg width={size} height={size} viewBox="0 0 400 400">
    <Shoebill t={t} />
  </svg>
);

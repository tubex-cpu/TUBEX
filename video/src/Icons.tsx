import React from 'react';
import {IconName, theme} from './types';

// Simple flat illustrations so no paid/licensed image assets are needed.
const Hydra: React.FC<{t: number}> = ({t}) => {
  const sway = (i: number) => Math.sin(t / 12 + i) * 10;
  const tentacles = [-60, -30, 0, 30, 60];
  return (
    <g>
      <ellipse cx="200" cy="370" rx="70" ry="18" fill="#6b4f2a" />
      <path d="M170 370 C 165 280, 175 200, 180 150 L 220 150 C 225 200, 235 280, 230 370 Z" fill="#7be0a6" />
      {tentacles.map((a, i) => (
        <path
          key={i}
          d={`M200 150 Q ${200 + a + sway(i)} ${90 - Math.abs(a) / 3} ${200 + a * 1.8 + sway(i) * 2} ${40 + Math.abs(a) / 2}`}
          stroke="#7be0a6"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
      ))}
      <circle cx="200" cy="155" r="22" fill="#5cc98c" />
      <path d="M182 250 q 8 8 16 0 M206 250 q 8 8 16 0" stroke="#1d2a6b" strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cx="202" cy="275" rx="6" ry="4" fill="#1d2a6b" />
    </g>
  );
};

const Jellyfish: React.FC<{t: number}> = ({t}) => {
  const pulse = 1 + Math.sin(t / 10) * 0.05;
  return (
    <g transform={`translate(200 200) scale(${pulse}) translate(-200 -200)`}>
      <path d="M90 200 Q 200 30 310 200 Z" fill={theme.pink} opacity="0.9" />
      {[120, 160, 200, 240, 280].map((x, i) => (
        <path
          key={x}
          d={`M${x} 200 q ${Math.sin(t / 8 + i) * 15} 50 0 100 q ${-Math.sin(t / 8 + i) * 15} 50 0 90`}
          stroke={theme.pink}
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
          opacity="0.75"
        />
      ))}
      <circle cx="165" cy="150" r="8" fill="#fff" opacity="0.7" />
    </g>
  );
};

const Bird: React.FC<{t: number}> = ({t}) => {
  const flap = Math.sin(t / 6) * 25;
  return (
    <g transform={`translate(0 ${Math.sin(t / 15) * 10})`}>
      <path d={`M200 210 Q 120 ${150 - flap} 30 ${170 - flap}`} stroke="#222a55" strokeWidth="26" fill="none" strokeLinecap="round" />
      <path d={`M200 210 Q 280 ${150 - flap} 370 ${170 - flap}`} stroke="#222a55" strokeWidth="26" fill="none" strokeLinecap="round" />
      <ellipse cx="200" cy="215" rx="55" ry="28" fill="#2c356b" />
      <circle cx="252" cy="200" r="20" fill="#2c356b" />
      <path d="M268 200 L 310 210 L 268 212 Z" fill="#c9c9c9" />
      <ellipse cx="225" cy="235" rx="22" ry="16" fill="#e8344a" />
      <path d="M246 196 q 8 -6 14 0" stroke="#fff" strokeWidth="4" fill="none" />
    </g>
  );
};

const Brain: React.FC<{t: number}> = ({t}) => (
  <g transform={`translate(0 ${Math.sin(t / 15) * 6})`}>
    <path
      d="M120 230 C 70 220 70 140 125 130 C 120 80 190 60 210 100 C 240 60 320 80 305 135 C 350 145 345 225 290 230 C 280 280 200 290 195 250 C 170 285 110 270 120 230 Z"
      fill="#ffb3c7"
      stroke="#e0789a"
      strokeWidth="8"
    />
    <path d="M200 105 C 190 160 215 200 195 250" stroke="#e0789a" strokeWidth="7" fill="none" />
    <path d="M140 160 q 30 10 40 40 M250 150 q -20 30 10 55" stroke="#e0789a" strokeWidth="7" fill="none" />
  </g>
);

const Dna: React.FC<{t: number}> = ({t}) => {
  const rungs = Array.from({length: 9}, (_, i) => i);
  return (
    <g>
      {rungs.map((i) => {
        const y = 60 + i * 35;
        const x = Math.sin(t / 12 + i * 0.7) * 80;
        return (
          <g key={i}>
            <line x1={200 - x} y1={y} x2={200 + x} y2={y} stroke="#8ea2ff" strokeWidth="6" />
            <circle cx={200 - x} cy={y} r="13" fill={theme.accent} />
            <circle cx={200 + x} cy={y} r="13" fill="#7be0a6" />
          </g>
        );
      })}
    </g>
  );
};

const Moon: React.FC<{t: number}> = ({t}) => (
  <g transform={`rotate(${Math.sin(t / 30) * 5} 200 200)`}>
    <path d="M250 70 A 140 140 0 1 0 330 270 A 110 110 0 1 1 250 70 Z" fill={theme.accent} />
    {[0, 1, 2].map((i) => (
      <circle key={i} cx={90 + i * 120} cy={70 + (i % 2) * 260} r="6" fill="#fff" opacity={0.5 + 0.5 * Math.sin(t / 10 + i)} />
    ))}
  </g>
);

export const Icon: React.FC<{name: IconName; t: number; size?: number}> = ({name, t, size = 420}) => {
  const C = {hydra: Hydra, jellyfish: Jellyfish, bird: Bird, brain: Brain, dna: Dna, moon: Moon}[name];
  return (
    <svg width={size} height={size} viewBox="0 0 400 400">
      <C t={t} />
    </svg>
  );
};

// Thumbnail-only original SVG. Cassiopea rests bell-down, oral arms upward.
// The tired face is a visual metaphor for the next-day activity reduction.
export const SleepyCassiopea: React.FC = () => (
  <svg width="445" height="460" viewBox="0 0 445 460" aria-label="寝不足のサカサクラゲを表すイラスト">
    <ellipse cx="222" cy="419" rx="170" ry="19" fill="#060c29" opacity=".55" />
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <g stroke="#db689f" strokeWidth="31">
        <path d="M155 293 Q125 244 129 192 Q131 151 98 114" />
        <path d="M194 289 Q168 210 191 165 Q213 119 183 66" />
        <path d="M239 286 Q273 212 250 160 Q233 119 267 83" />
        <path d="M284 293 Q327 245 310 189 Q300 151 339 130" />
      </g>
      <g stroke="#ff9fc6" strokeWidth="18">
        <path d="M129 196 L92 171 M131 155 L154 127 M185 205 L154 180 M195 155 L230 128 M186 102 L153 82 M254 182 L287 152 M250 132 L218 107 M315 224 L347 200 M313 169 L284 142" />
      </g>
    </g>
    <path d="M64 303 Q222 251 381 303 C368 375 316 411 222 413 C128 411 77 375 64 303Z" fill="#ff9fc6" stroke="#ffd2e4" strokeWidth="8" />
    <path d="M68 304 Q222 351 377 304" fill="none" stroke="#db689f" strokeWidth="9" />
    <g fill="none" stroke="#35274e" strokeWidth="9" strokeLinecap="round">
      <path d="M133 348 Q153 360 174 346 M266 346 Q286 360 307 348" />
      <path d="M203 384 Q220 373 237 383" strokeWidth="7" />
    </g>
    <path d="M137 367 Q153 374 172 366 M269 366 Q287 375 304 367" fill="none" stroke="#bd6793" strokeWidth="7" strokeLinecap="round" />
    <path d="M359 255 Q390 288 376 299 Q354 304 359 255Z" fill="#96def2" />
  </svg>
);

// Thumbnail-only conceptual jellyfish pictogram, not a species/anatomy diagram.
// Generic bell-downward-tentacles silhouette is permitted by 06_thumbnail.md.
// Closed eyes and nightcap are metaphors for sleep, not measured animal features.
export const SleepingJellyfishThumbnail: React.FC = () => (
  <svg width="520" height="610" viewBox="0 0 520 610" aria-label="閉じた目とナイトキャップで睡眠を表すクラゲの模式イラスト">
    <defs>
      <linearGradient id="sleep-jelly-bell" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#fffaff" />
        <stop offset="1" stopColor="#efb2ec" />
      </linearGradient>
    </defs>
    {/* Thick silhouette and broad tentacles stay recognizable at 320 px. */}
    <g fill="none" strokeLinecap="round">
      <g stroke="#42265f" strokeWidth="35">
        <path d="M109 326 C73 393 143 420 99 480 C75 514 104 536 131 530" />
        <path d="M185 330 C148 409 230 425 192 493 C175 532 187 564 217 574" />
        <path d="M264 332 C302 401 233 443 278 487 C309 519 298 554 282 577" />
        <path d="M351 327 C397 391 328 429 377 469 C404 491 395 520 373 541" />
      </g>
      <g stroke="#f2c4f4" strokeWidth="19">
        <path d="M109 326 C73 393 143 420 99 480 C75 514 104 536 131 530" />
        <path d="M185 330 C148 409 230 425 192 493 C175 532 187 564 217 574" />
        <path d="M264 332 C302 401 233 443 278 487 C309 519 298 554 282 577" />
        <path d="M351 327 C397 391 328 429 377 469 C404 491 395 520 373 541" />
      </g>
    </g>
    <path d="M43 323 C46 181 116 129 229 129 C342 129 416 191 430 321 Q408 354 381 334 Q354 369 320 342 Q288 375 258 349 Q222 377 190 346 Q158 372 127 340 Q98 363 77 336 Q55 346 43 323Z" fill="url(#sleep-jelly-bell)" stroke="#42265f" strokeWidth="10" strokeLinejoin="round" />
    <path d="M84 254 Q101 198 142 185" fill="none" stroke="#fff" strokeWidth="18" strokeLinecap="round" />
    {/* Calm closed eyes, rather than fatigue or illness. */}
    <g fill="none" stroke="#42265f" strokeWidth="13" strokeLinecap="round">
      <path d="M130 265 Q156 289 182 265 M275 265 Q301 289 327 265" />
    </g>
    <ellipse cx="231" cy="307" rx="12" ry="15" fill="#42265f" />
    {/* The hat is an explicit sleep metaphor, integrated into the character. */}
    <path d="M166 159 Q199 18 312 35 Q394 43 426 136 Q383 104 345 116 Q304 126 294 180Z" fill="#6853b9" stroke="#42265f" strokeWidth="10" strokeLinejoin="round" />
    <path d="M170 155 Q229 140 300 175 L290 205 Q222 174 162 187Z" fill="#fff" stroke="#42265f" strokeWidth="9" strokeLinejoin="round" />
    <circle cx="433" cy="143" r="25" fill="#fff" stroke="#42265f" strokeWidth="8" />
  </svg>
);

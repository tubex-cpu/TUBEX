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

import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Icon} from './Icons';
import {EpisodeScript, fontBody, fontDisplay, theme} from './types';

// 1280x720 YouTube thumbnail: 2 lines of huge text + one visual, readable at phone size.
export const Thumbnail: React.FC<EpisodeScript> = ({thumbnail}) => {
  const stroke = (w: number, c: string) =>
    Array.from({length: 16}, (_, i) => {
      const a = (i / 16) * Math.PI * 2;
      return `${(Math.cos(a) * w).toFixed(1)}px ${(Math.sin(a) * w).toFixed(1)}px 0 ${c}`;
    }).join(',');
  return (
    <AbsoluteFill style={{background: `linear-gradient(135deg, ${theme.bg2}, ${theme.bg1})`, fontFamily: fontDisplay, overflow: 'hidden'}}>
      <div style={{position: 'absolute', right: -40, top: 40}}>
        <Icon name={thumbnail.icon} t={0} size={640} />
      </div>
      <div style={{position: 'absolute', right: 70, top: 40, fontSize: 120, color: '#fff', transform: 'rotate(12deg)', textShadow: stroke(6, theme.bg1)}}>
        Zzz
      </div>
      <div style={{position: 'absolute', left: 50, top: 70, lineHeight: 1.05}}>
        <div style={{fontSize: 150, color: '#fff', textShadow: stroke(10, '#000')}}>{thumbnail.line1}</div>
        <div style={{fontSize: 210, color: theme.accent, textShadow: stroke(12, '#000')}}>{thumbnail.line2}</div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 50,
          bottom: 50,
          background: '#e8344a',
          color: '#fff',
          fontFamily: fontBody,
          fontWeight: 900,
          fontSize: 56,
          padding: '12px 30px',
          borderRadius: 14,
          transform: 'rotate(-2deg)',
        }}
      >
        {thumbnail.sub}
      </div>
    </AbsoluteFill>
  );
};

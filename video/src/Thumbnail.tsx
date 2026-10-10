import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Icon, SleepyCassiopea} from './Icons';
import {EpisodeScript, fontDisplay, theme} from './types';

// Two lines only. Keep the lower-right 180 x 90 px clear for YouTube's duration.
export const Thumbnail: React.FC<EpisodeScript> = ({thumbnail}) => (
  <AbsoluteFill style={{background: theme.bg1, fontFamily: fontDisplay, overflow: 'hidden'}}>
    <svg width="1280" height="720" viewBox="0 0 1280 720" style={{position: 'absolute'}} aria-hidden>
      <defs>
        <radialGradient id="water">
          <stop stopColor="#304688" />
          <stop offset="1" stopColor="#131c49" />
        </radialGradient>
      </defs>
      <circle cx="1025" cy="345" r="410" fill="url(#water)" />
      <circle cx="1025" cy="345" r="330" fill="none" stroke="#6477c4" strokeWidth="2" opacity=".28" />
      <circle cx="1170" cy="102" r="15" fill="none" stroke="#8eabdf" strokeWidth="4" opacity=".5" />
      <circle cx="763" cy="540" r="10" fill="none" stroke="#8eabdf" strokeWidth="3" opacity=".5" />
      <path d="M690 291 Q737 265 778 297 M758 271 L780 299 L748 304" fill="none" stroke={theme.accent} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M56 94 H152" stroke={theme.pink} strokeWidth="12" strokeLinecap="round" />
    </svg>
    <div style={{position: 'absolute', left: 56, top: 163, color: '#fff', fontSize: 112, lineHeight: 1.2, letterSpacing: -4, whiteSpace: 'nowrap'}}>
      {thumbnail.line1}
    </div>
    <div style={{position: 'absolute', left: 48, top: 315, color: theme.accent, fontSize: 164, lineHeight: 1.2, letterSpacing: -7, whiteSpace: 'nowrap', textShadow: '0 8px 0 #03081b'}}>
      {thumbnail.line2}
    </div>
    <div style={{position: 'absolute', left: 795, top: 126, width: 445, height: 460}}>
      {thumbnail.icon === 'jellyfish' ? <SleepyCassiopea /> : <Icon name={thumbnail.icon} t={0} size={445} />}
    </div>
  </AbsoluteFill>
);

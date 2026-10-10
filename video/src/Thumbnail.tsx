import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Icon, SleepingJellyfishThumbnail} from './Icons';
import {EpisodeScript, fontBody} from './types';

// Dedicated thumbnail layout, independent of the episode's background and typography.
// Keep all essential content above y=600 so the duration badge cannot cover it.
export const Thumbnail: React.FC<EpisodeScript> = ({thumbnail}) => {
  const lettering: React.CSSProperties = {
    position: 'absolute',
    left: 530,
    margin: 0,
    fontFamily: fontBody,
    fontWeight: 900,
    lineHeight: 1.25,
    letterSpacing: -5,
    whiteSpace: 'nowrap',
    WebkitTextStroke: '22px #171717',
    paintOrder: 'stroke fill',
    textShadow: '0 10px 0 #171717',
  };
  return (
    <AbsoluteFill style={{background: '#58dcf1', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 14, top: 48, width: 520, height: 610}}>
        {thumbnail.icon === 'jellyfish'
          ? <SleepingJellyfishThumbnail />
          : <Icon name={thumbnail.icon} t={0} size={520} />}
      </div>
      <div style={{...lettering, top: 132, fontSize: 169, color: '#fff'}}>{thumbnail.line1}</div>
      <div style={{...lettering, top: 340, fontSize: 194, color: '#ffe23d'}}>{thumbnail.line2}</div>
    </AbsoluteFill>
  );
};

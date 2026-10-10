import React from 'react';
import {AbsoluteFill} from 'remotion';
import {EpisodeScript, fontBody} from './types';

// Original conceptual illustration, not a specimen photograph or experimental image.
// Kept local to this composition so the episode's illustrations are unchanged.
const Jellyfish: React.FC = () => (
  <svg viewBox="0 0 680 720" width="680" height="720" aria-label="クラゲの概念図">
    <defs>
      <radialGradient id="bell" cx="38%" cy="20%" r="85%">
        <stop stopColor="#fff5dc" stopOpacity=".92"/><stop offset=".26" stopColor="#b6dace" stopOpacity=".62"/>
        <stop offset=".6" stopColor="#5c968e" stopOpacity=".34"/><stop offset="1" stopColor="#092d30" stopOpacity=".12"/>
      </radialGradient>
      <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#fcf6df"/><stop offset=".5" stopColor="#a9e1d6"/><stop offset="1" stopColor="#467d77"/>
      </linearGradient>
      <linearGradient id="arms" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#ebead2" stopOpacity=".8"/><stop offset=".6" stopColor="#a7cdbd" stopOpacity=".5"/><stop offset="1" stopColor="#599c92" stopOpacity="0"/>
      </linearGradient>
      <filter id="soft"><feGaussianBlur stdDeviation="5"/></filter>
      <filter id="halo"><feGaussianBlur stdDeviation="11"/></filter>
    </defs>
    <g transform="rotate(-12 320 310)">
      {Array.from({length: 28}, (_, i) => {
        const x = 100 + i * 16;
        return <path key={i} d={`M ${x} ${326 + Math.sin(i)*12} C ${x-55} 435 ${x+65} 482 ${x+8} ${590+i%5*22} S ${x-25} 688 ${x+30} 746`} fill="none" stroke="url(#arms)" strokeWidth={i%4===0?3:1.3} opacity={.28+i%4*.13}/>;
      })}
      {Array.from({length: 7}, (_, i) => {
        const x = 224+i*29;
        return <g key={i}>
          <path d={`M ${x} 315 C ${x-62} 414 ${x+66} 444 ${x-2} 509 S ${x+45} 582 ${x+8} 667`} fill="none" stroke="url(#arms)" strokeWidth={28-i*2} filter="url(#soft)"/>
          <path d={`M ${x} 315 C ${x-62} 414 ${x+66} 444 ${x-2} 509 S ${x+45} 582 ${x+8} 667`} fill="none" stroke="url(#arms)" strokeWidth={9-i*.7}/>
        </g>;
      })}
      <path d="M 66 324 C 82 51 481 14 570 321 C 448 377 192 391 66 324 Z" fill="url(#bell)"/>
      <path d="M 66 324 C 82 51 481 14 570 321" fill="none" stroke="#caede0" strokeWidth="8" opacity=".55" filter="url(#halo)"/>
      <path d="M 66 324 C 82 51 481 14 570 321" fill="none" stroke="url(#rim)" strokeWidth="2.6"/>
      {Array.from({length: 23}, (_, i) => {
        const x=81+i*21;
        return <path key={i} d={`M 304 114 Q ${x} 168 ${x} ${328+Math.sin(i/22*Math.PI)*33}`} stroke="#daf1dc" strokeWidth={i%3===0?1.7:.7} opacity={i%3===0?.28:.16} fill="none"/>;
      })}
      <ellipse cx="319" cy="330" rx="251" ry="43" fill="#85b9a1" fillOpacity=".1" stroke="url(#rim)" strokeWidth="3"/>
      <ellipse cx="312" cy="317" rx="215" ry="28" fill="none" stroke="#d7ecce" strokeWidth="10" opacity=".22" filter="url(#soft)"/>
      <path d="M 144 197 C 191 116 317 87 407 143" stroke="#fff4d6" strokeWidth="17" fill="none" opacity=".27" filter="url(#soft)"/>
      {Array.from({length: 160}, (_, i) => {
        const a=i*2.39996, r=Math.sqrt(i/160);
        const x=315+210*r*Math.cos(a), y=244+88*r*Math.sin(a);
        return <circle key={i} cx={x} cy={y} r={.6+(i%3)*.45} fill="#e6eed8" opacity={.12+(i%5)*.035}/>;
      })}
    </g>
  </svg>
);

export const Thumbnail: React.FC<EpisodeScript> = ({thumbnail}) => {
  const lettering: React.CSSProperties = {
    position:'absolute', left:638, margin:0, fontFamily:fontBody,
    fontWeight:900, lineHeight:1.22, letterSpacing:-5, whiteSpace:'nowrap',
    WebkitTextStroke:'12px #020606', paintOrder:'stroke fill',
    textShadow:'0 7px 0 #020606, 0 13px 14px #000',
  };
  return (
    <AbsoluteFill style={{background:'radial-gradient(ellipse at 26% 33%, #254c45 0%, #0b201e 36%, #020b0b 72%)', overflow:'hidden'}}>
      <div style={{position:'absolute', left:-6, top:5}}><Jellyfish /></div>
      <div aria-hidden style={{...lettering, top:219, fontSize:103, color:'#fffdf2', WebkitTextStroke:'20px #708c85', textShadow:'0 0 15px #83a99a66, 0 12px 10px #000'}}>{thumbnail.line1}</div>
      <div style={{...lettering, top:219, fontSize:103, color:'#fffdf2'}}>{thumbnail.line1}</div>
      <div aria-hidden style={{...lettering, top:365, fontSize:103, color:'#f1d49a', WebkitTextStroke:'21px #ac8b4a', textShadow:'0 0 23px #e6bc686e, 0 12px 12px #000'}}>{thumbnail.line2}</div>
      <div style={{...lettering, top:365, fontSize:103, color:'#f1d49a', textShadow:'0 7px 0 #090b08, 0 11px 10px #000'}}>{thumbnail.line2}</div>
    </AbsoluteFill>
  );
};

import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {HabiIcon, JudgeBadge, isHabiIcon} from './HabiIcons';
import {Scene, fontBody} from './types';

// ① ハビ判事 look: night court by the sea. Dark, quiet, moonlit; verdicts are stamped.
export const habiTheme = {
  bg1: '#05090d',
  bg2: '#10303a',
  accent: '#e9c46a',
  text: '#f4efe2',
  sub: '#b9c7c4',
};

const VERDICT_COLOR: Record<string, string> = {
  '×': '#e05a4f',
  '△': '#e9a23b',
  '○': '#4fb39a',
  判決保留: '#9aa7b3',
};

export const HabiBackground: React.FC = () => {
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 75% 15%, ${habiTheme.bg2}, ${habiTheme.bg1} 65%)`}}>
      <div
        style={{
          position: 'absolute',
          right: 180,
          top: 60,
          width: 220,
          height: 220,
          borderRadius: 110,
          background: 'radial-gradient(circle, rgba(233,216,166,0.22), rgba(233,216,166,0) 70%)',
        }}
      />
    </AbsoluteFill>
  );
};

const outline = '0 0 2px #000, 0 4px 0 rgba(0,0,0,0.55), 0 0 18px rgba(0,0,0,0.6)';

export const HabiSceneView: React.FC<{scene: Scene; durationInFrames: number}> = ({scene, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 18}});
  const enterLate = spring({frame: frame - 8, fps, config: {damping: 18}});
  const stamp = spring({frame: frame - 10, fps, config: {damping: 8, mass: 0.9}});
  const fadeOut = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const verdict = scene.bigNumber && VERDICT_COLOR[scene.bigNumber] ? scene.bigNumber : undefined;
  const iconName = isHabiIcon(scene.icon) ? scene.icon : 'shoebill';
  const showJudgeBadge = verdict && iconName === 'shoebill';

  return (
    <AbsoluteFill style={{opacity: Math.min(fadeOut, fadeIn), padding: '80px 110px 70px', fontFamily: fontBody, color: habiTheme.text}}>
      <div
        style={{
          alignSelf: 'flex-start',
          color: habiTheme.accent,
          fontWeight: 900,
          fontSize: 38,
          letterSpacing: 4,
          borderBottom: `3px solid ${habiTheme.accent}`,
          paddingBottom: 6,
          opacity: enter,
          transform: `translateX(${(1 - enter) * -60}px)`,
        }}
      >
        {scene.kicker}
      </div>

      <div style={{display: 'flex', flex: 1, alignItems: 'center', gap: 60}}>
        <div style={{flex: 1}}>
          {verdict ? (
            <div
              style={{
                display: 'inline-block',
                fontWeight: 900,
                fontSize: verdict.length > 1 ? 120 : 220,
                lineHeight: 1,
                color: VERDICT_COLOR[verdict],
                border: `10px solid ${VERDICT_COLOR[verdict]}`,
                borderRadius: 24,
                padding: verdict.length > 1 ? '18px 36px' : '0 40px 10px',
                transform: `scale(${0.6 + stamp * 0.4}) rotate(${(1 - stamp) * -12 - 4}deg)`,
                transformOrigin: 'left center',
                opacity: stamp,
                marginBottom: 30,
                textShadow: '0 6px 0 rgba(0,0,0,0.5)',
              }}
            >
              {verdict}
            </div>
          ) : scene.bigNumber ? (
            <div style={{fontWeight: 900, fontSize: 150, color: habiTheme.accent, textShadow: outline}}>{scene.bigNumber}</div>
          ) : null}
          <div
            style={{
              fontWeight: 900,
              fontSize: verdict ? 78 : 96,
              lineHeight: 1.3,
              whiteSpace: 'pre-line',
              opacity: enterLate,
              transform: `translateY(${(1 - enterLate) * 30}px)`,
              textShadow: outline,
              WebkitTextStroke: '2px rgba(0,0,0,0.6)',
            }}
          >
            {scene.headline}
          </div>
          {scene.body ? (
            <div style={{marginTop: 30, fontSize: 38, lineHeight: 1.6, color: habiTheme.sub, fontWeight: 500, maxWidth: 1050}}>{scene.body}</div>
          ) : null}
        </div>
        <div style={{transform: `scale(${0.9 + enter * 0.1})`, opacity: enter, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))'}}>
          {showJudgeBadge ? <JudgeBadge t={frame} size={560} /> : <HabiIcon name={iconName} t={frame} size={560} />}
        </div>
      </div>

      {scene.source ? <div style={{fontSize: 26, color: habiTheme.sub, opacity: 0.85}}>出典：{scene.source}</div> : null}
      {scene.credit ? <div style={{fontSize: 24, color: habiTheme.sub, opacity: 0.85, marginTop: 6}}>{scene.credit}</div> : null}
    </AbsoluteFill>
  );
};

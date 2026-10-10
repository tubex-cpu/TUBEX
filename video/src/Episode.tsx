import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Icon} from './Icons';
import {EpisodeScript, Scene, fontBody, fontDisplay, theme} from './types';

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 30% 20%, ${theme.bg2}, ${theme.bg1} 70%)`}}>
      {Array.from({length: 40}, (_, i) => {
        const x = (i * 197) % 1920;
        const y = (i * 113) % 1080;
        const o = 0.25 + 0.25 * Math.sin(frame / 20 + i);
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 4, height: 4, borderRadius: 2, background: '#fff', opacity: o}} />;
      })}
    </AbsoluteFill>
  );
};

const SceneView: React.FC<{scene: Scene; durationInFrames: number}> = ({scene, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 14}});
  const enterLate = spring({frame: frame - 8, fps, config: {damping: 16}});
  const fadeOut = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const numberPop = spring({frame: frame - 12, fps, config: {damping: 9, mass: 0.8}});
  const bodyIn = interpolate(frame, [18, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

  return (
    <AbsoluteFill style={{opacity: fadeOut, padding: '90px 110px', fontFamily: fontBody, color: theme.text}}>
      <div
        style={{
          alignSelf: 'flex-start',
          background: theme.accent,
          color: theme.bg1,
          fontWeight: 900,
          fontSize: 40,
          padding: '10px 28px',
          borderRadius: 999,
          transform: `translateX(${(1 - enter) * -300}px)`,
        }}
      >
        {scene.kicker}
      </div>

      <div style={{display: 'flex', flex: 1, alignItems: 'center', gap: 40}}>
        <div style={{flex: 1}}>
          {scene.bigNumber ? (
            <div
              style={{
                fontFamily: fontDisplay,
                fontSize: 170,
                color: theme.accent,
                lineHeight: 1.1,
                transform: `scale(${numberPop})`,
                transformOrigin: 'left center',
                textShadow: '0 8px 0 rgba(0,0,0,0.35)',
              }}
            >
              {scene.bigNumber}
            </div>
          ) : null}
          <div
            style={{
              fontFamily: fontDisplay,
              fontSize: scene.bigNumber ? 76 : 100,
              lineHeight: 1.25,
              whiteSpace: 'pre-line',
              opacity: enterLate,
              transform: `translateY(${(1 - enterLate) * 40}px)`,
              textShadow: '0 6px 0 rgba(0,0,0,0.35)',
            }}
          >
            {scene.headline}
          </div>
          {scene.body ? (
            <div style={{marginTop: 36, fontSize: 40, lineHeight: 1.6, color: theme.sub, fontWeight: 500, maxWidth: 1150, opacity: bodyIn}}>
              {scene.body}
            </div>
          ) : null}
        </div>
        <div style={{transform: `scale(${enter})`}}>
          <Icon name={scene.icon} t={frame} size={480} />
        </div>
      </div>

      {scene.source ? <div style={{fontSize: 26, color: theme.sub, opacity: 0.8}}>出典：{scene.source}</div> : null}
      {scene.credit ? <div style={{fontSize: 22, color: theme.sub, opacity: 0.7}}>{scene.credit}</div> : null}
    </AbsoluteFill>
  );
};

const ProgressBar: React.FC<{total: number}> = ({total}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 0, bottom: 0, height: 10, width: `${(frame / total) * 100}%`, background: theme.accent}} />
  );
};

const NARRATION_LEAD_IN = 0.4; // keep in sync with LEAD_IN in scripts/make_audio.py

export const Episode: React.FC<EpisodeScript> = (props) => {
  const {fps} = useVideoConfig();
  let from = 0;
  const total = props.scenes.reduce((s, sc) => s + Math.round(sc.seconds * fps), 0);
  return (
    <AbsoluteFill>
      <Background />
      {props.scenes.map((scene) => {
        const d = Math.round(scene.seconds * fps);
        const seq = (
          <Sequence key={scene.id} from={from} durationInFrames={d} name={scene.id}>
            <SceneView scene={scene} durationInFrames={d} />
            {scene.audio ? (
              // Narration starts after a short lead-in; make_audio.py sizes the scene to fit it.
              <Sequence from={Math.round(NARRATION_LEAD_IN * fps)} name={`${scene.id}-voice`}>
                <Audio src={staticFile(scene.audio)} />
              </Sequence>
            ) : null}
          </Sequence>
        );
        from += d;
        return seq;
      })}
      {props.bgm ? <Audio src={staticFile(props.bgm)} volume={0.18} /> : null}
      <ProgressBar total={total} />
    </AbsoluteFill>
  );
};

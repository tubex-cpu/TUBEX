import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {XF, ConditionsScene, ConnectivityScene, HookScene, LimitsScene, MRIScene, ObserveScene, ResultScene, SleepScene, UpdateScene} from './scenes/Scenes';
import {FONT} from './theme';
import {Subtitles} from './ui/Overlay';

// Scene table (frames @30fps). Each scene after the first fades in over XF frames on top of the previous one.
export const SCENES = [
  {id: 'S1 hook', from: 0, to: 159, C: HookScene},
  {id: 'S2 observe', from: 159, to: 276, C: ObserveScene},
  {id: 'S3 sleep', from: 276, to: 432, C: SleepScene},
  {id: 'S4 conditions', from: 432, to: 750, C: ConditionsScene},
  {id: 'S5 mri', from: 750, to: 918, C: MRIScene},
  {id: 'S6 result', from: 918, to: 1176, C: ResultScene},
  {id: 'S7 connectivity', from: 1176, to: 1347, C: ConnectivityScene},
  {id: 'S8 limits', from: 1347, to: 1548, C: LimitsScene},
  {id: 'S9 update', from: 1548, to: 1800, C: UpdateScene},
];

const FadeIn: React.FC<{children: React.ReactNode; first: boolean}> = ({children, first}) => {
  const f = useCurrentFrame();
  const o = first ? 1 : interpolate(f, [0, XF], [0, 1], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

const Credits: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'flex-start', padding: '0 0 26px 40px', opacity: o, fontFamily: FONT, fontSize: 21, color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 2px #000', lineHeight: 1.5}}>
      <div>出典：Yoo SS et al. (2007) Curr Biol 17(20):R877–R878. doi:10.1016/j.cub.2007.08.007</div>
      <div>音声：HTS voice “tohoku-f01”（東北大学 伊藤・能勢研究室, CC BY 4.0）＋ Open JTalk ／ 映像・音楽・効果音：本チャンネル制作（CG）</div>
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {SCENES.map(({id, from, to, C}, i) => (
      <Sequence key={id} name={id} from={from - XF} durationInFrames={to - from + XF}>
        <FadeIn first={i === 0}><C /></FadeIn>
      </Sequence>
    ))}
    <Subtitles />
    <Sequence from={1752}><Credits /></Sequence>
    <Audio src={staticFile('audio/mix.wav')} />
  </AbsoluteFill>
);

import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {S1Cafe, S2aApartment, S2bStreet, S3Freeze, S4Demo, S5WalkHome, S6Hall, S7Title, S8Brain, XF} from './scenes/Scenes';
import {Subtitles} from './ui/Overlay';
import {FONT} from './theme';

export const SCENES = [
  {id: 'S1 cafe', from: 0, to: 240, C: S1Cafe},
  {id: 'S2a apartment', from: 240, to: 330, C: S2aApartment},
  {id: 'S2b street', from: 330, to: 418, C: S2bStreet},
  {id: 'S3 freeze', from: 418, to: 555, C: S3Freeze},
  {id: 'S4 demo', from: 555, to: 717, C: S4Demo},
  {id: 'S5 walk home', from: 717, to: 920, C: S5WalkHome},
  {id: 'S6 hall', from: 920, to: 1224, C: S6Hall},
  {id: 'S7 title', from: 1224, to: 1410, C: S7Title},
  {id: 'S8 brain', from: 1410, to: 1800, C: S8Brain},
];

export const FadeIn: React.FC<{children: React.ReactNode; first: boolean}> = ({children, first}) => {
  const f = useCurrentFrame();
  const o = first ? 1 : interpolate(f, [0, XF], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const sc = first ? 1 : interpolate(f, [0, XF * 3], [1.03, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return <AbsoluteFill style={{opacity: o, transform: `scale(${sc})`}}>{children}</AbsoluteFill>;
};

export const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{pointerEvents: 'none', opacity: 0.07, mixBlendMode: 'overlay', backgroundImage: `url(${staticFile(`grain/g${f % 4}.png`)})`, backgroundPosition: `${(f * 137) % 512}px ${(f * 251) % 512}px`, backgroundSize: '512px 512px'}} />;
};

export const Main: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {SCENES.map(({id, from, to, C}, i) => (
      <Sequence key={id} name={id} from={from - XF} durationInFrames={to - from + XF}>
        <FadeIn first={i === 0}><C /></FadeIn>
      </Sequence>
    ))}
    <Grain />
    <Subtitles />
    <Sequence from={1740}><Credit /></Sequence>
    <Audio src={staticFile('audio/mix.wav')} />
  </AbsoluteFill>
);

const Credit: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'flex-end', padding: '0 40px 22px 0', opacity: interpolate(f, [0, 8], [0, 1], {extrapolateRight: 'clamp'}), fontFamily: FONT, fontSize: 22, color: 'rgba(255,255,255,0.8)', textShadow: '0 1px 2px #000'}}>
      音声：VOICEVOX:ナースロボ＿タイプＴ
    </AbsoluteFill>
  );
};

// First 30 s cut (S1–S5), ends on "…もやもやする。" with a fade to black. Voice: VOICEVOX:No.7
export const Main30: React.FC = () => {
  const f = useCurrentFrame();
  const fade = interpolate(f, [878, 899], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SCENES.filter((s) => s.from < 900).map(({id, from, to, C}, i) => (
        <Sequence key={id} name={id} from={from - XF} durationInFrames={Math.min(to, 900) - from + XF}>
          <FadeIn first={i === 0}><C /></FadeIn>
        </Sequence>
      ))}
      <Grain />
      <Subtitles />
      <Sequence from={845}>
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'flex-end', padding: '0 40px 22px 0', fontFamily: FONT, fontSize: 22, color: 'rgba(255,255,255,0.8)', textShadow: '0 1px 2px #000'}}>
          音声：VOICEVOX:No.7
        </AbsoluteFill>
      </Sequence>
      <AbsoluteFill style={{background: '#000', opacity: fade}} />
      <Audio src={staticFile('audio/mix.wav')} />
    </AbsoluteFill>
  );
};

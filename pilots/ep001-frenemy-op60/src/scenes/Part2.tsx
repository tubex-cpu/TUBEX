import {ThreeCanvas} from '@remotion/three';
import {useMemo} from 'react';
import * as THREE from 'three';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import timingsP2 from '../../data/timings_p2.json';
import {Brain3D} from '../three/Brain3D';
import {Cafe, TABLE_Y} from '../three/Cafe';
import {CameraRig, canvasTexture, ease, lerp, lerp3} from '../three/common';
import {RB} from '../three/Decor';
import {Mascot} from '../three/Mascot';
import {wobble} from '../three/noise';
import {Hall} from '../three/Sets';
import {Card3D, WhiteRoom, cardTex, signTex} from '../three/WhiteRoom';
import {FONT} from '../theme';
import {Subtitles, Tag, Vignette} from '../ui/Overlay';

const XF = 8;
const useF = () => useCurrentFrame() - XF;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const seg = (f: number, a: number, b: number) => ease((f - a) / (b - a));
const GL = {toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0, antialias: true, preserveDrawingBuffer: true};
const hand = (p: [number, number, number], t: number, a: number): [number, number, number] => [p[0] + wobble(t, 1) * a, p[1] + wobble(t, 2) * a, p[2] + wobble(t, 3) * a];
const S = (sec: number) => Math.round(sec * 30);

const Canvas3D: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} shadows={{type: THREE.PCFSoftShadowMap}} gl={GL} style={{position: 'absolute', inset: 0}}>
      {children}
    </ThreeCanvas>
  );
};

const qTex = () => canvasTexture(256, 256, (g) => { g.clearRect(0, 0, 256, 256); g.fillStyle = '#ffffff'; g.font = `bold 200px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('？', 128, 140); });
const ecgTex = () => {
  const t = canvasTexture(1024, 256, (g) => {
    g.clearRect(0, 0, 1024, 256);
    g.strokeStyle = '#ff6a5a'; g.lineWidth = 8; g.shadowColor = '#ff6a5a'; g.shadowBlur = 18; g.beginPath();
    for (let x = 0; x <= 1024; x += 4) {
      const p = x % 256;
      const y = p > 100 && p < 112 ? 128 - (p - 100) * 9 : p >= 112 && p < 124 ? 20 + (p - 112) * 17 : p >= 124 && p < 132 ? 224 - (p - 124) * 12 : 128;
      if (x === 0) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.stroke();
  });
  t.wrapS = THREE.RepeatWrapping;
  return t;
};
const sealedTex = () => canvasTexture(1024, 640, (g) => {
  g.fillStyle = '#1d2230'; g.fillRect(0, 0, 1024, 640);
  g.strokeStyle = '#c8a76c'; g.lineWidth = 12; g.strokeRect(30, 30, 964, 580);
  g.fillStyle = '#c8a76c'; g.font = `900 260px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('？', 512, 300);
  g.font = `700 52px ${FONT}`; g.fillText('いい知らせテスト', 512, 520);
});

// glass display case on a pedestal; content lights up
const Vitrine: React.FC<{position: [number, number, number]; on: number; children?: React.ReactNode}> = ({position, on, children}) => (
  <group position={position}>
    <mesh position={[0, 0.5, 0]} castShadow receiveShadow><boxGeometry args={[0.8, 1.0, 0.8]} /><meshStandardMaterial color="#1b1d21" roughness={0.45} metalness={0.4} /></mesh>
    <mesh position={[0, 1.005, 0]}><boxGeometry args={[0.82, 0.01, 0.82]} /><meshStandardMaterial color="#c8a76c" metalness={0.8} roughness={0.3} /></mesh>
    <mesh position={[0, 1.4, 0]}><boxGeometry args={[0.76, 0.78, 0.76]} /><meshStandardMaterial color="#d6e4ff" transparent opacity={0.08 + 0.04 * on} roughness={0.02} metalness={0.3} /></mesh>
    <pointLight position={[0, 1.95, 0.25]} intensity={2.2 * on} distance={2.2} decay={2} color="#ffe2b8" />
    <mesh position={[0, 1.79, 0]}><boxGeometry args={[0.6, 0.012, 0.6]} /><meshBasicMaterial color="#fff1d6" toneMapped={false} transparent opacity={0.2 + 0.8 * on} /></mesh>
    <group position={[0, 1.38, 0]} scale={0.85 + 0.15 * on}>{children}</group>
  </group>
);

// list of the three topics (builds up as each case lights)
const TopicList: React.FC<{f: number}> = ({f}) => {
  const items = [
    {at: S(5.2), n: '①', t: 'フレネミーの正体', s: '脳の実験と心理学で解く'},
    {at: S(14.6), n: '②', t: '横にいるだけで体に起きること', s: ''},
    {at: S(19.9), n: '③', t: '見分け方「いい知らせテスト」', s: ''},
  ];
  return (
    <div style={{position: 'absolute', left: 56, top: 90, fontFamily: FONT, padding: '26px 34px 4px', borderRadius: 16, background: 'rgba(8,10,14,0.72)', opacity: interpolate(f, [S(5.0), S(5.4)], [0, 1], clamp)}}>
      {items.map((it, i) => {
        const a = interpolate(f, [it.at, it.at + 10], [0, 1], clamp);
        return (
          <div key={i} style={{opacity: a, transform: `translateX(${(1 - a) * -20}px)`, display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 26, color: '#f2efe9', textShadow: '0 2px 8px #000'}}>
            <span style={{fontSize: 54, fontWeight: 900, color: '#ffd166'}}>{it.n}</span>
            <span style={{fontSize: 42, fontWeight: 800}}>{it.t}</span>
          </div>
        );
      })}
    </div>
  );
};

// A (0–30s) + B (30–39s): the three display cases in the hall
const VitrinesScene: React.FC<{close?: boolean}> = ({close = false}) => {
  const f = useF();
  const t = f / 30;
  const ecg = useMemo(ecgTex, []);
  ecg.offset.x = -t * 0.35;
  const sealed = useMemo(sealedTex, []);
  const on = [seg(f, S(5.2), S(5.9)), seg(f, S(14.6), S(15.3)), seg(f, S(19.9), S(20.6))];
  const camWide = hand(lerp3([0, 2.3, 6.4], [0.6, 1.9, 4.9], seg(f, 0, S(30))), t, 0.004);
  const camClose = hand(lerp3([2.0, 1.6, 2.4], [1.75, 1.5, 1.75], seg(f, 0, S(9))), t, 0.003);
  const tgt: [number, number, number] = close ? [1.6, 1.38, 0.2] : [lerp(-0.6, 0.6, seg(f, S(5), S(22))), 1.25, 0];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Canvas3D>
        <CameraRig pos={close ? camClose : camWide} target={tgt} fov={close ? 30 : 38} />
        <Hall>
          <Vitrine position={[-1.6, 0, 0.2]} on={close ? 1 : on[0]}>
            <group scale={0.3}><Brain3D t={t} rotY={t * 0.4} amyg={0.3} /></group>
          </Vitrine>
          <Vitrine position={[0, 0, -0.3]} on={close ? 1 : on[1]}>
            <mesh rotation={[0, -0.2, 0]}><planeGeometry args={[0.62, 0.16]} /><meshBasicMaterial map={ecg} transparent toneMapped={false} opacity={0.2 + 0.8 * (close ? 1 : on[1])} /></mesh>
          </Vitrine>
          <Vitrine position={[1.6, 0, 0.2]} on={close ? 1 : on[2]}>
            <Card3D tex={sealed} scale={0.36} rotation={[0, -0.35 + 0.15 * Math.sin(t * 0.8), 0]} />
          </Vitrine>
          <directionalLight position={[-2, 3, 3]} intensity={0.5} />
        </Hall>
      </Canvas3D>
      <Vignette />
      {!close && <TopicList f={f} />}
    </AbsoluteFill>
  );
};
const SceneA: React.FC = () => <VitrinesScene />;
const SceneB: React.FC = () => <VitrinesScene close />;

// C (39–45.6s): back at the cafe; your phone lights up on the table (no chat screen)
const SceneC: React.FC = () => {
  const f = useF();
  const t = f / 30;
  const glow = seg(f, 30, 45);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Canvas3D>
        <CameraRig pos={hand(lerp3([0.0, 1.2, 0.78], [0.02, 1.14, 0.68], seg(f, 0, 200)), t, 0.003)} target={[0.06, 0.92, -0.1]} fov={44} />
        <Cafe showYou={false} friend={{expr: {smile: 0.5, open: 0, lid: 0}, gaze: [0, 0.04], head: [0.03, 0.02, 0.04], breath: Math.sin(t * 1.6)}}>
          <group position={[-0.06, TABLE_Y + 0.006, 0.12]} rotation={[0, 0.25, 0]}>
            <RB s={[0.075, 0.012, 0.15]} r={0.006} c="#15171c" rough={0.3} />
            <mesh position={[0, 0.0065, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.066, 0.14]} /><meshBasicMaterial color={new THREE.Color('#bcd0ff').multiplyScalar(0.1 + 0.9 * glow)} toneMapped={false} /></mesh>
            <pointLight position={[0, 0.06, 0]} intensity={0.8 * glow} distance={0.6} decay={2} color="#bcd0ff" />
          </group>
        </Cafe>
      </Canvas3D>
      <Vignette />
      <Tag text="再現" />
    </AbsoluteFill>
  );
};

// D–E (45.6–64.8s): white room; the observer pops in, the "思考実験" sign; scoring meter appears
const SceneDE: React.FC = () => {
  const f = useF();
  const t = f / 30;
  const sign = useMemo(signTex, []);
  const q = useMemo(qTex, []);
  const pop = seg(f, 0, 12);
  const hop = Math.max(0, Math.sin(Math.PI * Math.min(1, f / 14))) * 0.25;
  const showQ = seg(f, 10, 18) * (1 - seg(f, 70, 80));
  const signIn = seg(f, S(1.2), S(2.2));
  return (
    <AbsoluteFill style={{background: '#f2f1ee'}}>
      <Canvas3D>
        <CameraRig pos={lerp3([0.2, 1.3, 5.2], [0.0, 1.35, 4.4], seg(f, 0, S(19)))} target={[0, 1.15, 0]} fov={38} />
        <WhiteRoom>
          <group position={[0, 1.75 + 0.03 * Math.sin(t * 1.2), -0.3]} scale={0.9 * signIn} rotation={[0, 0.06 * Math.sin(t * 0.6), 0]}>
            <Card3D tex={sign} scale={1.4} />
          </group>
          <group position={[lerp(3.0, 2.15, pop), hop, 0.2]}>
            <Mascot rotationY={-0.9} scale={0.62} pose={{headNod: -0.2 * signIn, headTilt: 0.12 * Math.sin(Math.PI * seg(f, S(5), S(9)))}} />
            {showQ > 0 && <sprite position={[0, 1.1, 0]} scale={[0.32 * showQ, 0.32 * showQ, 1]}><spriteMaterial map={q} color="#1d2230" transparent /></sprite>}
          </group>
        </WhiteRoom>
      </Canvas3D>
    </AbsoluteFill>
  );
};

// scoring meter (0–10). No value is shown — the viewer scores in their head.
const Meter: React.FC<{f: number; from: number; pauseAt?: number; pauseLen?: number}> = ({f, from, pauseAt, pauseLen = 60}) => {
  const a = interpolate(f, [from, from + 10], [0, 1], clamp);
  const p = pauseAt !== undefined ? interpolate(f, [pauseAt, pauseAt + pauseLen], [0, 1], clamp) : 0;
  const blink = Math.floor(f / 10) % 2 === 0;
  return (
    <div style={{position: 'absolute', right: 70, top: 70, width: 520, opacity: a, fontFamily: FONT, padding: '22px 28px', borderRadius: 18, background: 'rgba(29,34,48,0.92)', color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.25)'}}>
      <div style={{fontSize: 28, fontWeight: 800}}>胸のざわつき</div>
      <div style={{position: 'relative', height: 60, marginTop: 14}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 26, height: 8, borderRadius: 4, background: 'linear-gradient(90deg, #6fa8dc, #ffd166, #e0533d)'}} />
        {Array.from({length: 11}, (_, i) => <div key={i} style={{position: 'absolute', left: `${i * 10}%`, top: 20, width: 2, height: 20, background: 'rgba(255,255,255,0.6)'}} />)}
        <div style={{position: 'absolute', left: '50%', top: -6, transform: 'translateX(-50%)', fontSize: 34, fontWeight: 900, color: '#ffd166', opacity: blink ? 1 : 0.4}}>？</div>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#c9d2e3'}}><span>0</span><span>10</span></div>
      {pauseAt !== undefined && f >= pauseAt && (
        <div style={{marginTop: 12, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.15)'}}>
          <div style={{height: '100%', width: `${p * 100}%`, borderRadius: 3, background: '#ffd166'}} />
        </div>
      )}
      {pauseAt !== undefined && f >= pauseAt && <div style={{fontSize: 24, marginTop: 8, color: '#ffd166'}}>心の中で採点してください</div>}
    </div>
  );
};

const SceneE2: React.FC = () => {
  const f = useF();
  return <Meter f={f} from={S(9.5)} />;
};

// F/G/H: one card at a time, then the viewer's pause
const CardScene: React.FC<{k: 1 | 2 | 3; pauseAt: number; pauseLen: number}> = ({k, pauseAt, pauseLen}) => {
  const f = useF();
  const t = f / 30;
  const tex = useMemo(() => cardTex(k), [k]);
  const inA = seg(f, 0, 16);
  return (
    <AbsoluteFill style={{background: '#f2f1ee'}}>
      <Canvas3D>
        <CameraRig pos={lerp3([0, 1.45, 3.4], [0, 1.45, 3.0], seg(f, 0, 300))} target={[0, 1.42, 0]} fov={36} />
        <WhiteRoom>
          <group position={[0, 1.42 + 0.02 * Math.sin(t * 1.3), 0]} rotation={[0, lerp(-0.6, 0, inA) + 0.04 * Math.sin(t * 0.7), 0]}>
            <Card3D tex={tex} scale={1.15} />
          </group>
        </WhiteRoom>
      </Canvas3D>
      <Meter f={f} from={10} pauseAt={pauseAt} pauseLen={pauseLen} />
    </AbsoluteFill>
  );
};
const SceneF: React.FC = () => <CardScene k={1} pauseAt={S(73.5 - 64.8)} pauseLen={S(2.2)} />;
const SceneG: React.FC = () => <CardScene k={2} pauseAt={S(81.9 - 75.7)} pauseLen={S(2.2)} />;
const SceneH: React.FC = () => <CardScene k={3} pauseAt={S(92.8 - 84.1)} pauseLen={S(2.4)} />;

// I–J (95.2–112s): the three cards side by side; ③ glows; the observer turns to ③
const SceneIJ: React.FC = () => {
  const f = useF();
  const t = f / 30;
  const tex = useMemo(() => [cardTex(1), cardTex(2), cardTex(3)], []);
  const glow = seg(f, S(3.4), S(4.2));
  const pull = seg(f, S(7.7), S(16.8));
  return (
    <AbsoluteFill style={{background: '#f2f1ee'}}>
      <Canvas3D>
        <CameraRig pos={lerp3([0, 1.5, 4.6], [0.4, 1.7, 6.2], pull)} target={[0, 1.25, 0]} fov={40} />
        <WhiteRoom>
          {[-1, 0, 1].map((i, k) => (
            <group key={k} position={[i * 1.85, 1.55 + 0.02 * Math.sin(t * 1.2 + k), -0.2]} rotation={[0, -i * 0.12, 0]}>
              <Card3D tex={tex[k]} scale={1.0} glow={k === 2 ? glow : 0} dim={k === 2 ? 0 : glow} />
            </group>
          ))}
          {f > S(7.7) - 20 && (
            <group position={[lerp(2.3, 2.7, pull), 0, 0.4]}>
              <Mascot rotationY={lerp(-0.4, 0.3, seg(f, S(8.5), S(11)))} scale={0.62} pose={{headNod: -0.25, headTilt: 0.2 * seg(f, S(11), S(13)), armR: 0.25 * seg(f, S(12), S(14))}} />
            </group>
          )}
        </WhiteRoom>
      </Canvas3D>
    </AbsoluteFill>
  );
};

export const SCENES_P2 = [
  {id: 'A vitrines', from: 0, to: S(30), C: SceneA},
  {id: 'B sealed', from: S(30), to: S(39), C: SceneB},
  {id: 'C cafe phone', from: S(39), to: S(45.6), C: SceneC},
  {id: 'DE white room', from: S(45.6), to: S(64.8), C: SceneDE},
  {id: 'F card1', from: S(64.8), to: S(75.7), C: SceneF},
  {id: 'G card2', from: S(75.7), to: S(84.1), C: SceneG},
  {id: 'H card3', from: S(84.1), to: S(95.2), C: SceneH},
  {id: 'IJ cards', from: S(95.2), to: S(112), C: SceneIJ},
];

const FadeIn: React.FC<{children: React.ReactNode; first: boolean}> = ({children, first}) => {
  const f = useCurrentFrame();
  const o = first ? 1 : interpolate(f, [0, XF], [0, 1], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

export const Part2: React.FC = () => {
  const f = useCurrentFrame();
  const fadeOut = interpolate(f, [S(111.3), S(112) - 1], [0, 1], clamp);
  const fadeIn = interpolate(f, [0, 10], [1, 0], clamp);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SCENES_P2.map(({id, from, to, C}, i) => (
        <Sequence key={id} name={id} from={Math.max(0, from - XF)} durationInFrames={to - Math.max(0, from - XF)}>
          <FadeIn first={i === 0}><C /></FadeIn>
        </Sequence>
      ))}
      <Sequence from={S(45.6) + S(9.5) - XF} durationInFrames={S(64.8) - S(55.1)}><SceneE2 /></Sequence>
      <Subtitles data={timingsP2} plate />
      <AbsoluteFill style={{background: '#000', opacity: Math.max(fadeOut, fadeIn)}} />
      <Audio src={staticFile('audio/mix_p2.wav')} />
    </AbsoluteFill>
  );
};
export const P2_FRAMES = S(112);

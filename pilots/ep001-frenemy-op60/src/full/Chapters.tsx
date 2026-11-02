import {ThreeCanvas} from '@remotion/three';
import {useMemo} from 'react';
import * as THREE from 'three';
import {AbsoluteFill, interpolate} from 'remotion';
import {Brain3D, DACC, VSTR, projectToScreen} from '../three/Brain3D';
import {CameraRig, ease, lerp, lerp3} from '../three/common';
import {Mascot} from '../three/Mascot';
import {MRIRoom} from '../three/MRI';
import {wobble} from '../three/noise';
import {Hall} from '../three/Sets';
import {Card3D, WhiteRoom, cardTex} from '../three/WhiteRoom';
import {FONT} from '../theme';
import {Tag, Vignette} from '../ui/Overlay';
import {BgStill, Board, Chip, K, MascotOverlay, PathArrow, PersonIcon, Phone, Pop, clamp, fadeIn} from './ui';

export type SceneProps = {f: number; dur: number; T: (id: string, k?: number) => number; E: (id: string) => number};
const seg = (f: number, a: number, b: number) => ease((f - a) / (b - a));
const GL = {toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0, antialias: true, preserveDrawingBuffer: true};
const W = 1920, H = 1080;
const Canvas: React.FC<{children: React.ReactNode; shadows?: boolean}> = ({children, shadows = true}) => (
  <ThreeCanvas width={W} height={H} shadows={shadows ? {type: THREE.PCFSoftShadowMap} : false} gl={GL} style={{position: 'absolute', inset: 0}}>{children}</ThreeCanvas>
);
const hand = (p: [number, number, number], t: number, a: number): [number, number, number] => [p[0] + wobble(t, 1) * a, p[1] + wobble(t, 2) * a, p[2] + wobble(t, 3) * a];

// ============ 2. 人の成功は「痛み」になる ============
const C2Mri: React.FC<SceneProps> = ({f, dur}) => {
  const t = f / 30;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Canvas>
        <CameraRig pos={hand(lerp3([4.3, 2.1, 3.9], [2.9, 1.6, 2.6], seg(f, 0, dur)), t, 0.004)} target={[0.3, 1.0, 0]} fov={34} />
        <MRIRoom slide={seg(f, 40, 200)} />
      </Canvas>
      <Vignette />
      <Tag text="再現" />
      <Chip f={f - 10} text="第2章" sub="人の成功は「痛み」になる" />
    </AbsoluteFill>
  );
};

const Story: React.FC<{f: number; lines: number}> = ({f, lines}) => (
  <div style={{width: 520, height: 330, borderRadius: 18, background: '#f4f1ea', padding: 28, boxShadow: '0 10px 40px rgba(0,0,0,0.5)'}}>
    <div style={{fontSize: 26, fontWeight: 800, color: '#333', marginBottom: 14}}>物語（主人公＝あなた自身）</div>
    {Array.from({length: 7}, (_, i) => (
      <div key={i} style={{height: 14, borderRadius: 7, marginBottom: 18, background: '#c9c2b6', width: `${Math.min(1, Math.max(0, (f - i * 6) / 20)) * (60 + ((i * 37) % 35))}%`, opacity: i < lines ? 1 : 0.25}} />
    ))}
  </div>
);
const C2Step1: React.FC<SceneProps> = ({f, T}) => {
  const icons = [['成績', '📈'], ['進路', '🧭'], ['持ち物', '👜'], ['人気', '💬']];
  return (
    <Board>
      <Chip f={f} text="手順1" sub="MRIの中で、物語を読む" />
      <Pop f={f} at={8} style={{position: 'absolute', left: 150, top: 240}} from="left">
        <svg width={620} height={420} viewBox="0 0 620 420">
          <rect x="40" y="60" width="540" height="300" rx="150" fill="#1e2433" stroke="#46506a" strokeWidth="6" />
          <circle cx="310" cy="210" r="110" fill="#0c0f16" stroke="#6f7fa3" strokeWidth="6" />
          <ellipse cx="310" cy="250" rx="70" ry="22" fill="#d9d2c4" />
          <circle cx="310" cy="205" r="36" fill="#e8c3a6" />
          <rect x="250" y="120" width="120" height="44" rx="6" fill="#9fd0ff" opacity={0.85} />
        </svg>
        <div style={{textAlign: 'center', fontSize: 30, color: K.sub, marginTop: -10}}>MRI装置（脳の働きを調べる）</div>
      </Pop>
      <Pop f={f} at={T('C2_6')} style={{position: 'absolute', left: 1050, top: 230}} from="right"><Story f={f - T('C2_6')} lines={f > T('C2_7') ? 7 : 3} /></Pop>
      <div style={{position: 'absolute', left: 1050, top: 620, display: 'flex', gap: 22}}>
        {icons.map(([l, e], i) => (
          <Pop key={l} f={f} at={T('C2_8', Math.min(2, Math.floor(i / 2) + (i === 3 ? 1 : 0))) + i * 4} from="scale">
            <div style={{width: 112, height: 112, borderRadius: 20, background: K.card, border: `2px solid ${K.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 44}}>
              {e}<div style={{fontSize: 24, fontWeight: 800, marginTop: 4}}>{l}</div>
            </div>
          </Pop>
        ))}
      </div>
    </Board>
  );
};

const Trio: React.FC<{f: number; T: SceneProps['T']; glowA?: number; dimBC?: number; arrows?: boolean}> = ({f, T, glowA = 0, dimBC = 0, arrows = true}) => {
  const people = [
    {id: 'C2_10', k: 'A', star: true, dir: 'same' as const},
    {id: 'C2_11', k: 'B', star: true, dir: 'diff' as const},
    {id: 'C2_12', k: 'C', star: false, dir: 'diff' as const},
  ];
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 260, display: 'flex', justifyContent: 'center', gap: 120}}>
      {people.map((p, i) => (
        <Pop key={p.k} f={f} at={Math.max(0, T(p.id))} from="up">
          <div style={{textAlign: 'center', opacity: i > 0 ? 1 - 0.55 * dimBC : 1}}>
            <PersonIcon size={200} star={p.star} glow={i === 0 ? glowA : 0} color={i === 0 ? '#d7dff0' : '#aab4c9'} />
            <div style={{fontSize: 44, fontWeight: 900, marginTop: 8}}>{p.k}</div>
            {arrows && (
              <div style={{marginTop: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
                <div style={{fontSize: 22, color: K.sub}}>目指す道</div>
                <PathArrow dir={p.dir} width={170} color={p.dir === 'same' ? K.red : K.blue} />
              </div>
            )}
          </div>
        </Pop>
      ))}
    </div>
  );
};
const YouRef: React.FC<{f: number}> = ({f}) => (
  <div style={{position: 'absolute', left: 80, top: 330, opacity: fadeIn(f, 6), textAlign: 'center'}}>
    <PersonIcon size={130} color="#8f9bb3" label="あなた" />
    <div style={{fontSize: 20, color: K.sub, marginTop: 8}}>目指す道</div>
    <PathArrow dir="same" width={130} color={K.red} />
  </div>
);
const C2Step2: React.FC<SceneProps> = ({f, T}) => (
  <Board>
    <Chip f={f} text="手順2" sub="自分と比べる人物が登場する" />
    <YouRef f={f} />
    <Trio f={f} T={T} />
    <div style={{position: 'absolute', right: 70, bottom: 150, fontSize: 24, color: K.sub, opacity: fadeIn(f, 20)}}>★＝自分より優秀　→＝目指す道</div>
  </Board>
);
const C2Step3: React.FC<SceneProps> = ({f, T}) => {
  const rec = Math.floor(f / 15) % 2 === 0;
  return (
    <Board>
      <Chip f={f} text="手順3" sub="どれくらい妬ましいかを答える" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 250, display: 'flex', justifyContent: 'center', gap: 120}}>
        {['A', 'B', 'C'].map((k, i) => (
          <Pop key={k} f={f} at={10 + i * 6}>
            <div style={{textAlign: 'center'}}>
              <PersonIcon size={150} star={i < 2} color="#aab4c9" />
              <div style={{fontSize: 40, fontWeight: 900}}>{k}</div>
              <div style={{marginTop: 18, width: 300, height: 16, borderRadius: 8, background: 'linear-gradient(90deg, #3a4256, #e0533d)'}} />
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 22, color: K.sub, marginTop: 6}}><span>妬ましくない</span><span>妬ましい</span></div>
            </div>
          </Pop>
        ))}
      </div>
      <Pop f={f} at={T('C2_14')} style={{position: 'absolute', left: 0, right: 0, top: 690, display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '16px 30px', borderRadius: 14, background: K.card, border: `2px solid ${K.line}`, fontSize: 32, fontWeight: 800}}>
          <span style={{width: 20, height: 20, borderRadius: 10, background: rec ? K.red : '#5a2a24'}} />MRIが脳の働きを記録
        </div>
      </Pop>
    </Board>
  );
};
const C2Result: React.FC<SceneProps> = ({f, T}) => {
  const g = seg(f, T('C2_16', 2) - 6, T('C2_16', 2) + 14);
  const d = seg(f, T('C2_17'), T('C2_17') + 20);
  return (
    <Board>
      <Chip f={f} text="結果" sub="一番強く妬んだのは？" color={K.red} />
      <Trio f={f + 999} T={() => 0} glowA={g} dimBC={d} />
      <Pop f={f} at={T('C2_16', 2) + 10} style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center'}}>
        <div style={{fontSize: 40, fontWeight: 900}}>優秀 <span style={{color: K.gold}}>×</span> <span style={{color: K.red}}>同じ道</span> の人</div>
      </Pop>
    </Board>
  );
};

const BRAIN_CAM = {pos: [-2.75, 0.55, 1.25] as [number, number, number], target: [0.02, -0.12, 0.0] as [number, number, number], fov: 30};
const BrainShot: React.FC<{f: number; region: 'dacc' | 'vstr'; k: number; label: string; note: string; color: string}> = ({f, region, k, label, note, color}) => {
  const rot = 0.25 - 0.35 * seg(f, 0, 360);
  const pts = region === 'dacc' ? DACC : VSTR;
  const p = projectToScreen(pts[0], rot, BRAIN_CAM, W, H);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 45% 45%, #1b2133 0%, #07080b 75%)'}}>
      <Canvas shadows={false}>
        <CameraRig pos={BRAIN_CAM.pos} target={BRAIN_CAM.target} fov={BRAIN_CAM.fov} />
        <hemisphereLight args={['#c9d6ff', '#20263a', 0.65]} />
        <directionalLight position={[-3, 3, 2.5]} intensity={1.5} color="#fff4ea" />
        <directionalLight position={[2.5, 1.2, -3]} intensity={1.6} color="#7fa2ff" />
        <Brain3D t={f / 30} rotY={rot} amyg={0} extra={[{pos: pts, color, k, size: 0.42}]} />
      </Canvas>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <g opacity={k}>
          <line x1={p[0]} y1={p[1]} x2={p[0] + 260} y2={p[1] - 180} stroke="rgba(255,255,255,0.75)" strokeWidth={3} />
          <circle cx={p[0]} cy={p[1]} r={7} fill="#fff" />
        </g>
      </svg>
      <div style={{position: 'absolute', left: p[0] + 270, top: p[1] - 250, opacity: k, fontFamily: FONT}}>
        <div style={{fontSize: 52, fontWeight: 900, color}}>{label}</div>
        <div style={{fontSize: 30, color: K.ink, marginTop: 6}}>{note}</div>
      </div>
      <div style={{position: 'absolute', left: 60, bottom: 150, fontSize: 22, color: K.sub, fontFamily: FONT}}>脳のCGモデル（自作の模式。部位の位置はおおよそ）</div>
    </AbsoluteFill>
  );
};
const C2Brain: React.FC<SceneProps> = ({f, T}) => {
  const k = 0.3 + 0.7 * seg(f, 10, 30) * (f > T('C2_20') ? 1 + 0.25 * Math.sin(f / 5) : 1);
  return <BrainShot f={f} region="dacc" k={Math.min(1.2, k)} label="背側前帯状皮質" note="体の痛みの処理にかかわる場所" color="#6fb6ff" />;
};
const C2Recall: React.FC<SceneProps> = ({f, dur}) => {
  const t = f / 30;
  const tex = useMemo(() => [cardTex(1), cardTex(3)], []);
  const flip = seg(f, 150, 190);
  return (
    <AbsoluteFill style={{background: '#f2f1ee'}}>
      <Canvas>
        <CameraRig pos={lerp3([0.5, 1.4, 4.4], [0.3, 1.35, 3.8], seg(f, 0, dur))} target={[0, 1.15, 0]} fov={38} />
        <WhiteRoom>
          <group position={[-0.9, 1.5, -0.2]} rotation={[0, 0.1, 0]}><Card3D tex={tex[0]} scale={0.9} dim={flip} /></group>
          <group position={[0.95, 1.5, -0.2]} rotation={[0, -0.1, 0]}><Card3D tex={tex[1]} scale={0.9} glow={flip} /></group>
          <group position={[0.1, 0, 0.9]}>
            <Mascot rotationY={lerp(-0.5, 0.45, flip)} scale={0.62} pose={{headTilt: 0.25 * Math.sin(Math.PI * seg(f, 20, 110)), headNod: -0.2, armL: 0.3, bob: 0.004 * Math.sin(t * 2)}} />
          </group>
        </WhiteRoom>
      </Canvas>
    </AbsoluteFill>
  );
};

// ============ 3. あなたの不幸は「報酬」になる ============
const C3Step4: React.FC<SceneProps> = ({f, T}) => (
  <Board>
    <Chip f={f} text="手順4" sub="妬んだ相手に、不幸が起きる" />
    <Pop f={f} at={T('C3_2')} style={{position: 'absolute', left: 300, top: 250}}>
      <div style={{textAlign: 'center'}}>
        <svg width={260} height={120} viewBox="0 0 260 120"><path d="M40 90 C10 90 10 50 45 50 C50 20 100 15 115 40 C135 15 190 25 190 55 C230 55 235 90 205 90 Z" fill="#59627a" />{[70, 120, 170].map((x) => <path key={x} d={`M${x} 98 l-12 20`} stroke="#6fa8dc" strokeWidth={6} strokeLinecap="round" />)}</svg>
        <PersonIcon size={200} star color="#aab4c9" />
        <div style={{fontSize: 44, fontWeight: 900}}>A</div>
      </div>
    </Pop>
    <Pop f={f} at={T('C3_3', 1)} style={{position: 'absolute', left: 900, top: 380}} from="right">
      <div style={{padding: '30px 40px', borderRadius: 20, background: K.card, border: `2px solid ${K.line}`, width: 760}}>
        <div style={{fontSize: 36, fontWeight: 900}}>どれくらいうれしい気持ちになったか</div>
        <div style={{marginTop: 26, height: 16, borderRadius: 8, background: 'linear-gradient(90deg, #3a4256, #e8c46a)'}} />
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 24, color: K.sub, marginTop: 8}}><span>うれしくない</span><span>うれしい</span></div>
      </div>
    </Pop>
  </Board>
);
const C3Brain: React.FC<SceneProps> = ({f, T}) => {
  const k = 0.3 + 0.7 * seg(f, 10, 30) * (f > T('C3_6') ? 1 + 0.25 * Math.sin(f / 5) : 1);
  return <BrainShot f={f} region="vstr" k={Math.min(1.2, k)} label="腹側線条体" note="報酬を受け取ったときに働く場所" color={K.gold} />;
};
const C3Quote: React.FC<SceneProps> = ({f}) => (
  <AbsoluteFill style={{background: '#040506', fontFamily: FONT, alignItems: 'center', justifyContent: 'center'}}>
    <div style={{textAlign: 'center', marginTop: -80}}>
      <div style={{fontSize: 66, fontWeight: 900, color: K.ink, opacity: fadeIn(f, 6, 20), letterSpacing: '0.08em'}}>あなたの幸せは、<span style={{color: '#6fb6ff'}}>私の痛み</span>。</div>
      <div style={{fontSize: 66, fontWeight: 900, color: K.ink, opacity: fadeIn(f, 40, 20), letterSpacing: '0.08em', marginTop: 34}}>あなたの不幸は、<span style={{color: K.gold}}>私の蜜</span>。</div>
    </div>
  </AbsoluteFill>
);
const C3Phone: React.FC<SceneProps> = ({f, dur, T}) => {
  const split = f >= T('C3_12') - 6;
  return (
    <AbsoluteFill>
      <BgStill src="bg/apartment_night.png" f={f} dur={dur} blur={split ? 6 : 0} dark={split ? 0.6 : 0.35} />
      <Tag text="再現" />
      {!split && <Phone f={f} x={660} y={70} title="夜 23:48" msgs={[{from: 'them', name: '友達', text: '大丈夫？今から行こうか？なんでも話聞くよ', at: 22, typing: 0, time: '23:48'}]} />}
      {split && (
        <>
          <Pop f={f} at={T('C3_12') - 6} style={{position: 'absolute', left: 200, top: 120}} from="left">
            <div style={{fontSize: 34, fontWeight: 900, color: K.ink, marginBottom: 14, textAlign: 'center'}}>うまくいったとき</div>
            <Phone f={9999} x={0} y={0} scale={0.72} title="トーク" msgs={[{from: 'me', text: '昇進決まった！', at: 0, time: '18:02'}, {from: 'them', text: 'へえ', at: 0, time: '翌日 9:15'}]} />
          </Pop>
          <Pop f={f} at={T('C3_13') - 6} style={{position: 'absolute', left: 1210, top: 120}} from="right">
            <div style={{fontSize: 34, fontWeight: 900, color: K.ink, marginBottom: 14, textAlign: 'center'}}>失敗したとき</div>
            <Phone f={9999} x={0} y={0} scale={0.72} title="トーク" msgs={[{from: 'me', text: 'やらかした…', at: 0, time: '23:47'}, {from: 'them', text: '大丈夫？今から行こうか？', at: 0, time: '23:48'}]} />
          </Pop>
          <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: fadeIn(f, T('C3_14'), 14)}}>
            <line x1={650} y1={540} x2={1210} y2={540} stroke={K.gold} strokeWidth={6} strokeDasharray="14 12" />
            <text x={930} y={510} textAnchor="middle" fontSize={34} fontWeight={900} fill={K.gold} fontFamily={FONT}>同じ一本の線</text>
          </svg>
        </>
      )}
    </AbsoluteFill>
  );
};

// ============ 4. 自己評価維持モデル ============
const C4Icons: React.FC<SceneProps> = ({f, T}) => {
  const tags = ['仕事', '恋愛', '見た目', 'お金'];
  return (
    <Board>
      <Chip f={f} text="第4章" sub="なぜ「近い人」から生まれるのか" />
      <MascotOverlay f={f} x={750} y={300} pose={{headTilt: 0.15 * Math.sin(f / 30)}} rotY={0} />
      <Pop f={f} at={20} style={{position: 'absolute', left: 120, top: 220, opacity: 0.6}}><div style={{textAlign: 'center'}}><div style={{fontSize: 80}}>📺</div><div style={{fontSize: 26, color: K.sub}}>遠い有名人</div></div></Pop>
      {tags.map((tg, i) => (
        <Pop key={tg} f={f} at={30 + i * 8} style={{position: 'absolute', left: [560, 1250, 520, 1300][i], top: [330, 330, 640, 640][i]}}>
          <div style={{textAlign: 'center'}}>
            <div style={{display: 'inline-block', padding: '6px 16px', borderRadius: 10, background: K.red, color: '#fff', fontSize: 26, fontWeight: 900, marginBottom: 8}}>{tg}</div>
            <PersonIcon size={110} color="#c9d3e6" />
          </div>
        </Pop>
      ))}
      <Pop f={f} at={T('C4_3', 1)} style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center'}}>
        <div style={{display: 'inline-block', padding: '14px 40px', borderRadius: 14, background: 'rgba(232,196,106,0.15)', border: `2px solid ${K.gold}`, fontSize: 48, fontWeight: 900, color: K.gold}}>自己評価維持モデル</div>
      </Pop>
      <div style={{position: 'absolute', left: 0, right: 0, top: 810, display: 'flex', justifyContent: 'center', gap: 40}}>
        <Pop f={f} at={T('C4_7')}><div style={{padding: '14px 28px', borderRadius: 14, background: K.card, border: `2px solid ${K.line}`, fontSize: 34, fontWeight: 800}}>① どれくらい近いか</div></Pop>
        <Pop f={f} at={T('C4_8')}><div style={{padding: '14px 28px', borderRadius: 14, background: K.card, border: `2px solid ${K.line}`, fontSize: 34, fontWeight: 800}}>② 自分にとってどれくらい大事か</div></Pop>
      </div>
    </Board>
  );
};
const C4Axes: React.FC<SceneProps> = ({f, T}) => {
  const ox = 560, oy = 860, w = 900, h = 640;
  const refl = fadeIn(f, T('C4_9'), 14), comp = fadeIn(f, T('C4_13'), 14), strong = seg(f, T('C4_15'), T('C4_15') + 40);
  return (
    <Board>
      <Chip f={f} text="自己評価維持モデル" />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}} fontFamily={FONT}>
        <line x1={ox} y1={oy} x2={ox + w} y2={oy} stroke="#8a95ad" strokeWidth={4} />
        <line x1={ox} y1={oy} x2={ox} y2={oy - h} stroke="#8a95ad" strokeWidth={4} />
        <text x={ox + w} y={oy + 50} textAnchor="end" fontSize={32} fontWeight={800} fill={K.ink}>近さ →</text>
        <text x={ox - 30} y={oy - h - 20} fontSize={32} fontWeight={800} fill={K.ink}>↑ 自分にとっての大事さ</text>
        <rect x={ox + w / 2} y={oy - h / 2} width={w / 2} height={h / 2} fill={K.gold} opacity={0.18 * refl + 0.12 * refl * strong} />
        <rect x={ox + w / 2} y={oy - h} width={w / 2} height={h / 2} fill={K.red} opacity={0.22 * comp + 0.15 * comp * strong} />
        <g opacity={refl}><text x={ox + w * 0.75} y={oy - h * 0.25} textAnchor="middle" fontSize={56} fontWeight={900} fill={K.gold}>反映</text><text x={ox + w * 0.75} y={oy - h * 0.25 + 46} textAnchor="middle" fontSize={26} fill={K.ink}>誇らしい</text></g>
        <g opacity={comp}><text x={ox + w * 0.75} y={oy - h * 0.75} textAnchor="middle" fontSize={56} fontWeight={900} fill={K.red}>比較</text><text x={ox + w * 0.75} y={oy - h * 0.75 + 46} textAnchor="middle" fontSize={26} fill={K.ink}>評価が下がる</text></g>
        <g opacity={strong}><path d={`M ${ox + 80} ${oy + 90} L ${ox + w - 40} ${oy + 90}`} stroke={K.ink} strokeWidth={6} /><path d={`M ${ox + w - 50} ${oy + 76} L ${ox + w - 20} ${oy + 90} L ${ox + w - 50} ${oy + 104} Z`} fill={K.ink} /><text x={ox + w / 2} y={oy + 140} textAnchor="middle" fontSize={28} fill={K.ink}>近いほど、反映も比較も強くなる</text></g>
      </svg>
      <Pop f={f} at={T('C4_11')} style={{position: 'absolute', left: 110, top: 420}} from="left">
        <div style={{padding: '16px 24px', borderRadius: 22, background: '#fffaf2', color: '#2a2420', fontSize: 30, fontWeight: 800, width: 360}}>「すごいでしょ、<br />あれ私の友達なんだ」</div>
      </Pop>
    </Board>
  );
};
const C4Examples: React.FC<SceneProps> = ({f, T}) => {
  const ex = [['同じ年に入社した同期', 'C4_17', 0], ['同じ時期に婚活をしている友達', 'C4_17', 1], ['一緒にダイエットを始めた友達', 'C4_18', 0], ['昔から何でも一緒だった幼なじみ', 'C4_18', 1]] as const;
  const ruler = fadeIn(f, T('C4_19'), 14);
  return (
    <Board>
      <Pop f={f} at={6} style={{position: 'absolute', left: 120, top: 120, opacity: 0.5}}><div style={{textAlign: 'center'}}><div style={{fontSize: 70}}>📺</div><div style={{fontSize: 26, color: K.sub}}>比べる相手にならない</div></div></Pop>
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', gap: 34}}>
        {ex.map(([t, id, k], i) => (
          <Pop key={i} f={f} at={T(id, k)}>
            <div style={{width: 340, height: 300, borderRadius: 18, background: K.card, border: `2px solid ${f > T('C4_20', 2) ? K.red : K.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20}}>
              <PersonIcon size={110} color="#c9d3e6" />
              <div style={{fontSize: 28, fontWeight: 800, textAlign: 'center', lineHeight: 1.35}}>{t}</div>
            </div>
          </Pop>
        ))}
      </div>
      <svg width={W} height={160} style={{position: 'absolute', left: 0, top: 640, opacity: ruler}}>
        <rect x={180} y={30} width={1560} height={46} rx={8} fill="#c8a76c" />
        {Array.from({length: 40}, (_, i) => <line key={i} x1={200 + i * 39} y1={30} x2={200 + i * 39} y2={i % 5 === 0 ? 66 : 52} stroke="#5a4a2e" strokeWidth={3} />)}
        <text x={960} y={130} textAnchor="middle" fontSize={32} fontWeight={800} fill={K.ink} fontFamily={FONT}>自分の物差し</text>
      </svg>
      <Pop f={f} at={T('C4_23')} style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center'}}>
        <div style={{fontSize: 48, fontWeight: 900}}><span style={{color: K.ink}}>近い</span> <span style={{color: K.gold}}>×</span> <span style={{color: K.red}}>同じ道</span> ＝ フレネミーが生まれる場所</div>
      </Pop>
    </Board>
  );
};

// ============ 4b ============
const C4bPhone: React.FC<SceneProps> = ({f, dur}) => (
  <AbsoluteFill>
    <BgStill src="bg/cafe.png" f={f} dur={dur} blur={8} dark={0.55} />
    <Tag text="再現" />
    <Phone f={f} x={660} y={60} title="グループ" msgs={[
      {from: 'me', text: '昇進決まった！', at: 6, time: '18:02'},
      {from: 'them', name: '同じ道を歩く友達', text: 'すごい。……でもさ、責任重くなるし、大変だよね', at: 34, typing: 16, time: '18:09'},
      {from: 'them', name: '違う道を歩く友達', text: 'えー！最高じゃん！どんな仕事するの？今度お祝いさせて！', at: 62, typing: 10, time: '18:03'},
    ]} />
  </AbsoluteFill>
);
const C4bOffice: React.FC<SceneProps> = ({f, T}) => (
  <Board>
    {f < T('C4b_9') ? (
      <>
        <Tag text="再現" />
        <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
          <rect x={300} y={720} width={1320} height={20} fill="#3a3530" />
          <rect x={420} y={520} width={360} height={200} rx={8} fill="#2a2f3a" />
          <rect x={1140} y={520} width={360} height={200} rx={8} fill="#2a2f3a" />
          <circle cx={760} cy={430} r={60} fill="#3b2c22" />
          <path d="M 680 720 C 680 560 700 500 760 500 C 820 500 840 560 840 720 Z" fill="#5d6b82" />
          <circle cx={1140} cy={430} r={60} fill="#e8c3a6" />
          <path d="M 1060 720 C 1060 560 1080 500 1140 500 C 1200 500 1220 560 1220 720 Z" fill="#8a7a6a" />
        </svg>
        <Pop f={f} at={20} style={{position: 'absolute', left: 520, top: 190}}>
          <div style={{padding: '18px 30px', borderRadius: 26, background: '#fffaf2', color: '#2a2420', fontSize: 36, fontWeight: 800}}>友達がね、昇進したんだって。すごくない？</div>
        </Pop>
      </>
    ) : (
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: fadeIn(f, T('C4b_9'), 12)}} fontFamily={FONT}>
        <path d="M 260 760 L 1660 760" stroke={K.red} strokeWidth={10} />
        <path d="M 260 760 C 800 760 1000 420 1660 380" stroke={K.blue} strokeWidth={10} fill="none" />
        <circle cx={300} cy={700} r={26} fill="#8f9bb3" /><text x={300} y={830} textAnchor="middle" fontSize={30} fill={K.ink}>あなた</text>
        <circle cx={1100} cy={700} r={26} fill={K.red} /><text x={1100} y={830} textAnchor="middle" fontSize={30} fill={K.red} fontWeight={800}>同じ道 → 痛み</text>
        <circle cx={1350} cy={350} r={26} fill={K.blue} /><text x={1350} y={300} textAnchor="middle" fontSize={30} fill={K.blue} fontWeight={800}>違う道 → 誇り</text>
      </svg>
    )}
  </Board>
);
const C4bSummary: React.FC<SceneProps> = ({f, T}) => {
  const items = [['C4b_13', '同じ道の上の成功', '脳は痛みの場所を動かす', K.red], ['C4b_14', '相手が近いほど', '痛みは強くなる', K.red], ['C4b_15', '違う道の上の成功', '近いほど誇らしい', K.gold]] as const;
  return (
    <Board>
      <Chip f={f} text="まとめ" />
      <div style={{position: 'absolute', left: 260, top: 220, display: 'flex', flexDirection: 'column', gap: 34}}>
        {items.map(([id, a, b, c]) => (
          <Pop key={id} f={f} at={T(id)} from="left">
            <div style={{display: 'flex', alignItems: 'center', gap: 30, fontSize: 46, fontWeight: 900}}>
              <span style={{width: 14, height: 60, borderRadius: 7, background: c}} />{a}<span style={{color: K.sub}}>→</span><span style={{color: c}}>{b}</span>
            </div>
          </Pop>
        ))}
      </div>
      <Pop f={f} at={T('C4b_16', 1)} style={{position: 'absolute', left: 0, right: 0, top: 720, textAlign: 'center'}}>
        <div style={{fontSize: 44, fontWeight: 900}}>痛みを感じた心は、そのあと<span style={{color: K.red}}>何をする？</span></div>
      </Pop>
    </Board>
  );
};

// ============ 5 ============
const C5Chat: React.FC<SceneProps> = ({f, dur}) => (
  <AbsoluteFill>
    <BgStill src="bg/cafe.png" f={f} dur={dur} blur={8} dark={0.55} />
    <Tag text="再現" />
    <Phone f={f} x={660} y={60} title="同じ道を歩く友達" msgs={[
      {from: 'me', text: '彼氏できた！', at: 6, time: '4/2'},
      {from: 'them', text: 'えー、おめでと。……でもその人、大丈夫？', at: 60, typing: 40, time: '4/2'},
      {from: 'me', text: '5キロ痩せた！', at: 84, time: '6/18'},
      {from: 'them', text: 'すごいじゃん。でもリバウンドには気をつけてね', at: 138, typing: 40, time: '6/18'},
      {from: 'me', text: '昇進決まった！', at: 162, time: '10/1'},
      {from: 'them', text: 'すごい。……でもさ、責任重くなるし、大変だよね', at: 216, typing: 40, time: '10/1'},
    ]} />
  </AbsoluteFill>
);
const THREE_WAYS = [['距離を取る', '↔'], ['大事じゃないことにする', '⤵'], ['相手の成功を小さくする', '🔍']];
const C5Three: React.FC<SceneProps> = ({f, T}) => (
  <Board>
    <Chip f={f} text="評価を守る3つの動き" />
    <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', gap: 50}}>
      {THREE_WAYS.map(([t, e], i) => (
        <Pop key={t} f={f} at={T(['C5_6', 'C5_7', 'C5_8'][i])}>
          <div style={{width: 470, height: 380, borderRadius: 22, background: K.card, border: `2px solid ${K.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20}}>
            <div style={{fontSize: 40, color: K.gold, fontWeight: 900}}>{['①', '②', '③'][i]}</div>
            <div style={{fontSize: 90}}>{e}</div>
            <div style={{fontSize: 36, fontWeight: 900}}>{t}</div>
          </div>
        </Pop>
      ))}
    </div>
  </Board>
);
const C5Cases: React.FC<SceneProps> = ({f, T}) => {
  const k = f < T('C5_11') ? 0 : f < T('C5_12') ? 1 : 2;
  const done = f >= T('C5_13');
  return (
    <AbsoluteFill>
      <BgStill src="bg/cafe.png" f={f} dur={600} blur={10} dark={0.65} />
      <Tag text="再現（演出）" />
      <Chip f={f} text={['① 距離', '② 大事さ', '③ 出来の評価'][k]} />
      {!done && k === 0 && (
        <Phone f={f} x={660} y={80} scale={0.95} title="同じ道を歩く友達" msgs={[
          {from: 'me', text: '今度ごはん行かない？', at: 10, time: '5/1'}, {from: 'them', text: 'ごめん、その日ちょっと…', at: 30, time: '5/3'},
          {from: 'me', text: '来週はどう？', at: 55, time: '5/10'}, {from: 'them', text: 'また連絡するね', at: 80, time: '5/24'},
        ]} />
      )}
      {!done && k === 1 && <Phone f={f - T('C5_11') + 10} x={660} y={80} scale={0.95} title="同じ道を歩く友達" msgs={[{from: 'me', text: '昇進決まった！', at: 0}, {from: 'them', text: 'てか私、別に出世とか興味ないし', at: 14}]} />}
      {!done && k === 2 && <Phone f={f - T('C5_12') + 10} x={660} y={80} scale={0.95} title="同じ道を歩く友達" msgs={[{from: 'me', text: '昇進決まった！', at: 0}, {from: 'them', text: '運がよかったよね。タイミングもあったし', at: 14}]} />}
      {done && (
        <Pop f={f} at={T('C5_13')} style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center'}}>
          <div style={{fontSize: 52, fontWeight: 900, color: K.ink}}>計算ではなく、<span style={{color: K.gold}}>自分を守るための動き</span></div>
        </Pop>
      )}
    </AbsoluteFill>
  );
};
const C5Doors: React.FC<SceneProps> = ({f, T}) => {
  const lock = [f >= T('C5_15') + 20, f >= T('C5_16') + 20];
  const glow = seg(f, T('C5_17'), T('C5_17') + 20);
  const q = [['「でもその人、大丈夫？」', 0], ['「リバウンドには気をつけてね」', 1], ['「責任重くなるし、大変だよね」', 2]] as const;
  const conv = seg(f, T('C5_19', 2), T('C5_19', 2) + 30);
  return (
    <Board>
      <div style={{position: 'absolute', left: 0, right: 0, top: 160, display: 'flex', justifyContent: 'center', gap: 70}}>
        {THREE_WAYS.map(([t], i) => (
          <div key={t} style={{width: 330, textAlign: 'center', opacity: i < 2 && lock[i] ? 0.4 : 1}}>
            <div style={{height: 420, borderRadius: '160px 160px 10px 10px', background: i === 2 ? `rgba(224,83,61,${0.25 + 0.6 * glow})` : '#232a39', border: `4px solid ${i === 2 ? K.red : '#3a4256'}`, boxShadow: i === 2 ? `0 0 ${60 * glow}px rgba(224,83,61,0.7)` : 'none', position: 'relative'}}>
              <div style={{position: 'absolute', right: 40, top: 220, width: 22, height: 22, borderRadius: 11, background: K.gold}} />
              {i < 2 && lock[i] && <div style={{position: 'absolute', left: 0, right: 0, top: 150, fontSize: 90}}>🔒</div>}
            </div>
            <div style={{fontSize: 30, fontWeight: 800, marginTop: 14}}>{t}</div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 690, display: 'flex', justifyContent: 'center', gap: 26}}>
        {q.map(([t, k]) => (
          <Pop key={t} f={f} at={T('C5_18', k)}><div style={{padding: '12px 20px', borderRadius: 18, background: '#fffaf2', color: '#2a2420', fontSize: 28, fontWeight: 800}}>{t}</div></Pop>
        ))}
      </div>
      <Pop f={f} at={T('C5_19', 2)} style={{position: 'absolute', left: 0, right: 0, top: 800, textAlign: 'center'}}>
        <div style={{fontSize: 40, fontWeight: 900}}><span style={{color: K.gold, opacity: 1 - 0.6 * conv}}>おめでたいこと</span> → <span style={{color: K.red}}>心配なこと</span></div>
      </Pop>
    </Board>
  );
};
const C5Formula: React.FC<SceneProps> = ({f, T}) => (
  <Board>
    <Chip f={f} text="フレネミーの正体" color={K.red} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontWeight: 900}}>
      <Pop f={f} at={T('C5_24')} from="scale"><div style={{fontSize: 120}}>近さ <span style={{color: K.gold}}>×</span> <span style={{color: K.red}}>同じ道</span></div></Pop>
      <Pop f={f} at={T('C5_25', 2)} from="scale"><div style={{fontSize: 64, marginTop: 30, color: K.sub}}>＝ あなたの成功が、相手の<span style={{color: '#6fb6ff'}}>痛み</span>になる</div></Pop>
      <Pop f={f} at={T('C5_26')} from="scale"><div style={{fontSize: 64, marginTop: 20}}>→ 「<span style={{color: K.red}}>でもさ</span>」</div></Pop>
    </div>
  </Board>
);

// ============ 6 ============
const C6Axes: React.FC<SceneProps> = ({f, T}) => {
  const ox = 260, oy = 820, w = 640, h = 560;
  const red = fadeIn(f, T('C6_3'), 14);
  const half = f >= T('C6_5');
  return (
    <Board>
      <Chip f={f} text="第6章" sub="横にいるだけで、体に起きること" />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}} fontFamily={FONT}>
        <line x1={ox} y1={oy} x2={ox + w} y2={oy} stroke="#8a95ad" strokeWidth={4} />
        <line x1={ox} y1={oy} x2={ox} y2={oy - h} stroke="#8a95ad" strokeWidth={4} />
        <text x={ox + w} y={oy + 46} textAnchor="end" fontSize={28} fontWeight={800} fill={K.ink}>この人は助けになる →</text>
        <text x={ox - 20} y={oy - h - 18} fontSize={28} fontWeight={800} fill={K.ink}>↑ この人に嫌な思いをさせられる</text>
        <rect x={ox + w / 2} y={oy - h} width={w / 2} height={h / 2} fill={K.red} opacity={0.35 * red} />
        <text x={ox + w * 0.75} y={oy - h * 0.75 + 12} textAnchor="middle" fontSize={30} fontWeight={900} fill="#fff" opacity={red}>アンビバレント</text>
      </svg>
      {half && (
        <div style={{position: 'absolute', left: 1080, top: 260, width: 680}}>
          <div style={{fontSize: 34, fontWeight: 800, marginBottom: 20}}>「大切だ」と挙げた相手のうち</div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 18, width: 640}}>
            {Array.from({length: 10}, (_, i) => <Pop key={i} f={f} at={T('C6_5') + i * 3}><PersonIcon size={100} color={i < 5 ? K.red : '#5a6378'} /></Pop>)}
          </div>
          <Pop f={f} at={T('C6_5', 1)}><div style={{fontSize: 56, fontWeight: 900, color: K.red, marginTop: 20}}>ほぼ半分</div></Pop>
          <div style={{fontSize: 22, color: K.sub, marginTop: 8}}>※ アイコンは割合のイメージ</div>
        </div>
      )}
    </Board>
  );
};
const Gauge: React.FC<{label: string; v: number; color: string}> = ({label, v, color}) => (
  <div style={{textAlign: 'center', width: 360}}>
    <svg width={300} height={180} viewBox="0 0 300 180">
      <path d="M 30 160 A 120 120 0 0 1 270 160" stroke="#3a4256" strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d="M 30 160 A 120 120 0 0 1 270 160" stroke={color} strokeWidth={22} fill="none" strokeLinecap="round" strokeDasharray={`${377 * v} 999`} />
      <line x1={150} y1={160} x2={150 + 100 * Math.cos(Math.PI * (1 - v))} y2={160 - 100 * Math.sin(Math.PI * (1 - v))} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
    </svg>
    <div style={{fontSize: 30, fontWeight: 800}}>{label}</div>
  </div>
);
const C6Bp: React.FC<SceneProps> = ({f, T}) => {
  const res = seg(f, T('C6_9'), T('C6_9') + 40);
  return (
    <Board>
      <Chip f={f} text="研究①" sub="携帯型の血圧計で3日間" />
      <Pop f={f} at={10} style={{position: 'absolute', left: 140, top: 230}} from="left">
        <svg width={520} height={420} viewBox="0 0 520 420">
          <path d="M 40 300 C 120 250 260 230 470 250 L 470 330 C 260 320 120 340 40 380 Z" fill="#e8c3a6" />
          <rect x="190" y="215" width="150" height="140" rx="20" fill="#3b4a66" />
          <rect x="350" y="120" width="140" height="90" rx="12" fill="#1d2230" stroke="#6f7fa3" strokeWidth="4" />
          <path d="M 340 255 C 380 240 400 220 410 210" stroke="#6f7fa3" strokeWidth="6" fill="none" />
          <text x="420" y="175" textAnchor="middle" fontSize="40" fontWeight="900" fill="#9fd0ff" fontFamily={FONT}>♥</text>
        </svg>
      </Pop>
      <Pop f={f} at={T('C6_7')} style={{position: 'absolute', left: 760, top: 250}}>
        <div style={{display: 'flex', gap: 40}}>
          <div style={{padding: '20px 34px', borderRadius: 16, background: K.card, border: `2px solid ${K.line}`, fontSize: 52, fontWeight: 900}}>102人</div>
          <div style={{padding: '20px 34px', borderRadius: 16, background: K.card, border: `2px solid ${K.line}`, fontSize: 52, fontWeight: 900}}>3日間</div>
        </div>
      </Pop>
      <Pop f={f} at={T('C6_8')} style={{position: 'absolute', left: 760, top: 410, fontSize: 32, color: K.sub}}>人と会って話すたびに、血圧を記録</Pop>
      <div style={{position: 'absolute', left: 740, top: 520, display: 'flex', gap: 40, opacity: fadeIn(f, T('C6_9'), 12)}}>
        <Gauge label="嫌いな相手" v={0.35 + 0.15 * res} color="#8a95ad" />
        <Gauge label="フレネミーのような相手" v={0.35 + 0.35 * res} color={K.red} />
      </div>
      <div style={{position: 'absolute', left: 760, top: 830, fontSize: 22, color: K.sub, opacity: fadeIn(f, T('C6_9'), 12)}}>※ 説明図（上がり方の大小のイメージ。実測値ではありません）</div>
    </Board>
  );
};
const C6Lab: React.FC<SceneProps> = ({f, T}) => {
  const res = seg(f, T('C6_12'), T('C6_12') + 40);
  return (
    <Board>
      <Chip f={f} text="研究②" sub="友達と実験室へ" />
      <Pop f={f} at={10} style={{position: 'absolute', left: 160, top: 260}}>
        <div style={{display: 'flex', gap: 50, alignItems: 'flex-end'}}>
          <PersonIcon size={170} color="#c9d3e6" label="参加者" />
          <PersonIcon size={170} color="#9fb0c9" label="同性の友達" />
        </div>
        <div style={{display: 'flex', gap: 30, marginTop: 30}}>
          <div style={{padding: '16px 30px', borderRadius: 16, background: K.card, border: `2px solid ${K.line}`, fontSize: 46, fontWeight: 900}}>107人</div>
        </div>
      </Pop>
      <Pop f={f} at={T('C6_11')} style={{position: 'absolute', left: 820, top: 260}}>
        <div style={{padding: '16px 26px', borderRadius: 22, background: '#fffaf2', color: '#2a2420', fontSize: 32, fontWeight: 800}}>最近あった嫌な出来事を話す</div>
        <div style={{fontSize: 28, color: K.sub, marginTop: 14}}>話しているあいだの血圧を測る</div>
      </Pop>
      <div style={{position: 'absolute', left: 800, top: 520, display: 'flex', gap: 40, opacity: fadeIn(f, T('C6_12'), 12)}}>
        <Gauge label="支えてくれる友達" v={0.3 + 0.12 * res} color={K.blue} />
        <Gauge label="フレネミーのような友達" v={0.3 + 0.4 * res} color={K.red} />
      </div>
      <div style={{position: 'absolute', left: 820, top: 830, fontSize: 22, color: K.sub, opacity: fadeIn(f, T('C6_12'), 12)}}>※ 説明図（上がり方の大小のイメージ。実測値ではありません）</div>
    </Board>
  );
};
const C6Telomere: React.FC<SceneProps> = ({f, T}) => {
  const short = seg(f, T('C6_14', 2), T('C6_14', 2) + 40);
  return (
    <Board>
      <Chip f={f} text="研究③" sub="136人を調べると" />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {[0, 1].map((k) => {
          const cx = 700 + k * 520, cap = k === 0 ? 70 : 70 - 45 * short;
          return (
            <g key={k} transform={`translate(${cx} 540) rotate(${k ? 8 : -8})`}>
              <rect x={-60} y={-250} width={120} height={500} rx={60} fill="#5d6b9a" />
              <rect x={-60} y={-250} width={120} height={cap} rx={50} fill={k ? K.red : K.gold} />
              <rect x={-60} y={250 - cap} width={120} height={cap} rx={50} fill={k ? K.red : K.gold} />
              <ellipse cx={0} cy={0} rx={70} ry={26} fill="#3e4a75" />
            </g>
          );
        })}
      </svg>
      <div style={{position: 'absolute', left: 560, top: 860, fontSize: 30, fontWeight: 800, width: 300, textAlign: 'center'}}>フレネミーのような相手が少ない</div>
      <div style={{position: 'absolute', left: 1060, top: 860, fontSize: 30, fontWeight: 800, width: 320, textAlign: 'center', color: K.red}}>多い</div>
      <Pop f={f} at={T('C6_14', 1)} style={{position: 'absolute', left: 1380, top: 300, width: 440}}>
        <div style={{fontSize: 34, fontWeight: 900, color: K.gold}}>テロメア</div>
        <div style={{fontSize: 28, color: K.ink, marginTop: 8}}>染色体の端。細胞の老化の目安</div>
      </Pop>
      <Pop f={f} at={T('C6_15')} style={{position: 'absolute', left: 1380, top: 560, width: 460}}>
        <div style={{padding: '18px 22px', borderRadius: 14, border: `2px solid ${K.gold}`, fontSize: 30, fontWeight: 800}}>分かったのは「関係がある」まで。<br /><span style={{color: K.sub}}>どちらが原因かは未確定</span></div>
      </Pop>
    </Board>
  );
};
const C6Topics: React.FC<SceneProps> = ({f, T}) => {
  const topics = ['趣味', '家族', '仕事', '恋愛'];
  const blink = f > T('C6_20') && Math.floor(f / 10) % 2 === 0;
  return (
    <Board>
      <MascotOverlay f={f} x={180} y={420} pose={{headTilt: 0.2 * Math.sin(Math.PI * seg(f, 0, 90)), headNod: -0.15}} rotY={0.45} />
      <div style={{position: 'absolute', left: 680, top: 330, display: 'flex', gap: 30}}>
        {topics.map((t, i) => {
          const hot = i === 2 && f > T('C6_19');
          return (
            <Pop key={t} f={f} at={10 + i * 6}>
              <div style={{width: 250, height: 330, borderRadius: 20, background: hot ? (blink ? 'rgba(224,83,61,0.85)' : 'rgba(224,83,61,0.45)') : K.card, border: `3px solid ${hot ? K.red : K.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, fontWeight: 900}}>{t}</div>
            </Pop>
          );
        })}
      </div>
      <Pop f={f} at={T('C6_21')} style={{position: 'absolute', left: 680, top: 720}}>
        <div style={{fontSize: 44, fontWeight: 900}}>反応は<span style={{color: K.red}}>話題</span>で予測できる</div>
      </Pop>
      <Pop f={f} at={T('C6_17')} style={{position: 'absolute', left: 680, top: 180}}>
        <div style={{fontSize: 40, fontWeight: 800, color: K.sub}}>今日は味方？ 敵？</div>
      </Pop>
    </Board>
  );
};
const C6Chain: React.FC<SceneProps> = ({f, T}) => {
  const steps = [['近いから', 'C6_23', 0], ['比べる', 'C6_23', 0], ['痛む', 'C6_23', 0], ['「でもさ」', 'C6_23', 1], ['体が身構える', 'C6_24', 0]] as const;
  return (
    <Board>
      <div style={{position: 'absolute', left: 0, right: 0, top: 400, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22}}>
        {steps.map(([t, id, k], i) => (
          <Pop key={t} f={f} at={T(id, k) + (k === 0 && id === 'C6_23' ? i * 22 : 0)} from="left">
            <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
              <div style={{padding: '24px 30px', borderRadius: 18, background: i === 3 ? K.red : i === 4 ? '#2c5a7a' : K.card, border: `2px solid ${K.line}`, fontSize: 40, fontWeight: 900}}>{t}</div>
              {i < steps.length - 1 && <div style={{fontSize: 46, color: K.gold}}>→</div>}
            </div>
          </Pop>
        ))}
      </div>
      <Pop f={f} at={T('C6_25')} style={{position: 'absolute', left: 0, right: 0, top: 620, textAlign: 'center'}}>
        <div style={{fontSize: 42, fontWeight: 900, color: K.gold}}>正体と、体への影響が一本につながる</div>
      </Pop>
    </Board>
  );
};

// ============ 6b ============
const C6bYear: React.FC<SceneProps> = ({f, T}) => {
  const ev = ['趣味の話', '家族の話', '落ち込んだ夜の電話', '昇進の報告', '旅行の話', '恋人ができた報告', '誕生日'];
  const hot = [3, 5];
  const step = Math.min(ev.length - 1, Math.floor(f / 26));
  return (
    <Board>
      <Tag text="再現（イメージ）" />
      <div style={{position: 'absolute', left: 120, right: 120, top: 220, display: 'flex', gap: 14}}>
        {ev.map((e, i) => {
          const on = i <= step;
          const isHot = hot.includes(i);
          return (
            <div key={e} style={{flex: 1, opacity: on ? 1 : 0.15, textAlign: 'center'}}>
              <div style={{height: 260, borderRadius: 16, background: isHot ? 'rgba(224,83,61,0.25)' : 'rgba(111,168,220,0.18)', border: `2px solid ${isHot ? K.red : K.blue}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
                <svg width={110} height={110} viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="#f0d2bd" />
                  <circle cx="35" cy="45" r="5" fill="#2a1a12" /><circle cx="65" cy="45" r="5" fill="#2a1a12" />
                  {isHot ? <line x1="35" y1="70" x2="65" y2="70" stroke="#2a1a12" strokeWidth="5" strokeLinecap="round" /> : <path d="M 32 64 Q 50 80 68 64" stroke="#2a1a12" strokeWidth="5" fill="none" strokeLinecap="round" />}
                  <path d="M 8 40 C 10 6 90 6 92 40 C 80 22 20 22 8 40 Z" fill="#5a3a28" />
                </svg>
                <div style={{fontSize: 22, fontWeight: 800, padding: '0 6px'}}>{e}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 120, right: 120, top: 520, height: 6, background: '#3a4256', borderRadius: 3}}>
        <div style={{width: `${((step + 1) / ev.length) * 100}%`, height: '100%', background: K.gold, borderRadius: 3}} />
      </div>
      <div style={{position: 'absolute', left: 120, top: 550, fontSize: 26, color: K.sub}}>1年間</div>
      <Pop f={f} at={T('C6b_10')} style={{position: 'absolute', left: 0, right: 0, top: 680, textAlign: 'center'}}>
        <div style={{fontSize: 44, fontWeight: 900}}>落ち込んでいる夜に、<span style={{color: K.blue}}>一番やさしい</span></div>
      </Pop>
    </Board>
  );
};
const C6bCalendar: React.FC<SceneProps> = ({f, T}) => {
  const red = new Set([37, 92, 150, 151, 233, 301]);
  const n = Math.min(365, Math.floor(f * 6));
  return (
    <Board>
      <div style={{position: 'absolute', left: 240, top: 170, display: 'grid', gridTemplateColumns: 'repeat(53, 22px)', gridAutoRows: '22px', gridAutoFlow: 'column', gridTemplateRows: 'repeat(7, 22px)', gap: 5}}>
        {Array.from({length: 365}, (_, i) => (
          <div key={i} style={{borderRadius: 4, background: i >= n ? '#1d2230' : red.has(i) ? K.red : 'rgba(111,168,220,0.75)', boxShadow: red.has(i) && i < n ? '0 0 12px rgba(224,83,61,0.9)' : 'none'}} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 240, top: 390, display: 'flex', gap: 40, fontSize: 28, fontWeight: 800}}>
        <span><span style={{color: K.blue}}>■</span> 味方の日</span><span><span style={{color: K.red}}>■</span> トゲが出た日（あなたが前に出た日）</span>
      </div>
      <Pop f={f} at={T('C6b_14', 1)} style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center'}}>
        <div style={{fontSize: 48, fontWeight: 900}}>鍵は優しさの量ではなく、<br /><span style={{color: K.red}}>トゲが「どの話題で」出るか</span></div>
      </Pop>
    </Board>
  );
};

// ============ 7 ============
const C7Title: React.FC<SceneProps> = ({f}) => (
  <Board>
    <Chip f={f} text="第7章" sub="これが当てはまるならフレネミー" />
    <Pop f={f} at={6} from="scale" style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center'}}>
      <div style={{display: 'inline-block', padding: '40px 80px', borderRadius: 24, border: `4px solid ${K.gold}`, background: 'rgba(232,196,106,0.08)'}}>
        <div style={{fontSize: 120, fontWeight: 900, color: K.gold}}>いい知らせテスト</div>
      </div>
    </Pop>
    <MascotOverlay f={f} x={1400} y={540} pose={{armR: 0.5 * seg(f, 20, 40), headNod: -0.1}} rotY={-0.4} />
  </Board>
);
const QUAD = [
  {k: '積極的・建設的', s: '「すごい！どんな仕事を任されるの？」', c: '#5fc6b4', id: 'C7_8'},
  {k: '消極的・建設的', s: '「へえ、よかったね」', c: '#8a95ad', id: 'C7_9'},
  {k: '積極的・破壊的', s: '「でもさ、責任重くなるし大変じゃない？」', c: K.red, id: 'C7_10'},
  {k: '消極的・破壊的', s: '「そういえば私、昨日さ……」（話を変える）', c: '#b07fd6', id: 'C7_11'},
];
const C7Grid: React.FC<SceneProps> = ({f, T}) => (
  <Board>
    <Chip f={f} text="いい知らせへの4つの反応" />
    <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontSize: 34, fontWeight: 800, opacity: fadeIn(f, 4)}}>あなた「昇進が決まったの」</div>
    <div style={{position: 'absolute', left: 230, top: 210, display: 'grid', gridTemplateColumns: '700px 700px', gap: 30}}>
      {QUAD.map((q, i) => {
        const active = f >= T(q.id) && (i === 3 || f < T(QUAD[i + 1].id));
        return (
          <Pop key={q.k} f={f} at={T(q.id)}>
            <div style={{height: 280, borderRadius: 20, background: active ? 'rgba(255,255,255,0.08)' : K.card, border: `3px solid ${active ? q.c : K.line}`, padding: 30, boxSizing: 'border-box'}}>
              <div style={{fontSize: 30, fontWeight: 900, color: q.c}}>{['①', '②', '③', '④'][i]} {q.k}</div>
              <div style={{fontSize: 34, fontWeight: 800, marginTop: 30, lineHeight: 1.45}}>{q.s}</div>
            </div>
          </Pop>
        );
      })}
    </div>
    <div style={{position: 'absolute', right: 70, bottom: 150, fontSize: 22, color: K.sub}}>例のセリフは自作</div>
  </Board>
);
const C7Phone4: React.FC<SceneProps> = ({f, dur}) => (
  <AbsoluteFill>
    <BgStill src="bg/cafe.png" f={f} dur={dur} blur={8} dark={0.55} />
    <Tag text="再現" />
    <Phone f={f} x={660} y={60} title="友達4人" msgs={[
      {from: 'me', text: '資格、受かったの', at: 6},
      {from: 'them', name: '① 積極的・建設的', text: 'やったじゃん！あれ難しいやつでしょ？どうやって勉強したの？', at: 30},
      {from: 'them', name: '② 消極的・建設的', text: 'おめでと〜（既読から数時間後）', at: 60},
      {from: 'them', name: '③ 積極的・破壊的', text: 'でもさ、それ取っても給料変わらないんでしょ？', at: 90},
      {from: 'them', name: '④ 消極的・破壊的', text: 'へえ。そういえば駅前に新しいカフェできたの知ってる？', at: 120},
    ]} />
  </AbsoluteFill>
);
const C7Result: React.FC<SceneProps> = ({f, T}) => (
  <Board>
    <Chip f={f} text="研究の結果" />
    <div style={{position: 'absolute', left: 0, right: 0, top: 260, display: 'flex', justifyContent: 'center', gap: 60}}>
      <Pop f={f} at={T('C7_21', 1)}><div style={{width: 640, height: 380, borderRadius: 22, background: K.card, border: `3px solid ${K.teal}`, padding: 36, boxSizing: 'border-box'}}><div style={{fontSize: 30, color: K.teal, fontWeight: 900}}>① 積極的・建設的に喜んでくれる相手ほど</div><div style={{fontSize: 56, fontWeight: 900, marginTop: 40}}>親密さ ↑<br />関係への満足度 ↑</div></div></Pop>
      <Pop f={f} at={T('C7_22')}><div style={{width: 640, height: 380, borderRadius: 22, background: K.card, border: `3px solid ${K.gold}`, padding: 36, boxSizing: 'border-box'}}><div style={{fontSize: 30, color: K.gold, fontWeight: 900}}>いい知らせを誰かに話すこと自体が</div><div style={{fontSize: 56, fontWeight: 900, marginTop: 40}}>その日の<br />前向きな気持ち ↑</div></div></Pop>
    </div>
  </Board>
);
const C7Steps: React.FC<SceneProps> = ({f, T}) => {
  const steps = [['C7_25', 'ステップ1', '小さないい知らせを話す'], ['C7_27', 'ステップ2', '反応が4つのどれかを見る'], ['C7_29', 'ステップ3', '話題を変えて、もう一度試す']];
  return (
    <Board>
      <Chip f={f} text="いい知らせテスト" sub="手順は三つ" />
      <div style={{position: 'absolute', left: 200, top: 210, width: 980, height: 660, borderRadius: 20, background: '#f4f1ea', color: '#2a2420', padding: 50, boxSizing: 'border-box', boxShadow: '0 20px 60px rgba(0,0,0,0.5)'}}>
        {steps.map(([id, a, b], i) => (
          <Pop key={id} f={f} at={T(id)} from="left">
            <div style={{display: 'flex', alignItems: 'baseline', gap: 26, marginBottom: 54, borderBottom: '2px dashed #c9c2b6', paddingBottom: 26}}>
              <div style={{fontSize: 40, fontWeight: 900, color: i === 2 ? K.red : '#b08a3c'}}>{a}</div>
              <div style={{fontSize: 46, fontWeight: 900}}>{b}</div>
            </div>
          </Pop>
        ))}
        <Pop f={f} at={T('C7_30', 1)}><div style={{fontSize: 30, fontWeight: 800, color: '#6a6258'}}>相手にとって大事な分野 ／ 関係のない分野で比べる</div></Pop>
      </div>
      <MascotOverlay f={f} x={1300} y={420} pose={{armR: 0.55 + 0.08 * Math.sin(f / 6), headNod: -0.25}} rotY={-0.7} />
    </Board>
  );
};
const C7Phone2: React.FC<SceneProps> = ({f, dur}) => (
  <AbsoluteFill>
    <BgStill src="bg/cafe.png" f={f} dur={dur} blur={8} dark={0.55} />
    <Tag text="再現" />
    <Phone f={f} x={660} y={60} title="同じ道を歩く友達" msgs={[
      {from: 'me', text: '弟がマラソンで入賞したの', at: 6, time: '7/3'},
      {from: 'them', text: 'えー！すごい！今度お祝いしよ！', at: 34, typing: 10, time: '7/3'},
      {from: 'me', text: '昇進が決まったの', at: 70, time: '10/1'},
      {from: 'them', text: '……でもさ、大変だよね', at: 120, typing: 36, time: '10/1'},
    ]} />
    <div style={{position: 'absolute', left: 140, top: 300, opacity: fadeIn(f, 40), fontFamily: FONT}}><div style={{padding: '12px 24px', borderRadius: 12, background: K.gold, color: '#141820', fontSize: 34, fontWeight: 900}}>関係のない分野 → 反映</div></div>
    <div style={{position: 'absolute', left: 140, top: 640, opacity: fadeIn(f, 126), fontFamily: FONT}}><div style={{padding: '12px 24px', borderRadius: 12, background: K.red, color: '#fff', fontSize: 34, fontWeight: 900}}>大事な分野 → 比較</div></div>
  </AbsoluteFill>
);
const C7Verdict: React.FC<SceneProps> = ({f, T}) => {
  const rows = [['C7_35', 'どの話にも冷たい', 'フレネミーではない（そういう距離の人）', '#8a95ad'], ['C7_36', 'どの話にも心から喜ぶ', '本当の味方', K.teal], ['C7_37', '話題によって反応がはっきり変わる', 'フレネミー', K.red]] as const;
  return (
    <Board>
      <Chip f={f} text="判定" />
      <div style={{position: 'absolute', left: 200, top: 230, display: 'flex', flexDirection: 'column', gap: 34}}>
        {rows.map(([id, a, b, c], i) => (
          <Pop key={id} f={f} at={T(id)} from="left">
            <div style={{display: 'flex', alignItems: 'center', gap: 30, padding: '26px 36px', borderRadius: 18, background: i === 2 && f > T('C7_39') ? 'rgba(224,83,61,0.18)' : K.card, border: `3px solid ${i === 2 && f > T('C7_39') ? K.red : K.line}`, width: 1440}}>
              <div style={{fontSize: 40, fontWeight: 900, width: 700}}>{a}</div>
              <div style={{fontSize: 40, color: K.sub}}>→</div>
              <div style={{fontSize: 44, fontWeight: 900, color: c}}>{b}</div>
            </div>
          </Pop>
        ))}
      </div>
    </Board>
  );
};
const C7Bang: React.FC<SceneProps> = ({f, T}) => {
  const bang = f > 24;
  return (
    <Board>
      <MascotOverlay f={f} x={120} y={330} pose={{armR: bang ? 0 : 0.5, headNod: bang ? 0.1 : -0.2, headTilt: bang ? 0 : 0.15}} rotY={0.4} mark={bang ? '!' : '?'} />
      <Pop f={f} at={T('C7_44')} style={{position: 'absolute', left: 640, top: 220}}>
        <div style={{fontSize: 44, fontWeight: 900, marginBottom: 30}}>付き合い方を「分野」で分ける</div>
        <div style={{display: 'flex', gap: 40}}>
          <div style={{width: 520, padding: 30, borderRadius: 18, border: `3px solid ${K.red}`, background: 'rgba(224,83,61,0.1)'}}>
            <div style={{fontSize: 32, fontWeight: 900, color: K.red}}>相手が大事にしている分野</div>
            <div style={{fontSize: 30, marginTop: 20}}>いい知らせを<br />一番には話さない</div>
          </div>
          <Pop f={f} at={T('C7_47')}>
            <div style={{width: 520, padding: 30, borderRadius: 18, border: `3px solid ${K.teal}`, background: 'rgba(95,198,180,0.1)'}}>
              <div style={{fontSize: 32, fontWeight: 900, color: K.teal}}>関係のない分野</div>
              <div style={{fontSize: 30, marginTop: 20}}>これまで通り<br />一緒に喜び合う</div>
            </div>
          </Pop>
        </div>
      </Pop>
    </Board>
  );
};

// ============ 8 ============
const C8Phone: React.FC<SceneProps> = ({f, dur, T, E}) => {
  const e6 = E('C8_6');
  const typed1 = 'でもさ、';
  const typed2 = 'すごい！ずっと行きたがってたところだよね。どんな仕事するの？';
  let input = '';
  if (f >= e6 - 6 && f < e6 + 39) input = typed1.slice(0, Math.max(0, Math.floor((f - e6 + 6) / 5)));
  if (f >= e6 + 39 && f < e6 + 60) input = typed1.slice(0, Math.max(0, 4 - Math.floor((f - e6 - 39) / 3)));
  if (f >= e6 + 60 && f < e6 + 123) input = typed2.slice(0, Math.floor((f - e6 - 60) / 2));
  const sent = e6 + 123;
  const msgs = [
    {from: 'them' as const, text: 'あのね、私も、ずっと行きたかった部署に異動が決まったの', at: 20, time: '21:14'},
    ...(f >= sent ? [{from: 'me' as const, text: typed2, at: sent, time: '21:16'}] : []),
    {from: 'them' as const, text: '😭✨', at: sent + 21, sticker: true, time: '21:16'},
  ];
  const warm = seg(f, T('C8_10'), T('C8_10') + 60);
  return (
    <AbsoluteFill>
      <BgStill src="bg/apartment_night.png" f={f} dur={dur} blur={6} dark={0.55 - 0.2 * warm} />
      <AbsoluteFill style={{background: `rgba(255,170,90,${0.12 * warm})`}} />
      <Tag text="再現" />
      <Phone f={f} x={660} y={60} title="同じ道を歩く友達" msgs={msgs} input={f < sent ? input : ''} caret={f >= e6 - 20 && f < sent} inputSend={sent - 4} />
    </AbsoluteFill>
  );
};

// ============ 9 ============
const C9Cards: React.FC<SceneProps> = ({f, dur}) => {
  const t = f / 30;
  const tex = useMemo(() => [cardTex(1), cardTex(2), cardTex(3)], []);
  const place = seg(f, 30, 90);
  return (
    <AbsoluteFill style={{background: '#f2f1ee'}}>
      <Canvas>
        <CameraRig pos={lerp3([0, 1.5, 4.8], [0.2, 1.45, 4.2], seg(f, 0, dur))} target={[0, 1.2, 0]} fov={40} />
        <WhiteRoom>
          <group position={[lerp(-1.85, -2.2, place), lerp(1.55, 0.55, place), lerp(-0.2, 0.2, place)]} rotation={[lerp(0, -1.2, place), 0.2, 0]}><Card3D tex={tex[0]} scale={0.8} dim={place} /></group>
          <group position={[0, 1.55, -0.6]}><Card3D tex={tex[1]} scale={0.8} dim={0.4} /></group>
          <group position={[lerp(1.85, 0.75, place), lerp(1.55, 1.05, place), lerp(-0.2, 0.75, place)]} rotation={[0, lerp(0, -0.3, place), 0]}><Card3D tex={tex[2]} scale={0.55} glow={place} /></group>
          <group position={[0.45, 0, 1.05]}>
            <Mascot rotationY={-0.35} scale={0.62} pose={{armR: 0.6 * place, armL: 0.6 * place, headNod: -0.2, bob: 0.004 * Math.sin(t * 2)}} />
          </group>
        </WhiteRoom>
      </Canvas>
    </AbsoluteFill>
  );
};
const C9Two: React.FC<SceneProps> = ({f, T}) => (
  <Board>
    <Chip f={f} text="今日からできること" />
    <div style={{position: 'absolute', left: 0, right: 0, top: 240, display: 'flex', justifyContent: 'center', gap: 60}}>
      <Pop f={f} at={T('C9_9')}><div style={{width: 700, height: 420, borderRadius: 24, background: K.card, border: `3px solid ${K.gold}`, padding: 40, boxSizing: 'border-box'}}><div style={{fontSize: 40, fontWeight: 900, color: K.gold}}>①</div><div style={{fontSize: 44, fontWeight: 900, marginTop: 20, lineHeight: 1.4}}>いい知らせテストで<br />フレネミーを知る</div><div style={{fontSize: 30, marginTop: 24, color: K.sub}}>大事にしている分野の知らせは<br />一番には話さない</div></div></Pop>
      <Pop f={f} at={T('C9_11')}><div style={{width: 700, height: 420, borderRadius: 24, background: K.card, border: `3px solid ${K.teal}`, padding: 40, boxSizing: 'border-box'}}><div style={{fontSize: 40, fontWeight: 900, color: K.teal}}>②</div><div style={{fontSize: 44, fontWeight: 900, marginTop: 20, lineHeight: 1.4}}>「でもさ」を飲み込んで<br />「どうなったの？」と聞く</div><div style={{fontSize: 30, marginTop: 24, color: K.sub}}>誰かのフレネミーにならないために</div></div></Pop>
    </div>
  </Board>
);
const C9Question: React.FC<SceneProps> = ({f, dur, T}) => {
  const t = f / 30;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Canvas>
        <CameraRig pos={lerp3([0, 1.6, 6.2], [0, 1.3, 3.6], seg(f, 0, dur))} target={[0, 1.0, 0]} fov={38} />
        <Hall>
          <group position={[0, 0, 0.6]}><Mascot rotationY={0} scale={0.7} pose={{headNod: -0.05, headTilt: 0.12 * Math.sin(Math.PI * seg(f, T('C9_15'), T('C9_15') + 60)), bob: 0.004 * Math.sin(t * 2)}} /></group>
          <directionalLight position={[2, 3, 3]} intensity={0.6} />
          <directionalLight position={[-2, 2.5, -3]} intensity={2.2} color="#ffd9a8" />
        </Hall>
      </Canvas>
      <Vignette />
    </AbsoluteFill>
  );
};

export const CHAPTER_SCENES: Record<string, React.FC<SceneProps>> = {
  c2_mri: C2Mri, c2_step1: C2Step1, c2_step2: C2Step2, c2_step3: C2Step3, c2_result: C2Result, c2_brain: C2Brain, c2_recall: C2Recall,
  c3_step4: C3Step4, c3_brain: C3Brain, c3_quote: C3Quote, c3_phone: C3Phone,
  c4_icons: C4Icons, c4_axes: C4Axes, c4_examples: C4Examples, c4b_phone: C4bPhone, c4b_office: C4bOffice, c4b_summary: C4bSummary,
  c5_chat: C5Chat, c5_three: C5Three, c5_cases: C5Cases, c5_doors: C5Doors, c5_formula: C5Formula,
  c6_axes: C6Axes, c6_bp: C6Bp, c6_lab: C6Lab, c6_telomere: C6Telomere, c6_topics: C6Topics, c6_chain: C6Chain,
  c6b_year: C6bYear, c6b_calendar: C6bCalendar,
  c7_title: C7Title, c7_grid: C7Grid, c7_phone4: C7Phone4, c7_result: C7Result, c7_steps: C7Steps, c7_phone2: C7Phone2, c7_verdict: C7Verdict, c7_bang: C7Bang,
  c8_phone: C8Phone, c9_cards: C9Cards, c9_two: C9Two, c9_question: C9Question,
};
export const unusedInterpolate = interpolate;
export const unusedLerp = lerp;

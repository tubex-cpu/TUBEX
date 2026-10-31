import {useMemo} from 'react';
import * as THREE from 'three';
import {RBox, Spot, canvasTexture, rand, woodTexture} from './common';
import {SeatedPerson} from './Human';

// Pre-dawn desk after an all-nighter. Desk top y = 0.74. Person sits at z ≈ 0.45 facing -z.
export const DESK_Y = 0.74;

export const DeskRoom: React.FC<{t: number; buzz?: number; headYaw?: number; headPitch?: number; shoulderRaise?: number; slump?: number; typing?: number; children?: React.ReactNode}> = ({
  t, buzz = 0, headYaw = 0, headPitch = 0, shoulderRaise = 0, slump = 0, typing = 0, children,
}) => {
  const wood = useMemo(() => { const w = woodTexture(); w.wrapS = w.wrapT = THREE.RepeatWrapping; w.repeat.set(3, 3); return w; }, []);
  const deskWood = useMemo(() => { const w = woodTexture(); w.wrapS = w.wrapT = THREE.RepeatWrapping; w.repeat.set(1, 1); return w; }, []);
  const screen = useMemo(() => canvasTexture(640, 400, (g) => {
    g.fillStyle = '#e9eef7'; g.fillRect(0, 0, 640, 400);
    g.fillStyle = '#c5d0e2'; g.fillRect(0, 0, 640, 34);
    for (let i = 0; i < 16; i++) { g.fillStyle = i % 5 === 0 ? '#7d8fb0' : '#a9b5c9'; g.fillRect(40, 60 + i * 20, 200 + rand(i) * 340, 8); }
  }), []);
  const clock = useMemo(() => canvasTexture(256, 96, (g) => {
    g.fillStyle = '#0c0f14'; g.fillRect(0, 0, 256, 96);
    g.fillStyle = '#ff6b4a'; g.font = 'bold 70px "Noto Sans CJK JP", monospace'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('5:48', 128, 52);
  }), []);
  const phoneScreen = useMemo(() => canvasTexture(128, 256, (g) => {
    g.fillStyle = '#1a2440'; g.fillRect(0, 0, 128, 256);
    g.fillStyle = '#f2f5fb'; g.fillRect(12, 40, 104, 46);
    g.fillStyle = '#5a6a8a'; g.fillRect(20, 50, 60, 8); g.fillRect(20, 66, 84, 8);
  }), []);
  const dawn = useMemo(() => canvasTexture(256, 384, (g) => {
    const gr = g.createLinearGradient(0, 0, 0, 384);
    gr.addColorStop(0, '#2a3a63'); gr.addColorStop(0.6, '#7d86a8'); gr.addColorStop(1, '#e7b48c');
    g.fillStyle = gr; g.fillRect(0, 0, 256, 384);
    g.fillStyle = 'rgba(20,24,40,0.85)';
    for (let i = 0; i < 9; i++) { const h = 40 + rand(i + 3) * 90; g.fillRect(i * 30, 384 - h, 26, h); }
  }), []);
  const jitter = buzz > 0 ? Math.sin(t * 160) * 0.003 * buzz : 0;
  return (
    <group>
      <hemisphereLight args={['#7f93c4', '#251b14', 0.45]} />
      <directionalLight position={[-3, 2.4, 0.6]} intensity={1.0} color="#b9c6ee" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} shadow-normalBias={0.02}
        shadow-camera-left={-2} shadow-camera-right={2} shadow-camera-top={2} shadow-camera-bottom={-2} />
      {/* laptop glow on the face */}
      <Spot position={[0, 0.95, -0.12]} target={[0, 1.25, 0.45]} angle={0.7} penumbra={1} intensity={2.2} distance={2.5} decay={1.4} color="#cfe0ff" />
      <pointLight position={[0.42, 0.8, 0.02]} intensity={0.9 * buzz} distance={0.8} decay={2} color="#bcd0ff" />
      {/* room */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[8, 8]} /><meshStandardMaterial map={wood} roughness={0.75} /></mesh>
      <mesh position={[0, 1.5, -0.62]} receiveShadow><planeGeometry args={[6, 3]} /><meshStandardMaterial color="#b7b0a6" roughness={0.95} /></mesh>
      <mesh position={[-1.4, 1.5, 0.5]} rotation={[0, Math.PI / 2, 0]} receiveShadow><planeGeometry args={[4, 3]} /><meshStandardMaterial color="#aaa49b" roughness={0.95} /></mesh>
      <mesh position={[-1.395, 1.5, -0.05]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.75, 1.05]} /><meshBasicMaterial map={dawn} toneMapped={false} /></mesh>
      <RBox size={[0.06, 0.05, 0.85]} position={[-1.37, 0.96, -0.05]} color="#e6e0d6" />
      {/* desk */}
      <mesh position={[0, DESK_Y - 0.02, -0.22]} castShadow receiveShadow><boxGeometry args={[1.5, 0.04, 0.72]} /><meshStandardMaterial map={deskWood} roughness={0.55} /></mesh>
      {[[-0.7, -0.53], [0.7, -0.53], [-0.7, 0.09], [0.7, 0.09]].map(([x, z], i) => (
        <mesh key={i} position={[x, (DESK_Y - 0.04) / 2, z]} castShadow receiveShadow><boxGeometry args={[0.04, DESK_Y - 0.04, 0.04]} /><meshStandardMaterial color="#3a2f28" roughness={0.6} /></mesh>
      ))}
      {/* laptop */}
      <RBox size={[0.34, 0.016, 0.24]} position={[0, DESK_Y + 0.008, -0.1]} color="#9aa0aa" radius={0.006} roughness={0.35} />
      <group position={[0, DESK_Y + 0.016, -0.22]} rotation={[-0.32, 0, 0]}>
        <RBox size={[0.34, 0.23, 0.01]} position={[0, 0.115, 0]} color="#8d939d" radius={0.005} roughness={0.35} />
        <mesh position={[0, 0.115, 0.0062]}><planeGeometry args={[0.31, 0.2]} /><meshBasicMaterial map={screen} toneMapped={false} color="#cfd8ea" /></mesh>
      </group>
      {/* mugs, books, clock, phone */}
      {[[-0.24, -0.02], [-0.62, -0.36]].map(([x, z], i) => (
        <group key={i} position={[x, DESK_Y, z]}>
          <mesh castShadow receiveShadow position={[0, 0.05, 0]}><cylinderGeometry args={[0.04, 0.037, 0.1, 32]} /><meshStandardMaterial color={i ? '#d7cfc4' : '#3f5a7a'} roughness={0.4} /></mesh>
          <mesh castShadow position={[0.045, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.025, 0.007, 12, 24]} /><meshStandardMaterial color={i ? '#d7cfc4' : '#3f5a7a'} roughness={0.4} /></mesh>
        </group>
      ))}
      <RBox size={[0.26, 0.05, 0.19]} position={[0.5, DESK_Y + 0.025, -0.4]} color="#8b3f3a" radius={0.008} />
      <RBox size={[0.24, 0.04, 0.18]} position={[0.5, DESK_Y + 0.07, -0.4]} color="#2f4f5f" radius={0.008} />
      <group position={[0.28, DESK_Y + 0.035, -0.45]} rotation={[0, -0.25, 0]}>
        <RBox size={[0.14, 0.07, 0.05]} color="#1a1c22" radius={0.008} />
        <mesh position={[0, 0, 0.0255]}><planeGeometry args={[0.12, 0.045]} /><meshBasicMaterial map={clock} toneMapped={false} /></mesh>
      </group>
      <group position={[0.42 + jitter, DESK_Y + 0.006, 0.03]} rotation={[0, 0.3, 0]}>
        <RBox size={[0.075, 0.012, 0.15]} color="#15171c" radius={0.006} roughness={0.3} />
        <mesh position={[0, 0.0065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.066, 0.14]} />
          <meshBasicMaterial map={phoneScreen} toneMapped={false} color={new THREE.Color().setScalar(0.08 + 0.92 * Math.min(1, buzz * 1.5))} />
        </mesh>
      </group>
      {/* chair */}
      <RBox size={[0.46, 0.06, 0.44]} position={[0, 0.45, 0.47]} color="#2b2e35" radius={0.02} />
      <RBox size={[0.44, 0.5, 0.05]} position={[0, 0.78, 0.72]} rotation={[-0.08, 0, 0]} color="#2b2e35" radius={0.02} />
      <mesh position={[0, 0.22, 0.47]} castShadow><cylinderGeometry args={[0.025, 0.025, 0.42, 16]} /><meshStandardMaterial color="#555b66" roughness={0.3} metalness={0.6} /></mesh>
      <SeatedPerson position={[0, 0.48, 0.45]} rotationY={Math.PI} headYaw={headYaw} headPitch={headPitch} shoulderRaise={shoulderRaise} slump={slump} typing={typing} />
      {children}
    </group>
  );
};

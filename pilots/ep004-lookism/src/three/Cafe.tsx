import {useMemo} from 'react';
import * as THREE from 'three';
import {canvasTexture, rand, woodTexture} from './common';
import {Blob, City, Env, Plant, RB, plasterTex} from './Decor';
import {Friend} from './Friend';
import type {Expr} from './friendSdf';
import {cached} from './Person';
import {ArmPoseV4, armJoints, armSDF} from './personSdf';
import {V3, meshSDF} from './sdf';

// Evening cafe. Table at origin (top y = 0.72). "You" sit at +z (camera), the friend at -z facing you.
export const TABLE_Y = 0.72;

const cupGeo = () => {
  const pts: THREE.Vector2[] = [];
  const prof: [number, number][] = [[0, 0], [0.028, 0], [0.032, 0.004], [0.036, 0.02], [0.042, 0.07], [0.044, 0.078], [0.04, 0.078], [0.038, 0.07], [0.032, 0.02], [0.0, 0.012]];
  for (const [r, y] of prof) pts.push(new THREE.Vector2(r, y));
  return new THREE.LatheGeometry(pts, 48);
};
export const Cup: React.FC<{position: V3; rotationY?: number; color?: string}> = ({position, rotationY = 0, color = '#f3efe8'}) => {
  const g = useMemo(cupGeo, []);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.004, 0]} castShadow receiveShadow><cylinderGeometry args={[0.07, 0.065, 0.008, 48]} /><meshStandardMaterial color={color} roughness={0.25} /></mesh>
      <mesh geometry={g} position={[0, 0.008, 0]} castShadow receiveShadow><meshStandardMaterial color={color} roughness={0.22} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.072, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.038, 32]} /><meshStandardMaterial color="#4a2a17" roughness={0.15} /></mesh>
      <mesh position={[0.05, 0.045, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><torusGeometry args={[0.016, 0.005, 10, 20, Math.PI * 1.2]} /><meshStandardMaterial color={color} roughness={0.25} /></mesh>
    </group>
  );
};

const Pendant: React.FC<{position: V3; on?: number}> = ({position, on = 1}) => (
  <group position={position}>
    <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.003, 0.003, 1.2, 6]} /><meshStandardMaterial color="#222" /></mesh>
    <mesh castShadow><coneGeometry args={[0.16, 0.16, 48, 1, true]} /><meshStandardMaterial color="#2b2f36" metalness={0.6} roughness={0.35} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, -0.05, 0]}><sphereGeometry args={[0.04, 24, 16]} /><meshBasicMaterial color="#ffd9a0" toneMapped={false} /></mesh>
    <pointLight position={[0, -0.12, 0]} intensity={1.6 * on} distance={3.2} decay={1.6} color="#ffc98a" />
  </group>
);

const Chair: React.FC<{position: V3; rotationY?: number}> = ({position, rotationY = 0}) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    <RB s={[0.42, 0.04, 0.4]} r={0.012} p={[0, 0.45, 0]} c="#6b4a33" rough={0.5} />
    <RB s={[0.42, 0.36, 0.03]} r={0.012} p={[0, 0.66, -0.19]} rot={[-0.1, 0, 0]} c="#6b4a33" rough={0.5} />
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <RB key={i} s={[0.03, 0.45, 0.03]} r={0.008} p={[a * 0.18, 0.225, b * 0.17]} c="#4a3324" />)}
  </group>
);

// your forearms + hands on the table (POV). Your seat is at z = +0.6 facing -z.
export const YourHands: React.FC<{armL?: ArmPoseV4; armR?: ArmPoseV4; color?: string}> = ({armL, armR, color = '#8c96a8'}) => {
  const m = useMemo(() => ({
    sleeve: new THREE.MeshStandardMaterial({color, roughness: 0.95}),
    skin: new THREE.MeshStandardMaterial({color: new THREE.Color().setRGB(0.9, 0.73, 0.62, THREE.SRGBColorSpace), roughness: 0.5, emissive: new THREE.Color('#3a140a'), emissiveIntensity: 0.15}),
  }), [color]);
  const def: ArmPoseV4 = {pitch: 0.95, out: -0.05, elbow: 0.6};
  const arms = ([[-1, armL ?? def], [1, armR ?? def]] as const).map(([s, a]) => {
    const key = `yarm-${s}-${a.pitch.toFixed(3)}-${a.out.toFixed(3)}-${a.elbow.toFixed(3)}`;
    const j = armJoints(s, a, 0, 0);
    const pts = [j.sh, j.elbow, j.wrist];
    const mn: V3 = [0, 1, 2].map((i) => Math.min(...pts.map((p) => p[i])) - 0.08) as V3;
    const mx: V3 = [0, 1, 2].map((i) => Math.max(...pts.map((p) => p[i])) + 0.08) as V3;
    const sdf = armSDF(s, a, 0, 0);
    return {
      sleeve: cached(key + 's', () => meshSDF(sdf.sleeve, {min: mn, max: mx, cell: 0.006})),
      hand: cached(key + 'h', () => meshSDF(sdf.hand, {min: [j.wrist[0] - 0.13, j.wrist[1] - 0.13, j.wrist[2] - 0.13], max: [j.wrist[0] + 0.13, j.wrist[1] + 0.13, j.wrist[2] + 0.13], cell: 0.0034})),
    };
  });
  return (
    <group position={[0, 0.46, 0.62]} rotation={[0, Math.PI, 0]}>
      {arms.map((a, i) => (
        <group key={i}>
          <mesh geometry={a.sleeve} material={m.sleeve} castShadow receiveShadow />
          <mesh geometry={a.hand} material={m.skin} castShadow receiveShadow />
        </group>
      ))}
    </group>
  );
};

export const Cafe: React.FC<{friend: {expr: Expr; gaze?: [number, number]; head?: V3; armL?: ArmPoseV4; armR?: ArmPoseV4; breath?: number; slump?: number}; you?: {armL?: ArmPoseV4; armR?: ArmPoseV4}; showYou?: boolean; children?: React.ReactNode}> = ({friend, you, showYou = true, children}) => {
  const wood = useMemo(() => { const w = woodTexture(); w.wrapS = w.wrapT = THREE.RepeatWrapping; w.repeat.set(4, 4); return w; }, []);
  const top = useMemo(() => { const w = woodTexture(); w.wrapS = w.wrapT = THREE.RepeatWrapping; w.repeat.set(1, 1); return w; }, []);
  const wall = useMemo(() => plasterTex('#d8cbb8'), []);
  const menu = useMemo(() => canvasTexture(512, 360, (g) => {
    g.fillStyle = '#1f2421'; g.fillRect(0, 0, 512, 360);
    g.strokeStyle = 'rgba(240,235,220,0.75)'; g.lineWidth = 3;
    for (let i = 0; i < 9; i++) { const y = 60 + i * 32; g.beginPath(); g.moveTo(40, y); g.lineTo(40 + 140 + rand(i) * 120, y); g.stroke(); g.beginPath(); g.moveTo(420, y); g.lineTo(470, y); g.stroke(); }
    g.beginPath(); g.arc(256, 26, 12, 0, Math.PI * 2); g.stroke();
  }), []);
  return (
    <group>
      <Env name="apartment" intensity={0.28} />
      <hemisphereLight args={['#ffe6c8', '#2a1f18', 0.35]} />
      <directionalLight position={[2.5, 3, -4]} intensity={0.9} color="#ffb47a" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} shadow-normalBias={0.02}
        shadow-camera-left={-3} shadow-camera-right={3} shadow-camera-top={3} shadow-camera-bottom={-3} />
      {/* key light on the friend's face (from the lamp above the table, slightly to your side) */}
      <spotLight position={[0.4, 1.9, 0.6]} angle={0.5} penumbra={1} intensity={2.2} distance={4} decay={1.4} color="#ffd6a8" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0006} />
      {/* floor, back wall with a big window, side wall, ceiling */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[12, 12]} /><meshStandardMaterial map={wood} roughness={0.5} /></mesh>
      <mesh position={[0, 3.0, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[12, 12]} /><meshStandardMaterial color="#3a2c22" roughness={0.9} /></mesh>
      {/* back wall (z = -1.9): window opening x[-1.6, 1.6], y[0.9, 2.6] */}
      {[[-3.8, 1.5, 4.4, 3.0], [3.8, 1.5, 4.4, 3.0], [0, 0.45, 3.2, 0.9], [0, 2.8, 3.2, 0.4]].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, -1.9]} receiveShadow><planeGeometry args={[w, h]} /><meshStandardMaterial map={wall} roughness={0.9} /></mesh>
      ))}
      <RB s={[3.3, 0.06, 0.25]} r={0.01} p={[0, 0.9, -1.82]} c="#5b4232" rough={0.5} />
      {[-1.6, -0.8, 0, 0.8, 1.6].map((x, i) => <RB key={i} s={[0.05, 1.75, 0.07]} r={0.01} p={[x, 1.75, -1.9]} c="#2c2a28" rough={0.4} metal={0.4} />)}
      <RB s={[3.25, 0.05, 0.07]} r={0.01} p={[0, 2.62, -1.9]} c="#2c2a28" rough={0.4} metal={0.4} />
      <RB s={[3.25, 0.04, 0.07]} r={0.01} p={[0, 2.05, -1.9]} c="#2c2a28" rough={0.4} metal={0.4} />
      <mesh position={[0, 1.75, -1.91]}><planeGeometry args={[3.2, 1.7]} /><meshStandardMaterial color="#a9bdd6" transparent opacity={0.07} roughness={0.02} metalness={0.3} /></mesh>
      <City dusk position={[0, -17, -48]} width={80} />
      {/* wainscot on the side wall */}
      <mesh position={[-2.4, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow><planeGeometry args={[6, 3]} /><meshStandardMaterial map={wall} roughness={0.9} /></mesh>
      <RB s={[0.03, 0.9, 5.8]} r={0.005} p={[-2.38, 0.45, 0]} c="#6b4f3a" rough={0.6} cast={false} />
      {/* counter + menu board in the background (left) */}
      <RB s={[1.6, 1.0, 0.6]} r={0.02} p={[-1.7, 0.5, -1.3]} c="#4e3a2c" rough={0.5} />
      <RB s={[1.7, 0.05, 0.66]} r={0.01} p={[-1.7, 1.02, -1.3]} c="#d9d2c6" rough={0.3} />
      <RB s={[0.34, 0.36, 0.32]} r={0.03} p={[-1.95, 1.23, -1.35]} c="#b8bcc2" rough={0.25} metal={0.7} />
      <mesh position={[-2.38, 1.9, -0.9]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.9, 0.63]} /><meshStandardMaterial map={menu} roughness={0.9} /></mesh>
      <Plant position={[1.9, 0, -1.55]} scale={2.4} />
      <Plant position={[-0.95, 1.045, -1.35]} scale={0.9} />
      {/* other tables (empty) */}
      {[[-1.5, 0.9], [1.6, 0.6]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, TABLE_Y - 0.015, 0]} castShadow receiveShadow><cylinderGeometry args={[0.36, 0.36, 0.03, 48]} /><meshStandardMaterial map={top} roughness={0.45} /></mesh>
          <mesh position={[0, TABLE_Y / 2, 0]}><cylinderGeometry args={[0.03, 0.03, TABLE_Y, 12]} /><meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} /></mesh>
          <mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.2, 0.22, 0.02, 32]} /><meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} /></mesh>
        </group>
      ))}
      <Pendant position={[0, 1.75, 0]} />
      <Pendant position={[-1.5, 1.9, 0.9]} on={0.7} />
      <Pendant position={[1.6, 1.9, 0.6]} on={0.7} />
      {/* our table */}
      <mesh position={[0, TABLE_Y - 0.015, 0]} castShadow receiveShadow><cylinderGeometry args={[0.42, 0.42, 0.03, 64]} /><meshStandardMaterial map={top} roughness={0.4} /></mesh>
      <mesh position={[0, TABLE_Y / 2, 0]}><cylinderGeometry args={[0.035, 0.035, TABLE_Y, 12]} /><meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} /></mesh>
      <Blob position={[0, 0.003, 0]} sx={1.4} sz={1.4} o={0.7} />
      <Cup position={[-0.12, TABLE_Y, -0.2]} rotationY={2.6} />
      <Cup position={[0.13, TABLE_Y, 0.2]} rotationY={-0.4} color="#e9e2d6" />
      <Chair position={[0, 0, -0.62]} />
      <Friend position={[0, 0.47, -0.6]} top="#7a5b66" {...friend} />
      {showYou && <YourHands {...you} />}
      {children}
    </group>
  );
};

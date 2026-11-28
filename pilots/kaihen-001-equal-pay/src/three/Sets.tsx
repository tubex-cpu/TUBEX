// Background sets for the main part (chapters 1-12). Each set is rendered once as a still (scripts/render_bgs.mjs)
// and animated in 2D (slow push-in) under the cards — same look as the approved 3D opening, a fraction of the render time.
import {useMemo} from 'react';
import * as THREE from 'three';
import {CameraRig, RBox, canvasTexture, rand, textTexture} from './common';
import {City, Envelope3D, Figure, GOLD, Lights, NAVY, RED, Role, Sign, Sky, Street} from './World';

// ---------- props ----------
const Crane: React.FC<{pos: [number, number, number]; rot?: number}> = ({pos, rot = 0}) => (
  <group position={pos} rotation={[0, rot, 0]}>
    {Array.from({length: 9}, (_, i) => <RBox key={i} size={[0.9, 2.2, 0.9]} radius={0.02} color="#f2b42e" position={[0, 1.1 + i * 2.2, 0]} />)}
    <RBox size={[16, 0.7, 0.7]} radius={0.02} color="#f2b42e" position={[5, 20.4, 0]} />
    <RBox size={[2.2, 1.6, 1.6]} radius={0.05} color="#59627a" position={[-2.2, 19.6, 0]} />
    <mesh position={[11, 15, 0]}><cylinderGeometry args={[0.03, 0.03, 10.5, 4]} /><meshStandardMaterial color="#222" /></mesh>
    <RBox size={[1.6, 0.4, 1.6]} radius={0.02} color="#8a5a2b" position={[11, 9.6, 0]} />
  </group>
);
const Barrier: React.FC<{pos: [number, number, number]; rot?: number}> = ({pos, rot = 0}) => (
  <group position={pos} rotation={[0, rot, 0]}>
    {[-1.2, 1.2].map((x) => <RBox key={x} size={[0.12, 1.0, 0.12]} radius={0.02} color="#ddd" position={[x, 0.5, 0]} />)}
    <mesh position={[0, 0.85, 0]}><boxGeometry args={[2.8, 0.28, 0.06]} /><meshStandardMaterial map={useMemo(() => canvasTexture(256, 32, (g) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#ffffff' : RED; g.beginPath(); g.moveTo(i * 32, 32); g.lineTo(i * 32 + 16, 0); g.lineTo(i * 32 + 48, 0); g.lineTo(i * 32 + 32, 32); g.fill(); } }), [])} /></mesh>
  </group>
);
const PowerPole: React.FC<{pos: [number, number, number]}> = ({pos}) => (
  <group position={pos}>
    <mesh position={[0, 5, 0]} castShadow><cylinderGeometry args={[0.16, 0.2, 10, 10]} /><meshStandardMaterial color="#8d8a84" /></mesh>
    <RBox size={[3, 0.18, 0.18]} radius={0.02} color="#5a5a5a" position={[0, 9.2, 0]} />
    <RBox size={[0.6, 0.9, 0.6]} radius={0.05} color="#9aa0a8" position={[0.5, 7.5, 0.25]} />
  </group>
);
const Wires: React.FC<{from: number; to: number; z: number; y?: number}> = ({from, to, z, y = 9.2}) => (
  <>{[-1.2, 0, 1.2].map((dx) => {
    const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(from, y, z + dx * 0.1), new THREE.Vector3((from + to) / 2, y - 0.9, z + dx * 0.1), new THREE.Vector3(to, y, z + dx * 0.1));
    return <mesh key={dx} position={[dx, 0, 0]}><tubeGeometry args={[curve, 24, 0.025, 4, false]} /><meshStandardMaterial color="#1b1f27" /></mesh>;
  })}</>
);
const Building: React.FC<{pos: [number, number, number]; size: [number, number, number]; color: string; sign?: string; signColor?: string; signFg?: string; rot?: number; windows?: string}> = ({pos, size, color, sign, signColor = '#ffffff', signFg = NAVY, rot = 0, windows = '#bcd3ea'}) => {
  const tex = useMemo(() => canvasTexture(512, 512, (g) => {
    g.fillStyle = color; g.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 6; y++) for (let x = 0; x < 6; x++) { g.fillStyle = windows; g.fillRect(24 + x * 82, 30 + y * 80, 56, 44); }
  }), [color, windows]);
  const st = useMemo(() => (sign ? textTexture(sign, {w: 1024, h: 220, size: 130, color: signFg, bg: signColor, radius: 30}) : null), [sign, signColor, signFg]);
  return (
    <group position={pos} rotation={[0, rot, 0]}>
      <RBox size={size} radius={0.15} color="#ffffff" map={tex} position={[0, size[1] / 2, 0]} />
      {st && <mesh position={[0, size[1] + 0.9, size[2] / 2 - 0.2]}><planeGeometry args={[size[0] * 0.9, size[0] * 0.9 * 220 / 1024]} /><meshBasicMaterial map={st} toneMapped={false} /></mesh>}
    </group>
  );
};
const Cross: React.FC<{pos: [number, number, number]; s?: number}> = ({pos, s = 1}) => (
  <group position={pos} scale={s}>
    <RBox size={[2.4, 0.8, 0.3]} radius={0.05} color={RED} emissive={RED} emissiveIntensity={0.6} />
    <RBox size={[0.8, 2.4, 0.3]} radius={0.05} color={RED} emissive={RED} emissiveIntensity={0.6} />
  </group>
);
const ShopFront: React.FC<{pos: [number, number, number]; text: string; lantern?: boolean; shutter?: number}> = ({pos, text, lantern = true, shutter = 0}) => {
  const noren = useMemo(() => textTexture(text, {w: 1024, h: 256, size: 150, color: '#fff7e6', bg: '#2b1d16'}), [text]);
  return (
    <group position={pos}>
      <RBox size={[7, 5, 4]} radius={0.1} color="#6b4a33" position={[0, 2.5, 0]} />
      <mesh position={[0, 1.6, 2.02]}><planeGeometry args={[5.4, 2.6]} /><meshStandardMaterial color="#ffd9a0" emissive="#ffb35a" emissiveIntensity={1.4 * (1 - shutter)} /></mesh>
      {shutter > 0 && <mesh position={[0, 2.9 - shutter * 1.3, 2.05]}><planeGeometry args={[5.6, shutter * 2.7]} /><meshStandardMaterial color="#9aa3ad" metalness={0.4} roughness={0.5} /></mesh>}
      <mesh position={[0, 3.6, 2.1]}><planeGeometry args={[5.6, 1.1]} /><meshBasicMaterial map={noren} toneMapped={false} /></mesh>
      {lantern && [-3, 3].map((x) => <mesh key={x} position={[x, 2.6, 2.4]}><sphereGeometry args={[0.45, 16, 12]} /><meshStandardMaterial color="#ff5a3c" emissive="#ff4a2c" emissiveIntensity={2.2} /></mesh>)}
    </group>
  );
};
const Car: React.FC<{pos: [number, number, number]; color?: string; glass?: boolean}> = ({pos, color = '#3d6fb6', glass = true}) => (
  <group position={pos}>
    <RBox size={[4.4, 1.0, 1.9]} radius={0.3} color={color} roughness={0.35} metalness={0.3} position={[0, 0.8, 0]} />
    <RBox size={[2.4, 0.9, 1.7]} radius={0.3} color={color} roughness={0.35} metalness={0.3} position={[-0.2, 1.6, 0]} />
    {glass && <mesh position={[0.95, 1.6, 0]} rotation={[0, 0, -0.5]}><planeGeometry args={[0.9, 1.6]} /><meshStandardMaterial color="#cfe8ff" transparent opacity={0.65} metalness={0.6} roughness={0.05} side={THREE.DoubleSide} /></mesh>}
    {[[-1.4, 0.95], [1.4, 0.95], [-1.4, -0.95], [1.4, -0.95]].map(([x, z]) => <mesh key={`${x}${z}`} position={[x, 0.4, z]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.42, 0.42, 0.3, 16]} /><meshStandardMaterial color="#1d1f24" /></mesh>)}
  </group>
);
const Columns: React.FC<{pos: [number, number, number]}> = ({pos}) => (
  <group position={pos}>
    <RBox size={[22, 1, 9]} radius={0.05} color="#e8e4dc" position={[0, 0.5, 0]} />
    {Array.from({length: 8}, (_, i) => <mesh key={i} position={[-9.5 + i * 2.7, 5, 3.4]} castShadow><cylinderGeometry args={[0.55, 0.6, 8, 16]} /><meshStandardMaterial color="#f1ede4" /></mesh>)}
    <RBox size={[22, 1.4, 9]} radius={0.05} color="#e2ddd2" position={[0, 9.5, 0]} />
    <mesh position={[0, 11.6, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[12, 3, 4]} /><meshStandardMaterial color="#d8d2c6" /></mesh>
    <RBox size={[20, 8, 7]} radius={0.05} color="#d9d4ca" position={[0, 5, -1]} />
  </group>
);
const Field: React.FC<{pos: [number, number, number]; w?: number; d?: number; color?: string}> = ({pos, w = 30, d = 20, color = '#7fa35a'}) => {
  const tex = useMemo(() => canvasTexture(512, 512, (g) => { g.fillStyle = color; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 32; i++) { g.fillStyle = i % 2 ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'; g.fillRect(0, i * 16, 512, 16); } }), [color]);
  return <mesh position={pos} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[w, d]} /><meshStandardMaterial map={tex} roughness={1} /></mesh>;
};
const House: React.FC<{pos: [number, number, number]; color?: string; roof?: string; rot?: number; lit?: boolean}> = ({pos, color = '#f0ebe0', roof = '#b5523b', rot = 0, lit = false}) => (
  <group position={pos} rotation={[0, rot, 0]}>
    <RBox size={[4, 2.8, 3.4]} radius={0.08} color={color} position={[0, 1.4, 0]} />
    <mesh position={[0, 3.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[3.2, 1.8, 4]} /><meshStandardMaterial color={roof} /></mesh>
    <mesh position={[0.9, 1.5, 1.72]}><planeGeometry args={[0.9, 0.8]} /><meshStandardMaterial color="#ffe2a8" emissive="#ffc46a" emissiveIntensity={lit ? 1.6 : 0.1} /></mesh>
  </group>
);
const Pine: React.FC<{pos: [number, number, number]; s?: number; snow?: boolean}> = ({pos, s = 1, snow = false}) => (
  <group position={pos} scale={s}>
    <mesh position={[0, 0.6, 0]}><cylinderGeometry args={[0.15, 0.2, 1.2, 6]} /><meshStandardMaterial color="#5b4636" /></mesh>
    {[0, 1, 2].map((i) => <mesh key={i} position={[0, 1.6 + i * 0.9, 0]} castShadow><coneGeometry args={[1.3 - i * 0.32, 1.6, 10]} /><meshStandardMaterial color={snow && i === 2 ? '#e9eef3' : '#2f5d46'} /></mesh>)}
  </group>
);
const WaterTower: React.FC<{pos: [number, number, number]}> = ({pos}) => (
  <group position={pos}>
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z]) => <mesh key={`${x}${z}`} position={[x, 3, z]}><cylinderGeometry args={[0.12, 0.12, 6, 6]} /><meshStandardMaterial color="#8a8f96" /></mesh>)}
    <mesh position={[0, 7, 0]} castShadow><cylinderGeometry args={[2, 2, 2.4, 20]} /><meshStandardMaterial color="#d7d2c4" /></mesh>
  </group>
);
const Phone: React.FC<{pos: [number, number, number]; rot?: [number, number, number]; text?: string}> = ({pos, rot = [0, 0, 0], text = '振込のお知らせ'}) => {
  const tex = useMemo(() => canvasTexture(400, 800, (g) => {
    g.fillStyle = '#0f1b2d'; g.fillRect(0, 0, 400, 800);
    g.fillStyle = 'rgba(255,255,255,0.95)'; (g as unknown as {roundRect: (a: number, b: number, c: number, d: number, e: number) => void}).roundRect(24, 120, 352, 150, 26); g.fill();
    g.fillStyle = GOLD; g.fillRect(48, 150, 56, 56);
    g.fillStyle = NAVY; g.font = '900 34px "Noto Sans JP", sans-serif'; g.fillText(text, 120, 190);
    g.fillStyle = '#5b6577'; g.font = '700 26px "Noto Sans JP", sans-serif'; g.fillText('給料が振り込まれました', 48, 245);
  }), [text]);
  return (
    <group position={pos} rotation={rot}>
      <RBox size={[1.0, 2.0, 0.09]} radius={0.12} color="#14161c" roughness={0.3} metalness={0.4} />
      <mesh position={[0, 0, 0.05]}><planeGeometry args={[0.9, 1.84]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
    </group>
  );
};

// ---------- the sets ----------
type P = {role: Role; pos: [number, number, number]; rot?: number; ghost?: number; env?: boolean};
const People: React.FC<{list: P[]}> = ({list}) => <>{list.map((p, i) => <group key={i}><Figure role={p.role} pos={p.pos} s={1.15} rotY={p.rot ?? 0} ghost={p.ghost ?? 0} />{p.env && <Envelope3D pos={[p.pos[0], p.pos[1] + 3.75, p.pos[2]]} s={1} spin={i * 0.9} />}</group>)}</>;

type SetDef = {cam: {pos: number[]; target: number[]; fov?: number}; k: number; night?: boolean; fog?: [string, number, number]; focus?: number; blur?: number; content: React.ReactNode; city?: boolean; street?: boolean; glow?: number; spot?: [number, number, number]};
const Z = 3.2;
const ALL5: P[] = [{role: 'doctor', pos: [-6, 0, Z]}, {role: 'clerk', pos: [-3, 0, Z]}, {role: 'builder', pos: [0, 0, Z]}, {role: 'manager', pos: [3, 0, Z]}, {role: 'you', pos: [6, 0, Z]}];

export const SETS: Record<string, SetDef> = {
  night_aerial: {cam: {pos: [40, 46, 62], target: [0, 4, 0], fov: 30}, k: 0, night: true, glow: 0.9, focus: 0.07, blur: 2, content: <></>},
  dawn_aerial: {cam: {pos: [-36, 38, 56], target: [0, 4, 0], fov: 30}, k: 0.7, focus: 0.07, blur: 2, content: <></>},
  payday_street: {cam: {pos: [0, 4.2, 19], target: [0, 1.8, Z], fov: 36}, k: 0.9, focus: 0.02, content: <People list={ALL5.map((p) => ({...p, env: true}))} />},
  phone: {cam: {pos: [0.2, 2.2, 6], target: [0, 1.6, 2], fov: 30}, k: 0.9, focus: 0.012, blur: 6, content: <><Phone pos={[0, 1.7, 2.6]} rot={[-0.15, -0.2, 0.05]} /><People list={ALL5.map((p) => ({...p, pos: [p.pos[0] * 1.4, 0, -6] as [number, number, number]}))} /></>},
  izakaya: {cam: {pos: [2, 3.2, 15], target: [0, 2.2, 2], fov: 34}, k: 0.05, night: true, glow: 0.9, focus: 0.02, content: <><ShopFront pos={[0, 0, -2]} text="居酒屋" /><People list={[{role: 'clerk', pos: [-1.5, 0, 3]}, {role: 'you', pos: [2, 0, 4], rot: -0.4}]} /></>},
  izakaya_closed: {cam: {pos: [2, 3.2, 15], target: [0, 2.2, 2], fov: 34}, k: 0.15, night: true, glow: 0.4, focus: 0.02, content: <><ShopFront pos={[-5, 0, -2]} text="居酒屋" shutter={0.95} lantern={false} /><ShopFront pos={[5, 0, -2]} text="定食" shutter={0.9} lantern={false} /></>},
  power_night: {cam: {pos: [-4, 3, 16], target: [0, 4, 0], fov: 38}, k: 0, night: true, glow: 0.6, focus: 0.02, content: <><PowerPole pos={[-6, 0, -1]} /><PowerPole pos={[8, 0, -1]} /><Wires from={-6} to={8} z={-1} /><People list={[{role: 'builder', pos: [0, 0, 2]}]} /></>},
  storm: {cam: {pos: [-4, 3, 16], target: [0, 4, 0], fov: 38}, k: 0, night: true, glow: 0.05, focus: 0.02, fog: ['#1a2233', 10, 70], content: <><PowerPole pos={[-6, 0, -1]} /><PowerPole pos={[8, 0, -1]} /><Wires from={-6} to={8} z={-1} /><People list={[{role: 'builder', pos: [0, 0, 2]}]} /></>},
  office: {cam: {pos: [0, 3.5, 17], target: [0, 4, 0], fov: 38}, k: 0.95, focus: 0.025, content: <><Building pos={[0, 0, -4]} size={[14, 16, 6]} color="#9fb2c8" sign="株式会社" /><People list={[{role: 'manager', pos: [-1.5, 0, 3]}, {role: 'you', pos: [1.5, 0, 3]}]} /></>},
  konbini: {cam: {pos: [0, 3, 15], target: [0, 2.4, 0], fov: 36}, k: 0.95, focus: 0.025, content: <><Building pos={[0, 0, -3]} size={[10, 4.5, 6]} color="#f4f4f2" sign="コンビニ" signColor="#3aa17e" signFg="#ffffff" windows="#d8f0ff" /><People list={[{role: 'clerk', pos: [-1.5, 0, 3]}, {role: 'clerk', pos: [1.5, 0, 3]}]} /></>},
  home: {cam: {pos: [0, 3.2, 14], target: [0, 2, 0], fov: 36}, k: 0.6, focus: 0.025, content: <><House pos={[0, 0, -3]} lit /><People list={[{role: 'manager', pos: [-1.6, 0, 3]}, {role: 'clerk', pos: [1.6, 0, 3]}]} /></>},
  home_parent_child: {cam: {pos: [0, 3.2, 14], target: [0, 2, 0], fov: 36}, k: 0.3, night: true, glow: 0.6, focus: 0.025, content: <><House pos={[0, 0, -3]} lit /><People list={[{role: 'manager', pos: [-1.6, 0, 3]}, {role: 'you', pos: [1.6, 0, 3]}]} /></>},
  hospital: {cam: {pos: [0, 5.5, 26], target: [0, 7.5, 0], fov: 42}, k: 0.95, focus: 0.03, content: <><Building pos={[0, 0, -5]} size={[18, 12, 8]} color="#eef2f6" sign="病院" signColor="#ffffff" signFg={RED} /><Cross pos={[8, 9, -0.6]} /><People list={[{role: 'doctor', pos: [0, 0, 3]}]} /></>},
  care: {cam: {pos: [0, 4.5, 22], target: [0, 4.5, 0], fov: 38}, k: 0.8, focus: 0.03, content: <><Building pos={[0, 0, -4]} size={[16, 7, 7]} color="#f6efe4" sign="介護施設" signColor="#6fb3c9" signFg="#ffffff" /><People list={[{role: 'clerk', pos: [-1.5, 0, 3]}]} /></>},
  map_wide: {cam: {pos: [0, 30, 40], target: [0, 0, 0], fov: 34}, k: 1, focus: 0.06, blur: 5, content: <People list={ALL5} />},
  mall_day: {cam: {pos: [0, 6.5, 32], target: [0, 6, 0], fov: 40}, k: 1, focus: 0.03, content: <><Building pos={[0, 0, -6]} size={[26, 9, 9]} color="#f3e9da" sign="モール" signColor={GOLD} signFg={NAVY} /><People list={[{role: 'you', pos: [-3, 0, 3]}, {role: 'clerk', pos: [0, 0, 4]}, {role: 'manager', pos: [3, 0, 3]}]} /></>},
  dusk_clouds: {cam: {pos: [-30, 20, 50], target: [0, 10, 0], fov: 34}, k: 0.35, fog: ['#584a5c', 20, 120], focus: 0.08, blur: 2, content: <></>},
  construction: {cam: {pos: [10, 8, 36], target: [0, 9, -4], fov: 44}, k: 0.9, focus: 0.035, content: <><Crane pos={[-6, 0, -6]} rot={0.3} /><RBox size={[14, 6, 8]} radius={0.05} color="#8b8f97" position={[3, 3, -6]} /><Barrier pos={[-3, 0, 2]} /><Barrier pos={[1, 0, 2]} /><Barrier pos={[5, 0, 2]} /><People list={[{role: 'builder', pos: [-6, 0, 3]}]} /></>},
  construction_empty: {cam: {pos: [10, 8, 36], target: [0, 9, -4], fov: 44}, k: 0.95, focus: 0.035, content: <><Crane pos={[-6, 0, -6]} rot={0.3} /><RBox size={[14, 6, 8]} radius={0.05} color="#8b8f97" position={[3, 3, -6]} /><Barrier pos={[-3, 0, 2]} /><Barrier pos={[1, 0, 2]} /><Barrier pos={[5, 0, 2]} /><Sign pos={[8, 0, 4]} text="作業員募集" color="#ffffff" fg={RED} rotY={-0.25} /><Sign pos={[3.5, 0, 5]} text="作業員募集" color={GOLD} fg={NAVY} rotY={0.1} /></>},
  snow_town: {cam: {pos: [0, 6, 28], target: [0, 2, 0], fov: 36}, k: 0.75, city: false, street: false, focus: 0.035, fog: ['#dfe7ef', 25, 110], content: <><mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[300, 300]} /><meshStandardMaterial color="#eef3f7" /></mesh>{[-12, -6, 0, 6, 12].map((x, i) => <House key={x} pos={[x, 0, -4 - (i % 2) * 3]} color="#c8473e" roof="#3b4350" lit />)}{Array.from({length: 18}, (_, i) => <Pine key={i} pos={[-26 + i * 3.1, 0, -14 - rand(i) * 8]} s={1.2 + rand(i + 3)} snow />)}<People list={[{role: 'you', pos: [-1.5, 0, 4]}, {role: 'clerk', pos: [1.5, 0, 4]}]} /></>},
  lottery: {cam: {pos: [0, 3, 14], target: [0, 2.5, 0], fov: 34}, k: 0.95, focus: 0.03, content: <><Building pos={[0, 0, -3]} size={[6, 3.6, 3]} color="#ffffff" sign="宝くじ" signColor={RED} signFg="#ffffff" /><People list={[{role: 'you', pos: [2.5, 0, 3]}]} /></>},
  kibbutz: {cam: {pos: [0, 9, 34], target: [0, 2, 0], fov: 36}, k: 1, city: false, street: false, focus: 0.04, fog: ['#f1d9b5', 40, 160], content: <><mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[300, 300]} /><meshStandardMaterial color="#c9b98f" /></mesh><Field pos={[-14, 0.02, -8]} /><Field pos={[18, 0.02, -10]} color="#a8b85a" />{[-6, -1, 4, 9].map((x, i) => <House key={x} pos={[x, 0, -2 - (i % 2) * 4]} color="#efe6d4" roof="#c9733f" />)}<WaterTower pos={[13, 0, -2]} />{Array.from({length: 10}, (_, i) => <Pine key={i} pos={[-24 + i * 5, 0, -22]} s={1.4} />)}<People list={[{role: 'builder', pos: [-3, 0, 6]}, {role: 'clerk', pos: [0, 0, 6]}, {role: 'doctor', pos: [3, 0, 6]}]} /></>},
  kibbutz_leave: {cam: {pos: [0, 9, 34], target: [0, 2, 0], fov: 36}, k: 0.5, city: false, street: false, focus: 0.04, fog: ['#c9a27a', 30, 150], content: <><mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[300, 300]} /><meshStandardMaterial color="#b9a882" /></mesh><Field pos={[-14, 0.02, -8]} color="#9a8a5a" />{[-6, -1, 4, 9].map((x, i) => <House key={x} pos={[x, 0, -2 - (i % 2) * 4]} color="#e3d8c4" roof="#a8603a" />)}<WaterTower pos={[13, 0, -2]} /><People list={[{role: 'doctor', pos: [10, 0, 8], rot: -1.2}, {role: 'clerk', pos: [-3, 0, 6], ghost: 0.3}, {role: 'builder', pos: [0, 0, 6], ghost: 0.3}]} /></>},
  factory: {cam: {pos: [4, 4.5, 19], target: [0, 3.2, -2], fov: 42}, k: 0.95, focus: 0.025, content: <><Building pos={[0, 0, -6]} size={[16, 6, 6]} color="#c9ced6" sign="ガラス取り付け" signColor="#3d6fb6" signFg="#ffffff" /><Car pos={[0, 0, 0]} /><People list={[{role: 'builder', pos: [3.3, 0, 1.2], rot: -0.6}]} /></>},
  govt: {cam: {pos: [0, 6, 34], target: [0, 6, 0], fov: 38}, k: 0.95, focus: 0.04, content: <><Columns pos={[0, 0, -6]} /><People list={[{role: 'manager', pos: [-2, 0, 6]}, {role: 'clerk', pos: [2, 0, 6]}]} /></>},
  shops_evening: {cam: {pos: [2, 3.2, 17], target: [0, 2.2, 0], fov: 36}, k: 0.35, night: true, glow: 0.5, focus: 0.02, content: <><ShopFront pos={[-5, 0, -2]} text="八百屋" shutter={0.6} lantern={false} /><ShopFront pos={[5, 0, -2]} text="本屋" shutter={0.9} lantern={false} /><People list={[{role: 'you', pos: [0, 0, 4]}]} /></>},
  job_ads: {cam: {pos: [0, 2.6, 11], target: [0, 2.4, 0], fov: 36}, k: 0.95, focus: 0.02, content: <><RBox size={[14, 5, 0.4]} radius={0.05} color="#d9d4ca" position={[0, 2.5, -1]} />{['週休3日', '家から5分', '夜勤なし'].map((t, i) => <Sign key={t} pos={[-4.5 + i * 4.5, 0, -0.6]} text={t} color={i === 1 ? GOLD : '#ffffff'} fg={NAVY} />)}<People list={[{role: 'you', pos: [6.8, 0, 3.5], rot: -0.5}]} /></>},
  school: {cam: {pos: [0, 4, 22], target: [0, 4, 0], fov: 38}, k: 0.95, focus: 0.03, content: <><Building pos={[0, 0, -5]} size={[20, 9, 7]} color="#f2efe8" sign="高校" /><People list={[{role: 'you', pos: [0, 0, 3]}]} /></>},
  sunrise_end: {cam: {pos: [-40, 30, 60], target: [0, 6, 0], fov: 30}, k: 1, focus: 0.07, blur: 2, content: <People list={ALL5} />},
};

export const SetScene: React.FC<{id: string}> = ({id}) => {
  const s = SETS[id];
  const k = s.k;
  return (
    <>
      <CameraRig pos={s.cam.pos} target={s.cam.target} fov={s.cam.fov} />
      <Sky k={k} />
      <fog attach="fog" args={s.fog ? [new THREE.Color(s.fog[0]), s.fog[1], s.fog[2]] : [new THREE.Color('#1c2a44').lerp(new THREE.Color('#e7b48f'), k), 40, 190]} />
      <Lights k={s.night ? 0.05 : k} spot={s.spot ?? null} spotI={s.spot ? 1 : 0} />
      {s.night && <pointLight position={[0, 6, 6]} intensity={30} distance={30} color="#ffcf86" />}
      {s.city !== false && <City lit={s.night ? 0.45 : 0.15} glow={s.glow ?? (s.night ? 0.8 : 0.12)} />}
      {s.street !== false && <Street />}
      {s.content}
    </>
  );
};

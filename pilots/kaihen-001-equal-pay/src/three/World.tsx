// ルール改変ニッポン: a miniature Japanese street block (tilt-shift diorama). Deterministic, no Math.random.
import {useMemo} from 'react';
import * as THREE from 'three';
import {RBox, canvasTexture, rand, textTexture} from './common';

export const NAVY = '#0F1B2D', RED = '#E53935', GOLD = '#F2C14E';

// sky dome: dawn gradient (k=0 night-blue, k=1 warm morning)
export const Sky: React.FC<{k: number}> = ({k}) => {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: {k: {value: 0}},
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `uniform float k; varying vec3 vP;
      void main(){ float h = clamp(vP.y*1.4+0.15,0.0,1.0);
        vec3 nTop=vec3(0.04,0.08,0.17), nHor=vec3(0.16,0.22,0.38);
        vec3 mTop=vec3(0.20,0.36,0.62), mHor=vec3(1.0,0.70,0.45);
        vec3 top=mix(nTop,mTop,k), hor=mix(nHor,mHor,k);
        gl_FragColor=vec4(mix(hor,top,pow(h,0.7)),1.0); }`,
  }), []);
  mat.uniforms.k.value = k;
  return <mesh material={mat} scale={400}><sphereGeometry args={[1, 32, 16]} /></mesh>;
};

// one tile = 4 m wide x 3 m high (one floor, two windows); lit windows warm, others dark glass
const windowsTex = (seed: number, lit: number, base: string) => canvasTexture(512, 512, (g) => {
  g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 8; y++) for (let x = 0; x < 4; x++) {
    const on = rand(seed * 991 + y * 17 + x) < lit;
    g.fillStyle = on ? '#ffcf86' : '#2b3550';
    g.fillRect(18 + x * 128, 14 + y * 64, 92, 38);
    g.fillStyle = 'rgba(255,255,255,0.10)'; g.fillRect(18 + x * 128, 14 + y * 64, 92, 4);
  }
});

type B = {x: number; z: number; w: number; d: number; h: number; c: number; seed: number};
const PAL = ['#8d97a8', '#a3a7ad', '#7f8b9e', '#b2aca2', '#6f7b8f', '#9b9184'];
export const City: React.FC<{lit?: number; glow?: number}> = ({lit = 0.2, glow = 0.42}) => {
  const blds = useMemo(() => {
    const out: B[] = [];
    let s = 1;
    for (const side of [-1, 1]) for (let row = 0; row < 3; row++) for (let x = -84; x <= 84; x += 8) {
      // the camera side (+z) stays open near the crosswalk so the street can be seen
      if (side > 0 && Math.abs(x) < 36 + row * 8) continue;
      s++;
      const w = 5.6 + rand(s) * 1.6, d = 5.6 + rand(s + 3) * 1.6;
      const h = (row === 0 ? 7 : row === 1 ? 13 : 22) + rand(s + 7) * (row === 2 ? 28 : 12);
      out.push({x: x + (rand(s + 9) - 0.5) * 1.2, z: side * (11 + row * 8.5 + rand(s + 11) * 1.2), w, d, h, c: Math.floor(rand(s + 13) * PAL.length), seed: s});
    }
    return out;
  }, []);
  const base = useMemo(() => PAL.map((c, i) => windowsTex(i + 1, lit, c)), [lit]);
  const maps = useMemo(() => blds.map((b) => {
    const t = base[b.c].clone();
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(Math.max(1, Math.round(b.w / 4)), Math.max(1, Math.round(b.h / 6)));
    t.needsUpdate = true;
    return t;
  }), [blds, base]);
  return (
    <group>
      {blds.map((b, i) => (
        <group key={i}>
          <RBox size={[b.w, b.h, b.d]} radius={0.12} color="#ffffff" roughness={0.8} position={[b.x, b.h / 2, b.z]} map={maps[i]} emissive="#ffcf86" emissiveIntensity={glow} emissiveMap={maps[i]} />
          <RBox size={[b.w * 0.5, 0.8, b.d * 0.4]} radius={0.08} color="#5c6577" position={[b.x + b.w * 0.15, b.h + 0.4, b.z]} cast={false} />
        </group>
      ))}
    </group>
  );
};

// road along x, sidewalks, crosswalk at x=0, center lines
export const Street: React.FC = () => {
  const road = useMemo(() => canvasTexture(2048, 512, (g) => {
    g.fillStyle = '#3a404b'; g.fillRect(0, 0, 2048, 512);
    for (let i = 0; i < 4000; i++) { g.fillStyle = `rgba(255,255,255,${rand(i) * 0.05})`; g.fillRect(rand(i + 1) * 2048, rand(i + 2) * 512, 2, 2); }
    g.fillStyle = '#e8e2d0';
    for (let x = 0; x < 2048; x += 120) g.fillRect(x, 250, 60, 10);
    for (let k = 0; k < 9; k++) g.fillRect(984, 40 + k * 50, 80, 26); // crosswalk (rotated: drawn as bars across the road)
  }), []);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow><planeGeometry args={[400, 400]} /><meshStandardMaterial color="#2b3140" roughness={1} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow><planeGeometry args={[160, 12]} /><meshStandardMaterial map={road} roughness={0.95} /></mesh>
      {[-1, 1].map((s) => <RBox key={s} size={[160, 0.25, 3]} radius={0.05} color="#9aa1ad" roughness={0.9} position={[0, 0.12, s * 7.5]} cast={false} />)}
      {/* street lamps and trees on the sidewalks */}
      {Array.from({length: 14}, (_, i) => -52 + i * 8).filter((x, i) => !(i % 2 === 1 && Math.abs(x) < 20)).map((x) => (
        <group key={x} position={[x, 0, Math.round((x + 52) / 8) % 2 ? 7.9 : -7.9]}>
          <mesh position={[0, 2.2, 0]} castShadow><cylinderGeometry args={[0.08, 0.1, 4.4, 8]} /><meshStandardMaterial color="#4a5263" /></mesh>
          <mesh position={[0, 4.45, 0]}><sphereGeometry args={[0.28, 12, 8]} /><meshStandardMaterial color="#fff2c8" emissive="#ffd27a" emissiveIntensity={2.2} /></mesh>
          <mesh position={[3.6, 1.7, 0]} castShadow><sphereGeometry args={[1.05, 14, 10]} /><meshStandardMaterial color="#5f8a63" roughness={0.9} /></mesh>
          <mesh position={[3.6, 0.5, 0]}><cylinderGeometry args={[0.12, 0.14, 1, 6]} /><meshStandardMaterial color="#6b5440" /></mesh>
        </group>
      ))}
    </group>
  );
};

// the giant seal 改: red block, white 改 on its face (bottom). imprint = decal left on the road
const sealFace = () => canvasTexture(512, 512, (g) => {
  g.fillStyle = RED; g.fillRect(0, 0, 512, 512);
  g.strokeStyle = '#ffffff'; g.lineWidth = 26; g.strokeRect(40, 40, 432, 432);
  g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '900 330px "Noto Sans JP", sans-serif';
  g.fillText('改', 256, 270);
});
export const Seal3D: React.FC<{y: number; s?: number; rotY?: number}> = ({y, s = 1, rotY = 0}) => {
  const face = useMemo(sealFace, []);
  return (
    <group position={[0, y, 0]} scale={s} rotation={[0, rotY, 0]}>
      <RBox size={[7, 4.2, 7]} radius={0.5} color={RED} roughness={0.45} position={[0, 2.1, 0]} />
      <RBox size={[3.2, 4.5, 3.2]} radius={0.6} color="#7a1f1c" roughness={0.5} position={[0, 6.4, 0]} />
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[6.6, 6.6]} /><meshStandardMaterial map={face} roughness={0.5} /></mesh>
    </group>
  );
};
export const Imprint: React.FC<{a: number}> = ({a}) => {
  const tex = useMemo(() => canvasTexture(512, 512, (g) => {
    g.clearRect(0, 0, 512, 512);
    g.fillStyle = 'rgba(229,57,53,0.92)';
    g.strokeStyle = 'rgba(229,57,53,0.92)'; g.lineWidth = 30; g.strokeRect(40, 40, 432, 432);
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '900 330px "Noto Sans JP", sans-serif';
    g.fillText('改', 256, 270);
    for (let i = 0; i < 900; i++) { g.clearRect(rand(i) * 512, rand(i + 5) * 512, 3 + rand(i + 9) * 6, 3 + rand(i + 2) * 6); } // worn ink
  }), []);
  return <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[6.6, 6.6]} /><meshBasicMaterial map={tex} transparent opacity={a} depthWrite={false} toneMapped={false} /></mesh>;
};
export const Shockwave: React.FC<{u: number}> = ({u}) => {
  if (u <= 0 || u >= 1) return null;
  return (
    <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={4 + u * 30}>
      <ringGeometry args={[0.9, 1, 64]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={(1 - u) * 0.7} depthWrite={false} />
    </mesh>
  );
};
export const Dust: React.FC<{u: number}> = ({u}) => {
  if (u <= 0 || u >= 1) return null;
  return (
    <group>
      {Array.from({length: 46}, (_, i) => {
        const a = rand(i) * Math.PI * 2, sp = 5 + rand(i + 3) * 9;
        const r = 3.6 + u * sp, y = 0.3 + Math.sin(Math.min(1, u * 1.6) * Math.PI) * (0.6 + rand(i + 7) * 1.4);
        return <mesh key={i} position={[Math.cos(a) * r, y, Math.sin(a) * r]} scale={0.25 + rand(i + 1) * 0.35 + u * 0.4}><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#cfc8bd" transparent opacity={(1 - u) * 0.55} depthWrite={false} /></mesh>;
      })}
    </group>
  );
};

// a stylised person (capsule body, sphere head). role props make them readable from far
export type Role = 'doctor' | 'clerk' | 'builder' | 'manager' | 'you';
const BODY: Record<Role, string> = {doctor: '#eef2f7', clerk: '#3aa17e', builder: '#e98b2a', manager: '#24324d', you: GOLD};
export const Figure: React.FC<{role: Role; pos: [number, number, number]; s?: number; ghost?: number; rotY?: number}> = ({role, pos, s = 1, ghost = 0, rotY = 0}) => {
  const op = 1 - ghost * 0.7;
  const mat = (c: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) => <meshStandardMaterial color={c} roughness={0.55} transparent={ghost > 0} opacity={op} {...extra} />;
  return (
    <group position={pos} scale={s} rotation={[0, rotY, 0]}>
      <mesh position={[0, 1.05, 0]} castShadow>{<capsuleGeometry args={[0.42, 0.95, 8, 16]} />}{mat(BODY[role])}</mesh>
      <mesh position={[0, 2.18, 0]} castShadow><sphereGeometry args={[0.36, 24, 16]} />{mat('#f3d2b3', {emissive: '#5a3a24', emissiveIntensity: 0.25})}</mesh>
      {[-1, 1].map((sd) => <mesh key={sd} position={[sd * 0.5, 1.15, 0]} rotation={[0, 0, sd * 0.12]} castShadow><capsuleGeometry args={[0.12, 0.7, 6, 10]} />{mat(BODY[role])}</mesh>)}
      {role === 'doctor' && <mesh position={[0, 1.55, 0.36]}><torusGeometry args={[0.2, 0.035, 8, 20, Math.PI]} />{mat('#2c3e5c')}</mesh>}
      {role === 'clerk' && <mesh position={[0, 1.05, 0.38]}><boxGeometry args={[0.5, 0.75, 0.06]} />{mat('#f3f3f3')}</mesh>}
      {role === 'builder' && <><mesh position={[0, 2.38, 0]}><sphereGeometry args={[0.41, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />{mat(GOLD)}</mesh><mesh position={[0, 1.2, 0.4]}><boxGeometry args={[0.7, 0.08, 0.04]} />{mat('#f4f1e6', {emissive: '#f4f1e6', emissiveIntensity: 0.4})}</mesh></>}
      {role === 'manager' && <mesh position={[0, 1.4, 0.41]}><boxGeometry args={[0.12, 0.55, 0.04]} />{mat(RED)}</mesh>}
      {role === 'you' && <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.7, 0.82, 48]} /><meshBasicMaterial color={GOLD} transparent opacity={op} toneMapped={false} /></mesh>}
    </group>
  );
};

// a gold pay envelope floating above a head
export const Envelope3D: React.FC<{pos: [number, number, number]; s: number; spin: number}> = ({pos, s, spin}) => {
  const tex = useMemo(() => textTexture('同じ額', {w: 512, h: 320, size: 92, color: NAVY, bg: GOLD}), []);
  if (s <= 0.001) return null;
  return (
    <group position={pos} scale={s} rotation={[0, Math.sin(spin) * 0.5, Math.sin(spin * 0.7) * 0.06]}>
      <RBox size={[1.2, 0.75, 0.06]} radius={0.04} color={GOLD} roughness={0.35} metalness={0.25} emissive={GOLD} emissiveIntensity={0.25} />
      <mesh position={[0, -0.04, 0.035]}><planeGeometry args={[1.1, 0.68]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
    </group>
  );
};

// a sign on a post, facing +z
export const Sign: React.FC<{pos: [number, number, number]; text: string; color: string; fg: string; glow?: number; rotY?: number; arrow?: 'left' | 'right'}> = ({pos, text, color, fg, glow = 0, rotY = 0, arrow}) => {
  const tex = useMemo(() => textTexture(text, {w: 1024, h: 300, size: 140, color: fg, bg: color, radius: 40, lines: [(arrow === 'left' ? '← ' : '') + text + (arrow === 'right' ? ' →' : '')]}), [text, color, fg, arrow]);
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <mesh position={[0, 1.4, 0]} castShadow><cylinderGeometry args={[0.07, 0.07, 2.8, 8]} /><meshStandardMaterial color="#59627a" /></mesh>
      <mesh position={[0, 2.9, 0.06]}><planeGeometry args={[3.4, 1.0]} /><meshBasicMaterial map={tex} toneMapped={false} transparent /></mesh>
      {glow > 0 && <pointLight position={[0, 2.9, 1.2]} intensity={glow * 18} distance={8} color={color} />}
    </group>
  );
};

// a floating card with a big letter and two lines of text
export const Card3D: React.FC<{pos: [number, number, number]; rotY: number; letter: string; lines: string[]; color: string; s?: number}> = ({pos, rotY, letter, lines, color, s = 1}) => {
  const tex = useMemo(() => canvasTexture(900, 1000, (g) => {
    g.fillStyle = '#16263f'; g.fillRect(0, 0, 900, 1000);
    g.strokeStyle = color; g.lineWidth = 26; g.strokeRect(13, 13, 874, 974);
    g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '900 330px "Noto Sans JP", sans-serif';
    g.fillText(letter, 450, 330);
    g.fillStyle = '#ffffff'; g.font = '900 96px "Noto Sans JP", sans-serif';
    lines.forEach((l, i) => g.fillText(l, 450, 650 + i * 120));
  }), [letter, lines.join('|'), color]);
  return (
    <group position={pos} rotation={[0, rotY, 0]} scale={s}>
      <RBox size={[4.5, 5, 0.18]} radius={0.12} color="#16263f" roughness={0.4} />
      <mesh position={[0, 0, 0.1]}><planeGeometry args={[4.4, 4.9]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
      <mesh position={[0, 0, -0.1]} rotation={[0, Math.PI, 0]}><planeGeometry args={[4.4, 4.9]} /><meshStandardMaterial color={color} roughness={0.5} /></mesh>
    </group>
  );
};

// big red ？ above a ghosted person
export const QMark: React.FC<{pos: [number, number, number]; s: number}> = ({pos, s}) => {
  const tex = useMemo(() => textTexture('？', {w: 256, h: 256, size: 220, color: RED}), []);
  if (s <= 0.001) return null;
  return <mesh position={pos} scale={s}><planeGeometry args={[1.4, 1.4]} /><meshBasicMaterial map={tex} transparent toneMapped={false} depthWrite={false} /></mesh>;
};

const Spot: React.FC<{at: [number, number, number]; i: number}> = ({at, i}) => {
  const light = useMemo(() => {
    const l = new THREE.SpotLight('#ffe6a8', 0, 30, 0.3, 0.7, 1.2);
    l.castShadow = true;
    return l;
  }, []);
  light.position.set(at[0], 10, at[2] + 4);
  light.target.position.set(at[0], at[1], at[2]);
  light.target.updateMatrixWorld();
  light.intensity = i * 320;
  return <><primitive object={light} /><primitive object={light.target} /></>;
};

// lights: k = morning amount (0 night-blue, 1 warm sunrise)
export const Lights: React.FC<{k: number; spot?: [number, number, number] | null; spotI?: number}> = ({k, spot = null, spotI = 0}) => {
  const sun = new THREE.Color('#9fb6ff').lerp(new THREE.Color('#ffc58a'), k);
  return (
    <>
      <hemisphereLight args={['#c9d6ff', '#2a2f3a', 0.55 + 0.35 * k]} />
      <directionalLight position={[-40, 26 + 10 * k, 30]} intensity={1.2 + 1.6 * k} color={sun} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}
        shadow-camera-left={-40} shadow-camera-right={40} shadow-camera-top={40} shadow-camera-bottom={-40} shadow-bias={-0.0004} />
      {spot && spotI > 0 && <Spot at={spot} i={spotI} />}
    </>
  );
};

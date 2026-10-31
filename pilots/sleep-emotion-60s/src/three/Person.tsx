import {useMemo} from 'react';
import * as THREE from 'three';
import {V3, meshSDF} from './sdf';
import {hairColor, hairSDF, headColor, headSDF} from './personSdf';
import {ArmPoseV4, armJoints, armSDF, torsoSDF, upperPt} from './personSdf';

export {SKIN, HAIR_C, SWEATER_C} from './personSdf';

const geoCache = new Map<string, THREE.BufferGeometry>();
const toLinear = (g: THREE.BufferGeometry) => {
  const c = g.getAttribute('color') as THREE.BufferAttribute | undefined;
  if (c) for (let i = 0; i < c.array.length; i++) (c.array as Float32Array)[i] = Math.pow((c.array as Float32Array)[i], 2.2);
  return g;
};
export const cached = (key: string, make: () => THREE.BufferGeometry) => {
  let g = geoCache.get(key);
  if (!g) { g = toLinear(make()); geoCache.set(key, g); }
  return g;
};

export const HeadV4: React.FC<{eyesClosed?: boolean; position?: V3; rotation?: V3; scale?: number}> = ({eyesClosed = false, position, rotation, scale = 1}) => {
  const head = cached(`head-${eyesClosed}`, () => meshSDF(headSDF(eyesClosed), {min: [-0.1, -0.18, -0.12], max: [0.1, 0.12, 0.13], cell: 0.002, color: headColor(eyesClosed)}));
  const hair = cached('hair', () => meshSDF(hairSDF(), {min: [-0.1, -0.1, -0.13], max: [0.1, 0.13, 0.13], cell: 0.0022, color: hairColor}));
  const m = useMemo(() => ({
    skin: new THREE.MeshStandardMaterial({vertexColors: true, roughness: 0.55, emissive: new THREE.Color('#3a140a'), emissiveIntensity: 0.18}),
    hair: new THREE.MeshStandardMaterial({vertexColors: true, roughness: 0.62, metalness: 0.0}),
    sclera: new THREE.MeshStandardMaterial({color: '#efe9e2', roughness: 0.15}),
    iris: new THREE.MeshStandardMaterial({color: '#3a2618', roughness: 0.1}),
    pupil: new THREE.MeshStandardMaterial({color: '#080605', roughness: 0.05}),
  }), []);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={head} material={m.skin} castShadow receiveShadow />
      <mesh geometry={hair} material={m.hair} castShadow receiveShadow />
      {!eyesClosed && [-1, 1].map((s) => (
        <group key={s} position={[s * 0.031, 0.008, 0.0735]}>
          <mesh material={m.sclera}><sphereGeometry args={[0.0118, 32, 24]} /></mesh>
          <mesh material={m.iris} position={[0, 0, 0.0085]} scale={[1, 1, 0.45]}><sphereGeometry args={[0.0058, 24, 16]} /></mesh>
          <mesh material={m.pupil} position={[0, 0, 0.0107]} scale={[1, 1, 0.3]}><sphereGeometry args={[0.0028, 16, 12]} /></mesh>
        </group>
      ))}
    </group>
  );
};

// ---------------- seated person ----------------
const q = (v: number, n: number) => Math.round(v * n) / n;

const SWEATER_LIN = new THREE.Color().setRGB(0.36, 0.43, 0.54, THREE.SRGBColorSpace);
export const SeatedPersonV4: React.FC<{position?: V3; rotationY?: number; headYaw?: number; headPitch?: number; headRoll?: number; shoulderRaise?: number; slump?: number; armL?: ArmPoseV4; armR?: ArmPoseV4; breath?: number}> = ({
  position, rotationY = 0, headYaw = 0, headPitch = 0, headRoll = 0, shoulderRaise = 0, slump = 0, armL, armR, breath = 0,
}) => {
  const sl = q(slump, 8), rs = q(shoulderRaise, 6);
  const m = useMemo(() => ({
    sweater: new THREE.MeshStandardMaterial({color: SWEATER_LIN, roughness: 0.95}),
    pants: new THREE.MeshStandardMaterial({color: new THREE.Color().setRGB(0.17, 0.19, 0.24, THREE.SRGBColorSpace), roughness: 0.85}),
    shoe: new THREE.MeshStandardMaterial({color: '#dcd6cc', roughness: 0.8}),
    skin: new THREE.MeshStandardMaterial({color: new THREE.Color().setRGB(0.89, 0.71, 0.6, THREE.SRGBColorSpace), roughness: 0.55, emissive: new THREE.Color('#3a140a'), emissiveIntensity: 0.18}),
  }), []);
  const torso = cached(`torso-${sl}-${rs}`, () => meshSDF(torsoSDF(sl, rs).cloth, {min: [-0.26, -0.05, -0.2], max: [0.26, 0.7, 0.22], cell: 0.006}));
  const legs = cached('legs', () => meshSDF(torsoSDF(0, 0).pants, {min: [-0.22, -0.42, -0.12], max: [0.22, 0.2, 0.55], cell: 0.007}));
  const shoes = cached('shoes', () => meshSDF(torsoSDF(0, 0).shoe, {min: [-0.18, -0.48, 0.36], max: [0.18, -0.36, 0.64], cell: 0.005}));
  const def: ArmPoseV4 = {pitch: 0.45, out: 0.15, elbow: 1.1};
  const arms = ([[-1, armL ?? def], [1, armR ?? def]] as const).map(([s, a]) => {
    const key = `arm-${s}-${q(a.pitch, 60)}-${q(a.out, 60)}-${q(a.elbow, 60)}-${q(a.twist ?? 0, 60)}-${sl}-${rs}`;
    const j = armJoints(s, a, sl, rs);
    const pts = [j.sh, j.elbow, j.wrist, [j.wrist[0] + j.d2[0] * 0.13, j.wrist[1] + j.d2[1] * 0.13, j.wrist[2] + j.d2[2] * 0.13] as V3];
    const mn: V3 = [0, 1, 2].map((i) => Math.min(...pts.map((p) => p[i])) - 0.075) as V3;
    const mx: V3 = [0, 1, 2].map((i) => Math.max(...pts.map((p) => p[i])) + 0.075) as V3;
    const sdf = armSDF(s, a, sl, rs);
    return {
      sleeve: cached(key + 's', () => meshSDF(sdf.sleeve, {min: mn, max: mx, cell: 0.005})),
      hand: cached(key + 'h', () => meshSDF(sdf.hand, {min: [j.wrist[0] - 0.13, j.wrist[1] - 0.13, j.wrist[2] - 0.13], max: [j.wrist[0] + 0.13, j.wrist[1] + 0.13, j.wrist[2] + 0.13], cell: 0.0032})),
    };
  });
  const headC = upperPt([0, 0.748, 0.022], sl, rs * 0.014);
  const b = 1 + breath * 0.012;
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh geometry={legs} material={m.pants} castShadow receiveShadow />
      <mesh geometry={shoes} material={m.shoe} castShadow receiveShadow />
      <mesh geometry={torso} material={m.sweater} castShadow receiveShadow scale={[b, 1, b]} />
      {arms.map((a, i) => (
        <group key={i}>
          <mesh geometry={a.sleeve} material={m.sweater} castShadow receiveShadow />
          <mesh geometry={a.hand} material={m.skin} castShadow receiveShadow />
        </group>
      ))}
      <HeadV4 position={headC} rotation={[headPitch + 0.1 + sl * 0.16, headYaw, headRoll]} />
    </group>
  );
};

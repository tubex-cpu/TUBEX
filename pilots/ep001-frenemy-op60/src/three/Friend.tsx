import {useMemo} from 'react';
import * as THREE from 'three';
import {Expr, friendHairColor, friendHairSDF, friendHeadColor, friendHeadSDF} from './friendSdf';
import {cached} from './Person';
import {ArmPoseV4, armJoints, armSDF, torsoSDF, upperPt} from './personSdf';
import {V3, meshSDF} from './sdf';

const q = (v: number, n: number) => Math.round(v * n) / n;
const srgb = (r: number, g: number, b: number) => new THREE.Color().setRGB(r, g, b, THREE.SRGBColorSpace);

export const FriendHead: React.FC<{expr: Expr; gaze?: [number, number]; position?: V3; rotation?: V3}> = ({expr, gaze = [0, 0], position, rotation}) => {
  const e: Expr = {smile: q(expr.smile, 4), open: q(expr.open, 4), lid: q(expr.lid, 4)};
  const key = `fh-${e.smile}-${e.open}-${e.lid}`;
  const head = cached(key, () => meshSDF(friendHeadSDF(e), {min: [-0.095, -0.18, -0.115], max: [0.095, 0.115, 0.125], cell: 0.0019, color: friendHeadColor(e)}));
  const hair = cached('fhair', () => meshSDF(friendHairSDF(), {min: [-0.12, -0.2, -0.16], max: [0.12, 0.13, 0.13], cell: 0.0024, color: friendHairColor}));
  const m = useMemo(() => ({
    skin: new THREE.MeshStandardMaterial({vertexColors: true, roughness: 0.5, emissive: new THREE.Color('#3a140a'), emissiveIntensity: 0.16}),
    hair: new THREE.MeshStandardMaterial({vertexColors: true, roughness: 0.55, side: THREE.DoubleSide}),
    sclera: new THREE.MeshStandardMaterial({color: '#f2ece6', roughness: 0.12}),
    iris: new THREE.MeshStandardMaterial({color: '#4a2e1c', roughness: 0.08}),
    pupil: new THREE.MeshStandardMaterial({color: '#070505', roughness: 0.05}),
    hl: new THREE.MeshBasicMaterial({color: '#ffffff', toneMapped: false}),
  }), []);
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={head} material={m.skin} castShadow receiveShadow />
      <mesh geometry={hair} material={m.hair} castShadow receiveShadow />
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.03, 0.004, 0.0705]} rotation={[-gaze[1], gaze[0], 0]}>
          <mesh material={m.sclera}><sphereGeometry args={[0.0118, 32, 24]} /></mesh>
          <mesh material={m.iris} position={[0, 0, 0.0089]} scale={[1, 1, 0.45]}><sphereGeometry args={[0.0064, 24, 16]} /></mesh>
          <mesh material={m.pupil} position={[0, 0, 0.0113]} scale={[1, 1, 0.3]}><sphereGeometry args={[0.0032, 16, 12]} /></mesh>
          <mesh material={m.hl} position={[0.0026, 0.003, 0.0119]}><sphereGeometry args={[0.0011, 8, 6]} /></mesh>
        </group>
      ))}
    </group>
  );
};

// seated friend facing +z. Body uses the shared seated-body sculpt (scaled), head is the friend's own.
export const Friend: React.FC<{position?: V3; rotationY?: number; expr: Expr; gaze?: [number, number]; head?: V3; slump?: number; armL?: ArmPoseV4; armR?: ArmPoseV4; breath?: number; top?: string}> = ({
  position, rotationY = 0, expr, gaze, head = [0, 0, 0], slump = 0, armL, armR, breath = 0, top = '#d9c8b0',
}) => {
  const S = 0.9;
  const sl = q(slump, 8);
  const m = useMemo(() => ({
    top: new THREE.MeshStandardMaterial({color: top, roughness: 0.95}),
    skin: new THREE.MeshStandardMaterial({color: srgb(0.94, 0.78, 0.68), roughness: 0.5, emissive: new THREE.Color('#3a140a'), emissiveIntensity: 0.16}),
  }), [top]);
  const torso = cached(`ftorso-${sl}`, () => meshSDF(torsoSDF(sl, 0).cloth, {min: [-0.26, -0.05, -0.2], max: [0.26, 0.7, 0.22], cell: 0.006}));
  const def: ArmPoseV4 = {pitch: 0.75, out: 0.05, elbow: 0.85};
  const arms = ([[-1, armL ?? def], [1, armR ?? def]] as const).map(([s, a]) => {
    const key = `farm-${s}-${q(a.pitch, 40)}-${q(a.out, 40)}-${q(a.elbow, 40)}-${q(a.twist ?? 0, 40)}-${sl}`;
    const j = armJoints(s, a, sl, 0);
    const pts = [j.sh, j.elbow, j.wrist];
    const mn: V3 = [0, 1, 2].map((i) => Math.min(...pts.map((p) => p[i])) - 0.08) as V3;
    const mx: V3 = [0, 1, 2].map((i) => Math.max(...pts.map((p) => p[i])) + 0.08) as V3;
    const sdf = armSDF(s, a, sl, 0);
    return {
      sleeve: cached(key + 's', () => meshSDF(sdf.sleeve, {min: mn, max: mx, cell: 0.006})),
      hand: cached(key + 'h', () => meshSDF(sdf.hand, {min: [j.wrist[0] - 0.13, j.wrist[1] - 0.13, j.wrist[2] - 0.13], max: [j.wrist[0] + 0.13, j.wrist[1] + 0.13, j.wrist[2] + 0.13], cell: 0.0034})),
    };
  });
  const hc = upperPt([0, 0.748, 0.022], sl, 0);
  const b = 1 + breath * 0.012;
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <group scale={S}>
        <mesh geometry={torso} material={m.top} castShadow receiveShadow scale={[b, 1, b]} />
        {arms.map((a, i) => (
          <group key={i}>
            <mesh geometry={a.sleeve} material={m.top} castShadow receiveShadow />
            <mesh geometry={a.hand} material={m.skin} castShadow receiveShadow />
          </group>
        ))}
      </group>
      <FriendHead expr={expr} gaze={gaze} position={[hc[0] * S, hc[1] * S - 0.005, hc[2] * S]} rotation={[0.08 + sl * 0.16 + head[0], head[1], head[2]]} />
    </group>
  );
};

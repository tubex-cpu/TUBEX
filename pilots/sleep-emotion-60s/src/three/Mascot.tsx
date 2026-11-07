import {useMemo} from 'react';
import * as THREE from 'three';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {makeNoiseMaterial} from './noiseMaterial';

// Faceless observer. Built from the written spec (the approved reference image was not
// reachable from this environment): big round head, small ears, short limbs, rounded body,
// CRT noise as a surface material. No eyes / mouth / hair / clothes / TV parts.
export type Pose = {
  headTilt?: number; // roll (rad) – "首をかしげる"
  headTurn?: number; // yaw of head relative to body
  headNod?: number; // pitch
  armL?: number; // raise of left arm (rad, 0 = hanging)
  armR?: number;
  lean?: number; // body pitch forward
  bob?: number; // tiny idle bob (m)
  step?: number; // leg phase for small steps
};

const bodyGeo = () => {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 24; i++) {
    const t = i / 24;
    const y = t * 0.5;
    const r = 0.06 + 0.22 * Math.sin(Math.PI * Math.min(1, t * 0.92 + 0.08)) * (1 - 0.18 * t);
    pts.push(new THREE.Vector2(Math.max(0.001, i === 0 ? 0.001 : i === 24 ? 0.09 : r), y));
  }
  return new THREE.LatheGeometry(pts, 64);
};

export const Mascot: React.FC<{pose?: Pose; position?: [number, number, number]; rotationY?: number; scale?: number; castShadow?: boolean}> = ({
  pose = {}, position = [0, 0, 0], rotationY = 0, scale = 1, castShadow = true,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const mat = useMemo(() => makeNoiseMaterial(120), []);
  const limbMat = useMemo(() => makeNoiseMaterial(170), []);
  mat.userData.uniforms.uTime.value = frame / fps;
  limbMat.userData.uniforms.uTime.value = frame / fps + 3.3;
  const geos = useMemo(
    () => ({
      body: bodyGeo(),
      head: new THREE.SphereGeometry(0.42, 96, 64),
      ear: new THREE.SphereGeometry(0.075, 32, 24),
      arm: new THREE.CapsuleGeometry(0.062, 0.17, 12, 24),
      leg: new THREE.CapsuleGeometry(0.085, 0.09, 12, 24),
    }),
    [],
  );
  const {headTilt = 0, headTurn = 0, headNod = 0, armL = 0, armR = 0, lean = 0, bob = 0, step = 0} = pose;
  const breathe = 1 + 0.008 * Math.sin((frame / fps) * 2 * Math.PI * 0.35);
  const sh = castShadow;
  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {/* legs */}
      {[-1, 1].map((s) => (
        <mesh key={s} geometry={geos.leg} material={limbMat} castShadow={sh} receiveShadow
          position={[s * 0.12, 0.13 + Math.max(0, Math.sin(step + (s > 0 ? Math.PI : 0))) * 0.03, Math.sin(step + (s > 0 ? Math.PI : 0)) * 0.03]} />
      ))}
      <group position={[0, 0.16 + bob, 0]} rotation={[lean, 0, 0]}>
        <mesh geometry={geos.body} material={mat} castShadow={sh} receiveShadow scale={[1.12, breathe * 1.05, 1.08]} />
        {/* arms: pivot at shoulder */}
        {([[-1, armL], [1, armR]] as const).map(([s, a]) => (
          <group key={s} position={[s * 0.2, 0.36, 0.0]} rotation={[-a * 0.55, 0, s * (0.28 + a)]}>
            <mesh geometry={geos.arm} material={limbMat} castShadow={sh} receiveShadow position={[0, -0.13, 0]} />
          </group>
        ))}
        {/* head */}
        <group position={[0, 0.8, 0]} rotation={[headNod, headTurn, headTilt]}>
          <mesh geometry={geos.head} material={mat} castShadow={sh} receiveShadow scale={[1, 0.95, 0.97]} />
          {[-1, 1].map((s) => (
            <mesh key={s} geometry={geos.ear} material={limbMat} castShadow={sh} receiveShadow
              position={[s * 0.27, 0.3, -0.02]} scale={[1, 1.1, 0.7]} rotation={[0, 0, -s * 0.5]} />
          ))}
        </group>
      </group>
    </group>
  );
};
// Mascot total height ≈ 1.6 units (head top at ~1.4 + legs). Scale for scene size.

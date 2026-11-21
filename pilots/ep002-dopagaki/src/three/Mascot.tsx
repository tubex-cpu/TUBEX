import {useMemo} from 'react';
import * as THREE from 'three';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {makeNoiseMaterial} from './noiseMaterial';

// The channel's observer, modelled on the approved reference images:
// a big perfect-sphere head (no ears, no face), a small pear-shaped body, stubby arms, short legs,
// covered in black/white pixel static. Total height ≈ 1.55 units.
export type Pose = {headTilt?: number; headTurn?: number; headNod?: number; armL?: number; armR?: number; lean?: number; bob?: number; step?: number};

const bodyGeo = () => {
  const pts: THREE.Vector2[] = [];
  const N = 32;
  for (let i = 0; i <= N; i++) {
    const t = i / N; // 0 bottom -> 1 top
    const r = 0.27 * Math.pow(Math.sin(Math.PI * Math.min(1, 0.05 + t * 0.9)), 0.7) * (1 - 0.12 * t);
    pts.push(new THREE.Vector2(i === 0 ? 0.0001 : Math.max(0.06, r), t * 0.52));
  }
  pts[N] = new THREE.Vector2(0.0001, 0.52);
  return new THREE.LatheGeometry(pts, 96);
};

export const Mascot: React.FC<{pose?: Pose; position?: [number, number, number]; rotationY?: number; scale?: number; castShadow?: boolean}> = ({
  pose = {}, position = [0, 0, 0], rotationY = 0, scale = 1, castShadow = true,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const mat = useMemo(() => makeNoiseMaterial(165), []);
  const mat2 = useMemo(() => makeNoiseMaterial(200), []);
  mat.userData.uniforms.uTime.value = frame / fps;
  mat2.userData.uniforms.uTime.value = frame / fps + 2.1;
  const g = useMemo(() => ({
    body: bodyGeo(),
    head: new THREE.SphereGeometry(0.43, 128, 96),
    arm: new THREE.CapsuleGeometry(0.068, 0.12, 12, 24),
    leg: new THREE.CapsuleGeometry(0.075, 0.07, 12, 24),
  }), []);
  const {headTilt = 0, headTurn = 0, headNod = 0, armL = 0, armR = 0, lean = 0, bob = 0, step = 0} = pose;
  const breathe = 1 + 0.008 * Math.sin((frame / fps) * 2 * Math.PI * 0.3);
  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {[-1, 1].map((s) => {
        const ph = Math.sin(step + (s > 0 ? Math.PI : 0));
        return <mesh key={s} geometry={g.leg} material={mat2} castShadow={castShadow} receiveShadow position={[s * 0.1, 0.11 + Math.max(0, ph) * 0.03, ph * 0.03]} />;
      })}
      <group position={[0, 0.12 + bob, 0]} rotation={[lean, 0, 0]}>
        <mesh geometry={g.body} material={mat} castShadow={castShadow} receiveShadow scale={[1, breathe, 0.92]} />
        {([[-1, armL], [1, armR]] as const).map(([s, a]) => (
          <group key={s} position={[s * 0.215, 0.37, 0.01]} rotation={[-a * 0.6, 0, s * (0.22 + a * 0.9)]}>
            <mesh geometry={g.arm} material={mat2} castShadow={castShadow} receiveShadow position={[0, -0.1, 0]} />
          </group>
        ))}
        <group position={[0, 0.88, 0]} rotation={[headNod, headTurn, headTilt]}>
          <mesh geometry={g.head} material={mat} castShadow={castShadow} receiveShadow />
        </group>
      </group>
    </group>
  );
};

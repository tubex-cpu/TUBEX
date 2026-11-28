import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bedroom} from './three/Bedroom';
import {CameraRig} from './three/common';
import {Mascot} from './three/Mascot';

const gl = {toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1, antialias: true};

export const BedroomTest: React.FC<{cam?: number}> = ({cam = 0}) => {
  const {width, height} = useVideoConfig();
  const cams: [[number, number, number], [number, number, number], number][] = [
    [[0.9, 1.35, 2.4], [-0.2, 0.6, 0], 35],
    [[-0.32, 0.86, 0.72], [-0.7, 0.68, 0.02], 30],
  ];
  const c = cams[cam];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <ThreeCanvas width={width} height={height} shadows gl={gl}>
        <CameraRig pos={c[0]} target={c[1]} fov={c[2]} />
        <Bedroom />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

export const MascotTest: React.FC = () => {
  const {width, height} = useVideoConfig();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <ThreeCanvas width={width} height={height} shadows gl={gl}>
        <color attach="background" args={['#15171d']} />
        <CameraRig pos={[0.0, 1.0, 4.2]} target={[0, 0.75, 0]} fov={30} />
        <hemisphereLight args={['#c8d4ff', '#202020', 0.6]} />
        <directionalLight position={[2, 4, 3]} intensity={2.2} castShadow shadow-mapSize={[2048, 2048]} />
        <directionalLight position={[-3, 2, -2]} intensity={0.8} color="#9fb4ff" />
        <Mascot pose={{headTilt: Math.sin(f / 20) * 0.25, armR: 0.4}} rotationY={0.35} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[10, 10]} /><meshStandardMaterial color="#3a3c44" /></mesh>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

import {Brain3D} from './three/Brain3D';
export const BrainTest: React.FC = () => {
  const {width, height} = useVideoConfig();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#0b1020'}}>
      <ThreeCanvas width={width} height={height} gl={{...gl, alpha: true}}>
        <CameraRig pos={[-2.4, 0.9, 2.6]} target={[0, -0.1, 0]} fov={32} />
        <hemisphereLight args={['#dbe6ff', '#1a2030', 1.0]} />
        <directionalLight position={[-2, 3, 3]} intensity={2.2} />
        <directionalLight position={[3, 1, -3]} intensity={1.2} color="#8fb0ff" />
        <Brain3D t={f / 30} rotY={f < 100 ? 0.0 : -1.2} amyg={0.8} pfc={0.8} link={1} coupling={1} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

import {HeadV4} from './three/Person';
export const HeadTest: React.FC<{closed?: boolean}> = ({closed = false}) => {
  const {width, height} = useVideoConfig();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#20242c'}}>
      <ThreeCanvas width={width} height={height} gl={gl} shadows>
        <CameraRig pos={[Math.sin(f / 40) * 0.42, 0.04, Math.cos(f / 40) * 0.42]} target={[0, -0.02, 0]} fov={30} />
        <hemisphereLight args={['#dbe6ff', '#3a2a20', 0.8]} />
        <directionalLight position={[-1, 1.5, 1.5]} intensity={2.4} castShadow />
        <directionalLight position={[1.5, 0.5, -1]} intensity={1.2} color="#9fb4ff" />
        <HeadV4 eyesClosed={closed} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

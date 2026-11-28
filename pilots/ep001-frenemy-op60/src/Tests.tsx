import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {Cafe} from './three/Cafe';
import {CameraRig} from './three/common';
import {Mascot} from './three/Mascot';

const gl = {toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0, antialias: true};
export const MascotTest: React.FC = () => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <ThreeCanvas width={width} height={height} gl={gl}>
        <color attach="background" args={['#0d0e10']} />
        <CameraRig pos={[0.3, 0.9, 4.2]} target={[0, 0.78, 0]} fov={30} />
        <hemisphereLight args={['#9aa3b5', '#101010', 0.35]} />
        <directionalLight position={[1.5, 2.5, 2.5]} intensity={1.6} />
        <directionalLight position={[-2, 2.2, -2.5]} intensity={4} color="#ffd9a8" />
        <Mascot />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
export const CafeTest: React.FC<{cam?: number; smile?: number; open?: number; lid?: number}> = ({cam = 0, smile = 0.6, open = 0, lid = 0}) => {
  const {width, height} = useVideoConfig();
  const cams: [[number, number, number], [number, number, number], number][] = [
    [[0, 1.2, 0.62], [0, 1.0, -0.6], 42],
    [[0.05, 1.16, 0.15], [0, 1.1, -0.6], 26],
    [[1.6, 1.5, 1.6], [0, 0.9, -0.3], 40],
  ];
  const c = cams[cam];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <ThreeCanvas width={width} height={height} gl={gl} shadows>
        <CameraRig pos={c[0]} target={c[1]} fov={c[2]} />
        <Cafe friend={{expr: {smile, open, lid}, gaze: [0, 0.05]}} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
import {FriendHead} from './three/Friend';
export const FaceTest: React.FC<{smile?: number; open?: number; lid?: number; yaw?: number}> = ({smile = 0.5, open = 0, lid = 0, yaw = 0}) => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#2a2622'}}>
      <ThreeCanvas width={width} height={height} gl={gl}>
        <CameraRig pos={[Math.sin(yaw) * 0.55, 0.0, Math.cos(yaw) * 0.55]} target={[0, -0.03, 0]} fov={28} />
        <hemisphereLight args={['#fff1e0', '#3a2a20', 0.6]} />
        <directionalLight position={[-0.8, 1.2, 1.5]} intensity={2.2} color="#ffe2c4" />
        <directionalLight position={[1.2, 0.6, -1]} intensity={1.6} color="#b8c8ff" />
        <FriendHead expr={{smile, open, lid}} gaze={[0, 0]} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
import {Apartment, Hall, Street} from './three/Sets';
export const SetTest: React.FC<{set: string}> = ({set}) => {
  const {width, height} = useVideoConfig();
  const ex = {smile: 0.5, open: 0, lid: 0.25};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <ThreeCanvas width={width} height={height} gl={gl} shadows>
        {set === 'apt' && <><CameraRig pos={[0.0, 1.05, 0.75]} target={[0.05, 0.85, -0.9]} fov={38} /><Apartment friend={{expr: ex, gaze: [0, 0.1], head: [0.05, 0, 0.08]}} /></>}
        {set === 'street' && <><CameraRig pos={[-0.15, 1.55, 0.9]} target={[0.45, 1.4, -0.6]} fov={40} /><Street friendPos={[0.6, 0.86, -0.5]} friend={{expr: {smile: 1, open: 0.25, lid: 0}, gaze: [-0.25, 0], head: [0, -0.35, 0]}} /></>}
        {set === 'street2' && <><CameraRig pos={[0, 1.55, 0]} target={[0, 1.2, -6]} fov={45} /><Street /></>}
        {set === 'hall' && <><CameraRig pos={[0, 1.4, 5.2]} target={[0, 1.2, 0]} fov={40} /><Hall><Mascot position={[0.9, 0, 0.6]} scale={0.9} rotationY={-0.3} /><directionalLight position={[-2, 3, -3]} intensity={2.5} color="#ffd9a8" /><directionalLight position={[3, 2, 4]} intensity={0.6} /></Hall></>}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

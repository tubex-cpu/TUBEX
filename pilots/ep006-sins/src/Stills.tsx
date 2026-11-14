import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {AbsoluteFill} from 'remotion';
import {Bedroom} from './three/Bedroom';
import {DeskRoom} from './three/Desk';
import {Apartment} from './three/Sets';
import {MRIRoom} from './three/MRI';
import {WhiteRoom} from './three/WhiteRoom';
import {CameraRig} from './three/common';

// pre-rendered CG backgrounds (rendered once with renderStill into public/bg/)
const GL = {toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0, antialias: true, preserveDrawingBuffer: true};
const C: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <ThreeCanvas width={1920} height={1080} shadows={{type: THREE.PCFSoftShadowMap}} gl={GL}>{children}</ThreeCanvas>
  </AbsoluteFill>
);
export const BgBed: React.FC = () => <C><CameraRig pos={[1.5, 1.05, 0.15]} target={[-0.7, 0.75, -0.35]} fov={46} /><Bedroom lampOn={0} showPerson={false} /></C>;
export const BgBedLamp: React.FC = () => <C><CameraRig pos={[2.4, 1.35, 1.9]} target={[-0.3, 0.6, -0.3]} fov={40} /><Bedroom lampOn={1} showPerson={false} /></C>;
export const BgDesk: React.FC = () => <C><CameraRig pos={[0.55, 1.3, 1.25]} target={[0, 0.9, -0.5]} fov={44} /><DeskRoom t={0} /></C>;
export const BgLiving: React.FC = () => <C><CameraRig pos={[0.0, 1.25, 1.9]} target={[0, 0.8, -0.9]} fov={44} /><Apartment /></C>;
export const BgMri: React.FC = () => <C><CameraRig pos={[3.6, 1.8, 3.2]} target={[0.3, 1.0, 0]} fov={34} /><MRIRoom slide={0.6} /></C>;
export const BgWhite: React.FC = () => <C><CameraRig pos={[0.2, 1.3, 5.2]} target={[0, 1.15, 0]} fov={38} /><WhiteRoom /></C>;

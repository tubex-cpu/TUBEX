// 3D canvas with the "cinematic" finish used in ルール改変ニッポン opening v2 (owner: 2026-11-14 "映像の方向性はこれでOK").
// Renders the 3D at 1440x810 and scales to 1920x1080 (about 3x faster on the CPU renderer; depth of field hides the difference).
import {ThreeCanvas} from '@remotion/three';
import {Bloom, DepthOfField, EffectComposer, Vignette} from '@react-three/postprocessing';
import * as THREE from 'three';

const GL = {toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05, antialias: true, preserveDrawingBuffer: true};
export const RW = 1440, RH = 810;

// focus: 0 (near) .. 1 (far) in the camera's depth range; blur: bokeh size (2 = light tilt-shift, 5-7 = background only)
export const Canvas3D: React.FC<{children: React.ReactNode; focus: number; blur?: number; bloom?: number; vignette?: number}> = ({children, focus, blur = 3.2, bloom = 0.5, vignette = 0.62}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: RW, height: RH, transform: `scale(${1920 / RW})`, transformOrigin: '0 0'}}>
    <ThreeCanvas width={RW} height={RH} gl={GL} shadows={{type: THREE.PCFShadowMap}} style={{position: 'absolute', inset: 0}}>
      {children}
      <EffectComposer multisampling={0}>
        <DepthOfField focusDistance={focus} focalLength={0.035} bokehScale={blur} height={540} />
        <Bloom intensity={bloom} luminanceThreshold={0.85} luminanceSmoothing={0.2} />
        <Vignette offset={0.25} darkness={vignette} />
      </EffectComposer>
    </ThreeCanvas>
  </div>
);

// screen position (1920x1080) of a world point, for 2D labels that follow 3D objects
export const project = (p: number[], cam: {pos: number[]; target: number[]; fov?: number}) => {
  const c = new THREE.PerspectiveCamera(cam.fov ?? 35, 1920 / 1080, 0.1, 600);
  c.position.set(cam.pos[0], cam.pos[1], cam.pos[2]);
  c.lookAt(cam.target[0], cam.target[1], cam.target[2]);
  c.updateMatrixWorld();
  const v = new THREE.Vector3(p[0], p[1], p[2]).project(c);
  return [(v.x + 1) / 2 * 1920, (1 - v.y) / 2 * 1080];
};

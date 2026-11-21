// Shared 3D stage for 地球の事情: bright studio (light sky, linen table), soft sun with shadows, tilt-shift depth of field.
import {ThreeCanvas} from '@remotion/three';
import {Bloom, DepthOfField, EffectComposer, Vignette} from '@react-three/postprocessing';
import {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {useThree} from '@react-three/fiber';
import {useOffthreadVideoTexture} from '@remotion/three';
import {continueRender, delayRender} from 'remotion';
import * as THREE from 'three';
import {RH, RW, loadFonts} from '../theme';
import {canvasTexture, rand} from './common';

export const useFonts = () => {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const h = delayRender('fonts-ready');
    loadFonts().then(() => {
      setOk(true);
      continueRender(h);
    });
  }, []);
  return ok;
};

const GL = {toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0, antialias: true, preserveDrawingBuffer: true};

export const Canvas3D: React.FC<{children: React.ReactNode; focus: number; blur?: number; range?: number; bloom?: number; vignette?: number}> = ({children, focus, blur = 3, range = 0.03, bloom = 0.35, vignette = 0.45}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: RW, height: RH, transform: `scale(${1920 / RW})`, transformOrigin: '0 0'}}>
    <ThreeCanvas width={RW} height={RH} gl={GL} shadows={{type: THREE.PCFSoftShadowMap}} style={{position: 'absolute', inset: 0}}>
      {children}
      <EffectComposer multisampling={0}>
        <DepthOfField focusDistance={focus} focalLength={range} bokehScale={blur} height={540} />
        <Bloom intensity={bloom} luminanceThreshold={0.9} luminanceSmoothing={0.2} />
        <Vignette offset={0.3} darkness={vignette} />
      </EffectComposer>
    </ThreeCanvas>
  </div>
);

// bright studio sky dome
export const Sky: React.FC<{top?: string; bottom?: string}> = ({top = '#cfe0ee', bottom = '#f6f1e8'}) => {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: {top: {value: new THREE.Color(top)}, bottom: {value: new THREE.Color(bottom)}},
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 bottom; varying vec3 vP; void main(){ float h = clamp(vP.y*1.3+0.25,0.0,1.0); gl_FragColor = vec4(mix(bottom, top, pow(h,0.8)), 1.0); }',
  }), [top, bottom]);
  return <mesh material={mat} scale={500}><sphereGeometry args={[1, 32, 16]} /></mesh>;
};

// linen-like table
export const Table: React.FC<{y?: number; color?: string}> = ({y = -0.5, color = '#ece6dc'}) => {
  const tex = useMemo(() => {
    const t = canvasTexture(512, 512, (g) => {
      g.fillStyle = color; g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 6000; i++) {
        const v = rand(i) > 0.5 ? 255 : 0;
        g.fillStyle = `rgba(${v},${v},${v},${0.025 + rand(i + 3) * 0.03})`;
        g.fillRect(rand(i + 1) * 512, rand(i + 2) * 512, 1 + rand(i + 4) * 3, 1);
      }
    });
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(24, 24);
    return t;
  }, [color]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
      <planeGeometry args={[400, 400]} />
      <meshStandardMaterial map={tex} roughness={0.95} />
    </mesh>
  );
};

export const Lights: React.FC<{sun?: [number, number, number]; intensity?: number; span?: number}> = ({sun = [-9, 16, 8], intensity = 2.0, span = 14}) => (
  <>
    <hemisphereLight args={['#ffffff', '#d9d2c6', 1.25]} />
    <directionalLight position={sun} intensity={intensity} color="#fff3e2" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}
      shadow-camera-left={-span} shadow-camera-right={span} shadow-camera-top={span} shadow-camera-bottom={-span} shadow-bias={-0.0003} shadow-radius={4} />
  </>
);

// strata texture for the cut sides of the map board (a diorama slab)
export const strataTex = () => canvasTexture(512, 64, (g) => {
  const bands = ['#7a8f6a', '#a58a63', '#8e7352', '#b39d79', '#6f5c45'];
  let y = 0;
  bands.forEach((c, i) => {
    const h = [6, 14, 16, 12, 16][i];
    g.fillStyle = c; g.fillRect(0, y, 512, h);
    for (let k = 0; k < 120; k++) { g.fillStyle = `rgba(0,0,0,${rand(i * 300 + k) * 0.12})`; g.fillRect(rand(k + i) * 512, y + rand(k * 3 + i) * h, 3, 2); }
    y += h;
  });
});

// Video frame as a texture, inside the canvas. ThreeCanvas renders once per frame (frameloop "never"); the frame image
// arrives later, so we render again when it lands and hold the frame (delayRender) until then.
export const usePlate = (src: string) => {
  const tex = useOffthreadVideoTexture({src});
  const {advance} = useThree();
  const [h] = useState(() => delayRender('plate'));
  useLayoutEffect(() => {
    if (!tex) return;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    advance(performance.now());
    requestAnimationFrame(() => {
      advance(performance.now());
      continueRender(h);
    });
  }, [tex, advance, h]);
  return tex;
};

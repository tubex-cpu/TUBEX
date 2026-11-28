import {ThreeCanvas} from '@remotion/three';
import {useCurrentFrame, useVideoConfig} from 'remotion';
export const GLTest = () => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} shadows camera={{position: [0, 1.5, 4], fov: 40}} style={{background: '#202430'}}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 5, 2]} intensity={2} castShadow shadow-mapSize={[1024, 1024]} />
      <mesh castShadow position={[0, 0.6, 0]} rotation={[0, f / 20, 0]}>
        <torusKnotGeometry args={[0.5, 0.18, 128, 32]} />
        <meshStandardMaterial color="#d08050" roughness={0.5} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#888" />
      </mesh>
    </ThreeCanvas>
  );
};

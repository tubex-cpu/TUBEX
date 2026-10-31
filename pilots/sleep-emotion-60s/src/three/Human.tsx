import {useMemo} from 'react';
import * as THREE from 'three';

// Stylised "miniature re-enactment" person (clay-figure look, not photoreal).
// Same hair / skin / sweater colours in every scene so viewers read it as one person.
export const SKIN = '#e2b394';
export const HAIR = '#3b2c22';
export const SWEATER = '#5f6f86';

const skinMat = () => new THREE.MeshStandardMaterial({color: SKIN, roughness: 0.62, emissive: new THREE.Color('#3a1a10'), emissiveIntensity: 0.25});
const hairMat = () => new THREE.MeshStandardMaterial({color: HAIR, roughness: 0.8});
const darkMat = () => new THREE.MeshStandardMaterial({color: '#4a2f25', roughness: 0.6});

// Head: crown = +y, face = +z, size ≈ 0.23 m tall.
export const Head: React.FC<{eyesClosed?: boolean; position?: [number, number, number]; rotation?: [number, number, number]}> = ({eyesClosed = true, position, rotation}) => {
  const m = useMemo(() => ({skin: skinMat(), hair: hairMat(), dark: darkMat(), lip: new THREE.MeshStandardMaterial({color: '#9a5a4c', roughness: 0.6})}), []);
  const g = useMemo(() => {
    const skull = new THREE.SphereGeometry(0.1, 64, 48);
    // jaw/cheek shaping
    const p = skull.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const lower = Math.max(0, -y / 0.1);
      x *= 0.78 - 0.16 * lower * lower; // narrower chin
      z *= 0.95 - 0.1 * lower;
      y *= 1.12;
      if (z > 0) z *= 1 + 0.05 * (1 - Math.abs(y) / 0.11);
      p.setXYZ(i, x, y, z);
    }
    skull.computeVertexNormals();
    const hair = new THREE.SphereGeometry(0.106, 64, 48, 0, Math.PI * 2, 0, Math.PI * 0.62);
    const hp = hair.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < hp.count; i++) {
      let x = hp.getX(i), y = hp.getY(i), z = hp.getZ(i);
      x *= 0.84; y *= 1.12; z *= 1.0;
      // hairline: pull front edge up so the forehead shows
      if (z > 0.05 && y < 0.06) y += (0.06 - y) * 0.7 * (z / 0.106);
      hp.setXYZ(i, x, y, z - 0.004);
    }
    hair.computeVertexNormals();
    return {
      skull, hair,
      back: new THREE.SphereGeometry(0.1, 48, 32),
      nose: new THREE.SphereGeometry(0.018, 24, 16),
      ear: new THREE.SphereGeometry(0.022, 24, 16),
      lid: new THREE.TorusGeometry(0.016, 0.0028, 8, 24, Math.PI * 0.9),
      brow: new THREE.CapsuleGeometry(0.0028, 0.022, 4, 8),
      lip: new THREE.TorusGeometry(0.014, 0.0022, 6, 20, Math.PI * 0.55),
      eye: new THREE.SphereGeometry(0.0075, 16, 12),
      neck: new THREE.CylinderGeometry(0.045, 0.05, 0.16, 32),
    };
  }, []);
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={g.skull} material={m.skin} castShadow receiveShadow />
      <mesh geometry={g.hair} material={m.hair} castShadow receiveShadow />
      {/* back hair volume */}
      <mesh geometry={g.back} material={m.hair} castShadow receiveShadow position={[0, 0.0, -0.025]} scale={[0.86, 1.05, 0.85]} />
      <mesh geometry={g.nose} material={m.skin} castShadow position={[0, -0.012, 0.094]} scale={[0.8, 1.2, 0.9]} />
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh geometry={g.ear} material={m.skin} castShadow position={[s * 0.08, 0.0, 0.0]} scale={[0.5, 1.2, 0.9]} />
          {eyesClosed ? (
            <mesh geometry={g.lid} material={m.dark} position={[s * 0.033, 0.012, 0.088]} rotation={[0.1, s * 0.25, Math.PI * 1.05]} />
          ) : (
            <mesh geometry={g.eye} material={m.dark} position={[s * 0.032, 0.01, 0.088]} scale={[0.85, 1.15, 0.5]} />
          )}
          <mesh geometry={g.brow} material={m.hair} position={[s * 0.035, 0.04, 0.09]} rotation={[0, s * 0.3, Math.PI / 2 + s * 0.12]} />
        </group>
      ))}
      <mesh geometry={g.lip} material={m.lip} position={[0, -0.036, 0.086]} rotation={[0.25, 0, Math.PI + Math.PI * 0.225]} />
      <mesh geometry={g.neck} material={m.skin} castShadow receiveShadow position={[0, -0.13, -0.012]} />
    </group>
  );
};

// Seated upper body for the desk scene. Origin = seat surface centre, facing +z.
export const SeatedPerson: React.FC<{position?: [number, number, number]; rotationY?: number; headYaw?: number; headPitch?: number; shoulderRaise?: number; slump?: number; typing?: number}> = ({
  position, rotationY = 0, headYaw = 0, headPitch = 0, shoulderRaise = 0, slump = 0, typing = 0,
}) => {
  const m = useMemo(() => ({
    sweater: new THREE.MeshStandardMaterial({color: SWEATER, roughness: 0.9}),
    skin: skinMat(),
    pants: new THREE.MeshStandardMaterial({color: '#2c3240', roughness: 0.85}),
    shoe: new THREE.MeshStandardMaterial({color: '#d9d4cc', roughness: 0.9}),
  }), []);
  const g = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const r = 0.16 + 0.03 * Math.sin(Math.PI * t) - 0.05 * Math.pow(t, 3);
      pts.push(new THREE.Vector2(i === 20 ? 0.06 : r, t * 0.55));
    }
    const torso = new THREE.LatheGeometry(pts, 48);
    torso.scale(1.15, 1, 0.72);
    return {
      torso,
      shoulder: new THREE.SphereGeometry(0.062, 32, 24),
      upper: new THREE.CapsuleGeometry(0.055, 0.22, 8, 24),
      fore: new THREE.CapsuleGeometry(0.048, 0.22, 8, 24),
      hand: new THREE.SphereGeometry(0.042, 24, 16),
      thigh: new THREE.CapsuleGeometry(0.075, 0.36, 8, 24),
      shin: new THREE.CapsuleGeometry(0.06, 0.4, 8, 24),
      foot: new THREE.CapsuleGeometry(0.045, 0.14, 8, 16),
    };
  }, []);
  const lift = shoulderRaise * 0.03;
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* thighs on the seat, pointing forward (+z) */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh geometry={g.thigh} material={m.pants} castShadow receiveShadow position={[s * 0.1, 0.08, 0.2]} rotation={[Math.PI / 2, 0, 0]} />
          <mesh geometry={g.shin} material={m.pants} castShadow receiveShadow position={[s * 0.1, -0.2, 0.42]} />
          <mesh geometry={g.foot} material={m.shoe} castShadow receiveShadow position={[s * 0.1, -0.44, 0.48]} rotation={[Math.PI / 2, 0, 0]} />
        </group>
      ))}
      <group position={[0, 0.06, -0.02]} rotation={[0.12 + slump * 0.12, 0, 0]}>
        <mesh geometry={g.torso} material={m.sweater} castShadow receiveShadow />
        {[-1, 1].map((s) => {
          const tw = Math.sin(typing * 9 + s) * 0.04 * (typing > 0 ? 1 : 0);
          return (
            <group key={s} position={[s * 0.175, 0.47 + lift, 0.0]}>
              <mesh geometry={g.shoulder} material={m.sweater} castShadow receiveShadow />
              {/* upper arm hangs down & slightly forward */}
              <group rotation={[-0.55 - slump * 0.1, 0, s * 0.12]}>
                <mesh geometry={g.upper} material={m.sweater} castShadow receiveShadow position={[0, -0.15, 0]} />
                <group position={[0, -0.29, 0]} rotation={[-1.05 + tw, 0, -s * 0.2]}>
                  <mesh geometry={g.fore} material={m.sweater} castShadow receiveShadow position={[0, -0.13, 0]} />
                  <mesh geometry={g.hand} material={m.skin} castShadow receiveShadow position={[0, -0.28, 0.0]} scale={[1, 1.25, 0.6]} />
                </group>
              </group>
            </group>
          );
        })}
        <Head eyesClosed={false} position={[0, 0.69 + lift * 0.5, 0.02]} rotation={[headPitch, headYaw, 0]} />
      </group>
    </group>
  );
};

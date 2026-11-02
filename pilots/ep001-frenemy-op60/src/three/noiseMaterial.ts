import * as THREE from 'three';

// Black/white "TV static" pixels bound to the surface (object space), like the approved reference:
// square pixel grain, high contrast, slightly soft. Changes gently with time (cross-faded), deterministic per frame.
const GLSL = /* glsl */ `
varying vec3 vObjPos;
varying vec3 vObjNormal;
uniform float uTime;
uniform float uGrain;
float hash13(vec3 p3){ p3 = fract(p3 * .1031); p3 += dot(p3, p3.zyx + 31.32); return fract((p3.x + p3.y) * p3.z); }
// triplanar square pixels so cells stay square on the sphere
float px(vec3 p, vec3 n, float k){
  vec3 w = pow(abs(n), vec3(6.0)); w /= (w.x + w.y + w.z);
  vec3 o = vec3(mod(k, 53.0) * 13.1, mod(k, 41.0) * 7.7, 3.3);
  float a = hash13(vec3(floor(p.yz * uGrain), 1.0) + o);
  float b = hash13(vec3(floor(p.zx * uGrain), 2.0) + o);
  float c = hash13(vec3(floor(p.xy * uGrain), 3.0) + o);
  return a * w.x + b * w.y + c * w.z;
}
float crt(vec3 p, vec3 n){
  float rate = 3.0;
  float k = floor(uTime * rate); float t = smoothstep(0.0, 1.0, fract(uTime * rate));
  float g = mix(px(p, n, k), px(p, n, k + 1.0), t * 0.35); // mostly stable, slow shimmer
  // clumps: neighbouring pixels tend to group (like the reference)
  float g2 = px(p * 0.5, n, 7.0);
  float v = mix(g, g2, 0.35);
  v = smoothstep(0.44, 0.66, v);
  return 0.05 + 0.88 * v;
}
`;

export const makeNoiseMaterial = (grain = 120) => {
  const m = new THREE.MeshStandardMaterial({color: '#ffffff', roughness: 0.78, metalness: 0.0});
  const uniforms = {uTime: {value: 0}, uGrain: {value: grain}, uGlow: {value: 0.0}};
  m.userData.uniforms = uniforms;
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = uniforms.uTime;
    sh.uniforms.uGrain = uniforms.uGrain;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vObjPos;\nvarying vec3 vObjNormal;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvObjPos = position;\nvObjNormal = normal;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\n' + GLSL)
      .replace('#include <color_fragment>', '#include <color_fragment>\nfloat cv = crt(vObjPos, normalize(vObjNormal));\ndiffuseColor.rgb *= vec3(cv);');
  };
  m.customProgramCacheKey = () => 'crt-pixels-v3';
  return m;
};

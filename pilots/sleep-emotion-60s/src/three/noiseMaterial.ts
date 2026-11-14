import * as THREE from 'three';

// CRT-like black/white grain bound to the object's own surface coordinates (not screen space),
// so the noise sits on the form and keeps the 3D shading. Everything is a pure function of uTime,
// which is derived from the Remotion frame number -> any frame renders identically.
const GLSL = /* glsl */ `
varying vec3 vObjPos;
uniform float uTime;
uniform float uGrain;
uniform float uGlow;
float hash13(vec3 p3){ p3 = fract(p3 * .1031); p3 += dot(p3, p3.zyx + 31.32); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec3 p){
  vec3 i = floor(p); vec3 f = fract(p); f = f*f*(3.0-2.0*f);
  float n000=hash13(i), n100=hash13(i+vec3(1,0,0)), n010=hash13(i+vec3(0,1,0)), n110=hash13(i+vec3(1,1,0));
  float n001=hash13(i+vec3(0,0,1)), n101=hash13(i+vec3(1,0,1)), n011=hash13(i+vec3(0,1,1)), n111=hash13(i+vec3(1,1,1));
  return mix(mix(mix(n000,n100,f.x),mix(n010,n110,f.x),f.y), mix(mix(n001,n101,f.x),mix(n011,n111,f.x),f.y), f.z);
}
float crt(vec3 p){
  float rate = 5.0;                       // grain pattern changes 5x/s, cross-faded (no hard flicker)
  float k = floor(uTime * rate); float a = smoothstep(0.0, 1.0, fract(uTime * rate));
  vec3 o1 = vec3(mod(k, 61.0) * 7.31, mod(k, 47.0) * 3.17, 0.0);
  vec3 o2 = vec3(mod(k + 1.0, 61.0) * 7.31, mod(k + 1.0, 47.0) * 3.17, 0.0);
  vec3 q = p * uGrain;
  float g = mix(hash13(floor(q) + o1), hash13(floor(q) + o2), a);
  float g2 = mix(vnoise(q * 0.5 + o1), vnoise(q * 0.5 + o2), a);
  float grain = mix(g, g2, 0.6);
  float coarse = vnoise(p * 18.0 + vec3(0.0, uTime * 0.12, 0.0));
  float scan = 0.5 + 0.5 * sin(p.y * 420.0 - uTime * 2.2);       // fine scanlines drifting slowly
  float band = smoothstep(0.0, 0.08, abs(fract(p.y * 1.6 - uTime * 0.07) - 0.5)); // rare soft roll bar
  grain = smoothstep(0.18, 0.82, grain);        // push toward black / white static
  float v = 0.06 + 0.92 * grain;
  float scanL = 0.5 + 0.5 * sin(p.y * 150.0 - uTime * 1.6);
  v *= 0.78 + 0.22 * scanL;
  v *= 0.92 + 0.08 * scan;
  v = mix(v, coarse, 0.12);
  v *= 0.94 + 0.06 * band;
  return v;
}
`;

export const makeNoiseMaterial = (grain = 70) => {
  const m = new THREE.MeshStandardMaterial({color: '#ffffff', roughness: 0.5, metalness: 0.0});
  const uniforms = {uTime: {value: 0}, uGrain: {value: grain}, uGlow: {value: 0.22}};
  m.userData.uniforms = uniforms;
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = uniforms.uTime;
    sh.uniforms.uGrain = uniforms.uGrain;
    sh.uniforms.uGlow = uniforms.uGlow;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vObjPos;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvObjPos = position;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\n' + GLSL)
      .replace('#include <color_fragment>', '#include <color_fragment>\nfloat cv = crt(vObjPos);\ndiffuseColor.rgb *= vec3(cv);')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(cv * cv) * uGlow;');
  };
  m.customProgramCacheKey = () => 'crt-noise-v2';
  return m;
};

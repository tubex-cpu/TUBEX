import {perlin3} from './noise';
import {SDF, V3, capsule, ellipsoid, roundCone, smax, smin, sphere} from './sdf';

// Sculpted re-enactment person (SDF + surface nets). Original design; same look in every scene.
export const SKIN: V3 = [0.89, 0.71, 0.6];
const SKIN_SHADE: V3 = [0.8, 0.58, 0.48];
const BLUSH: V3 = [0.9, 0.6, 0.55];
const LIP: V3 = [0.72, 0.42, 0.38];
export const HAIR_C: V3 = [0.17, 0.12, 0.09];
export const SWEATER_C: V3 = [0.36, 0.43, 0.54];
const PANTS_C: V3 = [0.17, 0.19, 0.24];

const mix3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const g2 = (d2: number, r: number) => Math.exp(-d2 / (r * r));

// ---------------- head (origin = skull centre, +y up, +z face) ----------------
const mirrorX = (f: (sx: number) => SDF): SDF => {
  const L = f(-1), R = f(1);
  return (x, y, z) => (x < 0 ? L(x, y, z) : R(x, y, z));
};

export const headSDF = (eyesClosed: boolean): SDF => {
  const cranium = ellipsoid([0, 0.012, -0.006], [0.073, 0.088, 0.094]);
  const face = ellipsoid([0, -0.03, 0.026], [0.062, 0.065, 0.074]);
  const jaw = mirrorX((s) => roundCone([s * 0.053, -0.025, -0.004], [s * 0.019, -0.088, 0.062], 0.019, 0.013));
  const chin = sphere([0, -0.083, 0.068], 0.017);
  const cheek = mirrorX((s) => ellipsoid([s * 0.041, -0.016, 0.058], [0.024, 0.019, 0.022]));
  const brow = capsule([-0.036, 0.024, 0.075], [0.036, 0.024, 0.075], 0.011);
  const nose = roundCone([0, 0.012, 0.087], [0, -0.022, 0.109], 0.0075, 0.0125);
  const wing = mirrorX((s) => sphere([s * 0.0098, -0.0235, 0.1], 0.0058));
  const upperLip = roundCone([0, -0.0435, 0.092], [0, -0.0435, 0.092], 0.007, 0.007);
  const lipU = mirrorX((s) => roundCone([0, -0.044, 0.091], [s * 0.021, -0.047, 0.083], 0.0068, 0.004));
  const lipL = mirrorX((s) => roundCone([0, -0.054, 0.089], [s * 0.018, -0.051, 0.082], 0.0078, 0.0045));
  const ear = mirrorX((s) => ellipsoid([s * 0.074, -0.006, -0.004], [0.011, 0.03, 0.02]));
  const earHole = mirrorX((s) => ellipsoid([s * 0.083, -0.008, -0.002], [0.006, 0.018, 0.011]));
  const socket = mirrorX((s) => ellipsoid([s * 0.031, 0.008, 0.088], [0.018, 0.013, 0.014]));
  const lid = mirrorX((s) => ellipsoid([s * 0.031, 0.0075, 0.079], [0.0142, 0.0098, 0.0105]));
  const upperLid = mirrorX((s) => ellipsoid([s * 0.031, 0.012, 0.0795], [0.0148, 0.0092, 0.0108]));
  const mouthLine = capsule([-0.02, -0.0488, 0.0975], [0.02, -0.0488, 0.0975], 0.0016);
  const neck = roundCone([0, -0.06, -0.012], [0, -0.17, -0.02], 0.045, 0.054);
  return (x, y, z) => {
    let d = smin(cranium(x, y, z), face(x, y, z), 0.04);
    d = smin(d, jaw(x, y, z), 0.03);
    d = smin(d, chin(x, y, z), 0.02);
    d = smin(d, cheek(x, y, z), 0.02);
    d = smin(d, brow(x, y, z), 0.018);
    d = smax(d, -socket(x, y, z), 0.012);
    d = smin(d, nose(x, y, z), 0.012);
    d = smin(d, wing(x, y, z), 0.008);
    d = smin(d, lipU(x, y, z), 0.006);
    d = smin(d, upperLip(x, y, z), 0.006);
    d = smin(d, lipL(x, y, z), 0.006);
    d = smax(d, -mouthLine(x, y, z), 0.0025);
    d = smin(d, ear(x, y, z), 0.008);
    d = smax(d, -earHole(x, y, z), 0.004);
    d = smin(d, neck(x, y, z), 0.03);
    // eyelids: closed = full lid over the eye; open = upper lid only (eyeball shows below)
    if (eyesClosed) d = smin(d, lid(x, y, z), 0.007);
    else d = smin(d, smax(upperLid(x, y, z), -(y - 0.0115), 0.002), 0.004);
    return d;
  };
};

export const headColor = (eyesClosed: boolean) => (x: number, y: number, z: number): V3 => {
  let c: V3 = SKIN;
  const front = Math.max(0, z / 0.1);
  for (const s of [-1, 1]) c = mix3(c, BLUSH, 0.35 * g2((x - s * 0.042) ** 2 + (y + 0.02) ** 2, 0.022) * front);
  c = mix3(c, LIP, 0.8 * g2(x * x, 0.022) * g2((y + 0.049) ** 2, 0.0075) * (z > 0.08 ? 1 : 0));
  c = mix3(c, SKIN_SHADE, 0.35 * Math.max(0, (-y - 0.08) / 0.08));
  // darker lid crease / lash line on closed eyes
  if (eyesClosed) for (const s of [-1, 1]) c = mix3(c, [0.35, 0.22, 0.18], 0.75 * g2((y - 0.003) ** 2, 0.0016) * g2((x - s * 0.031) ** 2, 0.012) * (z > 0.085 ? 1 : 0));
  // eyebrows painted on the brow ridge
  for (const s of [-1, 1]) {
    const bx = x - s * 0.031, by = y - (0.03 + 0.004 * Math.cos(bx * 60));
    c = mix3(c, [0.17, 0.11, 0.08], 0.9 * g2(by * by, 0.0032) * g2(bx * bx, 0.016) * (z > 0.075 ? 1 : 0));
  }
  return c;
};

export const hairSDF = (): SDF => {
  const shell = ellipsoid([0, 0.022, -0.007], [0.086, 0.1, 0.105]);
  const back = ellipsoid([0, -0.03, -0.062], [0.066, 0.055, 0.048]);
  const part = capsule([0.022, 0.1, 0.07], [0.03, 0.11, -0.04], 0.0022);
  return (x, y, z) => {
    let d = smin(shell(x, y, z), back(x, y, z), 0.025);
    // fringe edge: comes down onto the forehead with an uneven tip line, higher at the temples
    const edge = 0.05 + 0.006 * perlin3(x * 30, 1.3, 0.2) + 0.003 * perlin3(x * 90, 4.1, 0.7) + 0.18 * Math.max(0, Math.abs(x) - 0.045) - 0.06 * Math.max(0, -x);
    if (z > 0.035) d = smax(d, edge - y, 0.004);
    // temples / in front of the ears: hair stops above the ear, tapering down toward the back
    if (Math.abs(x) > 0.045 && z > -0.03 && z <= 0.035) d = smax(d, (0.012 + 0.6 * Math.max(0, z)) - y, 0.006);
    if (Math.abs(x) > 0.06 && z > -0.03) d = smax(d, 0.004 - y, 0.006);
    // nape
    d = smax(d, -0.085 - y, 0.01);
    // side parting
    d = smax(d, -part(x, y, z), 0.003);
    // strands: subtle grooves flowing from the crown + soft clumps
    const a = Math.atan2(x - 0.02, z + 0.03);
    d += 0.0003 * Math.sin(a * 80 + perlin3(x * 30, y * 30, z * 30) * 6) + 0.0022 * perlin3(x * 22, y * 22, z * 22) + 0.0008 * perlin3(x * 70, y * 25, z * 70);
    return d;
  };
};

export const hairColor = (x: number, y: number, z: number): V3 => {
  const a = Math.atan2(x, z + 0.03);
  const s = 0.5 + 0.5 * Math.sin(a * 110 + perlin3(x * 50, y * 50, z * 50) * 2.5);
  return mix3(HAIR_C, [0.27, 0.19, 0.14], 0.1 + 0.25 * s * Math.max(0, (y + 0.02) / 0.12));
};


// ---------------- seated body (origin = seat centre, +z = facing direction) ----------------
export type ArmPoseV4 = {pitch: number; out: number; elbow: number; twist?: number};
export const SHOULDER_Y = 0.53;

const rotX = (p: V3, pivot: V3, a: number): V3 => {
  const y = p[1] - pivot[1], z = p[2] - pivot[2];
  return [p[0], pivot[1] + y * Math.cos(a) - z * Math.sin(a), pivot[2] + y * Math.sin(a) + z * Math.cos(a)];
};
export const PELVIS: V3 = [0, 0.1, 0];
// upper-body points after slump (rotation about the pelvis) and shoulder raise
export const upperPt = (p: V3, slump: number, raise = 0): V3 => rotX([p[0], p[1] + raise, p[2]], PELVIS, 0.1 + slump * 0.16);

export const armJoints = (s: number, a: ArmPoseV4, slump: number, raise: number) => {
  const sh = upperPt([s * 0.168, SHOULDER_Y, -0.005], slump, raise * 0.028);
  const up = 0.27, fo = 0.25;
  const d1: V3 = [Math.sin(a.out) * s, -Math.cos(a.pitch) * Math.cos(a.out), Math.sin(a.pitch) * Math.cos(a.out)];
  const elbow: V3 = [sh[0] + d1[0] * up, sh[1] + d1[1] * up, sh[2] + d1[2] * up];
  const tot = a.pitch + a.elbow;
  let d2: V3 = [Math.sin(a.out * 0.5 + (a.twist ?? 0)) * s * 0.4, -Math.cos(tot), Math.sin(tot)];
  const l = Math.hypot(...d2);
  d2 = [d2[0] / l, d2[1] / l, d2[2] / l];
  const wrist: V3 = [elbow[0] + d2[0] * fo, elbow[1] + d2[1] * fo, elbow[2] + d2[2] * fo];
  return {sh, elbow, wrist, d2};
};

export const torsoSDF = (slump: number, raise: number): {cloth: SDF; pants: SDF; shoe: SDF} => {
  const U = (p: V3) => upperPt(p, slump, 0);
  const pelvis = ellipsoid(PELVIS, [0.158, 0.1, 0.12]);
  const abdomen = ellipsoid(U([0, 0.25, 0.0]), [0.142, 0.12, 0.1]);
  const chest = ellipsoid(U([0, 0.415, 0.006]), [0.162, 0.13, 0.108]);
  const sh = [-1, 1].map((s) => sphere(upperPt([s * 0.165, SHOULDER_Y - 0.005, -0.005], slump, raise * 0.028), 0.058));
  const trap = [-1, 1].map((s) => roundCone(U([0, 0.575, -0.02]), upperPt([s * 0.16, SHOULDER_Y + 0.01, -0.01], slump, raise * 0.028), 0.05, 0.045));
  const collarO = roundCone(U([0, 0.545, -0.012]), U([0, 0.605, -0.018]), 0.064, 0.058);
  const collarI = roundCone(U([0, 0.53, -0.01]), U([0, 0.65, -0.02]), 0.046, 0.046);
  const thighs = [-1, 1].map((s) => roundCone([s * 0.09, 0.085, 0.02], [s * 0.1, 0.1, 0.42], 0.082, 0.062));
  const shins = [-1, 1].map((s) => roundCone([s * 0.1, 0.1, 0.42], [s * 0.1, -0.36, 0.45], 0.056, 0.044));
  const feet = [-1, 1].map((s) => ellipsoid([s * 0.1, -0.42, 0.5], [0.048, 0.04, 0.11]));
  const cloth: SDF = (x, y, z) => {
    let d = smin(pelvis(x, y, z), abdomen(x, y, z), 0.06);
    d = smin(d, chest(x, y, z), 0.06);
    for (const f of sh) d = smin(d, f(x, y, z), 0.04);
    for (const f of trap) d = smin(d, f(x, y, z), 0.03);
    d = smin(d, smax(collarO(x, y, z), -collarI(x, y, z), 0.004), 0.015);
    // knit texture + soft folds at the waist
    d += 0.0022 * perlin3(x * 16, y * 16, z * 16) + 0.0006 * perlin3(x * 60, y * 60, z * 60);
    return d;
  };
  const pants: SDF = (x, y, z) => {
    let d = thighs[0](x, y, z);
    for (const f of [thighs[1], shins[0], shins[1]]) d = smin(d, f(x, y, z), 0.03);
    d = smin(d, ellipsoid([0, 0.07, 0.02], [0.16, 0.085, 0.12])(x, y, z), 0.04);
    return d + 0.0025 * perlin3(x * 25, y * 25, z * 25);
  };
  const shoe: SDF = (x, y, z) => Math.min(feet[0](x, y, z), feet[1](x, y, z));
  return {cloth, pants, shoe};
};

export const armSDF = (s: number, a: ArmPoseV4, slump: number, raise: number): {sleeve: SDF; hand: SDF} => {
  const {sh, elbow, wrist, d2} = armJoints(s, a, slump, raise);
  const upper = roundCone(sh, elbow, 0.054, 0.046);
  const fore = roundCone(elbow, wrist, 0.046, 0.039);
  // hand frame: forward = d2, side = s * x-ish, palm faces down-inward
  const fwd = d2;
  let side: V3 = [-fwd[2], 0, fwd[0]];
  const sl = Math.hypot(...side);
  side = sl < 1e-3 ? [1, 0, 0] : [side[0] / sl, side[1] / sl, side[2] / sl];
  const upv: V3 = [side[1] * fwd[2] - side[2] * fwd[1], side[2] * fwd[0] - side[0] * fwd[2], side[0] * fwd[1] - side[1] * fwd[0]];
  const H = (f: number, si: number, u: number): V3 => [wrist[0] + fwd[0] * f + side[0] * si + upv[0] * u, wrist[1] + fwd[1] * f + side[1] * si + upv[1] * u, wrist[2] + fwd[2] * f + side[2] * si + upv[2] * u];
  const palmA = roundCone(H(0.012, -0.012, 0), H(0.062, -0.016, 0.0), 0.017, 0.015);
  const palmB = roundCone(H(0.012, 0.012, 0), H(0.062, 0.016, 0.0), 0.017, 0.015);
  const palm: SDF = (x, y, z) => smin(palmA(x, y, z), palmB(x, y, z), 0.02);
  const fingers: SDF[] = [];
  for (let k = 0; k < 4; k++) {
    const si = (k - 1.5) * 0.017;
    const len = 0.042 - Math.abs(k - 1.5) * 0.005;
    const b = H(0.078, si, -0.002);
    const m = H(0.078 + len * 0.6, si * 1.05, -0.008);
    const t = H(0.078 + len * 0.95, si * 1.08, -0.02);
    fingers.push(roundCone(b, m, 0.0085, 0.0078), roundCone(m, t, 0.0078, 0.0068));
  }
  const th0 = H(0.03, s * 0.026, -0.006), th1 = H(0.06, s * 0.045, -0.016), th2 = H(0.08, s * 0.05, -0.024);
  fingers.push(roundCone(th0, th1, 0.011, 0.009), roundCone(th1, th2, 0.009, 0.0075));
  const cuffCut = (x: number, y: number, z: number) => (x - wrist[0]) * fwd[0] + (y - wrist[1]) * fwd[1] + (z - wrist[2]) * fwd[2];
  const sleeve: SDF = (x, y, z) => {
    let d = smin(upper(x, y, z), fore(x, y, z), 0.03);
    // sleeve ends at the wrist with a rolled cuff
    d = smax(d, cuffCut(x, y, z) - 0.004, 0.006);
    // fabric folds around the elbow
    const ex = x - elbow[0], ey = y - elbow[1], ez = z - elbow[2];
    d += 0.0035 * Math.sin((ex * fwd[0] + ey * fwd[1] + ez * fwd[2]) * 140) * Math.exp(-(ex * ex + ey * ey + ez * ez) / 0.004) + 0.0015 * perlin3(x * 30, y * 30, z * 30);
    return d;
  };
  const hand: SDF = (x, y, z) => {
    // flatten the palm a little (scale along the up axis)
    let d = palm(x, y, z);
    for (const f of fingers) d = smin(d, f(x, y, z), 0.006);
    const wr = roundCone(H(-0.02, 0, 0), H(0.014, 0, 0), 0.028, 0.026)(x, y, z);
    return smin(d, wr, 0.008);
  };
  return {sleeve, hand};
};

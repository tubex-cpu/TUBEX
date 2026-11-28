import {perlin3} from './noise';
import {SDF, V3, capsule, ellipsoid, roundCone, smax, smin, sphere} from './sdf';

// The friend ("あの人"): original design. Head origin = skull centre, +y up, +z face.
// Expression: smile 0..1, open 0..1 (jaw), lid 0..1 (upper lids lowered, e.g. looking down / forced smile).
export type Expr = {smile: number; open: number; lid: number};

// both sides blended smoothly (no seam on the centre line)
const mirrorX = (f: (sx: number) => SDF, k = 0.004): SDF => {
  const L = f(-1), R = f(1);
  return (x, y, z) => smin(L(x, y, z), R(x, y, z), k);
};
const mix3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const g2 = (d2: number, r: number) => Math.exp(-d2 / (r * r));

export const F_SKIN: V3 = [0.94, 0.78, 0.68];
const BLUSH: V3 = [0.95, 0.62, 0.58];
const LIP: V3 = [0.78, 0.4, 0.4];
export const F_HAIR: V3 = [0.24, 0.15, 0.1];

export const friendHeadSDF = (e: Expr): SDF => {
  const {smile: sm, open: op, lid} = e;
  const jaw = -0.011 * op;
  const cranium = ellipsoid([0, 0.014, -0.006], [0.07, 0.085, 0.09]);
  const face = ellipsoid([0, -0.022, 0.02], [0.055, 0.056, 0.062]);
  const jawL = mirrorX((s) => roundCone([s * 0.047, -0.02, -0.004], [s * 0.015, -0.073 + jaw, 0.054], 0.016, 0.011));
  const chin = ellipsoid([0, -0.07 + jaw, 0.055], [0.017, 0.014, 0.014]);
  const cheek = mirrorX((s) => ellipsoid([s * 0.037, -0.012 + 0.005 * sm, 0.054 + 0.004 * sm], [0.021, 0.017, 0.02]));
  const brow = capsule([-0.034, 0.022, 0.071], [0.034, 0.022, 0.071], 0.0085);
  const nose = roundCone([0, 0.008, 0.083], [0, -0.015, 0.097], 0.0058, 0.0088);
  const wing = mirrorX((s) => sphere([s * 0.0078, -0.0175, 0.09], 0.0045));
  const cornerY = -0.0385 + 0.006 * sm, cornerZ = 0.076 - 0.003 * sm, cornerX = 0.0185 + 0.0035 * sm;
  const lipU = mirrorX((s) => roundCone([0, -0.0355, 0.0845], [s * cornerX, cornerY, cornerZ], 0.0046, 0.0026));
  const lipL = mirrorX((s) => roundCone([0, -0.0455 + jaw, 0.0825 - 0.002 * op], [s * cornerX * 0.92, cornerY - 0.002 + jaw * 0.6, cornerZ], 0.005, 0.0028));
  const mouthLine = mirrorX((s) => capsule([0, -0.0402 + jaw * 0.5, 0.092], [s * (cornerX + 0.002), cornerY - 0.0012 + jaw * 0.3, cornerZ + 0.006], 0.0011 + 0.0045 * op));
  const ear = mirrorX((s) => ellipsoid([s * 0.071, -0.006, -0.004], [0.01, 0.027, 0.018]));
  const socket = mirrorX((s) => ellipsoid([s * 0.03, 0.005, 0.086], [0.0175, 0.0135, 0.011]));
  const upperLid = mirrorX((s) => ellipsoid([s * 0.03, 0.0085 - 0.004 * lid, 0.0765], [0.0152, 0.0098, 0.0118]));
  const lowerLid = mirrorX((s) => ellipsoid([s * 0.03, -0.0055 + 0.003 * sm, 0.0775], [0.0135, 0.0045, 0.0092]));
  const neck = roundCone([0, -0.055, -0.014], [0, -0.17, -0.02], 0.045, 0.052);
  const cutY = 0.0085 - 0.0075 * lid;
  return (x, y, z) => {
    let d = smin(cranium(x, y, z), face(x, y, z), 0.04);
    d = smin(d, jawL(x, y, z), 0.03);
    d = smin(d, chin(x, y, z), 0.02);
    d = smin(d, cheek(x, y, z), 0.022);
    d = smin(d, brow(x, y, z), 0.018);
    d = smax(d, -socket(x, y, z), 0.011);
    d = smin(d, nose(x, y, z), 0.011);
    d = smin(d, wing(x, y, z), 0.007);
    d = smin(d, lipU(x, y, z), 0.006);
    d = smin(d, lipL(x, y, z), 0.006);
    d = smax(d, -mouthLine(x, y, z), 0.0022);
    d = smin(d, ear(x, y, z), 0.008);
    d = smin(d, neck(x, y, z), 0.03);
    d = smin(d, smax(upperLid(x, y, z), -(y - cutY), 0.002), 0.004);
    d = smin(d, smax(lowerLid(x, y, z), y - (-0.0065 + 0.003 * sm), 0.002), 0.003);
    return d;
  };
};

export const friendHeadColor = (e: Expr) => (x: number, y: number, z: number): V3 => {
  let c: V3 = F_SKIN;
  const front = Math.max(0, z / 0.1);
  for (const s of [-1, 1]) c = mix3(c, BLUSH, (0.22 + 0.1 * e.smile) * g2((x - s * 0.046) ** 2 + (y + 0.012) ** 2, 0.016) * front);
  const lipZone = g2(x * x, 0.02) * g2((y + 0.0405 + 0.006 * e.open) ** 2, 0.0062) * (z > 0.077 ? 1 : 0);
  c = mix3(c, LIP, 0.55 * lipZone);
  // mouth interior (only when open, deep in the mouth line)
  // lash line on the upper lid edge + thin arched brows
  const lidEdge = 0.0085 - 0.0075 * e.lid;
  for (const s of [-1, 1]) {
    c = mix3(c, [0.12, 0.08, 0.07], 0.85 * g2((y - lidEdge) ** 2, 0.0012) * g2((x - s * 0.03) ** 2, 0.013) * (z > 0.08 ? 1 : 0));
    c = mix3(c, [0.72, 0.52, 0.45], 0.35 * g2((y - lidEdge - 0.006) ** 2, 0.0012) * g2((x - s * 0.03) ** 2, 0.012) * (z > 0.078 ? 1 : 0));
    const bx = x - s * 0.031, by = y - (0.027 + 0.005 * Math.cos(bx * 70));
    c = mix3(c, [0.26, 0.16, 0.11], 0.85 * g2(by * by, 0.0022) * g2(bx * bx, 0.015) * (z > 0.072 ? 1 : 0));
  }
  return c;
};

// shoulder-length hair with a soft side-swept fringe, framing the face
export const friendHairSDF = (): SDF => {
  const shell = ellipsoid([0, 0.02, -0.008], [0.081, 0.097, 0.1]);
  const backFall = roundCone([0, 0.0, -0.06], [0, -0.17, -0.06], 0.085, 0.08);
  const sides = [-1, 1].map((s) => roundCone([s * 0.062, 0.02, 0.0], [s * 0.075, -0.15, -0.01], 0.032, 0.036));
  const fringe = ellipsoid([0.012, 0.052, 0.074], [0.058, 0.026, 0.026]);
  const faceCut = ellipsoid([0, -0.07, 0.07], [0.057, 0.11, 0.08]);
  const shoulderCut = (y: number) => y + 0.19;
  return (x, y, z) => {
    let d = smin(shell(x, y, z), backFall(x, y, z), 0.04);
    for (const f of sides) d = smin(d, f(x, y, z), 0.03);
    // open the face
    d = smax(d, -faceCut(x, y, z), 0.012);
    if (z > 0.03 && Math.abs(x) < 0.058) d = smax(d, 0.034 - y + 0.22 * x + 0.002 * perlin3(x * 40, 2, 0), 0.008);
    d = smin(d, smax(fringe(x, y, z), 0.03 - y + 0.2 * x, 0.006), 0.012);
    d = smax(d, -shoulderCut(y), 0.02);
    // hollow the inside so hair stays a shell around the head
    d = smax(d, -(shell(x, y, z) + 0.006), 0.004);
    const a = Math.atan2(x, z + 0.02);
    d += 0.0004 * Math.sin(a * 70 + y * 120 + perlin3(x * 30, y * 30, z * 30) * 5) + 0.002 * perlin3(x * 20, y * 20, z * 20);
    return d;
  };
};
export const friendHairColor = (x: number, y: number, z: number): V3 => {
  const a = Math.atan2(x, z + 0.02);
  const s = 0.5 + 0.5 * Math.sin(a * 70 + y * 120 + perlin3(x * 30, y * 30, z * 30) * 5);
  return mix3(F_HAIR, [0.42, 0.28, 0.19], 0.12 + 0.3 * s * Math.max(0, (y + 0.1) / 0.2));
};

// ---- upper body, seated facing +z (origin = seat centre) ----
export const friendTorsoSDF = (): SDF => {
  const chest = ellipsoid([0, 0.4, 0.01], [0.145, 0.12, 0.095]);
  const waist = ellipsoid([0, 0.24, 0.0], [0.125, 0.12, 0.09]);
  const hips = ellipsoid([0, 0.1, 0.0], [0.15, 0.1, 0.11]);
  const sh = [-1, 1].map((s) => sphere([s * 0.15, 0.49, -0.005], 0.052));
  const trap = [-1, 1].map((s) => roundCone([0, 0.545, -0.02], [s * 0.145, 0.505, -0.01], 0.042, 0.04));
  const collarO = roundCone([0, 0.52, -0.012], [0, 0.57, -0.016], 0.058, 0.052);
  const collarI = roundCone([0, 0.5, -0.01], [0, 0.62, -0.02], 0.041, 0.041);
  return (x, y, z) => {
    let d = smin(hips(x, y, z), waist(x, y, z), 0.06);
    d = smin(d, chest(x, y, z), 0.06);
    for (const f of sh) d = smin(d, f(x, y, z), 0.04);
    for (const f of trap) d = smin(d, f(x, y, z), 0.03);
    d = smin(d, smax(collarO(x, y, z), -collarI(x, y, z), 0.004), 0.014);
    // cardigan front opening + knit
    d += 0.0018 * perlin3(x * 18, y * 18, z * 18) + 0.0005 * perlin3(x * 70, y * 70, z * 70);
    return d;
  };
};

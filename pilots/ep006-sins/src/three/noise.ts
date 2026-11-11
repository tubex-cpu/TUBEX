// Deterministic 3D gradient (Perlin) noise for procedural geometry. No Math.random.
const P = new Uint8Array(512);
(() => {
  const p = Array.from({length: 256}, (_, i) => i);
  let s = 1337;
  for (let i = 255; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) P[i] = p[i & 255];
})();
const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const grad = (h: number, x: number, y: number, z: number) => {
  const u = h & 15;
  const a = u < 8 ? x : y;
  const b = u < 4 ? y : u === 12 || u === 14 ? x : z;
  return ((u & 1) === 0 ? a : -a) + ((u & 2) === 0 ? b : -b);
};
export const perlin3 = (x: number, y: number, z: number) => {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
  x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
  const u = fade(x), v = fade(y), w = fade(z);
  const A = P[X] + Y, AA = P[A] + Z, AB = P[A + 1] + Z, B = P[X + 1] + Y, BA = P[B] + Z, BB = P[B + 1] + Z;
  const l = (a: number, b: number, t: number) => a + t * (b - a);
  return l(
    l(l(grad(P[AA], x, y, z), grad(P[BA], x - 1, y, z), u), l(grad(P[AB], x, y - 1, z), grad(P[BB], x - 1, y - 1, z), u), v),
    l(l(grad(P[AA + 1], x, y, z - 1), grad(P[BA + 1], x - 1, y, z - 1), u), l(grad(P[AB + 1], x, y - 1, z - 1), grad(P[BB + 1], x - 1, y - 1, z - 1), u), v),
    w,
  );
};
// ridged multifractal: sharp creases (sulci) between rounded ridges (gyri)
export const ridged = (x: number, y: number, z: number, oct = 3) => {
  let sum = 0, amp = 0.6, f = 1, norm = 0;
  for (let o = 0; o < oct; o++) {
    const n = 1 - Math.abs(perlin3(x * f, y * f, z * f) * 1.6);
    sum += n * n * amp; norm += amp; amp *= 0.45; f *= 2.1;
  }
  return sum / norm;
};
export const fbm = (x: number, y: number, z: number, oct = 3) => {
  let sum = 0, amp = 0.5, f = 1;
  for (let o = 0; o < oct; o++) { sum += perlin3(x * f, y * f, z * f) * amp; amp *= 0.5; f *= 2; }
  return sum;
};
// smooth deterministic wobble for handheld camera / idle motion
export const wobble = (t: number, seed: number) => perlin3(t * 0.35 + seed * 10.1, seed * 3.7, 0.5) ;

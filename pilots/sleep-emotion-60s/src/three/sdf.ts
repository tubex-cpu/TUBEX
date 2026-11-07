import * as THREE from 'three';

// ---- Signed distance primitives (Inigo Quilez formulas) and a surface-nets mesher. ----
export type V3 = [number, number, number];
export type SDF = (x: number, y: number, z: number) => number;

export const smin = (a: number, b: number, k: number) => {
  if (k <= 0) return Math.min(a, b);
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
};
export const smax = (a: number, b: number, k: number) => -smin(-a, -b, k);

export const sphere = (c: V3, r: number): SDF => (x, y, z) => Math.hypot(x - c[0], y - c[1], z - c[2]) - r;

export const ellipsoid = (c: V3, r: V3): SDF => (x, y, z) => {
  const px = (x - c[0]) / r[0], py = (y - c[1]) / r[1], pz = (z - c[2]) / r[2];
  const k0 = Math.hypot(px, py, pz);
  const k1 = Math.hypot(px / r[0], py / r[1], pz / r[2]);
  return k1 === 0 ? -Math.min(r[0], r[1], r[2]) : (k0 * (k0 - 1)) / k1;
};

// round cone between a (radius r1) and b (radius r2)
export const roundCone = (a: V3, b: V3, r1: number, r2: number): SDF => {
  const bax = b[0] - a[0], bay = b[1] - a[1], baz = b[2] - a[2];
  const l2 = bax * bax + bay * bay + baz * baz;
  if (l2 < 1e-12) return sphere(a, Math.max(r1, r2));
  const rr = r1 - r2;
  const a2 = l2 - rr * rr;
  const il2 = 1 / l2;
  return (x, y, z) => {
    const pax = x - a[0], pay = y - a[1], paz = z - a[2];
    const yv = pax * bax + pay * bay + paz * baz;
    const zv = yv - l2;
    const qx = pax * l2 - bax * yv, qy = pay * l2 - bay * yv, qz = paz * l2 - baz * yv;
    const x2 = qx * qx + qy * qy + qz * qz;
    const y2 = yv * yv * l2;
    const z2 = zv * zv * l2;
    const k = Math.sign(rr) * rr * rr * x2;
    if (Math.sign(zv) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - r2;
    if (Math.sign(yv) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - r1;
    return (Math.sqrt(x2 * a2 * il2) + yv * rr) * il2 - r1;
  };
};

export const capsule = (a: V3, b: V3, r: number) => roundCone(a, b, r, r);

// union of parts with one blend radius
export const blend = (parts: SDF[], k: number): SDF => (x, y, z) => {
  let d = parts[0](x, y, z);
  for (let i = 1; i < parts.length; i++) d = smin(d, parts[i](x, y, z), k);
  return d;
};

// ---------- surface nets ----------
export type MeshOpts = {min: V3; max: V3; cell: number; color?: (x: number, y: number, z: number) => V3; refine?: number};

export const meshSDF = (f: SDF, o: MeshOpts) => {
  const {min, max, cell} = o;
  const nx = Math.ceil((max[0] - min[0]) / cell) + 1;
  const ny = Math.ceil((max[1] - min[1]) / cell) + 1;
  const nz = Math.ceil((max[2] - min[2]) / cell) + 1;
  const vals = new Float32Array(nx * ny * nz);
  const id = (i: number, j: number, k: number) => i + nx * (j + ny * k);
  for (let k = 0; k < nz; k++) {
    const z = min[2] + k * cell;
    for (let j = 0; j < ny; j++) {
      const y = min[1] + j * cell;
      for (let i = 0; i < nx; i++) vals[id(i, j, k)] = f(min[0] + i * cell, y, z);
    }
  }
  const cellIdx = new Int32Array((nx - 1) * (ny - 1) * (nz - 1)).fill(-1);
  const cid = (i: number, j: number, k: number) => i + (nx - 1) * (j + (ny - 1) * k);
  const pos: number[] = [];
  const corner = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
  const edges = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
  const cv = new Float32Array(8);
  for (let k = 0; k < nz - 1; k++)
    for (let j = 0; j < ny - 1; j++)
      for (let i = 0; i < nx - 1; i++) {
        let mask = 0;
        for (let c = 0; c < 8; c++) {
          const v = vals[id(i + corner[c][0], j + corner[c][1], k + corner[c][2])];
          cv[c] = v;
          if (v < 0) mask |= 1 << c;
        }
        if (mask === 0 || mask === 255) continue;
        let sx = 0, sy = 0, sz = 0, n = 0;
        for (const [a, b] of edges) {
          const va = cv[a], vb = cv[b];
          if (va < 0 === vb < 0) continue;
          const t = va / (va - vb);
          sx += corner[a][0] + (corner[b][0] - corner[a][0]) * t;
          sy += corner[a][1] + (corner[b][1] - corner[a][1]) * t;
          sz += corner[a][2] + (corner[b][2] - corner[a][2]) * t;
          n++;
        }
        cellIdx[cid(i, j, k)] = pos.length / 3;
        pos.push(min[0] + (i + sx / n) * cell, min[1] + (j + sy / n) * cell, min[2] + (k + sz / n) * cell);
      }
  const idx: number[] = [];
  const quad = (a: number, b: number, c: number, d: number, flip: boolean) => {
    if (a < 0 || b < 0 || c < 0 || d < 0) return;
    if (!flip) idx.push(a, c, b, a, d, c);
    else idx.push(a, b, c, a, c, d);
  };
  for (let k = 1; k < nz - 1; k++)
    for (let j = 1; j < ny - 1; j++)
      for (let i = 0; i < nx - 1; i++) {
        const a = vals[id(i, j, k)] < 0, b = vals[id(i + 1, j, k)] < 0;
        if (a === b) continue;
        quad(cellIdx[cid(i, j - 1, k - 1)], cellIdx[cid(i, j, k - 1)], cellIdx[cid(i, j, k)], cellIdx[cid(i, j - 1, k)], a);
      }
  for (let k = 1; k < nz - 1; k++)
    for (let j = 0; j < ny - 1; j++)
      for (let i = 1; i < nx - 1; i++) {
        const a = vals[id(i, j, k)] < 0, b = vals[id(i, j + 1, k)] < 0;
        if (a === b) continue;
        quad(cellIdx[cid(i - 1, j, k - 1)], cellIdx[cid(i - 1, j, k)], cellIdx[cid(i, j, k)], cellIdx[cid(i, j, k - 1)], a);
      }
  for (let k = 0; k < nz - 1; k++)
    for (let j = 1; j < ny - 1; j++)
      for (let i = 1; i < nx - 1; i++) {
        const a = vals[id(i, j, k)] < 0, b = vals[id(i, j, k + 1)] < 0;
        if (a === b) continue;
        quad(cellIdx[cid(i - 1, j - 1, k)], cellIdx[cid(i, j - 1, k)], cellIdx[cid(i, j, k)], cellIdx[cid(i - 1, j, k)], a);
      }
  // project vertices onto the surface and take normals from the SDF gradient (smooth shading)
  const nrm = new Float32Array(pos.length);
  const e = cell * 0.25;
  const steps = o.refine ?? 2;
  for (let v = 0; v < pos.length; v += 3) {
    let x = pos[v], y = pos[v + 1], z = pos[v + 2];
    let gx = 0, gy = 0, gz = 0;
    for (let s = 0; s <= steps; s++) {
      gx = f(x + e, y, z) - f(x - e, y, z);
      gy = f(x, y + e, z) - f(x, y - e, z);
      gz = f(x, y, z + e) - f(x, y, z - e);
      const gl = Math.hypot(gx, gy, gz) || 1;
      gx /= gl; gy /= gl; gz /= gl;
      if (s < steps) {
        const d = Math.max(-cell, Math.min(cell, f(x, y, z)));
        x -= gx * d; y -= gy * d; z -= gz * d;
      }
    }
    pos[v] = x; pos[v + 1] = y; pos[v + 2] = z;
    nrm[v] = gx; nrm[v + 1] = gy; nrm[v + 2] = gz;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
  if (o.color) {
    const col = new Float32Array(pos.length);
    for (let v = 0; v < pos.length; v += 3) {
      const c = o.color(pos[v], pos[v + 1], pos[v + 2]);
      col[v] = c[0]; col[v + 1] = c[1]; col[v + 2] = c[2];
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  }
  g.setIndex(idx);
  g.computeBoundingSphere();
  return g;
};

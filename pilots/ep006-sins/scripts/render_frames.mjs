// Restart-safe full render: every frame is saved as a JPEG as soon as it is drawn (out/frames/f00000.jpg ...).
// Re-running skips frames that already exist. Usage: node scripts/render_frames.mjs [composition=Full]
import {bundle} from '@remotion/bundler';
import {renderFrames, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const id = process.argv[2] ?? 'Full';
const outDir = path.join(root, 'out/frames');
const tmpDir = path.join(root, 'out/frames_tmp');
fs.mkdirSync(outDir, {recursive: true});
const shell = fs.readdirSync('/opt/pw-browsers').filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => path.join('/opt/pw-browsers', d, 'chrome-headless-shell-linux64/chrome-headless-shell')).find((p) => fs.existsSync(p));
const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public')});
const common = {serveUrl, browserExecutable: shell, chromiumOptions: {gl: process.env.REMOTION_GL ?? 'swangle'}, timeoutInMilliseconds: 180000};
const composition = await selectComposition({...common, id});
const total = composition.durationInFrames;
const name = (i) => path.join(outDir, `f${String(i).padStart(5, '0')}.jpg`);
const STEP = 60;
try {
  for (let a = 0; a < total; a += STEP) {
    const b = Math.min(total - 1, a + STEP - 1);
    const missing = [];
    for (let i = a; i <= b; i++) if (!fs.existsSync(name(i))) missing.push(i);
    if (missing.length === 0) continue;
    const s = missing[0], e = missing[missing.length - 1];
    fs.rmSync(tmpDir, {recursive: true, force: true});
    fs.mkdirSync(tmpDir, {recursive: true});
    const t0 = Date.now();
    await renderFrames({
      ...common, composition, frameRange: [s, e], outputDir: tmpDir, imageFormat: 'jpeg', jpegQuality: 93, concurrency: 1,
      onStart: () => {}, onFrameUpdate: () => {},
      onFrameBuffer: undefined,
    });
    // move each finished frame into place (atomic rename)
    for (const f of fs.readdirSync(tmpDir)) {
      const m = f.match(/(\d+)\.jpe?g$/);
      if (!m) continue;
      const i = Number(m[1]);
      if (i >= s && i <= e) fs.renameSync(path.join(tmpDir, f), name(i));
    }
    const done = fs.readdirSync(outDir).length;
    console.log(`${new Date().toISOString().slice(11, 19)} frames ${s}-${e} (${((Date.now() - t0) / 1000 / (e - s + 1)).toFixed(2)} s/f)  done ${done}/${total} = ${(done / total * 100).toFixed(1)}%`);
  }
  console.log('ALL FRAMES DONE');
} finally {
  fs.rmSync(serveUrl, {recursive: true, force: true});
}

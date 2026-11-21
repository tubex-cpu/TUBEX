// Restart-safe render of the 3D edit in segments (picture + subtitles, no audio): out/<ID>/seg###.mp4
// Usage: node scripts/render_part.mjs <CA|BM> <worker> <workers> [firstFrame] [lastFrame]
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [id, w0, nw0, a0, b0] = process.argv.slice(2);
const SEG = Number(process.env.SEG || 300);
const out = path.join(root, 'out', id);
fs.mkdirSync(out, {recursive: true});
const shell = fs.readdirSync('/opt/pw-browsers').filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => path.join('/opt/pw-browsers', d, 'chrome-headless-shell-linux64/chrome-headless-shell')).find((p) => fs.existsSync(p));
const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public')});
try {
  const common = {serveUrl, browserExecutable: shell, chromiumOptions: {gl: 'swangle'}, timeoutInMilliseconds: 300000};
  const composition = await selectComposition({...common, id});
  const first = Number(a0 ?? 0), last = Math.min(composition.durationInFrames - 1, Number(b0 ?? composition.durationInFrames - 1));
  const w = Number(w0 ?? 0), nw = Number(nw0 ?? 1);
  for (let k = Math.floor(first / SEG); k * SEG <= last; k++) {
    if (k % nw !== w) continue;
    const file = path.join(out, `seg${String(k).padStart(3, '0')}.mp4`);
    if (fs.existsSync(file)) continue;
    const tmp = file.replace('.mp4', '.part.mp4');
    if (fs.existsSync(tmp)) fs.rmSync(tmp);
    const t0 = Date.now();
    await renderMedia({...common, composition, codec: 'h264', crf: 16, muted: true, outputLocation: tmp, concurrency: 1,
      frameRange: [k * SEG, Math.min(composition.durationInFrames - 1, (k + 1) * SEG - 1)]});
    fs.renameSync(tmp, file);
    console.log(`${new Date().toISOString().slice(11, 19)} ${id} seg ${k} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  console.log('DONE');
} finally {
  fs.rmSync(serveUrl, {recursive: true, force: true});
}

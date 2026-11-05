// Restart-safe full render in 1-minute segments (out/seg/seg000.mp4 ...), picture only (no subtitles, no audio).
// Finished segments are skipped on re-run. Usage: node scripts/render_segments.mjs <worker> <workers>  (worker k renders segments k, k+workers, ...)
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SEG = 1800;
const out = path.join(root, 'out/seg');
fs.mkdirSync(out, {recursive: true});
const shell = fs.readdirSync('/opt/pw-browsers').filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => path.join('/opt/pw-browsers', d, 'chrome-headless-shell-linux64/chrome-headless-shell')).find((p) => fs.existsSync(p));
const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public')});
try {
  const common = {serveUrl, browserExecutable: shell, chromiumOptions: {gl: 'swangle'}, timeoutInMilliseconds: 240000};
  const composition = await selectComposition({...common, id: 'FullNoGrain'});
  const n = Math.ceil(composition.durationInFrames / SEG);
  const w = Number(process.argv[2] ?? 0), nw = Number(process.argv[3] ?? 1);
  for (let k = w; k < n; k += nw) {
    const file = path.join(out, `seg${String(k).padStart(3, '0')}.mp4`);
    if (fs.existsSync(file)) continue;
    const tmp = file.replace('.mp4', '.part.mp4');
    if (fs.existsSync(tmp)) fs.rmSync(tmp);
    const t0 = Date.now();
    await renderMedia({...common, composition, codec: 'h264', crf: 14, muted: true, outputLocation: tmp, concurrency: 1,
      frameRange: [k * SEG, Math.min(composition.durationInFrames - 1, (k + 1) * SEG - 1)]});
    fs.renameSync(tmp, file);
    console.log(`${new Date().toISOString().slice(11, 19)} seg ${k}/${n - 1} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  console.log('SEGMENTS DONE');
} finally {
  fs.rmSync(serveUrl, {recursive: true, force: true});
}

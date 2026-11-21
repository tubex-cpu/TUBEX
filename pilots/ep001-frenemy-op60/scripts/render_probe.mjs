// Renders every Nth frame of a composition into out/probe/ (for finding which frames a source change affects).
// Usage: node scripts/render_probe.mjs [N=15] [composition=Full] [from=0] [to=end]
import {bundle} from '@remotion/bundler';
import {renderFrames, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const N = Number(process.argv[2] ?? 15);
const id = process.argv[3] ?? 'Full';
const out = path.join(root, 'out/probe');
fs.mkdirSync(out, {recursive: true});
const shell = fs.readdirSync('/opt/pw-browsers').filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => path.join('/opt/pw-browsers', d, 'chrome-headless-shell-linux64/chrome-headless-shell')).find((p) => fs.existsSync(p));
const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public')});
try {
  const common = {serveUrl, browserExecutable: shell, chromiumOptions: {gl: 'swangle'}, timeoutInMilliseconds: 180000};
  const composition = await selectComposition({...common, id});
  const from = Number(process.argv[4] ?? 0), to = Number(process.argv[5] ?? composition.durationInFrames - 1);
  const CH = 600;
  for (let a = from; a <= to; a += CH) {
    const b = Math.min(to, a + CH - 1);
    let todo = false;
    for (let i = a; i <= b; i++) if (i % N === 0 && !fs.existsSync(path.join(out, `p${String(i).padStart(5, '0')}.jpg`))) todo = true;
    if (!todo) continue;
    const tmp = path.join(root, 'out/probe_tmp');
    fs.rmSync(tmp, {recursive: true, force: true});
    fs.mkdirSync(tmp, {recursive: true});
    const t0 = Date.now();
    await renderFrames({...common, composition, frameRange: [a, b], everyNthFrame: N, outputDir: tmp, imageFormat: 'jpeg', jpegQuality: 93, concurrency: 1,
      onStart: () => {}, onFrameUpdate: () => {}});
    for (const f of fs.readdirSync(tmp)) {
      const m = f.match(/(\d+)\.jpe?g$/);
      if (m) fs.renameSync(path.join(tmp, f), path.join(out, `p${String(Number(m[1])).padStart(5, '0')}.jpg`));
    }
    console.log(`${new Date().toISOString().slice(11, 19)} probe ${a}-${b} ${((Date.now() - t0) / 1000).toFixed(0)}s  files ${fs.readdirSync(out).length}`);
  }
  console.log('PROBE DONE');
} finally {
  fs.rmSync(serveUrl, {recursive: true, force: true});
}

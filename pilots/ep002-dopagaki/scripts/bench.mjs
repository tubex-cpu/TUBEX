// Times renderFrames on short ranges: node scripts/bench.mjs 0 3720 8249 ...  (30 frames each)
import {bundle} from '@remotion/bundler';
import {renderFrames, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const starts = process.argv.slice(2).map(Number);
const shell = fs.readdirSync('/opt/pw-browsers').filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => path.join('/opt/pw-browsers', d, 'chrome-headless-shell-linux64/chrome-headless-shell')).find((p) => fs.existsSync(p));
const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public')});
const tmp = path.join(root, 'out/bench' + (process.env.TAG ?? ''));
try {
  const common = {serveUrl, browserExecutable: shell, chromiumOptions: {gl: 'swangle'}, timeoutInMilliseconds: 240000};
  const composition = await selectComposition({...common, id: process.env.COMP ?? 'Full'});
  for (const s of starts) {
    fs.rmSync(tmp, {recursive: true, force: true}); fs.mkdirSync(tmp, {recursive: true});
    const t0 = Date.now();
    await renderFrames({...common, composition, frameRange: [s, s + 29], outputDir: tmp, imageFormat: 'jpeg', jpegQuality: 90, concurrency: 1, onStart: () => {}, onFrameUpdate: () => {}});
    console.log(`frame ${s}: ${((Date.now() - t0) / 30000).toFixed(2)} s/f`);
  }
} finally {
  fs.rmSync(serveUrl, {recursive: true, force: true});
}

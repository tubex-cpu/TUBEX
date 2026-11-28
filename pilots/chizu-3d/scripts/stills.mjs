// Single frames for checks: node scripts/stills.mjs <CA|BM> <frame,frame,...> [scale]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [id, spec, sc] = process.argv.slice(2);
const out = path.join(root, 'out/stills');
fs.mkdirSync(out, {recursive: true});
const shell = fs.readdirSync('/opt/pw-browsers').filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => path.join('/opt/pw-browsers', d, 'chrome-headless-shell-linux64/chrome-headless-shell')).find((p) => fs.existsSync(p));
const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public')});
try {
  const common = {serveUrl, browserExecutable: shell, chromiumOptions: {gl: 'swangle'}, timeoutInMilliseconds: 240000};
  const composition = await selectComposition({...common, id, inputProps: {}});
  for (const fr of spec.split(',').map(Number)) {
    const t0 = Date.now();
    await renderStill({...common, composition, frame: fr, onBrowserLog: (l) => { if (l.text.includes('MAPTEX')) console.log(l.text); }, imageFormat: 'jpeg', jpegQuality: 85, scale: Number(sc || 0.5), output: path.join(out, `${id}_${String(fr).padStart(5, '0')}.jpg`)});
    console.log(fr, ((Date.now() - t0) / 1000).toFixed(1) + 's');
  }
} finally {
  fs.rmSync(serveUrl, {recursive: true, force: true});
}

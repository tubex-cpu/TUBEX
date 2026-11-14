// Renders only the given subtitle cards (composition SubCards) for a style check: node scripts/render_subs_sample.mjs <outDir> 8 26 117
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [outDir, ...idx] = process.argv.slice(2);
fs.mkdirSync(outDir, {recursive: true});
const shell = fs.readdirSync('/opt/pw-browsers').filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => path.join('/opt/pw-browsers', d, 'chrome-headless-shell-linux64/chrome-headless-shell')).find((p) => fs.existsSync(p));
const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public')});
try {
  const common = {serveUrl, browserExecutable: shell, chromiumOptions: {gl: 'swangle'}};
  const composition = await selectComposition({...common, id: 'SubCards'});
  for (const i of idx) {
    await renderStill({...common, composition, frame: Number(i), imageFormat: 'png', output: path.join(outDir, `n${String(i).padStart(4, '0')}.png`)});
  }
} finally {
  fs.rmSync(serveUrl, {recursive: true, force: true});
}

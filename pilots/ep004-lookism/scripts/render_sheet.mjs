// Renders single frames of a composition into out/sheet/ (for contact-sheet checks). Usage: node scripts/render_sheet.mjs <comp> <frames.json|comma list>
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [id, spec] = process.argv.slice(2);
const frames = spec.endsWith('.json') ? JSON.parse(fs.readFileSync(spec, 'utf8')) : spec.split(',').map(Number);
const out = path.join(root, 'out/sheet');
fs.mkdirSync(out, {recursive: true});
const shell = fs.readdirSync('/opt/pw-browsers').filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse()
  .map((d) => path.join('/opt/pw-browsers', d, 'chrome-headless-shell-linux64/chrome-headless-shell')).find((p) => fs.existsSync(p));
const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public')});
try {
  const common = {serveUrl, browserExecutable: shell, chromiumOptions: {gl: 'swangle'}, timeoutInMilliseconds: 240000};
  const composition = await selectComposition({...common, id});
  for (const fr of frames) {
    await renderStill({...common, composition, frame: fr, imageFormat: 'jpeg', jpegQuality: 80, scale: 0.5, output: path.join(out, `f${String(fr).padStart(5, '0')}.jpg`)});
  }
  console.log('sheet done', frames.length);
} finally {
  fs.rmSync(serveUrl, {recursive: true, force: true});
}

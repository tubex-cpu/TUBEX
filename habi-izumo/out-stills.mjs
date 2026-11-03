import {openBrowser, renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
const [,, bundle, framesFile, outDir, only] = process.argv;
const browser = await openBrowser('chrome', {browserExecutable: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell'});
for (const line of fs.readFileSync(framesFile, 'utf8').trim().split('\n')) {
  const [id, list] = line.split(' ');
  if (only && !only.split(',').includes(id)) continue;
  const composition = await selectComposition({serveUrl: bundle, id, puppeteerInstance: browser});
  for (const [i, f] of list.split(',').entries()) {
    await renderStill({composition, serveUrl: bundle, frame: Number(f), output: `${outDir}/${id}-${String(i).padStart(2,'0')}.jpg`, imageFormat: 'jpeg', jpegQuality: 70, scale: 0.5, puppeteerInstance: browser});
  }
  console.log('done', id);
}
await browser.close({silent: true});

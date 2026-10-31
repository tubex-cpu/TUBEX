// Usage: node render.cjs (requires playwright, sharp and Chromium)
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');
const sharp = require('sharp');
const root = __dirname;
const layouts = [
  {id: 1, lines: [{text:'あなたの理解はどれ？',x:64,y:43,size:110,color:'#f1f8ff'}]},
  {id: 2, lines: [{text:'すれ違いの',x:38,y:232,size:79,color:'#fff4e5'},{text:'正体',x:37,y:337,size:160,color:'#edcaaa'}]},
  {id: 3, lines: [{text:'同じ話なのに',x:43,y:68,size:91,color:'#f4ffff'},{text:'なぜズレる？',x:43,y:182,size:91,color:'#a6eee8'}]},
];
(async()=>{
  const options={headless:true};
  if(process.env.CHROME_PATH) options.executablePath=process.env.CHROME_PATH;
  const browser=await chromium.launch(options);
  const page=await browser.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1});
  const font=fs.readFileSync(path.join(root,'assets/IqRoughGothic-Black.otf')).toString('base64');
  for(const layout of layouts){
    const art=fs.readFileSync(path.join(root,`assets/art_${layout.id}.png`)).toString('base64');
    const text=layout.lines.map(l=>`<div class="copy" style="left:${l.x}px;top:${l.y}px;font-size:${l.size}px;color:${l.color}">${l.text}</div>`).join('');
    const html=`<!doctype html><html lang="ja"><meta charset="utf-8"><style>
    @font-face{font-family:IqRoughGothic;src:url(data:font/otf;base64,${font});font-weight:900}
    *{box-sizing:border-box}html,body{margin:0;width:1280px;height:720px;overflow:hidden;background:#05080e}
    img{position:absolute;width:1280px;height:720px;object-fit:cover}
    .copy{position:absolute;white-space:nowrap;font-family:IqRoughGothic;font-weight:900;line-height:1.28;letter-spacing:-2px;-webkit-text-stroke:13px #03060d;paint-order:stroke fill;text-shadow:0 7px 0 #020308,0 12px 17px #000,0 0 22px #91c7d740}
    </style><img src="data:image/png;base64,${art}">${text}</html>`;
    await page.setContent(html);
    await page.evaluate(()=>document.fonts.ready);
    await page.locator('img').evaluate(img=>img.decode());
    const bounds=await page.locator('.copy').evaluateAll(nodes=>nodes.map(n=>({text:n.textContent,x:n.offsetLeft,y:n.offsetTop,width:n.offsetWidth,height:n.offsetHeight})));
    for(const b of bounds) if(b.x<0||b.y<0||b.x+b.width>1280||b.y+b.height>720) throw new Error('Text exceeds canvas '+JSON.stringify(b));
    await page.screenshot({path:path.join(root,`rough_${layout.id}.png`)});
    await sharp(path.join(root,`rough_${layout.id}.png`)).resize(320,180).png().toFile(path.join(root,`rough_${layout.id}_320.png`));
    console.log(JSON.stringify({id:layout.id,characters:layout.lines.map(l=>l.text).join('').length,bounds}));
  }
  await browser.close();
  await sharp({create:{width:960,height:180,channels:3,background:'#080b12'}}).composite(await Promise.all([1,2,3].map(async(i)=>({input:await fs.promises.readFile(path.join(root,`rough_${i}_320.png`)),left:(i-1)*320,top:0})))).png().toFile(path.join(root,'comparison_320.png'));
})();

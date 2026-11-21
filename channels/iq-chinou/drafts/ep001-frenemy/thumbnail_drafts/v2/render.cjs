const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
const sharp=require('sharp');
const root=__dirname;
const layouts=[
 {lines:[{text:'あなたの友達は？',x:35,y:82,size:85,color:'#ffffff'},{text:'〇〇よく言うなら',x:35,y:369,size:80,color:'#ffffff'},{text:'９９％フレネミー',x:35,y:537,size:145,color:'#ff292e'}]},
 {lines:[{text:'そいつフレネミーじゃね？',x:32,y:22,size:96,color:'#ffffff'},{text:'横にいるだけで',x:28,y:361,size:76,color:'#ffdc9a'},{text:'人生狂います',x:35,y:535,size:164,color:'#fff1d6',html:'人生<span style="color:#ffb72d">狂います</span>'}]},
 {lines:[{text:'９割が',x:35,y:62,size:145,color:'#e7c8ff'},{text:'騙される',x:35,y:227,size:110,color:'#ffffff'},{text:'フレネミーの正体',x:35,y:550,size:145,color:'#ffffff',html:'フレネミー<span style="color:#db9bff">の正体</span>'}]},
];
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const page=await browser.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1});
 const font=fs.readFileSync(path.join(root,'../assets/ShipporiMinchoB1-ExtraBold.woff2')).toString('base64');
 for(const [idx,l] of layouts.entries()){
  const art=fs.readFileSync(path.join(root,`assets/art_${idx+1}.png`)).toString('base64');
  const copy=l.lines.map(t=>`<div class="copy" style="left:${t.x}px;top:${t.y}px;font-size:${t.size}px;color:${t.color}">${t.html||t.text}</div>`).join('');
  await page.setContent(`<!doctype html><html lang="ja"><meta charset="utf-8"><style>@font-face{font-family:Title;src:url(data:font/woff2;base64,${font});font-weight:800}html,body{margin:0;width:1280px;height:720px;overflow:hidden}img{position:absolute;width:1280px;height:720px;object-fit:cover}.copy{position:absolute;font-family:Title;font-weight:800;line-height:1.03;letter-spacing:-3px;white-space:nowrap;paint-order:stroke fill;-webkit-text-stroke:3px #090606;text-shadow:0 4px 5px #000,0 0 22px #000}</style><img src="data:image/png;base64,${art}"><div style="position:absolute;inset:0;background:linear-gradient(0deg,#000e 0%,#0008 16%,transparent 37%)"></div>${copy}</html>`);
  await page.evaluate(()=>document.fonts.ready);
  await page.locator('img').evaluate(img=>img.decode());
  const bounds=await page.locator('.copy').evaluateAll(ns=>ns.map(n=>({text:n.textContent,x:n.offsetLeft,y:n.offsetTop,w:n.offsetWidth,h:n.offsetHeight})));
  for(const b of bounds)if(b.x<0||b.y<0||b.x+b.w>1280||b.y+b.h>720)throw new Error(JSON.stringify(b));
  await page.screenshot({path:path.join(root,`rough_${idx+1}.png`)});
  await sharp(path.join(root,`rough_${idx+1}.png`)).resize(320,180).png().toFile(path.join(root,`rough_${idx+1}_320.png`));
  console.log(JSON.stringify({id:idx+1,characters:l.lines.map(t=>t.text).join('').length,bounds}));
 }
 await browser.close();
 await sharp({create:{width:960,height:180,channels:3,background:'#112333'}}).composite(await Promise.all([1,2,3].map(async(i)=>({input:await fs.promises.readFile(path.join(root,`rough_${i}_320.png`)),left:(i-1)*320,top:0})))).png().toFile(path.join(root,'comparison_320.png'));
})();

const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
const sharp=require('sharp');
const root=__dirname, cream='#f1eee4', ink='#111111', red='#cb2032';
const profile='M 0 250 L 0 174 C -39 152 -55 117 -52 75 C -49 22 -10 -5 37 0 C 81 4 109 34 109 76 L 131 110 Q 133 117 116 121 L 111 142 Q 108 160 81 159 L 72 201 L 95 250 Z';
const face=(x,y,scale,flip,color)=>`<path d="${profile}" transform="translate(${x} ${y}) scale(${scale*(flip?-1:1)} ${scale})" fill="${color}"/>`;
const bubble=(x,y,w,h,color,tail='left')=>`<path d="M${x+22},${y} H${x+w-22} Q${x+w},${y} ${x+w},${y+22} V${y+h-22} Q${x+w},${y+h} ${x+w-22},${y+h} H${x+(tail==='left'?48:w-65)} L${x+(tail==='left'?13:w-15)},${y+h+35} L${x+(tail==='left'?24:w-31)},${y+h} H${x+22} Q${x},${y+h} ${x},${y+h-22} V${y+22} Q${x},${y} ${x+22},${y} Z" fill="${color}"/>`;
const wrap=(bg,body,defs='')=>`<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><defs>${defs}</defs><rect width="1280" height="720" fill="${bg}"/>${body}</svg>`;
const a=wrap('#090909',
 face(170,60,1.05,false,cream)+face(1110,60,1.05,true,cream)+
 bubble(347,76,235,142,cream)+bubble(698,76,235,142,cream,'right')+
 `<circle cx="464" cy="147" r="36" fill="${ink}"/><path d="M816 109 L854 183 H778 Z" fill="${ink}"/>
 <path d="M595 130 L620 156 L605 176 M680 130 L655 156 L670 176" fill="none" stroke="${red}" stroke-width="10" stroke-linecap="square"/>`);
const b=wrap(cream,
 [260,640,1020].map((x,i)=>{
 const shape=i===0?`<circle cx="${x}" cy="191" r="28" fill="${red}"/>`:i===1?`<rect x="${x-26}" y="165" width="52" height="52" fill="${red}"/>`:`<path d="M${x},160 L${x+31},216 H${x-31}Z" fill="${red}"/>`;
 return `<circle cx="${x}" cy="318" r="58" fill="${ink}"/><path d="M${x-98} 451 Q${x-95} 379 ${x-42} 376 H${x+42} Q${x+95} 379 ${x+98} 451Z" fill="${ink}"/>
 <rect x="${x-92}" y="124" width="184" height="128" rx="18" fill="none" stroke="${ink}" stroke-width="5"/><path d="M${x-10} 252 L${x} 270 L${x+10} 252" fill="${ink}"/>${shape}`;
 }).join(''));
const mascot=`<g transform="translate(963 414)">
 <g fill="url(#bodyShade)">
 <ellipse cx="-36" cy="180" rx="26" ry="39"/><ellipse cx="36" cy="180" rx="26" ry="39"/>
 <path d="M-25 38 C-68 58 -88 109 -67 145 C-46 176 45 177 67 145 C88 109 68 58 25 38Z"/>
 <rect x="-99" y="63" width="37" height="91" rx="18" transform="rotate(18 -82 77)"/>
 <rect x="67" y="58" width="37" height="91" rx="18" transform="rotate(-33 84 76)"/>
 <ellipse cx="-76" cy="-161" rx="21" ry="25" transform="rotate(-25 -76 -161)"/>
 <ellipse cx="76" cy="-161" rx="21" ry="25" transform="rotate(25 76 -161)"/>
 <ellipse cx="0" cy="-75" rx="126" ry="120"/>
 </g></g>`;
const c=wrap('#171717',
 `<defs><mask id="mascotClip">${mascot.replace('fill="url(#bodyShade)"','fill="white"')}</mask></defs>`+
 mascot+`<g mask="url(#mascotClip)"><rect x="800" y="200" width="330" height="450" filter="url(#crt)" opacity=".72"/></g>`+
 bubble(700,50,150,107,cream)+bubble(1070,125,150,107,cream,'right')+
 `<circle cx="775" cy="103" r="25" fill="${ink}"/><path d="M1145 151 L1174 205 H1116Z" fill="${ink}"/>`,
 `<radialGradient id="bodyShade" cx="35%" cy="25%" r="80%"><stop stop-color="#eee"/><stop offset=".7" stop-color="#999"/><stop offset="1" stop-color="#555"/></radialGradient>
 <filter id="crt"><feTurbulence type="fractalNoise" baseFrequency=".45 .7" numOctaves="1" seed="31"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="discrete" tableValues="0 0 .1 .6 1 1"/><feFuncG type="discrete" tableValues="0 0 .1 .6 1 1"/><feFuncB type="discrete" tableValues="0 0 .1 .6 1 1"/></feComponentTransfer></filter>`);
const layouts=[
 {art:a,lines:[{text:'同じ言葉なのに',x:355,y:341,size:76,color:cream},{text:'通じない',x:180,y:432,size:230,color:cream,html:`<span style="color:${red}">通じ</span>ない`}]},
 {art:b,lines:[{text:'どこで起きる？',x:352,y:12,size:78,color:ink},{text:'理解のズレ',x:152,y:465,size:190,color:ink,html:`理解の<span style="color:${red}">ズレ</span>`}]},
 {art:c,lines:[{text:'会話の',x:62,y:138,size:175,color:cream},{text:'断絶',x:65,y:339,size:260,color:red}]},
];
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const page=await browser.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1});
 const font=fs.readFileSync(path.join(root,'assets/ShipporiMinchoB1-ExtraBold.woff2')).toString('base64');
 for(const [idx,l] of layouts.entries()){
  fs.writeFileSync(path.join(root,`assets/art_${idx+1}.svg`),l.art);
  const copy=l.lines.map(t=>`<div class="copy" style="left:${t.x}px;top:${t.y}px;font-size:${t.size}px;color:${t.color}">${t.html||t.text}</div>`).join('');
  await page.setContent(`<!doctype html><html lang="ja"><meta charset="utf-8"><style>@font-face{font-family:Title;src:url(data:font/woff2;base64,${font});font-weight:800}html,body{margin:0;width:1280px;height:720px;overflow:hidden}.copy{position:absolute;font-family:Title;font-weight:800;line-height:1.03;letter-spacing:-3px;white-space:nowrap}svg{position:absolute;inset:0}</style>${l.art}${copy}</html>`);
  await page.evaluate(()=>document.fonts.ready);
  const bounds=await page.locator('.copy').evaluateAll(ns=>ns.map(n=>({text:n.textContent,x:n.offsetLeft,y:n.offsetTop,w:n.offsetWidth,h:n.offsetHeight})));
  for(const b of bounds)if(b.x<0||b.y<0||b.x+b.w>1280||b.y+b.h>720)throw new Error(JSON.stringify(b));
  await page.screenshot({path:path.join(root,`rough_${idx+1}.png`)});
  await sharp(path.join(root,`rough_${idx+1}.png`)).resize(320,180).png().toFile(path.join(root,`rough_${idx+1}_320.png`));
  console.log(JSON.stringify({id:idx+1,characters:l.lines.map(t=>t.text).join('').length,bounds}));
 }
 await browser.close();
 await sharp({create:{width:960,height:180,channels:3,background:ink}}).composite(await Promise.all([1,2,3].map(async(i)=>({input:await fs.promises.readFile(path.join(root,`rough_${i}_320.png`)),left:(i-1)*320,top:0})))).png().toFile(path.join(root,'comparison_320.png'));
})();

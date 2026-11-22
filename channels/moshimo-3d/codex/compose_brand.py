"""Typeset original renders with SIL OFL Noto Sans JP. No external images."""
from PIL import Image,ImageDraw,ImageFont,ImageFilter
from pathlib import Path
import numpy as np
R=Path(__file__).resolve().parent
def sky(w,h):
 y=np.linspace(0,1,h)[:,None,None];a=np.array([211,100,51]);b=np.array([255,210,137]);rgb=a[None,None,:]*(1-y)+b[None,None,:]*y
 return Image.fromarray(np.repeat(rgb,w,axis=1).astype('uint8'),'RGB').convert('RGBA')
def font(sz):return ImageFont.truetype(str(R/'NotoSansJP-Black.ttf'),sz)
icon=sky(800,800);d=ImageDraw.Draw(icon);d.ellipse((455,85,675,305),fill='#ffdc93')
art=Image.open(R/'icon_scene.png').convert('RGBA').resize((800,800),Image.Resampling.LANCZOS);icon.alpha_composite(art);icon.convert('RGB').save(R/'icon_800.png')
banner=sky(2560,1440);d=ImageDraw.Draw(banner);d.ellipse((1650,130,2100,580),fill='#ffdb96')
town=Image.open(R/'banner_scene.png').convert('RGBA')
alpha=np.asarray(town.getchannel('A')).astype(float)
fade=np.clip(np.arange(town.height)/650,0,1);fade=fade*fade*(3-2*fade)
town.putalpha(Image.fromarray((alpha*fade[:,None]).astype('uint8')))
# Place the miniature town on the bottom half, leaving a quiet sunset behind the name.
banner.alpha_composite(town,(0,445))
shadow=Image.new('RGBA',banner.size);sd=ImageDraw.Draw(shadow);sd.rounded_rectangle((847,612,2005,827),radius=22,fill=(38,38,29,100));shadow=shadow.filter(ImageFilter.GaussianBlur(20));banner.alpha_composite(shadow)
d=ImageDraw.Draw(banner);d.rounded_rectangle((839,589,1987,799),radius=18,fill='#bb7c12');d.rounded_rectangle((830,575,1978,785),radius=18,fill='#ffcf38');d.line((850,586,1956,586),fill='#ffe98d',width=3)
for x in [851,1957]:d.ellipse((x-5,674,x+5,684),fill='#bc8a23')
headline='もしも、そのあと。';f=font(109);bb=d.textbbox((0,0),headline,font=f);tw=bb[2]-bb[0];d.text((1404-tw/2,615-bb[1]),headline,font=f,fill='#17363a')
tag='ひとつ変わると、暮らしはどうなる？';f=font(46);bb=d.textbbox((0,0),tag,font=f);tw=bb[2]-bb[0]
d.rounded_rectangle((1404-tw/2-25,810,1404+tw/2+25,887),radius=12,fill='#fff1d3')
d.text((1404-tw/2,825-bb[1]),tag,font=f,fill='#213e3f',stroke_width=0)
badge=Image.open(R/'icon_scene.png').convert('RGBA').resize((430,430),Image.Resampling.LANCZOS);banner.alpha_composite(badge,(481,503))
banner.convert('RGB').save(R/'banner_2560x1440.png')
banner.crop((507,509,2053,932)).convert('RGB').save(R/'banner_mobile_safe.png')
proof=banner.copy();d=ImageDraw.Draw(proof);d.rectangle((507,509,2053,932),outline='#ffffff',width=4);proof.convert('RGB').resize((1280,720),Image.Resampling.LANCZOS).save(R/'banner_safe_guide.png')
icon.convert('RGB').resize((320,320),Image.Resampling.LANCZOS).save(R/'icon_320.png')
mask=Image.new('L',(800,800));ImageDraw.Draw(mask).ellipse((0,0,799,799),fill=255);circ=Image.new('RGBA',(800,800));circ.paste(icon,(0,0),mask);circ.resize((98,98),Image.Resampling.LANCZOS).save(R/'icon_circle_98.png');circ.resize((48,48),Image.Resampling.LANCZOS).save(R/'icon_circle_48.png')
banner.crop((507,509,2053,932)).convert('RGB').resize((320,88),Image.Resampling.LANCZOS).save(R/'banner_mobile_320.png')

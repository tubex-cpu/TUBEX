"""許可済み写真と既存フォントだけで再生成。python3 create_thumbnails.py"""
from pathlib import Path
from PIL import Image, ImageOps, ImageEnhance, ImageDraw, ImageFont
from fontTools.ttLib import TTFont
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(__file__).resolve().parent
S=2
W,H=1280,720
FONT=OUT/'fonts/ZenKakuGothicNew-Black.ttf'
CMAP=TTFont(FONT).getBestCmap()

def photo(name, brightness=1):
    im=Image.open(ROOT/'public/photos'/name).convert('RGB')
    im=ImageOps.fit(im,(W*S,H*S),centering=(.5,.56))
    return ImageEnhance.Brightness(im).enhance(brightness).convert('RGBA')

def shade(im, top=.68, bottom=.87):
    layer=Image.new('RGBA', im.size)
    d=ImageDraw.Draw(layer)
    for y in range(H*S):
        p=y/(H*S)
        a=top*max(0,1-p/.36)+bottom*max(0,(p-.55)/.45)
        d.line((0,y,W*S,y),fill=(2,6,10,int(a*255)))
    return Image.alpha_composite(im,layer)

def text(im,txt,x,y,size,color='white',maxw=1180,stroke=6):
    assert all(ord(c) in CMAP or c.isspace() for c in txt), f'フォント未収録: {txt}'
    d=ImageDraw.Draw(im)
    f=ImageFont.truetype(str(FONT),size*S)
    while d.textbbox((0,0),txt,font=f)[2]+stroke*S*2>maxw*S:
        size-=1; f=ImageFont.truetype(str(FONT),size*S)
    box=d.textbbox((0,0),txt,font=f)
    pos=(x*S,y*S-box[1])
    d.text((pos[0]+3*S,pos[1]+5*S),txt,font=f,fill='#000000',stroke_width=(stroke+2)*S,stroke_fill='#000000')
    d.text(pos,txt,font=f,fill=color,stroke_width=stroke*S,stroke_fill='#030507')
    assert x*S+box[2]+stroke*S < W*S
    assert y*S+(box[3]-box[1])+stroke*S < H*S

def badge(im,txt,x,y,w):
    d=ImageDraw.Draw(im)
    d.rectangle((x*S,y*S,(x+w)*S,(y+62)*S),fill='#ac171c')
    text(im,txt,x+14,y+12,34,maxw=w-26,stroke=1)

def save(im,n):
    im.convert('RGB').resize((W,H),Image.Resampling.LANCZOS).save(OUT/f'thumbnail-{n}.jpg',quality=95,subsampling=0,optimize=True)

im=shade(photo('mp-clouds-unsplash.jpg',.91))
text(im,'マチュピチュ',44,36,121,maxw=870,stroke=7)
badge(im,'2026年 調査',949,48,283)
text(im,'日本のレーザー調査',46,449,62,stroke=5)
text(im,'密林の下に何が？',38,544,142,'#ff343c',maxw=1170,stroke=8)
save(im,1)

im=photo('old-mp-1912.jpg',.8)
p=Image.open(ROOT/'public/photos/bingham-portrait.jpg').convert('RGB')
p=ImageOps.fit(p,(452*S,720*S),centering=(.5,.25)).convert('RGBA')
im.alpha_composite(p,(828*S,0))
layer=Image.new('RGBA',im.size)
d=ImageDraw.Draw(layer)
for x in range(W*S):
    a=.55 if x<760*S else max(0,.55*(1-(x/S-760)/130))
    d.line((x,0,x,H*S),fill=(0,0,0,int(a*255)))
im=Image.alpha_composite(im,layer)
text(im,'マチュピチュ',38,40,117,maxw=760,stroke=7)
text(im,'壁に「1902年」の名',44,212,44,maxw=740,stroke=4)
text(im,'先に住人がいたのに',42,449,55,maxw=755,stroke=5)
text(im,'誰が「発見」？',33,544,111,'#ff343c',maxw=766,stroke=7)
save(im,2)

im=shade(photo('mp-misty-unsplash.jpg',.76),.69,.93)
text(im,'マチュピチュ',44,36,121,maxw=1000,stroke=7)
text(im,'遺伝子で確認された血縁',45,443,57,stroke=5)
text(im,'なぜ１組だけ？',40,535,146,'#ff343c',maxw=1160,stroke=8)
text(im,'2023年研究｜解析対象内で確認された近い血縁',45,680,22,maxw=1100,stroke=1)
save(im,3)
for i in range(1,4):
    p=OUT/f'thumbnail-{i}.jpg'
    with Image.open(p) as im:
        assert im.size==(1280,720) and im.format=='JPEG'
    assert p.stat().st_size<2_000_000
    print(p.name,p.stat().st_size)

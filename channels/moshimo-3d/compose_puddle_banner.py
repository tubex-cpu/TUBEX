# バナー（水たまり案）の組み直し：ChatGPT の画像（太陽と水たまりの月の版 puddle.webp、何もない背景 empty.webp）から、太陽・水たまりを取り出して 2560×1440 のスマホの帯に収め、文字（M PLUS Rounded 1c Black、OFL）を入れる。作業場所 /home/user/work_neko/brand/ で実行。画像は git に入れない。
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import numpy as np
SRC=Image.open('puddle.webp').convert('RGB'); BG=Image.open('empty.webp').convert('RGB')
w0,h0=SRC.size; A=np.asarray(SRC).astype(int)
water=((A[:,:,2]>A[:,:,0]+30)&(A.sum(axis=2)<300)); water[:555]=False; water[760:]=False; water[:,:600]=False; water[:,1600:]=False
m=Image.fromarray((water*255).astype('uint8')).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MaxFilter(41)).filter(ImageFilter.GaussianBlur(9))
x0,x1,y0,y1=671-45,1520+45,574-22,715+30
pud=SRC.crop((x0,y0,x1,y1)); pm=m.crop((x0,y0,x1,y1))
scx,scy,R=1098,442,105
sun=SRC.crop((scx-R,scy-R,scx+R,scy+R)); sm=Image.new('L',sun.size,0); ImageDraw.Draw(sm).ellipse((10,10,2*R-11,2*R-11),fill=255); sm=sm.filter(ImageFilter.GaussianBlur(25))
W,H=2560,1440; k=W/w0
target=int(H*0.47)
sky=BG.crop((0,0,w0,553)).resize((W,target),Image.LANCZOS)
gnd=BG.crop((0,553,w0,h0)).resize((W,H-target),Image.LANCZOS)
canvas=Image.new('RGB',(W,H)); canvas.paste(sky,(0,0)); canvas.paste(gnd,(0,target))
bx0,bx1=(W-1546)//2,(W+1546)//2; by0,by1=(H-423)//2,(H+423)//2
area_l, area_r = bx0+830, bx1-40
pk=min((area_r-area_l)/pud.width, (by1-14-(target+6))/pud.height)
pud2=pud.resize((int(pud.width*pk),int(pud.height*pk)),Image.LANCZOS); pm2=pm.resize(pud2.size,Image.LANCZOS)
px=(area_l+area_r)//2-pud2.width//2; py=target+6
canvas.paste(pud2,(px,py),pm2)
# 太陽は光の玉として描く（切り抜くと四角い跡が出るため）
cx=px+pud2.width//2; cy=target-110
yy,xx=np.mgrid[0:H,0:W]; r=np.sqrt((xx-cx)**2+(yy-cy)**2)
glow=np.clip(1.0-r/36,0,1)**0.5+0.35*np.exp(-(r/70)**2)+0.12*np.exp(-(r/170)**2)
ang=np.arctan2(yy-cy,xx-cx); rays=0.10*np.exp(-(r/120)**2)*(0.5+0.5*np.cos(ang*12))
g=np.clip(glow+rays,0,1.4)[...,None]
C=np.asarray(canvas).astype(float); C=C+g*np.array([255,250,235])*0.75; C=np.clip(C,0,255)
canvas=Image.fromarray(C.astype('uint8'))
import os, sys
F=os.environ.get('BANNER_FONT','/home/user/work_neko/fonts/MPLUSRounded1c-Black-merged.ttf'); TAG=os.environ.get('BANNER_TAG','')
def draw(base,text,size,x,y,sw,maxw=None):
    f=ImageFont.truetype(F,size); l,t,r,b=f.getbbox(text)
    while maxw and r-l>maxw and size>20:
        size-=2; f=ImageFont.truetype(F,size); l,t,r,b=f.getbbox(text)
    sw=max(4,int(size*sw/140)) if sw>8 else max(3,int(size*sw/58))
    sh=Image.new('RGBA',(W,H),(0,0,0,0)); ImageDraw.Draw(sh).text((x-l+6,y-t+9),text,font=f,fill=(0,0,0,170),stroke_width=sw,stroke_fill=(0,0,0,170))
    base.alpha_composite(sh.filter(ImageFilter.GaussianBlur(5)))
    ImageDraw.Draw(base).text((x-l,y-t),text,font=f,fill=(255,255,255,255),stroke_width=sw,stroke_fill=(16,16,16,255))
    return r-l,b-t
base=canvas.convert('RGBA'); tx=bx0+40
w1,h1=draw(base,'世界をズラす',170,tx,by0+95,12,maxw=740)
w2,h2=draw(base,'いつもの世界。何かが違う。',70,tx+4,by0+95+h1+30,7,maxw=w1)
print('text right',tx+max(w1,w2),'puddle',px,px+pud2.width,py,py+pud2.height,'band',bx0,bx1,by0,by1)
out=base.convert('RGB'); out.save(f'banner_puddle_2560{TAG}.png')
out.crop((bx0,by0,bx1,by1)).save(f'banner_puddle_safe{TAG}.png')
out.resize((1280,720),Image.LANCZOS).save(f'banner_puddle_preview{TAG}.png')

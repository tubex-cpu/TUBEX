import json,re
N=json.load(open('onryo_new.json')); H=json.load(open('onryo_blocks.json'))
K=lambda p:[x for x in H if x.startswith(p)][0]
json.dump(H,open('onryo_blocks.json','w'),ensure_ascii=False)
order=[('H','謎の先出し'),('H','ハビ判事登場'),('C','第1の'),('C','第2の'),('N','秀郷'),('C','第3の'),('C','第4の'),('C','第5の'),('C','第6の'),('N','処罰'),('C','第7の'),('N','成田山'),('C','第8の'),('N','無実'),('C','第9の'),('C','第10の'),('N','絵巻'),('C','第11の'),('N','牛'),('C','第12の'),('N','叔父子'),('N','保元'),('C','第13の'),('N','殺害'),('N','西行'),('N','天狗'),('C','第14の'),('C','第15の'),('C','第16の'),('C','第17の'),('C','第18の'),('N','御霊'),('N','祇園'),('H','本当の物語'),('H','まだ解けていない謎'),('H','まとめ'),('H','締め')]
out=[];n=0;v=[]
for kind,key in order:
    if kind=='N': t,body=N[key]; n+=1; blk=f'0:00 第{n}の手がかり {t}\n{body}'
    elif kind=='C': k=K(key); t=k.split(' ',1)[1]; n+=1; blk=f'0:00 第{n}の手がかり {t}\n{H[k]}'
    else: k=K(key); blk=f'0:00 {k}\n{H[k]}'
    out.append(blk.rstrip('\n'))
    if kind!='H': v.append(re.search(r'この手がかりの判決。\n(.+?)\n',blk).group(1))
s='\n'.join(out)+'\n'
open('/home/user/TUBEX/habi-onryo/scripts/script.txt','w').write(s)
m=[l.rsplit('。',2)[-2] for l in H[K('まとめ')].split('\n')[1:-3]]
print(n,len(s.replace('\n','')), [ (a,b) for a,b in zip(v,[x+'。' for x in m]) if a!=b])

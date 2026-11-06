"""Five diagrams for 'How to Fix Slow DNS Lookup'. Each is designed for one sentence it must teach; wide (desktop) and tall (phone) are drawn separately for the same concept."""
from svgkit import *
A='var(--color-accent-primary,#0ea5e9)'
def rb(x,y,w,h,lines,acc=False,sz=12,wt=700):
    r=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{A if acc else "currentColor"}" fill-opacity="{0.16 if acc else 0.06}" stroke="{A if acc else "currentColor"}" stroke-opacity="{0.9 if acc else 0.35}"/>'
    n=len(lines); lh=sz*1.3; ty=y+h/2-(n-1)*lh/2+sz*0.35
    return r+''.join(f'<text x="{x+w/2}" y="{ty+i*lh:.1f}" text-anchor="middle" font-size="{sz}" font-weight="{wt if i==0 else 400}" fill="currentColor" fill-opacity="{1 if i==0 else 0.8}">{t}</text>' for i,t in enumerate(lines))
def mt(x,y,lines,sz=12,anchor='middle',op=0.85,wt=400):
    return ''.join(f'<text x="{x}" y="{y+i*sz*1.3:.1f}" text-anchor="{anchor}" font-size="{sz}" font-weight="{wt}" fill="currentColor" fill-opacity="{op}">{t}</text>' for i,t in enumerate(lines))
def mk(vb,body,label,tall=False):
    s=svg(vb,body,label)
    return s.replace('<svg ','<svg class="d-m" ',1).replace('id="ah','id="mah').replace('url(#ah','url(#mah') if tall else s
# ---------- 1. the lookup: resolver does the legwork
def seq_wide():
    xs=[60,190,320,450,580]; nm=['Device','Resolver','Root server','.com server','Name server']; s=DEFS
    for x,n in zip(xs,nm): s+=rb(x-52,6,104,32,[n],acc=(n=='Resolver'))+f'<line x1="{x}" y1="38" x2="{x}" y2="300" stroke="currentColor" stroke-opacity="0.25" stroke-dasharray="4 4"/>'
    s+=f'<rect x="176" y="92" width="438" height="164" rx="8" fill="{A}" fill-opacity="0.07" stroke="{A}" stroke-opacity="0.5" stroke-dasharray="5 4"/>'+mt(606,108,['Only on a cache miss'],11,'end',0.9,700)
    def m(x1,x2,y,t,d=False): return ln(x1,y,x2,y,d)+tx((x1+x2)/2,y-6,t,11)
    s+=m(60,190,66,'1  Where is example.com?')+m(190,320,124,'2  Who runs .com?')+m(320,190,140,'ask the .com servers',True)
    s+=m(190,450,178,'3  Where is example.com?')+m(450,190,194,'ask its name servers',True)+m(190,580,232,'4  Where is example.com?')+m(580,190,248,'192.0.2.10',True)
    s+=m(190,60,286,'5  Answer: 192.0.2.10')+tx(320,326,'On a cache hit the resolver skips steps 2 to 4 and answers at once.',12)
    return mk('640 340',s,'Sequence of a DNS lookup between device, resolver, root, .com and name servers')
def seq_tall():
    steps=[('1  Device asks its resolver',['Where is example.com?'],0),('2  Resolver asks a root server',['Who runs .com?','Reply: ask the .com servers'],1),('3  Resolver asks the .com server',['Where is example.com?','Reply: ask its name servers'],1),('4  Resolver asks the name server',['Where is example.com?','Reply: 192.0.2.10'],1),('5  Resolver answers your device',['192.0.2.10, remembered for the TTL'],0)]
    s=DEFS; y=8
    for i,(t,sub,acc) in enumerate(steps):
        h=34+len(sub)*17; s+=rb(22,y,316,h,[t]+sub,acc=bool(acc),sz=13.5)
        y+=h
        if i<4: s+=ln(180,y,180,y+18); y+=22
    s+=mt(180,y+22,['Shaded steps 2 to 4 happen only when the','resolver has no cached answer.'],12.5)
    return mk(f'360 {y+64}',s,'DNS lookup in five steps; steps two to four only on a cache miss',True)
# ---------- 2. why it matters: same page, two DNS speeds
SEG=[('TCP',30),('TLS',40),('Request',20),('Response',80)]
def time_wide():
    k=480/570; x0=130; s=tx(320,22,'The same page load, with two different DNS speeds',13,wt=700)
    for row,(lab,sub,dns,y) in enumerate([('Fast DNS','20 ms lookup',20,64),('Slow DNS','400 ms lookup',400,140)]):
        s+=mt(10,y+14,[lab],13,'start',1,700)+mt(10,y+30,[sub],11,'start',0.7)
        x=x0; s+=f'<rect x="{x}" y="{y}" width="{dns*k:.1f}" height="34" rx="4" fill="{A}" fill-opacity="0.4" stroke="currentColor" stroke-opacity="0.45"/>'; x+=dns*k
        for i,(n,w) in enumerate(SEG): s+=f'<rect x="{x:.1f}" y="{y}" width="{w*k:.1f}" height="34" rx="4" fill="currentColor" fill-opacity="{0.10 if i%2==0 else 0.18}" stroke="currentColor" stroke-opacity="0.4"/>'; x+=w*k
        tot=dns+170; s+=mt(x+8 if row==0 else x,y+(22 if row==0 else 52),[f'{tot} ms total'],12,'start' if row==0 else 'end',1,700)
    s+=f'<rect x="{x0}" y="204" width="9" height="9" fill="{A}" fill-opacity="0.5"/>'+tx(x0+14,212,'DNS',11,'start')+'<rect x="180" y="204" width="9" height="9" fill="currentColor" fill-opacity="0.18"/>'+tx(194,212,'then TCP 30, TLS 40, request 20, response 80 ms (same in both)',11,'start')
    s+=tx(320,236,'Numbers are illustrative.',12)
    return mk('640 250',s,'Two page-load timelines: a 20 ms DNS lookup finishes at 190 ms, a 400 ms lookup at 570 ms')
def time_tall():
    k=230/570; s=''; y=6
    for title,dns in (('Fast DNS: 190 ms in total',20),('Slow DNS: 570 ms in total',400)):
        s+=mt(22,y+14,[title],14,'start',1,700); y+=26; start=0
        for n,w in [('DNS',dns)]+SEG:
            acc=n=='DNS'; s+=mt(22,y+17,[f'{n} {w} ms'],12.5,'start',1 if acc else 0.85,700 if acc else 400)+f'<rect x="{112+start*k:.1f}" y="{y}" width="{max(w*k,3):.1f}" height="24" rx="4" fill="{A if acc else "currentColor"}" fill-opacity="{0.4 if acc else 0.12}" stroke="currentColor" stroke-opacity="0.4"/>'
            start+=w; y+=32
        y+=12
    s+=mt(180,y+6,['Both blocks use the same scale.','Numbers are illustrative.'],12.5)
    return mk(f'360 {y+46}',s,'Two page-load timelines on one scale: a 20 ms DNS lookup versus a 400 ms lookup',True)
# ---------- 3. causes, placed where they occur
C=[('Your device',[['VPN or security app','redirects lookups elsewhere'],['Browser Secure DNS','can bypass your device setting']]),('Your router',[['DNS forwarder adds delay','or gets stuck']]),('The resolver',[['Distant or overloaded','resolver'],['Unresponsive DNS server:','lookups wait for a timeout']])]
def causes_wide():
    s=DEFS; xs=[10,222,434]
    for (h,cards),x in zip(C,xs):
        s+=rb(x,8,196,40,[h],acc=True,sz=13)
        y=70; s+=f'<line x1="{x+98}" y1="48" x2="{x+98}" y2="{y}" stroke="currentColor" stroke-opacity="0.35"/>'
        for c in cards: s+=rb(x,y,196,52,c,sz=11.5); y+=62
    s+=ln(206,28,222,28)+ln(418,28,434,28)+tx(320,206,'A lookup travels left to right. The delay can sit at any stop, so fix the one that is slow.',12)
    return mk('640 220',s,'Causes of slow DNS placed on the path from device to router to resolver')
def causes_tall():
    s=DEFS; y=8
    for gi,(h,cards) in enumerate(C):
        s+=rb(22,y,316,38,[h],acc=True,sz=14); y+=38
        for c in cards: s+=f'<line x1="34" y1="{y}" x2="34" y2="{y+8}" stroke="currentColor" stroke-opacity="0.35"/>'+rb(34,y+8,304,50,c,sz=12.5); y+=62
        if gi<2: s+=ln(180,y,180,y+20); y+=26
    s+=mt(180,y+22,['A lookup travels down this path. Fix the stop where','the delay sits.'],12.5)
    return mk(f'360 {y+62}',s,'Causes of slow DNS grouped by where they occur: device, router, resolver',True)
# ---------- 4. where to change DNS
def where(x0,w_dev,w_rt,w_res,gap,ys,title,sub,rows,sz,tall=False):
    s=mt(x0+(w_dev+w_rt+w_res+2*gap)/2,ys-40,[title],sz+1,'middle',1,700)+mt(x0+(w_dev+w_rt+w_res+2*gap)/2,ys-24,[sub],sz-1,'middle',0.75)
    for i,(dev,mode) in enumerate(rows):
        y=ys+i*(48 if tall else 52); xr=x0+w_dev+gap; xs=xr+w_rt+gap
        s+=rb(x0,y,w_dev,34,[dev],acc=(mode=='own'),sz=sz)
        if mode=='own': s+=ln(x0+w_dev,y+17,xs,y+17)+tx(xr+w_rt/2,y+11,'own setting',sz-2,op=0.8)+rb(xs,y,w_res,34,['Chosen','resolver'],acc=True,sz=sz-1)
        else:
            s+=ln(x0+w_dev,y+17,xr,y+17)+rb(xr,y,w_rt,34,['Router'],acc=(mode=='router'),sz=sz)+ln(xr+w_rt,y+17,xs,y+17)
            s+=rb(xs,y,w_res,34,['Chosen','resolver'] if mode=='router' else ['ISP','resolver'],acc=(mode=='router'),sz=sz-1)
    return s
def where_wide():
    s=DEFS+where(8,70,64,110,26,70,'Set on one device','only that device changes',[('Laptop','own'),('Phone','plain'),('TV','plain')],12)
    s+=where(334,70,64,110,26,70,'Set on the router','every device that uses it changes',[('Laptop','router'),('Phone','router'),('TV','router')],12)
    s+=tx(320,248,'Chosen resolver means the one you pick, such as 1.1.1.1, 8.8.8.8 or 9.9.9.9.',12)
    return mk('640 262',s,'Changing DNS on one device versus on the router')
def where_tall():
    s=DEFS+where(22,74,70,112,20,56,'Set on one device','only that device changes',[('Laptop','own'),('Phone','plain'),('TV','plain')],12.5,True)
    s+=where(22,74,70,112,20,276,'Set on the router','every device that uses it changes',[('Laptop','router'),('Phone','router'),('TV','router')],12.5,True)
    s+=mt(180,444,['Chosen resolver means the one you pick, such as','1.1.1.1, 8.8.8.8 or 9.9.9.9.'],12.5)
    return mk('360 480',s,'Changing DNS on one device versus on the router',True)
# ---------- 5. time yours, compare, switch only if clearly better
def flow_wide():
    s=DEFS+rb(40,8,260,40,['Pages feel slow'])+ln(170,48,170,70)
    s+=rb(40,70,260,66,['Time your current resolver','(dig or PowerShell, twice,','flush your cache first)'])+ln(170,136,170,160)
    s+=rb(40,160,260,60,['First lookup about 100 ms','slower than the second?'],acc=True)+ln(300,190,360,190)+tx(330,182,'no',11)+rb(360,160,270,60,['Resolver is fine. Check Wi-Fi, your','ISP, your VPN and the browser','Secure DNS setting'])
    s+=ln(170,220,170,250)+tx(184,240,'yes',11,'start')+rb(40,250,260,52,['Run the browser check','on public resolvers'])+ln(170,302,170,326)
    s+=rb(40,326,260,60,['Is one clearly faster','than your resolver?'],acc=True)+ln(300,356,360,356)+tx(330,348,'yes',11)+rb(360,334,270,44,['Switch to it, then retest'])
    s+=ln(170,386,170,410)+tx(184,402,'no',11,'start')+rb(40,410,260,52,['Keep your resolver; check','router, ISP and VPN'])+tx(480,444,'Thresholds are this page\'s rule of thumb.',11,'middle',0.7)
    return mk('640 474',s,'Decision flow: time your own resolver, compare with public ones, switch only if one is clearly faster')
def flow_tall():
    s=DEFS+rb(12,8,196,40,['Pages feel slow'])+ln(110,48,110,68)
    s+=rb(12,68,196,66,['Time your current resolver','(dig or PowerShell, twice,','flush your cache first)'],sz=12)+ln(110,134,110,156)
    s+=rb(12,156,196,60,['First lookup about 100 ms','slower than the second?'],acc=True,sz=12)+ln(208,186,236,186)+tx(222,178,'no',11)+rb(236,152,114,92,['Resolver is','fine. Check','Wi-Fi, ISP, VPN','and browser','Secure DNS'],sz=11.5)
    s+=ln(110,216,110,244)+tx(122,236,'yes',11,'start')+rb(12,244,196,52,['Run the browser check','on public resolvers'],sz=12)+ln(110,296,110,320)
    s+=rb(12,320,196,60,['Is one clearly faster','than your resolver?'],acc=True,sz=12)+ln(208,350,236,350)+tx(222,342,'yes',11)+rb(236,326,114,48,['Switch to it,','then retest'],sz=11.5)
    s+=ln(110,380,110,406)+tx(122,400,'no',11,'start')+rb(12,406,196,52,['Keep your resolver;','check router, ISP, VPN'],sz=12)+mt(180,480,['Thresholds are this page\'s rule of thumb.'],11.5,'middle',0.7)
    return mk('360 494',s,'Decision flow: time your own resolver, compare with public ones, switch only if one is clearly faster',True)
WIDE=[seq_wide(),time_wide(),causes_wide(),where_wide(),flow_wide()]
TALL=[seq_tall(),time_tall(),causes_tall(),where_tall(),flow_tall()]

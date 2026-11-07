"""Five diagrams for 'How to Find a Printer's IP Address'. Each teaches one sentence. Wide (desktop) and tall (phone) are drawn separately for the same concept and listed in the order the figures appear on the page:
1 pick a method by what you can reach; 2 why a changed address breaks printing; 3 which lines of the network configuration page to read; 4 DHCP reservation versus plain DHCP; 5 what a ping result tells you."""
from svgkit import *
from dns_figs import rb,mt,mk
A='var(--color-accent-primary,#0ea5e9)'
def dbox(x,y,w,h,lines,sz=12):
    r=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="none" stroke="currentColor" stroke-opacity="0.5" stroke-dasharray="5 4"/>'
    n=len(lines); lh=sz*1.3; ty=y+h/2-(n-1)*lh/2+sz*0.35
    return r+''.join(f'<text x="{x+w/2}" y="{ty+i*lh:.1f}" text-anchor="middle" font-size="{sz}" font-weight="{700 if i==0 else 400}" fill="currentColor" fill-opacity="{1 if i==0 else 0.8}">{t}</text>' for i,t in enumerate(lines))
def nb(x,y,n):
    return f'<circle cx="{x}" cy="{y}" r="9" fill="{A}" fill-opacity="0.25" stroke="{A}" stroke-opacity="0.9"/><text x="{x}" y="{y+4}" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">{n}</text>'
CONDS=[['At the printer'],['A computer','that prints to it'],['Only a phone'],['Router login']]
RES=[['Printer screen','Network menu or','printed report'],['Print queue','Windows: Properties','Mac, Linux: lpstat -v'],["Maker's app",'Network information','screen'],['Router','Connected devices','list']]
LAB1='Decision aid: choose how to find the printer address by what you can reach, the printer, a computer, a phone or the router'
# ---- 1 pick a method
def pick_wide():
    s=DEFS+rb(220,6,200,40,['What can you reach?'],acc=True,sz=13)
    for i in range(4):
        x=10+i*160; cx=x+70
        s+=ln(320,46,cx,70)+rb(x,70,140,44,CONDS[i],sz=12)+ln(cx,114,cx,146)+rb(x,146,140,64,RES[i],acc=True,sz=11.5)
    return mk('640 224',s,LAB1)
def pick_tall():
    s=DEFS+rb(12,8,336,36,['What can you reach?'],acc=True,sz=13)+'<line x1="24" y1="44" x2="24" y2="296" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.6"/>'
    for i in range(4):
        y=64+i*68; cy=y+28
        s+=ln(24,cy,44,cy)+rb(44,y,120,56,CONDS[i],sz=12)+ln(164,cy,190,cy)+rb(190,y,158,56,RES[i],acc=True,sz=11.5)
    return mk('360 338',s,LAB1,True)
# ---- 2 why a changed address breaks printing
LAB2='The router gave the printer a new address after a restart, but the laptop still sends print jobs to the old address where nothing answers'
def break_wide():
    s=DEFS+rb(235,6,170,48,['Router','hands out addresses'],acc=True)+ln(290,54,85,108)+ln(350,54,555,108)
    s+=rb(10,108,150,56,['Laptop','saved address .50'])+ln(160,136,248,136)+tx(204,126,'job to .50',11)
    s+=dbox(250,108,140,56,['192.168.1.50','no printer here now'])+rb(480,108,150,56,['Printer','restarted: now .63'],acc=True)
    return mk('640 176',s,LAB2)
def break_tall():
    s=DEFS+rb(60,8,240,48,['Router','hands out addresses'],acc=True)+ln(120,56,92,92)+ln(240,56,268,92)
    s+=rb(12,92,160,56,['Laptop','saved address .50'])+rb(188,92,160,56,['Printer','restarted: now .63'],acc=True)
    s+=ln(92,148,92,196)+tx(104,177,'job to .50',11,'start')+dbox(12,196,160,56,['192.168.1.50','no printer here now'])
    return mk('360 266',s,LAB2,True)
# ---- 3 the network configuration page
ROWS=[('Status','Connected',0),('Network name','HomeWiFi',0),('IP address','192.168.1.50',1),('Subnet mask','255.255.255.0',0),('Gateway','192.168.1.1',2)]
LAB3='Example network configuration page with the printer IP address marked 1 and the router gateway marked 2'
def config_wide():
    s='<rect x="10" y="8" width="380" height="206" rx="10" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.4"/>'+tx(200,32,'Network Configuration Page',13,wt=700)
    for i,(k,v,h) in enumerate(ROWS):
        y=64+i*28
        if h: s+=f'<rect x="18" y="{y-17}" width="364" height="24" rx="5" fill="{A}" fill-opacity="{0.22 if h==1 else 0.12}"/>'+nb(32,y-5,h)
        s+=tx(50,y,k,12,'start',0.85)+tx(374,y,v,12,'end',1,700 if h else 400)
    s+=ln(412,115,394,115,arrow=False)+mt(420,112,["The printer's address"],12.5,'start',1,700)+mt(420,128,['This is the one you need.'],11.5,'start',0.8)
    s+=ln(412,171,394,171,arrow=False)+mt(420,168,["Your router's address"],12.5,'start',1,700)+mt(420,184,['Same as the default gateway.'],11.5,'start',0.8)
    s+=mt(420,206,['A 169.254 address means','no address from the router.'],11.5,'start',0.9)
    return mk('640 232',s,LAB3)
def config_tall():
    s='<rect x="10" y="8" width="340" height="236" rx="10" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.4"/>'+tx(180,36,'Network Configuration Page',15,wt=700)
    for i,(k,v,h) in enumerate(ROWS):
        y=72+i*34
        if h: s+=f'<rect x="18" y="{y-20}" width="324" height="28" rx="6" fill="{A}" fill-opacity="{0.22 if h==1 else 0.12}"/>'+nb(32,y-6,h)
        s+=tx(50,y,k,13,'start',0.85)+tx(334,y,v,13,'end',1,700 if h else 400)
    s+=mt(14,268,["1  The printer's address"],13,'start',1,700)+mt(14,288,['This is the one you need.'],12,'start',0.8)
    s+=mt(14,314,["2  Your router's address"],13,'start',1,700)+mt(14,334,['Same as the default gateway.'],12,'start',0.8)
    s+=mt(14,362,['A 169.254 address means','no address from the router.'],12,'start',0.9)
    return mk('360 384',s,LAB3,True)
# ---- 4 reservation versus plain DHCP
LAB4='Printer address changing with plain DHCP versus staying the same with a DHCP reservation'
STEPS=[['.50','Monday'],['.63','After restart'],['.41','Next week']]
def lease_wide():
    s=DEFS+tx(8,60,'DHCP default',13,'start',1,700)+tx(8,150,'With reservation',13,'start',1,700)
    for i in range(3):
        x=150+i*160
        s+=rb(x,34,120,44,STEPS[i],sz=13)+rb(x,124,120,44,['.50',STEPS[i][1]],acc=True,sz=13)
        if i<2: s+=ln(x+120,56,x+160,56)+ln(x+120,146,x+160,146)
    s+=mt(320,196,['Addresses are illustrative.'],11.5,'middle',0.75)
    return mk('640 206',s,LAB4)
def lease_tall():
    s=DEFS+tx(12,22,'DHCP default',14,'start',1,700)+tx(12,114,'With reservation',14,'start',1,700)
    for i in range(3):
        x=12+i*118
        s+=rb(x,34,100,52,STEPS[i],sz=13)+rb(x,126,100,52,['.50',STEPS[i][1]],acc=True,sz=13)
        if i<2: s+=ln(x+100,60,x+118,60)+ln(x+100,152,x+118,152)
    s+=mt(180,208,['Addresses are illustrative.'],12,'middle',0.75)
    return mk('360 224',s,LAB4,True)
# ---- 5 what a ping result tells you
LAB5='Decision flow for an offline printer: a ping reply means the network is fine and the fault is the port or driver; no reply means a network problem'
def ping_wide():
    s=DEFS+rb(6,72,128,48,['Printer offline'])+ln(134,96,166,96)+rb(166,72,128,48,['Ping its IP','from your computer'])+ln(294,96,326,96)+rb(326,72,110,48,['Replies?'],acc=True,sz=13)
    s+=ln(436,84,486,48)+tx(450,58,'yes',11,'end')+rb(486,10,148,56,['Network is fine','fix the port','or driver'],sz=12)
    s+=ln(436,108,486,150)+tx(450,152,'no',11,'end')+rb(486,122,148,64,['Network problem','Wi-Fi, same network,','changed address'],sz=12)
    s+=mt(320,214,['Some printers ignore ping. Also try the address in a web browser.'],11.5,'middle',0.8)
    return mk('640 228',s,LAB5)
def ping_tall():
    s=DEFS+rb(12,8,196,40,['Printer offline'],sz=12)+ln(110,48,110,68)+rb(12,68,196,52,['Ping its IP','from your computer'],sz=12)+ln(110,120,110,142)
    s+=rb(12,142,196,48,['Replies?'],acc=True,sz=13)+ln(208,166,236,166)+tx(222,158,'yes',11)+rb(236,126,114,80,['Network is fine','fix the port','or driver'],sz=11.5)
    s+=ln(110,190,110,222)+tx(122,212,'no',11,'start')+rb(12,222,196,64,['Network problem','Wi-Fi, same network,','changed address'],sz=12)
    s+=mt(180,314,['Some printers ignore ping.','Also try the address in a web browser.'],11.5,'middle',0.8)
    return mk('360 350',s,LAB5,True)
WIDE=[pick_wide(),break_wide(),config_wide(),lease_wide(),ping_wide()]
TALL=[pick_tall(),break_tall(),config_tall(),lease_tall(),ping_tall()]

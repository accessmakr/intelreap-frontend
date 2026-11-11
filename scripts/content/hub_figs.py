"""Five diagrams for 'How to Find an IP Address' (the hub guide). Wide (desktop) and tall (phone) are drawn separately for the same concept, listed in page order:
1 pick the address you need and where to look; 2 the public, local and gateway addresses on one home network; 3 how each way of listing devices learns about them; 4 how a website name becomes an address; 5 what a VPN changes about the address websites see."""
from svgkit import *
from dns_figs import rb,mt,mk
A='var(--color-accent-primary,#0ea5e9)'
def bar(x,y,w,h,pct):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{h/2}" fill="currentColor" fill-opacity="0.1"/>'
            f'<rect x="{x}" y="{y}" width="{w*pct/100:.1f}" height="{h}" rx="{h/2}" fill="{A}" fill-opacity="0.55"/>')
# ---- 1 which address do you need
CASE=[(['My public IP'],['Live check','above']),(["This device's IP"],['ipconfig or','Wi-Fi details']),(['My router'],['The default','gateway']),(['Another device','at home'],['Router','device list']),(['A website','or server'],['nslookup','or dig']),(["Someone else's"],['Only from','your own logs'])]
L1='Decision aid: pick the address you need, your public IP, this device, your router, another device, a website or someone else, and see where to look'
def pick_wide():
    s=DEFS+tx(8,20,'Which address do you need?',14,'start',1,700)
    for i,(c,r) in enumerate(CASE):
        x=8+(i%3)*214; y=34+(i//3)*130
        s+=rb(x,y,196,40,c,sz=12.5)+ln(x+98,y+40,x+98,y+58)+rb(x,y+58,196,50,r,acc=True,sz=12.5)
    return mk('640 282',s,L1)
def pick_tall():
    s=DEFS+tx(12,20,'Which address do you need?',14,'start',1,700)
    for i,(c,r) in enumerate(CASE):
        y=36+i*66; s+=rb(12,y,150,50,c,sz=12)+ln(162,y+25,190,y+25)+rb(190,y,158,50,r,acc=True,sz=12)
    return mk('360 436',s,L1,True)
# ---- 2 public, local and gateway addresses on one home network
DEV=[('Phone','192.168.1.23'),('Laptop','192.168.1.42'),('TV','192.168.1.57')]
L2='A home network: the router has a public address facing the internet and a local gateway address facing the home, and each device has its own local address'
def home_wide():
    s=DEFS+rb(8,68,112,48,['Internet'])+ln(120,92,190,92)+mt(155,76,['public','address'],11,'middle',0.85)
    s+=rb(190,28,180,100,['Router','WAN 203.0.113.7','LAN 192.168.1.1'],acc=True)+mt(280,150,['The LAN address is','the default gateway'],11,'middle',0.85)
    s+=tx(551,16,'local addresses',11,'middle',0.85)
    for i,(n,a) in enumerate(DEV): y=26+i*64; s+=rb(470,y,162,44,[n,a])+ln(370,78,470,y+22)
    return mk('640 206',s,L2)
def home_tall():
    s=DEFS+rb(110,8,140,40,['Internet'])+ln(180,48,180,92)+tx(192,76,'public address',11,'start',0.85)
    s+=rb(80,92,200,82,['Router','WAN 203.0.113.7','LAN 192.168.1.1'],acc=True,sz=12.5)
    for i,(n,a) in enumerate(DEV): s+=rb(12+i*118,244,100,46,[n,a],sz=11.5)+ln(180,174,62+i*118,244)
    s+=tx(180,312,'local addresses',11,'middle',0.85)+mt(180,332,['The LAN address is','the default gateway'],11,'middle',0.85)
    return mk('360 364',s,L2,True)
# ---- 3 how each way of listing devices learns about them
METH=[('Router device list',['every device the router','gave an address to'],100),('arp -a',['only devices this','computer has talked to'],45),('Scanner app',['devices that answer','the scan'],80)]
L3='Three ways to list devices on a network and how much of the network each one sees: the router list sees every device it gave an address to, arp -a sees only devices this computer has talked to, a scanner sees those that answer'
def methods_wide():
    s=DEFS
    for i,(n,t,p) in enumerate(METH):
        y=14+i*78; s+=rb(8,y,150,48,[n],sz=13)+bar(176,y+14,250,20,p)+mt(444,y+20,t,11,'start',0.9)
    s+=tx(320,256,'Bars are illustrative.',11,'middle',0.75)
    return mk('640 268',s,L3)
def methods_tall():
    s=DEFS
    for i,(n,t,p) in enumerate(METH):
        y=10+i*124; s+=rb(12,y,336,40,[n],sz=13)+bar(12,y+52,336,18,p)+mt(12,y+92,t,11.5,'start',0.9)
    s+=tx(180,392,'Bars are illustrative.',11.5,'middle',0.75)
    return mk('360 404',s,L3,True)
# ---- 4 from a website name to an address
L4='A website name becomes an address: your computer asks a DNS resolver, the resolver asks the site DNS servers, and the answer comes back'
def lookup_wide():
    s=DEFS+tx(320,26,'asks: what is the address of example.com?',12,'middle',1,700)
    nodes=[['Your computer','nslookup example.com'],['DNS resolver','your router or ISP'],["The site's",'DNS servers']]
    for i,n in enumerate(nodes):
        x=8+i*224; s+=rb(x,46,176,56,n,acc=i==2,sz=12)
        if i<2: s+=ln(x+176,62,x+224,62)+ln(x+224,86,x+176,86)
    s+=tx(320,132,'answer: 198.51.100.20 (illustrative)',12,'middle',1,700)
    return mk('640 148',s,L4)
def lookup_tall():
    s=DEFS+mt(180,18,['asks: what is the address','of example.com?'],12,'middle',1,700)
    nodes=[['Your computer','nslookup example.com'],['DNS resolver','your router or ISP'],["The site's",'DNS servers']]
    for i,n in enumerate(nodes):
        y=58+i*88; s+=rb(100,y,160,56,n,acc=i==2,sz=12)
        if i<2: s+=ln(150,y+56,150,y+88)+ln(210,y+88,210,y+56)
    s+=mt(180,58+2*88+56+26,['answer: 198.51.100.20','(illustrative)'],12,'middle',1,700)
    return mk('360 360',s,L4,True)
# ---- 5 what a VPN changes
L5='Without a VPN the website sees your public address; with a VPN it sees the VPN server address instead'
def vpn_wide():
    s=DEFS
    rows=[('VPN off',['Your router','203.0.113.7'],['Website sees','203.0.113.7']),('VPN on',['VPN server','192.0.2.99'],['Website sees','192.0.2.99'])]
    for i,(lab,mid,end) in enumerate(rows):
        y=10+i*92; s+=tx(8,y+30,lab,13,'start',1,700)+rb(100,y,120,52,['Your device'],sz=12)+ln(220,y+26,260,y+26)+rb(260,y,130,52,mid,sz=12)+ln(390,y+26,430,y+26)+rb(430,y,160,52,end,acc=True,sz=12)
    return mk('640 196',s,L5)
def vpn_tall():
    s=DEFS
    rows=[('VPN off',['Your router','203.0.113.7'],['Website sees','203.0.113.7']),('VPN on',['VPN server','192.0.2.99'],['Website sees','192.0.2.99'])]
    for i,(lab,mid,end) in enumerate(rows):
        y=30+i*96; s+=tx(12,y-8,lab,13,'start',1,700)+rb(12,y,100,52,['Your','device'],sz=11.5)+ln(112,y+26,130,y+26)+rb(130,y,100,52,mid,sz=11.5)+ln(230,y+26,248,y+26)+rb(248,y,100,52,end,acc=True,sz=11.5)
    return mk('360 218',s,L5,True)
WIDE=[pick_wide(),home_wide(),methods_wide(),lookup_wide(),vpn_wide()]
TALL=[pick_tall(),home_tall(),methods_tall(),lookup_tall(),vpn_tall()]

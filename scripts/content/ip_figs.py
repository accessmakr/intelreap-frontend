"""Five diagrams for 'What Is an IP Address?'. Wide (desktop) and tall (phone) are drawn separately for the same concept, listed in page order:
1 an address names a network and a device (the mask decides where the split is); 2 one public address shared by many private devices, with the translation table; 3 a request and its reply swap source and destination; 4 how a device gets its address (DHCP, four messages); 5 how an IPv6 address is shortened."""
from svgkit import *
from dns_figs import rb,mt,mk
A='var(--color-accent-primary,#0ea5e9)'
MONO='font-family="var(--font-mono,ui-monospace,Menlo,Consolas,monospace)"'
def vbox(x,y,w,h,text,sz,acc=False):
    r=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{A if acc else "currentColor"}" fill-opacity="{0.2 if acc else 0.07}" stroke="{A if acc else "currentColor"}" stroke-opacity="{0.9 if acc else 0.45}"/>'
    return r+f'<text x="{x+w/2}" y="{y+h/2+sz*0.35:.1f}" text-anchor="middle" font-size="{sz}" font-weight="700" fill="currentColor" {MONO}>{text}</text>'
def life(x,y1,y2): return f'<line x1="{x}" y1="{y1}" x2="{x}" y2="{y2}" stroke="currentColor" stroke-opacity="0.35" stroke-dasharray="4 4"/>'
# ---- 1 network part and device part
L1='An IPv4 address split by the subnet mask: 192.168.1 names the network and 42 names the device'
def split_wide():
    s=DEFS+tx(8,36,'Address',13,'start',1,700)+tx(8,92,'Mask /24',13,'start',1,700)
    for i,(a,m) in enumerate([('192','255'),('168','255'),('1','255'),('42','0')]):
        x=130+i*118; s+=rb(x,12,104,40,[a],acc=i<3,sz=14)+rb(x,68,104,40,[m],acc=i<3,sz=14)
    s+=rb(130,132,316,52,['Network part: 192.168.1','first 24 bits, set by the 255s'],acc=True)+rb(462,132,164,52,['Device part: .42','last 8 bits, set by the 0'])
    return mk('640 198',s,L1)
def split_tall():
    s=DEFS+tx(12,22,'Address',14,'start',1,700)+tx(12,96,'Mask /24',14,'start',1,700)
    for i,(a,m) in enumerate([('192','255'),('168','255'),('1','255'),('42','0')]):
        x=12+i*84; s+=rb(x,30,76,38,[a],acc=i<3,sz=14)+rb(x,104,76,38,[m],acc=i<3,sz=14)
    s+=rb(12,162,336,52,['Network part: 192.168.1','first 24 bits, set by the 255s'],acc=True,sz=12.5)+rb(12,224,336,52,['Device part: .42','last 8 bits, set by the 0'],sz=12.5)
    return mk('360 290',s,L1,True)
# ---- 2 one public address, many private devices (NAT)
DEV=[('Phone','192.168.1.23'),('Laptop','192.168.1.42'),('TV','192.168.1.57')]
NAT=['NAT table (illustrative)','192.168.1.23:50001 → 203.0.113.7:61001','192.168.1.42:50002 → 203.0.113.7:61002','192.168.1.57:50003 → 203.0.113.7:61003']
L2='Three devices with private addresses share one public address; the router keeps a table that maps each private address and port to a public port'
def nat_wide():
    s=DEFS
    for i,(n,a) in enumerate(DEV): y=10+i*62; s+=rb(8,y,150,48,[n,a])+ln(158,y+24,248,[74,92,110][i])
    s+=rb(250,40,150,104,['Router (NAT)','LAN 192.168.1.1','WAN 203.0.113.7'],acc=True)+ln(400,92,486,92)+mt(443,70,['all appear as','203.0.113.7'],11,'middle',0.85)+rb(486,64,146,56,['Website','198.51.100.20'])
    s+=ln(325,144,325,196,arrow=False)+rb(170,196,310,84,NAT,sz=11)
    return mk('640 294',s,L2)
def nat_tall():
    s=DEFS
    for i,(n,a) in enumerate(DEV): s+=rb(12+i*118,10,100,48,[n,a],sz=11.5)+ln(62+i*118,58,[132,180,228][i],96)
    s+=rb(100,96,160,64,['Router (NAT)','LAN 192.168.1.1','WAN 203.0.113.7'],acc=True,sz=12)+ln(180,160,180,184,arrow=False)+rb(12,184,336,84,NAT,sz=11)
    s+=ln(180,268,180,298)+tx(192,288,'all appear as 203.0.113.7',11,'start',0.85)+rb(110,298,140,48,['Website','198.51.100.20'],sz=12)
    return mk('360 358',s,L2,True)
# ---- 3 a request and its reply
NODES=[['Your network','203.0.113.7'],['Router','next hop'],['Router','next hop'],['Router','next hop'],['Website','198.51.100.20']]
L3='A request travels hop by hop to the website; the reply travels back with the source and destination addresses swapped'
def travel_wide():
    s=DEFS+tx(320,24,'Request: from 203.0.113.7 to 198.51.100.20',12.5,'middle',1,700)
    for i,n in enumerate(NODES):
        x=8+i*128; s+=rb(x,44,100,52,n,acc=i in (0,4),sz=12)
        if i<4: s+=ln(x+100,62,x+128,62)+ln(x+128,80,x+100,80)
    s+=tx(320,128,'Reply: from 198.51.100.20 to 203.0.113.7',12.5,'middle',1,700)
    return mk('640 142',s,L3)
def travel_tall():
    s=DEFS+mt(180,18,['Request: from 203.0.113.7','to 198.51.100.20'],12,'middle',1,700)
    for i,n in enumerate(NODES):
        y=56+i*76; s+=rb(110,y,140,44,n,acc=i in (0,4),sz=12)
        if i<4: s+=ln(150,y+44,150,y+76)+ln(210,y+76,210,y+44)
    s+=mt(180,56+4*76+44+26,['Reply: from 198.51.100.20','to 203.0.113.7'],12,'middle',1,700)
    return mk('360 456',s,L3,True)
# ---- 4 DHCP
MSG=[(0,'1  DHCPDISCOVER','Is anyone there?'),(1,'2  DHCPOFFER','Take 192.168.1.42'),(0,'3  DHCPREQUEST','I will take it'),(1,'4  DHCPACK','Yours for the lease')]
L4='How a device gets its address: it asks, the router offers, the device requests it, the router confirms'
def dhcp_wide():
    s=DEFS+rb(10,6,170,40,['Your device'])+rb(460,6,170,44,['Router','DHCP server'],acc=True)+life(95,46,238)+life(545,50,238)
    for i,(d,a,b) in enumerate(MSG):
        y=94+i*46; x1,x2=(95,545) if d==0 else (545,95)
        s+=ln(x1,y,x2,y)+mt(320,y-22,[a],12,'middle',1,700)+mt(320,y-8,[b],11,'middle',0.8)
    return mk('640 248',s,L4)
def dhcp_tall():
    s=DEFS+rb(12,6,130,40,['Your device'],sz=12)+rb(218,6,130,44,['Router','DHCP server'],acc=True,sz=12)+life(77,46,318)+life(283,50,318)
    for i,(d,a,b) in enumerate(MSG):
        y=100+i*66; x1,x2=(77,283) if d==0 else (283,77)
        s+=ln(x1,y,x2,y)+mt(180,y-22,[a],12,'middle',1,700)+mt(180,y-8,[b],11,'middle',0.8)
    return mk('360 330',s,L4,True)
# ---- 5 shortening an IPv6 address
V6=[('Full form','2001:0db8:0000:0000:0000:0000:0000:0001'),('Leading zeros dropped','2001:db8:0:0:0:0:0:1'),('One run of zeros as ::','2001:db8::1')]
ST=['drop leading zeros in each group','replace one run of zero groups with ::']
ST2=[['drop leading zeros','in each group'],['replace one run of','zero groups with ::']]
L5='An IPv6 address shortened in two steps: drop leading zeros, then replace one run of zero groups with a double colon'
def v6_wide():
    s=DEFS
    for i,(lab,v) in enumerate(V6):
        y=10+i*84; s+=tx(8,y+27,lab,12.5,'start',0.9,700)+vbox(210,y,420,44,v,15,acc=i==2)
        if i<2: s+=ln(420,y+44,420,y+84)+tx(434,y+70,ST[i],11,'start',0.85)
    return mk('640 232',s,L5)
def v6_tall():
    s=DEFS
    for i,(lab,v) in enumerate(V6):
        y=26+i*94; s+=tx(12,y-8,lab,12.5,'start',0.9,700)+vbox(12,y,336,36,v,12.5,acc=i==2)
        if i<2: s+=ln(180,y+36,180,y+94-8)+mt(192,y+58,ST2[i],11,'start',0.85)
    return mk('360 262',s,L5,True)
WIDE=[split_wide(),nat_wide(),travel_wide(),dhcp_wide(),v6_wide()]
TALL=[split_tall(),nat_tall(),travel_tall(),dhcp_tall(),v6_tall()]

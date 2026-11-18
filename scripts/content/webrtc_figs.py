"""Five diagrams for 'WebRTC Leak Test'. Wide (desktop) and tall (phone) are drawn separately for the same concept, in page order:
1 two paths from one browser (web traffic through the VPN, WebRTC to a STUN server); 2 the three leak cases and what the page learns; 3 how to read a result;
4 the four IP-handling modes (RFC 8828); 5 choosing a fix by the VPN type in use."""
from svgkit import *
from dns_figs import rb,mt,mk
# ---- 1 two paths
L1='A browser sends web traffic through the VPN to the website, and separately sends a WebRTC request to a STUN server; if that second request skips the VPN, the page script learns your ISP address'
def paths_wide():
    s=DEFS+rb(8,84,120,56,['Your browser','with a VPN on'],acc=True,sz=11.5)
    s+=ln(128,102,180,38)+ln(128,122,180,186)
    s+=rb(180,10,140,56,['Web page traffic','through the VPN'],sz=11.5)+ln(320,38,400,38)+rb(400,10,232,56,['Website','sees the VPN address'],sz=11.5)
    s+=rb(180,158,140,56,['WebRTC request','to a STUN server'],sz=11.5)+ln(320,186,400,186)+rb(400,158,232,56,['STUN server replies','with the address it saw'],sz=11.5)
    s+=tx(320,238,'If the second request skips the VPN, the page script learns your ISP address',12,'middle',0.85)
    return mk('640 250',s,L1)
def paths_tall():
    s=DEFS+rb(100,8,160,44,['Your browser','with a VPN on'],acc=True,sz=12.5)
    s+=ln(180,52,180,84)+rb(20,84,320,48,['Web page traffic','through the VPN'],sz=12.5)+ln(180,132,180,156)+rb(20,156,320,44,['Website','sees the VPN address'],sz=12.5)
    s+=ln(100,30,10,30,arrow=False)+ln(10,30,10,254,arrow=False)+ln(10,254,20,254)
    s+=rb(20,230,320,48,['WebRTC request','to a STUN server'],sz=12.5)+ln(180,278,180,302)+rb(20,302,320,48,['STUN server replies','with the address it saw'],sz=12.5)
    s+=mt(180,380,['If the second request skips the VPN,','the page script learns your ISP address'],12,'middle',0.85)
    return mk('360 408',s,L1,True)
# ---- 2 three leak cases
L2='Three cases from RFC 8828 that reveal an address: a split-tunnel VPN shows your ISP address, a proxy-style extension VPN is bypassed by STUN, and a home NAT hides a private address'
CASES=[('Split-tunnel VPN','Some traffic','skips the VPN',['Your ISP address','shows beside the VPN one'],True,['Leak','if a VPN is on']),
       ('Extension VPN','Works as a proxy','for browser traffic',['STUN can bypass the proxy','and show your real address'],True,['Leak','if a VPN is on']),
       ('Behind home NAT','Devices share','one public address',['A private LAN address','(now often hidden by mDNS)'],False,['Local only','not a VPN leak'])]
def cases_wide():
    s=DEFS
    for i,(a,b,c,d,acc,v) in enumerate(CASES):
        x=8+i*212
        s+=rb(x,10,200,56,[a,b,c],sz=11.5)+ln(x+100,66,x+100,104)+rb(x,104,200,64,['The page learns']+d,sz=11.5)+ln(x+100,168,x+100,198)+rb(x,198,200,52,v,acc=acc,sz=11.5)
    return mk('640 262',s,L2)
def cases_tall():
    s=DEFS
    for i,(a,b,c,d,acc,v) in enumerate(CASES):
        y=8+i*190
        s+=rb(20,y,320,44,[a,b+' '+c],sz=12)+ln(180,y+44,180,y+62)+rb(20,y+62,320,60,['The page learns']+d,sz=12)+ln(180,y+122,180,y+138)+rb(20,y+138,320,32,[' '.join(v)],acc=acc,sz=12)
    return mk('360 566',s,L2,True)
# ---- 3 how to read a result
L3='Reading the test with a VPN on: no public address means nothing was revealed; a public address that matches the one websites see is fine; a different one is a leak'
def read_wide():
    s=DEFS+rb(8,96,170,56,['Any public address','revealed by WebRTC?'],acc=True,sz=11.5)
    s+=ln(93,96,93,62)+tx(101,84,'no',11.5,'start',0.9)+rb(8,10,170,52,['No public address','blocked or no STUN route'],sz=11.5)
    s+=ln(178,124,235,124)+tx(206,116,'yes',11.5,'middle',0.9)+rb(235,96,170,56,['Same as the address','websites see?'],acc=True,sz=11.5)
    s+=ln(320,96,320,62)+tx(328,84,'yes',11.5,'start',0.9)+rb(235,10,170,52,['Same address','no leak shown'],sz=11.5)
    s+=ln(405,124,462,124)+tx(434,116,'no',11.5,'middle',0.9)+rb(462,96,170,56,['Different address','a leak if a VPN is on'],sz=11.5)
    s+=tx(320,196,'Without a VPN, a second address is usually IPv4 versus IPv6, not a leak',12,'middle',0.85)
    return mk('640 212',s,L3)
def read_tall():
    s=DEFS+rb(40,8,280,48,['Any public address','revealed by WebRTC?'],acc=True,sz=12.5)
    s+=ln(180,56,180,86)+tx(192,76,'yes',11.5,'start',0.9)+rb(40,86,280,48,['Same as the address','websites see?'],acc=True,sz=12.5)
    s+=ln(180,134,180,164)+tx(192,154,'no',11.5,'start',0.9)+rb(40,164,280,56,['Different address','a leak if a VPN is on'],sz=12.5)
    s+=ln(40,32,14,32,arrow=False)+tx(14,26,'no',11.5,'start',0.9)+ln(14,32,14,272,arrow=False)+ln(14,272,40,272)+rb(40,248,280,48,['No public address','blocked or no STUN route'],sz=12)
    s+=ln(320,110,346,110,arrow=False)+tx(346,104,'yes',11.5,'end',0.9)+ln(346,110,346,342,arrow=False)+ln(346,342,320,342)+rb(40,318,280,48,['Same address','no leak shown'],sz=12.5)
    s+=mt(180,394,['Without a VPN, a second address is','usually IPv4 versus IPv6, not a leak'],11.5,'middle',0.85)
    return mk('360 420',s,L3,True)
# ---- 4 four IP-handling modes
L4='RFC 8828 describes four ways a browser can handle IP addresses in WebRTC, from revealing every address to forcing all traffic through a proxy'
MODES=[['Mode 1','All interfaces','Every address, best calls'],['Mode 2','Default route','plus your LAN address'],['Mode 3','Default route only','no LAN address'],['Mode 4','Force proxy','UDP only through a proxy']]
def modes_wide():
    s=DEFS+tx(8,16,'Most information revealed',11.5,'start',0.85)+tx(632,16,'Least information revealed',11.5,'end',0.85)
    for i,m in enumerate(MODES):
        x=8+i*161; s+=rb(x,26,145,100,m,sz=11.5)
        if i<3: s+=ln(x+145,76,x+161,76)
    s+=mt(320,156,['Chrome and Edge policy values: default, default_public_and_private_interfaces,','default_public_interface_only, disable_non_proxied_udp'],11,'middle',0.8)
    return mk('640 196',s,L4)
def modes_tall():
    s=DEFS+tx(20,16,'Most information revealed',12,'start',0.85)
    for i,m in enumerate(MODES):
        y=26+i*84; s+=rb(20,y,320,60,m,sz=12.5)
        if i<3: s+=ln(180,y+60,180,y+84)
    s+=tx(340,362,'Least information revealed',12,'end',0.85)
    s+=mt(180,390,['Chrome and Edge policy values:','default, default_public_and_private_interfaces,','default_public_interface_only,','disable_non_proxied_udp'],11,'middle',0.8)
    return mk('360 450',s,L4,True)
# ---- 5 choose a fix
L5='Choose the fix by your VPN type: a system VPN app, an extension VPN that acts as a proxy, or no VPN'
FIX=[(['System VPN app','full tunnel'],['If the test still shows your ISP address,','use "default public interface only"'],False),
     (['Extension VPN','acts as a proxy'],['Use "disable non-proxied UDP"','calls may stop working'],True),
     (['No VPN','nothing to leak'],['Your ISP address is public anyway','change nothing unless you want to'],False)]
def fix_wide():
    s=DEFS
    for i,(a,b,acc) in enumerate(FIX):
        y=10+i*70; s+=rb(8,y,200,56,a,sz=11.5)+ln(208,y+28,252,y+28)+rb(252,y,380,56,b,sz=11.5)
    return mk('640 216',s,L5)
def fix_tall():
    s=DEFS
    for i,(a,b,acc) in enumerate(FIX):
        y=8+i*140; s+=rb(20,y,320,48,a,sz=12.5)+ln(180,y+48,180,y+68)+rb(20,y+68,320,56,b,sz=11.5)
    return mk('360 430',s,L5,True)
WIDE=[paths_wide(),cases_wide(),read_wide(),modes_wide(),fix_wide()]
TALL=[paths_tall(),cases_tall(),read_tall(),modes_tall(),fix_tall()]

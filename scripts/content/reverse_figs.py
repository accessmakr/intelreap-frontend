"""Five diagrams for 'Reverse IP Lookup'. Wide (desktop) and tall (phone) are drawn separately for the same concept, in page order:
1 two different questions share one name (hostname for an IP vs domains on an IP); 2 how the reverse name is built (IPv4 and IPv6); 3 the forward-confirmed loop;
4 many domains on one IP, picked by Host header and SNI; 5 where domain lists come from and what they miss."""
from svgkit import *
from dns_figs import rb,mt,mk
# ---- 1 two questions
L1='One IP address can be asked two different questions: which hostname was set for it (a live DNS lookup), and which domains resolve to it (a lookup in a crawled dataset)'
def two_wide():
    s=DEFS+rb(8,87,140,56,['IP address','203.0.113.10'],acc=True)
    s+=ln(148,105,200,44)+ln(148,125,200,186)
    s+=rb(200,10,240,64,['Question 1: PTR lookup','What hostname did the owner set?','Live DNS query'])+ln(440,42,480,42)+rb(480,10,152,64,['One hostname','host.example.net'],sz=11)
    s+=rb(200,154,240,64,['Question 2: domains on this IP','Which sites resolve here?','Needs a crawled dataset'])+ln(440,186,480,186)+rb(480,154,152,64,['A list of domains','from a dataset'],sz=11)
    return mk('640 228',s,L1)
def two_tall():
    s=DEFS+rb(100,8,160,44,['IP address','203.0.113.10'],acc=True,sz=12.5)
    s+=ln(180,52,180,84)+rb(20,84,320,60,['Question 1: PTR lookup','What hostname did the owner set?','Live DNS query'],sz=12.5)+ln(180,144,180,168)+rb(20,168,320,44,['One hostname','host.example.net'],sz=12.5)
    s+=ln(100,30,10,30,arrow=False)+ln(10,30,10,276,arrow=False)+ln(10,276,20,276)
    s+=rb(20,246,320,60,['Question 2: domains on this IP','Which sites resolve here?','Needs a crawled dataset'],sz=12.5)+ln(180,306,180,330)+rb(20,330,320,44,['A list of domains','from a dataset'],sz=12.5)
    return mk('360 388',s,L1,True)
# ---- 2 building the reverse name
L2='The reverse name is built by reversing the address: octets under in-addr.arpa for IPv4, single hex digits under ip6.arpa for IPv6'
def build_wide():
    s=DEFS+tx(8,16,'IPv4',12.5,'start',1,700)
    s+=rb(8,24,140,48,['IPv4 address','8.8.4.4'])+ln(148,48,182,48)+rb(182,24,200,48,['Reverse the four octets','then add in-addr.arpa'],acc=True,sz=11.5)+ln(382,48,412,48)+rb(412,24,220,48,['Reverse name','4.4.8.8.in-addr.arpa'],sz=11.5)
    s+=tx(8,108,'IPv6',12.5,'start',1,700)
    s+=rb(8,116,140,48,['IPv6 address','2001:db8::1'])+ln(148,140,182,140)+rb(182,116,200,48,['Expand to 32 hex digits,','reverse them, add ip6.arpa'],acc=True,sz=11.5)+ln(382,140,412,140)+rb(412,116,220,48,['Reverse name','1.0.0.0. … 8.b.d.0.1.0.0.2.ip6.arpa'],sz=10)
    s+=tx(320,204,'Then ask the DNS for a PTR record at that name; the answer is the hostname',12,'middle',0.85)
    return mk('640 216',s,L2)
def build_tall():
    s=DEFS+tx(12,18,'IPv4',13,'start',1,700)
    s+=rb(12,26,336,40,['IPv4 address','8.8.4.4'],sz=12.5)+ln(180,66,180,88)+rb(12,88,336,48,['Reverse the four octets','then add in-addr.arpa'],acc=True,sz=12.5)+ln(180,136,180,158)+rb(12,158,336,44,['Reverse name','4.4.8.8.in-addr.arpa'],sz=12.5)
    s+=tx(12,232,'IPv6',13,'start',1,700)
    s+=rb(12,240,336,40,['IPv6 address','2001:db8::1'],sz=12.5)+ln(180,280,180,302)+rb(12,302,336,56,['Expand to 32 hex digits,','reverse them, add ip6.arpa'],acc=True,sz=12.5)+ln(180,358,180,380)+rb(12,380,336,56,['Reverse name','1.0.0.0. … 8.b.d.0.1.0.0.2.ip6.arpa'],sz=10.5)
    s+=mt(180,462,['Then ask the DNS for a PTR record','at that name; the answer is the hostname'],12,'middle',0.85)
    return mk('360 492',s,L2,True)
# ---- 3 forward-confirmed loop
L3='Forward-confirmed reverse DNS: the PTR hostname for an address must resolve back to the same address'
def loop_wide():
    s=DEFS+rb(8,80,150,56,['IP address','203.0.113.10'],acc=True)
    s+=tx(196,48,'1. PTR lookup',11,'end',0.85)+ln(158,96,245,46)+rb(245,10,170,56,['PTR hostname','mail.example.com'])
    s+=tx(470,48,'2. A or AAAA lookup',11,'start',0.85)+ln(415,46,480,96)+rb(480,80,150,56,['Address records','of that hostname'])
    s+=ln(555,136,555,190,arrow=False)+ln(555,190,83,190,arrow=False)+ln(83,190,83,136)
    s+=tx(320,182,'Same IP: forward-confirmed. Different or missing: not confirmed.',12,'middle',0.9)
    return mk('640 206',s,L3)
def loop_tall():
    s=DEFS+rb(60,8,240,48,['IP address','203.0.113.10'],acc=True,sz=12.5)
    s+=ln(180,56,180,88)+tx(192,76,'1. PTR lookup',11.5,'start',0.85)+rb(60,88,240,52,['PTR hostname','mail.example.com'],sz=12.5)
    s+=ln(180,140,180,172)+tx(192,160,'2. A or AAAA lookup',11.5,'start',0.85)+rb(60,172,240,52,['Address records','of that hostname'],sz=12.5)
    s+=ln(60,198,28,198,arrow=False)+ln(28,198,28,32,arrow=False)+ln(28,32,60,32)
    s+=mt(180,250,['Same IP: forward-confirmed.','Different or missing: not confirmed.'],12,'middle',0.9)
    return mk('360 290',s,L3,True)
# ---- 4 many domains, one IP
L4='Two browsers ask for different domains at the same IP address; the server tells them apart by the Host header and the TLS server name'
def share_wide():
    s=DEFS+rb(8,20,170,50,['Request for','a.example'],sz=11.5)+rb(8,120,170,50,['Request for','b.example'],sz=11.5)
    s+=ln(178,45,250,85)+ln(178,145,250,115)
    s+=rb(250,50,150,100,['Server 203.0.113.10','reads the Host header','and the TLS name'],acc=True,sz=11.5)
    s+=ln(400,85,480,45)+ln(400,115,480,145)+rb(480,20,150,50,['Site A','files for a.example'],sz=11.5)+rb(480,120,150,50,['Site B','files for b.example'],sz=11.5)
    s+=tx(320,204,'A reverse IP list for 203.0.113.10 would show both domains',12,'middle',0.85)
    return mk('640 216',s,L4)
def share_tall():
    s=DEFS+rb(12,8,164,50,['Request for','a.example'],sz=12)+rb(184,8,164,50,['Request for','b.example'],sz=12)
    s+=ln(94,58,150,96)+ln(266,58,210,96)
    s+=rb(60,96,240,76,['Server 203.0.113.10','reads the Host header','and the TLS name'],acc=True,sz=12.5)
    s+=ln(150,172,94,204)+ln(210,172,266,204)+rb(12,204,164,48,['Site A','files for a.example'],sz=11.5)+rb(184,204,164,48,['Site B','files for b.example'],sz=11.5)
    s+=mt(180,282,['A reverse IP list for 203.0.113.10','would show both domains'],12,'middle',0.85)
    return mk('360 312',s,L4,True)
# ---- 5 where domain lists come from
L5='Domain lists come from crawlers and DNS feeds that build a dataset of domain and IP pairs; the dataset misses new domains, shows moved sites and returns only part of busy shared addresses'
def src_wide():
    s=DEFS+rb(8,10,170,56,['Crawlers and DNS feeds','resolve domains'],sz=11.5)+ln(178,38,235,38)
    s+=rb(235,10,170,56,['Dataset','domain and IP pairs'],acc=True,sz=11.5)+ln(405,38,462,38)+rb(462,10,170,56,['Lookup by IP','returns a list'],sz=11.5)
    s+=ln(320,66,108,120,dash=True)+ln(320,66,320,120,dash=True)+ln(320,66,532,120,dash=True)
    s+=rb(8,120,200,56,['Misses new domains','not crawled yet'],sz=11.5)+rb(220,120,200,56,['Shows moved sites','until the next crawl'],sz=11.5)+rb(432,120,200,56,['Partial for busy IPs','CDN lists are a subset'],sz=11.5)
    return mk('640 188',s,L5)
def src_tall():
    s=DEFS+rb(20,8,320,48,['Crawlers and DNS feeds','resolve domains'],sz=12.5)+ln(180,56,180,80)
    s+=rb(20,80,320,48,['Dataset','domain and IP pairs'],acc=True,sz=12.5)+ln(180,128,180,152)+rb(20,152,320,48,['Lookup by IP','returns a list'],sz=12.5)
    s+=tx(180,226,'Gaps in the dataset',12.5,'middle',1,700)+ln(340,104,350,104,dash=True,arrow=False)+ln(350,104,350,377,dash=True,arrow=False)+ln(350,269,340,269,dash=True)+ln(350,323,340,323,dash=True)+ln(350,377,340,377,dash=True)
    s+=rb(20,246,320,46,['Misses new domains','not crawled yet'],sz=12)+rb(20,300,320,46,['Shows moved sites','until the next crawl'],sz=12)+rb(20,354,320,46,['Partial for busy IPs','CDN lists are a subset'],sz=12)
    return mk('360 412',s,L5,True)
WIDE=[two_wide(),build_wide(),loop_wide(),share_wide(),src_wide()]
TALL=[two_tall(),build_tall(),loop_tall(),share_tall(),src_tall()]

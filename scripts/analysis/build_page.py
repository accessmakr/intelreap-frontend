import re,json,html as H
SRC='guides/how-to-find-ip-address-of-any-device.html'
OUT='learn/what-is-an-ip-address.html'
SLUG='what-is-an-ip-address'; URL='https://intelreap.com/learn/'+SLUG
OLD='https://intelreap.com/guides/how-to-find-ip-address-of-any-device'
TITLE='What Is an IP Address? How It Works, Types and What It Reveals'
DESC='An IP address is the number that lets devices find each other on a network. Learn IPv4 vs IPv6, public vs private ranges, NAT, DHCP and what your IP reveals, with live check.'
DATE='2026-10-30'
h=open(SRC,encoding='utf-8').read()
def div_span(s,marker):
    i=s.find(marker); assert i>=0,marker
    d=0
    for m in re.finditer(r'<div\b|</div>',s[i:]):
        d+=1 if m.group(0)=='<div' else -1
        if d==0: return i,i+m.end()
    raise SystemExit('unbalanced '+marker)
# ---------- SVG helpers
_n=[0]
def svg(vb,body,label):
    _n[0]+=1; body=body.replace('id="ah"',f'id="ah{_n[0]}"').replace('url(#ah)',f'url(#ah{_n[0]})')
    return f'<svg viewBox="0 0 {vb}" role="img" aria-label="{label}" xmlns="http://www.w3.org/2000/svg"><title>{label}</title>{body}</svg>'
def box(x,y,w,hh,t,sub='',accent=False):
    f='var(--color-accent-primary,#0ea5e9)'
    s=f'<rect x="{x}" y="{y}" width="{w}" height="{hh}" rx="8" fill="{f if accent else "currentColor"}" fill-opacity="{0.16 if accent else 0.06}" stroke="{f if accent else "currentColor"}" stroke-opacity="{0.9 if accent else 0.35}"/>'
    s+=f'<text x="{x+w/2}" y="{y+hh/2+(-3 if sub else 5)}" text-anchor="middle" font-size="14" font-weight="600" fill="currentColor">{t}</text>'
    if sub: s+=f'<text x="{x+w/2}" y="{y+hh/2+14}" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.7">{sub}</text>'
    return s
def ln(x1,y1,x2,y2,dash=False,arrow=True):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.6"{" stroke-dasharray=\"5 4\"" if dash else ""}{" marker-end=\"url(#ah)\"" if arrow else ""}/>'
def tx(x,y,t,sz=12,anchor='middle',op=0.8,wt=400):
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-size="{sz}" font-weight="{wt}" fill="currentColor" fill-opacity="{op}">{t}</text>'
DEFS='<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor" fill-opacity="0.7"/></marker></defs>'
# D1 anatomy
d1=DEFS
for i,(o,b) in enumerate([('192','11000000'),('168','10101000'),('1','00000001'),('42','00101010')]):
    x=40+i*150; d1+=box(x,70,110,56,o,b,accent=i==3)
    if i<3: d1+=tx(x+130,106,'.',22,op=0.6)
d1+='<path d="M40 60 V50 H300 V60" fill="none" stroke="currentColor" stroke-opacity="0.5"/>'+tx(170,40,'Network part (identifies the network)',12)
d1+='<path d="M490 60 V50 H600 V60" fill="none" stroke="var(--color-accent-primary,#0ea5e9)"/>'+tx(545,40,'Host part',12,wt=600)
d1+=tx(320,158,'4 octets x 8 bits = 32 bits. Each octet is 0 to 255.',13)+tx(320,178,'Example split for a /24 network (mask 255.255.255.0)',11,op=0.6)
D1=svg('640 190',d1,'Anatomy of an IPv4 address showing four octets and the network and host parts')
# D2 NAT
d2=DEFS
for i,(n,a) in enumerate([('Phone','192.168.1.23'),('Laptop','192.168.1.42'),('Printer','192.168.1.50')]):
    y=20+i*72; d2+=box(20,y,140,52,n,a); d2+=ln(160,y+26,250,100+0*i,arrow=False)
d2+=box(250,66,150,76,'Router (NAT)','LAN 192.168.1.1',accent=True)+tx(325,160,'WAN 203.0.113.7',12,wt=600)
d2+=ln(400,104,470,104)+box(470,66,150,76,'Internet','sees 203.0.113.7')
d2+=tx(320,222,'Private addresses stay inside. The router swaps them for one public address.',12)
d2+=tx(320,240,'(203.0.113.7 is a documentation address, used here as a placeholder)',11,op=0.55)
D2=svg('640 252',d2,'Home network: three devices with private addresses share one public address through a NAT router')
# D3 packet journey
d3=DEFS; nodes=['Your device','Home router','ISP network','Internet routers','Web server']
for i,n in enumerate(nodes):
    x=10+i*126; d3+=box(x,40,104,52,n,accent=i in(0,4))
    if i<4: d3+=ln(x+104,66,x+126,66)
d3+='<rect x="140" y="124" width="360" height="62" rx="8" fill="currentColor" fill-opacity="0.06" stroke="currentColor" stroke-opacity="0.35"/>'
d3+=tx(320,146,'Every packet carries two IP addresses',13,wt=600)+tx(320,166,'Source: 203.0.113.7  |  Destination: 198.51.100.20',12)+tx(320,181,'Each router reads the destination and forwards it one hop closer',11,op=0.6)
d3+=tx(320,22,'Path of one request',12,op=0.6)
D3=svg('640 200',d3,'Journey of a data packet from your device through routers to a web server, each packet carrying source and destination IP addresses')
# D4 ranges
rows=[('10.0.0.0/8','Private (RFC 1918)',1),('172.16.0.0/12','Private (RFC 1918)',1),('192.168.0.0/16','Private (RFC 1918)',1),('100.64.0.0/10','Shared / carrier-grade NAT (RFC 6598)',0),('127.0.0.0/8','Loopback: this device only',0),('169.254.0.0/16','Link-local: no DHCP answer',0),('Everything else','Public, routable on the internet',2)]
d4=''
for i,(r,lab,k) in enumerate(rows):
    y=10+i*34; op=[0.22,0.1,0.06][k] if k!=2 else 0.0
    fill='var(--color-accent-primary,#0ea5e9)' if k==2 else 'currentColor'
    d4+=f'<rect x="10" y="{y}" width="620" height="28" rx="6" fill="{fill}" fill-opacity="{0.2 if k==2 else (0.12 if k==1 else 0.05)}" stroke="currentColor" stroke-opacity="0.25"/>'
    d4+=tx(24,y+19,r,13,'start',1,600)+tx(620,y+19,lab,12,'end',0.8)
D4=svg('640 250',d4,'Reserved and private IPv4 ranges compared with public addresses')
# D5 DHCP
d5=DEFS+box(40,20,130,40,'Your device')+box(470,20,130,40,'Router (DHCP)',accent=True)
d5+='<line x1="105" y1="60" x2="105" y2="270" stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="4 4"/><line x1="535" y1="60" x2="535" y2="270" stroke="currentColor" stroke-opacity="0.3" stroke-dasharray="4 4"/>'
for i,(lab,sub,right) in enumerate([('1. Discover','Anyone have an address for me?',True),('2. Offer','Take 192.168.1.42 for a while',False),('3. Request','I will take 192.168.1.42',True),('4. Acknowledge','Lease confirmed, renew before it ends',False)]):
    y=95+i*55
    d5+=ln(110,y,530,y) if right else ln(530,y,110,y)
    d5+=tx(320,y-18,lab,13,wt=600)+tx(320,y-4,sub,11,op=0.7)
D5=svg('640 290',d5,'DHCP four-step exchange: discover, offer, request, acknowledge')
def fig(s,cap): return f'<figure class="ir-fig">{s}<figcaption>{cap}</figcaption></figure>'
# ---------- content
FAQ=[
("What does an IP address do?","It gives a device a numeric address so data can be sent to it and so replies can come back. Every packet carries a source and a destination IP address, and routers use the destination to forward it."),
("Is an IP address the same as a MAC address?","No. A MAC address identifies a network adapter on the local link and normally stays with the hardware. An IP address identifies a device on a network and can change as you move between networks. See <a href=\"/learn/does-a-vpn-change-your-mac-address\">whether a VPN changes your MAC address</a>."),
("What is the difference between a public and a private IP address?","A public IP address is reachable on the internet and is assigned by your ISP. A private address, such as 192.168.1.42, works only inside your local network and is reused by millions of homes. Your router translates between them with NAT."),
("Can someone find my home address from my IP address?","Not directly. An IP address maps to an ISP and an approximate area, not to a street address. Only your ISP can link the address to your account, and it normally discloses that only through legal process. IP location is an estimate and can be wrong by a wide margin."),
("Why does my router show a different public IP than a website does?","Some ISPs place many customers behind one shared address using carrier-grade NAT (the 100.64.0.0/10 range). In that case the router's WAN address is not the one websites see. The <a href=\"/intelligence/network-route\">Network Route panel</a> shows the address and network the internet sees."),
("What is IPv6 and do I need it?","IPv6 is the newer 128-bit addressing system designed to replace IPv4, which has only about 4.3 billion addresses. You do not have to configure anything: most devices run both versions, and your ISP decides whether you get IPv6."),
("What does 192.168.1.1 mean?","It is a private address that many routers use as their default gateway, so you type it into a browser to open router settings. It is a convention, not a rule: your router may use 192.168.0.1, 10.0.0.1 or another address."),
("Does a VPN change my IP address?","Yes. While connected, websites see the VPN server's IP address instead of yours. Leaks such as WebRTC can still expose your real address, which the <a href=\"/learn/webrtc-leak-test-and-shield\">WebRTC leak test</a> checks, and the <a href=\"/intelligence/vpn-proxy\">VPN and Proxy panel</a> shows how your connection is classified."),
("Is it safe to share my IP address?","Usually yes, since every site you visit already receives it. It reveals your ISP and an approximate location, and a public IP can be targeted for denial-of-service attacks, which mostly concerns gamers and streamers. Avoid posting it publicly and use a VPN if that is a concern."),
("Does my IP address change?","Often yes. Most home connections get a dynamic address from the ISP, and your device gets a private address from the router by DHCP. Either can change when a lease expires or equipment restarts, while a static address is configured to stay the same."),
]
TOC=[('check-yours','Check your own IP'),('what-it-is','What an IP address is'),('public-private','Public vs private'),('how-it-works','How data finds you'),('ipv4-ipv6','IPv4 vs IPv6'),('static-dynamic','Static vs dynamic'),('reveals','What your IP reveals'),('sources','Sources'),('faq-heading-main','FAQ')]
def h2(n,i,t): return f'<h2 id="{i}"><span class="section-num">{n:02d}</span> {t}</h2>'
ART=f'''
<nav class="ir-toc" aria-label="Table of contents"><div class="ir-toc-label">On this page</div><ol>{"".join(f'<li><a href="#{i}">{t}</a></li>' for i,t in TOC)}</ol></nav>
{h2(1,'check-yours','Check Your Own IP Address Right Now')}
<div class="ir-tool" id="ir-tool"><div class="ir-tool-head"><span class="ir-tool-eyebrow">Live check</span><button type="button" class="ir-btn-primary" id="ir-tool-run">Check my IP</button></div><div id="ir-tool-out" aria-live="polite"><p class="ir-tool-empty">Press the button to see the public IP address, network and approximate location this page sees for you.</p></div><p class="ir-tool-note" id="ir-tool-note">Nothing from this check is stored by IntelReap.</p></div>
<div class="ir-cta-block"><span class="ir-cta-eyebrow">Network Identity panel</span><h3>Go deeper than the address</h3><p>The full panel adds ASN, routing type, proxy and hosting flags and a map. See also the <a href="/intelligence/network-route">Network Route panel</a> for who owns your network.</p><div class="ir-btn-row"><a href="/intelligence/network-identity" class="ir-btn-primary">Open Network Identity</a></div></div>
{h2(2,'what-it-is','What an IP Address Is')}
<p>An IP address (Internet Protocol address) is a number assigned to a device on a network so that data can be sent to it and answered. It does two jobs at once: it identifies the device and it says where in the network the device sits. The format is defined in <a href="https://www.rfc-editor.org/rfc/rfc791" target="_blank" rel="noopener noreferrer">RFC 791</a>.</p>
{fig(D1,'An IPv4 address is four 8-bit numbers. Part of it names the network and the rest names the device.')}
<p>The split between network and host is set by a subnet mask. That is why two devices on the same home network share their first numbers and differ only at the end.</p>
{h2(3,'public-private','Public vs Private IP Addresses')}
<p>Your home has one public address from your ISP, but every phone, laptop and printer inside has a private one. A router running NAT (network address translation) rewrites private addresses to the public one on the way out. If you want to find a device inside your network, start with the <a href="/guides/how-to-find-ip-address-of-any-device">guide to finding the IP address of any device</a>.</p>
{fig(D2,'Three devices with private addresses reach the internet through one public address on the router.')}
<div class="ir-callout"><p><strong>Rule of thumb:</strong> an address starting 192.168, 10 or 172.16 to 172.31 is private. If a website shows you a different address, that one is your public IP.</p></div>
{fig(D4,'The reserved ranges you will meet most often. Anything outside them is public.')}
<div class="ir-table-wrap" role="region" aria-label="Public and private IP address comparison" tabindex="0"><table class="ir-table"><caption>Public and private addresses compared</caption><thead><tr><th scope="col">Feature</th><th scope="col">Public IP</th><th scope="col">Private IP</th></tr></thead><tbody>
<tr><td><strong>Reachable from the internet</strong></td><td class="ir-check">Yes</td><td>No, only on the local network</td></tr>
<tr><td><strong>Assigned by</strong></td><td>Your ISP</td><td>Your router (DHCP)</td></tr>
<tr><td><strong>Unique worldwide</strong></td><td class="ir-check">Yes, at a given moment</td><td>No, reused in every home</td></tr>
<tr><td><strong>Example</strong></td><td>203.0.113.7</td><td>192.168.1.42</td></tr>
<tr><td><strong>Shows your approximate location</strong></td><td>Yes (an estimate)</td><td>No</td></tr></tbody></table></div>
{h2(4,'how-it-works','How Data Finds You')}
<p>When you open a website, your device sends a packet addressed to the site's IP address. Each router on the way reads only the destination, picks the next hop and forwards it. The reply comes back to the source address, which is how the web works without any central map. The names you type are turned into these addresses by DNS.</p>
{fig(D3,'A request travels hop by hop. Each router only needs to know the next step toward the destination.')}
{h2(5,'ipv4-ipv6','IPv4 vs IPv6')}
<p>IPv4 has 2<sup>32</sup> addresses, about 4.3 billion. IANA handed its last free IPv4 blocks to the regional registries in 2011, which is why NAT is so common. IPv6, specified in <a href="https://www.rfc-editor.org/rfc/rfc8200" target="_blank" rel="noopener noreferrer">RFC 8200</a>, uses 128 bits, enough that NAT is not needed for scarcity.</p>
<div class="ir-table-wrap" role="region" aria-label="IPv4 and IPv6 comparison" tabindex="0"><table class="ir-table"><caption>IPv4 compared with IPv6</caption><thead><tr><th scope="col">Feature</th><th scope="col">IPv4</th><th scope="col">IPv6</th></tr></thead><tbody>
<tr><td><strong>Length</strong></td><td>32 bits</td><td>128 bits</td></tr>
<tr><td><strong>Written as</strong></td><td>Four decimal numbers: 192.0.2.1</td><td>Eight hex groups: 2001:db8::1</td></tr>
<tr><td><strong>Address count</strong></td><td>About 4.3 billion</td><td>About 3.4 x 10<sup>38</sup></td></tr>
<tr><td><strong>Needs NAT</strong></td><td>Usually</td><td>No</td></tr>
<tr><td><strong>Private equivalent</strong></td><td>10/8, 172.16/12, 192.168/16</td><td>fc00::/7 (unique local)</td></tr></tbody></table></div>
{h2(6,'static-dynamic','Static vs Dynamic Addresses')}
<p>Most addresses are dynamic: a DHCP server lends one to your device for a limited time, defined in <a href="https://www.rfc-editor.org/rfc/rfc2131" target="_blank" rel="noopener noreferrer">RFC 2131</a>. A static address is set by hand or reserved on the router and does not change, which suits printers and servers.</p>
{fig(D5,'DHCP gives a device an address in four steps and the device renews it before the lease ends.')}
{h2(7,'reveals','What Your IP Address Reveals')}
<p>An IP address reveals your ISP, your network type and an approximate region. It does not reveal your name, street address or the contents of what you do. Location comes from databases that estimate it, so it can point to the wrong city, especially on mobile networks and VPNs. To see how your connection is classified, use the <a href="/intelligence/vpn-proxy">VPN and Proxy panel</a>, and for a deeper look at lookups from the other side read <a href="/learn/what-is-reverse-ip-lookup">what a reverse IP lookup is</a>.</p>
<div class="ir-logic-grid"><div class="ir-logic-card"><span class="ir-logic-eyebrow">Logic</span><p>Explain the address first as a label (what), then as a route (how), then as a privacy signal (what it reveals), because each step depends on the previous one.</p></div>
<div class="ir-logic-card"><span class="ir-logic-eyebrow">Methodology</span><p>Definitions and ranges follow the RFCs listed below. The live check reads your connection's public IP through the IntelReap backend; location fields are estimates. Example addresses come from reserved documentation ranges.</p></div></div>
'''
CITES=[('RFC 791: Internet Protocol','https://www.rfc-editor.org/rfc/rfc791'),('RFC 8200: Internet Protocol, Version 6 (IPv6) Specification','https://www.rfc-editor.org/rfc/rfc8200'),('RFC 1918: Address Allocation for Private Internets','https://www.rfc-editor.org/rfc/rfc1918'),('RFC 2131: Dynamic Host Configuration Protocol','https://www.rfc-editor.org/rfc/rfc2131'),('RFC 6598: IANA-Reserved IPv4 Prefix for Shared Address Space','https://www.rfc-editor.org/rfc/rfc6598'),('RFC 5737: IPv4 Address Blocks Reserved for Documentation','https://www.rfc-editor.org/rfc/rfc5737'),('IANA IPv4 Address Space Registry','https://www.iana.org/assignments/ipv4-address-space/ipv4-address-space.xhtml')]
cite_html=''.join(f'<div class="ndic-citation-item"><span class="ndic-citation-num">{i+1:02d}</span><span class="ndic-citation-link"><a href="{u}" target="_blank" rel="noopener noreferrer">{H.escape(t)}</a></span></div>' for i,(t,u) in enumerate(CITES))
faq_html=''.join(f'<div class="ndic-faq-item"><button class="ndic-faq-question" aria-expanded="false" aria-controls="faq-a{i+1}"><span>{q}</span><span class="ndic-faq-chevron" aria-hidden="true"><svg viewBox="0 0 14 14" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M2 5l5 5 5-5"/></svg></span></button><div class="ndic-faq-answer" id="faq-a{i+1}"><div class="ndic-faq-answer-inner">{a}</div></div></div>' for i,(q,a) in enumerate(FAQ))
# ---------- apply
h=h.replace(OLD,URL)
h=re.sub(r'<title>.*?</title>',f'<title>{TITLE} — IntelReap</title>',h,1)
h=re.sub(r'(<meta name="description" content=")[^"]*',r'\g<1>'+DESC,h,1)
h=re.sub(r'<meta name="keywords" content="[^"]*">','<meta name="keywords" content="what is an ip address, what is ip address, how do ip addresses work, public vs private ip address, ipv4 vs ipv6, static vs dynamic ip">',h,1)
h=re.sub(r'(og:title"\s+content=")[^"]*',r'\g<1>'+TITLE+' — IntelReap',h,1)
h=re.sub(r'(og:description"\s+content=")[^"]*',r'\g<1>'+DESC,h,1)
h=re.sub(r'(twitter:title"\s+content=")[^"]*',r'\g<1>'+TITLE+' — IntelReap',h,1)
h=re.sub(r'(twitter:description"\s+content=")[^"]*',r'\g<1>'+DESC,h,1)
h=h.replace('content="article"','content="article"',1)
# JSON-LD
m=re.search(r'<script type="application/ld\+json">(.*?)</script>',h,re.S); ld=json.loads(m.group(1))
for n in ld['@graph']:
    t=n.get('@type')
    if t=='Article': n.update(headline=TITLE,description=DESC,datePublished=DATE,dateModified=DATE)
    if t=='WebPage': n.update(name=TITLE+' — IntelReap',description=DESC); n['datePublished']=DATE; n['dateModified']=DATE
    if t=='FAQPage': n['mainEntity']=[{'@type':'Question','name':re.sub('<[^>]+>','',q),'acceptedAnswer':{'@type':'Answer','text':re.sub('<[^>]+>','',a)}} for q,a in FAQ]
    if t=='BreadcrumbList':
        els=n['itemListElement']; els[1].update(name='Learn',item='https://intelreap.com/learn/'); els[-1].update(name='What Is an IP Address?',item=URL)
h=h[:m.start(1)]+json.dumps(ld,indent=2,ensure_ascii=False)+h[m.end(1):]
# breadcrumb
h=re.sub(r'<a href="/guides/">Guides</a>','<a href="/learn/">Learn</a>',h,1)
h=re.sub(r'(<span class="ir-breadcrumb-current" aria-current="page">)[^<]*',r'\g<1>What Is an IP Address?',h,1)
# hero
a=h.find('<div class="ndic-hero-badge">'); b=h.find('<div id="freshness-badge"'); assert 0<a<b,'hero'
hero='''<div class="ndic-hero-badge"><span class="ndic-hero-badge-dot" aria-hidden="true"></span><span id="seasonal-label">Networking Basics</span></div>
        <h1 class="ndic-hero-title">What Is an <span class="ndic-highlight">IP Address</span>?</h1>
        <p class="ndic-hero-tagline">How IP addresses work, the difference between public and private, IPv4 and IPv6, and what your own address reveals, with a live check.</p>
        <div class="ndic-hero-cta-group"><a href="#check-yours" class="ir-btn-primary cta-rotate">Check My IP</a><a href="/intelligence/network-identity" class="ir-btn-secondary">Open Network Identity →</a></div>
        '''
h=h[:a]+hero+h[b:]
h=h.replace('Last updated 2 October 2026','Last updated 30 October 2026')
# quick answer
a=h.find('<section class="ndic-quick-answer">'); assert a>0,'qa'; b=h.find('</section>',a)+10
qa='<section class="ndic-quick-answer"><div class="ndic-quick-answer-label">Quick Answer</div><h2 class="ndic-quick-answer-title">An IP address is a device\'s network address</h2><p class="ndic-quick-answer-body">An IP address (Internet Protocol address) is a number that identifies a device on a network and tells other devices where to send data. IPv4 addresses look like 192.168.1.42 and IPv6 addresses look like 2001:db8::1. Your home has one public address and each device has a private one.</p></section>'
h=h[:a]+qa+h[b:]
# article body up to citations
am=re.search(r'<article class="ir-article"[^>]*>',h); assert am,'article tag'; a=am.end(); b=h.find('<!-- CITATIONS -->'); assert b>a,'citations marker'
h=h[:a]+ART+'\n'+h[b:]
h=h.replace('<section class="ndic-citation-section" aria-labelledby="citation-heading">','<section class="ndic-citation-section" id="sources" aria-labelledby="citation-heading">',1)
s,e=div_span(h,'<div class="ndic-citation-list">'); h=h[:s]+'<div class="ndic-citation-list">'+cite_html+'</div>'+h[e:]
s,e=div_span(h,'<div class="ndic-faq-list">'); h=h[:s]+'<div class="ndic-faq-list">'+faq_html+'</div>'+h[e:]
h=re.sub(r'(<p class="ir-faq-sub">).*?(</p>)',r'\g<1>Ten questions on public and private addresses, NAT, IPv6, DHCP, privacy and what an IP address does and does not reveal.\g<2>',h,1,flags=re.S)
# css + script
CSS='''<style>
.ir-toc{border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:10px;padding:1rem 1.25rem;margin:0 0 2rem}.ir-toc-label{font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;opacity:.7;margin-bottom:.5rem}.ir-toc ol{margin:0;padding-left:1.25rem;columns:2;column-gap:2rem}.ir-toc li{margin:.2rem 0}@media(max-width:600px){.ir-toc ol{columns:1}}
.ir-fig{margin:1.75rem 0}.ir-fig svg{width:100%;height:auto;display:block;color:var(--color-text-primary,#e2e8f0)}.ir-fig figcaption{font-size:.85rem;opacity:.75;margin-top:.5rem;text-align:center}
.ir-tool{border:1px solid color-mix(in srgb,var(--color-accent-primary,#0ea5e9) 35%,transparent);border-radius:10px;padding:1.25rem;margin:1rem 0 1.5rem}.ir-tool-head{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap}.ir-tool-eyebrow{font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;opacity:.7}.ir-tool dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:.5rem 1.5rem;margin:1rem 0 0}.ir-tool-row dt{font-size:.75rem;opacity:.65}.ir-tool-row dd{margin:0;font-weight:600;word-break:break-word}.ir-tool-note,.ir-tool-empty{font-size:.85rem;opacity:.75;margin:.75rem 0 0}
</style>
</head>'''
h=h.replace('</head>',CSS,1)
JS='''<script src="../assets/js/config.js"></script>
<script>
(function(){var b=document.getElementById('ir-tool-run'),o=document.getElementById('ir-tool-out'),n=document.getElementById('ir-tool-note');if(!b||typeof NDIC_CONFIG==='undefined')return;
var F=[['ip','Public IP'],['ipVersion','IP version'],['isp','ISP'],['org','Organization'],['country','Country'],['region','Region'],['city','City'],['connectionType','Connection type']];
function e(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function yn(v){return v===true?'Yes':v===false?'No':'-'}
function run(){n.textContent='Checking...';b.disabled=true;var c=new AbortController(),t=setTimeout(function(){c.abort()},10000);
fetch(NDIC_CONFIG.BACKEND_URL+NDIC_CONFIG.ENDPOINTS.ipIdentity,{signal:c.signal}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){if(!j||!j.success||!j.data)throw 0;var d=j.data,h='';
F.forEach(function(f){h+='<div class="ir-tool-row"><dt>'+f[1]+'</dt><dd>'+e(d[f[0]]||'-')+'</dd></div>'});
h+='<div class="ir-tool-row"><dt>Proxy flag</dt><dd>'+yn(d.proxy)+'</dd></div><div class="ir-tool-row"><dt>Hosting flag</dt><dd>'+yn(d.hosting)+'</dd></div>';
o.innerHTML='<dl>'+h+'</dl>';n.textContent='Location is an estimate from the IP address, not GPS. Nothing from this check is stored by IntelReap.'}).catch(function(){n.textContent='Tap to refresh.'}).then(function(){clearTimeout(t);b.disabled=false;b.textContent='Refresh'})}
b.addEventListener('click',run)})();
</script>
</body>'''
i=h.rfind('</body>'); h=h[:i]+JS+h[i+7:]
open(OUT,'w',encoding='utf-8').write(h)
# learn index
li=open('learn/index.html',encoding='utf-8').read()
card=f'''        <a class="hub-card" href="/learn/{SLUG}">
          <span class="hub-card-kicker">Article</span>
          <span class="hub-card-title">What Is an IP Address?</span>
          <span class="hub-card-desc">An IP address is the number that lets devices find each other on a network. Learn IPv4 vs IPv6, public vs private, NAT, DHCP and what your IP reveals...</span>
        </a>
'''
k=li.rfind('class="hub-card"'); k=li.find('</a>\n',k)+5; li=li[:k]+card+li[k:]
pos=len(re.findall(r'"@type": "ListItem"',li[li.find('"ItemList"'):li.find('"ItemList"')+6000]))
j=li.find('"https://intelreap.com/learn/what-is-a-gpu"')  # locate itemList by last ListItem url
last=[m for m in re.finditer(r'"url": "https://intelreap.com/learn/[^"]+"\n(\s*)\}',li)][-1]
n=len(re.findall(r'"position":',li[:last.end()]))
li=li[:last.end()]+f',\n        {{\n          "@type": "ListItem",\n          "position": {n+1},\n          "name": "What Is an IP Address?",\n          "url": "{URL}"\n        }}'+li[last.end():]
open('learn/index.html','w',encoding='utf-8').write(li)
print('built',len(h),'bytes; learn index updated; position',n+1)

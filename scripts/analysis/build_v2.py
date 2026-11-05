import re,collections
def vol(s):
    s=s.strip()
    return int(float(s[:-1])*(1e6 if s.endswith('M') else 1e3)) if s[-1] in 'KM' else int(s)
def norm(k): return re.sub(r"\s+"," ",re.sub(r"[^a-z0-9 ]","",k.lower().replace("can t","cant").replace("\u200b","")))
TITLES={
'HUB':'How to Find an IP Address (existing guide, retitled hub)',
'P1':'What Is an IP Address and How Does It Work?','P2':"What Is My IP Address? (live tool page)",
'P3':'How to Find Your IP Address on iPhone and Android','P4':'How to Find Your IP Address on Windows, Mac and Linux',
'P5':'Does Your IP Address Change? Static vs Dynamic','P6':'How to Change Your IP Address',
'P7':'How to Change Your IP Address on iPhone and Android','P8':'How to Change the IP Address of One Device (Windows 11, static/local)',
'P9':'How to Hide or Mask Your IP Address','P10':'Can an IP Address Be Hacked?',
'P12':'What an Email or IP Reveals About a Sender (defensive framing; policy-sensitive)',
'P13':"How to Find a Printer's IP Address",'P14':"How to Find Your Router's IP Address",'P15':"How to Find a Roku's IP Address",
'P16':"'Can't Get a Teredo IP Address' on Xbox and Windows",'P17':"'Can't Obtain IP Address Within Time Limit' Fixes",
'P18':"How to Find a Website's IP Address",'P19':'IP Address Lookup: Location, Owner and Trace (absorbs old P11)',
'R1':'Reverse IP Lookup (retarget existing learn/what-is-reverse-ip-lookup)',
'D1':'How to Fix Slow DNS Lookup','D2':'What Is My DNS Server? How to Find It','D3':'DNS Lookup: What It Is and How to Run One',
'D4':'nslookup and dig: Commands and Examples','D5':'A Records and MX Records Explained','D6':'Reverse DNS (PTR) Lookup Explained',
'S1':'What Is a Good Internet Speed? (and how much you need)','S2':'Is 300 Mbps Fast? (and 50/100/150/250 Mbps/1 Gig)',
'S3':'What Is a Latency Test? (ping, jitter, am I online)','S4':'How to Fix Slow Internet / Speed It Up',
'S5':'How to Test and Check Your Internet Speed (tool page)','S6':'Does a VPN Slow Down Your Internet?',
'W0':'WebRTC Leak Test and Shield (retarget existing learn article)','W1':'What Is WebRTC and How Does It Work?','W2':'How to Enable or Disable WebRTC (Chrome, Firefox, Brave, Edge, Safari)',
'X-ISP':'EXCLUDED: ISP / commercial / lead-gen / navigational','X-NOISE':'EXCLUDED: off-topic or developer/bug noise'}
# ---- old map
old={};cur=None
for l in open('/mnt/user-data/outputs/intelreap-keyword-map.md',encoding='utf-8'):
    m=re.match(r'## (P\d+)',l)
    if m: cur=m.group(1)
    elif l.startswith('- ') and cur: old[l[2:].strip()]=cur
def remap_old(k,p):
    if p=='P11': return 'P19'
    if p=='P2' and k.startswith(('how','how to')): return 'HUB'
    if p=='P12' and 'lookup' in k: return 'P19'
    if k=='how can you find ip address': return 'HUB'
    return p
# ---- classifier for new rows
NOISE=r"alternator|tb positive|speed sound|speed of voice|shutter|muscular|bcm|fuel gauge|securitas|autism|alexa|wifi calling|how fast is my computer|antenna|dataafrica|webrtc chrome 14|webrtc news|playback issues|test webrtc agents|create webrtc server|websocket|how many users|need a server|cisco|wordpress|hostname naming|hughesnet|^how fast is$|^how fast it is$|^how is ip$|connect to wifi|spectrum internet|how fast is spectrum"
def classify(k):
    if re.search(NOISE,k): return 'X-NOISE'
    if 'webrtc' in k or 'web rtc' in k or 'rtc chat' in k:
        if re.search(r'leak|shield|control|extension|webrtc test|test webrtc',k): return 'W0'
        if re.search(r'enable|disable|allow|support|safari',k): return 'W2'
        return 'W1'
    if 'dns' in k or 'nslookup' in k or k in('what is dig','a mx') or re.search(r'\ba (mx|records?)\b|mx server|record check',k):
        if 'slow dns' in k: return 'D1'
        if re.search(r'reverse|hostname|ip dns',k): return 'D6'
        if 'nslookup' in k or k=='what is dig': return 'D4'
        if re.search(r'\ba (record|records|mx)\b|mx server|record check',k): return 'D5'
        if re.search(r'my dns|what dns|find dns|find my dns|view dns|dns server address|know my dns|check dns|determine if|domain name system|who is my dns|dns of google|do you find dns|how do you find dns|get dns',k): return 'D2'
        return 'D3'
    if re.search(r'reverse (ip|resolve|whois)|ip reverse|ip address reverse|reverse lookup an ip',k): return 'R1'
    if 'dns' in k: return 'D3'
    if re.search(r'vpn',k): return 'S6'
    if re.search(r'latency|online now',k): return 'S3'
    if re.search(r'mbps|1 gig|kbps|how much is 300',k): return 'S2'
    if re.search(r'good (internet )?speed|good speed of internet|how much internet speed|what internet speed do i need',k): return 'S1'
    if re.search(r'slow|increase|speed up|upload speed',k): return 'S4'
    if re.search(r'speed|how fast i my|how fast is my wireless',k): return 'S5'
    if re.search(r'iphone',k): return 'P3'
    if re.search(r'of a computer|ip of a computer|on computer|on a computer',k): return 'P4'
    if re.search(r'website|site ip|ip of website',k): return 'P18'
    if re.search(r'someone|person by ip|track|get someones|find someones',k): return 'P12'
    if 'nord' in k: return 'P2'
    if re.search(r'hostname',k): return 'D6'
    if re.search(r'locat|trace|where is|look ?up|lookup|identify an ip|address from an ip|address of ip|show location|search an ip',k): return 'P19'
    return 'HUB'
# ---- ingest
rows=collections.OrderedDict(); raw=0
for l in open('newset.txt',encoding='utf-8'):
    kw,v,kd,cpc=l.strip().split('|'); raw+=1
    n=norm(kw); r=dict(kw=kw,vol=vol(v),kd=kd,cpc=cpc)
    if n not in rows or r['vol']>rows[n]['vol']: rows[n]=r
isp=[l.strip() for l in open('isp.txt',encoding='utf-8') if l.strip()]
pages=collections.defaultdict(list); seen_old=set(); overlap=[]
for k,p in old.items():
    n=norm(k); pages[remap_old(k,p)].append(dict(kw=k,vol=None,kd='',cpc='',src='v1')); seen_old.add(n)
for n,r in rows.items():
    if n in seen_old: overlap.append(r['kw']); continue
    # keep v1 assignment for any old-page keyword; new rows classified fresh
    r['src']='v2'; pages[classify(r['kw'])].append(r)
for k in isp: pages['X-ISP'].append(dict(kw=k,vol=None,kd='',cpc='',src='v2'))
# fix: ISP row that is really existing-article coverage
# ---- output
order=['HUB']+[f'P{i}' for i in range(1,20) if i!=11]+['R1','S1','S2','S3','S4','S5','S6','W0','W1','W2','D1','D2','D3','D4','D5','D6','X-ISP','X-NOISE']
out=["# IntelReap keyword map v2 (dedupes and classifies v1 + the full new paste)\n"]
tot=0; summ=[]
for pid in order:
    L=pages.get(pid,[])
    if not L and pid not in('P11',): continue
    L.sort(key=lambda r:-(r['vol'] or 0))
    if not pid.startswith('X'): tot+=len(L)
    top=next((r for r in L if r['vol']),None)
    prim=f" | primary: {top['kw']} ({top['vol']:,}, KD {top['kd']}, CPC {top['cpc']})" if top else ""
    sv=sum(r['vol'] or 0 for r in L); summ.append((pid,TITLES[pid],len(L),sv))
    out.append(f"\n## {pid} - {TITLES[pid]} ({len(L)}){prim}")
    for r in L:
        extra=f" [{r['vol']:,} | KD {r['kd']} | ${r['cpc']}]" if r['vol'] else ""
        out.append(f"- {r['kw']}{extra}")
open('/mnt/user-data/outputs/intelreap-keyword-map-v2.md','w',encoding='utf-8').write("\n".join(out)+"\n")
print("new paste rows (excl ISP list):",raw,"| ISP list rows:",len(isp))
print("unique new after normalisation:",len(rows),"| duplicates removed:",raw-len(rows))
print("already in v1 map (overlap):",len(overlap))
print("v1 keywords carried:",len(old))
print("assigned to pages (non-excluded):",tot)
for pid,t,n,sv in summ: print(f"{pid:8}{n:4}  {sv:>9,}  {t[:70]}")

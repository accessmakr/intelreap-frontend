"""Verify generated pages: structure, JSON-LD, anchors, links, picker tool, emulated phone render. Usage: verify.py slug [slug...]"""
import re,json,os,sys,subprocess,time
from html.parser import HTMLParser
from playwright.sync_api import sync_playwright
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
VOID={'meta','link','br','img','input','hr','source','path','circle','rect','line','polyline','polygon'}
class V(HTMLParser):
    def __init__(s): super().__init__(); s.st=[]; s.err=[]; s.ids=[]
    def handle_starttag(s,t,a):
        d=dict(a)
        if 'id' in d: s.ids.append(d['id'])
        if t not in VOID: s.st.append(t)
    def handle_startendtag(s,t,a):
        d=dict(a)
        if 'id' in d: s.ids.append(d['id'])
    def handle_endtag(s,t):
        if t in VOID: return
        if s.st and s.st[-1]==t: s.st.pop()
        else: s.err.append(t)
def static(slug):
    f=f'{ROOT}/learn/{slug}.html'; h=open(f,encoding='utf-8').read(); v=V(); v.feed(h); r=[]
    r.append(('tags balanced',not v.st and not v.err)); r.append(('unique ids',len(v.ids)==len(set(v.ids))))
    ok=True
    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>',h,re.S):
        try: json.loads(m.group(1))
        except Exception: ok=False
    r.append(('JSON-LD parses',ok))
    toc=re.findall(r'<a href="#([^"]+)"',h); r.append(('TOC anchors resolve',all(t in v.ids for t in toc)))
    links=set(re.findall(r'href="(/[^"#]*)"',h)); miss=[l for l in links if not(os.path.exists(f'{ROOT}{l}.html') or os.path.exists(f'{ROOT}{l}/index.html') or l=='/' or os.path.exists(f'{ROOT}{l}'))]
    r.append(('internal links resolve '+str(miss),not miss)); r.append(('4+ diagrams',h.count('<figure class="ir-fig">')>=4)); r.append(('>=8 FAQ',h.count('ndic-faq-item"')>=8))
    r.append(('no stale old-guide text',not any(w in h for w in ['Minecraft','HP printer'])))
    fq=re.search(r'class="ir-faq-sub">(\w+) questions',h); words_={'Nine':9,'Ten':10,'Eleven':11,'Twelve':12,'Thirteen':13,'Fourteen':14,'Fifteen':15}; r.append(('FAQ sub-line count matches',(not fq) or words_.get(fq.group(1),-1)==h.count('ndic-faq-item"') or fq.group(1).isdigit() and int(fq.group(1))==h.count('ndic-faq-item"')))
    lg=h.find('<div class="ir-logic-grid">'); fq=h.find('<section aria-labelledby="faq-heading-main">'); r.append(('FAQ sits before Logic/Sources',fq>0 and (lg<0 or fq<lg)))
    bd=re.search(r'id="freshness-badge"[^>]*>Last updated ([^<]*)<',h); ld=re.search(r'"dateModified":\s*"([^"]+)"',h); om=re.search(r'article:modified_time" content="([^"T]+)',h)
    import datetime as _d; MON=['January','February','March','April','May','June','July','August','September','October','November','December']
    def _lab(s): y,m_,d_=map(int,s.split('-')); return f"{d_} {MON[m_-1]} {y}"
    r.append(('date consistent (badge, JSON-LD, meta)',bool(bd and ld and om and bd.group(1).strip()==_lab(ld.group(1)) and om.group(1)==ld.group(1))))
    import html as _h
    def _tk(x): return set(re.findall(r"[a-z0-9.:']{3,}",' '.join(_h.unescape(t) for t in re.findall(r'<text[^>]*>(.*?)</text>',x,re.S)).lower()))
    bad=[]
    for i,fg in enumerate(re.findall(r'<figure class="ir-fig">.*?</figure>',h,re.S),1):
        sv=re.findall(r'<svg([^>]*)>(.*?)</svg>',fg,re.S); dw=[b for a,b in sv if 'd-m' not in a]; mb=[b for a,b in sv if 'd-m' in a]
        if dw and mb:
            a_,b_=_tk(dw[0]),_tk(mb[0])
            if len(a_&b_)/max(1,min(len(a_),len(b_)))<0.5: bad.append(i)
    r.append(('phone and desktop drawings of each figure carry the same labels (mismatched: '+str(bad)+')',not bad))
    r.append(('title<=62',len(re.search(r'<title>(.*?)</title>',h).group(1))<=62)); r.append(('desc<=160',len(re.search(r'name="description" content="([^"]*)"',h).group(1))<=160))
    return r
def phone(slugs):
    srv=subprocess.Popen(['python3','-m','http.server','8765'],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1.5); out={}
    try:
        with sync_playwright() as p:
            b=p.chromium.launch()
            for slug in slugs:
                res=[]
                for scheme in ('light','dark'):
                    ctx=b.new_context(**p.devices['Pixel 7'],color_scheme=scheme,service_workers='block'); pg=ctx.new_page(); errs=[]
                    pg.on('pageerror',lambda e:errs.append(str(e)[:100])); pg.route(lambda u:not u.startswith('http://localhost'),lambda r:r.abort())
                    pg.goto(f'http://localhost:8765/learn/{slug}.html'); pg.wait_for_timeout(900)
                    ov=pg.evaluate('document.documentElement.scrollWidth>innerWidth'); n=pg.evaluate("document.querySelectorAll('#ir-pick option').length")
                    counts=[]
                    for i in range(n): pg.select_option('#ir-pick',str(i)); counts.append(pg.evaluate("document.querySelectorAll('#ir-steps li').length"))
                    tw=pg.evaluate("[...document.querySelectorAll('.ir-table-wrap')].some(e=>e.scrollWidth>e.clientWidth+1)")
                    res.append((scheme,'overflow' if ov else 'no overflow','options',n,'steps/option',counts,'table scroll' if tw else 'tables fit','errors',errs))
                    if scheme=='light':
                        pg.screenshot(path=f'/home/claude/work/shots/{slug}_top.png'); pg.locator('#ir-tool').screenshot(path=f'/home/claude/work/shots/{slug}_tool.png')
                        for k in [i for i in (0,2,4) if i<pg.locator('.ir-fig').count()]: pg.locator('.ir-fig').nth(k).screenshot(path=f'/home/claude/work/shots/{slug}_fig{k+1}.png')
                    ctx.close()
                out[slug]=res
            b.close()
    finally: srv.terminate()
    return out
if __name__=='__main__':
    for s in sys.argv[1:]:
        print('==',s); [print('  ','PASS' if ok else 'FAIL',n) for n,ok in static(s)]
    for s,res in phone(sys.argv[1:]).items():
        for r in res: print('  phone',s,*r)

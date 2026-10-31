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
    r.append(('internal links resolve '+str(miss),not miss)); r.append(('5 diagrams',h.count('<figure class="ir-fig">')>=5)); r.append(('>=8 FAQ',h.count('ndic-faq-item"')>=8))
    r.append(('no stale old-guide text',not any(w in h for w in ['Minecraft','Twelve questions','HP printer'])))
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
                        for k in (0,2,4): pg.locator('.ir-fig').nth(k).screenshot(path=f'/home/claude/work/shots/{slug}_fig{k+1}.png')
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

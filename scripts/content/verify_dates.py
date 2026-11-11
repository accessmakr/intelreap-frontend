"""Repo-wide date check. Fails (exit 1) if any page shows or declares a date that disagrees with docs/data/page-dates.json,
shows more than one date, shows a published/effective date, or if any script writes dates at run time.
Usage: python3 scripts/content/verify_dates.py"""
import json,re,os,sys,glob,html
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
sys.path.insert(0,os.path.dirname(__file__))
from apply_dates import label,DATES
def rd(p): return open(os.path.join(ROOT,p),encoding='utf-8').read()
def vis(h):
    for t in ['head','script','style','svg']: h=re.sub(rf'<{t}[\s>].*?</{t}>','',h,flags=re.S|re.I)
    return html.unescape(re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',h)))
fails=[]
def chk(page,ok,msg):
    if not ok: fails.append(f'{page}: {msg}')
sm=dict(re.findall(r'<loc>https://intelreap.com([^<]*)</loc>\s*<lastmod>([^<]*)</lastmod>',rd('sitemap.xml')))
pj={x['file']:x['lastmod'] for x in json.loads(rd('pages.json'))}
for f,e in DATES.items():
    h=rd(f); pub=e.get('published'); mod=e['modified']; L=label(mod)
    ldp=re.findall(r'"datePublished"\s*:\s*"([^"]+)"',h); ldm=re.findall(r'"dateModified"\s*:\s*"([^"]+)"',h)
    if pub: chk(f,bool(ldp) and set(ldp)=={pub},f'LD datePublished {ldp} != {pub}')
    else: chk(f,not ldp,f'unexpected datePublished {ldp}')
    if e['kind']!='home': chk(f,bool(ldm) and set(ldm)=={mod},f'LD dateModified {ldm} != {mod}')
    if e['kind']=='article':
        chk(f,re.findall(r'article:published_time" content="([^"T]+)',h)==[pub],'article:published_time mismatch')
        chk(f,re.findall(r'article:modified_time" content="([^"T]+)',h)==[mod],'article:modified_time mismatch')
    v=vis(h)
    if e['kind']=='legal':
        chk(f,len(re.findall(r'Last Updated',v))==1 and f'Last Updated {L}' in v,f'legal Last Updated is not {L}')
        chk(f,'Effective' not in v,'legal page still shows an Effective date')
    elif e['kind'] in ('article','home','panel','hub'):
        b=re.findall(r'<div id="freshness-badge"([^>]*)>([^<]*)</div>',h)
        chk(f,len(b)==1,f'{len(b)} badges (need exactly 1)')
        if b: chk(f,'data-fixed' in b[0][0] and b[0][1].strip()==f'Last updated {L}',f'badge reads {b[0][1].strip()!r}, expected Last updated {L}')
    # no other labelled date and no published date on screen
    chk(f,not re.search(r'(?i)\b(published|posted|effective|first published)\b\s*:?\s*(on\s*)?(\d{1,2}\s+\w+\s+\d{4}|\w+\s+\d{1,2},?\s+\d{4}|20\d\d-\d\d-\d\d)',v),'a published/effective date is shown on screen')
    n=len(re.findall(r'(?i)last updated\s*:?\s*(\d{1,2}\s+\w+\s+\d{4}|\w+\s+\d{1,2},?\s+\d{4})',v)); chk(f,n<=1,f'{n} "last updated" dates on screen')
    url='/'+f.replace('.html',''); url='/' if f=='index.html' else (url.replace('/index','/') if f.endswith('/index.html') else url)
    key='' if f=='index.html' else url; chk(f,sm.get(key)==mod,f'sitemap lastmod {sm.get(key)} != {mod}'); chk(f,pj.get(f)==mod,f'pages.json lastmod {pj.get(f)} != {mod}')
# every indexed page must have an entry in the dates file (a new page without one would silently escape every check above)
for f in pj:
    chk(f,f in DATES,'listed in pages.json but missing from docs/data/page-dates.json')
# nothing may write dates at run time
for p in sorted(glob.glob(os.path.join(ROOT,'**/*.html'),recursive=True)):
    rel=os.path.relpath(p,ROOT)
    if rel.startswith(('node_modules','.git')): continue
    h=open(p,encoding='utf-8').read()
    for m in re.finditer(r'<script(?![^>]*(?:src=|application/ld\+json))[^>]*>(.*?)</script>',h,re.S):
        b=m.group(1); chk(rel,not re.search(r'getDay\(\)|freshness-badge|Last updated|dateModified|datePublished',b),'inline script touches a date or the badge')
for js,bad in [('js/schema.js',r"datePublished:\s*'\d|dateModified:\s*'\d|every Monday"),('js/root-config.js',r'siteLastModified|getFreshnessBadge|injectFreshnessBadge|getSchemaDateModified')]:
    chk(js,not re.search(bad,rd(js)),'run-time date logic present')
print(f'{len(DATES)} pages checked, {len(fails)} problems')
for x in fails: print('  FAIL',x)
sys.exit(1 if fails else 0)

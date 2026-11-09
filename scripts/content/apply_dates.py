"""Apply docs/data/page-dates.json to every page. Idempotent.
Only the 'Last updated' date is ever shown on a page. Published and modified dates live in the page's JSON-LD
(and article:published_time / article:modified_time on articles and guides). Nothing sets a date at run time.
Usage: python3 scripts/content/apply_dates.py   (from the repo root, or anywhere)"""
import json,re,os,datetime as D
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
DATES=json.load(open(os.path.join(ROOT,'docs','data','page-dates.json'),encoding='utf-8'))['pages']
MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December']
def label(iso): y,m,d=map(int,iso.split('-')); return f'{d} {MONTHS[m-1]} {y}'
BADGE=lambda iso:f'<div id="freshness-badge" data-fixed="true" aria-live="polite">Last updated {label(iso)}</div>'
LD=re.compile(r'(<script type="application/ld\+json"[^>]*>)(.*?)(</script>)',re.S)
def fix_ld(h,pub,mod):
    def one(m):
        body=m.group(2)
        if '"dateModified"' not in body and '"datePublished"' not in body: return m.group(0)
        if mod: body=re.sub(r'("dateModified"\s*:\s*")[^"]*(")',r'\g<1>'+mod+r'\g<2>',body)
        if pub:
            if '"datePublished"' in body: body=re.sub(r'("datePublished"\s*:\s*")[^"]*(")',r'\g<1>'+pub+r'\g<2>',body)
            else: body=re.sub(r'(\s*)("dateModified"\s*:)',lambda x:x.group(1)+'"datePublished": "'+pub+'",'+x.group(1)+x.group(2),body,1)
        json.loads(body)  # must stay valid JSON
        return m.group(1)+body+m.group(3)
    return LD.sub(one,h)
def fix_meta(h,pub,mod):
    if pub: h=re.sub(r'(<meta property="article:published_time" content=")[^"]*(")',r'\g<1>'+pub+r'T00:00:00Z\g<2>',h)
    if mod: h=re.sub(r'(<meta property="article:modified_time" content=")[^"]*(")',r'\g<1>'+mod+r'T00:00:00Z\g<2>',h)
    return h
def fix_visible(h,kind,mod):
    L=label(mod)
    if kind in ('article','home'):
        new,n=re.subn(r'<div id="freshness-badge"[^>]*>[^<]*</div>',BADGE(mod),h,1); assert n==1,'badge missing'; return new
    if kind=='legal':
        h=re.sub(r'\s*<div class="legal-meta-item">\s*<span class="legal-meta-label">Effective</span>\s*<span class="legal-meta-value">[^<]*</span>\s*</div>','',h)
        new,n=re.subn(r'(<span class="legal-meta-label">Last Updated</span>\s*<span class="legal-meta-value">)[^<]*(</span>)',r'\g<1>'+L+r'\g<2>',h,1); assert n==1,'legal date missing'; return new
    if kind in ('panel','hub'):
        if 'id="freshness-badge"' in h: return re.sub(r'<div id="freshness-badge"[^>]*>[^<]*</div>',BADGE(mod),h,1)
        pat=r'(<p class="ndic-deepdive-intro"[^>]*>.*?</p>)' if kind=='panel' else r'(<header class="hub-hero">.*?</h1>)'
        new,n=re.subn(pat,lambda m:m.group(1)+'\n        '+BADGE(mod),h,1,flags=re.S); assert n==1,'hero anchor missing'; return new
    return h
if __name__=='__main__':
    changed=0
    for f,e in DATES.items():
        p=os.path.join(ROOT,f); h=open(p,encoding='utf-8').read(); o=h
        h=fix_ld(h,e.get('published'),e['modified']); h=fix_meta(h,e.get('published'),e['modified']); h=fix_visible(h,e['kind'],e['modified'])
        if h!=o: open(p,'w',encoding='utf-8').write(h); changed+=1; print('updated',f)
    print(f'{changed} of {len(DATES)} pages changed')

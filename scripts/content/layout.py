"""Page layout and date helpers shared by every content tool.
move_faq: FAQ sits right after the main content, before Logic/Methodology and Sources.
stamp: one real date, written everywhere a page shows or declares it (visible badge, JSON-LD dateModified, article:modified_time)."""
import re,json,datetime,os,sys
MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December']
def today(): return datetime.datetime.now(datetime.timezone.utc).date()
def label(d): return f"{d.day} {MONTHS[d.month-1]} {d.year}"
def move_faq(h):
    m=re.search(r'(?:<!-- FAQ -->\s*)?<section aria-labelledby="faq-heading-main">.*?</section>',h,re.S)
    k=h.find('<div class="ir-logic-grid">')
    if not m or k<0 or m.start()<k: return h
    block=m.group(0); h=h[:m.start()]+h[m.end():]; k=h.find('<div class="ir-logic-grid">')
    h=h[:k]+block+'\n'+h[k:]
    a='<li><a href="#faq-heading-main">FAQ</a></li>'; b='<li><a href="#sources">Sources</a></li>'
    if a in h and b in h and h.find(a)>h.find(b): h=h.replace(a,'',1).replace(b,a+b,1)
    return h
def stamp(h,d,visible=True):
    iso=d.isoformat()
    if visible and 'id="freshness-badge"' in h:
        h=re.sub(r'<div id="freshness-badge"([^>]*)>[^<]*</div>',lambda m:'<div id="freshness-badge"'+(m.group(1) if 'data-fixed' in m.group(1) else ' data-fixed="true"'+m.group(1))+f'>Last updated {label(d)}</div>',h,1)
        h=re.sub(r"\s*\(\(\)=>\{const badge=document\.getElementById\('freshness-badge'\).*?\}\)\(\);",'',h,1,flags=re.S)
    m=re.search(r'<script type="application/ld\+json">(.*?)</script>',h,re.S)
    if m:
        ld=json.loads(m.group(1)); nodes=ld['@graph'] if '@graph' in ld else [ld]; pub=None
        for n in nodes:
            if n.get('@type') in ('Article','TechArticle','WebPage'):
                n['dateModified']=iso; pub=pub or n.get('datePublished')
        h=h[:m.start(1)]+json.dumps(ld,indent=2,ensure_ascii=False)+h[m.end(1):]
        if visible:
            meta=f'<meta property="article:modified_time" content="{iso}T00:00:00Z">'
            if 'article:modified_time' in h: h=re.sub(r'<meta property="article:modified_time" content="[^"]*">',meta,h,1)
            else:
                add=(f'<meta property="article:published_time" content="{pub}T00:00:00Z">\n' if pub and 'article:published_time' not in h else '')+meta
                h=h.replace('<meta property="og:locale"','%s\n<meta property="og:locale"'%add,1) if '<meta property="og:locale"' in h else h
    return h
def apply(path,d=None,visible=True):
    d=d or today(); h=open(path,encoding='utf-8').read(); n=stamp(move_faq(h),d,visible)
    if n!=h: open(path,'w',encoding='utf-8').write(n)
    return n!=h

"""'You Can Also Read' block at the end of every article and guide (after the FAQ, before Logic/Methodology).
Source of truth: docs/data/related-pages.json. Written into the page HTML (not by a script at run time) so readers and crawlers both see it.
Usage: python3 scripts/content/related.py        (applies to every page in the data file; idempotent)
layout.apply() calls apply_html() too, so a rebuilt generated page keeps its block."""
import json,os,re,html
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))
DATA=os.path.join(ROOT,'docs','data','related-pages.json')
BLOCK=re.compile(r'<section class="ir-related" id="related".*?</section>\n?',re.S)
def load(): return json.load(open(DATA,encoding='utf-8'))
def kind(f): return 'Guide' if f.startswith('guides/') else 'Article'
def url(f): return '/'+f[:-5]
def esc(s): return html.escape(s,quote=True)
def block(f,d):
    items=d['related'].get(f)
    if not items: return ''
    cards=''.join(f'<a class="hub-card" href="{url(i["to"])}"><span class="hub-card-kicker">{kind(i["to"])}</span><span class="hub-card-title">{esc(d["titles"][i["to"]])}</span><span class="hub-card-desc">{esc(i["why"])}</span></a>' for i in items)
    return f'<section class="ir-related" id="related" aria-labelledby="related-heading"><div class="ir-faq-outer"><h2 class="ir-faq-heading" id="related-heading">You Can Also Read</h2><div class="hub-grid">{cards}</div></div></section>\n'
def apply_html(h,f,d=None):
    d=d or load(); h=BLOCK.sub('',h); b=block(f,d)
    if not b: return h
    k=h.find('<div class="ir-logic-grid">'); assert k>0,f'no logic grid in {f}'
    return h[:k]+b+h[k:]
if __name__=='__main__':
    d=load(); n=0
    for f in d['related']:
        p=os.path.join(ROOT,f); h=open(p,encoding='utf-8').read(); new=apply_html(h,f,d)
        if new!=h: open(p,'w',encoding='utf-8').write(new); n+=1; print('updated',f)
    print(f'{n} of {len(d["related"])} pages changed')

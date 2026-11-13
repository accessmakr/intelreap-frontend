"""Repo-wide check of the related-reading blocks. Fails (exit 1) on: a missing, duplicated or stale block, a target that does not exist, a self link, fewer than 2 or more than 4 items, a duplicate target, a missing reason, or an article or guide with no entry.
Also prints (does not fail on) the gap list: pages with one or no inbound link, i.e. topics that would benefit from a new article.
Usage: python3 scripts/content/verify_related.py"""
import json,os,re,sys
sys.path.insert(0,os.path.dirname(__file__))
import related as R
ROOT=R.ROOT; d=R.load(); fails=[]
def chk(p,ok,m):
    if not ok: fails.append(f'{p}: {m}')
dates=json.load(open(os.path.join(ROOT,'docs','data','page-dates.json'),encoding='utf-8'))['pages']
for f,e in dates.items():
    if e['kind']=='article': chk(f,f in d['related'],'article or guide has no entry in docs/data/related-pages.json')
inb={f:0 for f in d['related']}
for f,items in d['related'].items():
    p=os.path.join(ROOT,f); chk(f,os.path.exists(p),'page does not exist')
    chk(f,2<=len(items)<=4,f'{len(items)} items (need 2 to 4)')
    tos=[i['to'] for i in items]; chk(f,len(set(tos))==len(tos),'duplicate target'); chk(f,f not in tos,'links to itself')
    for i in items:
        chk(f,os.path.exists(os.path.join(ROOT,i['to'])),f"target {i['to']} does not exist"); chk(f,i['to'] in d['titles'],f"no title for {i['to']}")
        chk(f,0<len(i['why'].strip())<=80,f"reason missing or over 80 characters for {i['to']}")
        if i['to'] in inb: inb[i['to']]+=1
    if os.path.exists(p):
        h=open(p,encoding='utf-8').read(); found=R.BLOCK.findall(h)
        chk(f,len(found)==1,f'{len(found)} related blocks on the page (need exactly 1)')
        if len(found)==1: chk(f,found[0]==R.block(f,d),'the block on the page differs from the data file (run scripts/content/related.py)')
        k=h.find('<div class="ir-logic-grid">'); chk(f,h.find('id="related"')<k and h.find('id="related"')>h.find('faq-heading-main'),'block is not between the FAQ and the Logic/Methodology grid')
print(f'{len(d["related"])} pages checked, {len(fails)} problems')
for x in fails: print('  FAIL',x)
gap=sorted((f for f,n in inb.items() if n<=1),key=lambda f:inb[f])
print('gap list (one or no inbound link, informational):',[f'{f.split("/")[-1][:-5]} ({inb[f]})' for f in gap] or 'none')
sys.exit(1 if fails else 0)

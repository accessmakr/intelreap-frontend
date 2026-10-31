"""Append sections and FAQs to an existing generated page (depth pass / retrofit). Usage: from extend import extend"""
import re,json,os,sys
D=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.abspath(os.path.join(D,'..','..')); sys.path.insert(0,D)
from svgkit import *
def words(x): return len(re.sub(r'<svg.*?</svg>|<script.*?</script>|<[^>]+>',' ',x,flags=re.S).split())
def extend(slug,sections,faqs,date='2026-10-31',date_label='31 October 2026'):
    f=os.path.join(ROOT,'learn',slug+'.html'); h=open(f,encoding='utf-8').read()
    n=len(re.findall(r'<h2 id="[^"]+"><span class="section-num">',h)); add='';toc=''
    for i,(sid,title,body) in enumerate(sections,n+1):
        add+=f'<h2 id="{sid}"><span class="section-num">{i:02d}</span> {title}</h2>\n{body}\n'; toc+=f'<li><a href="#{sid}">{title}</a></li>'
    k=h.find('<div class="ir-logic-grid">'); assert k>0; h=h[:k]+add+h[k:]
    h=h.replace('<li><a href="#sources">Sources</a></li>',toc+'<li><a href="#sources">Sources</a></li>',1)
    c=len(re.findall(r'ndic-faq-item"',h)); items=''.join(f'<div class="ndic-faq-item"><button class="ndic-faq-question" aria-expanded="false" aria-controls="faq-a{c+i+1}"><span>{q}</span><span class="ndic-faq-chevron" aria-hidden="true"><svg viewBox="0 0 14 14" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M2 5l5 5 5-5"/></svg></span></button><div class="ndic-faq-answer" id="faq-a{c+i+1}"><div class="ndic-faq-answer-inner">{a}</div></div></div>' for i,(q,a) in enumerate(faqs))
    m=list(re.finditer(r'<div class="ndic-faq-list">',h))[0]; e=m.start()
    d=0
    for t in re.finditer(r'<div\b|</div>',h[e:]):
        d+=1 if t.group(0)=='<div' else -1
        if d==0: end=e+t.start(); break
    h=h[:end]+items+h[end:]
    mm=re.search(r'<script type="application/ld\+json">(.*?)</script>',h,re.S); ld=json.loads(mm.group(1))
    a0=re.search(r'<article class="ir-article"[^>]*>',h).end(); b0=h.find('<!-- CITATIONS -->'); art=h[a0:b0]
    faqall=re.search(r'<div class="ndic-faq-list">.*?</section>',h,re.S).group(0); qa=re.search(r'<section class="ndic-quick-answer">.*?</section>',h,re.S).group(0)
    wc=words(art)+words(qa)+words(faqall)
    for nd in ld['@graph']:
        t=nd.get('@type')
        if t=='FAQPage': nd['mainEntity']+= [{'@type':'Question','name':re.sub('<[^>]+>','',q),'acceptedAnswer':{'@type':'Answer','text':re.sub('<[^>]+>','',a)}} for q,a in faqs]
        if t=='Article': nd['wordCount']=wc; nd['dateModified']=date
        if t=='WebPage': nd['dateModified']=date
    h=h[:mm.start(1)]+json.dumps(ld,indent=2,ensure_ascii=False)+h[mm.end(1):]
    h=re.sub(r'(article:modified_time" content=")[^"]*',r'\g<1>'+date+'T00:00:00Z',h,1)
    h=re.sub(r'(data-fixed="true" aria-live="polite">Last updated )[^<]*',r'\g<1>'+date_label,h,1)
    h=re.sub(r'(<p class="ir-faq-sub">)[^<]*',lambda m:m.group(1)+f'{c+len(faqs)} questions on this topic.',h,1)
    open(f,'w',encoding='utf-8').write(h); print('extended',slug,'| words',wc,'| faq',c+len(faqs))

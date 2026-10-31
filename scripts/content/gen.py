"""IntelReap article generator. Usage: python3 scripts/content/gen.py <spec-module>  (specs live in scripts/content/specs/)."""
import re,json,os,sys,html as H,importlib
D=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.abspath(os.path.join(D,'..','..')); sys.path.insert(0,D); sys.path.insert(0,os.path.join(D,'specs'))
from svgkit import *
OLD='https://intelreap.com/guides/how-to-find-ip-address-of-any-device'
def span(s,mk):
    i=s.find(mk); assert i>=0,mk; d=0
    for m in re.finditer(r'<div\b|</div>',s[i:]):
        d+=1 if m.group(0)=='<div' else -1
        if d==0: return i,i+m.end()
def words(x): return len(re.sub(r'<svg.*?</svg>|<script.*?</script>|<[^>]+>',' ',x,flags=re.S).split())
def table(cap,head,rows):
    th=''.join(f'<th scope="col">{c}</th>' for c in head); tb=''.join('<tr>'+''.join(f'<td>{"<strong>"+c+"</strong>" if i==0 else c}</td>' for i,c in enumerate(r))+'</tr>' for r in rows)
    return f'<div class="ir-table-wrap" role="region" aria-label="{cap}" tabindex="0"><table class="ir-table"><caption>{cap}</caption><thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>'
CSS='''<style>
.ir-toc{border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:10px;padding:1rem 1.25rem;margin:0 0 2rem}.ir-toc-label{font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;opacity:.7;margin-bottom:.5rem}.ir-toc ol{margin:0;padding-left:1.25rem;columns:2;column-gap:2rem}.ir-toc li{margin:.2rem 0}@media(max-width:600px){.ir-toc ol{columns:1}}
.ir-fig{margin:1.75rem 0}.ir-fig svg{width:100%;height:auto;display:block;color:var(--color-text-primary,#e2e8f0)}.ir-fig figcaption{font-size:.85rem;opacity:.75;margin-top:.5rem;text-align:center}
.ir-tool{border:1px solid color-mix(in srgb,var(--color-accent-primary,#0ea5e9) 35%,transparent);border-radius:10px;padding:1.25rem;margin:1rem 0 1.5rem}.ir-tool-head{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap}.ir-tool-eyebrow{font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;opacity:.7}.ir-tool dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:.5rem 1.5rem;margin:1rem 0 0}.ir-tool-row dt{font-size:.75rem;opacity:.65}.ir-tool-row dd{margin:0;font-weight:600;word-break:break-word}.ir-tool-note,.ir-tool-empty{font-size:.85rem;opacity:.75;margin:.75rem 0 0}
.ir-pick{font:inherit;padding:.6rem .8rem;border-radius:8px;border:1px solid color-mix(in srgb,currentColor 30%,transparent);background:transparent;color:inherit;max-width:100%}.ir-steps{margin:1rem 0 0;padding-left:1.25rem}.ir-steps li{margin:.5rem 0}.ir-steps code,.ir-code{font-family:var(--font-mono,monospace);font-size:.85em;background:color-mix(in srgb,currentColor 9%,transparent);padding:.1em .4em;border-radius:4px;word-break:break-all}
@media(max-width:600px){.ir-table{min-width:0;font-size:.8rem}.ir-table th,.ir-table td{padding:.5rem .55rem}}
</style>
</head>'''
def picker(S):
    P=S['picker']; opts=''.join(f'<option value="{i}">{H.escape(l)}</option>' for i,(l,_) in enumerate(P))
    html=f'<div class="ir-tool" id="ir-tool"><div class="ir-tool-head"><span class="ir-tool-eyebrow">Step picker</span><select class="ir-pick" id="ir-pick" aria-label="{H.escape(S["picker_label"])}">{opts}</select></div><ol class="ir-steps" id="ir-steps" aria-live="polite"></ol><p class="ir-tool-note">{S["picker_note"]}</p></div>'
    js='<script>(function(){var D='+json.dumps([s for _,s in P])+',s=document.getElementById("ir-pick"),o=document.getElementById("ir-steps");if(!s||!o)return;function r(){o.innerHTML=D[s.value].map(function(x){return"<li>"+x+"</li>"}).join("")}s.addEventListener("change",r);r()})();</script>'
    return html,js
def build(S):
    URL='https://intelreap.com/learn/'+S['slug']; OUT=f"learn/{S['slug']}.html"; OG=f"https://intelreap.com/assets/images/og/{S['slug']}.png"; DT=S['date']
    h=open(os.path.join(D,'base.html'),encoding='utf-8').read().replace(OLD,URL)
    tool,js=picker(S)
    # OG card
    from playwright.sync_api import sync_playwright
    card=f'''<html><body style="margin:0;width:1200px;height:630px;background:#0b1220;color:#e6edf6;font-family:Helvetica,Arial,sans-serif;position:relative;overflow:hidden"><div style="position:absolute;left:0;top:0;width:14px;height:630px;background:#0ea5e9"></div><div style="position:absolute;left:80px;top:70px;font-size:30px;letter-spacing:6px;color:#7dd3fc">INTELREAP  /  LEARN</div><div style="position:absolute;left:80px;top:160px;width:1040px;font-size:78px;font-weight:800;line-height:1.1">{S['og_title']}</div><div style="position:absolute;left:80px;top:400px;font-size:34px;color:#94a3b8;width:1000px">{S['og_sub']}</div><div style="position:absolute;left:80px;top:500px;display:flex;gap:18px;align-items:center"><div style="padding:16px 26px;border:2px solid #38bdf8;border-radius:12px;font-size:34px;font-weight:700">{S['og_chip']}</div><div style="font-size:30px;color:#64748b">intelreap.com</div></div></body></html>'''
    os.makedirs(os.path.join(ROOT,'assets/images/og'),exist_ok=True)
    with sync_playwright() as p:
        b=p.chromium.launch(); pg=b.new_page(viewport={'width':1200,'height':630}); pg.set_content(card); pg.screenshot(path=os.path.join(ROOT,f"assets/images/og/{S['slug']}.png")); b.close()
    T=S['title']; ALT=f"Card titled {re.sub('<[^>]+>','',S['og_title'])} from IntelReap"
    h=re.sub(r'<title>.*?</title>',f'<title>{T} — IntelReap</title>',h,1)
    h=re.sub(r'(<meta name="description" content=")[^"]*',r'\g<1>'+S['desc'],h,1)
    h=re.sub(r'<meta name="keywords" content="[^"]*">',f'<meta name="keywords" content="{", ".join(S["kw"])}">',h,1)
    for k in ('og:title','twitter:title'): h=re.sub(r'(%s"\s+content=")[^"]*'%k,r'\g<1>'+T+' — IntelReap',h,1)
    for k in ('og:description','twitter:description'): h=re.sub(r'(%s"\s+content=")[^"]*'%k,r'\g<1>'+S['desc'],h,1)
    h=h.replace('https://intelreap.com/assets/images/og-image.png',OG)
    h=h.replace('<meta property="og:image:height" content="630">',f'<meta property="og:image:height" content="630">\n<meta property="og:image:type" content="image/png">\n<meta property="og:image:alt" content="{ALT}">',1)
    h=h.replace(f'<meta name="twitter:image" content="{OG}">',f'<meta name="twitter:image" content="{OG}">\n<meta name="twitter:image:alt" content="{ALT}">',1)
    h=h.replace('<meta property="og:locale" content="en_US">',f'<meta property="og:locale" content="en_US">\n<meta property="article:published_time" content="{DT}T00:00:00Z">\n<meta property="article:modified_time" content="{DT}T00:00:00Z">\n<meta property="article:section" content="{S["section"]}">',1)
    # body pieces
    secs=S['sections']; toc=[(i,t) for i,t,_ in secs]+[('sources','Sources'),('faq-heading-main','FAQ')]
    art=f'<nav class="ir-toc" aria-label="Table of contents"><div class="ir-toc-label">On this page</div><ol>'+''.join(f'<li><a href="#{i}">{t}</a></li>' for i,t in toc)+'</ol></nav>\n'
    pn=S['panel']
    for n,(i,t,body) in enumerate(secs,1):
        art+=f'<h2 id="{i}"><span class="section-num">{n:02d}</span> {t}</h2>\n'
        if n==1: art+=tool+f'\n<div class="ir-cta-block"><span class="ir-cta-eyebrow">{pn["eyebrow"]}</span><h3>{pn["h3"]}</h3><p>{pn["p"]}</p><div class="ir-btn-row"><a href="{pn["href"]}" class="ir-btn-primary">{pn["btn"]}</a></div></div>\n'
        art+=body+'\n'
    art+=f'<div class="ir-logic-grid"><div class="ir-logic-card"><span class="ir-logic-eyebrow">Logic</span><p>{S["logic"]}</p></div><div class="ir-logic-card"><span class="ir-logic-eyebrow">Methodology</span><p>{S["method"]}</p></div></div>\n'
    cites=''.join(f'<div class="ndic-citation-item"><span class="ndic-citation-num">{i+1:02d}</span><span class="ndic-citation-link"><a href="{u}" target="_blank" rel="noopener noreferrer">{H.escape(t)}</a></span></div>' for i,(t,u) in enumerate(S['cites']))
    faq=''.join(f'<div class="ndic-faq-item"><button class="ndic-faq-question" aria-expanded="false" aria-controls="faq-a{i+1}"><span>{q}</span><span class="ndic-faq-chevron" aria-hidden="true"><svg viewBox="0 0 14 14" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M2 5l5 5 5-5"/></svg></span></button><div class="ndic-faq-answer" id="faq-a{i+1}"><div class="ndic-faq-answer-inner">{a}</div></div></div>' for i,(q,a) in enumerate(S['faq']))
    # JSON-LD
    m=re.search(r'<script type="application/ld\+json">(.*?)</script>',h,re.S); ld=json.loads(m.group(1))
    wc=words(art)+words(S['qa_body'])+sum(words(q+' '+a) for q,a in S['faq'])
    for n in ld['@graph']:
        t=n.get('@type')
        if t=='Article': n.update(headline=S['headline'],description=S['desc'],datePublished=DT,dateModified=DT,wordCount=wc,articleSection=S['section'],isAccessibleForFree=True,keywords=', '.join(S['kw']),image={'@type':'ImageObject','url':OG,'width':1200,'height':630},about={'@type':'Thing','name':S['about']},citation=[{'@type':'CreativeWork','name':t_,'url':u} for t_,u in S['cites']])
        if t=='FAQPage': n.update({'@id':URL+'#faq','url':URL,'isPartOf':{'@id':URL+'#article'},'mainEntity':[{'@type':'Question','name':re.sub('<[^>]+>','',q),'acceptedAnswer':{'@type':'Answer','text':re.sub('<[^>]+>','',a)}} for q,a in S['faq']]})
        if t=='BreadcrumbList':
            n['@id']=URL+'#breadcrumb'; e=n['itemListElement']; e[1].update(name='Learn',item='https://intelreap.com/learn/'); e[-1].update(name=S['crumb'],item=URL)
    ld['@graph'].insert(0,{'@type':'WebPage','@id':URL+'#webpage','url':URL,'name':T+' — IntelReap','description':S['desc'],'inLanguage':'en-US','isPartOf':{'@id':'https://intelreap.com/#website'},'primaryImageOfPage':{'@type':'ImageObject','url':OG},'datePublished':DT,'dateModified':DT,'breadcrumb':{'@id':URL+'#breadcrumb'},'mainEntity':{'@id':URL+'#article'}})
    h=h[:m.start(1)]+json.dumps(ld,indent=2,ensure_ascii=False)+h[m.end(1):]
    h=h.replace('<a href="/guides/">Guides</a>','<a href="/learn/">Learn</a>',1); h=re.sub(r'(<span class="ir-breadcrumb-current" aria-current="page">)[^<]*',r'\g<1>'+S['crumb'],h,1)
    a=h.find('<div class="ndic-hero-badge">'); b=h.find('<div id="freshness-badge"'); assert 0<a<b
    h=h[:a]+f'<div class="ndic-hero-badge"><span class="ndic-hero-badge-dot" aria-hidden="true"></span><span>{S["kicker"]}</span></div>\n        <h1 class="ndic-hero-title">{S["h1"]}</h1>\n        <p class="ndic-hero-tagline">{S["tagline"]}</p>\n        <div class="ndic-hero-cta-group"><a href="#{secs[0][0]}" class="ir-btn-primary">{S["cta"]}</a><a href="{pn["href"]}" class="ir-btn-secondary">{pn["btn"]} →</a></div>\n        '+h[b:]
    h=h.replace('<div id="freshness-badge" aria-live="polite">Last updated 2 October 2026','<div id="freshness-badge" data-fixed="true" aria-live="polite">Last updated '+S['date_label'],1)
    h=re.sub(r"\s*\(\(\)=>\{const badge=document\.getElementById\('freshness-badge'\).*?\}\)\(\);",'',h,1,flags=re.S)
    a=h.find('<section class="ndic-quick-answer">'); b=h.find('</section>',a)+10; assert a>0
    h=h[:a]+f'<section class="ndic-quick-answer"><div class="ndic-quick-answer-label">Quick Answer</div><h2 class="ndic-quick-answer-title">{S["qa_title"]}</h2><p class="ndic-quick-answer-body">{S["qa_body"]}</p></section>'+h[b:]
    am=re.search(r'<article class="ir-article"[^>]*>',h); a=am.end(); b=h.find('<!-- CITATIONS -->'); assert b>a
    h=h[:a]+'\n'+art+h[b:]
    h=h.replace('<section class="ndic-citation-section" aria-labelledby="citation-heading">','<section class="ndic-citation-section" id="sources" aria-labelledby="citation-heading">',1)
    s,e=span(h,'<div class="ndic-citation-list">'); h=h[:s]+'<div class="ndic-citation-list">'+cites+'</div>'+h[e:]
    s,e=span(h,'<div class="ndic-faq-list">'); h=h[:s]+'<div class="ndic-faq-list">'+faq+'</div>'+h[e:]
    h=re.sub(r'(<p class="ir-faq-sub">).*?(</p>)',r'\g<1>'+S['faq_sub']+r'\g<2>',h,1,flags=re.S)
    h=h.replace('</head>',CSS,1); i=h.rfind('</body>'); h=h[:i]+js+'\n</body>'+h[i+7:]
    open(os.path.join(ROOT,OUT),'w',encoding='utf-8').write(h)
    # learn index
    p=os.path.join(ROOT,'learn/index.html'); li=open(p,encoding='utf-8').read()
    if f'/learn/{S["slug"]}"' not in li:
        card=f'        <a class="hub-card" href="/learn/{S["slug"]}">\n          <span class="hub-card-kicker">Article</span>\n          <span class="hub-card-title">{S["crumb"]}</span>\n          <span class="hub-card-desc">{S["card_desc"]}</span>\n        </a>\n'
        k=li.rfind('class="hub-card"'); k=li.find('</a>\n',k)+5; li=li[:k]+card+li[k:]
        last=[m for m in re.finditer(r'"url": "https://intelreap.com/learn/[^"]+"\n(\s*)\}',li)][-1]; n=len(re.findall(r'"position":',li[:last.end()]))
        li=li[:last.end()]+f',\n        {{\n          "@type": "ListItem",\n          "position": {n+1},\n          "name": "{S["crumb"]}",\n          "url": "{URL}"\n        }}'+li[last.end():]
        open(p,'w',encoding='utf-8').write(li)
    # netlify redirect
    p=os.path.join(ROOT,'netlify.toml'); t=open(p,encoding='utf-8').read()
    if f'/learn/{S["slug"]}.html' not in t:
        mm=re.search(r'\[\[redirects\]\]\n  from = "/learn/what-is-an-ip-address\.html"\n.*?force = true\n',t,re.S)
        t=t[:mm.end()]+f'\n[[redirects]]\n  from = "/learn/{S["slug"]}.html"\n  to = "/learn/{S["slug"]}"\n  status = 301\n  force = true\n'+t[mm.end():]; open(p,'w',encoding='utf-8').write(t)
    print('built',OUT,len(h),'bytes | words',wc,'| faq',len(S['faq']),'| figs',h.count('<figure class="ir-fig">'))
if __name__=='__main__':
    for n in sys.argv[1:]: build(importlib.import_module(n).S)

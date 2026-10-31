import re
# ---------- SVG helpers
_n=[0]
def svg(vb,body,label):
    _n[0]+=1; body=body.replace('id="ah"',f'id="ah{_n[0]}"').replace('url(#ah)',f'url(#ah{_n[0]})')
    return f'<svg viewBox="0 0 {vb}" role="img" aria-label="{label}" xmlns="http://www.w3.org/2000/svg"><title>{label}</title>{body}</svg>'
def box(x,y,w,hh,t,sub='',accent=False):
    f='var(--color-accent-primary,#0ea5e9)'
    s=f'<rect x="{x}" y="{y}" width="{w}" height="{hh}" rx="8" fill="{f if accent else "currentColor"}" fill-opacity="{0.16 if accent else 0.06}" stroke="{f if accent else "currentColor"}" stroke-opacity="{0.9 if accent else 0.35}"/>'
    s+=f'<text x="{x+w/2}" y="{y+hh/2+(-3 if sub else 5)}" text-anchor="middle" font-size="14" font-weight="600" fill="currentColor">{t}</text>'
    if sub: s+=f'<text x="{x+w/2}" y="{y+hh/2+14}" text-anchor="middle" font-size="11" fill="currentColor" fill-opacity="0.7">{sub}</text>'
    return s
def ln(x1,y1,x2,y2,dash=False,arrow=True):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.6"{" stroke-dasharray=\"5 4\"" if dash else ""}{" marker-end=\"url(#ah)\"" if arrow else ""}/>'
def tx(x,y,t,sz=12,anchor='middle',op=0.8,wt=400):
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-size="{sz}" font-weight="{wt}" fill="currentColor" fill-opacity="{op}">{t}</text>'
DEFS='<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="currentColor" fill-opacity="0.7"/></marker></defs>'

def fig(s,cap): return f'<figure class="ir-fig">{s}<figcaption>{cap}</figcaption></figure>'

def table(cap,head,rows):
    th=''.join(f'<th scope="col">{c}</th>' for c in head); tb=''.join('<tr>'+''.join(f'<td>{"<strong>"+c+"</strong>" if i==0 else c}</td>' for i,c in enumerate(r))+'</tr>' for r in rows)
    return f'<div class="ir-table-wrap" role="region" aria-label="{cap}" tabindex="0"><table class="ir-table"><caption>{cap}</caption><thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table></div>'

# ---------- tall (phone) diagram helpers: 360 wide, stacked, large text
import textwrap
_TW=360; _AC='var(--color-accent-primary,#0ea5e9)'
def _vb(y,t,sub='',acc=False,x=22,w=316,h=None):
    h=h or (58 if sub else 44)
    s=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="9" fill="{_AC if acc else "currentColor"}" fill-opacity="{0.16 if acc else 0.06}" stroke="{_AC if acc else "currentColor"}" stroke-opacity="{0.9 if acc else 0.35}"/>'
    s+=f'<text x="{x+w/2}" y="{y+h/2+(-3 if sub else 5)}" text-anchor="middle" font-size="15" font-weight="700" fill="currentColor">{t}</text>'
    if sub: s+=f'<text x="{x+w/2}" y="{y+h/2+16}" text-anchor="middle" font-size="12" fill="currentColor" fill-opacity="0.75">{sub}</text>'
    return s,h
def _foot(s,y,foot):
    if foot: y+=10
    for l in foot:
        for w in textwrap.wrap(l,46): y+=20; s+=f'<text x="180" y="{y}" text-anchor="middle" font-size="12.5" fill="currentColor" fill-opacity="0.8">{w}</text>'
    return s,y
def _tall(s,y,label): return svg(f'{_TW} {y+14}',s,label).replace('<svg ','<svg class="d-m" ',1).replace('id="ah','id="mah').replace('url(#ah','url(#mah')
def vchain(items,acc=(),foot=(),arrows=True,label='Diagram'):
    s=DEFS; y=8; prev=False
    for i,it in enumerate(items):
        grp=it if isinstance(it,list) else [it]
        if prev and arrows: s+=f'<line x1="180" y1="{y}" x2="180" y2="{y+20}" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.8" marker-end="url(#ah)"/>'; y+=24
        elif prev: y+=10
        for j,(t,sb) in enumerate(grp):
            b,h=_vb(y,t,sb,acc=(i in acc),h=(46 if not sb else 54) if isinstance(it,list) else None); s+=b; y+=h+(8 if j<len(grp)-1 else 0)
        prev=True
    s,y=_foot(s,y,foot); return _tall(s,y,label)
def vmock(title,rows,hl=-1,foot=(),label='Diagram'):
    H=54+len(rows)*38; s=f'<rect x="22" y="8" width="316" height="{H}" rx="9" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.4"/><text x="180" y="38" text-anchor="middle" font-size="15" font-weight="700" fill="currentColor">{title}</text>'
    for i,(k,v) in enumerate(rows):
        y=72+i*38
        if i==hl: s+=f'<rect x="30" y="{y-21}" width="300" height="32" rx="6" fill="{_AC}" fill-opacity="0.2"/>'
        s+=f'<text x="40" y="{y}" font-size="13" fill="currentColor" fill-opacity="0.85">{k}</text><text x="322" y="{y}" text-anchor="end" font-size="13" font-weight="{700 if i==hl else 400}" fill="currentColor">{v}</text>'
    s,y=_foot(s,8+H,foot); return _tall(s,y,label)
def vlanes(lanes,foot=(),label='Diagram'):
    s=DEFS; y=8
    for lab,bx,acc in lanes:
        s+=f'<text x="22" y="{y+16}" font-size="14" font-weight="700" fill="currentColor">{lab}</text>'; y+=26
        for i,(t,sb) in enumerate(bx):
            b,h=_vb(y,t,sb,acc=acc,x=22+i*110,w=96,h=54); s+=b
            if i<len(bx)-1: s+=f'<line x1="{22+i*110+96}" y1="{y+27}" x2="{22+(i+1)*110}" y2="{y+27}" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.8" marker-end="url(#ah)"/>'
        y+=54+20
    s,y=_foot(s,y,foot); return _tall(s,y,label)
def vbars(rows,foot=(),label='Diagram'):
    tot=max(a+b for _,a,b,_ in rows); k=232/tot; y=10; s=''
    for lab,a,b,acc in rows:
        s+=f'<text x="22" y="{y+19}" font-size="13" font-weight="{700 if acc else 400}" fill="currentColor">{lab}</text><rect x="{100+a*k:.1f}" y="{y}" width="{b*k:.1f}" height="26" rx="5" fill="{_AC if acc else "currentColor"}" fill-opacity="{0.4 if acc else 0.1}" stroke="currentColor" stroke-opacity="0.4"/>'; y+=36
    s,y=_foot(s,y,foot); return _tall(s,y,label)

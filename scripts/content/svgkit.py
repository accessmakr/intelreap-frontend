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

"""Add a tall phone variant to each figure of a page. Usage: mobilize.apply(slug) reads scripts/content/mobile/<slug with underscores>.py (FIGS in figure order)."""
import re,os,sys,importlib
D=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.abspath(os.path.join(D,'..','..')); sys.path.insert(0,D); sys.path.insert(0,os.path.join(D,'mobile'))
CSS='.ir-fig .d-m{display:none}@media(max-width:640px){.ir-fig .d-w{display:none}.ir-fig .d-m{display:block;max-width:420px;margin:0 auto}}'
def apply(slug):
    try: figs=importlib.import_module(slug.replace('-','_')).FIGS
    except ModuleNotFoundError: return
    f=os.path.join(ROOT,'learn',slug+'.html'); h=open(f,encoding='utf-8').read()
    h=re.sub(r'<svg class="d-m".*?</svg>','',h,flags=re.S); h=h.replace('<svg class="d-w" ','<svg ')
    parts=re.split(r'(<figure class="ir-fig">)',h); out=[parts[0]]; n=0
    for i in range(1,len(parts),2):
        chunk=parts[i+1]
        if n<len(figs): chunk=chunk.replace('<svg ','<svg class="d-w" ',1); j=chunk.find('</svg>')+6; chunk=chunk[:j]+figs[n]+chunk[j:]
        out+= [parts[i],chunk]; n+=1
    h=''.join(out)
    if '.ir-fig .d-m' not in h: h=h.replace('</style>\n</head>',CSS+'\n</style>\n</head>',1)
    open(f,'w',encoding='utf-8').write(h); print('mobilized',slug,'figures',n,'variants',len(figs))
if __name__=='__main__':
    for s in sys.argv[1:]: apply(s)

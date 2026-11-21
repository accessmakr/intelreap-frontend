"""Five diagrams for 'How to Enable WebGL (and Fix WebGL Not Working)'. Wide (desktop) and tall (phone) are drawn separately for the same concept.
Drawing order = PAGE order here: 1 reading the check result; 2 why WebGL fails; 3 Chrome fix order; 4 Firefox fix order; 5 which error needs which check."""
from svgkit import *
from dns_figs import rb,mt,mk
# ---- 1 reading the result
L1='Reading the check: no WebGL context means acceleration is off or there is no usable driver; software only means a blocklist or acceleration setting; hardware means WebGL is running on the GPU'
def read_wide():
    s=DEFS+rb(8,96,170,56,['Does a WebGL','context open?'],acc=True,sz=11.5)
    s+=ln(93,96,93,62)+tx(101,84,'no',11.5,'start',0.9)+rb(8,10,170,52,['No WebGL','acceleration off or no driver'],sz=11)
    s+=ln(178,124,235,124)+tx(206,116,'yes',11.5,'middle',0.9)+rb(235,96,170,56,['Hardware or','software rendering?'],acc=True,sz=11.5)
    s+=ln(320,96,320,62)+tx(328,84,'hardware',11.5,'start',0.9)+rb(235,10,170,52,['Working','WebGL runs on the GPU'],sz=11.5)
    s+=ln(405,124,462,124)+tx(434,116,'software',11.5,'middle',0.9)+rb(462,96,170,56,['Software only','blocklist or acceleration off'],sz=11)
    s+=tx(320,196,'WebGL 1 works but not WebGL 2: update the browser and the graphics driver',12,'middle',0.85)
    return mk('640 212',s,L1)
def read_tall():
    s=DEFS+rb(40,8,280,48,['Does a WebGL','context open?'],acc=True,sz=12.5)
    s+=ln(180,56,180,86)+tx(192,76,'yes',11.5,'start',0.9)+rb(40,86,280,48,['Hardware or','software rendering?'],acc=True,sz=12.5)
    s+=ln(180,134,180,164)+tx(192,154,'software',11.5,'start',0.9)+rb(40,164,280,56,['Software only','blocklist or acceleration off'],sz=12)
    s+=ln(40,32,14,32,arrow=False)+tx(14,26,'no',11.5,'start',0.9)+ln(14,32,14,272,arrow=False)+ln(14,272,40,272)+rb(40,248,280,48,['No WebGL','acceleration off or no driver'],sz=12)
    s+=ln(320,110,346,110,arrow=False)+tx(340,152,'hardware',11.5,'end',0.9)+ln(346,110,346,342,arrow=False)+ln(346,342,320,342)+rb(40,318,280,48,['Working','WebGL runs on the GPU'],sz=12.5)
    s+=mt(180,394,['WebGL 1 works but not WebGL 2:','update the browser and the graphics driver'],11.5,'middle',0.85)
    return mk('360 420',s,L1,True)
# ---- 2 why WebGL fails
L2='WebGL passes from the page through the browser, the graphics acceleration setting and the GPU driver to the GPU; each step has a way to fail: a blocklist, a setting turned off, an outdated driver, or no GPU in a remote session'
CH=[['Web page','asks for WebGL'],['Browser','checks its blocklist'],['Graphics','acceleration setting'],['GPU driver','talks to the GPU'],['GPU','draws the scene']]
FL=[None,['Blocklisted','known-bad driver'],['Setting turned off','no GPU used'],['Outdated or missing','driver'],['No GPU available','remote desktop or VM']]
def why_wide():
    s=DEFS
    for i,c in enumerate(CH):
        x=8+i*126; s+=rb(x,10,112,64,c,acc=(i==0),sz=11)
        if i<4: s+=ln(x+112,42,x+126,42)
        if FL[i]: s+=ln(x+56,74,x+56,112,dash=True)+rb(x,112,112,64,FL[i],sz=10.5)
    s+=tx(320,204,'Dashed arrows show where each step can fail',12,'middle',0.85)
    return mk('640 216',s,L2)
def why_tall():
    s=DEFS
    for i,c in enumerate(CH):
        y=8+i*76; s+=rb(12,y,176,52,c,acc=(i==0),sz=11.5)
        if i<4: s+=ln(100,y+52,100,y+76)
        if FL[i]: s+=ln(188,y+26,208,y+26,dash=True)+rb(208,y,140,52,FL[i],sz=10.5)
    s+=mt(180,402,['Dashed arrows show where','each step can fail'],12,'middle',0.85)
    return mk('360 430',s,L2,True)
# ---- 3 Chrome fix order / 4 Firefox fix order
L3='Chrome and Edge fix order: turn on graphics acceleration, check chrome://gpu, override the software rendering list, then update the GPU driver'
C=[['1. Turn on graphics','acceleration','Settings, System'],['2. Check','chrome://gpu','WebGL status'],['3. Override the','software rendering','list (chrome://flags)'],['4. Update','the GPU driver','from the maker']]
def chrome_wide():
    s=DEFS
    for i,c in enumerate(C):
        x=8+i*161; s+=rb(x,10,145,76,c,sz=11)
        if i<3: s+=ln(x+145,48,x+161,48)
    s+=tx(320,118,'Edge uses edge:// addresses for the same settings',12,'middle',0.85)
    return mk('640 132',s,L3)
def chrome_tall():
    s=DEFS
    for i,c in enumerate(C):
        y=8+i*84; s+=rb(20,y,320,64,c,sz=12)
        if i<3: s+=ln(180,y+64,180,y+84)
    s+=mt(180,356,['Edge uses edge:// addresses','for the same settings'],12,'middle',0.85)
    return mk('360 386',s,L3,True)
L4='Firefox fix order: turn on hardware acceleration, check webgl.disabled, read about:support, and use webgl.force-enabled only as a last resort'
FX=[['1. Turn on hardware','acceleration','Settings, Performance'],['2. Check','webgl.disabled','must be false'],['3. Read','about:support','Graphics table'],['4. Last resort','webgl.force-enabled','at your own risk']]
def firefox_wide():
    s=DEFS
    for i,c in enumerate(FX):
        x=8+i*161; s+=rb(x,10,145,76,c,sz=11)
        if i<3: s+=ln(x+145,48,x+161,48)
    s+=tx(320,118,'Update the graphics driver whichever step helps',12,'middle',0.85)
    return mk('640 132',s,L4)
def firefox_tall():
    s=DEFS
    for i,c in enumerate(FX):
        y=8+i*84; s+=rb(20,y,320,64,c,sz=12)
        if i<3: s+=ln(180,y+64,180,y+84)
    s+=mt(180,356,['Update the graphics driver','whichever step helps'],12,'middle',0.85)
    return mk('360 386',s,L4,True)
# ---- 5 which error needs which check
L5='Match the message to the check: WebGL unavailable or context errors use the WebGL check, found no usable graphics adapter is a WebGPU message, and missing extension messages point to the GPU, the driver or software rendering'
ER=[(['WebGL unavailable','or context error'],['Run the WebGL check','then the fixes for your browser']),
    (['Found no usable','graphics adapter'],['It is a WebGPU message','check chrome://gpu or the WebGPU line']),
    (['Missing WebGL','extension'],['The GPU, driver or software','rendering did not offer it'])]
def err_wide():
    s=DEFS
    for i,(a,b) in enumerate(ER):
        y=10+i*70; s+=rb(8,y,200,56,a,sz=11.5)+ln(208,y+28,252,y+28)+rb(252,y,380,56,b,sz=11.5)
    return mk('640 216',s,L5)
def err_tall():
    s=DEFS
    for i,(a,b) in enumerate(ER):
        y=8+i*140; s+=rb(20,y,320,48,a,sz=12.5)+ln(180,y+48,180,y+68)+rb(20,y+68,320,56,b,sz=11.5)
    return mk('360 430',s,L5,True)
WIDE=[read_wide(),why_wide(),chrome_wide(),firefox_wide(),err_wide()]
TALL=[read_tall(),why_tall(),chrome_tall(),firefox_tall(),err_tall()]

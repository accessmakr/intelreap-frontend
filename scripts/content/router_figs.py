"""Four diagrams for the router IP page. Purposes: (1) the gateway is the door between the private home network and the internet; (2) which line of ipconfig output to read; (3) the order to check when the router page will not open; (4) how double NAT looks."""
from svgkit import *
from dns_figs import rb,mt,mk
A='var(--color-accent-primary,#0ea5e9)'
MONO="font-family=\"ui-monospace,Menlo,Consolas,monospace\""
# ---- 1 gateway boundary
def gate_wide():
    s=DEFS+f'<rect x="6" y="22" width="392" height="204" rx="12" fill="none" stroke="currentColor" stroke-opacity="0.4" stroke-dasharray="6 5"/>'+mt(202,44,['Inside your home: private addresses'],12.5,'middle',0.85,700)
    s+=rb(22,64,110,44,['Phone','192.168.1.23'])+rb(22,130,110,44,['Laptop','192.168.1.42'])+ln(132,86,226,112)+ln(132,152,226,128)
    s+=rb(226,70,172,100,['Router: LAN side','192.168.1.1','= default gateway'],acc=True)+rb(398,70,124,100,['Router: WAN side','203.0.113.7','public'])+ln(522,120,556,120)+rb(556,92,78,56,['The','internet'])
    return mk('640 236',s,'The router sits on the boundary between the private home network and the internet; its LAN side is the default gateway')
def gate_tall():
    s=DEFS+'<rect x="10" y="8" width="340" height="176" rx="12" fill="none" stroke="currentColor" stroke-opacity="0.4" stroke-dasharray="6 5"/>'+mt(180,30,['Inside your home: private addresses'],13,'middle',0.85,700)
    s+=rb(26,46,140,46,['Phone','192.168.1.23'],sz=13)+rb(194,46,140,46,['Laptop','192.168.1.42'],sz=13)+ln(96,92,150,114)+ln(264,92,210,114)
    s+=rb(60,114,240,60,['Router: LAN side','192.168.1.1 = default gateway'],acc=True,sz=13)
    s+='<line x1="10" y1="198" x2="350" y2="198" stroke="currentColor" stroke-opacity="0.5" stroke-dasharray="6 5"/>'+mt(180,215,['boundary: home network | internet'],11.5,'middle',0.7)
    s+=rb(60,226,240,52,['Router: WAN side','203.0.113.7 (public)'],sz=13)+ln(180,278,180,302)+rb(100,302,160,44,['The internet'],sz=13)
    return mk('360 360',s,'The router sits on the boundary between the private home network and the internet; its LAN side is the default gateway',True)
# ---- 2 reading ipconfig
LINES=[('Ethernet adapter Ethernet:',0,0.5),('   Media disconnected',0,0.5),('Wireless LAN adapter Wi-Fi:',0,1),('   Link-local IPv6 Address . : fe80::1c2b%13',0,0.8),('   IPv4 Address. . . . . . . : 192.168.1.42',0,0.8),('   Subnet Mask . . . . . . . : 255.255.255.0',0,0.8),('   Default Gateway . . . . . : fe80::1%13',0,0.8),('                               192.168.1.1',1,1)]
def ipc_wide():
    s='<rect x="10" y="8" width="620" height="214" rx="10" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.4"/>'
    for i,(t,hl,op) in enumerate(LINES):
        y=36+i*24
        if hl: s+=f'<rect x="18" y="{y-16}" width="360" height="22" rx="5" fill="{A}" fill-opacity="0.25"/>'
        s+=f'<text x="26" y="{y}" {MONO} font-size="12.5" xml:space="preserve" fill="currentColor" fill-opacity="{op}" font-weight="{700 if hl else 400}">{t.replace(" ","&#160;")}</text>'
    s+=mt(398,52,['1  Skip adapters that say','Media disconnected'],11.5,'start',0.9)+mt(398,150,['2  IPv6 gateway (fe80::):','not the address for a browser'],11.5,'start',0.9)+mt(398,205,['3  Your router: the IPv4 line'],11.5,'start',1,700)
    s+=mt(320,244,['Two gateway lines are normal when IPv6 is on. Use the IPv4 one.'],12.5)
    return mk('640 258',s,'ipconfig output with the disconnected adapter, the IPv6 gateway and the IPv4 gateway marked')
def ipc_tall():
    s='<rect x="8" y="8" width="344" height="226" rx="10" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.4"/>'
    for i,(t,hl,op) in enumerate(LINES):
        y=34+i*26
        t=t.replace('Link-local IPv6 Address . :','Link-local IPv6 . . . :').replace('IPv4 Address. . . . . . . :','IPv4 Address. . . . . :').replace('Subnet Mask . . . . . . . :','Subnet Mask . . . . . :').replace('Default Gateway . . . . . :','Default Gateway . . . :').replace('                               ','                          ')
        if hl: s+=f'<rect x="14" y="{y-17}" width="332" height="23" rx="5" fill="{A}" fill-opacity="0.25"/>'
        s+=f'<text x="18" y="{y}" {MONO} font-size="11.5" xml:space="preserve" fill="currentColor" fill-opacity="{op}" font-weight="{700 if hl else 400}">{t.replace(" ","&#160;")}</text>'
    for n,(x,y) in enumerate([(330,60),(330,190),(330,242)],1): pass
    s+=mt(14,262,['Skip adapters that say Media disconnected.'],12.5,'start',0.9)+mt(14,284,['The fe80:: gateway is IPv6: not for a browser.'],12.5,'start',0.9)+mt(14,306,['Your router is the IPv4 gateway (highlighted).'],12.5,'start',1,700)
    return mk('360 322',s,'ipconfig output with the disconnected adapter, the IPv6 gateway and the IPv4 gateway marked',True)
# ---- 3 router page will not open
def open_wide():
    s=DEFS+rb(40,8,300,40,['Router page will not open'])+ln(190,48,190,70)
    s+=rb(40,70,300,56,["On the router's Wi-Fi or a cable,",'mobile data and VPN off?'],acc=True)+ln(340,98,380,98)+tx(360,90,'no',11)+rb(380,70,250,56,['Connect that way,','then try again'])
    s+=ln(190,126,190,152)+tx(204,144,'yes',11,'start')+rb(40,152,300,50,['Is the address exactly your','Default Gateway?'],acc=True)+ln(340,177,380,177)+tx(360,169,'no',11)+rb(380,152,250,50,['Use the gateway address','from your device'])
    s+=ln(190,202,190,228)+tx(204,220,'yes',11,'start')+rb(40,228,300,52,['Open http://address in a private','window or another browser'])+ln(190,280,190,306)+tx(204,298,'blank',11,'start')+rb(40,306,300,52,['Restart the router, then try','a cable instead of Wi-Fi'])
    return mk('640 372',s,'Order of checks when the router page will not open')
def open_tall():
    s=DEFS+rb(12,8,196,40,['Router page will not open'],sz=12)+ln(110,48,110,68)
    s+=rb(12,68,196,60,["On the router's Wi-Fi or",'a cable, mobile data','and VPN off?'],acc=True,sz=12)+ln(208,98,236,98)+tx(222,90,'no',11)+rb(236,72,114,52,['Connect that','way, then','retry'],sz=11.5)
    s+=ln(110,128,110,152)+tx(122,146,'yes',11,'start')+rb(12,152,196,52,['Is the address exactly','your Default Gateway?'],acc=True,sz=12)+ln(208,178,236,178)+tx(222,170,'no',11)+rb(236,152,114,52,['Use the','gateway','address'],sz=11.5)
    s+=ln(110,204,110,228)+tx(122,222,'yes',11,'start')+rb(12,228,196,56,['Open http://address in','a private window or','another browser'],sz=12)+ln(110,284,110,308)+tx(122,302,'blank',11,'start')+rb(12,308,196,56,['Restart the router, then','try a cable instead','of Wi-Fi'],sz=12)
    return mk('360 380',s,'Order of checks when the router page will not open',True)
# ---- 4 double NAT
def nat_wide():
    s=DEFS+rb(6,70,84,56,['The','internet'])+ln(90,98,130,98)
    s+=rb(130,40,176,116,['ISP router','WAN 203.0.113.7','(public)','LAN 192.168.0.1'],acc=True,sz=12)+mt(218,32,['NAT 1'],12,'middle',1,700)+ln(306,98,340,98)
    s+=rb(340,40,176,116,['Your router','WAN 192.168.0.23','(private)','LAN 192.168.1.1'],acc=True,sz=12)+mt(428,32,['NAT 2'],12,'middle',1,700)+ln(516,98,550,98)+rb(550,70,84,56,['Devices','192.168.1.x'])
    return mk('640 170',s,'Double NAT: an ISP router with a public WAN address, then your router whose WAN address is private')
def nat_tall():
    s=DEFS+rb(100,8,160,40,['The internet'],sz=13)+ln(180,48,180,68)
    s+=mt(300,84,['NAT 1'],12,'middle',1,700)+rb(40,68,280,86,['ISP router','WAN 203.0.113.7 (public)','LAN 192.168.0.1'],acc=True,sz=13)+ln(180,154,180,176)
    s+=mt(300,192,['NAT 2'],12,'middle',1,700)+rb(40,176,280,86,['Your router','WAN 192.168.0.23 (private)','LAN 192.168.1.1'],acc=True,sz=13)+ln(180,262,180,284)
    s+=rb(100,284,160,44,['Devices 192.168.1.x'],sz=13)
    return mk('360 340',s,'Double NAT: an ISP router with a public WAN address, then your router whose WAN address is private',True)
WIDE=[gate_wide(),ipc_wide(),open_wide(),nat_wide()]
TALL=[gate_tall(),ipc_tall(),open_tall(),nat_tall()]

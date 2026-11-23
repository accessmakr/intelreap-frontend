"""Five diagrams for 'Does a VPN Change or Hide Your MAC Address?'. Wide (desktop) and tall (phone) are drawn separately for the same concept.
Drawing order = PAGE order: 1 where a MAC is used (local link) versus IP (across the internet); 2 what the router, VPN server and website each see; 3 TUN versus TAP;
4 what a private Wi-Fi address changes; 5 the IPv6 exception (MAC-derived versus privacy address)."""
from svgkit import *
from dns_figs import rb,mt,mk
# ---- 1 where a MAC is used
L1='A MAC address is used on the local link between your device and your router, while the IP address is used across the internet to the website'
def where_wide():
    s=DEFS+rb(8,20,130,56,['Your device','MAC and IP'],acc=True,sz=11.5)+ln(138,48,190,48)
    s+=rb(190,20,130,56,['Your router','local network'],sz=11.5)+ln(320,48,372,48)
    s+=rb(372,20,130,56,['The internet','between networks'],sz=11.5)+ln(502,48,554,48)+rb(554,20,78,56,['Website'],sz=11.5)
    s+=ln(8,104,320,104,arrow=False)+tx(164,124,'MAC address: used on this local link',12,'middle',0.9)
    s+=ln(190,150,632,150,arrow=False)+tx(411,170,'IP address: used end to end across the internet',12,'middle',0.9)
    return mk('640 184',s,L1)
def where_tall():
    s=DEFS+rb(40,8,280,48,['Your device','MAC and IP'],acc=True,sz=12.5)+ln(180,56,180,80)
    s+=rb(40,80,280,48,['Your router','local network'],sz=12.5)+ln(180,128,180,152)
    s+=rb(40,152,280,48,['The internet','between networks'],sz=12.5)+ln(180,200,180,224)+rb(40,224,280,40,['Website'],sz=12.5)
    s+=mt(180,296,['MAC address: used on the local link','(your device to your router)'],12,'middle',0.9)
    s+=mt(180,340,['IP address: used end to end','across the internet'],12,'middle',0.9)
    return mk('360 372',s,L1,True)
# ---- 2 what each one sees
L2='With a VPN on, the router sees your MAC and your IP, the VPN server sees your real IP but not your MAC, and a website sees the VPN server IP but not your MAC'
SEE=[(['Your router','on your local network'],['Your MAC and your local IP address'],False),
     (['The VPN server','after the tunnel'],['Your real public IP, not your MAC'],False),
     (['A website','at the far end'],['The VPN server IP, not your MAC'],False)]
def see_wide():
    s=DEFS
    for i,(a,b,acc) in enumerate(SEE):
        y=10+i*70; s+=rb(8,y,200,56,a,sz=11.5)+ln(208,y+28,252,y+28)+rb(252,y,380,56,b,sz=11.5)
    return mk('640 216',s,L2)
def see_tall():
    s=DEFS
    for i,(a,b,acc) in enumerate(SEE):
        y=8+i*140; s+=rb(20,y,320,48,a,sz=12.5)+ln(180,y+48,180,y+68)+rb(20,y+68,320,56,b,sz=12)
    return mk('360 430',s,L2,True)
# ---- 3 TUN versus TAP
L3='A TUN-style VPN such as WireGuard carries IP packets, so no MAC crosses the tunnel; a TAP-style VPN such as bridged OpenVPN carries Ethernet frames through a virtual adapter that has its own MAC'
TT=[(['TUN-style VPN','for example WireGuard'],['Carries IP packets'],['No MAC crosses','the tunnel']),
    (['TAP-style VPN','for example bridged OpenVPN'],['Carries Ethernet frames'],['The virtual adapter','has its own MAC'])]
def tun_wide():
    s=DEFS
    for i,(a,b,c) in enumerate(TT):
        y=10+i*84; s+=rb(8,y,190,64,a,sz=11.5)+ln(198,y+32,236,y+32)+rb(236,y,190,64,b,sz=11.5)+ln(426,y+32,464,y+32)+rb(464,y,168,64,c,sz=11)
    s+=tx(320,196,'Neither type changes the MAC of your physical network adapter',12,'middle',0.85)
    return mk('640 212',s,L3)
def tun_tall():
    s=DEFS
    for i,(a,b,c) in enumerate(TT):
        y=8+i*212; s+=rb(20,y,320,52,a,sz=12.5)+ln(180,y+52,180,y+72)+rb(20,y+72,320,48,b,sz=12.5)+ln(180,y+120,180,y+140)+rb(20,y+140,320,48,c,sz=12)
    s+=mt(180,448,['Neither type changes the MAC of','your physical network adapter'],12,'middle',0.85)
    return mk('360 480',s,L3,True)
# ---- 4 private Wi-Fi address
L4='A private Wi-Fi address replaces the hardware MAC with a random address that the Wi-Fi network sees; the VPN is not involved'
def priv_wide():
    s=DEFS+rb(8,20,190,64,['Hardware MAC','built into the adapter'],sz=11.5)+ln(198,52,236,52)
    s+=rb(236,20,190,64,['Private Wi-Fi address','random, per network'],acc=True,sz=11.5)+ln(426,52,464,52)+rb(464,20,168,64,['The Wi-Fi network','sees the random one'],sz=11.5)
    s+=tx(320,120,'This changes what the local network sees. A VPN does not.',12,'middle',0.85)
    return mk('640 136',s,L4)
def priv_tall():
    s=DEFS+rb(20,8,320,52,['Hardware MAC','built into the adapter'],sz=12.5)+ln(180,60,180,84)
    s+=rb(20,84,320,52,['Private Wi-Fi address','random, per network'],acc=True,sz=12.5)+ln(180,136,180,160)+rb(20,160,320,52,['The Wi-Fi network','sees the random one'],sz=12.5)
    s+=mt(180,244,['This changes what the local','network sees. A VPN does not.'],12,'middle',0.85)
    return mk('360 272',s,L4,True)
# ---- 5 IPv6 exception
L5='An IPv6 address built from the MAC embeds an identifier that websites can see; an address with privacy extensions uses a changing random identifier instead'
V6=[(['IPv6 address built','from the MAC'],['MAC-derived identifier','inside the address'],['Visible to websites'],False),
    (['IPv6 address with','privacy extensions'],['Changing random','identifier'],['MAC not exposed'],False)]
def v6_wide():
    s=DEFS
    for i,(a,b,c,acc) in enumerate(V6):
        y=10+i*84; s+=rb(8,y,190,64,a,sz=11.5)+ln(198,y+32,236,y+32)+rb(236,y,190,64,b,sz=11.5)+ln(426,y+32,464,y+32)+rb(464,y,168,64,c,acc=acc,sz=11.5)
    s+=tx(320,196,'RFC 4941 describes the privacy extensions',12,'middle',0.85)
    return mk('640 212',s,L5)
def v6_tall():
    s=DEFS
    for i,(a,b,c,acc) in enumerate(V6):
        y=8+i*212; s+=rb(20,y,320,52,a,sz=12.5)+ln(180,y+52,180,y+72)+rb(20,y+72,320,48,b,sz=12.5)+ln(180,y+120,180,y+140)+rb(20,y+140,320,48,c,acc=acc,sz=12.5)
    s+=mt(180,448,['RFC 4941 describes','the privacy extensions'],12,'middle',0.85)
    return mk('360 480',s,L5,True)
WIDE=[where_wide(),see_wide(),tun_wide(),priv_wide(),v6_wide()]
TALL=[where_tall(),see_tall(),tun_tall(),priv_tall(),v6_tall()]

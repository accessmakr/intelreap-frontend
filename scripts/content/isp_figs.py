"""Five diagrams for 'Can You Have Two Internet Providers in One House?'. Wide (desktop) and tall (phone) are drawn separately for the same concept.
Page order = drawing order here: 1 three setups; 2 failover; 3 load balancing by ratio; 4 one download vs many connections; 5 wiring."""
from svgkit import *
from dns_figs import rb,mt,mk
# ---- 1 three setups
L1='Three ways to use two providers: one dual-WAN router makes one network, two routers make two separate networks, and a phone hotspot is a manual backup'
SET=[(['One dual-WAN router','two WAN connections'],['One network','automatic failover or sharing'],['Needs a router with','two WAN connections'],True),
     (['Two routers','one per provider'],['Two separate networks','you pick one per device'],['Needs two routers','and two Wi-Fi names'],False),
     (['Phone hotspot','mobile data as backup'],['Manual backup','for one or a few devices'],['Needs a phone data plan','and switching by hand'],False)]
def setups_wide():
    s=DEFS
    for i,(a,b,c,acc) in enumerate(SET):
        x=8+i*212
        s+=rb(x,10,200,56,a,acc=acc,sz=11.5)+ln(x+100,66,x+100,104)+rb(x,104,200,64,b,sz=11.5)+ln(x+100,168,x+100,198)+rb(x,198,200,52,c,sz=11.5)
    return mk('640 262',s,L1)
def setups_tall():
    s=DEFS
    for i,(a,b,c,acc) in enumerate(SET):
        y=8+i*204
        s+=rb(20,y,320,44,a,acc=acc,sz=12)+ln(180,y+44,180,y+62)+rb(20,y+62,320,60,b,sz=12)+ln(180,y+122,180,y+138)+rb(20,y+138,320,44,c,sz=12)
    return mk('360 602',s,L1,True)
# ---- 2 failover
L2='Failover: the router checks the primary line, and when the check fails it moves traffic to the backup line; the public IP address changes with the line'
def fail_wide():
    s=DEFS
    B=[(['Primary line','carries your traffic'],False),(['Router checks it','DNS query or ping'],False),(['Check fails','traffic moves to backup'],True),(['Primary recovers','optional switch back'],False)]
    for i,(t,acc) in enumerate(B):
        x=8+i*160; s+=rb(x,10,144,60,t,acc=acc,sz=11.5)
        if i<3: s+=ln(x+144,40,x+160,40)
    s+=tx(320,108,'Your public IP address changes when the line changes',12,'middle',0.85)
    return mk('640 124',s,L2)
def fail_tall():
    s=DEFS
    B=[(['Primary line','carries your traffic'],False),(['Router checks it','DNS query or ping'],False),(['Check fails','traffic moves to backup'],True),(['Primary recovers','optional switch back'],False)]
    for i,(t,acc) in enumerate(B):
        y=8+i*76; s+=rb(20,y,320,52,t,acc=acc,sz=12.5)
        if i<3: s+=ln(180,y+52,180,y+76)
    s+=mt(180,334,['Your public IP address','changes when the line changes'],12,'middle',0.85)
    return mk('360 364',s,L2,True)
# ---- 3 load balancing by ratio
L3='Load balancing: the router assigns each new connection to a line by a ratio, for example 3 to 1, so many connections share both lines'
def lb_wide():
    s=DEFS+rb(8,88,150,56,['Your devices','many connections'],sz=11.5)+ln(158,116,210,116)
    s+=rb(210,80,150,72,['Router','assigns each connection','by a ratio'],acc=True,sz=11.5)
    s+=ln(360,100,412,40)+ln(360,132,412,192)
    s+=rb(412,10,220,60,['Line A','3 of every 4 connections'],sz=11.5)+rb(412,162,220,60,['Line B','1 of every 4 connections'],sz=11.5)
    s+=tx(320,248,'Example ratio 3:1. Each connection stays on one line.',12,'middle',0.85)
    return mk('640 262',s,L3)
def lb_tall():
    s=DEFS+rb(60,8,240,48,['Your devices','many connections'],sz=12.5)+ln(180,56,180,80)
    s+=rb(60,80,240,64,['Router','assigns each connection','by a ratio'],acc=True,sz=12.5)
    s+=ln(150,144,94,176)+ln(210,144,266,176)
    s+=rb(12,176,164,60,['Line A','3 of every','4 connections'],sz=11.5)+rb(184,176,164,60,['Line B','1 of every','4 connections'],sz=11.5)
    s+=mt(180,268,['Example ratio 3:1.','Each connection stays on one line.'],12,'middle',0.85)
    return mk('360 296',s,L3,True)
# ---- 4 one download vs many connections
L4='One large download stays on one line and gets that line\'s speed; many connections at once can use both lines'
def dl_wide():
    s=DEFS
    s+=rb(8,10,170,56,['One large download','a single connection'],sz=11.5)+ln(178,38,235,38)+rb(235,10,170,56,['Stays on one line','one path per connection'],acc=True,sz=11.5)+ln(405,38,462,38)+rb(462,10,170,56,['Speed of one line','not the sum'],sz=11.5)
    s+=rb(8,104,170,56,['Many connections','at the same time'],sz=11.5)+ln(178,132,235,132)+rb(235,104,170,56,['Spread across lines','by the router'],acc=True,sz=11.5)+ln(405,132,462,132)+rb(462,104,170,56,['More total capacity','across all of them'],sz=11.5)
    s+=tx(320,196,'Ordinary TCP uses a single path per connection (RFC 8684)',12,'middle',0.85)
    return mk('640 210',s,L4)
def dl_tall():
    s=DEFS
    s+=rb(20,8,320,44,['One large download','a single connection'],sz=12.5)+ln(180,52,180,72)+rb(20,72,320,44,['Stays on one line','one path per connection'],acc=True,sz=12.5)+ln(180,116,180,136)+rb(20,136,320,44,['Speed of one line','not the sum'],sz=12.5)
    s+=rb(20,208,320,44,['Many connections','at the same time'],sz=12.5)+ln(180,252,180,272)+rb(20,272,320,44,['Spread across lines','by the router'],acc=True,sz=12.5)+ln(180,316,180,336)+rb(20,336,320,44,['More total capacity','across all of them'],sz=12.5)
    s+=mt(180,408,['Ordinary TCP uses a single path','per connection (RFC 8684)'],12,'middle',0.85)
    return mk('360 436',s,L4,True)
# ---- 5 wiring
L5='Wiring: each provider\'s modem or ONT connects to its own WAN port on a dual-WAN router, and your devices connect to the router by Wi-Fi or LAN'
def wire_wide():
    s=DEFS+rb(8,10,150,56,['Provider A','modem or ONT'],sz=11.5)+rb(8,134,150,56,['Provider B','modem or ONT'],sz=11.5)
    s+=ln(158,38,260,86)+ln(158,162,260,114)
    s+=rb(260,60,170,80,['Dual-WAN router','WAN 1 and WAN 2'],acc=True,sz=11.5)+ln(430,100,490,100)+rb(490,72,142,56,['Your devices','Wi-Fi and LAN'],sz=11.5)
    return mk('640 200',s,L5)
def wire_tall():
    s=DEFS+rb(12,8,164,52,['Provider A','modem or ONT'],sz=11.5)+rb(184,8,164,52,['Provider B','modem or ONT'],sz=11.5)
    s+=ln(94,60,150,100)+ln(266,60,210,100)
    s+=rb(60,100,240,72,['Dual-WAN router','WAN 1 and WAN 2'],acc=True,sz=12.5)+ln(180,172,180,200)+rb(60,200,240,52,['Your devices','Wi-Fi and LAN'],sz=12.5)
    return mk('360 268',s,L5,True)
WIDE=[setups_wide(),fail_wide(),lb_wide(),dl_wide(),wire_wide()]
TALL=[setups_tall(),fail_tall(),lb_tall(),dl_tall(),wire_tall()]

from svgkit import *
A='var(--color-accent-primary,#0ea5e9)'
f1=DEFS+box(20,40,150,56,'Your device','192.168.1.42')+box(245,40,150,56,'Default gateway','192.168.1.1 (router)',accent=True)+box(470,40,150,56,'The internet','everything else')+ln(170,68,245,68)+ln(395,68,470,68)
f1+=tx(320,132,'Anything outside your own network is sent to the default gateway first.',12)
F1=svg('640 150',f1,'Your device sends traffic to the default gateway, which forwards it to the internet')
f2=DEFS
for i,(t,s) in enumerate([('Windows','ipconfig'),('macOS','route -n get default'),('Linux','ip route'),('iPhone','Wi-Fi > (i)'),('Android','Wi-Fi details')]): f2+=box(6+i*126,30,118,56,t,s)
f2+=tx(320,126,'Every device already knows the gateway. You only have to ask it.',12)
F2=svg('640 140',f2,'Where each operating system shows the default gateway')
f3='<rect x="120" y="8" width="400" height="140" rx="8" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.4"/>'+tx(320,32,'Output of ipconfig (Windows)',13,wt=700)
for i,(k,v,hl) in enumerate([('IPv4 Address','192.168.1.42',0),('Subnet Mask','255.255.255.0',0),('Default Gateway','192.168.1.1',1)]):
    y=64+i*30
    if hl: f3+=f'<rect x="132" y="{y-18}" width="376" height="28" rx="5" fill="{A}" fill-opacity="0.2"/>'
    f3+=tx(146,y,k,12,'start',0.85)+tx(494,y,v,12,'end',1,700 if hl else 400)
f3+=tx(320,172,'The Default Gateway line is the router address you type into a browser.',12)
F3=svg('640 186',f3,'ipconfig output with the Default Gateway line highlighted')
f4=DEFS+box(10,40,140,60,'Modem / ONT','from your ISP')+box(250,30,200,80,'Router','LAN 192.168.1.1',accent=True)+tx(350,126,'WAN 203.0.113.7 (public)',12,wt=600)+box(540,40,90,60,'Devices','private')+ln(150,70,250,70)+ln(450,70,540,70)
f4+=tx(320,160,'Many ISP boxes combine modem and router in one device. The gateway you type in is the LAN side.',12)
F4=svg('640 174',f4,'Modem, router and devices with the LAN and WAN addresses of the router')
f5=DEFS
for i,a in enumerate(['192.168.0.1','192.168.1.1','10.0.0.1','192.168.1.254']): f5+=box(8+i*158,34,142,48,a)
f5+=tx(320,116,'Common defaults. These are conventions, not rules. The label on the router and the commands above are authoritative.',12)
F5=svg('640 130',f5,'Four common default router addresses')
S=dict(slug='find-router-ip-address',date='2026-10-31',date_label='31 October 2026',plan='P14',
title="How to Find Your Router's IP Address on Any Device",headline="How to Find Your Router's IP Address on Windows, Mac, Linux, iPhone and Android",
desc="Find your router's IP address (default gateway) on Windows, Mac, Linux, iPhone or Android. Includes a device step picker, default address list and diagrams.",
kw=["how to find router ip address","find router ip address","how do i find my router's ip address","default gateway","router ip address windows 11","192.168.1.1"],
about="Router IP address",section='Networking How-To',crumb="Find Your Router's IP Address",
h1='How to Find Your <span class="ndic-highlight">Router\'s IP Address</span>',tagline='Your router address is the default gateway. Pick your device and read it in seconds.',kicker='Routers &amp; Devices',cta='Pick My Device',
qa_title="Your router's IP address is your default gateway",
qa_body="Your router's IP address is the default gateway your device already uses. On Windows run ipconfig and read Default Gateway. On Mac use route -n get default, on Linux ip route, and on iPhone open Wi-Fi, tap the network's info icon and read Router. Common values are 192.168.0.1, 192.168.1.1 and 10.0.0.1.",
og_title='How to Find Your <span style="color:#38bdf8">Router\'s IP Address</span>',og_sub='Default gateway on Windows, Mac, Linux, iPhone and Android',og_chip='192 . 168 . 1 . <span style="color:#38bdf8">1</span>',
card_desc="Find your router's IP address (default gateway) on Windows, Mac, Linux, iPhone or Android, with a step picker and a list of common default addresses.",
picker_label='Choose your device',picker_note="Android menus differ by phone maker. If you do not see Gateway, open the network details and choose Advanced or View more.",
picker=[('Windows 10 / 11',['Press <strong>Windows + R</strong>, type <code>cmd</code> and press Enter.','Run <code>ipconfig</code>.','Read <strong>Default Gateway</strong> under your active adapter. That is the router address.']),
('Mac',['Open <strong>Terminal</strong>.','Run <code>route -n get default</code>.','Read the <strong>gateway</strong> line. Or open <strong>System Settings > Wi-Fi > Details > TCP/IP</strong> and read <strong>Router</strong>.']),
('Linux',['Open a terminal.','Run <code>ip route | grep default</code>.','The address after <strong>via</strong> is the router.']),
('iPhone or iPad',['Open <strong>Settings > Wi-Fi</strong>.','Tap the <strong>(i)</strong> next to your network.','Read the <strong>Router</strong> row.']),
('Android',['Open <strong>Settings > Network &amp; internet > Wi-Fi</strong>.','Tap the gear next to your network, then <strong>Advanced</strong> or <strong>View more</strong> if needed.','Read <strong>Gateway</strong> (some phones call it Router).']),
('No device handy',['Check the label on the router. Many print the admin address, such as 192.168.1.1 or a name like routerlogin.net.','If the label is missing, use any connected computer and one of the other options.'])],
panel=dict(eyebrow='Network Route panel',h3='Who owns your network?',p='A router has two addresses: a private one inside and a public one outside. The <a href="/intelligence/network-route">Network Route panel</a> shows the owner of your public address. The difference is explained in <a href="/learn/what-is-an-ip-address">What Is an IP Address?</a>.',href='/intelligence/network-route',btn='Open Network Route'),
sections=[
('gateway','What the Router Address Really Is','<p>When your device wants to reach anything outside your own network, it hands the traffic to one address: the default gateway. On a home network that is your router, so the router address and the default gateway are the same thing.</p>'+fig(F1,'Traffic for destinations outside your network goes to the default gateway.')+table('Router address, gateway and public address',['Term','What it is','Example'],[['Router (LAN) address','Address of the router inside your network','192.168.1.1'],['Default gateway','The address your device sends outside traffic to. Same as the router LAN address','192.168.1.1'],['Public (WAN) address','Address the internet sees, from your ISP','203.0.113.7']])),
('methods','Where Each Device Shows It','<p>You do not need to guess. Each system stores the gateway and will show it with one command or one menu.</p>'+fig(F2,'Where each system shows the gateway address.')),
('windows','Windows: ipconfig','<p>The <code class="ir-code">ipconfig</code> command prints every adapter. Use the one that is connected, normally Wi-Fi or Ethernet, and read its Default Gateway line.</p>'+fig(F3,'The Default Gateway line in ipconfig output.')),
('mac-linux','Mac and Linux','<p>On a Mac, <code class="ir-code">route -n get default</code> prints the gateway, and System Settings shows it under the network details. On Linux, <code class="ir-code">ip route</code> lists the default route with its next hop address.</p>'),
('phones','iPhone and Android','<p>Phones show the gateway in the Wi-Fi details for the network you are on. On iPhone it is called Router. On Android the label is Gateway or Router, sometimes behind an Advanced section.</p>'),
('defaults','Common Default Addresses','<p>If you cannot check a device, these are the addresses routers most often use. They are conventions and your router may differ, especially an ISP box. Once you have the address, open it in a browser and sign in with the admin details on the router label.</p>'+fig(F5,'Frequently used default router addresses.')),
('modem','Modem, Router and the Public Address','<p>The router address you find here is the private side. The address websites see is your public address, shown in the <a href="/intelligence/network-identity">Network Identity panel</a>. If a device lists a modem and a router separately, the gateway for your devices is the router. To find other devices, try our <a href="/guides/how-to-find-ip-address-of-any-device">guide to finding the IP address of any device</a> or the <a href="/learn/find-printer-ip-address">printer IP guide</a>.</p>'+fig(F4,'The router has a private LAN address and a public WAN address.'))],
logic="Define the term first (router address equals default gateway), then show where each device reveals it, then give the fallback list and the difference between private and public addresses to prevent the most common mix-up.",
method="Commands and menu names follow the default behaviour of current Windows, macOS, Linux, iOS and Android. Phone menus vary by maker and version, so the page names the label to look for. Default addresses are listed as conventions only and were not tied to specific brands.",
cites=[("RFC 1918: Address Allocation for Private Internets",'https://www.rfc-editor.org/rfc/rfc1918'),("RFC 1122: Requirements for Internet Hosts (default gateway)",'https://www.rfc-editor.org/rfc/rfc1122'),("RFC 2131: Dynamic Host Configuration Protocol",'https://www.rfc-editor.org/rfc/rfc2131'),("Microsoft Learn: ipconfig",'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ipconfig')],
faq_sub='Nine questions on router addresses, gateways and logging in.',
faq=[("Is the router IP address the same as the default gateway?","On a home network, yes. The default gateway is the router's address on your local network."),
("Why is my router address 192.168.1.1 or 192.168.0.1?","These are common defaults from the private ranges in RFC 1918. They are conventions, so your router may use another address."),
("Is the router address my public IP address?","No. The router address is private and works only inside your network. Your public address is assigned by your ISP and shown in the <a href=\"/intelligence/network-identity\">Network Identity panel</a>."),
("The address does not open in my browser. What now?","Confirm you are on the router's own network, type the address with http://, and check you used the gateway rather than your device's address. Some routers use a name printed on the label."),
("I cannot find Gateway on my Android phone.","Open the network details and look under Advanced or View more. Some phones label it Router."),
("Does the router address ever change?","Rarely. It is set on the router. Your device addresses change more often, as explained in <a href=\"/learn/what-is-an-ip-address\">What Is an IP Address?</a>."),
("What is the difference between a modem and a router?","A modem connects to your ISP, and a router shares that connection with your devices. Many ISP boxes combine both."),
("Can I find the router address without being connected?","No. A device needs to be connected to the network. If you are locked out, read the label or reset the router."),
("Is it safe to share my router's private address?","It is low risk because it only works inside your network, but the admin login should still be changed from the default.")])

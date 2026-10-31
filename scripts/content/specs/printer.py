from svgkit import *
A='var(--color-accent-primary,#0ea5e9)'
# F1 four ways
f1=DEFS+box(215,10,210,40,"Need the printer's IP",accent=True)
for i,(t,s) in enumerate([("Printer screen","fastest"),("Windows","Printer properties"),("Mac / Linux","lpstat -v"),("Router list","no printer access")]):
    x=10+i*155; f1+=ln(320,50,x+70,86)+box(x,86,140,56,t,s)
f1+=tx(320,176,'Any one of the four is enough. Start with the printer screen if you can reach it.',12)
F1=svg('640 190',f1,'Four ways to find a printer IP address')
# F2 LAN
f2=DEFS+box(235,10,170,52,'Router','192.168.1.1',accent=True)
for i,(t,a) in enumerate([('Printer','192.168.1.50'),('Laptop','192.168.1.42'),('Phone','192.168.1.23')]):
    x=30+i*210; f2+=ln(320,62,x+70,112)+box(x,112,140,52,t,a,accent=i==0)
f2+=tx(320,196,'Printing is a local conversation: your device talks to the printer address on the same network.',12)
F2=svg('640 210',f2,'A printer and other devices share private addresses behind one router')
# F3 Windows path
f3=DEFS
for i,t in enumerate(['Printers & scanners','Printer properties','Ports tab','Port shows the IP']):
    x=8+i*158; f3+=box(x,30,138,56,t,accent=i==3)+(ln(x+138,58,x+158,58) if i<3 else '')
f3+=tx(320,124,'Settings > Bluetooth & devices > Printers & scanners > your printer',12)+tx(320,144,'The port name often looks like IP_192.168.1.50 or 192.168.1.50',12,op=0.65)
F3=svg('640 160',f3,'Windows path from Printers and scanners to the Ports tab')
# F4 config report
f4='<rect x="170" y="8" width="300" height="196" rx="8" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.4"/>'+tx(320,32,'Network Configuration Page',13,wt=700)
for i,(k,v,hl) in enumerate([('Status','Connected',0),('Network name','HomeWiFi',0),('IP address','192.168.1.50',1),('Subnet mask','255.255.255.0',0),('Gateway','192.168.1.1',0)]):
    y=64+i*28
    if hl: f4+=f'<rect x="182" y="{y-17}" width="276" height="26" rx="5" fill="{A}" fill-opacity="0.2"/>'
    f4+=tx(196,y,k,12,'start',0.8)+tx(446,y,v,12,'end',1,700 if hl else 400)
f4+=tx(320,224,'Most printers can print this page from the Network or Wi-Fi menu.',12)
F4=svg('640 236',f4,'Example network configuration page with the IP address highlighted')
# F5 reservation
f5=DEFS+tx(80,24,'DHCP default',13,'middle',1,700)+tx(80,104,'With reservation',13,'middle',1,700)
for i,a in enumerate(['.50','.63','.41']): f5+=box(150+i*160,30,120,44,a,['Monday','After restart','Next week'][i])+(ln(270+i*160,52,310+i*160,52) if i<2 else '')
for i in range(3): f5+=box(150+i*160,110,120,44,'.50',['Monday','After restart','Next week'][i],accent=True)+(ln(270+i*160,132,310+i*160,132) if i<2 else '')
f5+=tx(320,186,'A DHCP reservation tells the router to always give this printer the same address.',12)
F5=svg('640 200',f5,'Printer address changing with plain DHCP versus staying fixed with a reservation')
S=dict(slug='find-printer-ip-address',date='2026-10-31',date_label='31 October 2026',plan='P13',
title="How to Find a Printer's IP Address on Any Device",headline="How to Find a Printer's IP Address on Windows, Mac, Linux, Phone or Router",
desc="Find your printer's IP address in under a minute: printer menu, Windows, Mac, Linux or your router. Includes a device step picker and diagrams.",
kw=["how to find printer ip address","find printer ip address","how to check printer ip address","how do i find my printer's ip address","printer ip address windows 11","printer ip address mac"],
about="Printer IP address",section='Networking How-To',crumb="Find a Printer's IP Address",
h1='How to Find a <span class="ndic-highlight">Printer\'s IP Address</span>',tagline="Four reliable ways, from the printer's own screen to your router, with steps matched to your device.",kicker='Printers &amp; Devices',cta='Pick My Device',
qa_title="Four reliable ways to find a printer's IP address",
qa_body="The fastest way is the printer's own screen: print a network configuration page or open its Wi-Fi or Network menu. On Windows, open the printer's Properties and check the Ports tab. On Mac or Linux, run lpstat -v in a terminal. Your router's connected-devices list also shows it.",
og_title='How to Find a <span style="color:#38bdf8">Printer\'s IP Address</span>',og_sub='Printer screen, Windows, Mac, Linux or your router',og_chip='192 . 168 . 1 . <span style="color:#38bdf8">50</span>',
card_desc="Four ways to find a printer's IP address: the printer menu, Windows, Mac and Linux, or your router, with a device step picker.",
picker_label='Choose your device',picker_note="Menu names vary by printer maker and model. The pattern is the same: look for Network, Wi-Fi or Status, then an item called IP address.",
picker=[('Printer screen (any model)',['On the printer, open <strong>Settings</strong> or <strong>Setup</strong>, then <strong>Network</strong> or <strong>Wi-Fi</strong>.','Choose <strong>Network status</strong>, <strong>Wireless summary</strong> or <strong>Print network configuration</strong>.','Read the line labelled <strong>IP address</strong>. A value starting 169.254 means the printer did not get an address from the router.']),
('Windows 10 / 11',['Open <strong>Settings > Bluetooth &amp; devices > Printers &amp; scanners</strong> and select the printer.','Choose <strong>Printer properties</strong> and open the <strong>Ports</strong> tab. The checked port shows the address.','Or run in PowerShell: <code>Get-Printer | Select Name,PortName</code> then <code>Get-PrinterPort | Select Name,PrinterHostAddress</code>.']),
('Mac',['Open <strong>Terminal</strong> and run <code>lpstat -v</code>.','Find your printer in the output. The address appears in the device URI, for example <code>ipp://192.168.1.50/ipp/print</code>.','If it shows a name ending in .local instead, run <code>ping -c 1 name.local</code> to see its address.']),
('Linux',['Run <code>lpstat -v</code> in a terminal.','Read the address inside the device URI (for example <code>ipp://192.168.1.50/ipp/print</code>).','Alternatively open <code>http://localhost:631/printers</code> if the CUPS web interface is enabled.']),
('iPhone, iPad or Android',['A phone cannot show a printer\'s address directly. Open the maker\'s app (for example HP Smart, Epson iPrint or Canon PRINT) and look under printer or network details.','If the app does not show it, use the printer screen or the router method instead.']),
('Router (works for any printer)',['Open your router\'s admin page (see the <a href="/learn/find-router-ip-address">router IP guide</a>) and sign in.','Open <strong>Connected devices</strong>, <strong>DHCP clients</strong> or <strong>Device list</strong>.','Find the printer by its name or manufacturer. The address is on the same row.'])],
panel=dict(eyebrow='Network Identity panel',h3='See what the internet sees',p='A printer\'s address is private and only works inside your home. The <a href="/intelligence/network-identity">Network Identity panel</a> shows your public address, which is a different thing. Compare them in <a href="/learn/what-is-an-ip-address">What Is an IP Address?</a>.',href='/intelligence/network-identity',btn='Open Network Identity'),
sections=[
('ways','The Four Ways to Find It','<p>You only need one method. The printer screen needs no computer, Windows and Mac or Linux read it from the print queue, and the router list works even when the printer has no display. Pick by what you can reach right now.</p>'+fig(F1,'Four routes to the same answer. Use whichever you can reach first.')+table('Methods compared',['Method','Needs','Works with no display','Effort'],[['Printer screen','Access to the printer','No','Lowest'],['Windows Properties','A Windows PC with the printer added','Yes','Low'],['Mac or Linux terminal','A Mac or Linux computer with the printer added','Yes','Low'],['Router device list','Router login','Yes','Medium']])),
('where','Where a Printer Sits on Your Network','<p>A network printer gets a private address from your router, just like a laptop does, usually through DHCP. Because it is private, the address only works on your own network. If you are unsure what that means, read <a href="/learn/what-is-an-ip-address">what an IP address is</a> first.</p>'+fig(F2,'The printer, laptop and phone all have private addresses behind one router.')),
('windows','Windows 10 and 11','<p>Windows stores the printer address in the port the printer uses. The Ports tab is the quickest place to read it, and the PowerShell commands in the picker give the same answer in a single line each.</p>'+fig(F3,'The Windows route ends at the Ports tab, where the printer address is shown.')),
('mac-linux','Mac and Linux','<p>Both use CUPS. The command <code class="ir-code">lpstat -v</code> lists every printer with its device address. If the address is a name such as <code class="ir-code">printer.local</code>, the printer is found by name, and pinging that name reveals the numeric address.</p>'),
('report','From the Printer Itself','<p>Nearly every network printer can print a configuration page. It lists the address, subnet mask and gateway in one place, which is useful when you also need to fix a connection problem.</p>'+fig(F4,'What a network configuration page typically contains. Layout varies by maker.')),
('stable','Keeping the Address From Changing','<p>By default the router may hand the printer a different address after a restart, which breaks printing set up by address. Two fixes exist: a DHCP reservation on the router, or a static address set on the printer. The reservation is easier to undo and keeps all settings in one place. Method details are in <a href="/guides/how-to-find-ip-address-of-any-device">our guide to finding the IP address of any device</a>.</p>'+fig(F5,'A reservation keeps the same address across restarts.')+table('Reservation versus static',['Feature','DHCP reservation','Static on the printer'],[['Set on','Router','Printer'],['Risk of address clash','Low','Higher if misconfigured'],['Survives a router change','No, redo it','Yes, if the range still matches'],['Best for','Most homes','Offices and fixed setups']]))],
logic="Start with the method needing the least access, then move to ones that need a computer or the router. Finish with how to stop the address from changing so the lookup does not have to be repeated.",
method="Commands are standard operating system tools: Windows PowerShell printer cmdlets and CUPS <code class=\"ir-code\">lpstat</code>. Printer menu names differ between makers and models, so the page describes what to look for instead of one exact path. Steps were not tested on every printer model.",
cites=[("RFC 8011: Internet Printing Protocol/1.1 (IPP)",'https://www.rfc-editor.org/rfc/rfc8011'),("Microsoft Learn: Get-PrinterPort",'https://learn.microsoft.com/en-us/powershell/module/printmanagement/get-printerport'),("Microsoft Learn: Get-Printer",'https://learn.microsoft.com/en-us/powershell/module/printmanagement/get-printer'),("RFC 2131: Dynamic Host Configuration Protocol",'https://www.rfc-editor.org/rfc/rfc2131'),("RFC 1918: Address Allocation for Private Internets",'https://www.rfc-editor.org/rfc/rfc1918'),("CUPS: Common UNIX Printing System",'https://www.cups.org/')],
faq_sub='Nine questions about finding, keeping and fixing a printer address.',
faq=[("Why would I need my printer's IP address?","You need it to add a printer manually, open its settings page in a browser, fix a printer that shows as offline, or set up printing from a device that cannot find it automatically."),
("Is the printer's IP address the same as my home's public IP address?","No. The printer has a private address that only works inside your network. Your home's public address is shared by all your devices. The <a href=\"/intelligence/network-identity\">Network Identity panel</a> shows the public one."),
("My printer shows an address starting 169.254. What does that mean?","It means the printer could not get an address from the router and gave itself a link-local one. Check the Wi-Fi or cable connection, restart the printer and router, and confirm DHCP is on."),
("Can I find the printer's IP address from my phone?","Not directly. Use the printer maker's app, the printer's own screen or the router's device list. Phones show their own address, not other devices'."),
("Does a printer's IP address change?","It can. Unless you set a reservation or a static address, the router may assign a new one after a restart or when the lease expires."),
("What if two devices have the same IP address?","Both lose connectivity at times. Give the printer a reservation outside the range the router hands out, or set it to a free address and keep it unique."),
("Is it safe to expose a printer to the internet?","No. Printers have limited security, so keep them on the private network and do not forward ports to them."),
("What are port 9100 and IPP?","Port 9100 is commonly used for raw printing and IPP is the standard Internet Printing Protocol, defined in RFC 8011. Both are normally used only on the local network."),
("I replaced my router and printing stopped. Why?","The new router may use a different address range, so the saved printer address no longer matches. Find the new address and re-add the printer.")])

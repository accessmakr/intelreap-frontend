from svgkit import *
FIGS=[vchain([('Your device','192.168.1.42'),('Default gateway','192.168.1.1 (router)'),('The internet','everything else')],acc={1},foot=['Outside traffic goes to the default gateway first'],label='Default gateway'),
vchain([('Windows','ipconfig'),('macOS','route -n get default'),('Linux','ip route'),('iPhone','Wi-Fi > (i) > Router'),('Android','Wi-Fi details > Gateway')],arrows=False,foot=['Every device already knows the gateway'],label='Where each system shows the gateway'),
vmock('Output of ipconfig (Windows)',[('IPv4 Address','192.168.1.42'),('Subnet Mask','255.255.255.0'),('Default Gateway','192.168.1.1')],hl=2,foot=['The Default Gateway line is the router address'],label='ipconfig output'),
vchain([('192.168.0.1',''),('192.168.1.1',''),('10.0.0.1',''),('192.168.1.254','')],arrows=False,foot=['Conventions, not rules. Check the label on the router.'],label='Common default addresses'),
vchain([('Modem / ONT','from your ISP'),('Router','LAN 192.168.1.1 | WAN 203.0.113.7'),('Devices','private addresses')],acc={1},foot=['The WAN address is public, the LAN address is private'],label='Modem router and devices'),
vchain([('Internet',''),('ISP router','LAN 192.168.0.1'),('Your router','WAN 192.168.0.23 (private)'),('Devices','192.168.1.x')],acc={1,2},foot=['Two NAT layers: the second WAN address is private'],label='Double NAT')]

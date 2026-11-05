import re,collections
B={}
B['B1_62']="""does my ip address change|does your ip address change|how can i get my ip address|how can you find your ip address|how do i find my printer's ip address|how do i find my roku ip address|how do i find the ip address for my roku|how do i find the ip address of my router|how do i know my ip address|how do i locate my ip address on my computer"""
B['B2_50']="""can i change my ip address|can you change your ip address|how can i change ip address|how can i check my ip address|how can you find ip address|how can you find out someone's ip address|how do i find my router's ip address|how do i find out my computer's ip address|how do i find out someone's ip address|how do i find printer ip address"""
B['B3_29']="""does ip address change|how can i find out my router ip address|how can i find someone's ip address|how do i find my ip address on my iphone|how do i find my iphone ip address|how do i find my printers ip address|how do i find my router ip address|how do i locate my ip address|how to check printer ip address|how to check the ip address of my computer"""
B['B4_35']="""how can you find someone's ip address|how do i find ip address for my router|how do i find the ip address of my printer|how do i get my ip address|how do i get to an ip address|how do ip addresses work|how do you find a printer's ip address|how do you find out an ip address|how to change ip address on one device|how to change ip address on one device windows 11"""
B['B5_22.9K']="""can an ip address be hacked|can i change my ip address on my iphone|can i change my iphone ip address|can ip address be hacked|can ip address show location|can t obtain ip address within time limit|can you change your ip address on iphone|can you get an ip address from an email|can you lookup an ip address|can you mask your ip address"""
B['B6_3']="""what's my ip address|what is an ip address|where is my address ip"""
B['B7_105']="""what is ip address|what my ip address|where is my ip address|how do i find my ip address|what is my ip address vpn|what's my address ip|how to change ip address|how to check the ip address|how to find printer ip address|how to know the ip address"""
B['B8_2.1K']=B['B4_35']+"\u200b"
B['B9_1.2K']="""can i change my ip address on my phone|can t get a teredo ip address xbox|can you change ip address|can you get your address from an ip address|can't get a teredo ip address|can't get a teredo ip address xbox|can't get teredo ip address|did my ip address change|do iphones have ip addresses|do mobiles have ip address"""
B['B10_440']="""can i change spectrum internal ip address|do phones have ip addresses|does ip address change with location|how can i change my ip address on my computer|how can i change my ip address on my phone|how can i check ip address|how can i find a printer ip address|how can i find an ip address from an email|how can i find ip address of my phone|how can i find my ip address on my router"""
B['B11_253']="""do ip addresses change|how can i find my ip address on my phone|how can i get a new ip address|how can we check ip address|how can you find an ip address from an email|how can you find out your ip address|how can you track an ip address|how do i change my ip address on my computer|how do i change the ip address|how do i find ip address on router"""
B['B12_90']="""a static ip address|can ip address be changed|how can i find my computer's ip address|how can i find my printer's ip address|how can i hide my ip address|how can you change an ip address|how can you change your ip address|how can you find out someones ip address|how do i change my ip address on my phone|how do i find ip address"""
allk=[]
for b,s in B.items():
    for k in s.replace("\u200b","").split("|"):
        allk.append((b,k.strip()))
print("rows shown:",len(allk))
u=sorted(set(k for _,k in allk))
print("unique exact:",len(u))
def norm(k): return re.sub(r"[^a-z0-9 ]","",k.replace("can t","cant"))
nu=set(norm(k) for k in u); print("unique after apostrophe/punct normalisation:",len(nu))
# duplicates
c=collections.Counter(k for _,k in allk)
print("dupes:",[k for k,v in c.items() if v>1])
print("B8 is exact copy of B4:", B['B8_2.1K'].replace("\u200b","")==B['B4_35'])
# clusters
rules=[("what-is-my-ip / where-is-my-ip",r"what('?s)? (is )?my|what my|where is my (ip|address)|where is my address|how (do|can) i (get|know) my|how (can|do) (i|you) (find|check|locate) (out )?(my|your) ip|how can i check my ip|how do i find my ip address$|how to know|how to check the ip|how can i check ip|how can we check|how do i find ip address$|how can you find ip address$|how can you find your ip|how can you find out your ip|how do i locate my ip address$|how do i get my ip|how do i find ip address"),
("what-is / how-it-works",r"what is (an )?ip|how do ip addresses work|how do i get to an ip"),
("printer IP",r"printer"),("roku IP",r"roku"),("router IP",r"router"),
("computer IP",r"computer"),("iphone/phone IP",r"iphone|phone|mobiles"),
("change/new/hide/mask IP",r"change|new ip|hide|mask"),
("does IP change / static",r"does .*change|do ip addresses change|did my ip|static"),
("find/track someone's IP",r"someone|track|from an email|lookup|get your address|address from an ip"),
("hacked/location/security",r"hacked|show location"),
("teredo/xbox/DHCP errors",r"teredo|obtain ip|spectrum")]
cl=collections.defaultdict(list)
for k in u:
    for n,r in rules:
        if re.search(r,k): cl[n].append(k); break
    else: cl["UNCLASSIFIED"].append(k)
for n,v in cl.items(): print("\n##",n,len(v)); [print("  ",x) for x in v]

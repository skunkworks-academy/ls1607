#!/usr/bin/env python3
from html.parser import HTMLParser
from pathlib import Path
import re, sys

root=Path(__file__).resolve().parents[1]
index=root/'index.html'
errors=[]
class Audit(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=[]; self.h1=0; self.tags=set(); self.links=[]; self.meta={}
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if a.get('id'): self.ids.append(a['id'])
        if tag=='h1': self.h1+=1
        if tag in {'header','nav','main','footer'}: self.tags.add(tag)
        if tag=='a' and a.get('href'): self.links.append(a['href'])
        if tag=='meta' and a.get('name'): self.meta[a['name']]=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical': self.meta['canonical']=a.get('href','')

def fail(m): errors.append(m); print('ERROR:',m,file=sys.stderr)
if not index.exists() or index.stat().st_size<10000: fail('index.html missing or unexpectedly small')
text=index.read_text(encoding='utf-8') if index.exists() else ''
p=Audit(); p.feed(text)
if p.h1!=1: fail(f'exactly one h1 required; found {p.h1}')
if len(p.ids)!=len(set(p.ids)): fail('duplicate HTML ids detected')
if not {'header','nav','main','footer'}.issubset(p.tags): fail('semantic landmarks missing')
for key in ['description','robots','canonical']:
    if not p.meta.get(key): fail(f'missing SEO metadata: {key}')
for required in ['Welcome, <span>Luca.</span>','Download my IDR','12-month roadmap workflow','Starter weekly timetable','Review and sign-off','Luca_Sprunt_Individual_Development_Roadmap.docx','prefers-reduced-motion','localStorage']:
    if required not in text: fail(f'missing required feature: {required}')
for private in ['lucasprunt@gmail.com','493240070']:
    if private.lower() in text.lower(): fail('protected contact detail found')
for href in p.links:
    if href.startswith(('#','http://','https://','mailto:')): continue
    target=root/href.split('#')[0].split('?')[0]
    if not target.exists(): fail(f'missing local target: {href}')
script=re.search(r'<script>([\s\S]*?)</script>',text)
if not script: fail('inline application script missing')
if errors: raise SystemExit(1)
print('Site validation passed')
print(f'- {len(p.ids)} unique ids')
print(f'- {len(p.links)} links inspected')
print('- SEO, privacy, semantic and responsive gates passed')

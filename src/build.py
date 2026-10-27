#!/usr/bin/env python3
"""Builds the MediaJack Systems site: src/pages/*.html + src/layout.html -> public/.

Each page starts with a <!--meta {...} --> block (path, title, description, nav, jsonld, robots, sitemap).
Run:  python3 src/build.py      (no packages needed). The output in public/ is what gets published.
"""
import json, re, pathlib, hashlib, datetime
from html import escape

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / 'src', ROOT / 'public'
SITE = 'https://mediajacksystems.com'

BUSINESS = {
    '@type': 'ProfessionalService',
    '@id': SITE + '/#business',
    'name': 'MediaJack Systems',
    'legalName': 'MediaJack Systems LLC',
    'url': SITE + '/',
    'logo': SITE + '/apple-touch-icon.png',
    'image': SITE + '/assets/img/og-image.png',
    'description': 'Print and digital marketing for small and growing businesses: Google and AI search, websites, branding, social media, email, ads, print and direct mail, and fractional CMO work. Flat fees, quoted before work starts.',
    'telephone': '+1-970-401-0185',
    'email': 'jack@mediajacksystems.com',
    'address': {'@type': 'PostalAddress', 'addressLocality': 'Englewood', 'addressRegion': 'CO', 'postalCode': '80111', 'addressCountry': 'US'},
    'areaServed': {'@type': 'Country', 'name': 'United States'},
    'founder': {'@id': SITE + '/about/#jack'},
    'knowsAbout': ['Local SEO', 'Google Business Profile', 'AI search visibility', 'Website design', 'Branding', 'Social media marketing', 'Email marketing', 'Google Ads', 'Facebook and Instagram ads', 'Direct mail', 'Every Door Direct Mail', 'Print marketing', 'Fractional CMO'],
}
JACK = {'@type': 'Person', '@id': SITE + '/about/#jack', 'name': 'Jack Johnson', 'jobTitle': 'Owner', 'worksFor': {'@id': SITE + '/#business'}, 'url': SITE + '/about/', 'email': 'jack@mediajacksystems.com', 'telephone': '+1-970-401-0185'}
SERVICES = [
    ('Get found', 'Google Business Profile, local search, AI search visibility, Google and Facebook/Instagram ads, and review routines.', '/services/#get-found'),
    ('Look the part', 'Logos and brand guides, websites and website fixes, landing pages, and photo and video.', '/services/#look-the-part'),
    ('Stay in touch', 'Social media management, email newsletters and campaigns, follow-ups and content.', '/services/#stay-in-touch'),
    ('Put it in their hands', 'Business cards, postcards and direct mail including Every Door Direct Mail, flyers, brochures, signs, banners, vehicle graphics and trade show displays.', '/services/#print'),
    ('Run it for you', 'Fractional CMO: marketing plan, budget and calendar, vendor management, sales materials and plain-English reporting.', '/services/#run-it'),
]

def crumbs(name, path):
    return {'@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE + '/'},
        {'@type': 'ListItem', 'position': 2, 'name': name, 'item': SITE + path}]}

def jsonld(kind, meta):
    graph = None
    if kind == 'home':
        graph = [{'@type': 'WebSite', '@id': SITE + '/#site', 'name': 'MediaJack Systems', 'url': SITE + '/', 'publisher': {'@id': SITE + '/#business'}}, BUSINESS, JACK]
    elif kind == 'services':
        graph = [{**BUSINESS, 'hasOfferCatalog': {'@type': 'OfferCatalog', 'name': 'Marketing services', 'itemListElement': [
            {'@type': 'Offer', 'itemOffered': {'@type': 'Service', 'name': n, 'description': d, 'url': SITE + u, 'provider': {'@id': SITE + '/#business'}}} for n, d, u in SERVICES]}},
            crumbs('Services', '/services/')]
    elif kind == 'about':
        graph = [{**JACK, 'description': 'Owner of MediaJack Systems, a print and digital marketing firm in Englewood, Colorado; fractional CMO.'}, {'@type': 'AboutPage', 'url': SITE + '/about/', 'about': {'@id': SITE + '/about/#jack'}}, crumbs('About', '/about/')]
    elif kind == 'contact':
        graph = [{'@type': 'ContactPage', 'url': SITE + '/contact/', 'about': {'@id': SITE + '/#business'}}, BUSINESS, crumbs('Contact', '/contact/')]
    if not graph:
        return ''
    return '<script type="application/ld+json">' + json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False, separators=(',', ':')) + '</script>'

def build():
    layout = (SRC / 'layout.html').read_text(encoding='utf-8')
    css_js = (OUT / 'assets/site.css').read_bytes() + (OUT / 'assets/site.js').read_bytes()
    version = hashlib.sha1(css_js).hexdigest()[:8]
    pages = []
    for f in sorted((SRC / 'pages').glob('*.html')):
        raw = f.read_text(encoding='utf-8')
        m = re.match(r'\s*<!--meta\s*(\{.*?\})\s*-->\s*', raw, re.S)
        meta = json.loads(m.group(1)); body = raw[m.end():].rstrip() + '\n'
        path = meta['path']
        html = layout
        nav = meta.get('nav', '')
        vals = {
            'title': meta['title'], 'og_title': meta.get('og_title', meta['title']), 'description': meta['description'],
            'canonical': SITE + (path if path != '/404.html' else '/'), 'robots': meta.get('robots', 'index, follow'),
            'version': version, 'jsonld': jsonld(meta.get('jsonld', 'none'), meta), 'body': body.rstrip('\n'),
            'cur_services': ' aria-current="page"' if nav == 'services' else '', 'cur_about': ' aria-current="page"' if nav == 'about' else '',
            'cur_contact': ' aria-current="page"' if nav == 'contact' else '',
        }
        for k, v in vals.items():
            html = html.replace('{{' + k + '}}', escape(v, quote=True) if k in ('title', 'og_title', 'description', 'canonical', 'robots') else v)
        assert '{{' not in html, f'unfilled placeholder in {f.name}'
        dest = OUT / ('index.html' if path == '/' else path.strip('/') if path.endswith('.html') else path.strip('/') + '/index.html')
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(html, encoding='utf-8')
        if meta.get('sitemap', True):
            pages.append(path)
    today = datetime.date.today().isoformat()
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for p in sorted(pages, key=lambda x: (x != '/', x)):
        sm.append(f'  <url><loc>{SITE}{p}</loc><lastmod>{today}</lastmod></url>')
    sm.append('</urlset>')
    (OUT / 'sitemap.xml').write_text('\n'.join(sm) + '\n', encoding='utf-8')
    print('built', len(pages) + 1, 'pages, assets version', version)

if __name__ == '__main__':
    build()

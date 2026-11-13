#!/usr/bin/env python3
"""Builds the MediaJack Systems site: src/pages/*.html + src/layout.html + src/site.json -> public/.

Each page starts with a <!--meta {...} --> block (path, title, description, nav, jsonld, robots, sitemap, plus
anything a partial needs, such as form_title).
In pages, the layout and partials:
  {{name}}                 a value: page meta first, then the generated parts below
  {{> name}}               the file src/partials/name.html
  {{#if name}}...{{/if}}   kept only when the value is filled in (not nested)
src/site.json holds the facts that switch parts on: the booking link, the photo, the work samples, testimonials,
profile links. An empty value leaves its part off the page.
Run:  python3 src/build.py      (no packages needed). The output in public/ is what gets published.
"""
import json, re, pathlib, hashlib, datetime, subprocess
from html import escape

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / 'src', ROOT / 'public'
SITE = 'https://mediajacksystems.com'
CFG = json.loads((SRC / 'site.json').read_text(encoding='utf-8'))
PROFILES = [u for u in CFG.get('profiles', {}).values() if u]
PHOTO = CFG.get('photo', '') if (OUT / f"assets/img/{CFG.get('photo', '')}-880.jpg").exists() else ''

BUSINESS = {
    '@type': 'ProfessionalService',
    '@id': SITE + '/#business',
    'name': 'MediaJack Systems',
    'legalName': 'MediaJack Systems LLC',
    'url': SITE + '/',
    'logo': SITE + '/apple-touch-icon.png',
    'image': SITE + '/assets/img/og-image.png',
    'description': 'Marketing and custom systems for local businesses: websites, Google and AI search, branding, social media, email, ads, print and direct mail, fractional CMO work, and custom-built software. Flat fees, quoted in writing before work starts.',
    'telephone': '+1-970-401-0185',
    'email': 'jack@mediajacksystems.com',
    'priceRange': '$295 to $1,500',
    'address': {'@type': 'PostalAddress', 'addressLocality': 'Englewood', 'addressRegion': 'CO', 'postalCode': '80111', 'addressCountry': 'US'},
    'areaServed': [{'@type': 'City', 'name': 'Englewood, Colorado'}, {'@type': 'City', 'name': 'Denver, Colorado'}, {'@type': 'Country', 'name': 'United States'}],
    'founder': {'@id': SITE + '/about/#jack'},
    'knowsAbout': ['Local SEO', 'Google Business Profile', 'AI search visibility', 'Website design', 'Branding', 'Social media marketing', 'Email marketing', 'Google Ads', 'Facebook and Instagram ads', 'Direct mail', 'Every Door Direct Mail', 'Print marketing', 'Fractional CMO', 'Custom software'],
}
JACK = {'@type': 'Person', '@id': SITE + '/about/#jack', 'name': 'Jack Johnson', 'jobTitle': 'Owner', 'worksFor': {'@id': SITE + '/#business'}, 'url': SITE + '/about/', 'email': 'jack@mediajacksystems.com', 'telephone': '+1-970-401-0185'}
# A personal LinkedIn profile (/in/...) is Jack's, not the company's: it goes on the person, and the rest on the business.
BUSINESS_PROFILES = [u for u in PROFILES if '/in/' not in u]
if BUSINESS_PROFILES:
    BUSINESS['sameAs'] = BUSINESS_PROFILES
if CFG.get('profiles', {}).get('google_business'):
    BUSINESS['hasMap'] = CFG['profiles']['google_business']
if CFG.get('profiles', {}).get('linkedin'):
    JACK['sameAs'] = [CFG['profiles']['linkedin']]
if PHOTO:
    JACK['image'] = f'{SITE}/assets/img/{PHOTO}-880.jpg'
if CFG.get('hours'):
    BUSINESS['openingHours'] = CFG['hours']

SERVICES = [
    ('Google and local search', 'Google Business Profile, local search, AI search visibility, Google and Facebook/Instagram ads, and review routines.', '/services/#get-found'),
    ('Websites and branding', 'Logos and brand guides, websites and website fixes, landing pages, and photo and video.', '/services/#look-the-part'),
    ('Social media and email', 'Social media management, email newsletters and campaigns, follow-ups and content.', '/services/#stay-in-touch'),
    ('Print and direct mail', 'Business cards, postcards and direct mail including Every Door Direct Mail, flyers, brochures, signs, banners, vehicle graphics and trade show displays.', '/services/#print'),
    ('Part-time marketing lead', 'Fractional CMO: marketing plan, budget and calendar, vendor management, sales materials and plain-English reporting.', '/services/#run-it'),
    ('Custom systems', 'Software built around how a business works: tools on a website such as calculators, checkers and maps, lead capture and follow-up systems, and company platforms built from the ground up. Quoted for the job.', '/services/#custom-systems'),
]
# Jack's price list of 30 Oct 2026: (what, price in USD, per month?)
PRICES = [
    ('Website for a small business, with a gallery of your work', 500, False),
    ('Hosting and small updates for a small business website', 50, True),
    ('Website for a bigger operation', 1500, False),
    ('Hosting and updates for a bigger operation', 150, True),
    ('Fixing the problems on a website you already have', 295, False),
    ('One social platform set up with 4 posts, small business', 150, False),
    ('12 social posts a month, small business', 100, True),
]

def offer(name, price, monthly):
    o = {'@type': 'Offer', 'itemOffered': {'@type': 'Service', 'name': name, 'provider': {'@id': SITE + '/#business'}}, 'priceCurrency': 'USD', 'price': price}
    if monthly:
        o['priceSpecification'] = {'@type': 'UnitPriceSpecification', 'price': price, 'priceCurrency': 'USD', 'unitCode': 'MON'}
    return o

def crumbs(name, path):
    return {'@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE + '/'},
        {'@type': 'ListItem', 'position': 2, 'name': name, 'item': SITE + path}]}

def jsonld(kind, meta):
    graph = None
    price_catalog = {'@type': 'OfferCatalog', 'name': 'Starting prices', 'itemListElement': [offer(*p) for p in PRICES]}
    if kind == 'home':
        graph = [{'@type': 'WebSite', '@id': SITE + '/#site', 'name': 'MediaJack Systems', 'url': SITE + '/', 'publisher': {'@id': SITE + '/#business'}}, {**BUSINESS, 'hasOfferCatalog': price_catalog}, JACK]
    elif kind == 'services':
        graph = [{**BUSINESS, 'hasOfferCatalog': {'@type': 'OfferCatalog', 'name': 'Marketing services and custom systems', 'itemListElement': [
            {'@type': 'Offer', 'itemOffered': {'@type': 'Service', 'name': n, 'description': d, 'url': SITE + u, 'provider': {'@id': SITE + '/#business'}}} for n, d, u in SERVICES] + [offer(*p) for p in PRICES]}},
            JACK, crumbs('Services', '/services/')]
    elif kind == 'websites':
        graph = [{'@type': 'Service', '@id': SITE + '/websites/#service', 'name': 'Websites for local businesses', 'serviceType': 'Website design', 'url': SITE + '/websites/',
                  'description': meta['description'], 'provider': {'@id': SITE + '/#business'}, 'areaServed': BUSINESS['areaServed'],
                  'offers': [offer(*p) for p in PRICES[:5]]}, BUSINESS, JACK, crumbs('Websites', '/websites/')]
    elif kind == 'checkup':
        graph = [{'@type': 'WebPage', 'url': SITE + '/check-up/', 'name': meta['title'], 'description': meta['description'], 'about': {'@id': SITE + '/#business'}},
                 BUSINESS, JACK, crumbs('Free check-up', '/check-up/')]
    elif kind == 'about':
        graph = [{**JACK, 'description': 'Owner of MediaJack Systems, a marketing and custom systems firm in Englewood, Colorado; fractional CMO.'}, {'@type': 'AboutPage', 'url': SITE + '/about/', 'about': {'@id': SITE + '/about/#jack'}}, crumbs('About', '/about/')]
    elif kind == 'contact':
        graph = [{'@type': 'ContactPage', 'url': SITE + '/contact/', 'about': {'@id': SITE + '/#business'}}, BUSINESS, JACK, crumbs('Contact', '/contact/')]
    if not graph:
        return ''
    return '<script type="application/ld+json">' + json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False, separators=(',', ':')) + '</script>'

# ---------------------------------------------------------------- the parts site.json switches on
def e(s):
    return escape(s, quote=True)

ARROW = '<svg class="arrow" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><use href="#arrow"/></svg>'

def picture(sizes, width, height, lazy=True):
    """The photo of Jack: WebP with a JPEG fallback."""
    if not PHOTO:
        return ''
    base = f'/assets/img/{PHOTO}'
    load = ' loading="lazy" decoding="async"' if lazy else ' fetchpriority="high"'
    return (f'<picture><source type="image/webp" srcset="{base}-480.webp 480w, {base}-640.webp 640w, {base}-880.webp 880w" sizes="{sizes}">'
            f'<img src="{base}-880.jpg" width="{width}" height="{height}" alt="{e(CFG.get("photo_alt", "Jack Johnson"))}"{load}></picture>')

def shot(w):
    """A job's real screenshots, on a computer and a phone: files <shot>-desk-480/-960 and <shot>-phone-160/-320 in assets/img."""
    name = w.get('shot', '')
    if not name or not (OUT / f'assets/img/{name}-desk-960.jpg').exists():
        return ''
    base = f'/assets/img/{name}'
    cap = f'<figcaption>{e(w["shot_caption"])}</figcaption>' if w.get('shot_caption') else ''
    return ('<figure class="shot"><div class="shot__frame">'
            f'<picture class="shot__desk"><source type="image/webp" srcset="{base}-desk-480.webp 480w, {base}-desk-960.webp 960w" sizes="(max-width: 899px) 80vw, 520px">'
            f'<img src="{base}-desk-960.jpg" width="960" height="600" loading="lazy" decoding="async" alt="{e(w.get("shot_alt", ""))}"></picture>'
            f'<picture class="shot__phone"><source type="image/webp" srcset="{base}-phone-160.webp 160w, {base}-phone-320.webp 320w" sizes="(max-width: 899px) 22vw, 142px">'
            f'<img src="{base}-phone-320.jpg" width="320" height="693" loading="lazy" decoding="async" alt="{e(w.get("shot_phone_alt", ""))}"></picture>'
            f'</div>{cap}</figure>')

def parts():
    p = {}
    b = CFG.get('booking_url', '')
    label = e(CFG.get('booking_label', 'Book a call'))
    p['booking_url'] = e(b)
    p['booking_btn'] = f'<a class="plate" href="{e(b)}" rel="noopener">{label}</a>' if b else ''
    p['booking_post'] = f'<a class="plate plate--post" href="{e(b)}" rel="noopener">{label}</a>' if b else ''
    p['booking_li'] = f'<li><a href="{e(b)}" rel="noopener">{label}</a></li>' if b else ''
    p['booking_sentence'] = f' Or <a href="{e(b)}" rel="noopener">pick a time for a 30-minute call</a>.' if b else ''
    p['reply_promise'] = e(CFG.get('reply_promise', ''))
    p['capacity'] = e(CFG.get('capacity', ''))
    p['hours'] = e(CFG.get('hours', ''))
    p['arrow'] = ARROW
    names = {'google_business': 'MediaJack on Google', 'linkedin': 'Jack on LinkedIn', 'facebook': 'Facebook', 'instagram': 'Instagram'}
    p['profile_links'] = ''.join(f'<li><a href="{e(u)}" rel="noopener me">{names.get(k, k)}</a></li>' for k, u in CFG.get('profiles', {}).items() if u)
    # the photo
    if PHOTO:
        base = f'/assets/img/{PHOTO}'
        p['byline'] = (f'<div class="byline"><figure class="byline__plate"><picture><source type="image/webp" srcset="{base}-240.webp 240w, {base}-480.webp 480w" sizes="114px">'
                       f'<img src="{base}-240.jpg" width="240" height="300" loading="lazy" decoding="async" alt="{e(CFG.get("photo_alt", "Jack Johnson"))}"></picture>'
                       '<figcaption class="blade"><span class="blade__name">Jack Johnson</span><span class="blade__tag">Owner</span></figcaption></figure>'
                       '<p>You deal with me from the first call to the finished job.</p></div>')
        def figure(lazy):
            return (f'<figure class="portrait">{picture("(max-width: 420px) 80vw, 322px", 880, 1100, lazy)}'
                    '<figcaption class="blade"><span class="blade__name">Jack Johnson</span><span class="blade__tag">Englewood, Colorado</span></figcaption></figure>')
        p['portrait'] = figure(True)          # far down the home page: loads when the reader gets near it
        p['portrait_lead'] = figure(False)    # near the top of About, where it is the biggest thing on screen: loads first
    else:
        p['byline'] = p['portrait'] = p['portrait_lead'] = ''
    # work zone: real jobs, each with its number
    work = CFG.get('work', [])
    if work:
        def job(w, cls='', pic='', detail=None):
            return (f'<li class="job{cls}">{pic}<div class="job__body">'
                    f'<p class="job__num">{e(w["number"])}</p><p class="job__label">{e(w.get("number_label", ""))}</p>'
                    f'<dl class="job__facts"><div><dt>Client</dt><dd>{e(w["client"])}</dd></div><div><dt>Job</dt><dd>{e(w["job"])}</dd></div></dl>'
                    f'<p class="job__detail">{detail if detail is not None else e(w["detail"])}</p></div></li>')
        t = []
        for i, w in enumerate(work):
            pic = shot(w)
            t.append(job(w, ' job--lead' if pic and i == 0 else '', pic))
        t.append(job({'client': 'MediaJack Systems', 'job': 'The website you are on', 'number': '0', 'number_label': 'cookies, trackers and pop-ups'}, '',
                     detail='One small script and one font file, built to the same checks I run on client sites. You can check it yourself: '
                            '<a href="https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fmediajacksystems.com%2F" rel="noopener">run Google\'s speed test on this page</a>.'))
        also = f'<p class="work-also">{e(CFG["work_also"])}</p>' if CFG.get('work_also') else ''
        note = f'<p>{e(CFG.get("work_note", ""))}</p>' if CFG.get('work_note') else ''
        p['work'] = ('<section class="section section--overcast" aria-labelledby="work-title"><div class="wrap">'
                     '<div class="section-head work-head"><p class="zone"><span>Work zone</span></p>'
                     f'<div><h2 id="work-title">Jobs I\'ve done, with the numbers</h2>{note}</div></div>'
                     f'<ul class="jobs">{"".join(t)}</ul>{also}</div></section>')
    else:
        p['work'] = ''
    # testimonials: real, named, with permission, or nothing
    ts = CFG.get('testimonials', [])
    if ts:
        q = ''.join(f'<li><blockquote><p>{e(x["quote"])}</p></blockquote><p class="quote__who"><strong>{e(x["name"])}</strong>, {e(x["business"])}{", " + e(x["town"]) if x.get("town") else ""}</p></li>' for x in ts)
        p['testimonials'] = ('<section class="section quote" aria-labelledby="said-title"><div class="wrap">'
                             f'<h2 class="sr-only" id="said-title">What clients say</h2><ul class="quote__list">{q}</ul></div></section>')
    else:
        p['testimonials'] = ''
    return p

def changed(page):
    """The day a page last changed: its own file, the shared layout or site.json, from git (today for changes not yet committed)."""
    days = []
    for f in (page, SRC / 'layout.html', SRC / 'site.json'):
        try:
            dirty = subprocess.run(['git', 'status', '--porcelain', '--', str(f)], cwd=ROOT, capture_output=True, text=True).stdout.strip()
            day = datetime.date.today().isoformat() if dirty else subprocess.run(['git', 'log', '-1', '--format=%cs', '--', str(f)], cwd=ROOT, capture_output=True, text=True).stdout.strip()
        except OSError:
            day = ''
        days.append(day or datetime.date.today().isoformat())
    return max(days)

def render(text, vals):
    for _ in range(3):                                                    # partials may hold values and conditions of their own
        text = re.sub(r'\{\{>\s*([\w-]+)\s*\}\}', lambda m: (SRC / 'partials' / (m.group(1) + '.html')).read_text(encoding='utf-8').rstrip('\n'), text)
        text = re.sub(r'\{\{#if ([\w-]+)\}\}(.*?)\{\{/if\}\}', lambda m: m.group(2) if vals.get(m.group(1)) else '', text, flags=re.S)
    return re.sub(r'\{\{([\w-]+)\}\}', lambda m: str(vals[m.group(1)]) if m.group(1) in vals else m.group(0), text)

def build():
    layout = (SRC / 'layout.html').read_text(encoding='utf-8')
    css_js = (OUT / 'assets/site.css').read_bytes() + (OUT / 'assets/site.js').read_bytes()
    version = hashlib.sha1(css_js).hexdigest()[:8]
    shared = parts()
    pages = []
    for f in sorted((SRC / 'pages').glob('*.html')):
        raw = f.read_text(encoding='utf-8')
        m = re.match(r'\s*<!--meta\s*(\{.*?\})\s*-->\s*', raw, re.S)
        meta = json.loads(m.group(1)); body = raw[m.end():].rstrip() + '\n'
        path = meta['path']
        html = layout
        if 'noindex' in meta.get('robots', ''):
            html = html.replace('<link rel="canonical" href="{{canonical}}">\n', '')    # a page kept out of search points nowhere
        nav = meta.get('nav', '')
        vals = {**shared, **{k: v for k, v in meta.items() if isinstance(v, str)}}
        vals.update({
            'title': e(meta['title']), 'og_title': e(meta.get('og_title', meta['title'])), 'description': e(meta['description']),
            'canonical': e(SITE + (path if path != '/404.html' else '/')), 'robots': e(meta.get('robots', 'index, follow')),
            'version': version, 'jsonld': jsonld(meta.get('jsonld', 'none'), meta),
        })
        for key in ('services', 'websites', 'about', 'contact'):
            vals['cur_' + key] = ' aria-current="page"' if nav == key else ''
        vals['body'] = render(body.rstrip('\n'), vals)
        html = render(html, vals)
        top, rest = html.split('<body>', 1)                                # "check-up" never breaks at its hyphen, anywhere on the page
        rest = re.sub(r'<span class="nb">(check-up[.,]?)</span>', r'\1', rest)
        out, prev = [], ''
        for seg in re.split(r'(<[^>]+>)', rest):
            if seg.startswith('<'):
                prev = seg
            elif 'check-up' in seg:
                seg = re.sub(r'check-up[.,]?', lambda m: f'<span class="nb">{m.group(0)}</span>', seg)
                if re.match(r'<(a|button|summary)\b', prev):                     # a link or button may lay its text out as one piece, so keep it one piece
                    seg = f'<span>{seg}</span>'
            out.append(seg)
        rest = ''.join(out)
        html = top + '<body>' + rest
        assert '{{' not in html, f'unfilled placeholder in {f.name}: ' + re.search(r'\{\{.{0,40}', html).group(0)
        dest = OUT / ('index.html' if path == '/' else path.strip('/') if path.endswith('.html') else path.strip('/') + '/index.html')
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(html, encoding='utf-8')
        if meta.get('sitemap', True):
            pages.append((path, changed(f)))
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for p, day in sorted(pages, key=lambda x: (x[0] != '/', x[0])):
        sm.append(f'  <url><loc>{SITE}{p}</loc><lastmod>{day}</lastmod></url>')
    sm.append('</urlset>')
    (OUT / 'sitemap.xml').write_text('\n'.join(sm) + '\n', encoding='utf-8')
    print('built', len(pages) + 1, 'pages, assets version', version)

if __name__ == '__main__':
    build()

// MediaJack Systems: a tiny static web server for the files in ./public (no packages needed, Node 18+).
// Replit runs it as the published site: `node server.mjs`, listening on $PORT.
// It serves pretty URLs (/services/ -> public/services/index.html), sends the old site's addresses to their new
// homes with a permanent redirect, compresses text, sets security and caching headers, and passes messages from
// the form to Jack's inbox through Resend when RESEND_API_KEY is set.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');
const PORT = Number(process.env.PORT) || 5000;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.webp': 'image/webp', '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json',
};
const TEXT = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt', '.svg', '.webmanifest']);

// the oil and gas site's pages, retired in October 2026
const REDIRECTS = {
  '/services': '/services/', '/about': '/about/', '/contact': '/contact/', '/privacy': '/privacy/', '/accessibility': '/accessibility/',
  '/ease': '/', '/discretion': '/', '/exemption-check': '/', '/login': '/', '/faq': '/#faq-title',
  '/check-up': '/check-up/', '/checkup': '/check-up/', '/websites': '/websites/', '/website': '/websites/', '/prices': '/services/#prices', '/pricing': '/services/#prices',
  '/privacy-policy': '/privacy/', '/terms-of-use': '/privacy/', '/terms': '/privacy/',
};

const HEADERS = {
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
  'X-Frame-Options': 'DENY',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

// ---- the message form. It is on only when RESEND_API_KEY is set (a Replit Secret; nothing is ever written to disk)
// and Resend can send from the "from" address's domain. The page asks GET /api/check-up first:
// 204 means "show the form", 404 means "keep the email button".
const MAIL = {
  key: process.env.RESEND_API_KEY || '',
  url: process.env.RESEND_API_URL || 'https://api.resend.com/emails',
  to: process.env.CONTACT_TO_EMAIL || 'jack@mediajacksystems.com',
  from: process.env.CONTACT_FROM_EMAIL || 'MediaJack website <website@mediajacksystems.com>',
};
const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
const FAIL = 'That did not send. Call (970) 401-0185 or email jack@mediajacksystems.com instead.';
const hits = new Map();                                             // address -> times of recent sends
function allowed(ip) {
  const now = Date.now(), recent = (hits.get(ip) || []).filter((t) => now - t < 3600e3);
  if (recent.length >= 5) { hits.set(ip, recent); return false; }
  recent.push(now); hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return true;
}
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim().slice(0, max);
const oneLine = (v, max) => clean(v, max).replace(/[\r\n]+/g, ' ');
function reply(res, status, body) { res.writeHead(status, { ...HEADERS, ...JSON_HEADERS }); res.end(JSON.stringify(body)); }

// Is the sending domain verified? Asked at start, then every 10 minutes until it is. A send-only key can't ask,
// so then the form shows, and a refused send hides it again until the next check.
const FROM_DOMAIN = ((MAIL.from.match(/@([^\s>]+)/) || [])[1] || '').toLowerCase();
let mailReady = false;
async function checkMail() {
  try {
    const r = await fetch(new URL('/domains', MAIL.url), { headers: { Authorization: `Bearer ${MAIL.key}` }, signal: AbortSignal.timeout(10000) });
    const body = await r.json().catch(() => ({}));
    if (r.ok) {
      const d = (Array.isArray(body.data) ? body.data : []).find((x) => String(x.name || '').toLowerCase() === FROM_DOMAIN);
      mailReady = Boolean(d) && d.status === 'verified';
      console.log(mailReady ? `form: on, ${FROM_DOMAIN} is verified` : `form: off until ${FROM_DOMAIN} is verified in Resend (now: ${d ? d.status : 'not added'})`);
    } else if (body.name === 'restricted_api_key') {
      mailReady = true; console.log('form: on (a send-only key cannot check the domain)');
    } else { mailReady = false; console.error(`form: off, the mail service answered ${r.status} to the domain check`); }
  } catch (err) { console.error(`form: could not check the mail service (${err.name})`); }
}
if (MAIL.key) { checkMail(); setInterval(() => { if (!mailReady) checkMail(); }, 600e3).unref(); }

function formApi(req, res) {
  if (req.method === 'GET' || req.method === 'HEAD') { res.writeHead(MAIL.key && mailReady ? 204 : 404, { ...HEADERS, 'Cache-Control': 'no-store' }); return res.end(); }
  if (req.method !== 'POST') { res.writeHead(405, { Allow: 'GET, HEAD, POST', ...HEADERS }); return res.end(); }
  if (!MAIL.key || !mailReady) return reply(res, 503, { ok: false, error: FAIL });
  if (!/^application\/json\b/i.test(String(req.headers['content-type'] || ''))) return reply(res, 415, { ok: false, error: FAIL });
  const origin = req.headers.origin;                                // a form on another site cannot post here
  if (origin) { try { if (new URL(origin).host !== req.headers.host) return reply(res, 403, { ok: false, error: FAIL }); } catch { return reply(res, 403, { ok: false, error: FAIL }); } }
  let size = 0; const chunks = [];
  req.on('data', (c) => { size += c.length; if (size > 20000) { reply(res, 413, { ok: false, error: 'That message is too long. Shorten it, or email jack@mediajacksystems.com.' }); req.destroy(); } else chunks.push(c); });
  req.on('error', () => {});
  req.on('end', async () => {
    if (res.writableEnded) return;
    let d;
    try { d = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return reply(res, 400, { ok: false, error: FAIL }); }
    if (!d || typeof d !== 'object' || Array.isArray(d)) return reply(res, 400, { ok: false, error: FAIL });
    const name = oneLine(d.name, 100), email = oneLine(d.email, 200);
    if (name.length < 2) return reply(res, 422, { ok: false, error: 'Enter your name.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply(res, 422, { ok: false, error: 'Enter an email address I can reply to, like name@example.com.' });
    // a filled trap field or a form sent within two seconds is a robot: say "sent" and send nothing
    if (clean(d.company_url, 10) || !(Number(d.elapsed) > 2000)) return reply(res, 200, { ok: true });
    const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
    if (!allowed(ip)) return reply(res, 429, { ok: false, error: 'That is a lot of messages in one hour. Call (970) 401-0185 instead.' });
    const text = [
      `Name: ${name}`, `Email: ${email}`, `Phone: ${oneLine(d.phone, 40) || '(none given)'}`,
      `Business and website: ${oneLine(d.business, 200) || '(none given)'}`, `Heard about MediaJack from: ${oneLine(d.source, 200) || '(not said)'}`,
      `Sent from: ${oneLine(d.topic, 80) || 'the website'}`, '', clean(d.message, 3000) || '(no message)',
    ].join('\n');
    try {
      const r = await fetch(MAIL.url, {
        method: 'POST', signal: AbortSignal.timeout(10000),
        headers: { Authorization: `Bearer ${MAIL.key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: MAIL.from, to: [MAIL.to], reply_to: email, subject: `Website: ${oneLine(d.topic, 80) || 'message'} from ${name}`, text }),
      });
      if (!r.ok) {
        console.error(`form: the mail service answered ${r.status}`);
        if (r.status === 401 || r.status === 403) mailReady = false;   // key or domain refused: back to the email button until the next check
        return reply(res, 502, { ok: false, error: FAIL });
      }
      console.log('form: message delivered to the mail service');
      return reply(res, 200, { ok: true });
    } catch (err) { console.error(`form: could not reach the mail service (${err.name})`); return reply(res, 502, { ok: false, error: FAIL }); }
  });
}

// files are small: read each once, keep it and its compressed forms in memory
const cache = new Map();
function load(file) {
  const st = fs.statSync(file);
  const hit = cache.get(file);
  if (hit && hit.mtime === st.mtimeMs) return hit;
  const body = fs.readFileSync(file);
  const ext = path.extname(file).toLowerCase();
  const entry = { mtime: st.mtimeMs, body, ext, etag: `"${st.size.toString(16)}-${Math.floor(st.mtimeMs).toString(16)}"` };
  if (TEXT.has(ext) && body.length > 512) {
    entry.br = zlib.brotliCompressSync(body, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 10 } });
    entry.gz = zlib.gzipSync(body, { level: 9 });
  }
  cache.set(file, entry);
  return entry;
}

function resolve(urlPath) {
  let p;
  try { p = decodeURIComponent(urlPath); } catch { return null; }
  if (/[\u0000-\u001f\u007f]/.test(p)) return null;                 // control characters never name a file (and must never reach a header)
  const full = path.normalize(path.join(ROOT, p));
  if (full !== ROOT && !full.startsWith(ROOT + path.sep)) return null;
  try {
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (!p.endsWith('/')) return { redirect: true };
      const idx = path.join(full, 'index.html');
      return fs.existsSync(idx) ? { file: idx } : null;
    }
    return { file: full };
  } catch { return null; }
}

function send(req, res, status, file, extra = {}, versioned = false) {
  const f = load(file);
  const headers = { ...HEADERS, 'Content-Type': TYPES[f.ext] || 'application/octet-stream', ETag: f.etag, Vary: 'Accept-Encoding', ...extra };
  // a file asked for with its version (?v=) never changes at that address; the font never changes at all
  headers['Cache-Control'] = f.ext === '.html' ? 'no-cache' : (f.ext === '.woff2' || versioned) ? 'public, max-age=31536000, immutable' : 'public, max-age=86400';
  if (status === 200 && req.headers['if-none-match'] === f.etag) { res.writeHead(304, headers); return res.end(); }
  const ae = String(req.headers['accept-encoding'] || '');
  let body = f.body;
  if (f.br && /\bbr\b/.test(ae)) { body = f.br; headers['Content-Encoding'] = 'br'; }
  else if (f.gz && /\bgzip\b/.test(ae)) { body = f.gz; headers['Content-Encoding'] = 'gzip'; }
  headers['Content-Length'] = body.length;
  res.writeHead(status, headers);
  res.end(req.method === 'HEAD' ? undefined : body);
}

function handle(req, res) {
  let url;
  try { url = new URL(req.url, 'http://localhost'); } catch { res.writeHead(400, HEADERS); return res.end(); }
  const pth = url.pathname;
  if (pth === '/api/check-up') return formApi(req, res);
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, { Allow: 'GET, HEAD', ...HEADERS }); return res.end(); }
  if (pth === '/healthz') { res.writeHead(200, { 'Content-Type': 'text/plain', ...HEADERS }); return res.end('ok'); }
  const to = REDIRECTS[pth.replace(/\/+$/, '') || '/'];
  if (to && to !== pth) { res.writeHead(301, { Location: to + (url.search || ''), ...HEADERS }); return res.end(); }
  const r = resolve(pth);
  // the folder's address with its slash, built from the still-encoded path, one leading slash (never a //host)
  if (r?.redirect) { res.writeHead(301, { Location: '/' + pth.replace(/^\/+/, '') + '/' + (url.search || ''), ...HEADERS }); return res.end(); }
  if (r?.file) {
    try { return send(req, res, 200, r.file, {}, url.searchParams.has('v')); } catch { /* fall through to the 404 page */ }
  }
  try { send(req, res, 404, path.join(ROOT, '404.html')); }
  catch { res.writeHead(404, { 'Content-Type': 'text/plain', ...HEADERS }); res.end('Not found'); }
}

// one bad request can never take the site down
const server = http.createServer((req, res) => {
  try { handle(req, res); }
  catch {
    try { if (!res.headersSent) res.writeHead(400, { 'Content-Type': 'text/plain', ...HEADERS }); res.end('Bad request'); } catch { try { res.destroy(); } catch {} }
  }
});

server.listen(PORT, '0.0.0.0', () => console.log(`MediaJack Systems site on port ${PORT}, serving ${ROOT}`));

// MediaJack Systems: a tiny static web server for the files in ./public (no packages needed, Node 18+).
// Replit runs it as the published site: `node server.mjs`, listening on $PORT.
// It serves pretty URLs (/services/ -> public/services/index.html), sends the old site's addresses to their new
// homes with a permanent redirect, compresses text, and sets security and caching headers.
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
  '/privacy-policy': '/privacy/', '/terms-of-use': '/privacy/', '/terms': '/privacy/',
};

const HEADERS = {
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
  'X-Frame-Options': 'DENY',
};

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
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, { Allow: 'GET, HEAD', ...HEADERS }); return res.end(); }
  let url;
  try { url = new URL(req.url, 'http://localhost'); } catch { res.writeHead(400, HEADERS); return res.end(); }
  const pth = url.pathname;
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

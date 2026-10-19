/**
 * marksloboda.com — static file server. No dependencies.
 *
 * Serves ./public. Railway sets PORT; locally it falls back to 3000.
 * Unknown paths fall back to index.html so a single-page site can add
 * client-side routes later without touching this file.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, 'public');

const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8',
    '.woff2': 'font/woff2',
};

http.createServer(function (req, res) {
    // Redirect the bare host to www so there is one canonical URL.
    const host = req.headers.host || '';
    if (host === 'marksloboda.com') {
        res.writeHead(301, { Location: 'https://www.marksloboda.com' + req.url });
        return res.end();
    }

    let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    if (urlPath.endsWith('/')) urlPath += 'index.html';

    let file = path.normalize(path.join(ROOT, urlPath));
    if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }

    fs.stat(file, function (err, stat) {
        if (err || !stat.isFile()) file = path.join(ROOT, 'index.html');
        const ext = path.extname(file).toLowerCase();
        res.writeHead(200, {
            'Content-Type': TYPES[ext] || 'application/octet-stream',
            'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400',
        });
        fs.createReadStream(file).pipe(res);
    });
}).listen(PORT, function () {
    console.log('marksloboda.com listening on ' + PORT);
});

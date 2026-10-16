/**
 * A tiny static file server, used by `npm run serve` and by the sync.
 * `mounts` maps URL prefixes to folders; the first prefix that matches wins.
 * No dependencies.
 */
import http from 'node:http';
import {createReadStream, promises as fs} from 'node:fs';
import path from 'node:path';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.otf': 'font/otf', '.ttf': 'font/ttf',
  '.mp4': 'video/mp4', '.webm': 'video/webm',
};

export function serve(mounts, port = 0) {
  const roots = mounts.map(([prefix, dir]) => [prefix, path.resolve(dir)]);
  const server = http.createServer(async (req, res) => {
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const mount = roots.find(([prefix]) => pathname.startsWith(prefix));
    if (mount) {
      const [prefix, dir] = mount;
      const file = path.join(dir, pathname.slice(prefix.length));
      if (file.startsWith(dir + path.sep)) {
        try {
          if ((await fs.stat(file)).isFile()) {
            res.writeHead(200, {'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store'});
            createReadStream(file).pipe(res);
            return;
          }
        } catch {}
      }
    }
    res.writeHead(404, {'content-type': 'text/plain; charset=utf-8'});
    res.end('Not found');
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => resolve({server, url: `http://127.0.0.1:${server.address().port}`}));
  });
}

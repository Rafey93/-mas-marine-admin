/* eslint-disable @typescript-eslint/no-require-imports */
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

const { createServer } = require('http');
const next = require('next');

const port = Number(process.env.PORT || 3000);
const hostname = process.env.HOST || '127.0.0.1';
const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    if (req.url === '/__health') {
      res.writeHead(200, { 'content-type': 'text/plain' });
      res.end('Andros Marine Institute server.js is running');
      return;
    }

    handle(req, res);
  }).listen(port, hostname, () => {
    console.log(`Andros Marine Institute Admin ready on http://${hostname}:${port}`);
  });
});

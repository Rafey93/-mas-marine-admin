/* eslint-disable @typescript-eslint/no-require-imports */
const { createServer } = require('http');

const port = Number(process.env.PORT || 3000);
const hostname = process.env.HOSTNAME || '0.0.0.0';

createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain' });
  res.end(`Andros Marine Institute startup probe is running\nurl=${req.url}\n`);
}).listen(port, hostname, () => {
  console.log(`Andros Marine Institute startup probe ready on http://${hostname}:${port}`);
});

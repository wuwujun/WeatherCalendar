const url = require('url');
const http = require('http');

const router = require('./router');
const logger = require('./logger');

const onError = (err) => {
  if (err) {
    logger.error('router error:', err);
  }
};

const main = (req, res) => {
  const info = url.parse(req.url);
  logger.info('request', info.pathname);
  return router(req, res, { logger }, onError);
};

const server = http.createServer(main);
server.setTimeout(10000, socket => socket.destroy());

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('uncaughtException', () => server.close(() => process.exit(1)));
process.on('unhandledRejection', () => server.close(() => process.exit(1)));

module.exports = server;

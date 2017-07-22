/* eslint global-require: "off" */
/* eslint import/no-extraneous-dependencies: "off" */

const cluster = require('cluster');
// const socketIO = require('socket.io');

const config = require('../config');

// const serveIO = require('./io');
const port = require('./port');
const server = require('./server');

const logger = require('./logger');

// socket.io server
// const io = socketIO.listen(server);
// serveIO(io);

process.on('uncaughtException', err => logger.error('uncaughtException', err.stack));
process.on('unhandledRejection', (reason, p) => {
  logger.error('unhandledRejection', `Unhandled Rejection at: ${p}`);
  logger.error('unhandledRejection', `reason: ${reason}`);
});

if (config.isDev) {
  if (cluster.isWorker) {
    throw new Error('cluster.isWorker');
  }

  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');

  const webpackConfig = require('../webpack.config');

  const compiler = webpack(webpackConfig);
  const devServer = new WebpackDevServer(compiler, {
    // hot: true,
    disableHostCheck: true,
    contentBase: config.outputdir,
    // publicPath: config.publicpath,
    stats: {
      colors: { level: 1, hasBasic: true, has256: false, has16m: false },
      assets: true,
      chunks: false,
      cached: false,
      modules: false,
      reasons: false,
      publicPath: true,
      errorDetails: true,
      cachedAssets: false,
      chunkOrigins: false,
    },
    proxy: {
      '**': `http://localhost:${port + 1}`,
      // '/socket.io': {
      //   target: `ws://localhost:${port + 1}`,
      //   ws: true,
      // },
    },
  });

  devServer.middleware.waitUntilValid(() => {
    server.listen(port + 1, '0.0.0.0', () => {
      logger.info('server/index', `server is listen at ${JSON.stringify(server.address())}`);
    });
  });

  devServer.listen(port, '0.0.0.0', () => {
    logger.info('server/index', 'webpack dev server running');
  });
} else {
  server.listen(port, '0.0.0.0', () => {
    logger.info('server/index', `server is listen at ${JSON.stringify(server.address())}`);
  });

  const pingme = require('pingme');

  pingme({
    server,
    ping: cb => cb(),
    status: cb => cb(),
  });
}

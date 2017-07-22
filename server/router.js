const st = require('st');
const httpHashRouter = require('http-hash-router');

const config = require('../config');

const router = httpHashRouter();

const stOpts = {
  url: '/',
  path: config.outputdir,
};

if (config.isDev) {
  stOpts.cache = false;
}

const staticResource = st(stOpts);
router.set('/*', (req, res) => {
  staticResource(req, res);
});

module.exports = router;

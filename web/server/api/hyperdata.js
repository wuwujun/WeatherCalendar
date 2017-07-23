/* eslint no-param-reassign: "off" */

const url = require('url');

const xtend = require('xtend');
const hyperquest = require('hyperquest');

const hosts = require('./hosts');

const seperator = '/-/';

const hyperdata = (req, res, opts, cb) => {
  const method = req.method;
  let uri = opts.url || req.url;

  // /rootdir/api/name/-/path/to/resource
  // ${rootdir}api/${apiName}${seperator}${apiUri}
  const pos = uri.indexOf(seperator);
  const splats = uri.slice(0, pos).split('/');
  const name = splats[splats.length - 1];

  let host = hosts[name];
  if (typeof host === 'function') {
    host = host(req);
  }

  let headers = {};
  const sliced = uri.slice(pos + seperator.length - 1);
  const parsed = url.parse(sliced, true);
  uri = `${host}${sliced}`;

  if (req.headers['content-type']) {
    headers = xtend(headers, { 'Content-Type': req.headers['content-type'] });
  }
  if (typeof opts.customHeaders === 'function') {
    headers = xtend(headers, opts.customHeaders({ path: parsed.pathname, method }));
  }

  opts.logger.info('api request', `${method} ${uri}\n${JSON.stringify(headers)}`);

  const s = hyperquest(uri, { method, headers });
  s.on('error', cb);
  res.once('finish', cb);
  s.on('response', (response) => {
    res.statusCode = response.statusCode;
    Object.keys(response.headers)
      .forEach(header => res.setHeader(header, response.headers[header]));
  });

  if (s.writable) {
    req.pipe(s);
  }
  s.pipe(res);
};

module.exports = hyperdata;

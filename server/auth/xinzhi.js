const crypto = require('crypto');
const url = require('url');
const qs = require('querystring');

const uid = process.env.XINZHI_API_UID;
const secret = process.env.XINZHI_API_SECRET;

module.exports = router => (req, res, opts = {}, cb) => {
  const uri = url.parse(req.url, true);
  const query = uri.query;
  query.ts = Math.floor((new Date()).getTime() / 1000);
  query.ttl = 1;
  query.uid = uid;
  const str = Object.keys(query).sort().map((k) => {
    if (k === 'language') return '';
    else if (k === 'location') return '';
    return qs.stringify({ [k]: query[k] });
  }).filter(Boolean)
  .join('&');

  query.sig = crypto.createHmac('sha1', secret)
    .update(str)
    .digest('base64');

  uri.query = query;

  return router(req, res, Object.assign({}, opts, {
    url: `${uri.pathname}?${qs.stringify(query)}`,
  }), cb);
};

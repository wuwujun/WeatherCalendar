const gt = key => key.concat('_TS');
const gi = key => key.concat('_TAG');

const load = (key) => {
  const tsKey = gt(key);
  const tagKey = gi(key);
  const now = (new Date()).getTime();
  const ts = +localStorage.getItem(tsKey) || 0;
  const rawValue = localStorage.getItem(tagKey);
  const value = (rawValue === 'undefined') ? null : JSON.parse(rawValue || 'null');

  if (now > ts) return null;
  return value;
};

const store = (key, value, expire = 1) => {
  const tsKey = gt(key);
  const tagKey = gi(key);

  const future = (new Date()).getTime() + expire * 3600000;

  localStorage.setItem(tsKey, future.toString(10));
  localStorage.setItem(tagKey, JSON.stringify(value));
};

const remove = (key, force = true) => {
  const tsKey = gt(key);
  const tagKey = gi(key);

  const now = (new Date()).getTime();
  const ts = +localStorage.getItem(tsKey) || 0;

  if (force || now > ts) {
    localStorage.removeItem(tsKey);
    localStorage.removeItem(tagKey);
  }
};

module.exports = {
  load,
  store,
  remove,
};

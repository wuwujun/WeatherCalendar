const path = require('path');

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'develop';

const outputdir = path.resolve(__dirname, isDev ? '_dist' : 'dist');
const rootdir = '/';

module.exports = {
  isDev,
  rootdir,
  outputdir,
};

if (require.main === module) {
  console.info(module.exports); // eslint-disable-line
}

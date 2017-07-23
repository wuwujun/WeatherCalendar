const prefix = 'https://ssl.gstatic.com/onebox/weather/64/';

const map = {
  0: 'sunny',
  1: 'sunny',
  2: 'sunny_s_cloudy',
  3: 'sunny_t_cloudy',
  4: 'cloudy_s_sunny',
  5: 'partly_cloudy',
  6: 'partly_cloudy',
  7: 'cloudy',
  8: 'cloudy',
  9: 'cloudy',
  10: 'cloudy_s_rain',
  11: 'thunderstorms',
  12: 'thunderstorms',
  13: 'rain_s_cloudy',
  14: 'rain_light',
  15: 'rain',
  16: 'rain',
  17: 'thunderstorms',
  18: 'thunderstorms',
  19: 'sleet',
  20: 'sleet',
  21: 'snow',
  22: 'snow',
  23: 'snow',
  24: 'snow',
  25: 'snow',
  26: '',
  27: '',
  28: '',
  29: '',
  30: 'fog',
  31: 'mist',
  32: 'windy',
  33: 'windy',
  34: '',
  35: '',
  36: '',
  37: '',
  38: 'sunny',
  99: 'unknown',
};

module.exports = (type) => {
  const name = map[type] || 'unknown';
  return `${prefix}${name}.png`;
};

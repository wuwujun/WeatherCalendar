/* global AMap */

const spcodes = {
  北京: '110000',
  天津: '120000',
  上海: '310000',
  重庆: '500000',
  香港: '810000',
  澳门: '820000',
  台湾: '710000',
};

const AMAP_CITIES_DATA_KEY = 'AMAP_CITIES_DATA';
const AMAP_CITIES_DATA_CNT = 'AMAP_CITES_DATA_CNT';

const loadCities = (refresh = false) => new Promise((resolve, reject) => {
  // 1. check localstore
  const cnt = +localStorage[AMAP_CITIES_DATA_CNT] || 0;

  if (!refresh && cnt > 0) {
    const allCities = JSON.parse(localStorage[AMAP_CITIES_DATA_KEY] || 'null');

    if (allCities) {
      localStorage.setItem(AMAP_CITIES_DATA_CNT, (cnt - 1).toString(10));
      resolve(allCities);
      return;
    }
  }

  // 2. fetch data from amap
  const districtSearch = new AMap.DistrictSearch({
    level: 'country',
    subdistrict: 2,
    extensions: false,
  });

  districtSearch.search('中国', (status, result) => {
    if (status !== 'complete' || result.info !== 'OK') {
      reject();
      return;
    }

    const list = result.districtList[0].districtList;

    if (!list || !list.length) {
      reject();
      return;
    }

    const data = list.reduce((res, prov) => {
      if (prov.adcode === spcodes.澳门
        || prov.adcode === spcodes.香港
        || prov.adcode === spcodes.台湾
      ) return res;

      res[prov.adcode] = {
        name: prov.name,
        adcode: prov.adcode,
        coord: [prov.center.getLat().toFixed(2), prov.center.getLng().toFixed(2)].join(':'),
        level: prov.level,
        sub: (prov.districtList || []).map((city) => {
          res[city.adcode] = {
            name: city.name,
            adcode: city.adcode,
            coord: [city.center.getLat().toFixed(2), city.center.getLng().toFixed(2)].join(':'),
            level: city.level,
            parent: prov.adcode,
          };
          return city.adcode;
        }),
      };

      return res;
    }, {});

    // 3. store data
    localStorage.setItem(AMAP_CITIES_DATA_CNT, '1000');
    localStorage.setItem(AMAP_CITIES_DATA_KEY, JSON.stringify(data));

    resolve(data);
  });
});

module.exports = {
  spcodes,
  loadCities,
};

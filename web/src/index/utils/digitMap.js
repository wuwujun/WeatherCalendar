const chineseMap = {
  0: '〇',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '七',
  8: '八',
  9: '九',
  10: '十',
  11: '十一',
  12: '十二',
};

const weekdayMap = {
  0: '天',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '日',
};

module.exports = (digit, type = 'number') => {
  switch (type) {
    case 'week':
      return weekdayMap[digit];
    case 'number':
    default:
      return chineseMap[digit];
  }
};

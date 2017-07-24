const shareText = (text) => {
  try {
    window.bridge.shareText(text);
  } catch (ex) {
    return false;
  }
  return true;
};

const addEvent = (ts, text) => {
  try {
    window.bridge.addEvent(ts, text);
  } catch (ex) {
    return false;
  }
  return true;
};

module.exports = {
  shareText,
  addEvent,
};

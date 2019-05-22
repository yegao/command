const { noop } = require('./util')

const navigator = {
  platform: qg.getOS(),
  language: qg.getCurrentLanguage(),
  appVersion: '5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
  userAgent: qg.getUserAgent(),
  onLine: true,

  geolocation: {
    getCurrentPosition: noop,
    watchPosition: noop,
    clearWatch: noop
  },

  maxTouchPoints: 10 
}

qg.subscribeNetworkStatus({
  callback: function (data) {
    navigator.onLine = data.type !== 'none'
  }
})

module.exports = navigator;

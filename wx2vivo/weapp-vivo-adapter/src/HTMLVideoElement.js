const HTMLMediaElement = require('./HTMLMediaElement');

class HTMLVideoElement extends HTMLMediaElement {
  constructor() {
    super('video')
  }

  canPlayType(type) {
    return false
  }
}

module.exports = HTMLVideoElement;

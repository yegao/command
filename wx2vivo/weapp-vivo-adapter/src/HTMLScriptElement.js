const HTMLElement = require('./HTMLElement');
const Event = require('./Event');

class HTMLScriptElement extends HTMLElement {
    constructor(width, height) {
        super('script')
    }

    set src(url) {
        
    }
}

module.exports = HTMLScriptElement;

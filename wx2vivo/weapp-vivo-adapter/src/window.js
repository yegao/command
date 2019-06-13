const { btoa, atob } = require('./base64/base64.min');
window.btoa = btoa;
window.atob = atob;
const { Blob, URL } = require('./Blob');
window.Blob = Blob;
window.URL = URL;
window.DOMParser = require('./xmldom/dom-parser').DOMParser;

window.CanvasRenderingContext2D = qg.getCanvasRenderingContext2D()
window.top = window.parent = window

window.ontouchstart = null;
window.ontouchmove = null;
window.ontouchend = null;
window.ontouchcancel = null;

window.pageXOffset = window.pageYOffset = window.clientTop = window.clientLeft = 0;
window.outerWidth = window.innerWidth;
window.outerHeight = window.innerHeight;

// 第一次调用createCanvas创建的是主屏canvas，以后再创建的是离屏canvas
window.mainCanvas = qg.createCanvas();
window.HTMLCanvasElement = require('./HTMLCanvasElement');
window.location = require('./location');
window.document = require('./document');
window.Element = require('./Element');
window.HTMLElement = require('./HTMLElement');
window.HTMLImageElement = require('./HTMLImageElement');
window.HTMLMediaElement = require('./HTMLMediaElement');
window.HTMLAudioElement = require('./HTMLAudioElement');
window.HTMLVideoElement = require('./HTMLVideoElement');
window.HTMLScriptElement = require('./HTMLScriptElement');
window.navigator = require('./navigator');
window.Image = require('./Image');
window.Audio = require('./Audio');
window.FileReader = require('./FileReader');
window.FontFace = require('./FontFace');
window.FontFaceSet = require('./FontFaceSet');
window.EventTarget = require('./EventTarget');
window.Event = require('./Event');
window.TouchEvent = require('./TouchEvent');
window.MouseEvent = require('./MouseEvent');
window.KeyboardEvent = require('./KeyboardEvent');
window.DeviceMotionEvent = require('./DeviceMotionEvent');
window.canvas = require('./Canvas').canvas
window.renderTexCanvas = require('./Canvas').renderTexCanvas
const ROTATION_0 = 0;
const ROTATION_90 = 1;
const ROTATION_180 = 2;
const ROTATION_270 = 3;
var orientation = 0;
var rotation = qg.getDeviceRotation();
switch (rotation) {
    case ROTATION_90:
        orientation = 90;
        break;
    case ROTATION_180:
        orientation = 180;
        break;
    case ROTATION_270:
        orientation = -90;
        break;
    default:
        break;
}

window.orientation = orientation;
window.devicePixelRatio = 1.0;
window.screen = {
    availTop: 0,
    availLeft: 0,
    availHeight: window.innerWidth,
    availWidth: window.innerHeight,
    colorDepth: 8,
    pixelDepth: 8,
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    orientation: { //FIXME:cjh
        type: 'portrait-primary' // portrait-primary, portrait-secondary, landscape-primary, landscape-secondary
    },
    onorientationchange: function (event) { }
};

window.addEventListener = function (eventName, listener, options) {
    window.mainCanvas.addEventListener(eventName, listener, options);
};

window.removeEventListener = function (eventName, listener, options) {
    window.mainCanvas.removeEventListener(eventName, listener, options);
};

window.dispatchEvent = function (event) {
    window.mainCanvas.dispatchEvent(event);
};

window.getComputedStyle = function (element) {
    return {
        position: 'absolute',
        left: '0px',
        top: '0px',
        height: '0px'
    };
};

window.focus = function () { };
window.scroll = function () { };
window.resize = function (width, height) {
    window.innerWidth = width;
    window.innerHeight = height;
    window.outerWidth = window.innerWidth;
    window.outerHeight = window.innerHeight;
    window.mainCanvas._width = window.innerWidth;
    window.mainCanvas._height = window.innerHeight;
    window.screen.availWidth = window.innerWidth;
    window.screen.availHeight = window.innerHeight;
    window.screen.width = window.innerWidth;
    window.screen.height = window.innerHeight;
};
window.localStorage = require('./localstorage');
window.alert = console.error.bind(console);
window.close = qg.getClose ? qg.getClose : function () { };

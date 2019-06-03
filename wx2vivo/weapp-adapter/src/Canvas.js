const HTMLElement =require('./HTMLElement')
// import document from './document'
const { initTexCanvas,setTextureCanvas,renderTexCanvas } = require('./vivo/texture') 
// let hasModifiedCanvasPrototype = false
// let hasInit2DContextConstructor = false
// let hasInitWebGLContextConstructor = false
/** vivo begin */
var oldDrawImage = null
/** vivo end */
module.exports = function Canvas() {
  const canvas = qg.createCanvas()
  canvas.type = 'canvas'

  canvas.__proto__.__proto__ = new HTMLElement('canvas')

  const ctx = canvas.getContext('2d')
  /** vivo begin */
  const oldGetContext = canvas.getContext;
  canvas.getContext = function(arg){
    if(arg === '2d') {
      return ctx
    }
    else{
      return oldGetContext(arg)
    }
  }

  if(!oldDrawImage){
    if(oldDrawImage = ctx.drawImage){
      ctx.constructor.prototype.drawImage = function(...args){
        oldDrawImage.call(ctx,...args)
        setTextureCanvas(canvas);
        // renderTexCanvas();
      }
    }
  }
  /** vivo end */

  canvas.getBoundingClientRect = () => {
    const ret = {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight
    }
    return ret
  }
  initTexCanvas(canvas)
  return canvas
}

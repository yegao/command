import { HTMLCanvasElement, CanvasRenderingContext2D, WebGLRenderingContext } from './constructor'
import HTMLElement from './HTMLElement'
// import document from './document'
import { setTextureCanvas,renderTexCanvas } from './vivo/texture'

// let hasModifiedCanvasPrototype = false
// let hasInit2DContextConstructor = false
// let hasInitWebGLContextConstructor = false
/** vivo begin */
const wx = qg
var oldDrawImage = null
/** vivo begin */
export default function Canvas() {
  // const canvas1 = wx.createCanvas()
  const canvas = wx.createCanvas()
  // console.log("==================")
  // console.log(canvas1 === canvas)
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

  return canvas
}

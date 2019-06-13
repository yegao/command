import * as window from '../window'
import document from '../document'
import { noop } from '../util/'
class TouchEvent {
  target = window.canvas
  currentTarget = window.canvas
  touches = []
  targetTouches = []
  changedTouches = []
  preventDefault = noop
  stopPropagation = noop
  constructor(type) {
    this.type = type
  }
}

function touchEventHandlerFactory(type) {
  return (event) => {
    const touchEvent = new TouchEvent(type)

    touchEvent.touches = event.touches
    touchEvent.targetTouches = Array.prototype.slice.call(event.touches)
    touchEvent.changedTouches = event.changedTouches
    touchEvent.timeStamp = event.timeStamp
    document.dispatchEvent(touchEvent)
  }
}

qg.onTouchStart(touchEventHandlerFactory('touchstart'))
qg.onTouchMove(touchEventHandlerFactory('touchmove'))
qg.onTouchEnd(touchEventHandlerFactory('touchend'))
qg.onTouchCancel(touchEventHandlerFactory('touchcancel'))

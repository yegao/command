import * as _window from './window'
Object.defineProperty( _window, 'addEventListener', {
  get(){
    return (type, listener) => {
      _window.document.addEventListener(type, listener)
    }
  }
})

Object.defineProperty( _window, 'removeEventListener', {
  get(){
    return (type, listener) => {
      _window.document.removeEventListener(type, listener)
    }
  }
})

if (_window.canvas) {
  Object.defineProperty(_window.canvas, 'addEventListener',{
    get(){
      return (type, listener) => {
        _window.document.addEventListener(type, listener)
      }
    }
  })
  Object.defineProperty(_window.canvas, 'removeEventListener',{
    get(){
      return (type, listener) => {
        _window.document.removeEventListener(type, listener)
      }
    }
  })
}

for (const key in _window) {
  global[key] = _window[key]
}
global.window = _window
window = global
window.wx = qg;
window.top = window.parent = window
  
import Canvas from './Canvas'
/** vivo begin */
import { initTexCanvas } from './vivo/texture'
/** vivo end */
export document from './document'
export navigator from './navigator'
export XMLHttpRequest from './XMLHttpRequest'
export WebSocket from './WebSocket'
export Image from './Image'
export HTMLImageElement from './HTMLImageElement'
export Audio from './Audio'
export FileReader from './FileReader'
export HTMLElement from './HTMLElement'
export localStorage from './localStorage'
export location from './location'
export * from './WindowProperties'
export * from './vivo/texture'
export * from './constructor'

// 暴露全局的 canvas
const canvas = new Canvas()
/** vivo begin */
initTexCanvas(canvas);
/** vivo end */
export { canvas }
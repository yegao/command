const EventTarget = require('./EventTarget');

class Node extends EventTarget {
  constructor() {
    super()
    this.childNodes = []
    this.parentNode = mainCanvas;
  }

  appendChild(node) {
    this.childNodes.push(node)
  }

  insertBefore(newNode, referenceNode) {
    return newNode;
  }

  replaceChild(newChild, oldChild) {
    return oldChild;
  }

  cloneNode() {
    const copyNode = Object.create(this)

    Object.assign(copyNode, this)
    return copyNode
  }

  removeChild(node) {
    const index = this.childNodes.findIndex((child) => child === node)

    if (index > -1) {
      return this.childNodes.splice(index, 1)
    }
    return null
  }

  contains(node) {
    return this.childNodes.indexOf(node) > -1;
  }
}

module.exports = Node;

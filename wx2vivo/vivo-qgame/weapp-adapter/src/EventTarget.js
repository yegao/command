/** 删除 begin */
// const _events = new WeakMap()

// class EventTarget {
//   constructor() {
//     _events.set(this, {})
//   }

//   addEventListener(type, listener, options = {}) {
//     let events = _events.get(this)

//     if (!events) {
//       events = {}
//       _events.set(this, events)
//     }
//     if (!events[type]) {
//       events[type] = []
//     }
//     events[type].push(listener)

//     if (options.capture) {
//       console.warn('EventTarget.addEventListener: options.capture is not implemented.')
//     }
//     if (options.once) {
//       console.warn('EventTarget.addEventListener: options.once is not implemented.')
//     }
//     if (options.passive) {
//       console.warn('EventTarget.addEventListener: options.passive is not implemented.')
//     }
//   }

//   removeEventListener(type, listener) {
//     const listeners = _events.get(this)[type]

//     if (listeners && listeners.length > 0) {
//       for (let i = listeners.length; i--; i > 0) {
//         if (listeners[i] === listener) {
//           listeners.splice(i, 1)
//           break
//         }
//       }
//     }
//   }

//   dispatchEvent(event = {}) {
//     const listeners = _events.get(this)[event.type]

//     if (listeners) {
//       for (let i = 0; i < listeners.length; i++) {
//         listeners[i](event)
//       }
//     }
//   }
// }

// export default EventTarget
/** 删除 end */
/** vivo begin */
var __targetID = 0;

var __listenerMap = {
    touch: {},
    mouse: {},
    keyboard: {},
    devicemotion: {}
};

var __listenerCountMap = {
    touch: 0,
    mouse: 0,
    keyboard: 0,
    devicemotion: 0
};

var __enableCallbackMap = {
    touch: null,
    mouse: null,
    keyboard: null,
    devicemotion: null
};

var __disableCallbackMap = {
    touch: null,
    mouse: null,
    keyboard: null,
    devicemotion: null
};

const __handleEventNames = {
    touch: ['touchstart', 'touchmove', 'touchend', 'touchcancel'],
    mouse: ['mousedown', 'mousemove', 'mouseup', 'mousewheel'],
    keyboard: ['keydown', 'keyup', 'keypress'],
    devicemotion: ['devicemotion']
}

// Listener types
const CAPTURE = 1
const BUBBLE = 2
const ATTRIBUTE = 3

/**
 * Check whether a given value is an object or not.
 * @param {any} x The value to check.
 * @returns {boolean} `true` if the value is an object.
 */
function isObject(x) {
    return x && typeof x === "object" //eslint-disable-line no-restricted-syntax
}

/**
 * EventTarget.
 * 
 * - This is constructor if no arguments.
 * - This is a function which returns a CustomEventTarget constructor if there are arguments.
 * 
 * For example:
 * 
 *     class A extends EventTarget {}
 */
class EventTarget {
    constructor() {
        this._targetID = ++__targetID;
        this._listenerCount = {
            touch: 0,
            mouse: 0,
            keyboard: 0,
            devicemotion: 0
        };
        this._listeners = new Map();
    }

    _associateSystemEventListener(eventName) {
        var handleEventNames;
        for (var key in __handleEventNames) {
            handleEventNames = __handleEventNames[key];
            if (handleEventNames.indexOf(eventName) > -1) {
                if (__enableCallbackMap[key] && __listenerCountMap[key] === 0) {
                    __enableCallbackMap[key]();
                }

                if (this._listenerCount[key] === 0)
                    __listenerMap[key][this._targetID] = this;
                ++this._listenerCount[key];
                ++__listenerCountMap[key];
                break;
            }
        }
    }

    _dissociateSystemEventListener(eventName) {
        var handleEventNames;
        for (var key in __handleEventNames) {
            handleEventNames = __handleEventNames[key];
            if (handleEventNames.indexOf(eventName) > -1) {
                if (this._listenerCount[key] <= 0)
                    delete __listenerMap[key][this._targetID];
                --__listenerCountMap[key];

                if (__disableCallbackMap[key] && __listenerCountMap[key] === 0) {
                    __disableCallbackMap[key]();
                }
                break;
            }
        }
    }

    /**
     * Add a given listener to this event target.
     * @param {string} eventName The event name to add.
     * @param {Function} listener The listener to add.
     * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
     * @returns {boolean} `true` if the listener was added actually.
     */
    addEventListener(eventName, listener, options) {
        if (!listener) {
            return false
        }
        if (typeof listener !== "function" && !isObject(listener)) {
            throw new TypeError("'listener' should be a function or an object.")
        }

        const listeners = this._listeners
        const optionsIsObj = isObject(options)
        const capture = optionsIsObj ? Boolean(options.capture) : Boolean(options)
        const listenerType = (capture ? CAPTURE : BUBBLE)
        const newNode = {
            listener,
            listenerType,
            passive: optionsIsObj && Boolean(options.passive),
            once: optionsIsObj && Boolean(options.once),
            next: null,
        }

        // Set it as the first node if the first node is null.
        let node = listeners.get(eventName)
        if (node === undefined) {
            listeners.set(eventName, newNode)
            this._associateSystemEventListener(eventName);
            return true
        }

        // Traverse to the tail while checking duplication..
        let prev = null
        while (node) {
            if (node.listener === listener && node.listenerType === listenerType) {
                // Should ignore duplication.
                return false
            }
            prev = node
            node = node.next
        }

        // Add it.
        prev.next = newNode
        this._associateSystemEventListener(eventName);
        return true
    }

    /**
     * Remove a given listener from this event target.
     * @param {string} eventName The event name to remove.
     * @param {Function} listener The listener to remove.
     * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
     * @returns {boolean} `true` if the listener was removed actually.
     */
    removeEventListener(eventName, listener, options) {
        if (!listener) {
            return false
        }

        const listeners = this._listeners
        const capture = isObject(options) ? Boolean(options.capture) : Boolean(options)
        const listenerType = (capture ? CAPTURE : BUBBLE)

        let prev = null
        let node = listeners.get(eventName)
        while (node) {
            if (node.listener === listener && node.listenerType === listenerType) {
                if (prev) {
                    prev.next = node.next
                }
                else if (node.next) {
                    listeners.set(eventName, node.next)
                }
                else {
                    listeners.delete(eventName)
                }

                this._dissociateSystemEventListener(eventName);

                return true
            }

            prev = node
            node = node.next
        }

        return false
    }

    /**
     * Dispatch a given event.
     * @param {Event|{type:string}} event The event to dispatch.
     * @returns {boolean} `false` if canceled.
     */
    dispatchEvent(event) {
        if (!event || typeof event.type !== "string") {
            throw new TypeError("\"event.type\" should be a string.")
        }

        const eventName = event.type
        var onFunc = this['on' + eventName];
        if (onFunc && typeof onFunc === 'function') {
            event._target = event._currentTarget = this;
            onFunc.call(this, event);
            event._target = event._currentTarget = null
            event._eventPhase = 0
            event._passiveListener = null

            if (event.defaultPrevented)
                return false;
        }

        // If listeners aren't registered, terminate.
        const listeners = this._listeners
        
        let node = listeners.get(eventName)
        if (!node) {
            return true
        }

        event._target = event._currentTarget = this;

        // This doesn't process capturing phase and bubbling phase.
        // This isn't participating in a tree.
        let prev = null
        while (node) {
            // Remove this listener if it's once
            if (node.once) {
                if (prev) {
                    prev.next = node.next
                }
                else if (node.next) {
                    listeners.set(eventName, node.next)
                }
                else {
                    listeners.delete(eventName)
                }
            }
            else {
                prev = node
            }

            // Call this listener
            event._passiveListener = node.passive ? node.listener : null
            if (typeof node.listener === "function") {
                node.listener.call(this, event)
            }

            // Break if `event.stopImmediatePropagation` was called.
            if (event._stopped) {
                break
            }

            node = node.next
        }
        event._target = event._currentTarget = null
        event._eventPhase = 0
        event._passiveListener = null

        return !event.defaultPrevented
    }
}

function touchEventHandlerFactory(type) {
    return (touches) => {
        const touchEvent = new TouchEvent(type)

        touchEvent.touches = touches;
        touchEvent.targetTouches = Array.prototype.slice.call(touchEvent.touches)
        touchEvent.changedTouches = touches;//event.changedTouches
        // touchEvent.timeStamp = event.timeStamp

        var i = 0, touchCount = touches.length;
        var target;
        var touchListenerMap = __listenerMap.touch;
        for (let key in touchListenerMap) {
            target = touchListenerMap[key];
            for (i = 0; i < touchCount; ++i) {
                touches[i].target = target;
            }
            target.dispatchEvent(touchEvent);
        }
    }
}

function mouseEventHandlerFactory(type) {
    return (event) => {
        var button = event.button;
        var x = event.x;
        var y = event.y;

        const mouseEvent = new MouseEvent(type, {
            button: button,
            which: button + 1,
            wheelDelta: event.wheelDeltaY,
            clientX: x,
            clientY: y,
            screenX: x,
            screenY: y,
            pageX: x,
            pageY: y
        });
        
        var target;
        var mouseListenerMap = __listenerMap.mouse;
        for (let key in mouseListenerMap) {
            target = mouseListenerMap[key];
            target.dispatchEvent(mouseEvent);
        }
    }
}

function keyboardEventHandlerFactory(type) {
    return (event) => {
        const keyboardEvent = new KeyboardEvent(type, {
            altKey: event.altKey,
            ctrlKey: event.ctrlKey,
            metaKey: event.metaKey,
            shiftKey: event.shiftKey,
            repeat: event.repeat,
            keyCode: event.keyCode
        });
        var target;
        var keyboardListenerMap = __listenerMap.keyboard;
        for (let key in keyboardListenerMap) {
            target = keyboardListenerMap[key];
            target.dispatchEvent(keyboardEvent);
        }
    }
}

module.exports = EventTarget
/** vivo end */

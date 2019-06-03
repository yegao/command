const localStorage = {
    get length() {
        const { keys } = qg.getStorageInfoSync()

        return keys.length
    },

    key(n) {
        const { keys } = qg.getStorageInfoSync()

        return keys[n]
    },

    getItem(key) {
        return qg.getStorageSync({ key })
    },

    setItem(key, value) {
        qg.setStorageSync({
            key,
            value
        })
    },

    removeItem(key) {
        qg.deleteStorageSync({ key })
    },

    clear() {
        qg.clearStorageSync()
    }
}

module.exports = localStorage

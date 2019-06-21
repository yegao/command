require("regenerator-runtime")
window.wx = {
    env: {
        USER_DATA_PATH: 'internal://files'
    }
}
const noop = function () {}
const notSupport = function (name) {
    qg.showToast({
        message: "暂时不支持" + name + "方法,请手动修改"
    })
    console.log("暂时不支持" + name + "方法,请手动修改")
}
// 系统
wx.getSystemInfo = qg.getSystemInfo
wx.getSystemInfoSync = qg.getSystemInfoSync
wx.getLaunchOptionsSync = noop
//更新
wx.getUpdateManager = function () {
    return {
        applyUpdate() {
            qg.applyUpdate()
        },
        onCheckForUpdate() {},
        onUpdateFailed() {},
        onUpdateReady() {}
    }
}
// 生命周期
wx.onShow = function (callback) {
    console.log("回调函数的参数暂时无法适配，请对比微信小游戏的onShow和vivo小游戏的onShow手动修改")
    qg.onShow(callback)
}
wx.onHide = qg.onHide
wx.offShow = qg.offShow
wx.offHide = qg.offHide
wx.getLaunchOptionsSync = function () {
    console.log("vivo小游戏不支持getLaunchOptionsSync，请确认是否需要手动修改")
    return {
        scene: 0,
        query: {},
        shareTicket: "",
        referrerInfo: {
            appId: "",
            extraData: {}
        }
    }
}
wx.exitMiniProgram = function (data) {
    console.log("微信小游戏的exitMiniProgram和vivo小游戏的exitApplication稍有区别，请确认是否需要手动修改")
    qg.exitApplication() // 微信中为异步,vivo中为同步
}

// 应用级事件
wx.onError = qg.onError
wx.onAudioInterruptionBegin = qg.onAudioInterruptionBegin
wx.onAudioInterruptionEnd = qg.onAudioInterruptionEnd
wx.offAudioInterruptionBegin = qg.offAudioInterruptionBegin
wx.offAudioInterruptionEnd = qg.offAudioInterruptionEnd

// 触摸事件
wx.onTouchStart = qg.onTouchStart
wx.onTouchMove = qg.onTouchMove
wx.onTouchEnd = qg.onTouchEnd
wx.onTouchCancel = qg.onTouchCancel
wx.offTouchStart = qg.offTouchStart
wx.offTouchMove = qg.offTouchMove
wx.offTouchEnd = qg.offTouchEnd
wx.offTouchCancel = qg.offTouchCancel

// 性能
wx.triggerGC = qg.triggerGC
wx.getPerformance = qg.getPerformance

// 分包加载
wx.loadSubpackage = qg.loadSubpackage

// 调试
// setEnableDebug -- 暂不支持
// getLogManager -- 暂不支持

// 定时器
// clearInterval
// clearTimeout
// setInterval
// setTimeout

// 渲染
wx.createCanvas = qg.createCanvas

// WebGLRenderingContext.wxBindCanvasTexture -- 暂不支持 需要适配 https://developers.weixin.qq.com/minigame/dev/api/render/canvas/WebGLRenderingContext.wxBindCanvasTexture.html
wx.setPreferredFramesPerSecond = qg.setPreferredFramesPerSecond
// cancelAnimationFrame
// requestAnimationFrame
wx.loadFont = function (path) {
    console.log("微信小游戏的loadFont和vivo小游戏的loadFont稍有区别，请确认是否需要手动修改")
    return qg.loadFont('vivofont', path) // 参数有区别 需要适配
}
wx.getTextLineHeight = qg.getTextLineHeight
wx.createImage = qg.createImage
wx.createRewardedVideoAd = noop // 暂不支持激励视频广告
wx.createInterstitialAd = function (data) { // 参数有区别 需要适配
    if (data) {
        return qg.createInterstitialAd({
            posId: data.adUnitId
        })
    } else {
        return {
            load: noop,
            show: noop,
            hide: noop,
            destroy: noop,
            onLoad: noop,
            offLoad: noop,
            onClose: noop,
            offClose: noop,
            onError: noop,
            offError: noop,
            onSize: noop,
            offSize: noop
        }
    }
}
wx.createBannerAd = function (data) {
    if (data) {
        return qg.createBannerAd({
            posId: data.adUnitId,
            style: data && data.style
        })
    } else {
        return {
            load: noop,
            show: noop,
            hide: noop,
            destroy: noop,
            onLoad: noop,
            offLoad: noop,
            onClose: noop,
            offClose: noop,
            onError: noop,
            offError: noop,
            onSize: noop,
            offSize: noop
        }
    }
}

//界面
wx.showToast = function (data) {
    if (data) {
        qg.showToast({
            message: data && data.title || '',
            duration: (1500 < data.duration) && 1 || 0
        })
        if (data) {
            if (typeof data.success === 'function') {
                data.success()
            }
            if (typeof data.complete === 'function') {
                data.complete()
            }
        }
    }
}
wx.showModal = function (data) {
    const buttons = [{
        text: data && data.confirmText || '确定',
        color: data && data.confirmColor || '#576B95'
    }]
    if (data.showCancel) {
        buttons[1] = {
            text: data && data.cancelText || '取消',
            color: data && data.cancelColor || '#000000'
        }
    }
    qg.showDialog({
        title: data && data.title || '',
        message: data && data.content,
        buttons,
        success: noop, // data.success, // 此处和微信的意义不同，不好适配
        cancel: noop, // data.success, // 此处和微信的意义不同，不好适配
        complete: data && data.complete
    })
}
wx.showLoading = function (data) {
    qg.showLoading({
        message: data && data.title,
        success: data && data.success,
        cancel: data && data.fail,
        complete: data && data.complete
    })
}
wx.showActionSheet = function () {
    notSupport("showActionSheet")
}
wx.hideToast = function () {
    notSupport("hideToast")
}
wx.hideLoading = qg.hideLoading
wx.updateKeyboard = function () {
    notSupport("updateKeyboard")
}
wx.showKeyboard = qg.showKeyboard // qg.showKeyboard会使得canvas的点击事件无法被触发（可能是有则该层）
wx.onKeyboardInput = qg.onKeyboardInput
wx.onKeyboardConfirm = qg.onKeyboardConfirm
wx.onKeyboardComplete = qg.onKeyboardComplete
wx.offKeyboardInput = qg.offKeyboardInput
wx.offKeyboardConfirm = qg.offKeyboardConfirm
wx.offKeyboardComplete = qg.offKeyboardComplete
wx.hideKeyboard = function (data) {
    qg.hideKeyboard();
    if (data) {
        if (typeof data.success === 'function') {
            data.success({
                errMsg: "hideKeyboard:ok"
            })
        }
        if (typeof data.complete === 'function') {
            data.complete({
                errMsg: "hideKeyboard:ok"
            })
        }
    }
}
wx.setMenuStyle = function () {
    notSupport("setMenuStyle")
}
wx.getMenuButtonBoundingClientRect = function () {
    notSupport("getMenuButtonBoundingClientRect")
}
wx.setStatusBarStyle = function () {
    notSupport("setStatusBarStyle")
}
wx.onWindowResize = function () {
    notSupport("onWindowResize")
} // 需要适配
wx.offWindowResize = function () {
    notSupport("offWindowResize")
} // 需要适配


// 网络
wx.request = qg.request
wx.downloadFile = function (data) {
    if (data.filePath) {
        console.log("wx.downloadFile参数中的filePath字段将被忽略，请确认是否会有影响")
    }
    return qg.download({
        url: data && data.url,
        header: data && data.header,
        success: data && data.success || noop,
        fail: data && data.fail || noop,
        complete: data && data.complete || noop
    })
}
wx.uploadFile = function (data) {
    return qg.uploadFile({
        url: data.url,
        files: [data.filePath],
        method: 'POST',
        data: data && data.formData,
        header: data && data.header,
        success: data && data.success || noop,
        fail: data && data.fail || noop,
        complete: data && data.complete || noop
    })
}

wx.createUDPSocket = function () {
    notSupport("createUDPSocket")
}
wx.updateShareMenu = function () {
    notSupport("updateShareMenu")
}
wx.showShareMenu = function () {
    notSupport("showShareMenu")
}
wx.shareAppMessage = function () {
    notSupport("shareAppMessage")
}
wx.onShareAppMessage = function () {
    notSupport("onShareAppMessage")
}
wx.offShareAppMessage = function () {
    notSupport("offShareAppMessage")
}
wx.hideShareMenu = function () {
    notSupport("hideShareMenu")
}
wx.getShareInfo = function () {
    notSupport("getShareInfo")
}

wx.requestMidasPayment = function (data) { // -- 不好适配
    console.log("支付信息请手动适配")
    // qg.pay({
    //     orderInfo:"",	// 订单信息。支付服务器返回的订单json字符串
    //     success: data && data.success,
    //     fail: data && data.fail,
    //     complete: data && data.complete
    // })
}


// 媒体
wx.setInnerAudioOption = function () {
    notSupport("setInnerAudioOption")
}
wx.getAvailableAudioSources = function () {
    notSupport("getAvailableAudioSources")
}
wx.createInnerAudioContext = qg.createInnerAudioContext
wx.saveImageToPhotosAlbum = function (data) {
    console.log("微信小游戏的saveImageToPhotosAlbum和vivo小游戏的saveToPhotoAlbum的success返回值稍有区别，请确认是否需要手动修改")
    return qg.saveToPhotoAlbum({
        uri: data && data.filePath,
        success: data && data.success || noop,
        fail: data && data.fail || noop,
        complete: data && data.complete || noop
    })
}
wx.previewImage = function (data) {
    return qg.previewImage({
        uris: data.urls,
        success: data && data.success || noop,
        fail: data && data.fail || noop,
        complete: data && data.complete || noop
    })
}
wx.chooseImage = function (data) {
    console.log("微信小游戏的chooseImage和vivo小游戏的takePhoto和pickImage稍有区别，请确认是否需要手动修改")
    const {
        sourceType
    } = data
    if (sourceType.length === 1 && sourceType[0] === 'camera') {
        return qg.takePhoto({
            success: data && data.success || noop,
            fail: data && data.fail || noop,
            complete: data && data.complete || noop
        })
    } else {
        return qg.pickImage({
            success: data && data.success || noop,
            fail: data && data.fail || noop,
            complete: data && data.complete || noop
        })
    }
}
wx.getRecorderManager = function () {
    let onStartHandler = noop
    let onStopHandler = noop
    let tempFilePath = ''
    return {
        onError: noop,
        onFrameRecorded: noop,
        onInterruptionBegin: noop,
        onInterruptionEnd: noop,
        onPause: noop,
        onResume: noop,
        onStart: function (callback) {
            onStartHandler = callback.bind(this)
        },
        onStop: function (callback) {
            onStopHandler = callback.bind(this)
        },
        pause: noop,
        resume: noop,
        start: function () {
            qg.startRecord({
                success: function (data) {
                    tempFilePath = data.uri
                    onStartHandler() // @TODO 需要确认微信中这里是否有参数
                },
                fail: noop,
                complete: noop
            })
        },
        stop: function () {
            qg.stopRecord()
            onStopHandler({
                tempFilePath
            }) // duration, fileSize 无法适配
        }
    }
}
wx.createVideo = function () {
    return {
        destroy: noop,
        exitFullScreen: noop,
        offEnded: noop,
        offError: noop,
        offPause: noop,
        offPlay: noop,
        offTimeUpdate: noop,
        offWaiting: noop,
        onEnded: noop,
        onError: noop,
        onPause: noop,
        onPlay: noop,
        onTimeUpdate: noop,
        onWaiting: noop,
        pause: noop,
        play: noop,
        requestFullScreen: noop,
        seek: noop,
        stop: noop
    }
}
wx.updateVoIPChatMuteConfig = function () {
    notSupport("updateVoIPChatMuteConfig")
}
wx.onVoIPChatSpeakersChanged = function () {
    notSupport("onVoIPChatSpeakersChanged")
}
wx.onVoIPChatMembersChanged = function () {
    notSupport("onVoIPChatMembersChanged")
}
wx.onVoIPChatInterrupted = function () {
    notSupport("onVoIPChatInterrupted")
}
wx.joinVoIPChat = function () {
    notSupport("joinVoIPChat")
}
wx.exitVoIPChat = function () {
    notSupport("exitVoIPChat")
}
wx.getLocation = qg.getLocation // 参数略有差别，但不影响兼容


// 文件
wx.getFileSystemManager = qg.getFileSystemManager = function () {
    return {
        access(data) {
            return function () {
                qg.accessFile({
                    uri: data && data.path
                })
                if (data) {
                    if (typeof data.success === 'function') {
                        data.success() // @TODO 需要确认微信中这里是否有参数
                    }
                    if (typeof data.complete === 'function') {
                        data.complete() // @TODO 需要确认微信中这里是否有参数
                    }
                }
            }
        },
        accessSync: function (path) {
            return qg.accessFile({
                uri: path
            })
        },
        appendFile(data) {
            return qg.appendFile({
                uri: data && data.filePath,
                text: data && data.data,
                encoding: data && data.encoding || 'utf8',
                success: data && data.success || noop,
                fail: data && data.fail || noop,
                complete: data && data.complete || noop
            })
        },
        appendFileSync: async function (filePath, data, encoding) {
            return await new Promise(function (resolve, reject) {
                qg.appendFile({
                    uri: filePath,
                    text: data,
                    encoding: encoding || 'utf8',
                    success(data) {
                        resolve(data)
                    },
                    fail(data) {
                        reject(data)
                    }
                })
            })
        },
        copyFile(data) {
            return qg.copyFile({
                srcUri: data && data.srcPath,
                dstUri: data && data.destPath,
                success: data && data && data.success || noop,
                fail: data && data.fail || noop,
                complete: data && data.complete || noop
            })
        },
        copyFileSync: async function (srcPath, destPath) {
            return await new Promise(function (resolve, reject) {
                qg.copyFile({
                    srcUri: srcPath,
                    dstUri: destPath,
                    success(data) {
                        resolve(data)
                    },
                    fail(data) {
                        reject(data)
                    }
                })
            })
        },
        getFileInfo(data) {
            return qg.getFileInfo({
                uri: data && data.filePath,
                success: data && data.success || noop,
                fail: data && data.fail || noop,
                complete: data && data.complete || noop
            })
        },
        getSavedFileList(data) {
            return qg.listDir({
                uri: "internal://cache/", // @TODO 需要确认这样是否正确
                success: data.success || noop,
                fail: data.fail || noop,
                complete: data.complete || noop
            })
        },
        mkdir(data) {
            return qg.mkdir({
                uri: data && data.dirPath, // @TODO 需要确认这样是否正确 微信支持通过传递recursive来递归创建文件夹，是否需要适配
                success: data && data.success || noop,
                fail: data && data.fail || noop,
                complete: data && data.complete || noop
            })
        },
        mkdirSync: async function (dirPath, recursive) { // @TODO 需要确认这样是否正确 微信支持通过传递recursive来递归创建文件夹，是否需要适配
            return await new Promise(function (resolve, reject) {
                qg.mkdir({
                    uri: dirPath,
                    success(data) {
                        resolve(data)
                    },
                    fail(data) {
                        reject(data)
                    }
                })
            })
        },
        readdir: function () {
            notSupport("readdir")
        },
        readdirSync: function () {
            notSupport("readdirSync")
        },
        readFile(data) {
            let param = {
                errMsg: "readFile:fail #" + data.filePath
            }
            return qg.readFile({
                uri: data.filePath, // @TODO 需要确认这样是否正确 微信支持通过传递recursive来递归创建文件夹，是否需要适配
                encoding: data.encoding || 'binary',
                success: function (res) {
                    if (data.success) {
                        if (res && res.hasOwnProperty('text')) {
                            param = {
                                data: res.text,
                                errMsg: "readFile:ok"
                            }
                            data.success(param)
                        }
                    }
                },
                fail: function () {
                    data.fail && data.fail(param)
                },
                complete: function () {
                    data.complete && data.complete(param)
                }
            })
        },
        readFileSync: function (filePath, encoding) {
            return qg.readFileSync({
                uri: filePath,
                encoding: encoding || 'binary'
            })
        },
        removeSavedFile(data) {
            return qg.deleteFile({
                uri: data.filePath,
                success: data.success || noop,
                fail: data.fail || noop,
                complete: data.complete || noop
            })
        },
        rename(data) {
            let param = {
                errMsg: "rename:fail #" + data.oldPath + "->" + data.newPath
            }
            return qg.renameFile({
                srcUri: data.oldPath,
                dstUri: data.newPath,
                success: function (res) {
                    param = {
                        errMsg: "rename:ok"
                    }
                    data.success && data.success(param)
                },
                fail: function () {
                    data.fail && data.fail(param)
                },
                complete: function () {
                    data.complete && data.complete(param)
                }
            })
        },
        renameSync: async function (oldPath, newPath) {
            return await new Promise(function (resolve, reject) {
                qg.renameFile({
                    srcUri: oldPath,
                    dstUri: newPath,
                    success(data) {
                        resolve(data)
                    },
                    fail(data) {
                        reject(data)
                    }
                })
            })
        },
        rmdir(data) { // vivo的rmdir本身就是递归删除的
            const remove = function (param) {
                qg.rmdir({
                    uri: data.dirPath,
                    success() {
                        param = {
                            errMsg: "rmdir:ok"
                        };
                        data.success && data.success(param)
                    },
                    fail() {
                        data.fail && data.fail(param)
                    },
                    complete() {
                        data.complete && data.complete(param)
                    }
                })
            }
            const recursive = data.recursive
            if (recursive) {
                remove({
                    errMsg: "rmdir:fail #" + data.dirPath
                })
            } else {
                const isDirectory = qg.isDirectory({
                    uri: data.dirPath
                })
                if (isDirectory) {
                    qg.listDir({
                        uri: data.dirPath,
                        success(res) {
                            const fileList = res.fileList
                            const length = fileList.length
                            if (0 < length) {
                                data.fail && data.fail(param)
                            } else {
                                remove({
                                    errMsg: "rmdir:fail #" + data.dirPath + " is not empty"
                                })
                            }
                        },
                        fail() {
                            // 如果是空文件夹，qg.listDir会在fail里面回调"io error",此处已经提出修改意见
                            remove({
                                errMsg: "rmdir:fail"
                            })
                        }
                    })
                } else if (data.fail) {
                    data.fail({
                        errMsg: "rmdir:fail #" + data.dirPath + " is not a directory"
                    })
                }
            }
        },
        rmdirSync: async function (dirPath, recursive) { // @TODO 需要确认这样是否正确 微信支持通过传递recursive来递归删除文件夹，是否需要适配
            return await new Promise(function (resolve, reject) {
                qg.rmdir({
                    uri: dirPath,
                    success(data) {
                        resolve(data)
                    },
                    fail(data) {
                        reject(data)
                    }
                })
            })
        },
        saveFile(data) {
            return qg.moveFile({
                srcUri: data && data.tempFilePath,
                dstUri: data && data.filePath,
                success: data && data.success || noop,
                fail: data && data.fail || noop,
                complete: data && data.complete || noop
            })
        },
        saveFileSync: async function (tempFilePath, filePath) {
            return await new Promise(function (resolve, reject) {
                qg.moveFile({
                    srcUri: tempFilePath,
                    dstUri: filePath,
                    success(data) {
                        resolve(data)
                    },
                    fail(data) {
                        reject(data)
                    }
                })
            })
        },
        stat(data) { // @TODO 需要确认这样是否正确 微信支持传递recursive,此时返回有点区别
            const successHandler = data.success;
            const completeHandler = data.complete;
            successHandler && successHandler({
                stats: {
                    isDirectory() {
                        return qg.isDirectory({
                            uri: data && data.path
                        })
                    },
                    isFile() {
                        return qg.isFile({
                            uri: data && data.path
                        })
                    }
                }
            })
            completeHandler && completeHandler()
        },
        statSync: function (path, recursive) { // @TODO 需要确认这样是否正确 微信支持传递recursive,此时返回有点区别
            return {
                isDirectory() {
                    return qg.isDirectory({
                        uri: path
                    })
                },
                isFile() {
                    return qg.isFile({
                        uri: path
                    })
                }
            }
        },
        unlink(data) {
            let param = {
                errMsg: "unlink:fail #" + data.filePath
            }
            return qg.deleteFile({
                uri: data.filePath,
                success: function () {
                    param = {
                        errMsg: "unlink:ok"
                    };
                    data.success && data.success(param)
                },
                fail: function () {
                    data.fail && data.fail(param)
                },
                complete: function () {
                    data.complete && data.complete(param)
                }
            })
        },
        unlinkSync: async function (filePath) {
            return await new Promise(function (resolve, reject) {
                qg.deleteFile({
                    uri: filePath,
                    success(data) {
                        resolve(data)
                    },
                    fail(data) {
                        reject(data)
                    }
                })
            })
        },
        unzip(data) {
            return qg.unzipFile({
                srcUri: data.zipFilePath,
                dstUri: data.targetPath,
                success: data.success || noop,
                fail: data.fail || noop,
                complete: data.complete || noop
            })
        },
        writeFile(data) {
            let param = {
                errMsg: "writeFile:fail #" + data.filePath
            }
            return qg.writeFile({
                uri: data.filePath,
                text: data.data,
                encoding: data.encoding || 'utf8',
                success: function () {
                    param = {
                        errMsg: "writeFile:ok"
                    };
                    data.success && data.success(param)
                },
                fail: function () {
                    data.fail && data.fail(param)
                },
                complete: function () {
                    data.complete && data.complete(param)
                }
            })
        },
        writeFileSync: function (filePath, data, encoding) {
            return qg.writeFileSync({
                uri: filePath,
                text: data,
                encoding: encoding || 'utf8'
            })
        }
    }
}

// 开放接口
wx.navigateToMiniProgram = noop
// qg.authorize({
//     type: "token",
//     success: function (obj) {
//         qg.showToast({
//             message: "handling success, code: " + obj.accessToken
//         })
//         qg.getProfile({
//             token: obj.accessToken,
//             success: function(data){
//                 qg.showToast({
//                     message: "nickname: " + data.nickname
//                 })
//             },
//             fail: function(data, code) {
//                 qg.showToast({
//                     message: "handling fail, code=" + code
//                 })
//             }
//         })
//     },
//     fail: function (data, code) {
//         qg.showToast({
//             message: "handling fail, fail code: " + code
//         })
//     }
// })

wx.getUserInfo = function (data) { // 不好适配
    qg.showToast({
        message: "无法自动适配wx.getUserInfo,请使用qg.getProfile进行适配"
    })
    console.log("无法自动适配wx.createUserInfoButton,请使用qg.authorize和qg.getProfile进行适配,具体请参考https://minigame.vivo.com.cn/documents/#/api/service/account") // console.log("获取用户信息请手动适配")
    // return qg.getProfile({
    //     token: data && data.token,
    //     success: data && data.success || noop,
    //     fail: data && data.fail || noop,
    //     complete: data && data.complete || noop
    // })
}

wx.createUserInfoButton = function () {
    qg.showToast({
        message: "无法自动适配wx.createUserInfoButton,请使用qg.authorize和qg.getProfile进行适配"
    })
    console.log("无法自动适配wx.createUserInfoButton,请使用qg.authorize和qg.getProfile进行适配,具体请参考https://minigame.vivo.com.cn/documents/#/api/service/account")
    return {
        destroy() {},
        hide() {},
        offTap() {},
        onTap() {},
        show() {}
    }
}
wx.checkSession = function () {
    notSupport("checkSession")
}

wx.authorize = function (data) { // 不好适配
    qg.showToast({
        message: "无法自动适配wx.authorize,请使用qg.authorize和qg.getProfile进行适配"
    })
    console.log("无法自动适配wx.authorize,请使用qg.authorize和qg.getProfile进行适配,具体请参考https://minigame.vivo.com.cn/documents/#/api/service/account")
    // return qg.authorize({
    //     type: data && data.type || "token",
    //     redirectUri: data && data.redirectUri,
    //     scope: data && data.scope,
    //     state: data && data.state,
    //     success: data && data.success || noop,
    //     fail: data && data.fail || noop,
    //     complete: data && data.complete || noop
    // })
}


// 开放数据域
wx.setUserCloudStorage = function () {
    notSupport("setUserCloudStorage")
}
wx.removeUserCloudStorage = function () {
    notSupport("removeUserCloudStorage")
}
wx.getUserCloudStorage = function () {
    notSupport("getUserCloudStorage")
}
wx.getSharedCanvas = function () {
    notSupport("getSharedCanvas")
}
wx.getGroupCloudStorage = function () {
    notSupport("getGroupCloudStorage")
}
wx.getFriendCloudStorage = function () {
    notSupport("getFriendCloudStorage")
}
wx.onMessage = function () {
    notSupport("onMessage")
}
wx.getOpenDataContext = function () {
    notSupport("getOpenDataContext")
}

// 防沉迷
wx.checkIsUserAdvisedToRest = function () {
    notSupport("checkIsUserAdvisedToRest")
}

// 意见反馈
wx.createFeedbackButton = function () {
    notSupport("createFeedbackButton")
}

// 设置
wx.openSetting = function () {
    notSupport("openSetting")
}
wx.getSetting = function () {
    notSupport("getSetting")
}
wx.createOpenSettingButton = function () {
    notSupport("createOpenSettingButton")
}

// 游戏圈
wx.createGameClubButton = function () {
    notSupport("createGameClubButton")
}

// 客服消息
wx.openCustomerServiceConversation = function () {
    notSupport("openCustomerServiceConversation")
}

// 微信运动
wx.getWeRunData = function () {
    notSupport("getWeRunData")
}

// 卡卷
wx.openCard = function () {
    notSupport("openCard")
}
wx.addCard = function () {
    notSupport("addCard")
}

// 设备
// 震动
wx.vibrateLong = function (data) {
    qg.vibrateLong()
    if (data) {
        if (typeof data.success === 'function') {
            data.success({errMsg: "vibrateLong:ok"})
        }
        if (typeof data.complete === 'function') {
            data.complete({errMsg: "vibrateLong:ok"})
        }
    }
}
wx.vibrateShort = function (data) {
    qg.vibrateShort()
    if (data) {
        if (typeof data.success === 'function') {
            data.success({errMsg: "vibrateShort:ok"})
        }
        if (typeof data.complete === 'function') {
            data.complete({errMsg: "vibrateShort:ok"})
        }
    }
}
// 电量
wx.getBatteryInfoSync = function(){
    const info = qg.getBatteryInfoSync()
    return {
        isCharging: info.charging,
        level: info.level*100,
        errMsg: "getBatteryInfoSync:ok"
    }
}
wx.getBatteryInfo = function(data){
    let param = {
        errMsg: "getBatteryInfo:fail"
    }
    qg.getBatteryInfo({
        success(res){
            param = {
                isCharging: res.charging,
                level: res.level*100,
                errMsg: "getBatteryInfoSync:ok"
            }
            data && data.success && data.success(param)
        },
        fail(){
            data && data.fail && data.fail(param)
        }, 
        complete(){
            data && data.complete && data.complete(param)
        }
    })
}
// 剪贴板
wx.setClipboardData = function (data) {
    return qg.setClipboardData({
        text: data.data,
        success: data.success,
        fail: data.fail,
        complete: data.complete
    })
}
wx.getClipboardData = function (data) {
    let param = {
        errMsg: "getClipboardData:fail"
    }
    qg.getClipboardData({
        success(res){
            param = {
                data: res.text,
                errMsg: "getClipboardData:ok"
            }
            data && data.success && data.success(param)
        },
        fail(){
            data && data.fail && data.fail(param)
        },
        complete(){
            data && data.complete && data.complete(param)
        }
    })
}
//网络
wx.onNetworkStatusChange = function (callback) {
    return qg.subscribeNetworkStatus({
        callback(res) {
            callback && callback({
                isConnected: (res.type != "none"),
                networkType: res.type
            })
        }
    })
}
wx.getNetworkType = function (data) {
    let param = {
        errMsg: "getNetworkType:fail"
    }
    qg.getNetworkType({
        success(res){
            param = {
                networkType: res.type,
                errMsg: "getNetworkType:ok"
            }
            data && data.success && data.success(param)
        },
        fail(){
            data && data.fail && data.fail(param)
        },
        complete(){
            data && data.complete && data.complete(param)
        }
    })
}
// 屏幕
wx.setScreenBrightness = function (data) {
    // 亮度范围微信是0-1，vivo是0-255
    qg.setScreenBrightness({
        value: data && parseInt(data.value * 255),
        success: data && data.success || noop,
        fail: data && data.fail || noop,
        complete: data && data.complete || noop
    })
}
wx.getScreenBrightness = function (data) {
    let param = {
        errMsg: "getScreenBrightness:fail"
    }
    qg.getScreenBrightness({
        success(res){
            param = {
                value: res.value/255,
                errMsg: "getScreenBrightness:ok"
            }
            data && data.success && data.success(param)
        },
        fail(){
            data && data.fail && data.fail(param)
        },
        complete(){
            data && data.complete && data.complete(param)
        }
    })
}
wx.setKeepScreenOn = qg.setKeepScreenOn
// 转屏
wx.onDeviceOrientationChange = function () {
    notSupport("onDeviceOrientationChange")
}
wx.offDeviceOrientationChange = function () {
    notSupport("onDeviceOrientationChange")
}
// 加速计
wx.startAccelerometer = function (data) {
    if (data) {
        if (typeof data.success === 'function') {
            data.success({
                errMsg: "startAccelerometer:ok"
            })
        }
        if (typeof data.complete === 'function') {
            data.complete({
                errMsg: "startAccelerometer:ok"
            })
        }
    }
}
wx.onAccelerometerChange = function (callback) {
    qg.subscribeAccelerometer({
        callback
    })
}
wx.stopAccelerometer = function (data) {
    qg.unsubscribeAccelerometer()
    if (data) {
        if (typeof data.success === 'function') {
            data.success({
                errMsg: "stopAccelerometer:ok"
            })
        }
        if (typeof data.complete === 'function') {
            data.complete({
                errMsg: "stopAccelerometer:ok"
            })
        }
    }
}
// 罗盘
wx.startCompass = function (data) {
    if (data) {
        if (typeof data.success === 'function') {
            data.success({
                errMsg: "startCompass:ok"
            })
        }
        if (typeof data.complete === 'function') {
            data.complete({
                errMsg: "startCompass:ok"
            })
        }
    }
}
wx.onCompassChange = function (callback) { // vivo小游戏没有accuracy，暂时忽略
    qg.subscribeCompass({
        callback
    })
}
wx.stopCompass = function (data) {
    qg.unsubscribeCompass()
    if (data) {
        if (typeof data.success === 'function') {
            data.success({
                errMsg: "stopCompass:ok"
            })
        }
        if (typeof data.complete === 'function') {
            data.complete({
                errMsg: "stopCompass:ok"
            })
        }
    }
}
// 设备方向
wx.startDeviceMotionListening = function () {
    notSupport("startDeviceMotionListening")
}
wx.stopDeviceMotionListening = function () {
    notSupport("stopDeviceMotionListening")
}
wx.onDeviceMotionChange = function () {
    notSupport("onDeviceMotionChange")
}
wx.startGyroscope = function () {
    notSupport("startGyroscope")
}
wx.stopGyroscope = function () {
    notSupport("stopGyroscope")
}
wx.onGyroscopeChange = function () {
    notSupport("onGyroscopeChange")
}
// 性能
wx.onMemoryWarning = function () {
    notSupport("onMemoryWarning")
}


// Worker
wx.createWorker = function () {
    notSupport("createWorker")
}

var gl = __gl;
//顶点着色器源码
var vertexShader_source = "attribute vec4 a_Position;\n" +
    "attribute vec2 a_TextureCoord;\n" +
    "varying vec2 v_TextureCoord;\n" +
    "void main()\n" +
    "{\n" +
    "   gl_Position = a_Position;\n" +
    "   v_TextureCoord = a_TextureCoord;\n" +
    "}\n";

//片元着色器源码
var fragmentShader_source = "precision lowp float;\n" +
    "uniform sampler2D u_Sampler;\n" +
    "varying vec2 v_TextureCoord;\n" +
    "void main() {\n" +
    "   gl_FragColor = texture2D(u_Sampler, v_TextureCoord);\n" +
    "}\n";

function loadShader(gl, shaderType, shaderSource) {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    //返回是否链接成功
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        console.log("shader not compiled!");
        console.log(gl.getShaderInfoLog(shader));
    }
    return shader;
}

var positionLocation, textureCoordLocation;
function createShaderProgram(gl, vertexShader, fragmentShader) {
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    var compiled = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
    if (!compiled) {
        console.log("program not compiled");
        console.log(gl.getProgramInfoLog(shaderProgram));
        return;
    }
    positionLocation = gl.getAttribLocation(shaderProgram, "a_Position");
    textureCoordLocation = gl.getAttribLocation(shaderProgram, "a_TextureCoord");
    return shaderProgram;
}

var vertexShader, fragmentShader, shaderProgramcanvas, vertexBuffer, indexBuffer, canvasTexture;
const initTexCanvas = function (canvas) {
    gl = canvas.getContext("webgl");

    vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShader_source);
    fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShader_source);
    shaderProgramcanvas = createShaderProgram(gl, vertexShader, fragmentShader);

    vertexBuffer = gl.createBuffer();
    indexBuffer = gl.createBuffer();
    canvasTexture = gl.createTexture();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    // setTextureCanvas(canvas);
}

const setTextureCanvas = function (canvas) {
    //texture
    // canvasTexture = gl.createTexture();

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.bindTexture(gl.TEXTURE_2D, canvasTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    //  console.log("xxxxxx " + window.__canvas._alignment);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

function getarrayVertexAttrib(gl, location) {
    var binding = gl.getVertexAttrib(location, gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
    var enabled = gl.getVertexAttrib(location, gl.VERTEX_ATTRIB_ARRAY_ENABLED);
    var size = gl.getVertexAttrib(location, gl.VERTEX_ATTRIB_ARRAY_SIZE);
    var type = gl.getVertexAttrib(location, gl.VERTEX_ATTRIB_ARRAY_TYPE);
    var normalized = gl.getVertexAttrib(location, gl.VERTEX_ATTRIB_ARRAY_NORMALIZED);
    var stride = gl.getVertexAttrib(location, gl.VERTEX_ATTRIB_ARRAY_STRIDE);
    var offset = gl.getVertexAttribOffset(location, gl.VERTEX_ATTRIB_ARRAY_POINTER);
    var data = {
        "binding": binding,
        "enabled": enabled,
        "size": size,
        "type": type,
        "normalized": normalized,
        "stride": stride,
        "offset": offset,
    }
    return data;
}

//顶点数组
var vertices = new Float32Array([
    //0
    -1.0, 1.0,
    0, 0,
    //1
    1.0, 1.0,
    1, 0,
    //2
    1.0, -1.0,
    1, 1,
    //3
    -1.0, -1.0,
    0, 1,
]);
//索引数组
var indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
const renderTexCanvas = function () {
    //record previous render data
    var shaderIndex = gl.getParameter(gl.CURRENT_PROGRAM);
    var arrayBuffer = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
    var elementBuffer = gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING);
    var texture2D = gl.getParameter(gl.TEXTURE_BINDING_2D);
    var positionData = getarrayVertexAttrib(gl, positionLocation);
    var textureCoordData = getarrayVertexAttrib(gl, textureCoordLocation);

    //canvas render data
    gl.useProgram(shaderProgramcanvas);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 4 * 4, 0);
    gl.enableVertexAttribArray(positionLocation);

    gl.vertexAttribPointer(textureCoordLocation, 2, gl.FLOAT, false, 4 * 4, 2 * 4);
    gl.enableVertexAttribArray(textureCoordLocation);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, canvasTexture);

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    //recover previous render data
    gl.useProgram(shaderIndex);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionData["binding"]);
    gl.enableVertexAttribArray(positionData["enabled"]);
    gl.vertexAttribPointer(positionLocation, positionData["size"], positionData["type"],
        positionData["normalized"], positionData["stride"], positionData["offset"]);

    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordData["binding"]);
    gl.enableVertexAttribArray(textureCoordData["enabled"]);
    gl.vertexAttribPointer(textureCoordLocation, textureCoordData["size"], textureCoordData["type"],
        textureCoordData["normalized"], textureCoordData["stride"], textureCoordData["offset"]);

    gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture2D);
}



window.canvas = window.mainCanvas || qg.createCanvas()
canvas.__proto__.__proto__ = new HTMLElement('canvas')
const ctx = canvas.getContext('2d')
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
  return {
    top: 0,
    left: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }
}
initTexCanvas(canvas)
window.wx = {}
wx.getLaunchOptionsSync = noop
const noop = function(){}

//更新
wx.getUpdateManager = function(){
    return {
        applyUpdate(){
            qg.applyUpdate()
        },
        onCheckForUpdate(){},
        onUpdateFailed(){},
        onUpdateReady(){}
    }
}


// 生命周期
wx.onShow = qg.onShow
wx.onHide = qg.onHide
wx.offShow = qg.offShow
wx.offHide = qg.offHide
wx.getLaunchOptionsSync = function(){
    return {
        scene:0,
        query:{},
        shareTicket:"",
        referrerInfo:{
            appId:"",
            extraData:{}
        }
    }
}
wx.exitMiniProgram = qg.exitApplication // 微信中为异步,vivo中为同步


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
wx.loadFont = function(path){
    qg.loadFont('familyName', path) // 参数有区别 需要适配
}
wx.getTextLineHeight = qg.getTextLineHeight
wx.createImage = qg.createImage
wx.createRewardedVideoAd = noop // 暂不支持激励视频广告
wx.createInterstitialAd = function(data){ // 参数有区别 需要适配
    if(data){
        return qg.createInterstitialAd({
            posId:data.adUnitId
        })
    }
    else {
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
wx.createBannerAd =  function(){
    if(data){
        return qg.createBannerAd({
            posId:data.adUnitId,
            style: data.style
        })
    }
    else {
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
wx.showToast = function(data){
    if(data){
        qg.showToast({
            message: data.title || '',
            duration: (1500 < data.duration) && 1 || 0
        })
        if(typeof data.success === 'function'){
            data.success()
        }
        if(typeof data.complete === 'function'){
            data.complete()
        }
    }
}
wx.showModal = function(data){
    const buttons = [{
        text: data.confirmText || '确定',
        color: data.confirmColor || '#576B95'
    }]
    if(data.showCancel){
        buttons[1] = {
            text: data.cancelText || '取消',
            color: data.cancelColor || '#000000'
        }
    }
    qg.showDialog({
        title: data.title || '',
        message: data.content,
        buttons,
        success: noop, // data.success, // 此处和微信的意义不同，不好适配
        cancel: noop, // data.success, // 此处和微信的意义不同，不好适配
        complete: data.complete
    })
}
wx.showLoading = function(data){
    qg.showLoading({
        message: data.title,
        success: data.success,
        cancel: data.fail,
        complete: data.complete
    })
}
wx.showActionSheet = noop
wx.hideToast = noop
wx.hideLoading = qg.hideLoading

wx.updateKeyboard = noop
wx.showKeyboard = qg.showKeyboard
wx.onKeyboardInput = qg.onKeyboardInput
wx.onKeyboardConfirm = qg.onKeyboardConfirm
wx.onKeyboardComplete = qg.onKeyboardComplete
wx.offKeyboardInput = qg.offKeyboardInput
wx.offKeyboardConfirm = qg.offKeyboardConfirm
wx.offKeyboardComplete = qg.offKeyboardComplete
wx.hideKeyboard = function(data){
    qg.hideKeyboard();
    if(typeof data.success === 'function'){
        data.success({errMsg: "hideKeyboard:ok"})
    }
    if(typeof data.complete === 'function'){
        data.complete({errMsg: "hideKeyboard:ok"})
    }
}
wx.setMenuStyle = noop
wx.getMenuButtonBoundingClientRect = noop
wx.setStatusBarStyle = noop
wx.onWindowResize = noop // 需要适配
wx.offWindowResize = noop // 需要适配


// 网络
wx.request = qg.request
wx.downloadFile = function(data){  // 微信存在filePath可选参数指定文件下载后存储的路径，该适配不支持
    return qg.download({
        url: data.url,
        header: data.header,
        success: data.success || noop,
        fail: data.fail || noop,
        complete: data.complete || noop
    })
}
wx.uploadFile = function(data){
    return qg.uploadFile({
        url:data.url,
        files:[data.filePath],
        method:'POST',
        data: data.formData,
        header: data.header,
        success: data.success || noop,
        fail: data.fail || noop,
        complete: data.complete || noop
    })
}

wx.createUDPSocket = noop
wx.updateShareMenu = noop
wx.showShareMenu = noop
wx.shareAppMessage = noop
wx.onShareAppMessage = noop
wx.offShareAppMessage = noop
wx.hideShareMenu = noop
wx.getShareInfo = noop

wx.requestMidasPayment = function(data){ // -- 不好适配
    console.log("支付信息请手动适配")
    // qg.pay({
    //     orderInfo:"",	// 订单信息。支付服务器返回的订单json字符串
    //     success: data.success,
    //     fail: data.fail,
    //     complete: data.complete
    // })
}


// 媒体
wx.setInnerAudioOption = noop
wx.getAvailableAudioSources = noop
wx.createInnerAudioContext = qg.createInnerAudioContext
wx.saveImageToPhotosAlbum = function(data){
    return qg.saveToPhotosAlbum({
        uri: data.filePath,
        success: data.success || noop,
        fail: data.fail || noop,
        complete: data.complete || noop
    })
}
wx.previewImage = function(data){
    return qg.previewImage({
        uris:data.urls,
        success: data.success || noop,
        fail: data.fail || noop,
        complete: data.complete || noop
    })
}
wx.chooseImage = function(data){
    const { sourceType } = data
    if(sourceType.length === 1 && sourceType[0] === 'camera') {
        return qg.takePhoto({
            success: data.success || noop,
            fail: data.fail || noop,
            complete: data.complete || noop
        })
    }
    else {
        return qg.pickImage({
            success: data.success || noop,
            fail: data.fail || noop,
            complete: data.complete || noop
        })
    }
}
wx.getRecorderManager = function(){
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
        onStart: function(callback){
            onStartHandler = callback.bind(this)
        },
        onStop: function(callback){
            onStopHandler = callback.bind(this)
        },
        pause: noop,
        resume: noop,
        start: function(){
            qg.startRecord({
                success: function(data){
                    tempFilePath = data.uri
                    onStartHandler()    // @TODO 需要确认微信中这里是否有参数
                },
                fail:noop,
                complete:noop
            })
        },
        stop: function(){
            qg.stopRecord()
            onStopHandler({ tempFilePath }) // duration, fileSize 无法适配
        }
    }
}
wx.createVideo = function() {
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
wx.updateVoIPChatMuteConfig = noop
wx.onVoIPChatSpeakersChanged = noop
wx.onVoIPChatMembersChanged = noop
wx.onVoIPChatInterrupted = noop
wx.joinVoIPChat = noop
wx.exitVoIPChat = noop
wx.getLocation = qg.getLocation // 参数略有差别，但不影响兼容


// 文件
wx.getFileSystemManager = qg.getFileSystemManager = function(){
    return {
        access(data){
            return function(){
                qg.accessFile({ uri: data.path })
                if(typeof data.success === 'function'){
                    data.success()  // @TODO 需要确认微信中这里是否有参数
                }
                if(typeof data.complete === 'function'){
                    data.complete()  // @TODO 需要确认微信中这里是否有参数
                }
            }
        },
        accessSync: function(path){
            return qg.accessFile({ uri: path })
        },
        appendFile(data){
            return qg.appendFile({
                uri: data.filePath,
                text: data.data,
                encoding: data.encoding || 'utf8',
                success: data.success || noop,
                fail: data.fail || noop,
                complete: data.complete || noop
            })
        },
        appendFileSync: async function(filePath, data, encoding){
            return await new Promise(function(resolve,reject){
                qg.appendFile({
                    uri: filePath,
                    text: data,
                    encoding: encoding || 'utf8',
                    success(data){
                        resolve(data)
                    },
                    fail(data){
                        reject(data)
                    }
                })
            })
        },
        copyFile(data){
            return qg.copyFile({
                srcUri: data.srcPath,
                dstUri: data.destPath,
                success: data.success || noop,
                fail: data.fail || noop,
                complete: data.complete || noop
            })
        },
        copyFileSync:async function(srcPath, destPath) {
            return await new Promise(function(resolve,reject){
                qg.copyFile({
                    srcUri: srcPath,
                    dstUri: destPath,
                    success(data){
                        resolve(data)
                    },
                    fail(data){
                        reject(data)
                    }
                })
            })
        },
        getFileInfo(data){
            return qg.getFileInfo({
                uri: data.filePath,
                success: data.success || noop,
                fail: data.fail || noop,
                complete: data.complete || noop
            })
        },
        getSavedFileList(data){
            return qg.listDir({
                uri:"internal://cache/", // @TODO 需要确认这样是否正确
                success: data.success || noop,
                fail: data.fail || noop,
                complete: data.complete || noop
            })
        },
        mkdir(data){
            return qg.mkdir({
                uri: data.dirPath, // @TODO 需要确认这样是否正确 微信支持通过传递recursive来递归创建文件夹，是否需要适配
                success: data.success || noop,
                fail: data.fail || noop,
                complete: data.complete || noop
            })
        },
        mkdirSync:async function(dirPath, recursive) { // @TODO 需要确认这样是否正确 微信支持通过传递recursive来递归创建文件夹，是否需要适配
            return await new Promise(function(resolve,reject){
                qg.mkdir({
                    uri: dirPath,
                    success(data){
                        resolve(data)
                    },
                    fail(data){
                        reject(data)
                    }
                })
            })
        },
        readdir: noop, // vivo暂时不支持readdir
        readdirSync: noop, // vivo暂时不支持readdirSync
        readFile(data){
            return qg.readFile({
                uri: data.filePath, // @TODO 需要确认这样是否正确 微信支持通过传递recursive来递归创建文件夹，是否需要适配
                encoding: data.encoding || 'binary',
                success: data.success || noop,
                fail: data.fail || noop,
                complete: data.complete || noop
            })
        },
        readFileSync:function(filePath, encoding){
            return qg.readFileSync({
                uri: filePath,
                encoding: encoding || 'binary'
            })
        },
        removeSavedFile(data){
            return qg.deleteFile({
                uri: data.filePath,
                success: data.success || noop,
                fail: data.fail || noop,
                complete: data.complete || noop
            })
        },
        rename(data){
            return qg.renameFile({
                srcUri: data.oldPath,
                dstUri: data.newPath,
                success: data.success || noop,
                fail: data.fail || noop,
                complete: data.complete || noop
            })
        },
        renameSync:async function(oldPath, newPath) {
            return await new Promise(function(resolve,reject){
                qg.renameFile({
                    srcUri: oldPath,
                    dstUri: newPath,
                    success(data){
                        resolve(data)
                    },
                    fail(data){
                        reject(data)
                    }
                })
            })
        },
        rmdir(data){
            return qg.rmdir({ // @TODO 需要确认这样是否正确 微信支持通过传递recursive来递归删除文件夹，是否需要适配
                uri: data.dirPath,
                success: data.success || noop,
                fail: data.fail || noop,
                complete: data.complete || noop
            })
        },
        rmdirSync:async function(dirPath, recursive) { // @TODO 需要确认这样是否正确 微信支持通过传递recursive来递归删除文件夹，是否需要适配
            return await new Promise(function(resolve,reject){
                qg.rmdir({
                    uri: dirPath,
                    success(data){
                        resolve(data)
                    },
                    fail(data){
                        reject(data)
                    }
                })
            })
        },
        saveFile(data){
            return qg.moveFile({
                srcUri: data.tempFilePath,
                dstUri: data.filePath,
                success: data.success || noop,
                fail: data.fail || noop,
                complete: data.complete || noop
            })
        },
        saveFileSync:async function(tempFilePath, filePath) {
            return await new Promise(function(resolve,reject){
                qg.moveFile({
                    srcUri: tempFilePath,
                    dstUri: filePath,
                    success(data){
                        resolve(data)
                    },
                    fail(data){
                        reject(data)
                    }
                })
            })
        },
        stat(data){ // @TODO 需要确认这样是否正确 微信支持传递recursive,此时返回有点区别
            const successHandler = data.success;
            const completeHandler = data.complete;
            successHandler && successHandler({
                stats: {
                    isDirectory(){
                        return qg.isDirectory({
                            uri: data.path
                        })
                    },
                    isFile(){
                        return qg.isFile({
                            uri: data.path
                        })
                    }
                }
            })
            completeHandler && completeHandler()
        },
        statSync: function(path, recursive){ // @TODO 需要确认这样是否正确 微信支持传递recursive,此时返回有点区别
            return {
                isDirectory(){
                    return qg.isDirectory({
                        uri: path
                    })
                },
                isFile(){
                    return qg.isFile({
                        uri: path
                    })
                }
            }
        },
        unlink(data){
            return qg.deleteFile({
                uri: data.filePath,
                success: data.success || noop,
                fail: data.fail || noop,
                complete: data.complete || noop
            })
        },
        unlinkSync: async function(filePath) {
            return await new Promise(function(resolve,reject){
                qg.deleteFile({
                    uri: filePath,
                    success(data){
                        resolve(data)
                    },
                    fail(data){
                        reject(data)
                    }
                })
            })
        },
        unzip(data){
            return qg.unzipFile({
                srcUri: data.zipFilePath,
                dstUri: data.targetPath,
                success: data.success || noop,
                fail: data.fail || noop,
                complete: data.complete || noop
            })
        },
        writeFile(data){
            return qg.writeFile({
                uri: data.filePath,
                text: data.data,
                encoding: data.encoding || 'utf8',
                success: data.success || noop,
                fail: data.fail || noop,
                complete: data.complete || noop
            })
        },
        writeFileSync:function(filePath, data, encoding){
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
wx.authorize = function(data){ // 不好适配
    qg.showToast({
        message:"无法自动适配wx.authorize,请使用qg.authorize和qg.getProfile进行适配"
    })
    console.log("无法自动适配wx.authorize,请使用qg.authorize和qg.getProfile进行适配,具体请参考https://minigame.vivo.com.cn/documents/#/api/service/account")
    // return qg.authorize({
    //     type: data.type || "token",
    //     redirectUri: data.redirectUri,
    //     scope: data.scope,
    //     state: data.state,
    //     success: data.success || noop,
    //     fail: data.fail || noop,
    //     complete: data.complete || noop
    // })
}
wx.getUserInfo = function(data){ // 不好适配
    qg.showToast({
        message:"无法自动适配wx.getUserInfo,请使用qg.getProfile进行适配"
    })
    console.log("无法自动适配wx.createUserInfoButton,请使用qg.authorize和qg.getProfile进行适配,具体请参考https://minigame.vivo.com.cn/documents/#/api/service/account")    // console.log("获取用户信息请手动适配")
    // return qg.getProfile({
    //     token: data.token,
    //     success: data.success || noop,
    //     fail: data.fail || noop,
    //     complete: data.complete || noop
    // })
}

wx.createUserInfoButton = function(){
    qg.showToast({
        message:"无法自动适配wx.createUserInfoButton,请使用qg.authorize和qg.getProfile进行适配"
    })
    console.log("无法自动适配wx.createUserInfoButton,请使用qg.authorize和qg.getProfile进行适配,具体请参考https://minigame.vivo.com.cn/documents/#/api/service/account")
    return {
        destroy(){},
        hide(){},
        offTap(){},
        onTap(){},
        show(){}
    }
}
wx.checkSession = noop
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
let oldDrawImage = null
let oldFill = null
let oldFillRect = null
let oldFillText = null
let oldStroke = null
let oldStrokeRect = null
const canvas = window.mainCanvas || qg.createCanvas()
const ctx = canvas.getContext('2d')
let info = qg.getSystemInfoSync()
const {screenWidth,screenHeight} = info
// ctx.scale(screenWidth/375, screenHeight/667)
const oldGetContext = canvas.getContext;
canvas.getContext = function(arg) {
  if(arg === '2d') {
    return ctx
  }
  else{
    return oldGetContext(arg)
  }
}

function renderHandler() {
  renderTexCanvas();
  requestAnimationFrame(renderHandler);
}

if(!oldDrawImage) {
  if(oldDrawImage = ctx.drawImage) {
    ctx.constructor.prototype.drawImage = function(...args) {
      // if(6 === args.length){
      //   if(args[5] === 'fitScreen'){
      //     if(args[3] == screenWidth){
      //       args[3] = 375
      //     }
      //     if(args[4] == screenHeight){
      //       args[4] = 667
      //     }
      //     args.pop()
      //   }
      // }
      // else if(10 === args.length){
      //   if(args[9] === 'fitScreen'){
      //     console.log(args[7])
      //     if(args[7] == screenWidth){
      //       args[7] = 375
      //     }
      //     if(args[8] == screenHeight){
      //       args[8] = 667
      //     }
      //     args.pop()
      //   }
      // }
      oldDrawImage.call(ctx,...args)
      setTextureCanvas(canvas);
      // renderTexCanvas();
    }
  }
}
if(!oldFill) {
  if(oldFill = ctx.fill) {
    ctx.constructor.prototype.fill = function(...args) {
      oldFill.call(ctx,...args)
      setTextureCanvas(canvas);
      // renderHandler()
    }
  }
}
if(!oldFillRect) {
  if(oldFillRect = ctx.fillRect) {
    ctx.constructor.prototype.fillRect = function(...args) {
      oldFillRect.call(ctx,...args)
      setTextureCanvas(canvas);
      // renderHandler()
    }
  }
}
if(!oldFillText) {
  if(oldFillText = ctx.fillText) {
    ctx.constructor.prototype.fillText = function(...args) {
      oldFillText.call(ctx,...args)
      setTextureCanvas(canvas);
      // renderHandler()
    }
  }
}

if(!oldStroke) {
  if(oldStroke = ctx.stroke) {
    ctx.constructor.prototype.stroke = function(...args) {
      oldStroke.call(ctx,...args)
      setTextureCanvas(canvas);
      // renderHandler()
    }
  }
}

if(!oldStrokeRect) {
  if(oldStrokeRect = ctx.strokeRect) {
    ctx.constructor.prototype.strokeRect = function(...args) {
      oldStrokeRect.call(ctx,...args)
      setTextureCanvas(canvas);
      // renderHandler()
    }
  }
}

canvas.getBoundingClientRect = function() {
  const ret = {
    top: 0,
    left: 0,
    width: window.innerWidth,
    height: window.innerHeight
  }
  return ret
}

initTexCanvas(canvas);
renderHandler()
module.exports = {
  initTexCanvas,
  setTextureCanvas,
  renderTexCanvas,
  canvas
}
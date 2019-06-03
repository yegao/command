import WebGLUtils from './webgl-utils'
import WebGLDebugUtils from './webgl-debug'
import { initShaders } from './cuon-utils'
import * as CuonMatrix from './cuon-matrix'

// 顶点着色器源码
var verture_shader_source =
'attribute vec4 a_Position;\n' +
'attribute vec2 a_TextureCoord;\n' +
'varying vec2 v_TextureCoord;\n' +
'void main() {\n' +
'  gl_Position = a_Position;\n' +
'  v_TextureCoord = a_TextureCoord;\n' +
'}\n';

var fragment_shader_source =
'precision lowp float;\n' +
'uniform sampler2D u_Sampler;\n' +
'varying vec2 v_TextureCoord;\n' +
'void main() {\n' +
'  gl_FragColor = texture2D(u_Sampler, v_TextureCoord);\n' +
'}\n';

var vertexTexCoordBuffer = __gl.createBuffer();

export const drawImage = function (img, sx, sy, swidth, sheight, x, y, width, height ) {
    // var VERTICESTEXCOORDS = new Float32Array([ // 顶点坐标和纹理坐标 
    //     -1, 1, 0.0, 1.0,
    //     -1, -1, 0.0, 0.0,
    //     1, 1, 1.0, 1.0,
    //     1, -1, 1.0, 0.0,
    // ]);
    var VERTICESTEXCOORDS = new Float32Array([ // 顶点坐标和纹理坐标 
        -1, 1, x/width, (y+sheight)/height,
        -1, -1, x/width, y/height,
        1, 1, (x+swidth)/width, (y+sheight)/height,                                                                                                                                                                                               
        1, -1, (x+swidth)/width, y/height,
    ]);
    var FSIZE = VERTICESTEXCOORDS.BYTES_PER_ELEMENT;

    if(!initShaders(__gl, verture_shader_source, fragment_shader_source)){
        throw new Error('初始化着色器失败')
    }
    __gl.bindBuffer(__gl.ARRAY_BUFFER, vertexTexCoordBuffer);
    __gl.bufferData(__gl.ARRAY_BUFFER, VERTICESTEXCOORDS, __gl.STATIC_DRAW);
    var a_Position = __gl.getAttribLocation(__gl.program, 'a_Position');
    __gl.vertexAttribPointer(a_Position, 2, __gl.FLOAT, false, FSIZE * 4, 0);
    __gl.enableVertexAttribArray(a_Position);
    var a_TextureCoord = __gl.getAttribLocation(__gl.program, 'a_TextureCoord');
    __gl.vertexAttribPointer(a_TextureCoord, 2, __gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    __gl.enableVertexAttribArray(a_TextureCoord);
    var texture = __gl.createTexture(); 
    __gl.clearColor(0.0, 0.0, 0.0, 1.0);
    var u_Sampler = __gl.getUniformLocation(__gl.program, 'u_Sampler');
    __gl.activeTexture(__gl.TEXTURE0);
    __gl.bindTexture(__gl.TEXTURE_2D, texture);
    __gl.texParameteri(__gl.TEXTURE_2D, __gl.TEXTURE_MIN_FILTER, __gl.LINEAR);
    __gl.texImage2D(__gl.TEXTURE_2D, 0, __gl.RGB, __gl.RGB, __gl.UNSIGNED_BYTE, img);
    __gl.uniform1i(u_Sampler, 0);
    __gl.clear(__gl.COLOR_BUFFER_BIT);
    __gl.drawArrays(__gl.TRIANGLE_STRIP, 0, 4);
}

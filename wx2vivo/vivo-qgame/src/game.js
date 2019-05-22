require('./libs/weapp-adapter')
const Main = require('./js/main').default
new Main()

// var _requestAnimationID = 0
// require('./libs/weapp-adapter')
// const screenWidth  = window.innerWidth
// const screenHeight = window.innerHeight
// drawImage();
// function updateHandler() {
//     window.renderTexCanvas();
//     window.requestAnimationFrame(updateHandler);
// }

// function drawImage() {
//     var image = new Image();
//     image.src = './resource/images/bg.jpg'
//     let ctx = canvas.getContext('2d');
//     image.onload = function(){
//         console.log(screenWidth,screenHeight)
//         // console.log(image._data)
//         ctx.drawImage(
//             image,
//             0,
//             0,
//             520,
//             520,
//             0,
//             -screenHeight,
//             screenWidth,
//             screenHeight
//           )
//           ctx.drawImage(
//             image,
//             0,
//             0,
//             520,
//             520,
//             0,
//             0,
//             screenWidth,
//             screenHeight
//           )
//     }
//     _requestAnimationID = window.requestAnimationFrame(updateHandler);
// }
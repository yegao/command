const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
webpack({
    mode:"development",
    entry: path.join(__dirname, '../src/index'),
    output: {
        path: path.join(__dirname, '../dist'),
        filename: 'weapp-adapter.js',
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: 'babel-loader'
        }]
    }
},function(err,data){
    if(err){
        throw new Error(err)
    }
    fs.access(path.join(__dirname, '../../vivo-qgame/engine'), fs.constants.F_OK, function(err){
        if (err) {
            fs.mkdirSync(path.join(__dirname, '../../engine'))
            fs.copyFileSync(path.join(__dirname, '../dist/weapp-adapter.js'), path.join(__dirname, '../../engine/weapp-adapter.js'))
        }
        else {
            fs.copyFileSync(path.join(__dirname, '../dist/weapp-adapter.js'), path.join(__dirname, '../../vivo-qgame/engine/weapp-adapter.js'))
        }
    })
    fs.access(path.join(__dirname, '../../vivo-qgame/src/libs'), fs.constants.F_OK, function(err){
        if (err) {
            fs.mkdirSync(path.join(__dirname, '../../vivo-qgame/src/libs'))
            fs.copyFileSync(path.join(__dirname, '../dist/weapp-adapter.js'), path.join(__dirname, '../../vivo-qgame/src/libs/weapp-adapter.js'))
        }
        else {
            fs.copyFileSync(path.join(__dirname, '../dist/weapp-adapter.js'), path.join(__dirname, '../../vivo-qgame/src/libs/weapp-adapter.js'))
        }
    })
})
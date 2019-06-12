const path = require('path')

module.exports = {
    entry: path.join(__dirname, 'src/index'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'qgame-adapter.js',
    },
    module: {
        rules: [
            {
                test: /\.js/,
                use: ['babel-loader'],
                exclude: function (path) {
                    return /node_modules/.test(path)
                }
            }
        ]
    }
}

// const presets = [
//   [
//     '@babel/preset-env'
//   ]
// ]

// const plugins = [ "@babel/plugin-proposal-export-default-from", "@babel/plugin-proposal-class-properties"]
// module.exports = { presets , plugins}
const presets = [
  [
    '@babel/env'
  ]
]

const plugins = ["@babel/plugin-proposal-export-default-from", "@babel/plugin-proposal-class-properties"]

module.exports = { presets , plugins}

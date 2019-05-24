const {mkdirsSync, copyDir, clearDirSync } = require('./utils')
const path = require('path')
const fs = require('fs-extra')
const child_process = require('child_process')

const weixinPath = path.join(__dirname,"..","weixingame")
const qgamePath = path.join(__dirname,"..",'vivo-qgame')
const demoPath = path.join(__dirname,'template/app/demo')
const wxConfigPath = path.join(weixinPath, 'project.config.json')
const wxGameJsonPath = path.join(weixinPath, 'game.json')
const packageJsonPath = path.join(qgamePath,'package.json')
console.log(`工程根目录是${weixinPath}`)

function main () {
  console.log('weixin')
  // 清空vivo-qgame文件夹
  child_process.execSync(`rm -rf ${qgamePath}`)
  child_process.execSync(`mkdir ${qgamePath}`)
  // step1: 拷贝模板到vivo-qgame
  copyDir(demoPath, qgamePath)
  // step2: 拷贝微信小游戏的工程到src目录下
  child_process.execSync(`cp -Rf ${weixinPath}/ ${path.join(qgamePath,'src')}`)
  // step3: 获取微信小游戏的project.config.json
  const wxProjectConfig = getWxProjectConfig()
  // step4: 获取微信小游戏的game.json
  const wxGameJson = getWxGameJson()
  // step5: 转成vivo小游戏的manifest.json
  const manifest = createManifest()
  // step6: 读取模板里面的package.json
  const packageJson = getGamePackageJson()
  // step7: 修改package.json
  if(packageJson.name === '{{appName}}') {
    packageJson.name = wxProjectConfig.projectname
  }
  if(wxGameJson.deviceOrientation) {
    packageJson.deviceOrientation = wxGameJson.deviceOrientation
  }
  fs.writeFileSync(packageJsonPath,JSON.stringify(packageJson))
  // step8: 

  // step9: 

  // console.log(manifest)
  // fs.writeFileSync(path.join(qgamePath,'src/manifest.json'),manifest)
}
// const weixinPath = path.resolve(process.cwd(),"..","wx2vivo")
function getWxProjectConfig () {
  const wxConfig = fs.readFileSync(wxConfigPath)
  return JSON.parse(wxConfig) || {}
}

function getWxGameJson () {
  const wxGameJson = fs.readFileSync(wxGameJsonPath)
  return JSON.parse(wxGameJson) || {}
}

function getGamePackageJson () {
  const packageJson = fs.readFileSync(packageJsonPath)
  return JSON.parse(packageJson) || {}
}

function createManifest () {
  const gameConfigPath = path.join(weixinPath, 'game.json')
  console.log(`game.json所在路径是${gameConfigPath}`)
  const gameConfig = fs.readFileSync(gameConfigPath)
  return JSON.stringify(Object.assign({}, JSON.parse(gameConfig)))
}

main()
// module.exports = main

/* 微信 project.config.json
{
  'description': '项目配置文件。',
  'setting': {
    'urlCheck': false,
    'es6': true,
    'postcss': true,
    'minified': true,
    'newFeature': true
  },
  'compileType': 'game',
  'libVersion': '1.9.94',
  'appid': 'wxd0b17c55c29c67a2',
  'projectname': 'wxgame',
  'condition': {
    'search': {
      'current': -1,
      'list': []
    },
    'conversation': {
      'current': -1,
      'list': []
    },
    'game': {
      'currentL': -1,
      'list': []
    },
    'miniprogram': {
      'current': -1,
      'list': []
    }
  }
}
*/

/* 微信 game.json
{
  "deviceOrientation": "portrait"
}
*/

/* vivo manifest.json
{
  'package': 'com.jovidemo.vivo',
  'name': 'jovidemo',
  'icon': '/image/logo.png',
  'versionName': '1.0.0',
  'versionCode': '1',
  'minPlatformVersion': '1020',
  'deviceOrientation': 'landscape',
  'type': 'game',
  'config': {
    'logLevel': 'log'
  },
  'display': {
  }
}
*/

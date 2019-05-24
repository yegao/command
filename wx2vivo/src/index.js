const { mkdirsSync, copyDir, clearDirSync, replaceFiles } = require('./utils')
const path = require('path')
const fs = require('fs-extra')
const child_process = require('child_process')


const console = require('better-console')
const program = require('commander')
const chalk = require('chalk')
const getLatestVersion = require('latest-version')
// const fs = require('fs')
// const path = require('path')

async function init () {
  const packageContent = fs.readFileSync(path.join(__dirname, '../package.json'))
  const packageJson = JSON.parse(packageContent)
  const currentVersion = packageJson.version
  const latestVersion = await getLatestVersion('qgame-toolkit')

  if (currentVersion !== latestVersion) {
    console.warn(`the latest version of qgame-toolkit is ${latestVersion}, suggest you upgrade qgame-toolkit with ${chalk.green(`\`npm install -g qgame-toolkit@${latestVersion}\``)}`)
  }

  // program
  //   .command('weixin')
  //   .description('h5 game developed by weixin transform to vivo mini game')
  //   .action((wexinGamePath, cmd) => {
  //     main(wexinGamePath, currentVersion)
  //   })
  main(null, currentVersion)
}

init()


function main (wexinGamePath, currentVersion) {
  const vivoGameName = 'vivo-qgame'
  const cwd = process.cwd()
  const wxGamePath = wexinGamePath || cwd
  console.log(`工程根目录是${wxGamePath}`)
  const vivoGamePath = path.join(wxGamePath, '..', vivoGameName)
  const vivoGameEntry = path.join(vivoGamePath,'src/game.js')
  const vivoGameEnginePath = path.join(vivoGamePath, 'engine')
  const vivoGamePackageJsonPath = path.join(vivoGamePath, 'package.json')
  const vivoGameManifestJsonPath = path.join(vivoGamePath,'src/manifest.json')
  const processAppDemoPath = path.join(__dirname, './template/app/demo')
  const processAppConfigPath = path.join(__dirname, './template/app/config')
  const processWeixinPath = path.join(__dirname, './template/weixin')

  const wxProjectConfigJsonPath = path.join(wxGamePath, 'project.config.json')
  const wxGameJsonPath = path.join(wxGamePath, 'game.json')
  // 清空vivo-qgame文件夹
  console.log('正在清空原来的vivo-qgame目录')
  clearDirSync(vivoGamePath)
  mkdirsSync(vivoGameEnginePath)
  // step1: 拷贝模板到vivo-qgame
  console.log('正在拷贝模板到vivo-qgame目录')
  copyDir(processAppDemoPath, vivoGamePath)
  copyDir(processAppConfigPath, path.join(vivoGamePath,'config'))
  // step2: 替换字符串
  console.log('正在替换版本号和游戏名')
  const files = ['src/manifest.json', 'package.json'].map(f => {
    return path.join(vivoGamePath, f)
  })
  const replaceNames = {
    'appName': vivoGameName,
    'toolkitVersion': currentVersion
  }
  replaceFiles(replaceNames, files)
  // step3: 拷贝微信小游戏的工程到src目录下
  console.log('正在拷贝微信小游戏')
  child_process.execSync(`cp -Rf ${wxGamePath}/ ${path.join(vivoGamePath, 'src')}`)
  // step4: 获取微信小游戏的project.config.json
  // console.log(`正在解析微信小游戏的${wxProjectConfigJsonPath}`)
  // const wxProjectConfigJson = getAndParse(wxProjectConfigJsonPath)
  // step5: 获取微信小游戏的game.json
  console.log(`正在解析微信小游戏的${wxGameJsonPath}`)
  const wxGameJson = getAndParse(wxGameJsonPath)
  // step6: 转成vivo小游戏的manifest.json
  console.log(`正在解析vivo小游戏的${vivoGameManifestJsonPath}`)
  const manifestJson = getAndParse(vivoGameManifestJsonPath)
  // step7: 同步屏幕方向
  console.log(`正在同步屏幕方向`)
  if (wxGameJson.deviceOrientation) {
    manifestJson.deviceOrientation = wxGameJson.deviceOrientation
  }
  // step8: 读取模板里面的package.json
  console.log(`正在修正vivo小游戏的${vivoGameManifestJsonPath}`)
  fs.writeFileSync(vivoGameManifestJsonPath, JSON.stringify(manifestJson,' ', 2))
  // step9: 将weapp-adapter.js适配到指定目录
  child_process.execSync(`cp -rp ${processWeixinPath} ${vivoGameEnginePath}`)
  // step10: 修改 webpack.config.js 里的externals
  const externalsConfig = {
    'weapp-adapter.js': 'commonjs ./weapp-adapter.js'
  }
  const webpackConfPath = path.join(vivoGamePath, 'config/webpack.config.js')
  const webpackConfigContent = fs.readFileSync(webpackConfPath, 'utf8').replace('EXTERNALS_PLACE_HOLDER', JSON.stringify(externalsConfig))
  fs.writeFileSync(webpackConfPath, webpackConfigContent, 'utf8')
  // step11: 改写game.js
  const originGameContent = fs.readFileSync(vivoGameEntry)
  fs.writeFileSync(vivoGameEntry, `import 'weapp-adapter.js'\n${originGameContent}`, 'utf8')

}
// const wxGamePath = path.resolve(process.cwd(),"..","wx2vivo")
function getAndParse (jsonPath) {
  const json = fs.readFileSync(jsonPath)
  return JSON.parse(json) || {}
}

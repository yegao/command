const { mkdirsSync, copyDir, clearDirSync } = require('./utils')
const path = require('path')
const fs = require('fs-extra')
const child_process = require('child_process')



function main (wexinGamePath) {
  const vivoGameName = 'vivo-qgame'
  const cwd = child_process.cwd()
  const wxGamePath = wexinGamePath || cwd
  console.log(`工程根目录是${wxGamePath}`)
  const vivoGamePath = path.join(wxGamePath, '..', vivoGameName)
  const vivoGamePackageJsonPath = path.join(vivoGamePath, 'package.json')
  const vivoGameTemplatesPath = path.join(__dirname, './../templates/app/demo')
  const wxProjectConfigJsonPath = path.join(wxGamePath, 'project.config.json')
  const wxGameJsonPath = path.join(wxGamePath, 'game.json')
  console.log('weixin')
  // 清空vivo-qgame文件夹
  child_process.execSync(`rm -rf ${vivoGamePath}`)
  child_process.execSync(`mkdir ${vivoGamePath}`)
  // step1: 拷贝模板到vivo-qgame
  copyDir(vivoGameTemplatesPath, vivoGamePath)
  // step2: 替换字符串
  const files = ['src/manifest.json', 'package.json'].map(f => {
    return path.join(vivoGamePath, f)
  })
  const replaceNames = {
    'appName': vivoGameName,
    'toolkitVersion': currentVersion
  }
  replaceFiles(replaceNames, files)
  // step3: 拷贝微信小游戏的工程到src目录下
  child_process.execSync(`cp -Rf ${wxGamePath}/ ${path.join(vivoGamePath, 'src')}`)
  // step4: 获取微信小游戏的project.config.json
  const wxProjectConfigJson = getWxProjectConfig(wxProjectConfigJsonPath)
  // step5: 获取微信小游戏的game.json
  const wxGameJson = getWxGameJson(wxGameJsonPath)
  // step6: 转成vivo小游戏的manifest.json
  const manifest = createManifest(wxGameJsonPath)
  // step7: 同步屏幕方向
  if (wxGameJson.deviceOrientation) {
    manifest.deviceOrientation = wxGameJson.deviceOrientation
  }
  // step7: 读取模板里面的package.json
  const vivoGamePackageJson = getGamePackageJson(vivoGamePackageJsonPath)

  fs.writeFileSync(vivoGamePackageJsonPath, JSON.stringify(vivoGamePackageJson))
  // step9:
  // console.log(manifest)
  // fs.writeFileSync(path.join(vivoGamePath,'src/manifest.json'),manifest)
}
// const wxGamePath = path.resolve(process.cwd(),"..","wx2vivo")
function getWxProjectConfig (wxProjectConfigJsonPath) {
  const json = fs.readFileSync(wxProjectConfigJsonPath)
  return JSON.parse(json) || {}
}

function getWxGameJson (wxGameJsonPath) {
  const json = fs.readFileSync(wxGameJsonPath)
  return JSON.parse(json) || {}
}

function getGamePackageJson (vivoGamePackageJsonPath) {
  const json = fs.readFileSync(vivoGamePackageJsonPath)
  return JSON.parse(json) || {}
}

function createManifest (wxGameJsonPath) {
  console.log(`game.json所在路径是${wxGameJsonPath}`)
  const json = fs.readFileSync(wxGameJsonPath)
  return JSON.stringify(Object.assign({}, JSON.parse(json)))
}

main()

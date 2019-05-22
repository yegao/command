/*
 * Copyright (C) 2017, hapjs.org. All rights reserved.
 */

const fs = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')
/**
 * 递归创建目录 同步方法
 * @param dir
 * @returns {boolean}
 */
function mkdirsSync (dir) {
  if (fs.existsSync(dir)) {
    return true
  }
  else {
    if (mkdirsSync(path.dirname(dir))) {
      fs.mkdirSync(dir)
      return true
    }
  }
}

/**
 * 执行命令
 * @param cmd
 */
function commandRun (command, flag = true) {
  const args = process.argv.slice(4).join(' ')
  const cmd = flag ? `${command} ${args}` : `${command}`
  try {
    execSync(cmd, { stdio: 'inherit' })
  }
  catch (err) {
    console.error(`${err.message}`)
  }
}

/**
 * 将路径进行转化
 * @param str
 */
function normalise (str) {
  const paths = str.split('/')
  return path.resolve(...paths)
}

/**
 * 获取cmd
 * @param cmd
 */
function getCmd (cmd) {
  return path.resolve('./node_modules', '.bin', cmd)
}

/**
 * 遍历目录文件 同步方法
 * @param dir
 * @param files 收集的文件列表
 */
function traverseDirSync (dir, files) {
  const list = fs.readdirSync(dir)
  list.forEach(function (file) {
    file = path.join(dir, file)
    const stat = fs.statSync(file)
    if (stat && stat.isDirectory()) {
      traverseDirSync(file, files)
    }
    else {
      files.push(file)
    }
  })
}

/**
 * 删除目录
 * @param dir
 */
function clearDirSync (dir) {
  let files = []
  if (fs.existsSync(dir)) {
    files = fs.readdirSync(dir)
    files.forEach(function (file, index) {
      const curPath = dir + '/' + file
      if (fs.statSync(curPath).isDirectory()) {
        clearDirSync(curPath)
      }
      else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(dir)
  }
}

/**
 * 接受用户指定的输出时间戳格式，输出时间时间戳
 * usage sample:
 *     formatDate('yyyy年MM月dd日', new Date() );
 *     formatDate('yyyy-MM-dd hh:mm:ss', new Date() );
 *     formatDate('这是自定义的yyyy年, 自定义的MM月', new Date())
 *
 * @param {[type]} format 用户指定的时间戳格式, 见上面示例;
 * @param {[type]} date   Date实例
 */
function formatDate (format, date) {
  let result = format
  let year, month, day
  let hour, min, sec

  if (format.indexOf('yyyy') >= 0 || format.indexOf('YYYYY') >= 0) {
    year = date.getFullYear()
    result = result.replace(/[yY]{4}/g, year)
  }

  if (format.indexOf('MM') >= 0) {
    month = date.getMonth() + 1
    result = result.replace(/MM/g, String(month).length < 2 ? '0' + month : month)
  }

  if (format.indexOf('dd') >= 0) {
    (day = date.getDate(), result = result.replace(/dd/g, String(day).length < 2 ? '0' + day : day))
  }

  if (format.indexOf('hh') >= 0 || format.indexOf('HH') >= 0) {
    hour = date.getHours()
    result = result.replace(/[hH]{2}/g, String(hour).length < 2 ? '0' + hour : hour)
  }

  if (format.indexOf('mm') >= 0) {
    min = date.getMinutes()
    result = result.replace(/mm/g, String(min).length < 2 ? '0' + min : min)
  }

  if (format.indexOf('ss') >= 0 || format.indexOf('SS') >= 0) {
    sec = date.getSeconds()
    result = result.replace(/[sS]{2}/g, String(sec).length < 2 ? '0' + sec : sec)
  }

  return result
}

/**
 * 拷贝目录
 * @param src 源目录
 * @param dist 目的目录
 * @param filterFiles 不需要拷贝的文件数组
 * @param isDelDir 如果dist已存在，是否删除
 */
function copyDir (src, dist, filterFiles = [], isDelDir = true) {
  if (isDelDir) {
    clearDirSync(dist)
  }
  if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist)
  }
  if (!fs.existsSync(src)) {
    return
  }
  const paths = fs.readdirSync(src)
  paths.forEach(function (item) {
    const _src = path.join(src, item)
    const _dist = path.join(dist, item)
    const stat = fs.statSync(_src)
    // 判断是文件还是目录
    if (stat.isFile()) {
      if (filterFiles && filterFiles.indexOf(_src) !== -1) {
        return
      }
      fs.writeFileSync(_dist, fs.readFileSync(_src))
    }
    else if (stat.isDirectory()) {
      // 当是目录是，递归复制
      copyDir(_src, _dist, filterFiles, true)
    }
  })
}

module.exports =  {
  mkdirsSync,
  copyDir,
  clearDirSync
}
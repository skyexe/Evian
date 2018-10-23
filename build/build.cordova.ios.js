// https://github.com/shelljs/shelljs
require('./check-versions')()

process.env.NODE_ENV = 'production'

var ora = require('ora')
var path = require('path')
var chalk = require('chalk')
var shell = require('shelljs')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.cordova.conf')
var fs = require('fs');

var spinner = ora('building for production...')
spinner.start();

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
shell.rm('-rf', assetsPath)
shell.mkdir('-p', assetsPath)
shell.config.silent = true
shell.cp('-R', 'static/*', assetsPath)
shell.mv('-n', assetsPath + '/platform_www_ios', assetsPath + '/platform')
shell.rm('-rf', assetsPath + '/platform_android')
shell.rm('-rf', assetsPath + '/platform_www_browser')
shell.config.silent = false

webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n')
  // 自动生成版本号
  var versionPath = path.resolve('./version.json');
  var content = fs.readFileSync(versionPath, 'UTF-8');
  fs.writeFileSync(`${path.join(config.build.assetsRoot, config.build.assetsPublicPath)}/version.json`, content);
  content = JSON.parse(content);
  console.log(chalk.cyan('  Build complete.\n'))
  console.log(chalk.yellow(`  提醒是否更新程序版本号，目前版本号为: ${content.version}\n`));
})

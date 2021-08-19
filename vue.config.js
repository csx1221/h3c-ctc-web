/**
 * 配置参考: https://cli.vuejs.org/zh/config/
 */
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, '.', dir)
}
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  chainWebpack: config => {
    // const svgRule = config.module.rule('svg')
    // svgRule.uses.clear()
    // svgRule.exclude.add(resolve('src/assets/icon'))
    // svgRule
    //   .test(/\.svg$/)
    //   .use('svg-sprite-loader')
    //   .loader('svg-sprite-loader')

    config.module.rule('svg').exclude.add(resolve('src/icons')).end()

    config.module.rule('icons').test(/\.svg$/).include.add(resolve('src/icons')).end().use('svg-sprite-loader').loader('svg-sprite-loader').options({
      symbolId: 'icon-[name]'
    })
  },
  // 默认打开eslint效验，如果需要关闭，设置成false即可
  lintOnSave: true,
  productionSourceMap: false,
  devServer: {
    open: true,
    port: 4000,
    overlay: {
      errors: true,
      warnings: true
    }
  }
}

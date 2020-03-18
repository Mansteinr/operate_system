const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
  // return path.join(__dirname, '..', dir)
}

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    }
  },
  devServer: {
    port: 80
  },
  chainWebpack:(config)=>{
    //set第一个参数：设置的别名，第二个参数：设置的路径
    config.resolve.alias
      .set('@', resolve('src'))
      .set('components',resolve('./src/components'))
      .set('images',resolve('./src/common/images'))
    }
}
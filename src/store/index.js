// 这是根Store
import Vue from 'vue'
import Vuex from 'vuex'
// 基础性
import basics from '@/common/store'
// queryIndex
import queryIndex from '@/pages/query-index/store'
// 一键登陆
import lightSignIn from '@/pages/app/store'
// 用量统计
import usageStatistics from '@/pages/usage-statistics/store'
// 运维工具
import tools from '@/pages/operation-tools/store'

import createLogger from 'vuex/dist/logger' // 通过mutations修改state的时候 在控制台打印相关的修改记录

Vue.use(Vuex) // 注册vuex插件

// debug调试工具， NODE_ENV在调用webpack编译的时候 如果运行npm run dev则是dev环境
const debug = process.env.NODE_ENV !== 'prod'

export default new Vuex.Store({ // 导出Store的实例
  modules: {
    tools,
    basics,
    queryIndex,
    lightSignIn,
    usageStatistics
  },
  strict: false, // 开启严格模式 可以帮助检测state的修改，是不是通过mutations去修改，否则会报错 开启时候性能会损耗，所以线上不建议使用
  plugins: debug ? [createLogger()] : []
})

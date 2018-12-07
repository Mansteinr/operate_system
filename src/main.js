import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
// import moment from 'moment'
import VueI18n from 'vue-i18n'
import API from './config/api'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import '@/common/css/index.styl'
import router from './router/index'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueI18n) // 通过插件的形式挂载
const i18n = new VueI18n({
  locale: 'zh-CN', // 语言标识 //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    'zh-CN': require('./common/lang/zh'), // 中文语言包
    'en-US': require('./common/lang/en') // 英文语言包
  }
})
Vue.prototype.API = API
router.beforeEach((to, from, next) => {
  let path = to.path
  let login = localStorage.getItem('mtk')
  if (path === '/Login') {
    next()
    return
  }
  if (login) {
    if (path === '/') {
      next({
        name: 'query-index'
      })
    } else {
      next()
    }
  } else {
    next({
      path: '/Login'
    })
  }
})

new Vue({
  el: '#app',
  router,  // 注入到根实例中
  i18n,
  store,
  render: h => h(App)
})

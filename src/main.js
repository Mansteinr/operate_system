import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
// import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'
import '@/common/css/index.styl'
import router from './router/index'
// import axios from 'axios'
// import $http from './common/js/api'
Vue.config.productionTip = false
// Vue.use(axios)
// Vue.prototype.$axios = axios
Vue.use(ElementUI)

// test
// console.log(axios)
// axios.interceptors.response.use(
//   response => {
//     console.log(router, 'response')
//   },
//   error => {
//     console.log(router, 'response')
//     // console.log(error)
//   })

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
        path: '/QueryIndex'
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
  render: h => h(App)
})

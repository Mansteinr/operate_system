import Vue from 'vue'
import Router from 'vue-router'
import QueryIndex from '../components/QueryIndex'
import ServiceAnalysis from '../components/ServiceAnalysis'
import SupplierAnalysis from '../components/SupplierAnalysis'
import SensitiveWord from '../components/SensitiveWord'
import QueryLog from '../components/QueryLog'
import Login from '../components/Login'
import QualityAnalysis from '../components/QualityAnalysis'
import Main from '../components/Main'

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    name: 'Main',
    component: Main,
    children: [{
      path: '/QueryIndex',
      name: 'QueryIndex',
      component: QueryIndex
    }, {
      path: '/ServiceAnalysis',
      name: 'ServiceAnalysis',
      component: ServiceAnalysis
    }, {
      path: '/SensitiveWord',
      name: 'SensitiveWord',
      component: SensitiveWord
    }, {
      path: '/SupplierAnalysis',
      name: 'SupplierAnalysis',
      component: SupplierAnalysis
    }, {
      path: '/QueryLog',
      name: 'QueryLog',
      component: QueryLog
    }, {
      path: '/QualityAnalysis',
      name: 'QualityAnalysis',
      component: QualityAnalysis
    }]
  }, {
    path: '/Login',
    name: 'Login',
    component: Login
  }]
})

export default router
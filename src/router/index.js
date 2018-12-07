import Vue from 'vue'
import Router from 'vue-router'
import QueryIndex from '../components/query-index'
import QueryUsage from '../components/usage-statistics/query_usage'
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
      name: 'query-index',
      component: QueryIndex
    }, {
      path: '/QueryUsage',
      name: 'query_usage',
      component: QueryUsage
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
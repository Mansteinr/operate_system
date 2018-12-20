import Vue from 'vue'
import Router from 'vue-router'
import QueryIndex from '../components/query-index'
import QueryUsage from '../components/usage-statistics/query_usage'
import SupplierAnalysis from '../components/SupplierAnalysis'
import upstreamSupplier from '../components/usage-statistics/upper-service/upstream_supplier'
import upstreamCustomer from '../components/usage-statistics/upper-service/upstream_customer'
import upstreamService from '../components/usage-statistics/upper-service/upstream_service'
import QueryLog from '../components/QueryLog'
import Login from '../components/Login'
import Demo from '../components/demo'
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
      path: '/upstreamSupplier',
      name: 'query_upstream_supplier',
      component: upstreamSupplier
    }, {
      path: '/upstreamCustomer',
      name: 'query_upstream_customer',
      component: upstreamCustomer
    }, {
      path: '/upstreamService',
      name: 'query_upstream_service',
      component: upstreamService
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
    }, {
      path: '/Demo',
      name: 'Demo',
      component: Demo
    }]
  }, {
    path: '/Login',
    name: 'Login',
    component: Login
  }]
})

export default router
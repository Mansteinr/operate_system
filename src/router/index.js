import Vue from 'vue'
import Router from 'vue-router'
import QueryIndex from '../components/query-index'
import QueryUsage from '../components/usage-statistics/query_usage'
import SupplierAnalysis from '../components/SupplierAnalysis'
import upstreamSupplier from '../components/usage-statistics/upper-service/upstream_supplier'
import upstreamCustomer from '../components/usage-statistics/upper-service/upstream_customer'
import upstreamService from '../components/usage-statistics/upper-service/upstream_service'
import upstreamServiceByData from '../components/usage-statistics/upper-service/upstream_serviceByData'
import downstreamCustomer from '../components/usage-statistics/down-service/downstream_customer'
import downstreamService from '../components/usage-statistics/down-service/downstream_service'
import QueryLog from '../components/operation-tools/query-logs'
import queryQuality from '../components/operation-tools/query_quality'
import queryGuid from '../components/operation-tools/query-guid'
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
      path: '/upstreamServiceByData',
      name: 'query_upstream_serviceByData',
      component: upstreamServiceByData
    }, {
      path: '/downstreamCustomer',
      name: 'query_downstream_customer',
      component: downstreamCustomer
    }, {
      path: '/downstreamService',
      name: 'query_downstream_service',
      component: downstreamService
    }, {
      path: '/QueryLog',
      name: 'query_logs',
      component: QueryLog
    }, {
      path: '/queryQuality',
      name: 'query_quality',
      component: queryQuality
    },{
      path: '/queryGuid',
      name: 'query_guid',
      component: queryGuid
    }, {
      path: '/SupplierAnalysis',
      name: 'SupplierAnalysis',
      component: SupplierAnalysis
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
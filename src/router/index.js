import Vue from 'vue'
import Router from 'vue-router'
import QueryIndex from '../components/query-index'
import QueryUsage from '../components/usage-statistics/query_usage'
import upstreamSupplier from '../components/usage-statistics/upper-service/upstream_supplier'
import upstreamCustomer from '../components/usage-statistics/upper-service/upstream_customer'
import upstreamService from '../components/usage-statistics/upper-service/upstream_service'
import upstreamServiceByData from '../components/usage-statistics/upper-service/upstream_serviceByData'
import downstreamCustomer from '../components/usage-statistics/down-service/downstream_customer'
import downstreamService from '../components/usage-statistics/down-service/downstream_service'
import QueryLog from '../components/operation-tools/query_logs'
import queryQuality from '../components/operation-tools/query_quality'
import queryGuid from '../components/operation-tools/query_guid'
import queryMvTrackId from '../components/operation-tools/query_mvTrackId'
import operationCache from '../components/data-persistence/operation-cache'
import dataReset from '../components/data-persistence/data-reset'
import upStreamCount from '../components/data-output/query_upStreamCount'
import mobileOperator from '../components/data-output/query_mobileOperator'
import queryTrackDetail from '../components/data-output/query_trackDetail'
import supplierAnalysis from '../components/quality-analysis/supplier_quality_analysis'
import customerAnalysis from '../components/quality-analysis/customer_quality_analysis'
import queryOrder from '../components/async-service/query_order'
import channelManagement from '../components/async-service/channel_management'
import parameterMaintenance from '../components/config-management/interface_parameter_maintenance'
import sensitiveWord from '../components/security-center/sensitive_word'
import serviceRegular from '../components/security-center/service_regular'
import paramRecord from '../components/security-center/param_record'
import ruleInstance from '../components/security-center/rule_instance'
import Login from '../components/Login'
import Demo from '../components/demo'
import Main from '../components/Main'

Vue.use(Router)

const router = new Router({
  mode: 'history',
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
    }, {
      path: '/queryGuid',
      name: 'query_guid',
      component: queryGuid
    }, {
      path: '/queryMvTrackId',
      name: 'query_mvTrackId',
      component: queryMvTrackId
    }, {
      path: '/operationCache',
      name: 'opreat_cache',
      component: operationCache
    }, {
      path: '/dataReset',
      name: 'query_dataReset',
      component: dataReset
    }, {
      path: '/upStreamCount',
      name: 'query_upStreamCount',
      component: upStreamCount
    }, {
      path: '/mobileOperator',
      name: 'query_mobileOperator',
      component: mobileOperator
    }, {
      path: '/queryTrackDetail',
      name: 'query_trackDetail',
      component: queryTrackDetail
    }, {
      path: '/supplierAnalysis',
      name: 'supplier_quality_analysis',
      component: supplierAnalysis
    }, {
      path: '/customerAnalysis',
      name: 'customer_quality_analysis',
      component: customerAnalysis
    }, {
      path: '/queryOrder',
      name: 'query_order',
      component: queryOrder  
    }, {
      path: '/channelManagement',
      name: 'channel_management',
      component: channelManagement    
    }, {
      path: '/parameterMaintenance',
      name: 'interface_parameter_maintenance',
      component: parameterMaintenance
    }, {
      path: '/sensitiveWord',
      name: 'sensitive_word',
      component: sensitiveWord
    }, {
      path: '/serviceRegular',
      name: 'service_regular',
      component: serviceRegular
    }, {
      path: '/paramRecord',
      name: 'param_record',
      component: paramRecord
    }, {
      path: '/ruleInstance',
      name: 'rule_instance',
      component: ruleInstance
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
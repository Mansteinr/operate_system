import Vue from 'vue'
import Router from 'vue-router'
// 总量统计
// const QueryIndex = resolve => require(['../components/query-index'], resolve)
import QueryIndex from '../components/query-index'
// 用量统计
// const QueryUsage = resolve => require(['../components/usage-statistics/query_usage'], resolve)
// const QueryProfit = resolve => require(['../components/usage-statistics/query_profit'], resolve) // 利润分析
// const QueryFinance = resolve => require(['../components/usage-statistics/query_finance'], resolve) // 余额快照
// const upstreamService = resolve => require(['../components/usage-statistics/upper-service/upstream_service'], resolve)
// const upstreamCustomer = resolve => require(['../components/usage-statistics/upper-service/upstream_customer'], resolve)
// const upstreamSupplier = resolve => require(['../components/usage-statistics/upper-service/upstream_supplier'], resolve)
// const downstreamService = resolve => require(['../components/usage-statistics/down-service/downstream_service'], resolve)
// const downstreamCustomer = resolve => require(['../components/usage-statistics/down-service/downstream_customer'], resolve)
// const upstreamServiceByData = resolve => require(['../components/usage-statistics/upper-service/upstream_serviceByData'], resolve)
import QueryUsage from '../components/usage-statistics/query_usage'
import QueryProfit from '../components/usage-statistics/query_profit' // 利润分析
import QueryFinance from '../components/usage-statistics/query_finance' // 余额快照
import upstreamService from '../components/usage-statistics/upper-service/upstream_service'
import upstreamCustomer from '../components/usage-statistics/upper-service/upstream_customer'
import upstreamSupplier from '../components/usage-statistics/upper-service/upstream_supplier'
import downstreamService from '../components/usage-statistics/down-service/downstream_service'
import downstreamCustomer from '../components/usage-statistics/down-service/downstream_customer'
import upstreamServiceByData from '../components/usage-statistics/upper-service/upstream_serviceByData'

// y运维工具
// const QueryLog = resolve => require(['../components/operation-tools/query_logs'], resolve)
// const queryGuid = resolve => require(['../components/operation-tools/query_guid'], resolve)
// const queryQuality = resolve => require(['../components/operation-tools/query_quality'], resolve)
// const queryMvTrackId = resolve => require(['../components/operation-tools/query_mvTrackId'], resolve)
// const queryNewQuality = resolve => require(['../components/operation-tools/query_newquality'], resolve)
import QueryLog from '../components/operation-tools/query_logs'
import queryGuid from '../components/operation-tools/query_guid'
import queryQuality from '../components/operation-tools/query_quality'
import queryMvTrackId from '../components/operation-tools/query_mvTrackId'
import queryNewQuality from '../components/operation-tools/query_newquality'

// 数据持久化
// const dataReset = resolve => require(['../components/data-persistence/data-reset'], resolve)
// const operationCache = resolve => require(['../components/data-persistence/operation-cache'], resolve)
import dataReset from '../components/data-persistence/data-reset'
import operationCache from '../components/data-persistence/operation-cache'

// 数据导出
// const upStreamCount = resolve => require(['../components/data-output/query_upStreamCount'], resolve)
// const queryTrackDetail = resolve => require(['../components/data-output/query_trackDetail'], resolve)
// const mobileOperator = resolve => require(['../components/data-output/query_mobileOperator'], resolve)
import upStreamCount from '../components/data-output/query_upStreamCount'
import queryTrackDetail from '../components/data-output/query_trackDetail'
import mobileOperator from '../components/data-output/query_mobileOperator'

// 平台治理分析
// const supplierAnalysis = resolve => require(['../components/quality-analysis/supplier_quality_analysis'], resolve)
// const customerAnalysis = resolve => require(['../components/quality-analysis/customer_quality_analysis'], resolve)
import supplierAnalysis from '../components/quality-analysis/supplier_quality_analysis'
import customerAnalysis from '../components/quality-analysis/customer_quality_analysis'

/* 异步服务 */
// const queryOrder = resolve => require(['../components/async-service/query_order'], resolve)
// const channelManagement = resolve => require(['../components/async-service/channel_management'], resolve)
// const queryReconciliation = resolve => require(['../components/async-service/query_reconciliation'], resolve)
import queryOrder from '../components/async-service/query_order'
import channelManagement from '../components/async-service/channel_management'
import queryReconciliation from '../components/async-service/query_reconciliation'

/** 安全中心 */
// const paramRecord = resolve => require(['../components/security-center/param_record'], resolve)
// const ruleInstance = resolve => require(['../components/security-center/rule_instance'], resolve)
// const sensitiveWord = resolve => require(['../components/security-center/sensitive_word'], resolve)
// const serviceRegular = resolve => require(['../components/security-center/service_regular'], resolve)
// const parameterMaintenance = resolve => require(['../components/config-management/interface_parameter_maintenance'], resolve)
// const paramRecord = resolve => require(['../components/security-center/param_record'], resolve)
import paramRecord from '../components/security-center/param_record'
import ruleInstance from '../components/security-center/rule_instance'
import sensitiveWord from '../components/security-center/sensitive_word'
import serviceRegular from '../components/security-center/service_regular'
import parameterMaintenance from '../components/config-management/interface_parameter_maintenance'

// 一键登录
// const lightSignInAdd = resolve => require(['../components/app/add'], resolve)
// const lightSignInDetail = resolve => require(['../components/app/detail'], resolve)
// const oneClickLogin = resolve => require(['../components/app/one_click_login'], resolve)
import lightSignInAdd from '../components/app/add'
import lightSignInDetail from '../components/app/add'
import oneClickLogin from '../components/app/one_click_login'

// 登陆
// const Login = resolve => require(['../components/Login'], resolve)
// const Demo = resolve => require(['../components/demo'], resolve)
// const Main = resolve => require(['../components/Main'], resolve)
import Login from '../components/Login'
import Demo from '../components/demo'
import Main from '../components/Main'
import { resolve } from 'uri-js';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'Main',
    component: Main,
    children: [{
      path: '/QueryIndex',
      label: 'popo',
      name: 'views/query_index.html',
      component: QueryIndex
    }, {
      path: '/QueryUsage',
      name: 'views/query_usage.html',
      component: QueryUsage
    }, {
      path: '/QueryProfit',
      name: 'views/query_profit.html',
      component: QueryProfit
    }, {
      path: '/QueryFinance',
      name: 'views/query_finance.html',
      component: QueryFinance
    }, {
      path: '/upstreamSupplier',
      name: 'views/query_upstream_supplier.html',
      component: upstreamSupplier
    }, {
      path: '/upstreamCustomer',
      name: 'views/query_upstream_customer.html',
      component: upstreamCustomer
    }, {
      path: '/upstreamService',
      name: 'views/query_upstream_service.html',
      component: upstreamService
    }, {
      path: '/upstreamServiceByData',
      name: 'views/query_upstream_serviceByData.html',
      component: upstreamServiceByData
    }, {
      path: '/downstreamCustomer',
      name: 'views/query_downstream_customer.html',
      component: downstreamCustomer
    }, {
      path: '/downstreamService',
      name: 'views/query_downstream_service.html',
      component: downstreamService
    }, {
      path: '/QueryLog',
      name: 'views/query_logs.html',
      component: QueryLog
    }, {
      path: '/queryQuality',
      name: 'views/query_quality.html',
      component: queryQuality
    }, {
      path: '/queryNewQuality',
      name: 'views/query_newquality.html',
      component: queryNewQuality
    },  {
      path: '/queryGuid',
      name: 'views/query_guid.html',
      component: queryGuid
    }, {
      path: '/queryMvTrackId',
      name: 'views/query_mvTrackId.html',
      component: queryMvTrackId
    }, {
      path: '/operationCache',
      name: 'views/opreat_cache.html',
      component: operationCache
    }, {
      path: '/dataReset',
      name: 'views/query_dataReset.html',
      component: dataReset
    }, {
      path: '/upStreamCount',
      name: 'views/query_upStreamCount.html',
      component: upStreamCount
    }, {
      path: '/mobileOperator',
      name: 'views/query_mobileOperator.html',
      component: mobileOperator
    }, {
      path: '/queryTrackDetail',
      name: 'views/query_trackDetail.html',
      component: queryTrackDetail
    }, {
      path: '/supplierAnalysis',
      name: 'views/supplier_quality_analysis.html',
      component: supplierAnalysis
    }, {
      path: '/customerAnalysis',
      name: 'views/customer_quality_analysis.html',
      component: customerAnalysis
    }, {
      path: '/queryOrder',
      name: 'views/vehicle/query_order.html',
      component: queryOrder  
    }, {
      path: '/channelManagement',
      name: 'views/vehicle/channel_management.html',
      component: channelManagement    
    },  {
      path: '/queryReconciliation',
      name: 'views/vehicle/query_reconciliation.html',
      component: queryReconciliation    
    }, {
      path: '/parameterMaintenance',
      name: 'views/interface_parameter_maintenance.html',
      component: parameterMaintenance
    }, {
      path: '/sensitiveWord',
      name: 'views/security/sensitive_word.html',
      component: sensitiveWord
    }, {
      path: '/serviceRegular',
      name: 'views/security/service_regular.html',
      component: serviceRegular
    }, {
      path: '/paramRecord',
      name: 'views/security/param_record.html',
      component: paramRecord
    }, {
      path: '/ruleInstance',
      name: 'views/security/rule_instance.html',
      component: ruleInstance
    }, {
      path: '/oneClickLogin',
      name: 'views/app/one_click_login.html',
      component: oneClickLogin  
    }, {
      path: '/lightSignInDetail',
      name: 'lightSignInDetail',
      component: lightSignInDetail   
    }, {
      path: '/lightSignInAdd',
      name: 'lightSignInAdd',
      component: lightSignInAdd   
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
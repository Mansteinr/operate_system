import Vue from 'vue'
import Router from 'vue-router'
// 总量统计
// const QueryIndex = resolve => require(['../pages/query-index'], resolve)
import QueryIndex from '../pages/query-index'
// 用量统计
// const QueryUsage = resolve => require(['../pages/usage-statistics/query_usage'], resolve)
// const QueryProfit = resolve => require(['../pages/usage-statistics/query_profit'], resolve) // 利润分析
// const QueryFinance = resolve => require(['../pages/usage-statistics/query_finance'], resolve) // 余额快照
// const upstreamService = resolve => require(['../pages/usage-statistics/upper-service/upstream_service'], resolve)
// const upstreamCustomer = resolve => require(['../pages/usage-statistics/upper-service/upstream_customer'], resolve)
// const upstreamSupplier = resolve => require(['../pages/usage-statistics/upper-service/upstream_supplier'], resolve)
// const downstreamService = resolve => require(['../pages/usage-statistics/down-service/downstream_service'], resolve)
// const downstreamCustomer = resolve => require(['../pages/usage-statistics/down-service/downstream_customer'], resolve)
// const upstreamServiceByData = resolve => require(['../pages/usage-statistics/upper-service/upstream_serviceByData'], resolve)
import QueryUsage from '../pages/usage-statistics/query_usage'
import QueryProfit from '../pages/usage-statistics/query_profit' // 利润分析
import QueryFinance from '../pages/usage-statistics/query_finance' // 余额快照
import upstreamService from '../pages/usage-statistics/upper-service/upstream_service'
import upstreamCustomer from '../pages/usage-statistics/upper-service/upstream_customer'
import upstreamSupplier from '../pages/usage-statistics/upper-service/upstream_supplier'
import downstreamService from '../pages/usage-statistics/down-service/downstream_service'
import downstreamCustomer from '../pages/usage-statistics/down-service/downstream_customer'
import upstreamServiceByData from '../pages/usage-statistics/upper-service/upstream_serviceByData'

// y运维工具
// const QueryLog = resolve => require(['../pages/operation-tools/query_logs'], resolve)
// const queryGuid = resolve => require(['../pages/operation-tools/query_guid'], resolve)
// const queryQuality = resolve => require(['../pages/operation-tools/query_quality'], resolve)
// const queryMvTrackId = resolve => require(['../pages/operation-tools/query_mvTrackId'], resolve)
// const queryNewQuality = resolve => require(['../pages/operation-tools/query_newquality'], resolve)
import QueryLog from '../pages/operation-tools/query_logs'
import queryGuid from '../pages/operation-tools/query_guid'
import queryQuality from '../pages/operation-tools/query_quality'
import queryMvTrackId from '../pages/operation-tools/query_mvTrackId'
import queryNewQuality from '../pages/operation-tools/query_newquality'


// 数据导出
// const upStreamCount = resolve => require(['../pages/data-output/query_upStreamCount'], resolve)
// const queryTrackDetail = resolve => require(['../pages/data-output/query_trackDetail'], resolve)
// const mobileOperator = resolve => require(['../pages/data-output/query_mobileOperator'], resolve)
import upStreamCount from '../pages/data-output/query_upStreamCount'
import queryTrackDetail from '../pages/data-output/query_trackDetail'
import mobileOperator from '../pages/data-output/query_mobileOperator'

// 平台治理分析
// const supplierAnalysis = resolve => require(['../pages/quality-analysis/supplier_quality_analysis'], resolve)
// const customerAnalysis = resolve => require(['../pages/quality-analysis/customer_quality_analysis'], resolve)
import supplierAnalysis from '../pages/quality-analysis/supplier_quality_analysis'
import customerAnalysis from '../pages/quality-analysis/customer_quality_analysis'


/** 安全中心 */
// const paramRecord = resolve => require(['../pages/security-center/param_record'], resolve)
// const ruleInstance = resolve => require(['../pages/security-center/rule_instance'], resolve)
// const sensitiveWord = resolve => require(['../pages/security-center/sensitive_word'], resolve)
// const serviceRegular = resolve => require(['../pages/security-center/service_regular'], resolve)
// const parameterMaintenance = resolve => require(['../pages/config-management/interface_parameter_maintenance'], resolve)
// const paramRecord = resolve => require(['../pages/security-center/param_record'], resolve)
import paramRecord from '../pages/security-center/param_record'
import ruleInstance from '../pages/security-center/rule_instance'
import sensitiveWord from '../pages/security-center/sensitive_word'
import serviceRegular from '../pages/security-center/service_regular'
import parameterMaintenance from '../pages/config-management/interface_parameter_maintenance'
import blacklist from '../pages/config-management/blacklist'
import differenceValue from '../pages/config-management/difference-value'
import restrict from '../pages/config-management/restrict'

// 一键登录
// const lightSignInAdd = resolve => require(['../pages/app/add'], resolve)
// const lightSignInDetail = resolve => require(['../pages/app/detail'], resolve)
// const oneClickLogin = resolve => require(['../pages/app/one_click_login'], resolve)
import lightSignInAdd from '../pages/app/add'
import lightSignInDetail from '../pages/app/add'
import oneClickLogin from '../pages/app/one_click_login'

// 登陆
// const Login = resolve => require(['../pages/Login'], resolve)
// const Demo = resolve => require(['../pages/demo'], resolve)
// const Main = resolve => require(['../pages/Main'], resolve)

// 微信公众号
import wechatCustomer from '../pages/wechat/customer'
import wechatService from '../pages/wechat/service'
import wechatComprehensive from '../pages/wechat/comprehensive'
import wechatLog from '../pages/wechat/logs'

import Login from '../pages/Login'
import Demo from '../pages/demo'
import Main from '../pages/Main'


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
      name: 'views/statistics/query_usage.html',
      component: QueryUsage
    }, {
      path: '/QueryProfit',
      name: 'views/statistics/query_profit.html',
      component: QueryProfit
    }, {
      path: '/QueryFinance',
      name: 'views/statistics/query_finance.html',
      component: QueryFinance
    }, {
      path: '/upstreamSupplier',
      name: 'views/statistics/query_upstream_supplier.html',
      component: upstreamSupplier
    }, {
      path: '/upstreamCustomer',
      name: 'views/statistics/query_downstream_customer.html',
      component: upstreamCustomer
    }, {
      path: '/upstreamService',
      name: 'views/statistics/query_upstream_service.html',
      component: upstreamService
    }, {
      path: '/upstreamServiceByData',
      name: 'views/statistics/query_upstream_serviceByData.html',
      component: upstreamServiceByData
    }, {
      path: '/downstreamCustomer',
      name: 'views/statistics/query_downstream_customer.html',
      component: downstreamCustomer
    }, {
      path: '/downstreamService',
      name: 'views/statistics/query_downstream_service.html',
      component: downstreamService
    }, {
      path: '/QueryLog',
      name: 'views/devops/query_logs.html',
      component: QueryLog
    }, {
      path: '/queryQuality',
      name: 'views/devops/query_quality.html',
      component: queryQuality
    }, {
      path: '/queryNewQuality',
      name: 'views/devops/query_newquality.html',
      component: queryNewQuality
    },  {
      path: '/queryGuid',
      name: 'views/devops/query_guid.html',
      component: queryGuid
    }, {
      path: '/queryMvTrackId',
      name: 'views/devops/query_mvTrackId.html',
      component: queryMvTrackId
    }, {
      path: '/upStreamCount',
      name: 'views/export/query_upStreamCount.html',
      component: upStreamCount
    }, {
      path: '/mobileOperator',
      name: 'views/export/query_mobileOperator.html',
      component: mobileOperator
    }, {
      path: '/queryTrackDetail',
      name: 'views/export/query_trackDetail.html',
      component: queryTrackDetail
    }, {
      path: '/supplierAnalysis',
      name: 'views/configure/supplier_quality_analysis.html',
      component: supplierAnalysis
    }, {
      path: '/customerAnalysis',
      name: 'views/configure/customer_quality_analysis.html',
      component: customerAnalysis
    }, {
      path: '/parameterMaintenance',
      name: 'views/configure/interface_parameter_maintenance.html',
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
    }, {
      path: '/wechatCustomer',
      name: 'views/wechat/customer.html',
      component: wechatCustomer   
    } , {
      path: '/wechatService',
      name: 'views/wechat/service.html',
      component: wechatService   
    }, {
      path: '/wechatComprehensive',
      name: 'views/wechat/comprehensive.html',
      component: wechatComprehensive   
    }, {
      path: '/wechatLog',
      name: 'views/wechat/wechatLog.html',
      component: wechatLog   
    }, {
      path: '/blacklist',
      name: 'views/configure/blacklist.html',
      component: blacklist   
    }, {
      path: '/differenceValue',
      name: 'views/configure/callDiffNumThreshold.html',
      component: differenceValue   
    }, {
      path: '/restrict',
      name: 'views/configure/restrict.html',
      component: restrict   
    }
  ]
  }, {
    path: '/Login',
    name: 'Login',
    component: Login
  }]
})
export default router
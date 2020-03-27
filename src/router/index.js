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
import lightSignInDetail from '../pages/app/detail'
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
      path: '/views/query_index',
      name: 'views/query_index.html',
      component: QueryIndex
    }, {
      path: '/views/statistics/query_usage',
      name: 'views/statistics/query_usage.html',
      component: QueryUsage
    }, {
      path: '/views/statistics/query_profit',
      name: 'views/statistics/query_profit.html',
      component: QueryProfit
    }, {
      path: '/views/statistics/query_finance',
      name: 'views/statistics/query_finance.html',
      component: QueryFinance
    }, {
      path: '/views/statistics/query_upstream_supplier',
      name: 'views/statistics/query_upstream_supplier.html',
      component: upstreamSupplier
    }, {
      path: '/views/statistics/query_upstream_customer',
      name: 'views/statistics/query_upstream_customer.html',
      component: upstreamCustomer
    }, {
      path: '/statistics/query_upstream_service',
      name: 'views/statistics/query_upstream_service.html',
      component: upstreamService
    }, {
      path: '/views/statistics/query_upstream_serviceByData',
      name: 'views/statistics/query_upstream_serviceByData.html',
      component: upstreamServiceByData
    }, {
      path: '/query_downstream_customer',
      name: 'views/statistics/query_downstream_customer.html',
      component: downstreamCustomer
    }, {
      path: '/views/statistics/query_downstream_service',
      name: 'views/statistics/query_downstream_service.html',
      component: downstreamService
    }, {
      path: '/views/devops/query_logs',
      name: 'views/devops/query_logs.html',
      component: QueryLog
    }, {
      path: '/views/devops/query_quality',
      name: 'views/devops/query_quality.html',
      component: queryQuality
    }, {
      path: '/views/devops/query_newquality',
      name: 'views/devops/query_newquality.html',
      component: queryNewQuality
    },  {
      path: '/views/devops/query_guid',
      name: 'views/devops/query_guid.html',
      component: queryGuid
    }, {
      path: '/views/devops/query_mvTrackId',
      name: 'views/devops/query_mvTrackId.html',
      component: queryMvTrackId
    }, {
      path: '/views/export/query_upStreamCount',
      name: 'views/export/query_upStreamCount.html',
      component: upStreamCount
    }, {
      path: '/views/export/query_mobileOperator',
      name: 'views/export/query_mobileOperator.html',
      component: mobileOperator
    }, {
      path: '/views/export/query_trackDetail',
      name: 'views/export/query_trackDetail.html',
      component: queryTrackDetail
    }, {
      path: '/views/configure/supplier_quality_analysis',
      name: 'views/configure/supplier_quality_analysis.html',
      component: supplierAnalysis
    }, {
      path: '/views/configure/customer_quality_analysis',
      name: 'views/configure/customer_quality_analysis.html',
      component: customerAnalysis
    }, {
      path: '/views/configure/interface_parameter_maintenance',
      name: 'views/configure/interface_parameter_maintenance.html',
      component: parameterMaintenance
    }, {
      path: '/views/security/sensitive_word',
      name: 'views/security/sensitive_word.html',
      component: sensitiveWord
    }, {
      path: '/views/security/service_regular',
      name: 'views/security/service_regular.html',
      component: serviceRegular
    }, {
      path: '/views/security/param_record',
      name: 'views/security/param_record.html',
      component: paramRecord
    }, {
      path: '/views/security/rule_instance',
      name: 'views/security/rule_instance.html',
      component: ruleInstance
    }, {
      path: '/views/app/one_click_login',
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
      path: '/views/wechat/customer',
      name: 'views/wechat/customer.html',
      component: wechatCustomer   
    } , {
      path: '/views/wechat/service',
      name: 'views/wechat/service.html',
      component: wechatService   
    }, {
      path: '/views/wechat/comprehensive',
      name: 'views/wechat/comprehensive.html',
      component: wechatComprehensive   
    }, {
      path: '/views/wechat/wechatLog',
      name: 'views/wechat/wechatLog.html',
      component: wechatLog   
    }, {
      path: '/views/configure/blacklist',
      name: 'views/configure/blacklist.html',
      component: blacklist   
    }, {
      path: '/views/configure/callDiffNumThreshold',
      name: 'views/configure/callDiffNumThreshold.html',
      component: differenceValue   
    }, {
      path: '/views/configure/restrict',
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
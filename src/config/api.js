
/*默认使用协议*/
const protocol = 'http'
const baseConfig = {
  protocols: {
    http: 'http://',
    https: 'https://'
  },
  /*生产环境*/
  prod: {
    rbacweb: 'boss.miniclouds.cn:80/',	/* ! 系统权限管理web页面地址 */
    rbacapi: 'userapi.miniclouds.cn/',	/* ! 系统权限管理api服务器地址 */
    upapi: '121.196.226.17:7200/',	/* ! 上游服务有关接口 */
    vehicleapi: '121.196.226.17:7200/',	/* ! 车辆维保 */
    qualityanalyzeapi: '121.196.226.17:7200/',	/* ! 质量分析 */
    safaCenterapi: '121.196.226.17:7200/',	/* ! 安全中心 */
    imageapi: 'http://101.37.108.12:10777/file/show'	/* ! 图片接口 */
  },
  /*生产环境*/
  gd: {
    rbacweb: '172.16.9.216:8020/',	/* ! 系统权限管理web页面地址 */
    rbacapi: '172.16.6.83:58080/',	/* ! 系统权限管理api服务器地址 */
    upapi: 'crecds.cn:7202/',	/* ! 上游服务有关接口 */
    vehicleapi: 'crecds.cn:7202/',	/* ! 车辆维保 */
    qualityanalyzeapi: 'crecds.cn:7301/',	/* ! 质量分析 */
    safaCenterapi: 'crecds.cn:9090/',	/* ! 安全中心 */
    imageapi: 'http://101.37.108.12:10777/file/show'	/* ! 图片接口 */
  },
  /*开发环境*/
  dev: {
    rbacweb: '172.16.9.216:8020/',	/* ! 系统权限管理web页面地址 */
    rbacapi: '192.168.109.173:7000/',	/* ! 系统权限管理api服务器地址 */
    upapi: '192.168.109.171:7000/',	/* ! 上游服务有关接口 */
    vehicleapi: '120.55.241.117:9089/',	/* ! 车辆维保 */
    qualityanalyzeapi: '114.55.36.16:9999/',	/* ! 质量分析 */
    safaCenterapi: '121.196.226.17:7200/',	/* ! 安全中心 */
    imageapi: 'http://120.55.241.117:10777/file/show'	/* ! 图片接口 */
  },
  /*测试环境*/
  test: {
    rbacweb: '172.16.9.216:8020/',	/* ! 系统权限管理web页面地址 */
    rbacapi: '172.16.6.83:58080/',	/* ! 系统权限管理api服务器地址 */
    upapi: '192.168.109.171:7000/',	/* ! 上游服务有关接口 */
    vehicleapi: '120.55.241.117:9089/',	/* ! 车辆维保 */
    qualityanalyzeapi: '121.196.226.17:7200/',	/* ! 质量分析 */
    safaCenterapi: '120.55.241.117:9191/',	/* ! 安全中心 */
    imageapi: 'http://120.55.241.117:10777/file/show'	/* ! 图片接口 */
  }
}
/*设置api转换*/
// let apiFormat = (api = '', hostkey = 'base', pt = protocol) => baseConfig.protocols[pt] + baseConfig[process.env.NODE_ENV][hostkey] + api
let apiFormat = (api = '', hostkey = 'base', pt = protocol) => baseConfig.protocols[pt] + baseConfig.prod[hostkey] + api
const api = {
  base: {
    login: apiFormat('login/doLogin', 'rbacapi', 'https'),
    loginout: apiFormat('logout/ajaxLogout', 'rbacapi', 'https'),
    querymenus: apiFormat('sys/resource/querySubSystemMenuList', 'rbacapi', 'https'),
    projectchoose: apiFormat('boss2-0-web/rbac-web/choose.html', 'rbacweb', 'https'),
    loginchannel: apiFormat('boss2-0-web/rbac-web/loginChannel.html', 'rbacweb', 'https'),
    getVerifyCode: apiFormat('login/getVerifyCode', 'rbacapi', 'https'),
    imageapi: baseConfig.prod.imageapi
  },
  upApi: {
    /*！能力域api*/
    businessTypes: apiFormat('operator/businessTypes', 'upapi'), // 获取行业类型
    logs: apiFormat('operator/logs', 'upapi'), // 获取行业类型
    customers: apiFormat('operator/customers', 'upapi'), // 所以的客户名称
    services: apiFormat('operator/services', 'upapi'), // 获取接口服务
    hasServices: apiFormat('operator/hasServices', 'upapi'), // 客户拥有的服务
    logDetail: apiFormat('operator/logDetail', 'upapi'), // g供应商
    getCustomersByWebServiceNames: apiFormat('operator/getCustomersByWebServiceNames', 'upapi'), // g供应商
    logByMvTrackId: apiFormat('operator/logByMvTrackId', 'upapi'),
    companys: apiFormat('operator/supplier/companys', 'upapi'), // g供应商
    getOutServiceChargeInfoBySupplier: apiFormat('operator/up/getOutServiceChargeInfoBySupplier', 'upapi'), // g供应商
    getCustomerChargeInfo: apiFormat('operator/up/getCustomerChargeInfo', 'upapi'), // g供应商
    getOutServiceChargeInfo: apiFormat('operator/up/getOutServiceChargeInfo', 'upapi'),
    getOutServiceChargeInfoByDay: apiFormat('operator/up/getOutServiceChargeInfoByDay', 'upapi'),
    getAllOutServiceChargeInfo: apiFormat('operator/up/getAllOutServiceChargeInfo', 'upapi'), /*--获取服务对应上游信息的每天详细统计信息(导出excel表格)*/
    queryByDate: apiFormat('operator/margin/queryByDate', 'upapi'), /* 利润分析 */
  },
  downApi: {
    UsageByName: apiFormat('operator/down/UsageByName', 'upapi'),
    UsageByDate: apiFormat('operator/down/UsageByDate', 'upapi'), // 
    UsageByCustomer: apiFormat('operator/down/UsageByCustomer', 'upapi'),
    UsageByResultNew: apiFormat('operator/down/UsageByResultNew', 'upapi'),
    chargeLog: apiFormat('operator/accounting/chargeLog', 'upapi'), // 余额快照
    getBalanceSnapshot: apiFormat('operator/accounting/getBalanceSnapshot', 'upapi') // 余额快照
  },
  secureApi: { // 安全中心
    allWords: apiFormat('secure/web/word/allWords', 'safaCenterapi'), /*查询所有的敏感词*/
    wordInsert: apiFormat('secure/web/word/insert', 'safaCenterapi'), /*新增敏感词*/
    wordDelete: apiFormat('secure/web/word/delete', 'safaCenterapi'),  /*删除敏感词*/
    wordUpdate: apiFormat('secure/web/word/update', 'safaCenterapi'), /*新增敏感词*/
    paramRecord: apiFormat('secure/web/record/paramRecord', 'safaCenterapi'), /* 参数拦截例 */
    recoverUseful: apiFormat('secure/web/record/recoverUseful', 'safaCenterapi'), /* 告警恢复 */
    allService: apiFormat('secure/web/service/allService', 'safaCenterapi'), /*获取所有的服务*/
    allRegulars: apiFormat('secure/web/regular/allRegulars', 'safaCenterapi'), /*获取所有规则*/
    directService: apiFormat('secure/web/service/directService', 'safaCenterapi'), /*获取所有子服务*/
    deleteService: apiFormat('secure/web/service/delete', 'safaCenterapi'), /*删除服务*/
    insertService: apiFormat('secure/web/service/insert', 'safaCenterapi'), /*新增服务*/
    subService: apiFormat('secure/web/service/subService', 'safaCenterapi'), /*服务直接子服务*/
    updateService: apiFormat('secure/web/service/update', 'safaCenterapi'), /*更新服务*/
    insertRegulars: apiFormat('secure/web/regular/insert', 'safaCenterapi'), /*新增规则*/
    deleteRegulars: apiFormat('secure/web/regular/delete', 'safaCenterapi'), /*删除规则*/
    updateRegulars: apiFormat('secure/web/regular/update', 'safaCenterapi'), /*更新规则*/
    allRegIns: apiFormat('secure/web/regIns/allRegIns', 'safaCenterapi'), /*所有的规则实列*/
    insertRegIns: apiFormat('secure/web/regIns/insert', 'safaCenterapi'), /*新增规则实列*/
    deleteRegIns: apiFormat('secure/web/regIns/delete', 'safaCenterapi'), /*删除规则实列*/
    updateRegIns: apiFormat('secure/web/regIns/update', 'safaCenterapi'), /*更新规则实列*/
  },
  qualityanalyApi: { // 平台质量分析
    supplierRealTime: apiFormat('qualityanalyze/supplier/realTime', 'upapi'),  /* 供应商（上游）质量分析  实时数据 */
    customerRealTime: apiFormat('qualityanalyze/customer/realTime', 'upapi'),  /* 客户(下游)质量分析 实时数据 */
    supplierHistory: apiFormat('qualityanalyze/supplier/history', 'upapi'), /* 供应商（上游）质量分析 历史数据 */
    customerHistory: apiFormat('qualityanalyze/customer/history', 'upapi'), /* 客户（上游）质量分析 历史数据 */
  },
  redisApi: {
    query: apiFormat('operator/redis/query', 'upapi')
  },
  financeApi: {
    upStreamCount: apiFormat('operator/finance/upStreamCount', 'upapi'),  /* 组合服务上游调用量 */
    upStreamDetail: apiFormat('operator/finance/upStreamDetail', 'upapi'),  /* 下游客户调用明细 */
    trackDetail: apiFormat('operator/finance/trackDetail', 'upapi'), 
    mobileOperator: apiFormat('operator/finance/mobileOperator', 'upapi')
  },
  // boss提供的接口
  supplierApi: {
    querySupInfoList: apiFormat('operator/supplier/querySupInfoList', 'upapi'),
    queryPipeList: apiFormat('operator/supplier/queryPipeList', 'upapi'),
    querySupServiceList: apiFormat('operator/supplier/querySupServiceList', 'upapi')
  },
  persistApi: {
    persistInfos: apiFormat('operator/persist/persistInfos', 'upapi'),
    persistQuery: apiFormat('operator/persist/query', 'upapi'),
    persistDel: apiFormat('operator/persist/del', 'upapi'),
  },
  paramsApi: {
    queryParamsByServiceName: apiFormat('operator/ServiceNameParams/queryParamsByServiceName', 'upapi'), /*根据服务名查询参数*/
    getParam: apiFormat('operator/ServiceNameParams/getParam', 'upapi'), /*配置管理获取所有的参数*/
    getAll: apiFormat('operator/ServiceNameParams/getAll', 'upapi'), /*配置管理获取所有的服务名*/
    deleteByServiceNameAndParamName: apiFormat('operator/ServiceNameParams/deleteByServiceNameAndParamName', 'upapi'), /*配置管理删除的服务名*/
    addServiceNameAndParams: apiFormat('operator/ServiceNameParams/addServiceNameAndParams', 'upapi') /*配置管理新增的服务名*/
  },
  callbackServiceApi: {
    getOrderInfoById: apiFormat('callbackService/operator/getOrderInfoById', 'vehicleapi'),  /* 订单号查看订单状态 */
    getOrderInfoByVin: apiFormat('callbackService/operator/getOrderInfoByVin', 'vehicleapi'),  /* vin查询符合条件的订单信息 */
    getDecryptData: apiFormat('callbackService/operator/getDecryptData', 'vehicleapi'), /* 订单号查询车保报告 */
    getAllAbilityInfo: apiFormat('callbackService/operator/getAllAbilityInfo', 'vehicleapi'), /* 订单号查询车保报告 */
    getAbilitySupplilerInfo: apiFormat('callbackService/operator/getAbilitySupplilerInfo', 'vehicleapi'), /* 订单号查询车保报告 */
    alterAbilitySupplilerInfo: apiFormat('callbackService/operator/alterAbilitySupplilerInfo', 'vehicleapi'), /* 订单号查询车保报告 */
    customerCount: apiFormat('callbackService/operator/bill/customerCount', 'vehicleapi'), /* 数据源账单 */
    upCount: apiFormat('callbackService/operator/bill/upCount', 'vehicleapi'), /* 数据源账单 */
    marginCount: apiFormat('callbackService/operator/bill/marginCount', 'vehicleapi'), /*  利润查询 */
    customerDetail: apiFormat('callbackService/operator/bill/customerDetail', 'vehicleapi'), /* 利润查询 */
    upDetail: apiFormat('callbackService/operator/bill/upDetail', 'vehicleapi'), /* 利润查询 */
    marginDetail: apiFormat('callbackService/operator/bill/marginDetail', 'vehicleapi') /* 利润查询 */
  }
}
export default api

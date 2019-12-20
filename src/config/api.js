
/*默认使用协议*/
const protocol = 'http',  mode = 'prod'
const baseConfig = {
  protocols: {
    http: 'http://',
    https: 'https://'
  },
  /*生产环境*/
  prod: {
    rbacweb: 'boss.miniclouds.cn:80/',	/* ! 系统权限管理web页面地址 */
    rbacapi: 'userapi.miniclouds.cn/',	/* ! 系统权限管理api服务器地址 */
    upapi: '121.196.243.13:7200/',	/* ! 上游服务有关接口 */
    wechatapi: 'face.minivision.com.cn:9099/',	/* ! 上游服务有关接口 */
    imageapi: 'http://101.37.108.12:10778/file/show'	/* ! 图片接口 */
  },
  /*开发环境*/
  dev: {
    rbacweb: '172.16.9.216:8020/',	/* ! 系统权限管理web页面地址 */
    rbacapi: '192.168.109.173:7000/',	/* ! 系统权限管理api服务器地址 */
    upapi: '192.168.109.171:7000/',	/* ! 上游服务有关接口 */
    vehicleapi: '120.55.241.117:9089/',	/* ! 车辆维保 */
    qualityanalyzeapi: '114.55.36.16:9999/',	/* ! 质量分析 */
    safaCenterapi: '120.55.241.117:9191/',	/* ! 安全中心 */
    lightSignInapi: '120.55.241.117:9191/',	/* ! 安全中心 */
    imageapi: 'http://120.55.241.117:10777/file/show'	/* ! 图片接口 */
  },
  /*测试环境*/
  test: {
    rbacweb: '172.16.9.216:8020/',	/* ! 系统权限管理web页面地址 */
    rbacapi: '192.168.109.173:7000/',	/* ! 系统权限管理api服务器地址 */
    upapi: '10.30.20.77:30002/',	/* ! 上游服务有关接口 */
    vehicleapi: '10.30.20.77:9089/',	/* ! 车辆维保 */
    qualityanalyzeapi: '10.30.20.77:30002/',	/* ! 质量分析 */
    safaCenterapi: '10.30.20.77:9191/',	/* ! 安全中心 */
    lightSignInapi: '10.30.20.77:30002/',	/* ! 一键登录 */
    imageapi: 'http://120.55.241.117:10777/file/show'	/* ! 图片接口 */
  }
}

/*设置api转换*/
let apiFormat = (api = '', hostkey = 'upapi', pt = protocol) => {
  return baseConfig.protocols[pt] + baseConfig[mode][hostkey] + api
}

const api = {
  base: {
    login: apiFormat('login/doLogin', 'rbacapi', mode === 'prod' ? 'https' : 'http'),
    loginout: apiFormat('logout/ajaxLogout', 'rbacapi', mode === 'prod' ? 'https' : 'http'),
    querymenus: apiFormat('sys/resource/querySubSystemMenuList', 'rbacapi', mode === 'prod' ? 'https' : 'http'),
    projectchoose: apiFormat('boss2-0-web/rbac-web/choose.html', 'rbacweb', mode === 'prod' ? 'https' : 'http'),
    loginchannel: apiFormat('boss2-0-web/rbac-web/loginChannel.html', 'rbacweb', mode === 'prod' ? 'https' : 'http'),
    getVerifyCode: apiFormat('login/getVerifyCode', 'rbacapi', mode === 'prod' ? 'https' : 'http'),
    imageapi: baseConfig.prod.imageapi
  },
  upApi: {
    /*！能力域api*/
    businessTypes: apiFormat('operator/businessTypes'), // 获取行业类型
    logs: apiFormat('operator/logs'), // 获取行业类型
    customers: apiFormat('operator/customers'), // 所以的客户名称
    services: apiFormat('operator/services'), // 获取接口服务
    hasServices: apiFormat('operator/hasServices'), // 客户拥有的服务
    logDetail: apiFormat('operator/logDetail'), // g供应商
    getCustomersByWebServiceNames: apiFormat('operator/getCustomersByWebServiceNames'), // g供应商
    logByMvTrackId: apiFormat('operator/logByMvTrackId'),
    companys: apiFormat('operator/supplier/companys'), // g供应商
    getOutServiceChargeInfoBySupplier: apiFormat('operator/up/getOutServiceChargeInfoBySupplier'), // g供应商
    getCustomerChargeInfo: apiFormat('operator/up/getCustomerChargeInfo'), // g供应商
    getOutServiceChargeInfo: apiFormat('operator/up/getOutServiceChargeInfo'),
    getOutServiceChargeInfoByDay: apiFormat('operator/up/getOutServiceChargeInfoByDay'),
    getAllOutServiceChargeInfo: apiFormat('operator/up/getAllOutServiceChargeInfo'), /*--获取服务对应上游信息的每天详细统计信息(导出excel表格)*/
    queryByDate: apiFormat('operator/margin/queryByDate'), /* 利润分析 */
  },
  downApi: {
    UsageByName: apiFormat('operator/down/UsageByName'),
    UsageByDate: apiFormat('operator/down/UsageByDate'), // 
    UsageByCustomer: apiFormat('operator/down/UsageByCustomer'),
    UsageByResultNew: apiFormat('operator/down/UsageByResultNew'),
    chargeLog: apiFormat('operator/accounting/chargeLog'), // 余额快照
    getBalanceSnapshot: apiFormat('operator/accounting/getBalanceSnapshot') // 余额快照
  },
  secureApi: { // 安全中心
    allWords: apiFormat('secure/web/word/allWords'), /*查询所有的敏感词*/
    wordInsert: apiFormat('secure/web/word/insert'), /*新增敏感词*/
    wordDelete: apiFormat('secure/web/word/delete'),  /*删除敏感词*/
    wordUpdate: apiFormat('secure/web/word/update'), /*新增敏感词*/
    paramRecord: apiFormat('secure/web/record/paramRecord'), /* 参数拦截例 */
    recoverUseful: apiFormat('secure/web/record/recoverUseful'), /* 告警恢复 */
    allService: apiFormat('secure/web/service/allService'), /*获取所有的服务*/
    allRegulars: apiFormat('secure/web/regular/allRegulars'), /*获取所有规则*/
    directService: apiFormat('secure/web/service/directService'), /*获取所有子服务*/
    deleteService: apiFormat('secure/web/service/delete'), /*删除服务*/
    insertService: apiFormat('secure/web/service/insert'), /*新增服务*/
    subService: apiFormat('secure/web/service/subService'), /*服务直接子服务*/
    updateService: apiFormat('secure/web/service/update'), /*更新服务*/
    insertRegulars: apiFormat('secure/web/regular/insert'), /*新增规则*/
    deleteRegulars: apiFormat('secure/web/regular/delete'), /*删除规则*/
    updateRegulars: apiFormat('secure/web/regular/update'), /*更新规则*/
    allRegIns: apiFormat('secure/web/regIns/allRegIns'), /*所有的规则实列*/
    insertRegIns: apiFormat('secure/web/regIns/insert'), /*新增规则实列*/
    deleteRegIns: apiFormat('secure/web/regIns/delete'), /*删除规则实列*/
    updateRegIns: apiFormat('secure/web/regIns/update'), /*更新规则实列*/
  },
  qualityanalyApi: { // 平台质量分析
    supplierRealTime: apiFormat('qualityanalyze/supplier/realTime'),  /* 供应商（上游）质量分析  实时数据 */
    customerRealTime: apiFormat('qualityanalyze/customer/realTime'),  /* 客户(下游)质量分析 实时数据 */
    supplierHistory: apiFormat('qualityanalyze/supplier/history'), /* 供应商（上游）质量分析 历史数据 */
    customerHistory: apiFormat('qualityanalyze/customer/history'), /* 客户（上游）质量分析 历史数据 */
  },
  redisApi: {
    query: apiFormat('operator/redis/query')
  },
  financeApi: {
    upStreamCount: apiFormat('operator/finance/upStreamCount'),  /* 组合服务上游调用量 */
    upStreamDetail: apiFormat('operator/finance/upStreamDetail'),  /* 下游客户调用明细 */
    trackDetail: apiFormat('operator/finance/trackDetail'), 
    mobileOperator: apiFormat('operator/finance/mobileOperator')
  },
  // boss提供的接口
  supplierApi: {
    querySupInfoList: apiFormat('operator/supplier/querySupInfoList'),
    queryPipeList: apiFormat('operator/supplier/queryPipeList'),
    querySupServiceList: apiFormat('operator/supplier/querySupServiceList')
  },
  persistApi: {
    persistInfos: apiFormat('operator/persist/persistInfos'),
    persistQuery: apiFormat('operator/persist/query'),
    persistDel: apiFormat('operator/persist/del'),
  },
  paramsApi: {
    queryParamsByServiceName: apiFormat('operator/ServiceNameParams/queryParamsByServiceName'), /*根据服务名查询参数*/
    getParam: apiFormat('operator/ServiceNameParams/getParam'), /*配置管理获取所有的参数*/
    getAll: apiFormat('operator/ServiceNameParams/getAll'), /*配置管理获取所有的服务名*/
    deleteByServiceNameAndParamName: apiFormat('operator/ServiceNameParams/deleteByServiceNameAndParamName'), /*配置管理删除的服务名*/
    addServiceNameAndParams: apiFormat('operator/ServiceNameParams/addServiceNameAndParams') /*配置管理新增的服务名*/
  },
  callbackServiceApi: { // 异步服务
    getOrderInfoById: apiFormat('callbackService/operator/getOrderInfoById'),  /* 订单号查看订单状态 */
    getOrderInfoByVin: apiFormat('callbackService/operator/getOrderInfoByVin'),  /* vin查询符合条件的订单信息 */
    getDecryptData: apiFormat('callbackService/operator/getDecryptData'), /* 订单号查询车保报告 */
    getAllAbilityInfo: apiFormat('callbackService/operator/getAllAbilityInfo'), /* 订单号查询车保报告 */
    getAbilitySupplilerInfo: apiFormat('callbackService/operator/getAbilitySupplilerInfo'), /* 订单号查询车保报告 */
    alterAbilitySupplilerInfo: apiFormat('callbackService/operator/alterAbilitySupplilerInfo'), /* 订单号查询车保报告 */
    customerCount: apiFormat('callbackService/operator/bill/customerCount'), /* 数据源账单 */
    upCount: apiFormat('callbackService/operator/bill/upCount'), /* 数据源账单 */
    marginCount: apiFormat('callbackService/operator/bill/marginCount'), /*  利润查询 */
    customerDetail: apiFormat('callbackService/operator/bill/customerDetail'), /* 利润查询 */
    upDetail: apiFormat('callbackService/operator/bill/upDetail'), /* 利润查询 */
    marginDetail: apiFormat('callbackService/operator/bill/marginDetail') /* 利润查询 */
  },
  lightSignIn: { // 一键登录
    customers: apiFormat('operator/lightSignIn/customers'),  // 获取一键登录所有的客户
    appInfo: apiFormat('operator/lightSignIn/appInfo'),  /* app信息 */
    secret: apiFormat('operator/lightSignIn/secret'),  /* 查看appKey */
  },
  wechatAPI: { // 微信公众号
    customerInfo: apiFormat('wechatService/customerInfo/query', 'wechatapi'),  // 获取一键登录所有的客户
    appInfo: apiFormat('operator/lightSignIn/appInfo', 'wechatapi'),  /* app信息 */
    secret: apiFormat('operator/lightSignIn/secret', 'wechatapi')  /* 查看appKey */
  }
}
export default api


/*默认使用协议*/
const protocol = 'http'
const baseConfig = {
  protocols: {
    http: 'http://',
    https: 'https://'
  },
  /*生产环境*/
  prod: {
    base: 'boss.miniscores.cn:7202/agw/',	/* ! 当前系统api服务器地址 */
    rbacweb: 'boss.miniscores.cn:80/',	/* ! 系统权限管理web页面地址 */
    rbacapi: 'boss.miniscores.cn:9023/',	/* ! 系统权限管理api服务器地址 */
    upapi: '121.196.226.17:7200/',	/* ! 上游服务有关接口 */
    vehicleapi: '121.196.226.17:7200/',	/* ! 车辆维保 */
    qualityanalyzeapi: '121.196.226.17:7200/',	/* ! 质量分析 */
    safaCenterapi: '121.196.226.17:7200/',	/* ! 安全中心 */
    imageapi: 'http://101.37.108.12:10777/file/show'	/* ! 图片接口 */
  },
  /*生产环境*/
  gd: {
    base: '172.16.9.183:5010/agw/',	/* ! 当前系统api服务器地址 */
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
    base: '172.16.9.183:5010/agw/',	/* ! 当前系统api服务器地址 */
    rbacweb: '172.16.9.216:8020/',	/* ! 系统权限管理web页面地址 */
    rbacapi: '172.16.6.83:58080/',	/* ! 系统权限管理api服务器地址 */
    upapi: '172.16.9.116:7202/',	/* ! 上游服务有关接口 */
    vehicleapi: '120.55.241.117:9089/',	/* ! 车辆维保 */
    qualityanalyzeapi: '114.55.36.16:9999/',	/* ! 质量分析 */
    safaCenterapi: '121.196.226.17:7200/',	/* ! 安全中心 */
    imageapi: 'http://120.55.241.117:10777/file/show'	/* ! 图片接口 */
  },
  /*测试环境*/
  test: {
    base: '172.16.9.183:5010/agw/',	/* ! 当前系统api服务器地址 */
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
    login: apiFormat('login/doLogin', 'rbacapi'),
    loginout: apiFormat('logout/ajaxLogout', 'rbacapi'),
    querymenus: apiFormat('sys/resource/querySubSystemMenuList', 'rbacapi'),
    projectchoose: apiFormat('boss2-0-web/rbac-web/choose.html', 'rbacweb'),
    loginchannel: apiFormat('boss2-0-web/rbac-web/loginChannel.html', 'rbacweb'),
    getVerifyCode: apiFormat('login/getVerifyCode', 'rbacapi'),
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
    logByMvTrackId: apiFormat('operator/customer/logByMvTrackId', 'upapi'),
    companys: apiFormat('operator/supplier/companys', 'upapi'), // g供应商
    getOutServiceChargeInfoBySupplier: apiFormat('operator/up/getOutServiceChargeInfoBySupplier', 'upapi'), // g供应商
    getCustomerChargeInfo: apiFormat('operator/up/getCustomerChargeInfo', 'upapi'), // g供应商
    getOutServiceChargeInfo: apiFormat('operator/up/getOutServiceChargeInfo', 'upapi'),
    getOutServiceChargeInfoByDay: apiFormat('operator/up/getOutServiceChargeInfoByDay', 'upapi'),
    getAllOutServiceChargeInfo: apiFormat('operator/up/getAllOutServiceChargeInfo', 'upapi'), /*--获取服务对应上游信息的每天详细统计信息(导出excel表格)*/

  },
  downApi: {
    UsageByName: apiFormat('operator/down/UsageByName', 'upapi'),
    UsageByDate: apiFormat('operator/down/UsageByDate', 'upapi'), // 
    UsageByCustomer: apiFormat('operator/down/UsageByCustomer', 'upapi'),
    UsageByResultNew: apiFormat('operator/down/UsageByResultNew', 'upapi'),
  },
  secureApi: { // 安全中心

  },
  qualityanalyApi: { // 平台质量分析

  },
  redisApi: {
    query: apiFormat('operator/redis/query', 'upapi')
  },
  financeApi: {
    upStreamCount: apiFormat('operator/finance/upStreamCount', 'upapi')
  },
  persistApi: {
    persistInfos: apiFormat('operator/persist/persistInfos', 'upapi'),
    persistQuery: apiFormat('operator/persist/query', 'upapi'),
    persistDel: apiFormat('operator/persist/del', 'upapi'),
  },
  paramsApi: {
    queryParamsByServiceName: apiFormat('operator/ServiceNameParams/queryParamsByServiceName', 'upapi')
  }
}
export default api

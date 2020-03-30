/**
 * 操作改变motataio 改变state里面的数据
 */

import * as types from './mutations-types'

const mutations = {
  [types.GET_BALANCESNAPSHOT_ACTION] (state, list) {
    let newList = JSON.parse(JSON.stringify(list))
    state.balanceSnapshotList = Object.assign([], newList)
  },
  [types.GET_CHARGELOG_ACTION] (state, list) {
    let newList = JSON.parse(JSON.stringify(list))
    state.chargeLogList = Object.assign([], newList)
  },
  [types.GET_SUPPLIER_COMPANYS] (state, list) {
    let newList = JSON.parse(JSON.stringify(list))
    state.supplierCompanysList = Object.assign([], newList)
  },
  [types.GET_OUTSERVICECHARGEINFOBY_SUPPLIER] (state, respose) {
    let dayCompanyList = JSON.parse(JSON.stringify(respose.dayCompany))
    let serviceCompanyList = JSON.parse(JSON.stringify(respose.dayCompany))
    state.dayCompanyList = Object.assign([], dayCompanyList)
    state.serviceCompanyList = Object.assign([], serviceCompanyList)
  },
}
export default mutations
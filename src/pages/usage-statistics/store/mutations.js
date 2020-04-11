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
  [types.GET_CUSTOMER_CHARGEINFO] (state, list) {
    let newList = JSON.parse(JSON.stringify(list))
    state.customerChargeInfoList = Object.assign([], newList)
  },
  [types.GET_OUTSERVICE_CHARGEINFO] (state, respose) {
    let companyList = JSON.parse(JSON.stringify(respose.companyList)), 
        customerList = JSON.parse(JSON.stringify(respose.customerList))
    state.companyList = Object.assign([], companyList)
    state.customerList = Object.assign([], customerList)
  },
  [types.GET_OUTSERVICE_CHARGEINFOBYDAY] (state, list) {
    let newList = JSON.parse(JSON.stringify(list))
    console.log(list)
    state.outServiceChargeInfoByDayList = Object.assign([], newList)
  },
  [types.GET_USAGE_NAME_SORT_BY_DOWNCOST] (state, list) {
    let newList = JSON.parse(JSON.stringify(list)), pieCount = {}
    newList.sort((a, b) => {
      return -(a.downCost - b.downCost)
    })
    newList.forEach((v, k) => { //取前10名
      if (k <= 10) {
        pieCount[v.serviceNameZh] = v.downCost
      }
    })
    state.allUsageNameSortBydownCostTop10 = pieCount
    state.allUsageNameSortBydownCostList = Object.assign([], newList)
  },
  [types.GET_USAGE_NAME_SORT_BY_DOWNCHARGEDCOUNT] (state, list) {
    let newList = JSON.parse(JSON.stringify(list)), pieCharge = {}
    newList.sort((a, b) => {
      return -(a.downChargedCount - b.downChargedCount)
    })
    newList.forEach((v, k) => {
      if (k <= 10 ){
        pieCharge[v.serviceNameZh] = v.downChargedCount
      }
    })
    state.allUsageNameSortBydownChargedTop10 = pieCharge
    state.allUsageNameSortBydownChargedCountList = Object.assign([], newList)
  },
}
export default mutations
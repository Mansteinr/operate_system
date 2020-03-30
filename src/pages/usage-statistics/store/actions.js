import { $http } from '@/common/js/ajax'
import * as types from './mutations-types'
import API from '@/config/api'
// 余额快照
export const getBalanceSnapshotAjax = ({ commit }, options) => {
  $http(API.downApi.getBalanceSnapshot, options).then((res) => {
    commit(types.GET_BALANCESNAPSHOT_ACTION, res.resData)
  })
}
// 充值记录
export const getChargeLogAjax = ({ commit }, options) => {
  $http(`${API.downApi.chargeLog}/${options}`, {}, 'get').then((res) => {
    commit(types.GET_CHARGELOG_ACTION, res.resData)
  })
}
// 获取供应商
export const getSupplierCompanysAjax = ({ commit }) => {
  $http(API.upApi.companys, {}).then((res) => {
    commit(types.GET_SUPPLIER_COMPANYS, res.resData)
  })
}
// 供应商分析
export const getOutServiceChargeInfoBySupplierAjax = ({ commit }, options) => {
  $http(API.upApi.getOutServiceChargeInfoBySupplier, options).then((res) => {
    if (res.resData.serviceCompany.length) {
      res.resData.serviceCompany.forEach(v => {
        v.noChargeCount = v.usedCount - v.chargeUsedCount
      })
    }
    if (res.resData.dayCompany.length) {
      res.resData.dayCompany.forEach(v => {
        v.noChargeCount = v.usedCount - v.chargeUsedCount
      })
    }
    commit(types.GET_OUTSERVICECHARGEINFOBY_SUPPLIER, res.resData)
  })
}
// 按客户
export const getCustomerChargeInfoAjax = ({ commit }, options) => {
  $http(API.upApi.getCustomerChargeInfo, options).then((res) => {
    commit(types.GET_CUSTOMER_CHARGEINFO, res.resData.outServiceList)
  })
}
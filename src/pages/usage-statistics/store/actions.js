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
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
}
export default mutations
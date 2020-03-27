/**
 * 操作改变motataio 改变state里面的数据
 */

import * as types from './mutations-types'

const mutations = {
  [types.GET_LIGHTSIGNIN_CUSTOMER] (state, list) {
    let newList = JSON.parse(JSON.stringify(list))
    state.lightSignInCustomerList = Object.assign([], newList)
  },
  [types.GET_LIGHTSIGNIN_APPINFO] (state, list) {
    let newList = JSON.parse(JSON.stringify(list))
    state.lightSignInAppInfoList = Object.assign([], newList)
  },
}
export default mutations
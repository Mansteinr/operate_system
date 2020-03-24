/**
 * 操作改变motataio 改变state里面的数据
 */

import * as types from './mutations-types'

const mutations = {
  [types.GET_USAGEBYDATE] (state, list) {
    let newList = JSON.parse(JSON.stringify(list))
    state.UsageByDateList = Object.assign([], newList)
    console.log(state.UsageByDateList)
  },
  [types.GET_USAGEBYCUSTOMER] (state, list) { //左侧标记菜单激活状态
    let newList = JSON.parse(JSON.stringify(list))
    state.UsageByCustomerList = Object.assign([], newList)
  }
}
export default mutations
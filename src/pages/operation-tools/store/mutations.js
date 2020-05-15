/**
 * 操作改变motataio 改变state里面的数据
 */

import * as types from './mutations-types'

const mutations = {
  [types.GET_LOGS_ACTION] (state, list) {
    let newList = JSON.parse(JSON.stringify(list))
    state.allLogsList = Object.assign([], newList)
  }
}
export default mutations
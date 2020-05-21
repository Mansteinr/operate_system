/**
 * 操作改变motataio 改变state里面的数据
 */

import * as types from './mutations-types'

const mutations = {
  [types.GET_LOGS_ACTION] (state, list) {
    let newList = JSON.parse(JSON.stringify(list))
    state.allLogsList = Object.assign([], newList)
  },
  [types.GET_QUERY_BY_DATE] (state, data) {
    let newList = []

    Object.keys(data).forEach(v => {
      newList = [...newList, ...data[v]]
    })
    state.queryByDateList = Object.assign([], newList)
    console.log(state.queryByDateList)
  },
  [types.GET_QUERY_BY_COLLECTINFOS] (state, list) {
    let newList = JSON.parse(JSON.stringify(list))
    state.queryByDateCollectInfoList = Object.assign([], newList)
  },
}
export default mutations
/**
 * 操作改变motataio 改变state里面的数据
 */

import * as types from './mutations-types'

 console.log(types.GET_SYSTEMMENU_AJAX_LIST, [types.GET_SYSTEMMENU_AJAX_LIST])
const mutations = {
  [types.GET_SYSTEMMENU_AJAX_LIST] (state, list) {
    state.systemMenuList = list || []
    console.log(state.systemMenuList)
  },
}

console.log(mutations)
export default mutations
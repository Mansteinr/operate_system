/**
 * 操作改变motataio 改变state里面的数据
 */

import * as types from './mutations-types'

const mutations = {
  [types.GET_SYSTEMMENU_AJAX_LIST] (state, list) {
    state.systemMenuList = list || []
    console.log(state.systemMenuList)
  },
  [types.SET_ACTIVE_MEUN] (state, menuActive) { //标记菜单激活状态
    state.menuActive = menuActive
    console.log(state.menuActive)
  },
}

console.log(mutations)
export default mutations
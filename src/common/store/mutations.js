/**
 * 操作改变motataio 改变state里面的数据
 */

import * as types from './mutations-types'

const mutations = {
  [types.GET_SYSTEMMENU_AJAX_LIST] (state, list) {
    let newList = JSON.parse(JSON.stringify(list))
    state.systemMenuList = Object.assign([], newList)
  },
  [types.SET_ACTIVE_MEUN] (state, menuActive) { //左侧标记菜单激活状态
    console.log(menuActive,  'SET_ACTIVE_MEUN')
    state.menuActive = menuActive
  },
  [types.SET_HEADER_TABS] (state, list) { //顶部导航卡片
    let newList = JSON.parse(JSON.stringify(state.editableTabs))
    state.editableTabs = [...newList, ...list]
  },
  [types.SET_ACTIVE_HEADER_TAB] (state, currentHeader) { //顶部导航激活卡片
    console.log(currentHeader,  'SET_ACTIVE_HEADER_TAB')
    state.editableTabsValue = currentHeader
  },
}
export default mutations
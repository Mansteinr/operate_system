/**
 * 操作改变motataio 改变state里面的数据
 */

import * as types from './mutations-types'

const mutations = {
  [types.GET_SYSTEMMENU_AJAX_LIST] (state, list) {
    state.systemMenuList = list || []
  },
  [types.SET_ACTIVE_MEUN] (state, menuActive) { //左侧标记菜单激活状态
    console.log(menuActive,  'SET_ACTIVE_MEUN')
    state.menuActive = menuActive
  },
  [types.SET_HEADER_TABS] (state, list) { //顶部导航卡片
    console.log(state.editableTabs,  'SET_HEADER_TABS')
    console.log([...state.editableTabs, ...list])
    state.editableTabs = [...state.editableTabs, ...list]

  },
  [types.SET_ACTIVE_HEADER_TAB] (state, currentHeader) { //顶部导航激活卡片
    console.log(currentHeader,  'SET_ACTIVE_HEADER_TAB')
    state.editableTabsValue = currentHeader
  },
}
export default mutations
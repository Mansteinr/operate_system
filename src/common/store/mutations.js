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
  [types.DELETE_HEADER_TAB] (state, list) { //删除导航
    state.editableTabs = [...list]
  },
  [types.GET_BUSINESS_TYPES] (state, list) { //获取行业类型
    let newList = JSON.parse(JSON.stringify(state.editableTabs))
    state.businessTypesList = [...newList, ...list]
  },
  [types.GET_BASICS_ALL_SERVICES] (state, list) { //获取所有服务
    let newList = JSON.parse(JSON.stringify(state.editableTabs))
    state.allBusinessTypesList = [...newList, ...list]
  },
  [types.GET_BASICS_SERVICES] (state, list) { //获取服务
    let newList = JSON.parse(JSON.stringify(state.editableTabs))
    state.basicsServiceList = [...newList, ...list]
  },
  [types.GET_BASICS_CUSTOMERS] (state, list) { //获取客户
    let newList = JSON.parse(JSON.stringify(state.editableTabs))
    state.basicsCustomerList = [...newList, ...list]
  },
  [types.CHANGE_BUSINESS_TYPES] (state, value) { //选择行业类型
    console.log(value, state)
    // let newList = JSON.parse(JSON.stringify(state.editableTabs))
    // state.businessTypesList = [...newList, ...list]
  },
  [types.CHANGE_BASICS_CUSTOMER] (state, list) { //选择客户
    let newList = JSON.parse(JSON.stringify(state.editableTabs))
    state.basicsCustomerList = [...newList, ...list]
  },
  [types.CHANGE_BASICS_SERVICENAME] (state, list) { //选择服务
    let newList = JSON.parse(JSON.stringify(state.editableTabs))
    state.basicsServiceList = [...newList, ...list]
  },
}
export default mutations
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
    state.menuActive = menuActive
  },
  [types.SET_HEADER_TABS] (state, list) { //顶部导航卡片
    let newList = JSON.parse(JSON.stringify(state.editableTabs))
    state.editableTabs = [...newList, ...list]
  },
  [types.SET_ACTIVE_HEADER_TAB] (state, currentHeader) { //顶部导航激活卡片
    state.editableTabsValue = currentHeader
  },
  [types.DELETE_HEADER_TAB] (state, list) { //删除导航
    state.editableTabs = [...list]
  },
  [types.GET_BUSINESS_TYPES] (state, list) { //获取行业类型
    state.businessTypesList = [...[], ...list]
  },
  [types.GET_BASICS_ALL_SERVICES] (state, list) { //获取所有服务
    state.basicsServiceList = [...[], ...list]
  },
  [types.GET_BASICS_SERVICES] (state, list) { //获取服务
    state.basicsServiceList = [...[], ...list]
  },
  [types.GET_BASICS_CUSTOMERS] (state, list) { //获取客户
    state.basicsCustomerList = [...[], ...list]
    state.basicsAllCustomerList = [...[], ...list]
  },
  [types.CHANGE_BUSINESS_TYPES] (state, value) { //选择行业类型
    let newList = []
    newList = value ?  state.basicsAllCustomerList.filter(v => v.businessId === value) : state.basicsAllCustomerList
    
    state.basicsCustomerList = [...[], ...newList]
  },
  [types.QUERY_PAEAMS_BY_SERVICENAME] (state, list) { //根据服务名查询参数
    console.log(list)
    state.queryParamsByServiceNameList = [...[], ...list]
    console.log(state.queryParamsByServiceNameList)
  }
}
export default mutations
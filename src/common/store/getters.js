

// getters支是一个包装器 并不会改变state中的数据

export const addMenu = state => state.addMenu // es6语法简写 ruturn state.menu

// 菜单列表
export const systemMenuList = state => [...[], ...state.systemMenuList] 
// 左侧菜单激活状态
export const menuActive = state => state.menuActive
// 头部导航器
export const editableTabs = state => [...[], ...state.editableTabs] 
// 头部导航激活状态
export const editableTabsValue = state => state.editableTabsValue
// 获取行业类型
export const businessTypesList = state => state.businessTypesList
// 获取所有服务
export const allBusinessTypesList = state => state.allBusinessTypesList
// 获取服务
export const basicsServiceList = state => state.basicsServiceList
// 获取客户
export const basicsCustomerList = state => state.basicsCustomerList
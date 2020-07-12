import { $http } from '@/common/js/ajax'
import * as types from './mutations-types'
import API from '@/config/api'

// 获取菜单
export const getSystemMenuAjax = ({ commit }) => {
  $http(API.base.querymenus, { 'systemName': '服务平台' }).then((res) => {
    console.log(res)
    let truePathName = location.pathname ? location.pathname.substring(1).trim()+'.html' : res.resData[0].resourceUrl.trim(),
        trueTitle = serachTrueTitle(res.resData, truePathName)()
    commit(types.GET_SYSTEMMENU_AJAX_LIST, res.resData)
    commit(types.SET_ACTIVE_MEUN, truePathName)
    commit(types.SET_ACTIVE_HEADER_TAB, truePathName)
    commit(types.SET_HEADER_TABS, [{
      title: trueTitle,
      name: truePathName,
      url: truePathName
    }])
  })
}
// 获取行业类型
export const getBasicBusinessTypesAjax = ({ commit }) => {
  $http(API.upApi.businessTypes, {}).then((res) => {
    commit(types.GET_BUSINESS_TYPES, res.resData)
  })
}
// 获取服务
export const getBasicServiceAjax = ({ commit }, option) => {
  $http(API.upApi.hasServices, option).then((res) => {
    commit(types.GET_BASICS_SERVICES, res.resData)
  })
}
// 获取所有服务
export const getAllBasicServiceAjax = ({ commit }, option) => {
  $http(API.upApi.services, option).then((res) => {
    commit(types.GET_BASICS_ALL_SERVICES, res.resData)
  })
}
// 获取客户
export const getBasicCustomerAjax = ({ commit }, option = {}) => {
  $http(API.upApi.customers, option).then((res) => {
    commit(types.GET_BASICS_CUSTOMERS, res.resData)
  })
}
// 根据服务名查询参数
export const getParamsByServiceNameAjax = ({ commit }, option = {}) => {
  $http(API.paramsApi.queryParamsByServiceName, option).then(res=> {
    // console.log(res)
    let commitArr = res.resData.paramNameBeans ? res.resData.paramNameBeans : []
    console.log(res.resData)
    console.log(commitArr)
    console.log('commitArrcommitArrcommitArrcommitArr')
    commit(types.QUERY_PAEAMS_BY_SERVICENAME, [...commitArr, ...[{
      paramName: 'lowerCostTime',
      paramNameCh: '耗时大于'
    },{
      paramName: 'upperCostTime',
      paramNameCh: '耗时小于'
    }]])
  })
}

//递归遍历实现
let serachTrueTitle = (list, truePathName) => function(){
  for(let i = 0; i < list.length; i++) {
    if(list[i].childResource.length) {
      let result = serachTrueTitle(list[i].childResource, truePathName)()
      if(result) return result
    } else {
      if(list[i].resourceUrl.trim() === truePathName) {
        return list[i].name
      }
    }
  }
}
import { $http } from '@/common/js/ajax'
import * as types from './mutations-types'
import API from '@/config/api'
// 每日统计
export const getLightSignInCustomersAjax = ({ commit }) => {
  $http(API.lightSignIn.customers, {}, 'get').then((res) => {
    commit(types.GET_LIGHTSIGNIN_CUSTOMER, res.resData)
  })
}
// 获取app信息
export const getLightSignInappInfoAjax = ({ commit }, option) => {
  $http(`${API.lightSignIn.appInfo}/${option}`, {}, 'get').then((res) => {
    console.log(res.resData)
    commit(types.GET_LIGHTSIGNIN_APPINFO, res.resData)
  })
}

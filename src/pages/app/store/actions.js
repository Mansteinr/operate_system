import { $http } from '@/common/js/ajax'
import * as types from './mutations-types'
import API from '@/config/api'
// 每日统计
export const getLightSignInCustomersAjax = ({ commit }, option) => {
  $http(API.lightSignIn.customers, {}, 'get').then((res) => {
    commit(types.GET_LIGHTSIGNIN_CUSTOMER, res.resData)
  })
}

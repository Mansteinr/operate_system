import { $http } from '@/common/js/ajax'
import * as types from './mutations-types'
import API from '@/config/api'
// 每日统计
export const getUsageByDateAjax = ({ commit }, option) => {
  $http(API.downApi.UsageByDate, option).then((res) => {
    commit(types.GET_USAGEBYDATE, res.resData)
  })
}
// 按客户统计
export const getUsageByCustomerAjax = ({ commit }, option) => {
  $http(API.downApi.UsageByCustomer, option).then((res) => {
    commit(types.GET_USAGEBYCUSTOMER, res.resData)
  })
}

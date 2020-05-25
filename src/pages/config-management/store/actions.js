
import API from '@/config/api'
import * as types from './mutations-types'
import { $http } from '@/common/js/ajax'
// 余额快照
export const getLogsListAjax = ({ commit }, options) => {
  $http(API.upApi.logs, options).then((res) => {
    commit(types.GET_LOGS_ACTION, res.resData)
  })
}

// 利润分析
export const getQueryByDateAjax = ({ commit }, options) => {
  $http(API.upApi.queryByDate, options).then((res) => {
    commit(types.GET_QUERY_BY_DATE, res.resData.dayInfos)
    commit(types.GET_QUERY_BY_COLLECTINFOS, res.resData.collectInfos)
  })
}

// 利润分析
export const getLogDetailAjax = ({ commit }, options) => {
  $http(API.upApi.logDetail, options).then((res) => {
    commit(types.GET_LOGS_DETAIL, res.resData)
  })
}

// 质量分析
export const getQueryQualityAjax = ({ commit }, options) => {
  $http(API.downApi.UsageByResult, options).then((res) => {
    commit(types.GET_QUERY_QUALITY, res.resData)
  })
}
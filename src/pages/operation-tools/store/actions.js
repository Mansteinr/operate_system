
import API from '@/config/api'
import * as types from './mutations-types'
import { $http } from '@/common/js/ajax'
// 余额快照
export const getLogsListAjax = ({ commit }, options) => {
  $http(API.upApi.logs, options).then((res) => {
    commit(types.GET_LOGS_ACTION, res.resData)
  })
}

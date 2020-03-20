import { $http } from '@/common/js/ajax'
import * as types from './mutations-types'
import API from '@/config/api'


export const addFun = value => value.commit('add')
export const reductionFun = value => value.commit('reduction')

export const getSystemMenuAjax = ({ commit }) => {
  $http(API.base.querymenus, { 'systemName': '服务平台' }).then((res) => {
    commit(types.GET_SYSTEMMENU_AJAX_LIST, res.resData)
    commit(types.SET_ACTIVE_MEUN, res.resData[0].resourceUrl)
    commit(types.SET_ACTIVE_HEADER_TAB, res.resData[0].resourceUrl)
    commit(types.SET_HEADER_TABS, [{
      title: res.resData[0].name,
      name: res.resData[0].resourceUrl,
      url: res.resData[0].resourceUrl
    }])
  })
}

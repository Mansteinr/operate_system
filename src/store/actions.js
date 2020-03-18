import { $http } from '@/common/js/ajax'
import * as types from './mutations-types'
import API from '@/config/api'


export const addFun = value => value.commit('add')
export const reductionFun = value => value.commit('reduction')

export const getSystemMenuAjax = ({ commit }) => {
  $http(API.base.querymenus, { 'systemName': '服务平台' }).then((res) => {
    commit(types.GET_SYSTEMMENU_AJAX_LIST, res.resData)
    // this.menu =  res.resData
    // this.menuActive = this.menu[0].resourceUrl
    // this.editableTabs.push({
    //   title: this.menu[0].name,
    //   name: this.menuActive,
    //   url: this.menu[0].resourceUrl
    // })
    // this.editableTabsValue = this.menuActive
  })
}

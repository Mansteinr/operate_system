import { $http } from '@/common/js/ajax'
import * as types from './mutations-types'
import API from '@/config/api'


export const addFun = value => value.commit('add')
export const reductionFun = value => value.commit('reduction')

export const getSystemMenuAjax = ({ commit }) => {
  $http(API.base.querymenus, { 'systemName': '服务平台' }).then((res) => {
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

//递归遍历实现
let serachTrueTitle = (list, truePathName) => function(){
  for(let i = 0; i < list.length; i++) {
    console.log(list[i])
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
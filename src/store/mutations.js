import * as types from './mutations-type'
import { showModal } from '../utils'
const mutations = {
  // 这是一个修改方法， 第一个参数获取的state，第二个参数是提交的数据
  [types.SET_MENU] (state, addMenu) {
    if (!state.addMenu[addMenu]) {
      state.addMenu[addMenu] = addMenu // 修改state里面的数据
    } else {
      showModal(`${addMenu}详情页已经打开了`, 'warning')
    }
  },
  add (state, n = 1) {
    state.count += n
  },
  reduction (state, n = 1) {
    state.count -= n
  }
}

export default mutations
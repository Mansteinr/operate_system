import * as types from './mutations-type'

const mutations = {
  // 这是一个修改方法， 第一个参数获取的state，第二个参数是提交的数据
  [types.SET_MTK] (state, mtk) {
    state.mtk = mtk // 修改state里面的数据
  }
}

export default mutations
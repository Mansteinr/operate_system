import axios from 'axios'
import { Loading } from 'element-ui'
let loading
export default function $http (url, data, method = 'post') {
  startLoading()
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: url,
      data: data,
      headers: {
        mtk: localStorage.getItem('mtk')
      },
    }).then(res => {
      resolve(res.data)
      endLoading()
    }).catch(err => {
      reject(err)
      endLoading()
    })
  })
}

function startLoading () {    //使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
function endLoading () {    //使用Element loading-close 方法
  loading.close()
}

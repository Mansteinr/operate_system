
import axios from 'axios'
import { Loading } from 'element-ui'
import { showModal } from '../../utils'
let loading
export default function $http (url, data, method = 'post') {
  startLoading()
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: url,
      data: data,
      headers: {
        'mtk': localStorage.getItem('mtk'),
        'Content-Type': 'application/json;charset=UTF-8'
      },
    }).then(res => {
      // 成功
      if (res.data.resCode) { // 成功并且返回码为1
        resolve(res.data)
      } else { // 返回吗 不为1
        if (res.data.resMsg[0].msgCode === '10005') { // 若没有登录 则强制到登录页面
          window.location.href = window.location.origin + '/#/Login' // 跳转页面
        } else {
          showModal(res.data.resMsg[0].msgText, 'error')
        }
      }
      endLoading()
    }).catch(err => { // 错误
      reject(err)
      endLoading()
      showModal('网络有问题', 'warning')
    })
  })
}

function startLoading () {    //使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: '加载中…',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
function endLoading () {    //使用Element loading-close 方法
  loading.close()
}


import axios from 'axios'
import { Loading } from 'element-ui'
import { showModal } from '../../utils'
import moment from 'moment'
let loading
export default function $http (url, data, method = 'post') {
  showFullScreenLoading()
  if (data.time) {
    data.start = moment(data.time[0]).format('YYYY-MM-DD')
    data.end = moment(data.time[1]).format('YYYY-MM-DD')
  }
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
      tryHideFullScreenLoading()
    }).catch(err => { // 错误
      reject(err)
      tryHideFullScreenLoading()
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


// /那么 showFullScreenLoading() tryHideFullScreenLoading() 要干的事儿就是将同一时刻的请求合并。
// //声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
// //调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
let needLoadingRequestCount = 0
function showFullScreenLoading () {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

function tryHideFullScreenLoading () {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}
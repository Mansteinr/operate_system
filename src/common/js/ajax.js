
import axios from 'axios'
import { Loading } from 'element-ui'
import { showModal } from '../../utils'
let loading
export function $http (url, data, method = 'post', responseType = 'json') {
  showFullScreenLoading()
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: url,
      data: data,
      responseType: responseType,
      headers: {
        'mtk': localStorage.getItem('mtk'),
        'Content-Type': 'application/json;charset=UTF-8'
      },
    }).then(res => {
      // 成功
      if (res.data.resCode) { // 成功并且返回码为1
        resolve(res.data)
      } else if (responseType === 'blob') {
        resolve(res.data)
      } else { // 返回吗 不为1
        if (res.data.resMsg[0].msgCode === '10005') { // 若没有登录 则强制到登录页面
          window.location.href = window.location.origin + '/#/Login' // 跳转页面
        } else if (res.data.resMsg[0].msgCode === '40001005') {
          showModal(res.data.resMsg[0].msgText, 'warning')
        } else {
          showModal(res.data.resMsg[0].msgText, 'warning')
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

export function $downFile (url, op) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.responseType = "blob"; //这里是关键，它指明返回的数据的类型是二进制  
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('mtk', localStorage.getItem('mtk') || '909090');
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = this.response;
      var a = document.createElement('a');
      a.download = op.start + '/' + op.end + "数据统计.xlsx"
      a.href = window.URL.createObjectURL(response);
      document.body.appendChild(a)
      a.click();
      document.body.removeChild(a)
    }
  }
  xhr.send(JSON.stringify(op));
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
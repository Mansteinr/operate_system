
import axios from 'axios'
import { Loading } from 'element-ui'
import { showModal } from '@/utils'
import localData from '@/config/localData.json'
let loading
export function $http (url, data, method = 'post', responseType = 'json') {
  showFullScreenLoading()
  let options = {
    method: method,
    url: url,
    responseType: responseType,
    headers: {
      'mtk': localStorage.getItem('mtk'),
      'Content-Type': 'application/json;charset=UTF-8'
    },
  }
  if (method === 'post') { // get post 方法兼容
    options = Object.assign(options, {data: data})
  } else {
    options = Object.assign(options, {params: data})
  }
  return new Promise((resolve, reject) => {
    
    axios(options).then(res => {
      // 成功
      // if (res.data.resCode) { // 成功并且返回码为1
      //   resolve(res.data)
      // } else if (responseType === 'blob') {
      //   resolve(res.data)
      // } else { // 返回吗 不为1
        console.log(localData)
        console.log(url)
        console.log(localData[url])
        resolve(localData[url])
        // if (res.data.resMsg[0].msgCode === '10005') { // 若没有登录 则强制到登录页面
        //   window.location.href = window.location.origin + '/Login' // 跳转页面
        // } else if (res.data.resMsg[0].msgCode === '40001005') {
        //   showModal(res.data.resMsg[0].msgText, 'warning')
        // } else {
        //   showModal(res.data.resMsg[0].msgText, 'warning')
        // }
      // }
      tryHideFullScreenLoading()
    }).catch(err => { // 错误
      console.log(localData)
      console.log(url)
      console.log(localData[url])
      resolve(localData[url])
      
      // reject(err)
      tryHideFullScreenLoading()
      // showModal('网络有问题', 'warning')
    })
  })
}

export function $downFile (url, op, method = 'post', callback, typeFile="xlsx") {
  showFullScreenLoading()
  var xhr = new XMLHttpRequest()
  if (method.toUpperCase() === 'POST') {
    xhr.open("POST", url, true)
    xhr.setRequestHeader('mtk', localStorage.getItem('mtk') || '909090')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(op))
  } else {
    let params = url.split('?')[1].split('&')
    xhr.open('GET', url, true)
    xhr.setRequestHeader('mtk', localStorage.getItem('mtk') || '909090')
    if (params.length) {
      params.forEach(v => {
        op[v.split('=')[0]] = v.split('=')[1]
      })
    }
    xhr.send(null)
  }
  xhr.responseType = "blob"; //这里是关键，它指明返回的数据的类型是二进制  
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = this.response;
      var a = document.createElement('a')
      let fileName = this.getResponseHeader('content-disposition') ? this.getResponseHeader('content-disposition').split('=')[1] : op.start + '/' + op.end + "数据统计"
      a.download =this.getResponseHeader('content-disposition') ? fileName : fileName + typeFile
      a.href = window.URL.createObjectURL(response);
      document.body.appendChild(a)
      a.click();
      document.body.removeChild(a)
      tryHideFullScreenLoading()
      if (callback) {
        callback()
      }
    }
  }
  
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
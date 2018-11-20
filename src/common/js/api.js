import axios from 'axios'
import { Loading } from 'element-ui'
let httpUrl = ' https://www.easy-mock.com/mock/5bf3d0c104ab410ee8553d2b'
let loading
export default function $http (url, data, method = 'post') {
  startLoading()
  url = url.indexOf('http') > -1 ? url : httpUrl + url
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: url,
      data: data,
      headers: {
        mtk: '0f520df1-f6a9-41f7-9517-5e2892137bbe' || localStorage.getItem('mtk')
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

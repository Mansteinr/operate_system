/* eslint-disable */  //不需要eslint语法检测
import { Message } from 'element-ui'
import moment from 'moment'

// 弹框
export function showModal (text = '操作成功', type = 'success') {
  Message({
    message: text,
    type: type,
    center: true
  })
}
// 保留两位小数
export function toFixed (val, len = 2) {
  return Math.round(val * Math.pow(10, len)) / Math.pow(10, len)
}

// 是否是数字
export function checkNumber (val) {
  var reg = /^[1-9]+[0-9]*]*$/
  if (reg.test(val)) {
    return true
  } else {
    return false
  }
}
// 是否为空
export function checkNull (val) {
   if (!val || val == "" || val == '--') {
	return false
  } else if (typeof val === "object") {
    for (var prop in val) {
      return true
    }
    return false
  }
  return true
}
// 去除字符串两端空格
export function trim(val) {
  return val? val.replace(/^\s\s*/, '').replace(/\s\s*$/, '') : ''
}

export function mockTime() {
  let startTime = + new Date() - 1 * 24 * 3600 * 1000, arr = []
  for (let i = 0; i <= 1440; i++) {
    arr.push(moment(startTime + (i * 60 * 1000)).format('YYYYMMDDHHmm'))
  }
  return arr
}

/** 
 * 重置函数
 */
 export function reset () {
  for (let k = 0; k < document.querySelectorAll('.search-item').length; k++) {
    let li = document.querySelectorAll('.search-item')[k].querySelector('.dropdown-item.text-warp')
    if (li.className.indexOf('active')<=-1) {
      document.querySelectorAll('.search-item')[k].querySelector('.dropdown-item.text-warp').click()
    }
  }
 }
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

// 身份证检验
export function checkIdCard (card) {
  if (card === '') { //是否为空  
	return ('身份证号不能为空')
  }
  if (isCardNo(card) === false) { //校验长度，类型  
	return ('身份证号码格式不正确')
  }
  if (checkProvince(card) === false) { //检查省份 
	return ('身份证号码省不正确')
  }
  if (checkBirthday(card) === false) { //校验生日
	return ('身份证号码生日不正确')
  }
  if (checkParity(card) === false) { //检验位的检测 
	return ('身份证校验位不正确')
  }
  return ('身份证校正通过')
  return true
}
// 手机号码检测
export function checkMoble (val) {
  var reg = /^1[0-9]\d{9}$/
  if (reg.test(val)) {
	 return true
  } else {
	 return false
  }
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
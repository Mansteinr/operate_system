
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
	return ('身份证号不能为空');
  }
  if (isCardNo(card) === false) { //校验长度，类型  
	return ('身份证号码格式不正确');
  }
  if (checkProvince(card) === false) { //检查省份 
	return ('身份证号码省不正确');
  }
  if (checkBirthday(card) === false) { //校验生日
	return ('身份证号码生日不正确');
  }
  if (checkParity(card) === false) { //检验位的检测 
	return ('身份证校验位不正确');
  }
  return ('身份证校正通过');
  return true;
}
// 手机号码检测
export function checkMoble (val) {
  var reg = /^1[0-9]\d{9}$/;
  if (reg.test(val)) {
	 return true;
  } else {
	 return false;
  }
}
// 是否是数字
export function checkNumber (val) {
  var reg = /^[1-9]+[0-9]*]*$/
  if (reg.test(val)) {
	return true;
  } else {
	return false;
  }
}
// 是否为空
export function checkNull (val) {
   if (!val || val == "" || val == '--') {
	return false;
  } else if (typeof val === "object") {
	for (var prop in val) {
	  return true;
	}
	return false;
  }
  return true;
}
// 去除字符串两端空格
export function trim(val) {
  return val? val.replace(/^\s\s*/, '').replace(/\s\s*$/, '') : ''
}

export function mockTime() {
  let startTime = + new Date() - 1 * 24 * 3600 * 1000;
  let arr = [];
  for (let i = 0; i <= 1440; i++) {
    arr.push(moment(startTime + (i * 60 * 1000)).format('YYYYMMDDHHmm'))
  }
  return arr
}

  /*身份证号码规则验证*/
  const vcity = {
    11: "北京 ",
    12: "天津 ",
    13: "河北 ",
    14: "山西 ",
    15: "内蒙古 ",
    21: "辽宁 ",
    22: "吉林 ",
    23: "黑龙江 ",
    31: "上海 ",
    32: "江苏 ",
    33: "浙江 ",
    34: "安徽 ",
    35: "福建 ",
    36: "江西 ",
    37: "山东 ",
    41: "河南 ",
    42: "湖北 ",
    43: "湖南 ",
    44: "广东 ",
    45: "广西 ",
    46: "海南 ",
    50: "重庆 ",
    51: "四川 ",
    52: "贵州 ",
    53: "云南 ",
    54: "西藏 ",
    61: "陕西 ",
    62: "甘肃 ",
    63: "青海 ",
    64: "宁夏 ",
    65: "新疆 ",
    71: "台湾 ",
    81: "香港 ",
    82: "澳门 ",
    91: "国外 "
  };
  //检查号码是否符合规范，包括长度，类型  
  function isCardNo (card) {
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
    var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
    if (reg.test(card) === false) {
      return false;
    }
    return true;
  };
  //取身份证前两位,校验省份  
  function checkProvince (card) {
    var province = card.substr(0, 2);
    if (vcity[province] == undefined) {
      return false;
    }
    return true;
  };
  //检查生日是否正确  
  function checkBirthday (card) {
    var len = card.length;
    //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字  
    if (len == '15') {
      var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
      var arr_data = card.match(re_fifteen);
      var year = arr_data[2];
      var month = arr_data[3];
      var day = arr_data[4];
      var birthday = new Date('19' + year + '/' + month + '/' + day);
      return verifyBirthday('19' + year, month, day, birthday);
    }
    //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X  
    if (len == '18') {
      var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
      var arr_data = card.match(re_eighteen);
      var year = arr_data[2];
      var month = arr_data[3];
      var day = arr_data[4];
      var birthday = new Date(year + '/' + month + '/' + day);
      return verifyBirthday(year, month, day, birthday);
    }
    return false;
  };
  //校验日期  
  function verifyBirthday (year, month, day, birthday) {
    var now = new Date();
    var now_year = now.getFullYear();
    //年月日是否合理  
    if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
      //判断年份的范围（3岁到100岁之间)  
      var time = now_year - year;
      if (time >= 3 && time <= 100) {
        return true;
      }
      return false;
    }
    return false;
  };
  //校验位的检测  
  function checkParity  (card) {
    //15位转18位  
    card = changeFivteenToEighteen(card);
    var len = card.length;
    if (len == '18') {
      var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
      var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
      var cardTemp = 0,
        i, valnum;
      for (i = 0; i < 17; i++) {
        cardTemp += card.substr(i, 1) * arrInt[i];
      }
      valnum = arrCh[cardTemp % 11];
      if (valnum == card.substr(17, 1)) {
        return true;
      }
      return false;
    }
    return false;
  };
  //15位转18位身份证号  
  function changeFivteenToEighteen  (card) {
    if (card.length == '15') {
      var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
      var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
      var cardTemp = 0,
        i;
      card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
      for (i = 0; i < 17; i++) {
        cardTemp += card.substr(i, 1) * arrInt[i];
      }
      card += arrCh[cardTemp % 11];
      return card;
    }
    return card;
  };
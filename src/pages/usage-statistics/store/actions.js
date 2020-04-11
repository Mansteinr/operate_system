
import API from '@/config/api'
import * as types from './mutations-types'
import { $http, $downFile } from '@/common/js/ajax'
// 余额快照
export const getBalanceSnapshotAjax = ({ commit }, options) => {
  $http(API.downApi.getBalanceSnapshot, options).then((res) => {
    commit(types.GET_BALANCESNAPSHOT_ACTION, res.resData)
  })
}
// 充值记录
export const getChargeLogAjax = ({ commit }, options) => {
  $http(`${API.downApi.chargeLog}/${options}`, {}, 'get').then((res) => {
    commit(types.GET_CHARGELOG_ACTION, res.resData)
  })
}
// 获取供应商
export const getSupplierCompanysAjax = ({ commit }) => {
  $http(API.upApi.companys, {}).then((res) => {
    commit(types.GET_SUPPLIER_COMPANYS, res.resData)
  })
}
// 供应商分析
export const getOutServiceChargeInfoBySupplierAjax = ({ commit }, options) => {
  $http(API.upApi.getOutServiceChargeInfoBySupplier, options).then((res) => {
    if (res.resData.serviceCompany.length) {
      res.resData.serviceCompany.forEach(v => {
        v.noChargeCount = v.usedCount - v.chargeUsedCount
      })
    }
    if (res.resData.dayCompany.length) {
      res.resData.dayCompany.forEach(v => {
        v.noChargeCount = v.usedCount - v.chargeUsedCount
      })
    }
    commit(types.GET_OUTSERVICECHARGEINFOBY_SUPPLIER, res.resData)
  })
}
// 按客户
export const getCustomerChargeInfoAjax = ({ commit }, options) => {
  $http(API.upApi.getCustomerChargeInfo, options).then((res) => {
    commit(types.GET_CUSTOMER_CHARGEINFO, res.resData.outServiceList)
  })
}
// 按服务分析
export const getOutServiceChargeInfoAjax = ({ commit }, options) => {
  $http(API.upApi.getOutServiceChargeInfo, options).then((res) => {
    commit(types.GET_OUTSERVICE_CHARGEINFO, res.resData)
  })
}
// 按日服务分析
export const getAllOutServiceChargeInfoAjax = ({ commit }, options) => {
  if ((Date.parse(options.end) - Date.parse(options.start)) / (1000 * 24 * 3600) > 31) {
    this.$message({
      type: 'warnning',
      message: '时间跨度不能大于一个月'
    })
    return
  }

  const h = this.$createElement 
  let tips = null
  this.$msgbox({
    title: '下载',
    message: h('p', null, [
      h('span', null, `确定下载${options.start}~${options.end}全部`),
      h('i', { style: 'color: teal' }, '服务信息？')
    ]),
    showCancelButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        tips = instance
        instance.confirmButtonLoading = true //提示正在下载
        instance.confirmButtonText = '执行中...'
        var url = this.API.upApi.getAllOutServiceChargeInfo + "?start=" + options.start + "&serviceName=" + options.serviceName + "&end=" + options.end + "&loginName=" + options.loginName;
        $downFile(url, {}, 'get', () => {
          done()
        }, 'xls')
      } else {
        done()
      }
    }
  }).then(action => {
    console.log(action)
    tips.confirmButtonLoading = false // 取消提示
    this.$message({
      type: 'info',
      message: '下载成功'
    })
  }).catch (() => {
    tips.confirmButtonLoading = false // 取消提示
  })
  
}
// 按日服务分析
export const getOutServiceChargeInfoByDayAjax = ({ commit }, options) => {
  $http(API.upApi.getOutServiceChargeInfoByDay, options).then((res) => {
    commit(types.GET_OUTSERVICE_CHARGEINFOBYDAY, res.resData.serviceList)
  })
}
// 按日服务分析
export const getUsageByNameAjax = ({ commit }, options) => {
  $http(API.downApi.UsageByName, options).then((res) => {
    commit(types.GET_USAGE_NAME_SORT_BY_DOWNCOST, res.resData)
    commit(types.GET_USAGE_NAME_SORT_BY_DOWNCHARGEDCOUNT, res.resData)
  })
}


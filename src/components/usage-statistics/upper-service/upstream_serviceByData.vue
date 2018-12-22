<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container clearfix">
        <el-form :inline="true"  ref="querForm" :rules="rules" :model="queryParams" class="query-form">
          <el-form-item label="选择时间：" prop="time">
            <div class="block">
              <el-date-picker
                type="daterange" 
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                v-model="queryParams.time"
                range-separator="至"
                :picker-options="pickerOptions2">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="客户名称：" prop="loginName">
            <el-select v-model="queryParams.loginName" filterable placeholder="请选择">
              <el-option
                v-for="(v, index) in loginName"
                :key="index"
                :title="`${v.customerName}(${v.loginName})`"
                :label="v.customerName"
                @click.native.stop="changeCustomer(v)"
                :value="v.loginName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接口类型：" prop="serviceName" :title="titleTips">
            <el-select v-model="queryParams.serviceNames" filterable multiple collapse-tags placeholder="请选择">
              <el-option
                v-for="(v, index) in services"
                :key="index"
                :title="`${v.serviceNameZh}(${v.serviceName})`"
                :label="v.serviceNameZh"
                @click.native="changeSelectValue(v)"
                :value="v.serviceName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="query-item">
           <query-button @reset="reset" @submit="onSubmit"></query-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="card-wrapper card-content">
      <div class="card-title">
        查询结果
      </div>
      <div class="card-container">
        <div v-show="!tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <Table ref="table" class="table" :tableData="tableData" :tatalPage="tableData.length" v-show="tableData.length">
          <el-table-column
            v-for="(v, k) in unquieTable"
            :fixed="v==='dateTime' || v==='chargeUsedCount'"
            :key="k"
            min-width="120"
            :label="v|formatterName"
            :prop="v">
          </el-table-column>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import $http from '../../../common/js/ajax'
import {hotKeyTime, services, loginName } from '../../../common/js/mixin'
import Table from '../../../base/Table'
import QueryButton from '../../../base/QueryButton'
import moment from 'moment'
export default {
  mixins: [hotKeyTime, services, loginName],
  data () {
    return {
      unquieTable:[],
      allFlag: true,
      isServiceNames: true,
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
        serviceNames: [],
        loginName:''
      },
      tableData: [],
      titleTips: ''
    }
  },
  components: {
    Table,
    QueryButton
  },
  filters: {
    formatterName(value) {
      if (value === 'dateTime') {
        return '日期'
      } else if (value === 'chargeUsedCount') {
        return '计费调用总量'
      } else {
        return value
      }
    }
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
      this.queryParams.serviceNames = this.services[0].serviceName
    },
    onSubmit () {
      this.$refs.querForm.validate((valid) => {
        if (valid) {
          if (this.queryParams.serviceNames.length === 1 && this.queryParams.serviceNames[0] ==='') {
            this.getAllOutServiceChargeInfo()
          } else {
            this.getOutServiceChargeInfoByDay()
          }
        }
      })
    },
    formatter(val) {
      return this.$refs.table.formatter(val, 'cost')
    },
    changeSelectValue (val) {
      if (!val.serviceName) {
        this.queryParams.serviceNames = []
        this.queryParams.serviceNames.push('')
      } else {
        let index = this.queryParams.serviceNames.findIndex(value => {
          return !value
        })
        if (index > -1) {
          this.queryParams.serviceNames.splice(index, 1)
        }
        this.titleTips = this.queryParams.serviceNames.join('\n')
      }
    },
    getAllOutServiceChargeInfo () {
      let start = moment(this.queryParams.time[0]).format('YYYY-MM-DD'), end = moment(this.queryParams.time[1]).format('YYYY-MM-DD')
        const h = this.$createElement;
        this.$msgbox({
          title: '下载',
          message: h('p', null, [
            h('span', null, `确定下载${start}~${end}全部`),
            h('i', { style: 'color: teal' }, '服务信息？')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '执行中...'
              var url = this.API.upApi.getAllOutServiceChargeInfo + "?start=" + start + "&serviceName=''&end=" + end + "&loginName=''"
               $http(url, '', 'get', 'blob').then((res) => {
                  var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
              　　var downloadElement = document.createElement('a')
              　　var href = window.URL.createObjectURL(blob)
              　　downloadElement.href = href
              　　downloadElement.download = '数据统计.xls'
              　　document.body.appendChild(downloadElement)
              　　downloadElement.click()
              　　document.body.removeChild(downloadElement)
              　　window.URL.revokeObjectURL(href)
                  instance.confirmButtonLoading = false
                  done()
                  setTimeout(() => {
                    instance.confirmButtonLoading = false
                  }, 300)
               })
            } else {
              done()
            }
          }
        }).then(action => {
          this.$message({
            type: 'info',
            message: '下载成功'
          })
        })
    },
    getOutServiceChargeInfoByDay () {
      $http(this.API.upApi.getOutServiceChargeInfoByDay, this.queryParams).then((res) => {
        //先将三维数组转为一维数组 因为最后只要将数组转为[{"日期":'2018-10-21','当天所有服务的计费总量之和'：10，'以及各个服务当天计费之和’：10}]
        let returnData = res.resData.serviceList, arrData = [],arrTableHeader = []
        if (!returnData.length) {
          this.tableData = returnData
          return
        }
        returnData.forEach(v => {
          v.dateList.forEach(v2 => {
            if (!arrData.length) {
              let obj = {}
              obj.dateTime = v2.dateTime
              obj.chargeUsedCount = v2.chargeUsedCount
              v2.companyList.forEach(v3 => {
                obj[v3.company] = v3.chargeUsedCount
              })
              arrData.push(obj)
            } else {
              let index = 0, flag = false
              arrData.forEach((v4,k) => {
                if (v2.dateTime === v4.dateTime) {
                  flag = true
                  index = k
                }
              })
              if (flag) {
                arrData[index].chargeUsedCount += v2.chargeUsedCount
                v2.companyList.forEach(v3 => {
                  if (arrData[index][v3.company]){
                    arrData[index][v3.company] += v3.chargeUsedCount
                  } else {
                    arrData[index][v3.company] = v3.chargeUsedCount
                  }
                })
              } else {
                let obj = {}
                obj.dateTime = v2.dateTime
                obj.chargeUsedCount = v2.chargeUsedCount
                v2.companyList.forEach(v3 => {
                  obj[v3.company] = v3.chargeUsedCount
                })
                arrData.push(obj)
              }
            }
          })
        })
        this.tableData = arrData
        arrData.map(v => {
          arrTableHeader = [...arrTableHeader,...Object.keys(v)]
        })
        this.unquieTable = [...new Set(arrTableHeader)]
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

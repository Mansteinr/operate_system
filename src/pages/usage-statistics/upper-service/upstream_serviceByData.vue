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
                :name="['start', 'end']"
                :clearable="false"
                v-model="queryParams.time"
                range-separator="至"
                :picker-options="pickerOptions2">
              </el-date-picker>
            </div>
          </el-form-item>
          <loginNameSelect 
            :labelTitle="'客户名称'" 
            :originArr="loginName" 
            :defaultValue="'loginName'" 
            :defaultLable="'customerName'"
            :needValue="'customerId'"
            :searchInput=true
            :isAll=true
            @changeInputValue="changeCustomer">
          </loginNameSelect>
          <serviceSelect 
            :labelTitle="'接口类型'" 
            :originArr="services" 
            :defaultValue="'serviceName'" 
            :searchInput=true
            :isAll=true
            :isMultiple=true
            :defaultLable="'serviceNameZh'">
          </serviceSelect>
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
        <Table 
          ref="table" 
          class="table" 
          :tableData="tableData" 
          :tatalPage="tableData.length" 
          v-show="tableData.length"
          :columns="columns">
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import { $http, $downFile } from '../../../common/js/ajax'
import { hotKeyTime, services, loginName } from '../../../common/js/mixin'
import Table from '../../../base/Table'
import QueryButton from '../../../base/QueryButton'
import loginNameSelect from '../../../base/Select'
import serviceSelect from '../../../base/Select'
export default {
  mixins: [hotKeyTime, services, loginName],
  data () {
    return {
      unquieTable:[],
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
      },
      tableData: [],
      columns: []
    }
  },
  components: {
    Table,
    QueryButton,
    serviceSelect,
    loginNameSelect
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
    },
    onSubmit () {
      let options = {}
      this.$refs.querForm.$el.querySelectorAll('input').forEach(v => {
        if (v.name) {
          options[v.name] = v.value
        }
      })
      options.serviceNames = options.serviceName.split(',')
      if (options.serviceNames[0] === '') {
        options.serviceNames = []
        delete options.serviceName
        this.getAllOutServiceChargeInfo(options)
      } else {
        delete options.serviceName
        this.getOutServiceChargeInfoByDay(options)
      }
    },
    getAllOutServiceChargeInfo (options) { // 下载excelc
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
    },
    getOutServiceChargeInfoByDay (options) {
      $http(this.API.upApi.getOutServiceChargeInfoByDay, options).then((res) => {
        this.columns = [] // 清空数据
        //先将三维数组转为一维数组 因为最后只要将数组转为[{"日期":'2018-10-21','当天所有服务的计费总量之和'：10，'以及各个服务当天计费之和’：10}]
        let returnData = res.resData.serviceList, arrData = [],arrTableHeader = []
        if (!returnData.length) {
          this.tableData = returnData // 当数据为空时 置空防止下面保错
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
        this.unquieTable.forEach(v => {
          this.columns.push({
            prop: v,
            sortable: true,
            label: v === 'dateTime' ? '日期':(v==='chargeUsedCount'?'计费调用总量':v)
          })
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

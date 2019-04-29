<template>
<div class="template-wrapper">

  <div class="card-wrapper">
    <div class="card-title">
      查询条件
    </div>
    <div class="card-container clearfix">
      <el-form :inline="true"  ref="querForm" class="query-form">
        <Select
          :labelTitle="'查询条件'"
          @changeInputValue="changeCondition"
          :originArr="reconditionArr"
          :defaultValue="'recondition'" 
          :defaultLable="'reconditionZh'"
          >
        </Select>
         <el-form-item label="选择时间：" prop="time" class="datatime-item">
          <div class="block">
            <el-date-picker
              type="datetimerange" 
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :name="['startTime', 'endTime']"
              v-model="queryParams.time"
              :clearable="false"
              range-separator="至"
              :picker-options="pickerOptions2">
            </el-date-picker>
          </div>
        </el-form-item>
        <Select 
          v-show="showCustomerCondition||showMarginCondition"
          :originArr="loginName" 
          :defaultValue="'loginName'" 
          :defaultLable="'customerName'"
          :searchInput="true"
          :isAll="showMarginCondition"
          :labelTitle="'客户名称'">
        </Select>
        <Select
          v-show="showCustomerCondition||showSourceCondition||showMarginCondition"
          :originArr="allAbilityInfoArr" 
          :defaultValue="'serviceName'" 
          :defaultLable="'serviceNamezh'"
          :searchInput="true"
          @changeInputValue="changeService"
          :labelTitle="'接口类型'">
        </Select>
        <Select
          v-show="showSourceCondition"
          :originArr="supplilerInfoArr" 
          :defaultValue="'dataSourceName'" 
          :defaultLable="'dataSourceName'"
          :searchInput="true"
          :labelTitle="'数据源'">
        </Select>
        <el-form-item class="query-item">
          <query-button @reset="reset" @submit="onSubmit"></query-button>
          <el-button class="query-button" type="primary" @click="downFile" plain>下载</el-button>
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
          :columns="columns" 
          ref="table" :tableData="tableData" 
          :mergeCell="showMarginCondition?'loginName':''"
          :showSummary="false" :tatalPage="tableData.length" 
          v-show="tableData.length">

        </Table>
      </div>
    </div>
</div>
</template>

<script>
/**
 * 后台对接 门淑敏
 * 
 * 当选择客户账单时  显示的条件为开始结束时间  客户名称（不包括全部） 接口类型
 * 
 * 当选择利润查询时  显示的条件为开始结束时间  客户名称（包括全部） 接口类型
 * 
 * 当选择利数据源时  显示的条件为开始结束时间  接口类型  数据源
 */
import Table from '../../base/Table'
import { showModal } from '../../utils'
import Select from '../../base/Select'
import QueryButton from '../../base/QueryButton'
import { $http, $downFile } from '../../common/js/ajax.js'
import { hotKeyTime, loginName } from '../../common/js/mixin'
export default {
  mixins: [ hotKeyTime, loginName ],
  data () {
    return {
      reconditionArr: [],
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
      },
      allAbilityInfoArr: [],
      supplilerInfoArr: [],
      showCustomerCondition: true,
      showMarginCondition: false,
      showSourceCondition: false,
      tableData: [],
      columns: [],
      columns1: [{
        prop: 'dateTime',
        label: '日期'
      }, {
        prop: 'totalCount',
        label: '总调用量'
      }, {
        prop: 'chargeCount',
        label: '计费用量'
      }],
      columns2: [{
        prop: 'loginName',
        label: '客户名称'
      },{
        prop: 'dataSourceName',
        label: '数据源名称'
      },{
        prop: 'upChargeCount',
        label: '计费用量'
      }]
    }
  },
  components: {
    Table,
    Select,
    QueryButton
  },
  methods: {
    changeService (value) {
      if (this.showSourceCondition) {
        this.getAbilitySupplilerInfo({serviceId: value.serviceId})
      }
    },
    changeCondition (value) { // 
      this.tableData = []
      if (value.recondition === 'customer') {
        this.showCustomerCondition = true
        this.showMarginCondition = false
        this.showSourceCondition = false

        let localLoginName = [...this.loginName]
        this.loginName = [...localLoginName]

      } else if (value.recondition === 'up') {
        this.showCustomerCondition = false
        this.showMarginCondition = false
        this.showSourceCondition = true
        this.getAbilitySupplilerInfo({serviceId: this.allAbilityInfoArr[0].serviceId})
      } else {
        this.showCustomerCondition = false
        this.showMarginCondition = true
        this.showSourceCondition = false
        let localLoginName = [...this.loginName]
        this.loginName = [...localLoginName]
      }
    },
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
      this.columns = []
     
      this.queryReconciliation(options)
    },
    getAllAbilityInfo () {
      $http(this.API.callbackServiceApi.getAllAbilityInfo, {}, 'get').then((res) => {
        this.allAbilityInfoArr = []
        this.allAbilityInfoArr = res.resData
      })
    },
    getAbilitySupplilerInfo (options) {
      $http(this.API.callbackServiceApi.getAbilitySupplilerInfo, options).then((res) => {
        this.supplilerInfoArr = []
        res.resData.supplierServiceInfos.forEach(v => {
          this.supplilerInfoArr.push({
            dataSourceName: v.supplierChannelName.split('.')[0]
          })
        })
      })
    },
    queryReconciliation(options) {
      $http(this.API.callbackServiceApi[options.recondition+'Count'], options).then((res) => {
        this.tableData = []
        if (options.recondition === 'margin') {
          this.columns = [...this.columns2]
              if (res.resData.length) {
            res.resData.forEach(v => {
              if (v.dataSourceInfo.length) {
                v.dataSourceInfo.forEach(v1 => {
                  this.tableData.push({
                    loginName: v.loginName,
                    dataSourceName: v1.dataSourceName,
                    upChargeCount: v1.upChargeCount
                  })
                })
              }
            })
          }
        } else {
          this.tableData = res.resData
          this.columns = [...this.columns1]
      
        }
      })
    },
    downFile () {
      let options = {} 
      this.$refs.querForm.$el.querySelectorAll('input').forEach(v => {
        if (v.name) {
          options[v.name] = v.value
        }
      })
      if (options.recondition === 'margin') {
        if(options.loginName === '') {
          showModal('请选择客户名称', 'warning')
          return
        }
      }
      $downFile(this.API.callbackServiceApi[options.recondition+'Detail'], options)

    }
  },
  mounted() {
    setTimeout(() => {
      this.reconditionArr = [{
        reconditionZh: '客户账单',
        recondition: 'customer',
      },{
        reconditionZh: '利润查询',
        recondition: 'margin',
      }, {
        reconditionZh: '数据源账单',
        recondition: 'up',
      }]
    }, 20)
    this.getAllAbilityInfo()
  }
}
</script>

<style lang="stylus" scoped>
  .datatime-item
    width 54%
</style>
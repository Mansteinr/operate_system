<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container">
        <el-form :inline="true"  ref="querForm" :rules="rules" :model="queryParams" class="query-form">
          <el-form-item label="选择时间：" prop="time">
            <div class="block">
              <el-date-picker
                type="daterange" 
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :name="['start', 'end']"
                v-model="queryParams.time"
                :clearable="false"
                range-separator="至"
                :picker-options="pickerOptions2">
              </el-date-picker>
            </div>
          </el-form-item>
          <serviceSelect 
            :labelTitle="'接口类型'" 
            :originArr="services" 
            :defaultValue="'serviceName'" 
            :searchInput=true
            :isMultiple=true
            :isAll=true
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
        <el-button-group>
          <el-button :type="tabFlag?'':'primary'" :class="tabFlag?'':'active'" @click="switchTab(false)">图表</el-button>
          <el-button :type="tabFlag?'primary':''" :class="tabFlag?'active':''"  @click="switchTab(true)">数据</el-button>
        </el-button-group>
      </div>
      <div class="card-container">
        <div v-show="!tabFlag && !tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <div v-show="!tabFlag && tableData.length" class="charts" ref="charts" style="height:400px;width:100%;"></div>
        <Table ref="table" class="table" :tableData="tableData" :tatalPage="tableData.length" v-show="tabFlag" :columns="columns">
        </Table>
      </div>
    </div>
    <div class="card-wrapper card-content">
      <div class="card-title">
        查询结果
        <el-button-group>
          <el-button :type="tabFlag2?'':'primary'" :class="tabFlag2?'':'active'" @click="switchTab2(false)">图表</el-button>
          <el-button :type="tabFlag2?'primary':''" :class="tabFlag2?'active':''"  @click="switchTab2(true)">数据</el-button>
        </el-button-group>
      </div>
      <div class="card-container">
        <div v-show="!tabFlag2 && !tableData2.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <div v-show="!tabFlag2 && tableData2.length" class="charts" ref="charts2" style="height:400px;width:100%;"></div>
        <Table class="table" :tableData="tableData2" :tatalPage="tableData2.length" v-show="tabFlag2" :columns="columns1">
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import { $http } from '../../../common/js/ajax'
import { setColumnData, renderChart } from '../../../common/js/myCharts'
import { switchMixin, hotKeyTime, services } from '../../../common/js/mixin'
import Table from '../../../base/Table'
import serviceSelect from '../../../base/Select'
import QueryButton from '../../../base/QueryButton'
import { reset } from '../../../utils'
export default {
  mixins: [switchMixin, hotKeyTime, services],
  data () {
    return {
      columns1: [{
        prop: 'customerName',
        label: '下游客户名称(中文)'
      }, {
        prop: 'loginName',
        label: '下游客户名称'
      },{
        prop: 'usedCount',
        label: '总调用次数',
        sortable: true,
      },{
        prop: 'chargeUsedCount',
        sortable: true,
        label: '计费条数'
      },{
        prop: 'cost',
        sortable: true,
        formatter: (row, column) => {
          return row[column.property].toFixed(4)
        },
        label: '下游计费'
      }],
      columns: [{
        prop: 'company',
        label: '上游公司名称'
      }, {
        prop: 'usedCount',
        sortable: true,
        label: '总调用条数'
      },{
        prop: 'chargeUsedCount',
        label: '计费条数',
        sortable: true,
      },{
        prop: 'cost',
        sortable: true,
        formatter: (row, column) => {
          return row[column.property].toFixed(4)
        },
        label: '小视入账'
      }],
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
      },
      tableData: [],
      tableData2: [],
      titleTips: ''
    }
  },
  components: {
    Table,
    QueryButton,
    serviceSelect
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
      reset()
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
      } 
      delete options.serviceName
      console.log(options)
      this.getOutServiceChargeInfo(options)
    },
    getOutServiceChargeInfo (options) {
      $http(this.API.upApi.getOutServiceChargeInfo, options).then((res) => {
        // table?
        this.tableData = res.resData.companyList
        this.tableData2 = res.resData.customerList
        // 图标
        let xAxisData = [], series1= [{
            name: '金额',
            type: 'bar',
            data:[]
          },{
            name: '上游调用条数',
            type: 'bar',
            data:[]
          },{
            name: '上游计费条数',
            type: 'bar',
            data:[]
          }], series2= [{
            name: '金额',
            type: 'bar',
            data:[]
          },{
            name: '下游调用条数',
            type: 'bar',
            data:[]
          },{
            name: '下游计费条数',
            type: 'bar',
            data:[]
          }], xFild = []
        this.tableData.forEach(v => {
          xAxisData.push(v.company)
          series1[0].data.push(v.cost)
          series1[1].data.push(v.usedCount)
          series1[2].data.push(v.chargeUsedCount)
        })
        this.tableData2.forEach(v => {
          xFild.push(v.loginName)
          series2[0].data.push(v.cost)
          series2[1].data.push(v.usedCount)
          series2[2].data.push(v.chargeUsedCount)
        })
        renderChart(this.$refs.charts, setColumnData( '下游客户调用',xAxisData, series1))
        renderChart(this.$refs.charts2, setColumnData( '下游客户调用',xFild, series2))
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

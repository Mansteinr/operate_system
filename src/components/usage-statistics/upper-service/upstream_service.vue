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
                v-model="queryParams.time"
                range-separator="至"
                :picker-options="pickerOptions2">
              </el-date-picker>
            </div>
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
        <el-button-group>
          <el-button :type="tabFlag?'':'primary'" :class="tabFlag?'':'active'" @click="switchTab(false)">图表</el-button>
          <el-button :type="tabFlag?'primary':''" :class="tabFlag?'active':''"  @click="switchTab(true)">数据</el-button>
        </el-button-group>
      </div>
      <div class="card-container">
        <div v-show="!tabFlag && !tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <div v-show="!tabFlag && tableData.length" class="charts" ref="charts" style="height:400px;width:100%;"></div>
        <Table ref="table" class="table" :tableData="tableData" :tatalPage="tableData.length" v-show="tabFlag">
          <el-table-column
            label="上游公司名称"
            prop="company">
          </el-table-column>
          <el-table-column
            label="总调用条数"
            prop="usedCount">
          </el-table-column>
          <el-table-column
            label="计费条数"
            sortable
            prop="chargeUsedCount">
          </el-table-column>
          <el-table-column
            label="小视入账"
            sortable
            :formatter="formatter"
            prop="cost">
          </el-table-column>
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
        <Table class="table" :tableData="tableData2" :tatalPage="tableData2.length" v-show="tabFlag2">
          <el-table-column
            label="下游客户名称（中文）"
            prop="customerName">
          </el-table-column>
          <el-table-column
            label="下游客户名称"
            prop="loginName">
          </el-table-column>
          <el-table-column
            label="总调用次数"
            sortable
            prop="usedCount">
          </el-table-column>
          <el-table-column
            label="计费条数"
            sortable
            prop="chargeUsedCount">
          </el-table-column>
          <el-table-column
            label="下游计费"
            sortable
            :formatter="formatter"
            prop="cost">
          </el-table-column>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import $http from '../../../common/js/ajax'
import { setColumnData, renderChart } from '../../../common/js/myCharts'
import { switchMixin, hotKeyTime, services } from '../../../common/js/mixin'
import Table from '../../../base/Table'
import QueryButton from '../../../base/QueryButton'
let isNull = false
export default {
  mixins: [switchMixin, hotKeyTime, services],
  data () {
    return {
      allFlag: true,
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
        serviceNames: []
      },
      tableData: [],
      tableData2: [],
      titleTips: ''
    }
  },
  components: {
    Table,
    QueryButton
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
      this.queryParams.serviceNames = this.services[0].serviceName
    },
    onSubmit () {
      this.$refs.querForm.validate((valid) => {
        if (valid) {
          this.resetTabFlag()
          this.getOutServiceChargeInfo()
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
    getOutServiceChargeInfo () {
      if (this.queryParams.serviceNames.length === 1 && !this.queryParams.serviceNames[0]) {
        this.queryParams.serviceNames = []
        isNull = true
      }
      $http(this.API.upApi.getOutServiceChargeInfo, this.queryParams).then((res) => {
        this.queryParams.serviceNames.push('')
        isNull = false
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
        // }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

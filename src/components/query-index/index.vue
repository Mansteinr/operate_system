<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container">
        <el-form :inline="true" :rules="rules" :model="queryParams" ref="querForm" class="query-form">
          <el-form-item label="选择时间：" prop="time">
            <div class="block">
              <el-date-picker
                v-model="queryParams.time"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2">
              </el-date-picker>
            </div>
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
        <div v-show="!tabFlag && tableData.length" class="charts" ref="charts1" style="height:400px;width:100%;"></div>        
        <Table ref="table" class="table" :tableData="tableData" :tatalPage="tableData.length" v-show="tabFlag">
          <el-table-column
            label="使用日期"
            sortable
            prop="dayTime">
          </el-table-column>
          <el-table-column
            label="共计使用量"
            sortable
            prop="usedCount">
          </el-table-column>
          <el-table-column
            label="计费使用量"
            sortable
            prop="downChargedCount">
          </el-table-column>
          <el-table-column
            label="消费金额"
            sortable
            :formatter="formatter"
            prop="downCost">
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
       <div v-show="!tabFlag2 && !tableData2.length" class="no-charts" style="height:400px;width:100%;"></div>
        <div v-show="!tabFlag2 && tableData2.length" class="charts" ref="charts2" style="height:400px;width:100%;"></div> 
        <Table class="table" :tableData="tableData2" :tatalPage="tableData2.length" v-show="tabFlag2">
          <el-table-column
            label="客户名称"
            prop="customerName">
          </el-table-column>
          <el-table-column
            label="共计使用量"
            sortable
            prop="usedCount">
          </el-table-column>
          <el-table-column
            label="计费使用量"
            sortable
            prop="downChargedCount">
          </el-table-column>
          <el-table-column
            label="消费金额"
            sortable
            :formatter="formatter"
            prop="downCost">
          </el-table-column>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import $http from '../../common/js/ajax'
import { setLineData, renderChart } from '../../common/js/myCharts'
import echarts from 'echarts'
import { switchMixin, hotKeyTime } from '../../common/js/mixin'
import Table from '../../base/Table'
import QueryButton from '../../base/QueryButton'
export default {
  mixins: [switchMixin, hotKeyTime],
  data () {
    return {
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
      },
      tableData: [],
      tableData2: []
    }
  },
  components: {
    Table,
    QueryButton
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
    },
    onSubmit () {
      this.$refs.querForm.validate((valid) => {
        if (valid) {
          this.resetTabFlag()
          this.initFun()
        }
      })
    },
    initFun () {
      this.UsageByDate()
      this.UsageByCustomer()
    },
    formatter (val) {
      return this.$refs.table.formatter(val)
    },
    UsageByDate () {
      $http(this.API.downApi.UsageByDate, this.queryParams).then((res) => {
        let xAxisData = [], series= [{
              name: '共计使用量',
              data:[]
            },{
              name: '计费使用量',
              data:[]
            },{
              name: '消费金额',
              data:[]
            }]
        this.tableData = res.resData
        if (this.tableData.length) {
          this.tableData.forEach(v => {
            xAxisData.push(v.dayTime)
            series[0].data.push(v.usedCount)
            series[1].data.push(v.downChargedCount)
            series[2].data.push(Math.floor(v.downCost * 100) / 100)
          })
          renderChart(this.$refs.charts1, setLineData('总体情况-按日期统计', xAxisData, series))
        }
      })
    },
    UsageByCustomer () {
      $http(this.API.downApi.UsageByCustomer, this.queryParams).then((res) => {
        let xAxisData = [], series= [{
              name: '共计使用量',
              data:[]
            },{
              name: '计费使用量',
              data:[]
            },{
              name: '消费金额',
              data:[]
            }]
        this.tableData2 = res.resData
        if (this.tableData2.length) {
          this.tableData2.forEach(v => {
            xAxisData.push(v.customerName)
            series[0].data.push(v.usedCount)
            series[1].data.push(v.downChargedCount)
            series[2].data.push(Math.round(v.downCost * 100) / 100)
          })
          renderChart(this.$refs.charts2, setLineData('总体情况-按客户统计', xAxisData, series))
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

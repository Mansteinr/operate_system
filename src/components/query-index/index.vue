<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="选择时间：">
            <div class="block">
              <el-date-picker
                v-model="time"
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
          <el-form-item class="card-query">
            <el-button type="primary" @click="onSubmit" round>查询</el-button>
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
        <div v-show="!tabFlag" :class="tableData.length ?'':'no-charts'" ref="charts" style="height:400px;width:100%;"></div>
        <Table class="table" :tableData="tableData" :tatalPage="tableData.length" v-show="tabFlag">
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
        <div v-show="!tabFlag2" :class="tableData2.length ?'':'no-charts'" ref="charts2" style="height:400px;width:100%;"></div>
        <Table class="table" :tableData="tableData2" :tatalPage="tableData2.length" v-show="tabFlag2">
          <el-table-column
            label="客户名称"
            sortable
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
let chartsArr = []
export default {
  mixins: [switchMixin, hotKeyTime],
  data () {
    return {
      formInline: {
        user: '',
        region: ''
      },
      tableData: [],
      tableData2: []
    }
  },
  mounted () {
    this.initFun()
    window.onresize = function () {
      for (var i = 0; i < chartsArr.length; i++) {
        chartsArr[i].resize()
      }
    }
  },
  components: {
    Table
  },
  methods: {
    onSubmit () {
      this.chartsArr = []
      this.initFun()
    },
    initFun () {
      this.UsageByDate()
      this.UsageByCustomer()
    },
    UsageByDate () {
      let data = {
        start: moment(this.time[0]).format('YYYY-MM-DD'),
        end: moment(this.time[1]).format('YYYY-MM-DD')
      }
      $http(this.API.upApi.UsageByDate, data).then((res) => {
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
          this.tableData.forEach((v, k) => {
            xAxisData.push(v.dayTime)
            series[0].data.push(v.usedCount)
            series[1].data.push(v.downChargedCount)
            series[2].data.push(Math.floor(v.downCost * 100) / 100)
          })
          let charts = renderChart(this.$refs.charts, setLineData('总体情况-按日期统计', xAxisData, series))
          chartsArr.push(charts)
        }
      })
    },
    UsageByCustomer () {
      let data = {
        start: moment(this.time[0]).format('YYYY-MM-DD'),
        end: moment(this.time[1]).format('YYYY-MM-DD')
      }
      $http(this.API.upApi.UsageByCustomer, data).then((res) => {
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
          this.tableData2.forEach((v, k) => {
            xAxisData.push(v.customerName)
            series[0].data.push(v.usedCount)
            series[1].data.push(v.downChargedCount)
            series[2].data.push(Math.floor(v.downCost * 100) / 100)
          })
          let charts = renderChart(this.$refs.charts2, setLineData('总体情况-按客户统计', xAxisData, series))
          chartsArr.push(charts)
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

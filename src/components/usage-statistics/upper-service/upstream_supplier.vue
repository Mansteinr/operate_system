<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container">
        <el-form :inline="true"  ref="querForm" :model="queryParams" class="query-form">
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
          <el-form-item label="供应商名称：" prop="companyName">
            <el-select @change="changeType" v-model="queryParams.companyName" placeholder="请选择">
              <el-option
                v-for="v in businessType"
                :key=""
                :label="v"
                :value="v">
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
  </div>
</template>

<script>
import $http from '../../../common/js/ajax'
import { setLineData, renderChart } from '../../../common/js/myCharts'
import echarts from 'echarts'
import { switchMixin, hotKeyTime, loginName, services } from '../../../common/js/mixin'
import Table from '../../../base/Table'
import QueryButton from '../../../base/QueryButton'
export default {
  mixins: [switchMixin, hotKeyTime, businessType],
  data () {
    return {
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
        companyName: ''
      },
      tableData: []
    }
  },
  components: {
    Table,
    QueryButton
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
      this.queryParams.serviceName = this.services[0].serviceName
    },
    onSubmit () {
      this.UsageByDate()
    },
    UsageByDate () {
      $http(this.API.upApi.UsageByDate, this.queryParams).then((res) => {
        let xAxisData = [], 
          series= [{
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
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

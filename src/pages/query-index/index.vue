<template>
  <div class="template-wrapper">
    <Inquiry
      :queryParams="queryParams"
      >
      <el-form-item :label="$t('m.basics.datePickerLabel')" prop="time">
        <div class="block">
          <el-date-picker
            v-model="queryParams.time"
            type="daterange"
            align="right"
            unlink-panels
            :clearable="false"
            :range-separator="$t('m.basics.datePickerRangeSeparator')"
            :name="['start', 'end']"
            :start-placeholder="$t('m.basics.datePickerStartPlaceholder')"
            :end-placeholder="$t('m.basics.datePickerEndPlaceholder')"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </div>
      </el-form-item>
    </Inquiry>
    <div class="card-wrapper card-content">
      <div class="card-title">
        {{$t('m.basics.resultCardTitle')}}
      </div>
      <div class="card-container">
        <el-tabs type="card" class="mv-tabs">
          <el-tab-pane
            :label="$t('m.basics.switchTabTable')"
          >
            <Table ref="table" 
              class="table table1" 
              :tableData="tableData" 
              :tatalPage="tableData.length" 
              :columns="columns">
            </Table>
          </el-tab-pane>
          <el-tab-pane
            :label="$t('m.basics.switchTabChart')"
          >
            <div class="charts" ref="charts1" style="height:400px;width:100%;"></div>  
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="card-wrapper card-content">
      <div class="card-title">
        {{$t('m.basics.resultCardTitle')}}
        <el-button-group>
          <el-button :type="tabFlag2?'':'primary'" :class="tabFlag2?'':'active'" @click="switchTab2(false)">{{$t('m.basics.switchTabChart')}}</el-button>
          <el-button :type="tabFlag2?'primary':''" :class="tabFlag2?'active':''"  @click="switchTab2(true)">{{$t('m.basics.switchTabTable')}}</el-button>
        </el-button-group>
      </div>
      <div class="card-container">
       <div v-show="!tabFlag2 && !tableData2.length" class="no-charts" style="height:400px;width:100%;"></div>
        <div v-show="!tabFlag2 && tableData2.length" class="charts" ref="charts2" style="height:400px;width:100%;"></div> 
        <Table class="table table2" 
          :tableData="tableData2" 
          :tatalPage="tableData2.length" 
          v-show="tabFlag2" 
          :selector="'table2'" 
          :columns="columns1">
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import Inquiry from '@/components/Inquiry'
import Table from '../../base/Table'
import { $http } from '../../common/js/ajax'
import QueryButton from '../../base/QueryButton'
import { switchMixin, hotKeyTime } from '../../common/js/mixin'
import { setLineData, renderChart } from '../../common/js/myCharts'
export default {
  mixins: [switchMixin, hotKeyTime],
  data () {
    return {
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
      },
      tableData: [],
      tableData2: [],
      columns: [{
        prop: 'dayTime',
        sortable: true,
        label: this.$t('m.basics.dayTime')
      },{
        prop: 'usedCount',
        sortable: true,
        label: this.$t('m.basics.usedCount')
      },{
        prop: 'downChargedCount',
        sortable: true,
        label: this.$t('m.basics.downChargedCount')
      },{
        prop: 'downCost',
        sortable: true,
        formatter: (row, column) => {
          return row[column.property].toFixed(4)
        },
        label: this.$t('m.basics.downCost')
      }],
      columns1: [{
        prop: 'customerName',
        sortable: true,
        label: this.$t('m.basics.customerName')
      },{
        prop: 'usedCount',
        sortable: true,
        label: this.$t('m.basics.usedCount')
      },{
        prop: 'downChargedCount',
        sortable: true,
        label: this.$t('m.basics.downChargedCount')
      },{
        prop: 'downCost',
        sortable: true,
        formatter: (row, column) => {
          return row[column.property].toFixed(4)
        },
        label: this.$t('m.basics.downCost')
      }]
    }
  },
  components: {
    Table,
    Inquiry,
    QueryButton
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
      this.initFun(options)
    },
    initFun (options) {
      this.UsageByDate(options)
      this.UsageByCustomer(options)
    },
    UsageByDate (options) {
      $http(this.API.downApi.UsageByDate, options).then((res) => {
        let xAxisData = [], series= [{
              name: this.$t('m.basics.usedCount'),
              data:[]
            },{
              name: this.$t('m.basics.downChargedCount'),
              data:[]
            },{
              name: this.$t('m.basics.downCost'),
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
          renderChart(this.$refs.charts1, setLineData(this.$t('m.basics.UsageByDateChartTitle'), xAxisData, series))
        }
      })
    },
    UsageByCustomer (options) {
      $http(this.API.downApi.UsageByCustomer, options).then((res) => {
        let xAxisData = [], series= [{
              name: this.$t('m.basics.usedCount'),
              data:[]
            },{
              name: this.$t('m.basics.downChargedCount'),
              data:[]
            },{
              name: this.$t('m.basics.downCost'),
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
          renderChart(this.$refs.charts2, setLineData(this.$t('m.basics.UsageByCustomerChartTitle'), xAxisData, series))
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
.mv-tabs
  position relative
  overflow hidden
  .el-tabs__header
    position absolute
    right 0
  .el-tabs__content
    margin-top 45px
</style>

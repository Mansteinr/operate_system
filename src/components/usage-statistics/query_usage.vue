<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container">
        <el-form :inline="true" ref="querForm" :model="queryParams" class="query-form">
          <el-form-item label="选择时间：" prop="time">
            <div class="block">
              <el-date-picker
                type="daterange" 
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :name="['start', 'end']"
                v-model="queryParams.time"
                range-separator="至"
                :picker-options="pickerOptions2">
              </el-date-picker>
            </div>
          </el-form-item>
          <Select 
            ref='select'
            :labelTitle="'行业类型'" 
            :originArr="businessType" 
            :defaultValue="'typeId'" 
            :defaultLable="'typeName'"
            :isAll = true
            @changeInputValue="changeType"> 
          </Select>
          <loginNameSelect 
            ref="loginNameSelect"
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
            :searchInput = true
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
        <Table class="table1" :tableData="tableData" :tatalPage="tableData.length" v-show="tabFlag">
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
import { $http } from '../../common/js/ajax'
import { setLineData, renderChart } from '../../common/js/myCharts'
import { reset } from '../../utils'
import { switchMixin, hotKeyTime, businessType, loginName, services } from '../../common/js/mixin'
import Table from '../../base/Table'
import Select from '../../base/Select'
import loginNameSelect from '../../base/Select'
import serviceSelect from '../../base/Select'
import QueryButton from '../../base/QueryButton'
export default {
  mixins: [switchMixin, hotKeyTime, businessType, loginName, services],
  data () {
    return {
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
      },
      tableData: [],
      coloums: [{
        field: 'dayTime',
        sortable: true,
        title: '使用日期'
      }, {
        field: 'usedCount',
        sortable: true,
        title: '共计使用量'
      },{
        field: 'downChargedCount',
        title: '计费使用量',
        sortable: true,
      },{
        field: 'downCost',
        sortable: true,
        title: '消费金额'
      }]
    }
  },
  components: {
    Table,
    Select,
    QueryButton,
    serviceSelect,
    loginNameSelect
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
      reset()
    },
    onSubmit () {
      let options = {}
      document.querySelectorAll('form input').forEach(v => {
        if (v.name && v.name != 'typeId') {
          options[v.name] = v.value
        }
      })
      this.UsageByDate(options)
    },
    UsageByDate (options) {
      $http(this.API.downApi.UsageByDate, options).then((res) => {
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
          this.tableData.forEach(v => {
            xAxisData.push(v.dayTime)
            series[0].data.push(v.usedCount)
            series[1].data.push(v.downChargedCount)
            series[2].data.push(Math.floor(v.downCost * 100) / 100)
          })
          renderChart(this.$refs.charts, setLineData('总体情况-按日期统计', xAxisData, series))
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

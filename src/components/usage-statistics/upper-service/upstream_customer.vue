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
          <el-form-item label="行业类型：" prop="type">
            <el-select @change="changeType" v-model="queryParams.type" placeholder="请选择">
              <el-option
                v-for="v in businessType"
                :key="v.typeId"
                :label="v.typeName"
                :value="v.typeId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户名称：" prop="loginName">
            <el-select filterable v-model="queryParams.loginName" placeholder="请选择">
              <el-option
                v-for="v in loginName"
                :key="v.customerId"
                :title="`${v.customerName}(${v.loginName})`"
                :data-customerid="v.customerId"
                :label="v.customerName"
                :value="v.loginName">
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
            label="服务名称"
            prop="outServiceName">
          </el-table-column>
          <el-table-column
            label="服务名称（中文）"
            prop="serviceNameZh">
          </el-table-column>
          <el-table-column
            label="总调用条数"
            sortable
            prop="usedCount">
          </el-table-column>
          <el-table-column
            label="计费调用量"
            sortable
            prop="chargeUsedCount">
          </el-table-column>
          <el-table-column
            label="下游计费"
            sortable
            :formatter="formatter"
            prop="downCost">
          </el-table-column>
        </Table>
      </div>
    </div>
    <div class="card-wrapper card-content"  v-show="tableData2.length">
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
            label="上游公司名称"
            prop="company">
          </el-table-column>
          <el-table-column
            label="上游总调用条数"
            sortable
            prop="usedCount">
          </el-table-column>
          <el-table-column
            label="计费条数"
            sortable
            prop="chargeUsedCount">
          </el-table-column>
          <el-table-column
            label="上游计费"
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
import $http from '../../../common/js/ajax'
import { setColumnData, renderChart, setPieData } from '../../../common/js/myCharts'
import { switchMixin, hotKeyTime, loginName, businessType } from '../../../common/js/mixin'
import Table from '../../../base/Table'
import QueryButton from '../../../base/QueryButton'
export default {
  mixins: [switchMixin, hotKeyTime, loginName, businessType],
  data () {
    return {
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
        loginName: ''
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
      this.queryParams.companyName = this.companys[0]
    },
    onSubmit () {
      this.$refs.querForm.validate((valid) => {
        if (valid) {
         this.getCustomerChargeInfo()
        }
      })
    },
    formatter(val) {
      return this.$refs.table.formatter(val)
    },
    getCustomerChargeInfo () {
      $http(this.API.upApi.getCustomerChargeInfo, this.queryParams).then((res) => {
        // 图表
        let xAxisData = [],
        series= [{
          name: '下游计费',
          type: 'bar',
          data:[]
        },{
          name: '下游总调用次数',
          type: 'bar',
          data:[]
        },{
          name: '计费条数',
          type: 'bar',
          data:[]
        }]
        this.tableData = res.resData.outServiceList
        if (this.tableData.length) {
          this.tableData.forEach(v => {
            xAxisData.push(v.outServiceName)
            series[0].data.push(v.downCost)
            series[1].data.push(v.usedCount)
            series[2].data.push(v.chargeUsedCount)
          })
        }
        let chart = renderChart(this.$refs.charts, setColumnData('下游客户调用次数和费用', xAxisData, series))
        let _this = this
        chart.on('click', function(params) {
            let index = params.dataIndex
            let sname = res.resData.outServiceList[index].outServiceName
            let list = res.resData.outServiceList[index].companyList
            let costs = [],legend = []
            _this.tableData2 = list
            let paramKey = (params.seriesName === '下游总调用次数'?'usedCount': (params.seriesName === '计费条数'?'chargeUsedCount':'cost'))
          // if (params.seriesName === '下游计费') {
            list.forEach(v => {
              let obj = {}
              for (let k in v) {
                obj.name = v['company']
                obj.value = v[paramKey]
              }
              legend.push(v.company)
              costs.push(obj)
            })
            let finalObj = {
              legend: legend,
              name: (params.seriesName === '下游总调用次数'?'总调用条数': (params.seriesName === '计费条数'?'计费条数':'上游计费')),
              data: costs
            }
            let tipTitle = (params.seriesName === '下游总调用次数'?'上游调用次数占比': (params.seriesName === '计费条数'?'下游调用次数占比':'上游调用费用详细信息'))
            renderChart(_this.$refs.charts2, setPieData(sname + tipTitle, finalObj))
       
          // }
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

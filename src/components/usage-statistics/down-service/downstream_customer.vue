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
                v-model="queryParams.time"
                range-separator="至"
                :picker-options="pickerOptions2">
              </el-date-picker>
            </div>
          </el-form-item>
          <Select 
            :labelTitle="'行业类型'" 
            :originArr="businessType" 
            :defaultValue="'typeId'" 
            :defaultLable="'typeName'"
            :isAll = true
            @changeInputValue="changeType"> 
          </Select>
          <loginNameSelect 
            :originArr="loginName" 
            :defaultValue="'loginName'" 
            :defaultLable="'customerName'"
            :searchInput=true
            :isAll=true
            :labelTitle="'客户名称'">
          </loginNameSelect>
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
        <Table class="table" :tableData="tableData" :tatalPage="tableData.length" v-show="tabFlag" :columns="columns">
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
        <Table ref="table" class="table" :tableData="tableData2" :tatalPage="tableData2.length" v-show="tabFlag2" :columns="columns1">
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import { $http } from '../../../common/js/ajax'
import { setRadiiData, renderChart } from '../../../common/js/myCharts'
import { switchMixin, hotKeyTime, loginName,businessType } from '../../../common/js/mixin'
import Table from '../../../base/Table'
import Select from '../../../base/Select'
import loginNameSelect from '../../../base/Select'
import QueryButton from '../../../base/QueryButton'
export default {
  mixins: [switchMixin, hotKeyTime, businessType, loginName],
  data () {
    return {
      columns: [{
        prop: 'serviceName',
        label: '服务名称'
      },{
        prop: 'serviceNameZh',
        label: '服务名称(中文)'
      },{
        prop: 'downChargedCount',
        sortable: true,
        label: '计费调用量（条）'
      },{
        prop: 'usedCount',
        sortable: true,
        label: '调用总量（条）'
      }],
      columns1: [{
        prop: 'serviceName',
        label: '服务名称'
      },{
        prop: 'serviceNameZh',
        label: '服务名称(中文)'
      },{
        prop: 'downCost',
        sortable: true,
        label: '调用金额',
        formatter: (row, column) => {
          return row.downCost.toFixed(4)
        }
      }],
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
      },
      tableData: [],
      tableData2: [],
    }
  },
  components: {
    Table,
    Select,
    QueryButton,
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
      options.businessType = options.typeId
      delete options.typeId
      this.UsageByName(options)
    },
    UsageByName (options) {
      $http(this.API.downApi.UsageByName, options).then((res) => {
        this.tableData = res.resData
        this.tableData2 = res.resData
        let pieCount = {}, pieCharge ={}
        this.tableData.sort((a, b) => {
          return -(a.downChargedCount - b.downChargedCount)
        })
        this.tableData.forEach((v, k) => { //取前10名
          if (k <= 10) {
            pieCount[v.serviceNameZh] = v.downChargedCount
          }
        })
        this.tableData2.sort((a, b) => {
          return -(a.downCost - b.downCost)
        })
        this.tableData2.forEach((v, k) => {
          if (k <= 10 ){
            pieCharge[v.serviceNameZh] = v.downCost
          }
        })
        renderChart(this.$refs.charts, setRadiiData( 'Top10各服务计费调用数量占比','计费调用数量', pieCount))
        renderChart(this.$refs.charts2, setRadiiData( 'Top10各服务调用金额占比','计费调用数量', pieCharge))
      })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

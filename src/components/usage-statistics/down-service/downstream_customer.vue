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
                @click.native.stop="changeCustomer(v)"
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
        <Table class="table" :tableData="tableData" :tatalPage="tableData.length" v-show="tabFlag">
          <el-table-column
            label="服务名称"
            prop="serviceName">
          </el-table-column>
          <el-table-column
            label="服务名称(中文)"
            prop="serviceNameZh">
          </el-table-column>
          <el-table-column
            label="计费调用量（条）"
            sortable
            prop="downChargedCount">
          </el-table-column>
          <el-table-column
            label="调用总量（条）"
            sortable
            prop="usedCount">
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
        <Table ref="table" class="table" :tableData="tableData2" :tatalPage="tableData2.length" v-show="tabFlag2">
          <el-table-column
            label="服务名称"
            prop="serviceName">
          </el-table-column>
          <el-table-column
            label="服务名称(中文)"
            prop="serviceNameZh">
          </el-table-column>
          <el-table-column
            label="调用金额"
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
import { setRadiiData, renderChart } from '../../../common/js/myCharts'
import { switchMixin, hotKeyTime, loginName,businessType } from '../../../common/js/mixin'
import Table from '../../../base/Table'
import QueryButton from '../../../base/QueryButton'
export default {
  mixins: [switchMixin, hotKeyTime, businessType, loginName],
  data () {
    return {
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
        loginName: '',
        type: ''
      },
      tableData: [],
      tableData2: [],
    }
  },
  components: {
    Table,
    QueryButton
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
      this.queryParams.loginName = this.loginName[0]
    },
    onSubmit () {
      this.$refs.querForm.validate((valid) => {
        if (valid) {
          this.resetTabFlag()
          this.UsageByName()
        }
      })
    },
    formatter(val) {
      return this.$refs.table.formatter(val)
    },
    UsageByName () {
      $http(this.API.downApi.UsageByName, this.queryParams).then((res) => {
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

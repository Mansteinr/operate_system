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
          <el-form-item label="接口类型：" prop="serviceName">
            <el-select v-model="queryParams.serviceName" placeholder="请选择">
              <el-option
                v-for="v in services"
                :key="v.serviceId"
                :label="v.serviceNameZh"
                :value="v.serviceName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="统计维度：" prop="timesAndMoneyUsed">
            <el-radio v-model="queryParams.timesAndMoneyUsed" label="customer">按客户</el-radio>
            <el-radio v-model="queryParams.timesAndMoneyUsed" label="business">按行业</el-radio>
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
            label="客户名称"
            prop="Name">
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
            label="客户名称"
            prop="Name">
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
import { $http } from '../../../common/js/ajax'
import { setRadiiData, renderChart } from '../../../common/js/myCharts'
import { switchMixin, hotKeyTime, services } from '../../../common/js/mixin'
import Table from '../../../base/Table'
import QueryButton from '../../../base/QueryButton'
import { toFixed } from '../../../utils'
export default {
  mixins: [switchMixin, hotKeyTime, services],
  data () {
    return {
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
        serviceName: '',
        timesAndMoneyUsed: 'customer'
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
          this.UsageByCustomer()
        }
      })
    },
    formatter(val) {
      return this.$refs.table.formatter(val)
    },
    UsageByCustomer () {
      $http(this.API.downApi.UsageByCustomer, this.queryParams).then((res) => {
        if(this.queryParams.timesAndMoneyUsed === 'business') {
          let objBusiness = {}, businessArray = []
          res.resData.forEach(v => {
            if (objBusiness.hasOwnProperty(v.customerTypeZh)) {
              objBusiness[v.customerTypeZh].push(v)
            } else {
              objBusiness[v.customerTypeZh] = [v]
            }
          })

          for (let k in objBusiness) {
            let obj = {}, arr = objBusiness[k]
            obj.Name = k
            obj.downChargedCount = 0
            obj.downCost = 0
            obj.usedCount = 0
            arr.forEach(v => {
              obj.downChargedCount += v.downChargedCount
              obj.downCost += toFixed(v.downCost)
              obj.usedCount += v.usedCount
            })
            businessArray.push(obj)
          }
          this.tableData  = businessArray
          this.tableData2  = businessArray
        } else {
          let customerObj = {}, customerArr = []
          res.resData.forEach(v => {
            let name = v.customerName || v.customerName
            if (customerObj.hasOwnProperty(name)) {
              customerObj[name].push(v)
            } else {
              customerObj[name] = [v]
            }
          })
          for (let k1 in customerObj) {
            let obj = {}, arr = customerObj[k1]
            obj.Name = k1
            obj.downChargedCount = 0
            obj.downCost = 0
            obj.usedCount = 0
            arr.forEach(v => {
              obj.downChargedCount += v.downChargedCount
              obj.downCost += toFixed(v.downCost)
              obj.usedCount += v.usedCount
            })
            customerArr.push(obj)
          }
          this.tableData = customerArr
          this.tableData2 = customerArr
        }

        let pieCount = {}, pieCharge = {}
        this.tableData.sort((a, b) => { // 排序 取前十名
          return -(a.downChargedCount - b.downChargedCount)
        })

        this.tableData.forEach((v, k) => {
          if (k <= 10) {
            pieCount[v.Name] = v.downChargedCount
          }
        })

        this.tableData2.sort((a, b) => {// 排序 取前十名
          return -(a.downCost - b.downCost)
        })

        this.tableData2.forEach((v, k) => {
          if (k <= 10) {
            pieCharge[v.Name] = v.downCost
          }
        })
        console.log(pieCount)
        console.log(pieCharge)
        renderChart(this.$refs.charts, setRadiiData( '各客户计费调用数量占比','计费调用数量', pieCount))
        renderChart(this.$refs.charts2, setRadiiData( '各客户调用金额占比','调用金额', pieCharge))
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

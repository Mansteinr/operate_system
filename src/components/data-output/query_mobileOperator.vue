<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container clearfix">
        <el-form :inline="true" :rules="rules" ref="querForm" :model="queryParams" class="query-form">
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
          <el-form-item label="接口类型：" prop="serviceName">
            <el-select filterable v-model="queryParams.serviceName" placeholder="请选择">
              <el-option
                v-for="v in services"
                :key="v.serviceId"
                :title="`${v.serviceNameZh}(${v.serviceName})`"
                :label="v.serviceNameZh"
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
      </div>
      <div class="card-container">
        <div v-show="!tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <Table class="table" :tableData="tableData" :tatalPage="tableData.length" v-show="tableData.length">
          <el-table-column
            label="日期"
            sortable
            prop="date">
          </el-table-column>
          <el-table-column
            label="电信"
            sortable
            prop="电信">
          </el-table-column>
          <el-table-column
            label="联通"
            sortable
            prop="联通">
          </el-table-column>
          <el-table-column
            label="移动"
            sortable
            prop="移动">
          </el-table-column>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import $http from '../../common/js/ajax'
import echarts from 'echarts'
import { hotKeyTime, loginName, services } from '../../common/js/mixin'
import Table from '../../base/Table'
import QueryButton from '../../base/QueryButton'
export default {
  mixins: [hotKeyTime,loginName, services],
  data () {
    return {
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
        loginName: '',
        serviceName: '',
        type: ''
      },
      noAllLogin: true,
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
      this.$refs.querForm.validate((valid) => {
        if (valid) {
         this.mobileOperator()
        }
      })
    },
    mobileOperator () {
      $http(this.API.financeApi.mobileOperator, this.queryParams).then((res) => {
        let responseObj = {}
        res.resData.forEach(v => {
          v.dateUsages.forEach(v1 => {
            if (!responseObj[v1.date]) {
              responseObj[v1.date] = {
                [v.isp] :v1.num,
                "date": v1.date
              }
            } else {
              responseObj[v1.date][v.isp] = v1.num
            }
          })
        })
        for (let k in responseObj) {
          this.tableData.push(responseObj[k])
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

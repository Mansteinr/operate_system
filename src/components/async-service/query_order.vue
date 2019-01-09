<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container clearfix">
        <el-form :inline="true" :rules="rules" ref="querForm" :model="queryParams" class="query-form">
        <el-form-item label="查询条件：">
          <el-select v-model="toggelFlag" placeholder="请选择">
            <el-option
              label="订单查询"
              value="true">
            </el-option>
            <el-option
              label="vin查询"
              value="false">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item v-show="toggelFlag === 'true'" label="订单号：">
            <el-input v-model="orderId" placeholder="请输入订单号"></el-input>
          </el-form-item>
          <el-form-item v-show="toggelFlag === 'false'" label="vin码：">
            <el-input v-model="vin" placeholder="请输入vin码"></el-input>
          </el-form-item>
          <el-form-item v-show="toggelFlag === 'false'" label="客户名称：" prop="loginName">
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
          <el-form-item v-show="toggelFlag === 'false'" label="开始时间：">
             <el-date-picker
              v-model="startTime"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-show="toggelFlag === 'false'" label="结束时间：">
             <el-date-picker
              v-model="endTime"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
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
        <Table ref="table" class="table" :tableData="tableData" :tatalPage="tableData.length" :showSummary="false">
          <el-table-column
            label="客户名称"
            prop="loginname">
          </el-table-column>
          <el-table-column
            label="服务名称"
            prop="servicename">
          </el-table-column>
          <el-table-column
            label="vin码"
            prop="vin">
          </el-table-column>
          <el-table-column
            label="数据源"
            width="80"
            prop="datasourcename">
          </el-table-column>
          <el-table-column
            label="报告状态"
            width="80"
            :formatter="(row)=>{
              return row.dataFrom / 1 ? '已生成' : '未生成'
            }"
            prop="dataFrom">
          </el-table-column>
          <el-table-column
            label="创建时间"
            :formatter="formatterCreateTime"
            prop="createTime">
          </el-table-column>
          <el-table-column
            label="生成报告时间"
            :formatter="formatterUpdateTime"
            prop="updateTime">
          </el-table-column>
          <el-table-column
            label="订单状态"
            prop="status">
          </el-table-column>
          <el-table-column
            label="数据源订单"
            prop="upOrderid">
          </el-table-column>
          <el-table-column
            label="数据源订单状态"
            prop="upStatus">
          </el-table-column>
          <el-table-column label="车保报告">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                plain
                :disabled="(scope.row.dataFrom / 1) ? false: true"
                @click="handleDownMinivision(scope.row, '0')">小视</el-button>
              <el-button
                size="mini"
                type="primary"
                plain
                :disabled="(scope.row.dataFrom / 1) ? false: true"
                 @click="handleDownMinivision(scope.row, '1')">原始</el-button>
            </template>
          </el-table-column>
        </Table>
      </div>
    </div>
    <Guid :dialogVisible="dialogVisible" :data="josn" @changeDialog="changeDialog">
    
    </Guid>
  </div>
</template>

<script>
import { $http } from '../../common/js/ajax'
import Table from '../../base/Table'
import Guid from '../../base/Guid'
import QueryButton from '../../base/QueryButton'
import { loginName } from '../../common/js/mixin'
import { showModal } from '../../utils'
import moment from 'moment'
export default {
  mixins: [ loginName ],
  data () {
    let guidRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('mvTrackId不能为空'));
      } else {
        callback()
      }
    }
    let dateRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('日期不能为空'));
      } else {
        callback()
      }
    }
    return {
      rules: {
        mvTrackId: [{ validator: guidRule, trigger: 'change' }],
        date: [{ validator: dateRule, trigger: 'change' }]
      },
      queryParams: {
        loginName: ''
      },
      tableData: [],
      toggelFlag: 'true',
      orderId: '',
      vin: '',
      josn: {},
      startTime: new Date(),
      endTime: new Date(),
      dialogVisible: false
    }
  },
  components: {
    Table,
    Guid,
    QueryButton
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
    },
    onSubmit () {
      if (this.toggelFlag === 'true') {
        this.getOrderInfoById()
      } else {
        this.getOrderInfoByVin()
      }
    },
    formatterCreateTime (val) {
      return this.$refs.table.formatterTime(val['createTime'])
    },
    formatterUpdateTime (val) {
      return this.$refs.table.formatterTime(val['updateTime'])
    },
    getOrderInfoById () {
      if (!this.orderId) {
        showModal('请输入订单号', 'warning')
        return
      }
      let options = {
        orderId: this.orderId
      }
      $http(this.API.callbackServiceApi.getOrderInfoById, options).then((res) => {
        this.tableData = []
        this.tableData.push(res.resData)
      })
    },
    getOrderInfoByVin () {
      if (!this.vin) {
        showModal('请输入订单号', 'warning')
        return
      }
      let options = {
        vin: this.vin,
        loginName: this.queryParams.loginName,
        startTime: moment(this.startTime).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(this.endTime).format('YYYY-MM-DD HH:mm:ss'),
      }
      $http(this.API.callbackServiceApi.getOrderInfoByVin, options).then((res) => {
        this.tableData = []
        this.tableData.push(res.resData)
      })
    },
    changeDialog (val) {
      this.dialogVisible = val
    },
    handleDownMinivision (row, dataSource) {
      let options = {
        dataSource,
        orderId: row.orderId,
        orderCategory: '0'
      },_this = this
   
      $http(this.API.callbackServiceApi.getDecryptData, options).then((res) => {
        this.dialogVisible = true
        this.josn = JSON.parse(res.resData) || {}

      })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
  .mvTrackId
    label
      padding-right 0 !important
</style>

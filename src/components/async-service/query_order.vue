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
          <Select
            :searchInput="true"
            :labelTitle="'客户名称'"
            :originArr="loginNameOrigin"
            :defaultValue="'loginName'"
            :defaultLable="'customerName'"
            :isAll="true"
            v-show="toggelFlag === 'false'"
          ></Select>
          <el-form-item v-show="toggelFlag === 'false'" label="开始时间：">
             <el-date-picker
              v-model="startTime"
              type="datetime"
              :clearable="false"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-show="toggelFlag === 'false'" label="结束时间：">
             <el-date-picker
              v-model="endTime"
              type="datetime"
              :clearable="false"
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
        <Table ref="table"
            @handle="handle"
            :tableData="tableData" 
            :columns="columns"
            :tatalPage="tableData.length" :showSummary="false">
        </Table>
      </div>
    </div>
    <Guid
      ref='dialog'
      :dialogVisible="dialogVisible"
      :title="'报告详情'"
      :data="josn"
       @changeDialog="changeDialog"
    >
      <div id="jsoneditor"></div>
    </Guid>
  </div>
</template>

<script>
/**
 * 后台对接人 门淑敏
 */

import moment from 'moment'
import Table from '../../base/Table'
import Guid from '../../base/Guid'
import Select from '../../base/Select' // 下拉框
import { showModal } from '../../utils'
import { $http } from '../../common/js/ajax'
import QueryButton from '../../base/QueryButton'
import { loginName } from '../../common/js/mixin'


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
      disabledFlag: false,
      josn: {},
      startTime: new Date(),
      endTime: new Date(),
      dialogVisible: false,
      columns: [{
        prop: 'loginname',
        width: '120px',
        label: '客户名称'
      }, {
        prop: 'servicename',
        width: '180px',
        label: '服务名称'
      },  {
        prop: 'orderId',
        width: '300px',
        label: '订单号'
      }, {
        prop: 'vin',
        width: '180px',
        label: 'vin码'
      }, {
        prop: 'datasourcename',
        label: '数据源'
      }, {
        prop: 'dataFrom',
        width: '120px',
        label: '报告状态',
        formatter: row => {
          this.disabledFlag = row.dataFrom / 1 ? true : false
          return row.dataFrom / 1 ? '已生成报告' : '未生成报告'
        }
      }, {
        prop: 'createTime',
        label: '创建时间',
        width: '160px',
        formatter: row => {
           return this.$refs.table.formatterTime(row.createTime)
        }
      }, {
        prop: 'updateTime',
        label: '生成报告时间',
        width: '160px',
        formatter: row => {
           return this.$refs.table.formatterTime(row.updateTime)
        }
      }, {
        prop: 'status',
        width: '80px',
        label: '订单状态'
      }, {
        prop: 'upOrderid',
        width: '280px',
        label: '数据源订单'
      }, {
        prop: 'upStatus',
        width: '120px',
        label: '数据源订单状态'
      }, {
        prop: [{keyWord: '小视', method: 'handleDownMinivision'}, {keyWord: '原始', method: 'handleDownSource'}],
        width: '200px',
        disabled: this.disabledFlag,
        label: '车保报告'
      }]
    }
  },
  components: {
    Table,
    Select,
    Guid,
    QueryButton
  },
  methods: {
    handle (row, method) {
      this.handleDown(row, method == 'handleDownSource'?'1':'0')
    },
    reset () {
      this.$refs.querForm.resetFields()
    },
    onSubmit () {
      // this.index += 1
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
        this.tableData = res.resData
      })
    },
    changeDialog (val) {
      this.dialogVisible = val
    },
    handleDown (row, dataSource) {
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

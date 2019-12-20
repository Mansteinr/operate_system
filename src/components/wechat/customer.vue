<template>
  <div class="template-wrapper">
     <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container clearfix">
        <el-form :inline="true"  ref="querForm" :rules="rules" :model="queryParams" class="query-form">
          <el-form-item label="授权码：" prop="authCode">
            <el-input v-model="queryParams.authCode" placeholder="请输入授权码"></el-input>
          </el-form-item>
          
          <Select 
            :labelTitle="'客户名称'" 
            :originArr="loginName" 
            :defaultValue="'customerName'" 
            :searchInput=true
            :isAll=true
            :needValue="'customerId'"
            :defaultLable="'customerNamezh'"
            >
          </Select>
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
        <Table class="table1" 
          ref="table"
          :showSummary="false" 
          :tableData="loginName" 
          :tatalPage="loginName.length" 
          :columns="columns">
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import Table from '../../base/Table'
import Select from '../../base/Select'
import QueryButton from '../../base/QueryButton'
import { wechatCustomerInfo } from '../../common/js/mixin'

export default {
  mixins: [ wechatCustomerInfo],
  data() {
    return {
      queryParams: {
        authCode: ''
      },
      rules: {
        authCode: [
          { required: true, message: '请输入授权码', trigger: 'blur' }
        ]
      },
      columns: [{
        prop: 'customerName',
        label: '客户名称',
        width: '160px'
      }, {
        prop: 'authCode',
        label: '授权码'
      }, {
        prop: 'customerContact',
        label: '客户联系人'
      },{
        prop: 'customerMobile',
        label: '客户联系方式',
        width: '160px'
      },{
        prop: 'bussinessContact',
        label: '商务联系人'
      },{
        prop: 'customerIp',
        label: '客户IP',
        width: '160px'
      },{
        prop: 'customerPwd',
        label: '客户密码'
      },{
        prop: 'createTime',
        label: '创建时间',
        width: '160px',
        formatter: row => {
         return this.$refs.table.formatterTime(row.beginTime)
        }
      },{
        prop: 'updateTime',
        label: '更新时间',
        width: '160px',
        formatter: row => {
         return this.$refs.table.formatterTime(row.beginTime)
        }
      }]
    }
  },
  components: {
    Table,
    Select,
    QueryButton
  },
  methods: {
    onSubmit() {
      this.$refs.querForm.validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    reset() {
      this.$refs.querForm.resetFields()
    }
  }
}
</script>


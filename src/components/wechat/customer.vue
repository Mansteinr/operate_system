<template>
  <div class="template-wrapper">
     <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container clearfix">
        <el-form :inline="true"  ref="querForm" :model="queryParams" class="query-form">
          <el-form-item label="授权码：" prop="authCode">
            <el-input v-model="queryParams.authCode" placeholder="请输入授权码"></el-input>
          </el-form-item>
          <Select 
            :labelTitle="'客户名称'" 
            :originArr="loginName" 
            :defaultValue="'customerId'" 
            :searchInput=true
            :isAll=true
            @changeSelect="changeSelect"
            :vModel="queryParams.searchValue"
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
          :showPlusIcon=true
          @addFun="addFun"
          :tatalPage="loginName.length" 
          :columns="columns">
          <el-table-column
            label="操作"
            fixed="right"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
              <el-button @click="handleEditor(scope.row)" type="text" size="small">更新</el-button>
            </template>
          </el-table-column>
        </Table>
      </div>
    </div>
    <Dialog
      ref='dialog'
      :title="dialogTitle"
      :dialogShow="dialogShow" 
      @handleClose="handleClose" 
      @opened="opened"
      @determine="determine" 
      :isShowButton="true"
      :isClickModal="false">
        <el-form :model="dialogForm" :rules="dialogRules" ref="dialogForm" label-width="100px">
          <el-form-item label="客户英文名" prop="customerName">
            <el-input v-model="dialogForm.customerName" :disabled="dialogTitle === '更新'"></el-input>
          </el-form-item>
          <el-form-item label="客户中文名" prop="customerNamezh">
            <el-input v-model="dialogForm.customerNamezh"></el-input>
          </el-form-item>
          <el-form-item label="客户密码" prop="customerPwd">
            <el-input v-model="dialogForm.customerPwd"></el-input>
          </el-form-item>
          <el-form-item label="客户联系人" prop="customerContact">
            <el-input v-model="dialogForm.customerContact"></el-input>
          </el-form-item>
          <el-form-item label="客户联系方式" prop="customerMobile">
            <el-input v-model="dialogForm.customerMobile"></el-input>
          </el-form-item>
          <el-form-item label="商务联系人" prop="bussinessContact">
            <el-input v-model="dialogForm.bussinessContact"></el-input>
          </el-form-item>
          <el-form-item label="客户IP白名单" prop="customerIp">
            <el-input v-model="dialogForm.customerIp"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dialogForm.remark" type="textarea"></el-input>
          </el-form-item>
        </el-form>
    </Dialog>
  </div>
</template>

<script>
import Table from '../../base/Table'
import Select from '../../base/Select'
import Dialog from '../../base/Dialog'
import { showModal } from '../../utils'
import { $http } from '../../common/js/ajax'
import QueryButton from '../../base/QueryButton'
import { wechatCustomerInfo } from '../../common/js/mixin'

export default {
  mixins: [ wechatCustomerInfo],
  data() {
    return {
      dialogTitle: '新增',
      dialogShow: false,
      disabledFlag: false,
      queryParams: {
        authCode: '',
        customerId: ''
      },
      dialogRules: {
        customerName: [
          { required: true, message: '请输入客户英文名', trigger: 'blur' }
        ],
        customerNamezh: [
          { required: true, message: '请输入客户中文名', trigger: 'blur' }
        ],
        customerContact: [
          { required: true, message: '请输入客户联系人', trigger: 'blur' }
        ],
        customerMobile: [
          { required: true, message: '请输入客户联系方式', trigger: 'blur' }
        ],
        bussinessContact: [
          { required: true, message: '请输入商务联系人', trigger: 'blur' }
        ],
      },
      dialogForm: {
        customerName: '',
        customerNamezh: '',
        customerPwd: '',
        customerContact: '',
        customerMobile: '',
        bussinessContact: '',
        customerIp: '',
        remark: ''
      },
      columns: [{
        prop: 'customerName',
        label: '客户名称',
        width: '160px'
      }, {
        prop: 'customerNamezh',
        label: '客户中文名称',
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
    Dialog,
    Select,
    QueryButton
  },
  methods: {
    opened() {
      if(this.dialogTitle === '新增') {
        this.$refs.dialogForm.resetFields()
      }
    },
    addFun() {
      this.dialogTitle = '新增'
      this.dialogShow = true
    },
    onSubmit() {
      this.customerInfo(this.queryParams)
    },
    reset() {
      this.$refs.querForm.resetFields()
      this.queryParams.customerId = ''
      this.customerInfo(this.queryParams)
    },
    handleClose() {
      this.dialogShow = false
    },
    handleEditor(value) {
      this.dialogShow = true
      this.dialogTitle = '更新'
      Object.keys(value).forEach(k => {
        this.dialogForm[k] = value[k]
      })
    },
    handleDelete(value) {
      this.$confirm(`确定删除${value.customerNamezh}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          $http(this.API.wechatAPI.customerInfoDel, {
            customerId: value.customerId
          }).then((res) => {
            showModal(res.resMsg[0].msgText)
            this.handleClose()
            this.customerInfo()
          }).catch(() => {
            showModal('操作失败', 'error')
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })     
      })
    },
    determine() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          if(this.dialogTitle === '新增') {
            $http(this.API.wechatAPI.customerInfoAdd, this.dialogForm).then((res) => {
              showModal(res.resMsg[0].msgText)
              this.handleClose()
              this.customerInfo()
            })
          } else {
            $http(this.API.wechatAPI.customerInfoEdit, this.dialogForm).then((res) => {
              showModal(res.resMsg[0].msgText)
              this.handleClose()
              this.customerInfo()
            })
          }
        } 
      })
    },
    changeSelect(val) {
      this.queryParams.customerId = val
    }
  }
}
</script>


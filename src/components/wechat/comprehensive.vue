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
            :originArr="customerInfo" 
            :defaultValue="'customerId'" 
            :searchInput=true
            :isAll=true
            :vModel="queryParams.searchValue"
            :needValue="'customerId'"
            :defaultLable="'customerNamezh'"
            >
          </Select>
          <Select 
            :labelTitle="'服务名称'" 
            :originArr="serviceInfo" 
            :defaultValue="'serviceId'" 
            :searchInput=true
            :isAll=true
            :vModel="queryParams.searchValue"
            :needValue="'serviceId'"
            :defaultLable="'serviceNamezh'"
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
          :tableData="wechatComprehensive" 
          :showPlusIcon=true
          @addFun="addFun"
          :tatalPage="wechatComprehensive.length" 
          :columns="columns">
          <el-table-column
            label="是否计费"
            fixed="right">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.needCharge === '0' ? 'warning' : 'success'"
                  >{{scope.row.needCharge === '0' ? '否' : '是'}}</el-tag>
              </template>
          </el-table-column>
          <el-table-column
            label="是否禁用"
            fixed="right">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.forbidFlag === '0' ? 'success' : 'warning'"
                  >{{scope.row.forbidFlag === '0' ? '否' : '是'}}</el-tag>
              </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="100">
            <template slot-scope="scope">
              <el-button @click="editAuthor(scope.row)" type="text" size="small">	授权</el-button>
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
          <Select
            v-show="dialogTitle === '新增'"
            :labelTitle="'客户名称'" 
            :originArr="customerInfo" 
            :defaultValue="'customerId'" 
            :searchInput=true
            :vModel="queryParams.searchValue"
            :needValue="'customerId'"
            :defaultLable="'customerNamezh'"
            >
          </Select>
         <Select
            v-show="dialogTitle === '新增'"
            :labelTitle="'服务名称'" 
            :originArr="serviceInfo" 
            :defaultValue="'serviceId'" 
            :searchInput=true
            :vModel="queryParams.searchValue"
            :needValue="'serviceId'"
            :defaultLable="'serviceNamezh'"
            >
          </Select>
          <el-form-item label="实例Id:" prop="customerServiceId">
            <el-input v-model="dialogForm.customerServiceId" :disabled="dialogTitle === '更新'"></el-input>
          </el-form-item>
          <el-form-item label="授权次数:" prop="authTotal">
            <el-input v-model="dialogForm.authTotal"></el-input>
          </el-form-item>
          <el-form-item label="是否计费:" prop="needCharge">
            <el-radio-group v-model="dialogForm.needCharge">
              <el-radio label="0">不计费</el-radio>
              <el-radio label="1">计费</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否禁用:" prop="forbidFlag">
            <el-radio-group v-model="dialogForm.forbidFlag">
              <el-radio label="0">不禁用</el-radio>
              <el-radio label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注:" prop="remark">
            <el-input v-model="dialogForm.remark" type="textarea"></el-input>
          </el-form-item>
        </el-form>
    </Dialog>

    <Dialog
      title="授权次数"
      :dialogShow="dialogAuthlShow" 
      @handleClose="authHandleClose"
      @determine="authDetermine" 
      :isShowButton="true"
      :isClickModal="false">
        <el-form :model="dialogAuthlForm" :rules="dialogAuthlFormRules" ref="dialogAuthlForm" label-width="100px">
          <el-form-item label="授权次数:" prop="oldValue">
            <el-input v-model="dialogAuthlForm.oldValue" disabled></el-input>
          </el-form-item>
            <el-form-item label="授权方式:" prop="authType">
              <el-select v-model="dialogAuthlForm.authType" placeholder="请选择授权方式">
                <el-option label="+" value="add"></el-option>
                <el-option label="-" value="reduce"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="授权次数:" prop="authValue">
              <el-input v-model.number="dialogAuthlForm.authValue"></el-input>
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
import { wechatCustomerInfoQuery, serviceInfoQuery, wechatComprehensiveQuery } from '../../common/js/mixin'

export default {
  mixins: [ wechatCustomerInfoQuery, serviceInfoQuery, wechatComprehensiveQuery ],
  data() {
    return {
      dialogTitle: '新增',
      dialogShow: false,
      dialogAuthlShow: false,
      disabledFlag: false,
      queryParams: {
        authCode: '',
        customerId: '',
        serviceId: ''
      },
      dialogRules: {
        authTotal: [
          { required: true, message: '请输入授权次数', trigger: 'blur' },
          { type: 'number', message: '授权次数为数字值'}
        ],
        needCharge: [
          { required: true, trigger: 'blur' }
        ],
        forbidFlag: [
          { required: true, trigger: 'blur' }
        ],
      },
      dialogAuthlForm: {
        oldValue: 0,
        authType: 'add',
        authValue: null,
        customerServiceId: ''
      },
      dialogAuthlFormRules: {
        authValue: [
          { required: true, message: '请输入授权次数', trigger: 'blur' },
          { type: 'number', message: '授权次数为数字值', trigger: 'blur' }
        ]
      },
      dialogForm: {
        customerServiceId: '',
        authTotal: 0,
        customerId: '',
        serviceId: '',
        needCharge: '0',
        forbidFlag: '1',
        remark: ''
      },
      columns: [{
        prop: 'authCode',
        label: '授权码'
      }, {
        prop: 'customerNamezh',
        label: '客户名称',
        width: '300px',
        formatter: row => {
         return `${row.customerNamezh}( ${row.customerName} )`
        }
      }, {
        prop: 'serviceNamezh',
        label: '服务',
        width: '230px',
        formatter: row => {
         return `${row.serviceNamezh}( ${row.serviceName} )`
        }
      }, {
        prop: 'authTotal',
        label: '授权次数'
      }, {
        prop: 'authUsed',
        label: '已用次数'
      }, {
        prop: 'totalUsed',
        label: '总调用数'
      }, {
        prop: 'createTime',
        label: '创建时间',
        width: '160px',
        formatter: row => {
         return this.$refs.table.formatterTime(row.beginTime)
        }
      }, {
        prop: 'updateTime',
        label: '更新时间',
        width: '160px',
        formatter: row => {
         return this.$refs.table.formatterTime(row.beginTime)
        }
      }, {
        prop: 'remark',
        label: '备注'
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
        this.customerInfoQuery()
        this.serviceInfoQuery()
      }
    },
    addFun() {
      this.dialogTitle = '新增'
      this.dialogShow = true
    },
    onSubmit() {
      this.queryParams.customerId = document.querySelector('.card-container [name="customerId"]').value
      this.queryParams.serviceId = document.querySelector('.card-container [name="serviceId"]').value
      this.wechatComprehensiveQuery(this.queryParams)
    },
    reset() {
      this.$refs.querForm.resetFields()
      this.queryParams.customerId = ''
      this.queryParams.serviceId = ''
      this.wechatComprehensiveQuery(this.queryParams)
    },
    handleClose() {
      this.dialogShow = false
    },
    authHandleClose() {
      this.dialogAuthlShow = false
    },
    handleEditor(value) {
      this.dialogShow = true
      this.dialogTitle = '更新'
      Object.keys(value).forEach(k => {
        this.dialogForm[k] = value[k]
      })
    },
    editAuthor(value) {
      this.dialogAuthlShow = true
      this.dialogAuthlForm.oldValue = value.authTotal
      this.dialogAuthlForm.authValue = null
      this.dialogAuthlForm.customerServiceId = value.customerServiceId
    },
    determine() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          this.dialogForm.customerId = document.querySelector('.el-dialog__body [name="customerId"]').value
          this.dialogForm.serviceId = document.querySelector('.el-dialog__body [name="serviceId"]').value
          if(this.dialogTitle === '新增') {
            $http(this.API.wechatAPI.customerServiceInfoAdd, this.dialogForm).then((res) => {
              showModal(res.resMsg[0].msgText)
              this.handleClose()
              this.wechatComprehensiveQuery()
            })
          } else {
            $http(this.API.wechatAPI.customerServiceInfoEdit, this.dialogForm).then((res) => {
              showModal(res.resMsg[0].msgText)
              this.handleClose()
              this.wechatComprehensiveQuery()
            })
          }
        } 
      })
    },
    authDetermine() {
      this.$refs.dialogAuthlForm.validate((valid) => {
        if (valid) {
          $http(this.API.wechatAPI.customerServiceInfoEdit, this.dialogAuthlForm).then((res) => {
            showModal(res.resMsg[0].msgText)
            this.authHandleClose()
            this.wechatComprehensiveQuery()
          })
        }
      })
    }
  }
}
</script>


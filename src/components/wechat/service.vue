<template>
  <div class="template-wrapper">
     <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container clearfix">
        <el-form :inline="true"  ref="querForm" :model="queryParams" class="query-form">
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
          :tableData="serviceInfo" 
          :showPlusIcon=true
          @addFun="addFun"
          :tatalPage="serviceInfo.length" 
          :columns="columns">
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
          <el-form-item label="服务英文名" prop="serviceName">
            <el-input v-model="dialogForm.serviceName" :disabled="dialogTitle === '更新'"></el-input>
          </el-form-item>
          <el-form-item label="服务中文名" prop="serviceNamezh">
            <el-input v-model="dialogForm.serviceNamezh"></el-input>
          </el-form-item>
          <el-form-item label="服务类型" prop="serviceType">
            <el-radio-group v-model="dialogForm.serviceType">
              <el-radio label="0">服务平台服务</el-radio>
              <el-radio label="1">服务平台服务组合演示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="服务是否禁用" prop="forbidFlag">
            <el-radio-group v-model="dialogForm.forbidFlag">
              <el-radio label="1">禁用</el-radio>
              <el-radio label="0">不禁用</el-radio>
            </el-radio-group>
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
import { serviceInfoQuery } from '../../common/js/mixin'

export default {
  mixins: [ serviceInfoQuery ],
  data() {
    return {
      dialogTitle: '新增',
      dialogShow: false,
      disabledFlag: false,
      queryParams: {
        serviceId: ''
      },
      dialogRules: {
        serviceName: [
          { required: true, message: '请输入服务英文名', trigger: 'blur' }
        ],
        serviceNamezh: [
          { required: true, message: '请输入服务中文名', trigger: 'blur' }
        ]
      },
      dialogForm: {
        serviceName: '',
        serviceNamezh: '',
        serviceType: '0',
        forbidFlag: '1',
        remark: ''
      },
      columns: [{
        prop: 'serviceName',
        label: '服务名称',
        width: '160px'
      }, {
        prop: 'serviceNamezh',
        label: '服务中文名称',
        width: '160px'
      }, {
        prop: 'serviceType',
        label: '服务类型',
        formatter: row => {
          return row.serviceType === '1' ? '服务平台服务组合演示' : '服务平台服务'
        }
      }, {
        prop: 'createTime',
        label: '创建时间',
        formatter: row => {
          return this.$refs.table.formatterTime(row.createTime)
        }
      },{
        prop: 'updateTime',
        label: '更新时间',
        formatter: row => {
          return this.$refs.table.formatterTime(row.updateTime)
        }
      },{
        prop: 'remark',
        label: '备注',
        width: '160px'
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
      this.serviceInfoQuery(this.queryParams)
    },
    reset() {
      this.$refs.querForm.resetFields()
      this.queryParams.serviceId = ''
      this.serviceInfoQuery(this.queryParams)
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
      this.$confirm(`确定删除${value.serviceNamezh}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          $http(this.API.wechatAPI.serviceInfoDel, {
            serviceId: value.serviceId
          }).then((res) => {
            showModal(res.resMsg[0].msgText)
            this.handleClose()
            this.serviceInfoQuery()
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
            $http(this.API.wechatAPI.serviceInfoAdd, this.dialogForm).then((res) => {
              showModal(res.resMsg[0].msgText)
              this.handleClose()
              this.serviceInfoQuery()
            })
          } else {
            $http(this.API.wechatAPI.serviceInfoEdit, this.dialogForm).then((res) => {
              showModal(res.resMsg[0].msgText)
              this.handleClose()
              this.serviceInfoQuery()
            })
          }
        } 
      })
    }
  }
}
</script>


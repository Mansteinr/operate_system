<template>
  <div class="template-wrapper">
     <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container clearfix">
        <el-form :inline="true" class="query-form restrict-from">
          <el-form-item label="IdNamePhoto:">
            <el-input disabled v-model="IdNamePhoto" placeholder="请输入IdNamePhoto总量"></el-input>
          </el-form-item>
          <el-form-item label="是否开启:">
            <el-switch @change="setUpServerLimitFlagFun" v-model="flag"></el-switch>
          </el-form-item>
          <el-form-item class="query-item">
           <query-button submitText="设置" :cancelBtn=false @submit="onSubmit"></query-button>
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
          :showSummary="false" 
          :tableData="tableData"
          :tatalPage="tableData.length" 
          :columns="columns">
          <el-table-column
            label="操作"
            fixed="right"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleDelete(scope.row)" :disabled="scope.row.customerName ==='other'" type="text" size="small">删除</el-button>
              <el-button @click="handleEditor(scope.row)" :disabled="scope.row.customerName ==='other'" type="text" size="small">更新</el-button>
            </template>
          </el-table-column>
        </Table>
      </div>
    </div>
    <div class="card-wrapper card-content">
      <div class="card-title">
        查询结果
      </div>
      <div class="card-container">
        <Table class="table1" 
          :showSummary="false" 
          :tableData="tableData1"
          :tatalPage="tableData1.length" 
          :columns="columns">
          <el-table-column
            label="操作"
            fixed="right"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleDelete(scope.row)" :disabled="scope.row.customerName ==='other'" type="text" size="small">删除</el-button>
              <el-button @click="handleEditor(scope.row)" :disabled="scope.row.customerName ==='other'" type="text" size="small">更新</el-button>
            </template>
          </el-table-column>
        </Table>
      </div>
    </div>
    <Dialog
      ref='dialog'
      title="修改"
      :dialogShow="dialogShow" 
      @handleClose="handleClose"
      @determine="determine" 
      :isShowButton="true"
      :isClickModal="false">
        <el-form label-width="120px">
          <el-form-item :label="labelName">
            <el-input v-model.number="editorValue"></el-input>
          </el-form-item>
        </el-form>
    </Dialog>
  </div>
</template>

<script>
import Table from '../../base/Table'
import Dialog from '../../base/Dialog'
import { showModal } from '../../utils'
import { $http } from '../../common/js/ajax'
import QueryButton from '../../base/QueryButton'

export default {
  data() {
    return {
      labelName: '',
      editorValue: null,
      IdNamePhoto: null,
      tableData: [],
      tableData1: [],
      primaryKey: 'IdNamePhoto',
      flag: false,
      dialogShow: false,
      columns: [{
        prop: 'customerName',
        label: '客户名称'
      }, {
        prop: 'limit',
        label: '限量'
      }]
    }
  },
  components: {
    Table,
    Dialog,
    QueryButton
  },
  mounted() {
    this.getUpServerLimitFlag()
    this.getUpServerLimitCount()
    this.getCustomerLimitCount()
  },
  methods: {
    getLimitServiceCondition() {

    },
    setUpServerLimitFlagFun() {
      this.$confirm(`确定${this.flag?'开启':'关闭'}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          $http(this.API.paramsApi.setUpServerLimitFlag, {
            flag: this.flag ? '1' : '0',
            service: this.primaryKey
          }).then((res) => {
            showModal(res.resMsg[0].msgText)
            this.getUpServerLimitFlag()
          }).catch(() => {
            showModal('操作失败', 'error')
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        }) 
        this.flag = !this.flag   
      })
    },
    getUpServerLimitFlag() {
      $http(`${this.API.paramsApi.getUpServerLimitFlag}/${this.primaryKey}`, {}, 'get').then((res) => {
        this.flag = (res.resData === '0' ? false : true)
      })
    },
    getUpServerLimitCount() {
      $http(`${this.API.paramsApi.getUpServerLimitCount}/${this.primaryKey}`, {}, 'get').then((res) => {
        this[this.primaryKey] = res.resData
      })
    },
    getCustomerLimitCount() {
      $http(this.API.paramsApi.getCustomerLimitCount, {}, 'get').then((res) => {
        Object.keys(res.resData[this.primaryKey]).forEach(v => {
          this.tableData.push({
            customerName: v,
            limit: res.resData[this.primaryKey][v]
          })
        })
      })
    },
    onSubmit() {
      this.dialogShow = true
      this.editorValue = this[this.primaryKey]
      this.labelName = this.primaryKey
    },
    handleClose() {
      this.dialogShow = false
    },
    handleEditor(value) {
      this.dialogShow = true
      this.editorValue = value.limit
      this.labelName = value.customerName
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
      if(typeof (this.editorValue / 1) !== 'number') {
        this.$message({
          type: 'warning',
          message: '请输入数字'
        }) 
        return
      }
      let compareNum = 0, finalNum = 0
      this.tableData.forEach(v => {
        if(v.customerName === 'other') return
        compareNum += v.limit / 1
      })
       finalNum = this.editorValue - compareNum
       if(finalNum < 0) {
          this.$message({
            type: 'warning',
            message: '总量设置有问题，请检查'
          }) 
        return
       }
      this.$confirm(`other客户${this.primaryKey}服务将变为${finalNum}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $http(this.API.paramsApi.setUpServerLimitCount, {
          service: this.primaryKey,
          limit: this.editorValue
        }).then((res) => {
          showModal(res.resMsg[0].msgText)
          this.handleClose()
          FN.getUpServerLimitCount()
          this.getUpServerLimitCount()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })     
      })
    }
  }
}
</script>
<style lang="stylus">
.restrict-from
  .el-form-item
    width 40%
    text-align left !important
    .el-form-item__label
      width 130px !important
      text-align center
    .el-form-item__content
      width calc(100% - 153px) !important
  .query-item
    width 10% !important

</style>

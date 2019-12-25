<template>
  <div class="template-wrapper">
    <div class="card-wrapper card-content">
      <div class="card-title">
        查询结果
        <div class="button-group">
          <el-button type="primary" plain  size="mini" @click.native="mutilAdd">批量增加</el-button>
          <el-button type="primary" plain  size="mini"  @click.native="handleDelete('')" >批量删除</el-button>
        </div>
      </div>
      <div class="card-container">
        <Table class="table1" 
          ref="table"
          :showSummary="false" 
          :tableData="ipArr" 
          :showPlusIcon=true
          @addFun="addFun"
          @handleSelectionChange="handleSelectionChange"
          :tatalPage="ipArr.length" 
          :columns="columns">
          <el-table-column
            slot="selection"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </Table>
      </div>
    </div>
    <Dialog
      ref='dialog'
      title="新增IP"
      :dialogShow="dialogShow" 
      @handleClose="handleClose" 
      @opened="opened"
      @determine="determine" 
      :isShowButton="true"
      :isClickModal="false">
        <el-form :model="dialogForm" :rules="dialogRules" ref="dialogForm" label-width="100px">
          <el-form-item v-show="!showItem" label="IP" prop="entry">
            <el-input v-model="dialogForm.entry"></el-input>
          </el-form-item>
          <el-form-item v-show="!showItem" label="备注" prop="comment">
            <el-input v-model="dialogForm.comment" type="textarea"></el-input>
          </el-form-item>
          <el-form-item v-show="showItem" label="IP和备注">
            <el-input v-model="IPS" type="textarea" placeholder="请输入IP|备注，多个用逗号（，）分割，如 172.16.5.26|这是前端IP，172.0.0.1|这也是前端IP"></el-input>
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

export default {
  data() {
    return {
      IPS: '',
      ipArr: [],
      showItem: false,
      isSelectKey: [],
      dialogShow: false,
      dialogRules: {
        entry: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      dialogForm: {
        entry: '',
        comment: ''
      },
      columns: [{
        prop: 'entry',
        label: 'ip',
        formatter: row => {
          return row.entry.split('/')[0]
        }
      }, {
        prop: 'comment',
        label: '备注'
      }]
    }
  },
  components: {
    Table,
    Dialog
  },
  mounted() {
    this.getIP()
  },
  methods: {
    mutilAdd () {
      this.dialogShow = true
      this.showItem = true
    },
    getIP() {
      $http(this.API.paramsApi.getIP, {}, 'GET').then((res) => {
        this.ipArr = res.resData
      })
    },
    opened() {
      this.$refs.dialogForm.resetFields()
    },
    addFun() {
      this.dialogShow = true
      this.showItem = false
    },
    handleClose() {
      this.dialogShow = false
    },
    handleSelectionChange(val) {
      this.isSelectKey =  val
    },
    handleDelete(value) {
      let options = []
      if(!value && !this.isSelectKey.length) {
        this.$message({
          type: 'warning',
          message: '请选择选择的对象'
        })
        return
      }
      if(value) {
        options.push({
          entry: value.entry.split('/')[0],
          comment: value.comment
        })
      } else {
        this.isSelectKey.forEach(v => {
          options.push({
            entry: v.entry.split('/')[0],
            comment: v.comment
          })
        })
      }
      this.$confirm(`确定删除${value.entry ? value.entry : ''}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          $http(this.API.paramsApi.delIPBatch, options).then((res) => {
            showModal(res.resMsg[0].msgText)
            this.getIP()
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
        let options = []
        if(this.showItem) {
          if(!this.IPS) {
            this.$message({
              type: 'warning',
              message: '请输入IP'
            })
          }
          this.IPS.replace('，', ',').split(',').forEach(v => {
            options.push({
              entry: v.split('|')[0] ,
              comment:  v.split('|')[1]
            })
          })
        } else {
          options.push(this.dialogForm)
        }
        $http(this.API.paramsApi.addIPBatch, options).then((res) => {
          showModal(res.resMsg[0].msgText)
          this.handleClose()
          this.getIP()
        })
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.button-group
  position absolute
  bottom -42px
  left 55px
  z-index 99
</style>

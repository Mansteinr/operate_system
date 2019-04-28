<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container clearfix">
        <el-form :inline="true" ref="querForm" :model="queryParams" class="query-form">
        <el-form-item label="查询条件：">
          <el-select v-model="queryParams.serviceId" placeholder="请选择">
            <el-option
              v-for="v in services"
              :key="v.serviceId"
              :label="v.serviceNamezh"
              :value="v.serviceId">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="是否禁用：">
            <el-switch
              v-model="queryParams.forbiddenFlag"
              active-text="禁用">
            </el-switch>
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
        <Table 
          ref="table" 
          :columns="columns" 
          :tableData="tableData" 
          :tatalPage="tableData.length" :showSummary="false">
            <el-table-column
              prop="forbiddenFlag"
              label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  @click="handle(scope.row, scope.$index)">
                  {{scope.row.forbiddenFlag === '0' ? '禁止':'开启'}}
                </el-button>
                <el-button 
                  class="mv-button"
                  size="mini"
                  @click="upPriority(scope.row, scope.$index)"
                  :disabled="scope.$index===0?true:false"
                  icon="el-icon-top" circle></el-button>
                <el-button 
                  class="mv-button"
                  size="mini"
                  @click="downPriority(scope.row, scope.$index)"
                  :disabled="scope.$index===tableData.length-1?true:false"
                  icon="el-icon-bottom" circle></el-button>
              </template>
            </el-table-column>
          </Table>
      </div>
    </div>
  </div>
</template>

<script>
import { $http } from '../../common/js/ajax'
import Table from '../../base/Table'
import QueryButton from '../../base/QueryButton'
import { drapDom } from '../../utils'
export default {
  data () {
    return {
      queryParams: {
        serviceId: '',
        forbiddenFlag: true
      },
      tableData: [],
      forbiddenFlag: '',
      services: [],
      params: {},
      columns: [{
        label: '序号',
        type: 'index'
      }, {
        prop: 'supplierChannelName',
        label: '通道名称'
      }, {
        prop: 'forbiddenFlag',
        label: '状态',
        formatter: row => {
          return row.forbiddenFlag / 1 ? '禁止中' : '使用中'
        }
      }]
    }
  },
  components: {
    Table,
    QueryButton
  },
  mounted () {
    this.getAllAbilityInfo()
    document.querySelector('.el-table__body-wrapper table').addEventListener('click', e => {
      drapDom(e.target.parentNode.parentNode.parentNode)
    })
  },
  methods: {
    upPriority (row,index) { // 上移动
      let data = [...this.tableData], options = {...this.params}
      options.forbiddenFlag = this.queryParams.forbiddenFlag?'0':'1'

      options.supplierServiceInfos[index-1] = row
      options.supplierServiceInfos[index-1].priority = index-1

      options.supplierServiceInfos[index] = data[index-1]
      options.supplierServiceInfos[index].priority = index+1
      this.alterAbilitySupplilerInfo(options)
    },
    downPriority (row,index) { // 下移
      let data = [...this.tableData], options = {...this.params}
      options.forbiddenFlag = this.queryParams.forbiddenFlag?'0':'1'

      options.supplierServiceInfos[index+1] = row
      options.supplierServiceInfos[index+1].priority = index+1

      options.supplierServiceInfos[index] = data[index+1]
      options.supplierServiceInfos[index].priority = index-1
      
      this.alterAbilitySupplilerInfo(options)
    },
    handle (row, index) {
      this.$confirm(`确认${row.forbiddenFlag==='1'?'开启':'禁止'}此通道`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let options = {...this.params}
        options.supplierServiceInfos[index].forbiddenFlag = (row.forbiddenFlag === '1' ? '0' : '1')
        this.alterAbilitySupplilerInfo(options)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    reset () {
      this.$refs.querForm.resetFields()
    },
    onSubmit () {
      this.getAbilitySupplilerInfo()
    },
    getAllAbilityInfo () {
      $http(this.API.callbackServiceApi.getAllAbilityInfo, {}, 'get').then((res) => {
        this.services = res.resData
        this.queryParams.serviceId = this.services[0].serviceId
      })
    },
    getAbilitySupplilerInfo () {
       $http(this.API.callbackServiceApi.getAbilitySupplilerInfo, {serviceId: this.queryParams.serviceId}).then((res) => {
        this.tableData = []
        this.tableData = res.resData.supplierServiceInfos
        this.params = JSON.parse(JSON.stringify(res.resData))
      })
    },
    alterAbilitySupplilerInfo (options) {
      $http(this.API.callbackServiceApi.alterAbilitySupplilerInfo, options).then((res) => {
        this.$message({
          type: 'success',
          message: res.resMsg[0].msgText
        })
        this.getAbilitySupplilerInfo()
      })
    },
    saveChannle () { // 调顺序

    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped rel="stylesheet/stylus">
  .mvTrackId
    label
      padding-right 0 !important
  // .mv-button
</style>

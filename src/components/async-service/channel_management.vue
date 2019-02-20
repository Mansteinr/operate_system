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
        <Table ref="table" class="table" :tableData="tableData" :tatalPage="tableData.length" :showSummary="false">
          <el-table-column
            label="客户名称"
            prop="loginname">
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
import { showModal } from '../../utils'
export default {
  data () {
    return {
      queryParams: {
        serviceId: '',
        forbiddenFlag: true
      },
      tableData: [],
      services: []
    }
  },
  components: {
    Table,
    QueryButton
  },
  mounted () {
    this.getAllAbilityInfo()
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
    },
    onSubmit () {
    },
    getAllAbilityInfo () {
      $http(this.API.callbackServiceApi.getAllAbilityInfo, {}, 'get').then((res) => {
        this.services = res.resData
        this.queryParams.serviceId = this.services[0].serviceId
      })
    },
    getAbilitySupplilerInfo () {
       $http(this.API.callbackServiceApi.getAbilitySupplilerInfo, {serviceId: this.queryParams.serviceId}).then((res) => {
        this.tableData = res.resData.supplierServiceInfos
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

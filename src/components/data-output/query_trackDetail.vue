<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container clearfix">
        <el-form :inline="true" :rules="rules" ref="querForm" :model="queryParams" class="query-form">
          <el-form-item label="选择时间：" prop="time">
            <div class="block">
              <el-date-picker
                type="daterange" 
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                v-model="queryParams.time"
                range-separator="至"
                :picker-options="pickerOptions2">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="客户名称：" prop="loginName">
            <el-select filterable v-model="queryParams.loginName" placeholder="请选择">
              <el-option
                v-for="v in loginName"
                @click.native.stop="changeCustomer(v)"
                :key="v.customerId"
                :title="`${v.customerName}(${v.loginName})`"
                :data-customerid="v.customerId"
                :label="v.customerName"
                :value="v.loginName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接口类型：" prop="serviceName">
            <el-select filterable v-model="queryParams.serviceName" placeholder="请选择">
              <el-option
                v-for="v in services"
                :key="v.serviceId"
                :title="`${v.serviceNameZh}(${v.serviceName})`"
                :label="v.serviceNameZh"
                :value="v.serviceName">
              </el-option>
            </el-select>
          </el-form-item>
          <div class="demo-wrapper">
            <el-form-item :label="`${v.label}${k+1}：`" prop="serviceName" class="demo-input-suffix" v-for="(v, k) in tableHeader">
              <el-input
                :placeholder="`${v.placeholder1}`"
              >
              </el-input>
              :
              <el-input :placeholder="`${v.placeholder2}`">
              </el-input>
            </el-form-item>
          </div>
          <el-form-item class="query-item"> 
            <query-button @reset="reset" @submit="onSubmit"></query-button>
            <el-button class="query-button" @click="addHeader"  type="primary" plain>新增</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="card-wrapper card-content">
      <div class="card-title">
        查询结果
      </div>
      <div class="card-container">
        <div v-show="!tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { $downFile } from '../../common/js/ajax'
import { hotKeyTime, loginName, services } from '../../common/js/mixin'
import QueryButton from '../../base/QueryButton'
import { trim } from '../../utils'
export default {
  mixins: [hotKeyTime,loginName, services],
  data () {
    return {
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
        loginName: '',
        serviceName: '',
        options: {}
      },
      noAllLogin: true,
      tableData: [],
      tableHeader: []
    }
  },
  components: {
    QueryButton
  },
  methods: {
    reset () {

    },
    onSubmit () {
      let divs = Array.from(document.getElementsByClassName('demo-input-suffix'))
      if (divs.length) {
        Array.from(document.getElementsByClassName('demo-input-suffix')).forEach(v => {
          let params = v.getElementsByTagName('input')
          if (trim(params[0].value) && trim(params[1].value)) {
            this.queryParams.options[params[0].value] = params[1].value
          }
        })
      }
      this.trackDetail(this.queryParams)
    },
    addHeader () {
      this.tableHeader.push({
        label: '表头',
        placeholder1: '请输入名称',
        placeholder2: '请输入对应字段'
      })
    },
    trackDetail (op) {
      $downFile(this.API.financeApi.trackDetail, op)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
.demo-input-suffix
  .el-form-item__content
    display flex
    .el-input
      width calc(50% - 6px)
</style>

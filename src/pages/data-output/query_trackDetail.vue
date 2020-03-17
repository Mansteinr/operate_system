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
                :name="['start', 'end']"
                range-separator="至"
                :picker-options="pickerOptions2">
              </el-date-picker>
            </div>
          </el-form-item>
          <loginNameSelect 
            :labelTitle="'客户名称'" 
            :originArr="loginName" 
            :defaultValue="'loginName'" 
            :defaultLable="'customerName'"
            :needValue="'customerId'"
            :searchInput="true"
            @changeInputValue="changeCustomer">
          </loginNameSelect>
          <serviceSelect 
            :labelTitle="'接口类型'" 
            :originArr="services" 
            :defaultValue="'serviceName'" 
            :searchInput = "true"
            :defaultLable="'serviceNameZh'">
          </serviceSelect>
          <div class="demo-wrapper">
            <el-form-item :label="`${v.label}${k+1}：`" :key="k" prop="serviceName" class="demo-input-suffix" v-for="(v, k) in tableHeader">
              <el-input
                :placeholder="`${v.placeholder1}`"
              >
              </el-input>
              :
              <el-input :placeholder="`${v.placeholder2}`">
              </el-input>
            </el-form-item>
          </div>
          <el-form-item class="query-button-box"> 
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
import { trim } from '../../utils'
import serviceSelect from '../../base/Select'
import loginNameSelect from '../../base/Select'
import { $downFile } from '../../common/js/ajax'
import QueryButton from '../../base/QueryButton'
import { hotKeyTime, loginName, services } from '../../common/js/mixin'
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
      tableData: [],
      tableHeader: []
    }
  },
  components: {
    QueryButton,
    serviceSelect,
    loginNameSelect
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
      this.tableHeader = []
    },
    onSubmit () {
      let divs = Array.from(document.getElementsByClassName('demo-input-suffix')), opt = {} // 组装参数
      this.$refs.querForm.$el.querySelectorAll('input').forEach(v => {
        if (v.name) {
          opt[v.name] = v.value
        }
      })
      if (divs.length) {
        Array.from(document.getElementsByClassName('demo-input-suffix')).forEach(v => {
          let params = v.getElementsByTagName('input'), options = {}
          if (trim(params[0].value) && trim(params[1].value)) {
            options[params[0].value] = params[1].value
          }
          opt.options = options
        })
      }
      this.trackDetail(opt)
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
  margin-bottom 10px !important
  .el-form-item__content
    display flex
    .el-input
      width calc(50% - 6px)
.query-button-box,.demo-wrapper
  display block
  width 100%
</style>

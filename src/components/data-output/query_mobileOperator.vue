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
        <div v-show="!tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <Table :columns="columns" :tableData="tableData" :tatalPage="tableData.length" v-show="tableData.length">
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import Table from '../../base/Table'
import {$http} from '../../common/js/ajax'
import serviceSelect from '../../base/Select'
import loginNameSelect from '../../base/Select'
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
        type: ''
      },
      columns: [{
        label: '日期',
        sortable: true,
        prop: 'date'
      }, {
        label: '电信',
        sortable: true,
        prop: '电信'
      }, {
        label: '联通',
        sortable: true,
        prop: '联通'
      }, {
        label: '移动',
        sortable: true,
        prop: '移动'
      }],
      tableData: []
    }
  },
  components: {
    Table,
    QueryButton,
    serviceSelect,
    loginNameSelect
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
    },
    onSubmit () {
      let options = {}
      this.$refs.querForm.$el.querySelectorAll('input').forEach(v => {
        if (v.name) {
          options[v.name] = v.value
        }
      })
      this.mobileOperator(options)
    },
    mobileOperator (options) {
      $http(this.API.financeApi.mobileOperator, options).then((res) => {
        let responseObj = {}
        res.resData.forEach(v => {
          v.dateUsages.forEach(v1 => {
            if (!responseObj[v1.date]) {
              responseObj[v1.date] = {
                [v.isp] :v1.num,
                "date": v1.date
              }
            } else {
              responseObj[v1.date][v.isp] = v1.num
            }
          })
        })
        for (let k in responseObj) {
          this.tableData.push(responseObj[k])
        }
        console.log(this.tableData)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

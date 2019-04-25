<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container">
        <el-form :inline="true"  ref="querForm" :rules="rules" :model="queryParams" class="query-form">
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
          <serviceSelect 
            :labelTitle="'接口类型'" 
            :originArr="services" 
            :defaultValue="'serviceName'" 
            :searchInput = "true"
            :isMultiple="true"
            :defaultLable="'serviceNameZh'">
          </serviceSelect>
          <el-form-item label="上游通道：">
            <el-input placeholder="请输入上游通道名称" v-model="queryParams.upStream"  name="upStream"></el-input>
          </el-form-item>
          <el-form-item label="一级码：">
            <el-input placeholder="请输入一级码" v-model="queryParams.result"  name="result"></el-input>
          </el-form-item>
          <el-form-item label="查询维度：" prop="dimension">
            <el-radio v-model="queryParams.dimension" label="0">按汇总</el-radio>
            <el-radio v-model="queryParams.dimension" label="1">按明细</el-radio>
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
        <div v-show="!tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <Table ref="table" :columns="columns" :tableData="tableData" :tatalPage="tableData.length" v-show="tableData.length">
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import Table from '../../base/Table'
import serviceSelect from '../../base/Select'
import { showModal, reset } from '../../utils'
import QueryButton from '../../base/QueryButton'
import { $http, $downFile } from '../../common/js/ajax'
import {  hotKeyTime, services } from '../../common/js/mixin'

let isNull = false
export default {
  mixins: [hotKeyTime, services],
  data () {
    return {
      allFlag: true,
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
        upStream: '',
        result: '',
        dimension: '0'
      },
      columns: [{
        prop: 'date',
        label: '时间',
        sortable: true
      }, {
        prop: 'num',
        label: '单日调用量',
        sortable: true,
        formatter: row => {
          return row.num.toFixed(4)
        }
      }],
      tableData: []
    }
  },
  components: {
    Table,
    QueryButton,
    serviceSelect
  },
  methods: {
    reset () {
      reset()
      this.queryParams.result = ''
      this.queryParams.upStream = ''
      this.$refs.querForm.resetFields()
    },
    onSubmit () {
      let options = {}
      this.$refs.querForm.$el.querySelectorAll('input').forEach(v => {
        if (v.name) {
          options[v.name] = v.value.replace(/(^\s*)|(\s*$)/g, "")
        }
      })
      if (!options.serviceName) {
        showModal('选择接口类型', 'error')
        return
      }
        options.serviceNames = options.serviceName.split(',')
        delete options.serviceName
      if (this.queryParams.dimension === '0') {
        this.upStreamCount(options)
      } else {
        if (!options.upStream) {
          showModal('请输入上游通道名称', 'warning')
          return
        }
        if (options.start != options.end) {
          showModal('不支持跨天查询', 'warning')
          return
        }
        delete options.dimension
        $downFile(this.API.financeApi.upStreamDetail, options)
      }
      
    },
    formatter(val) {
      return this.$refs.table.formatter(val, 'cost')
    },
    upStreamCount (options) {
      $http(this.API.financeApi.upStreamCount, options).then((res) => {
        this.tableData = res.resData.dateUsages
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

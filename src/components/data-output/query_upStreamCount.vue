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
                range-separator="至"
                :picker-options="pickerOptions2">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="接口类型：" prop="serviceName" :title="titleTips">
            <el-select v-model="queryParams.serviceNames" filterable multiple collapse-tags placeholder="请选择">
              <el-option
                v-for="(v, index) in services"
                :key="index"
                :title="`${v.serviceNameZh}(${v.serviceName})`"
                :label="v.serviceNameZh"
                @click.native="changeSelectValue(v)"
                :value="v.serviceName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上游通道">
            <el-input placeholder="请输入上游通道名称" v-model="queryParams.upStream"  name="upStream"></el-input>
          </el-form-item>
          <el-form-item label="一级码">
            <el-input placeholder="请输入一级码" v-model="queryParams.result"  name="result"></el-input>
          </el-form-item>
          <el-form-item label="相应描述">
            <el-input placeholder="请输入相应描述" v-model="queryParams.statMsg"  name="statMsg"></el-input>
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
        <Table ref="table" class="table" :tableData="tableData" :tatalPage="tableData.length" v-show="tableData.length">
          <el-table-column
            label="时间"
            prop="date">
          </el-table-column>
          <el-table-column
            label="单日调用量"
            sortable
            prop="num">
          </el-table-column>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import $http from '../../common/js/ajax'
import {  hotKeyTime, services } from '../../common/js/mixin'
import Table from '../../base/Table'
import QueryButton from '../../base/QueryButton'
let isNull = false
export default {
  mixins: [hotKeyTime, services],
  data () {
    return {
      allFlag: true,
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
        serviceNames: [],
        upStream: '',
        result: '',
        statMsg: ''
      },
      tableData: [],
      titleTips: ''
    }
  },
  components: {
    Table,
    QueryButton
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
      this.queryParams.serviceNames = this.services[0].serviceName
    },
    onSubmit () {
      this.upStreamCount()
    },
    formatter(val) {
      return this.$refs.table.formatter(val, 'cost')
    },
    changeSelectValue (val) {
      if (!val.serviceName) {
        this.queryParams.serviceNames = []
        this.queryParams.serviceNames.push('')
      } else {
        let index = this.queryParams.serviceNames.findIndex(value => {
          return !value
        })
        if (index > -1) {
          this.queryParams.serviceNames.splice(index, 1)
        }
        this.titleTips = this.queryParams.serviceNames.join('\n')
      }
    },
    upStreamCount () {
      if (this.queryParams.serviceNames.length === 1 && !this.queryParams.serviceNames[0]) {
        this.queryParams.serviceNames = []
        isNull = true
      }
      $http(this.API.financeApi.upStreamCount, this.queryParams).then((res) => {
        this.queryParams.serviceNames.push('')
        isNull = false
        // table?
        this.tableData = res.resData.dateUsages
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

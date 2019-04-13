<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container">
        <el-form :inline="true" ref="querForm" :model="queryParams" class="query-form">
          <el-form-item label="选择时间：" prop="time">
            <div class="block">
              <el-date-picker
                type="daterange" 
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :name="['start', 'end']"
                v-model="queryParams.time"
                range-separator="至"
                @change="changeTime"
                :picker-options="pickerOptions2">
              </el-date-picker>
            </div>
          </el-form-item>
          <loginNameSelect 
            ref="loginNameSelect"
            :labelTitle="'客户名称'" 
            :originArr="loginName" 
            :defaultValue="'loginName'" 
            :searchName="'loginName'"
            :searchInput=true
            :isMultiple='multiple'
            :isAll='all'
            :defaultLable="'customerName'"
            >
          </loginNameSelect>
          <el-form-item class="query-item">
           <query-button @reset="reset" @submit="onSubmit"></query-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="card-wrapper card-content">
      <div class="card-title">
        余额快照
      </div>
      <div class="card-container">
        <div v-show="!tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <Table class="table1" :tableData="tableData" :tatalPage="tableData.length" v-show="tableData.length">
          <el-table-column
            v-for="(v, k) in coloums"
            :label="v.title"
            :key="k"
            :sortable="v.sortable"
            :prop="v.field">
          </el-table-column>
        </Table>
      </div>
    </div>
    <div class="card-wrapper card-content" v-show="chargeLogFlag">
      <div class="card-title">
        充值记录
      </div>
      <div class="card-container">
        <div v-show="!tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <Table class="table2" :tableData="tableData2" :tatalPage="tableData2.length" v-show="tableData2.length">
          <el-table-column
            v-for="(v, k) in columns2"
            :key="k"
            :label="v.title"
            :sortable="v.sortable"
            :prop="v.field">
          </el-table-column>
        </Table>
      </div>
    </div>
  </div>
</template>
<script>
/** 
 * 该模块功能要点  当选择时间段时  客户名称只能选择一个 需要展示余额快照和充值记录
 * 
 * 当时间为一天时 客户可以多选  分为两种情况
 *  1、只选择一个客户时 需要展示余额快照和充值记录
 *  2、当选择多个客户时 只需要展示余额快照
*/
import { $http } from '../../common/js/ajax'
import { hotKeyTime, loginName } from '../../common/js/mixin'
import Table from '../../base/Table'
import loginNameSelect from '../../base/Select'
import QueryButton from '../../base/QueryButton'
export default {
  mixins: [hotKeyTime, loginName],
  data () {
    return {
      queryParams: { // 保留该参数 是为了重置方便
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
      },
      chargeLogFlag: false, // 控制显示隐藏充值记录
      tableData: [], // 余额快照table数据
      tableData2: [],  // 充值记录table数据
      multiple: false, // 是否多选
      all: false, // 是否多选
      coloums: [{
        field: 'dateTime',
        title: '时间',
        sortable: true,
      },{
        field: 'balance',
        sortable: true,
        title: '余额'
      },{
        field: 'diffValue',
        sortable: true,
        title: '差额'
      }],
      columns2: [{
        field: 'dateTime',
        title: '充值时间',
        sortable: true
      }, {
        field: 'curBalance',
        title: '当前余额',
        sortable: true
      }, {
        field: 'actualRechargeAmount',
        title: '实际充值金额',
        sortable: true
      }, {
        field: 'extRechargeAmount',
        title: '附加充值金额',
        sortable: true
      }, {
        field: 'packRechargeAmount',
        title: '包年包月充值金额',
        sortable: true
      }, {
        field: 'preBalance',
        title: '充值前金额',
        sortable: true
      }, {
        field: 'operator',
        title: '经办人',
      }, {
        field: 'remark',
        title: '说明',
      }]
    }
  },
  components: {
    Table,
    QueryButton,
    loginNameSelect
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
    },
    changeTime () { // 监听时间变化
      if (+new Date(this.queryParams.time[0]) === +new Date(this.queryParams.time[1])) { // 同一天为 为多选
        this.multiple = true
        this.all = true
      } else {
        this.multiple = false // 不是同一天 则为单选
        this.all = false
        this.chargeLogFlag = true
      }
      this.customers() // 强制请求数据 更新组件样式
    },
    onSubmit () {
      let options = {}
      document.querySelectorAll('form input').forEach(v => {
        if (v.name) {
          options[v.name] = v.value
        }
      })
      if (options.start != options.end) { // 一段时间的情况
        options.loginNames = [options.loginName]
        this.chargeLogFlag = true // 显示充值记录
        this.chargeLog(options.loginName)
      } else {

      }
      console.log(options.loginName)
      delete options.loginName
      this.getBalanceSnapshot(options)
    },
    getBalanceSnapshot (options) { // 余额快照
      $http(this.API.downApi.getBalanceSnapshot, options).then((res) => {
        this.tableData = res.resData
      })
    },
    chargeLog (loginName) { // 余额快照
      $http(this.API.downApi.chargeLog + '/' + loginName, {}, 'get').then((res) => {
         this.tableData2 = res.resData
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

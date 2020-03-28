<template>
  <div class="template-wrapper">
        <!-- 查询模块 -->
    <Inquiry :queryParams="queryParams" @initFun="initFun">
      <el-form-item :label="$t('m.basics.datePickerLabel')" prop="time">
        <div class="block">
          <el-date-picker
            v-model="queryParams.time"
            type="daterange"
            align="right"
            @change="changeTime"
            unlink-panels
            :clearable="false"
            :range-separator="$t('m.basics.datePickerRangeSeparator')"
            :name="['start', 'end']"
            :start-placeholder="$t('m.basics.datePickerStartPlaceholder')"
            :end-placeholder="$t('m.basics.datePickerEndPlaceholder')"
            :picker-options="pickerOptions2"
          ></el-date-picker>
        </div>
      </el-form-item>
      <Select 
        :labelTitle="'客户名称'" 
        :originArr="basicsCustomerList" 
        :defaultValue="'loginName'" 
        :searchInput=true
        :isMultiple='multiple'
        :isAll='all'
        :needValue="'customerId'"
        :defaultLable="'customerName'"
        >
      </Select>
    </Inquiry>
    <!-- 余额快照 -->
    <Content
      :isOnlyTable="true" 
      :title="$t('m.usageStatistics.balanceSnapshotTitle')" 
      :data="balanceSnapshotList">
      <Table
        slot="onlyTable"
        :tableData="balanceSnapshotList"
        :tatalPage="balanceSnapshotList.length"
        :columns="columns"
      />
    </Content>
    <!-- 充值记录 -->
    <Content
      v-show="chargeLogFlag"
      :isOnlyTable="true" 
      :title="$t('m.usageStatistics.chargeLogTitle')" 
      :data="chargeLogList">
      <Table
        slot="onlyTable"
        :tableData="chargeLogList"
        :tatalPage="chargeLogList.length"
        :columns="columns2"
      />
    </Content>
    <!-- <div class="card-wrapper card-content">
      <div class="card-title">
        余额快照
      </div>
      <div class="card-container">
        <div v-show="!tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <Table class="table1" :showSummary="false" :tableData="tableData" :tatalPage="tableData.length" v-show="tableData.length" :columns="columns">
        </Table>
      </div>
    </div>
    <div class="card-wrapper card-content" v-show="chargeLogFlag">
      <div class="card-title">
        充值记录
      </div>
      <div class="card-container">
        <div v-show="!tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <Table :columns="columns2" class="table2" :showSummary="false" :tableData="tableData2" :tatalPage="tableData2.length" v-show="tableData2.length">
        </Table>
      </div>
    </div> -->
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
import Table from '@/components/Table'
import Select from "@/components/Select"
import Content from '@/components/Content'
import Inquiry from '@/components/Inquiry'
import { mapActions, mapGetters } from "vuex"
import { hotKeyTime, loginName } from '@/common/js/mixin'
let loginNameObj = {}  // 由于后端 传参的时候 没有将中文名传过来 前端自己将中英文对照
export default {
  mixins: [hotKeyTime, loginName],
  data () {
    return {
      queryParams: { // 保留该参数 是为了重置方便
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
      },
      chargeLogFlag: true, // 控制显示隐藏充值记录
      multiple: false, // 是否多选
      all: false, // 是否多选
      columns: [{
        prop: 'customerName',
        label: '客户名称'
      }, {
        prop: 'customerName',
        label: '中文',
        formatter: row => {
          return loginNameObj[row.customerName]
        }
      },{
        prop: 'dateTime',
        label: '时间',
        sortable: true,
      },{
        prop: 'balance',
        sortable: true,
        label: '余额'
      },{
        prop: 'diffValue',
        sortable: true,
        label: '差额'
      }],
      columns2: [{
        prop: 'dateTime',
        label: '充值时间',
        sortable: true,
        width: '150px'
      }, {
        prop: 'curBalance',
        label: '当前余额',
        sortable: true,
        width: '100px'
      }, {
        prop: 'actualRechargeAmount',
        label: '实际充值金额',
        sortable: true,
        width: '140px'
      }, {
        prop: 'extRechargeAmount',
        label: '附加充值金额',
        sortable: true,
        width: '125px'
      }, {
        prop: 'packRechargeAmount',
        label: '包年包月充值金额',
        sortable: true,
        width: '150px'
      }, {
        prop: 'preBalance',
        label: '充值前金额',
        sortable: true,
        width: '120px'
      }, {
        prop: 'operator',
        label: '经办人',
        width: '80px'
      }, {
        prop: 'remark',
        label: '说明',
      }]
    }
  },
  components: {
    Inquiry,
    Content,
    Table,
    Select
  },
  watch: {
    loginName () {
      this.loginName.forEach(v => {
        loginNameObj[v.loginName] = v.customerName
      })
    }
  },
  methods: {
    changeTime () { // 监听时间变化
      if (+new Date(this.queryParams.time[0]) === +new Date(this.queryParams.time[1])) { // 同一天为 为多选
        this.multiple = true
        this.all = true
        this.chargeLogFlag = false
      } else {
        this.multiple = false // 不是同一天 则为单选
        this.all = false
        this.chargeLogFlag = true
      }
      this.getBasicCustomerAjax() // 强制请求数据 更新组件样式
    },
    initFun (options) {
      if (options.start != options.end) { // 一段时间的情况
        options.loginNames = [options.loginName]
        this.chargeLogFlag = true // 显示充值记录
        this.getChargeLogAjax(options.loginName)
      } else {
        options.loginNames = options.loginName.split(',')
        if (options.loginNames[0] === '') { // 包含全部
          options.loginNames = []
        } else { 
          if (options.loginNames.length === 1) { //只选择一个客户 需要展示充值记录
            this.chargeLogFlag = true
            this.getChargeLogAjax(options.loginName)
          }
        }
      }
      delete options.loginName
      this.getBalanceSnapshotAjax(options)
    },
    ...mapActions({
      getBasicCustomerAjax : "basics/getBasicCustomerAjax",
      getChargeLogAjax : "usageStatistics/getChargeLogAjax",
      getBalanceSnapshotAjax : "usageStatistics/getBalanceSnapshotAjax",
    })
  },
  computed: {
    ...mapGetters({
      chargeLogList: "usageStatistics/chargeLogList",
      basicsCustomerList: "basics/basicsCustomerList",
      balanceSnapshotList: "usageStatistics/balanceSnapshotList"
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

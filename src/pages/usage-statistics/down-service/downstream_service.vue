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
      :labelTitle="$t('m.basics.serviceName')"
      :originArr="basicsServiceList"
      :defaultValue="'serviceName'"
      :searchInput="true"
      :defaultLable="'serviceNameZh'"/>
      <el-form-item label="统计维度" prop="timesAndMoneyUsed">
        <el-radio-group v-model="queryParams.timesAndMoneyUsed">
          <el-radio label="customer">按客户</el-radio>
          <el-radio label="business">按行业</el-radio>
        </el-radio-group>
      </el-form-item>
    </Inquiry>
        <!-- 各客户计费调用数量占比 -->
    <Content :data="computedList">
      <Chart slot="Chart" :options="downChargedCountChartOption" />
      <Table
        slot="Table"
        :tableData="computedList"
        :tatalPage="computedList.length"
        :columns="columns"
      />
    </Content>
    <!-- 各客户调用金额占比 -->
    <Content :data="computedList">
      <Chart slot="Chart" :options="downCostOption" />
      <Table
        slot="Table"
        :tableData="computedList"
        :tatalPage="computedList.length"
        :columns="columns1"
      />
    </Content>
  </div>
</template>

<script>
import Table from "@/components/Table"
import Chart from "@/components/Chart"
import Select from "@/components/Select"
import Content from "@/components/Content"
import Inquiry from "@/components/Inquiry"
import { mapActions, mapGetters } from "vuex"
import { hotKeyTime, services } from '@/common/js/mixin'

export default {
  mixins: [hotKeyTime, services],
  data () {
    return {
      columns: [{
        prop: 'Name',
        sortable: true,
        label: '客户名称'
      },{
        prop: 'downChargedCount',
        sortable: true,
        label: '计费调用量（条）'
      },{
        prop: 'usedCount',
        sortable: true,
        label: '调用总量（条）'
      }],
      columns1: [{
        prop: 'Name',
        sortable: true,
        label: '客户名称'
      },{
        prop: 'downCost',
        sortable: true,
        label: '调用金额',
        formatter: row => {
          return row.downCost.toFixed(4)
        }
      }],
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
        timesAndMoneyUsed: 'customer'
      }
    }
  },
  components: {
    Inquiry,
    Content,
    Chart,
    Table,
    Select
  },
  methods: {
    ...mapActions({
      getAllBasicServiceAjax: "basics/getAllBasicServiceAjax",
      getUsageByCustomerAjax: "queryIndex/getUsageByCustomerAjax",
    }),
    initFun (options) {
      this.getUsageByCustomerAjax(  Object.assign(options, {
        timesAndMoneyUsed: this.queryParams.timesAndMoneyUsed
      }))
    }
  },
  computed: {
    ...mapGetters({
      basicsServiceList: "basics/basicsServiceList",
      UsageByCustomerList: "queryIndex/UsageByCustomerList",
    }),
    computedList() {
      if(this.queryParams.timesAndMoneyUsed === 'business') {
        let objBusiness = {}, businessArray = []
        this.UsageByCustomerList.forEach(v => {
          if (objBusiness.hasOwnProperty(v.customerTypeZh)) {
            objBusiness[v.customerTypeZh].push(v)
          } else {
            objBusiness[v.customerTypeZh] = [v]
          }
        })
        for (let k in objBusiness) {
          let obj = {}, arr = objBusiness[k]
          obj.Name = k
          obj.downChargedCount = 0
          obj.downCost = 0
          obj.usedCount = 0
          arr.forEach(v => {
            obj.downChargedCount += v.downChargedCount
            obj.downCost += v.downCost
            obj.usedCount += v.usedCount
          })
          businessArray.push(obj)
        }
        return businessArray
      } else {
        let customerObj = {}, customerArr = []
        this.UsageByCustomerList.forEach(v => {
          let name = v.customerName || v.customerName
          if (customerObj.hasOwnProperty(name)) {
            customerObj[name].push(v)
          } else {
            customerObj[name] = [v]
          }
        })
        for (let k1 in customerObj) {
          let obj = {}, arr = customerObj[k1]
          obj.Name = k1
          obj.downChargedCount = 0
          obj.downCost = 0
          obj.usedCount = 0
          arr.forEach(v => {
            obj.downChargedCount += v.downChargedCount
            obj.downCost += v.downCost
            obj.usedCount += v.usedCount
          })
          customerArr.push(obj)
        }
        return customerArr
      }
    },
    downCostOption() {
      let pieCharge = {}, newList = JSON.parse(JSON.stringify(this.computedList))
        newList.sort((a, b) => { // 排序 取前十名
          return -(a.downCost - b.downCost)
        })
        newList.forEach((v, k) => {
          if (k <= 10) {
            pieCharge[v.Name] = v.downCost
          }
        })
       return {
        type: 'HollowCircle',
        title: '各客户调用金额占比',
        tipTitle: '调用金额',
        obj: pieCharge
      }
    },
    downChargedCountChartOption() {
      let pieCharge = {}, newList = JSON.parse(JSON.stringify(this.computedList))
        newList.sort((a, b) => { // 排序 取前十名
          return -(a.downChargedCount - b.downChargedCount)
        })
        newList.forEach((v, k) => {
          if (k <= 10) {
            pieCharge[v.Name] = v.downChargedCount
          }
        })
       return {
        type: 'HollowCircle',
        title: '各客户计费调用数量占比',
        tipTitle: '计费调用数量',
        obj: pieCharge
      }
    },
  }
}
</script>

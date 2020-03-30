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
        :labelTitle="$t('m.basics.businessType')"
        :originArr="businessTypesList"
        :defaultValue="'typeId'"
        :defaultLable="'typeName'"
        :isAll="true"
        @changeType="changeType"
      />
      <Select
        :labelTitle="$t('m.basics.loginName')"
        :originArr="basicsCustomerList"
        :defaultValue="'loginName'"
        :defaultLable="'customerName'"
        :needValue="'customerId'"
        :searchInput="true"
        :isAll="true"
        @changeInputValue="changeCustomer"/>
    </Inquiry>
    <!-- 下游客户调用次数和费用 -->
    <Content :data="customerChargeInfoList">
      <Chart slot="Chart" :options="customerChargeInfoChartOption" />
      <Table
        slot="Table"
        :tableData="customerChargeInfoList"
        :tatalPage="customerChargeInfoList.length"
        :columns="columns"
      />
    </Content>
    <!-- 详情 -->
    <Content :isOnlyChart="true" :data="tableData">
      <Chart slot="isOnlyChart" :options="pieChartOption" />
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
import { hotKeyTime, loginName, businessType } from '@/common/js/mixin'
export default {
  mixins: [hotKeyTime, loginName, businessType],
  data () {
    return {
      columns: [{
        prop: 'outServiceName',
        label: '服务名称'
      },{
        prop: 'serviceNameZh',
        label: '服务名称（中文）'
      },{
        prop: 'usedCount',
        sortable: true,
        label: '总调用条数'
      },{
        prop: 'downCost',
        sortable: true,
        formatter: (row, column) => {
          return row[column.property].toFixed(4)
        },
        label: '下游计费'
      }],
      columns1: [{
        prop: 'company',
        label: '上游公司名称'
      },{
        prop: 'usedCount',
        label: '上游总调用条数'
      },{
        prop: 'chargeUsedCount',
        sortable: true,
        label: '计费条数'
      },{
        prop: 'downCost',
        sortable: true,
        formatter: (row, column) => {
          return row[column.property].toFixed(4)
        },
        label: '上游计费'
      }],
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()]/**默认时间最近七天 */
      },
      tableData: [],
      params: null
    }
  },
  components: {
    Inquiry,
    Content,
    Chart,
    Table,
    Select
  },
  computed: {
    ...mapGetters({
      businessTypesList: "basics/businessTypesList",
      basicsCustomerList: "basics/basicsCustomerList",
      customerChargeInfoList: "usageStatistics/customerChargeInfoList",
    }),
    customerChargeInfoChartOption () {
        // 图表
      let xAxisData = [],
      series= [{
        name: '下游计费',
        type: 'bar',
        data:[]
      },{
        name: '下游总调用次数',
        type: 'bar',
        data:[]
      },{
        name: '计费条数',
        type: 'bar',
        data:[]
      }]
      if (this.customerChargeInfoList.length) {
        this.customerChargeInfoList.forEach(v => {
          xAxisData.push(v.outServiceName)
          series[0].data.push(v.downCost)
          series[1].data.push(v.usedCount)
          series[2].data.push(v.chargeUsedCount)
        })
      }
      return {
        type: 'column',
        xAxisData,
        title: this.$t("m.usageStatistics.upstreamCustomerTitle"),
        series,
        callback: params => this.params = params 
      }
    },
    pieChartOption() {
      if(!this.params) return
      let index = this.params.dataIndex, sname = this.customerChargeInfoList[index].outServiceName, list = this.customerChargeInfoList[index].companyList, costs = [],legend = [],
        paramKey = (this.params.seriesName === '下游总调用次数'?'usedCount': (this.params.seriesName === '计费条数'?'chargeUsedCount':'cost'))
        this.tableData = list
      list.forEach(v => {
        let obj = {}
        for (let k in v) {
          obj.name = v['company']
          obj.value = v[paramKey]
        }
        legend.push(v.company)
        costs.push(obj)
      })
      let finalObj = {
        legend: legend,
        name: (this.params.seriesName === '下游总调用次数'?'总调用条数': (this.params.seriesName === '计费条数'?'计费条数':'上游计费')),
        data: costs
      }
      let tipTitle = (this.params.seriesName === '下游总调用次数'?'上游调用次数占比': (this.params.seriesName === '计费条数'?'下游调用次数占比':'上游调用费用详细信息'))
      
      return {
        type: 'pie',
        obj: finalObj,
        title: sname + tipTitle
      }
    }
  },
  methods: {
    initFun (options) {
      this.getCustomerChargeInfoAjax(options)
    },
    ...mapActions({
      getBasicCustomerAjax: "basics/getBasicCustomerAjax",
      getBasicBusinessTypesAjax: "basics/getBasicBusinessTypesAjax",
      getCustomerChargeInfoAjax: "usageStatistics/getCustomerChargeInfoAjax",
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

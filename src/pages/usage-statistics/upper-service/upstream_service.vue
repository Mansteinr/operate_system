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
        :isAll="true"
        :isMultiple="true"
        :defaultLable="'serviceNameZh'"/>
    </Inquiry>
    <!-- 上游服务占比 -->
    <Content :data="companyList">
      <Chart slot="Chart" :options="companyChartOption" />
      <Table
        slot="Table"
        :tableData="companyList"
        :tatalPage="companyList.length"
        :columns="columns1"
      />
    </Content>
    <!-- 下游客户占比 -->
    <Content :data="customerList">
      <Chart slot="Chart" :options="customerChartOption" />
      <Table
        slot="Table"
        :tableData="customerList"
        :tatalPage="customerList.length"
        :columns="columns"
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
      columns1: [{
        prop: 'customerName',
        label: '下游客户名称(中文)'
      }, {
        prop: 'loginName',
        label: '下游客户名称'
      },{
        prop: 'usedCount',
        label: '总调用次数',
        sortable: true,
      },{
        prop: 'chargeUsedCount',
        sortable: true,
        label: '计费条数'
      },{
        prop: 'cost',
        sortable: true,
        formatter: (row, column) => {
          return row[column.property].toFixed(4)
        },
        label: '下游计费'
      }],
      columns: [{
        prop: 'company',
        label: '上游公司名称'
      }, {
        prop: 'usedCount',
        sortable: true,
        label: '总调用条数'
      },{
        prop: 'chargeUsedCount',
        label: '计费条数',
        sortable: true,
      },{
        prop: 'cost',
        sortable: true,
        formatter: (row, column) => {
          return row[column.property].toFixed(4)
        },
        label: '小视入账'
      }],
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
      },
      titleTips: ''
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
      companyList: "usageStatistics/companyList",
      customerList: "usageStatistics/customerList",
      basicsServiceList: "basics/basicsServiceList",
    }),
    companyChartOption () {
      let xAxisData = [], series = [{
          name: this.$t("m.usageStatistics.cost"),
          type: 'bar',
          data:[]
        },{
          name: this.$t("m.usageStatistics.usedCount"),
          type: 'bar',
          data:[]
        },{
          name: this.$t("m.usageStatistics.chargeUsedCount"),
          type: 'bar',
          data:[]
        }]
      if(!this.companyList.length) return
      this.companyList.forEach(v => {
        xAxisData.push(v.company)
        series[0].data.push(v.cost)
        series[1].data.push(v.usedCount)
        series[2].data.push(v.chargeUsedCount)
      })
      return {
        type: 'column',
        xAxisData,
        series,
        title: this.$t("m.usageStatistics.upstreamServiceTitle")
      }
    },
    customerChartOption() {
      let xAxisData = [], series = [{
          name: this.$t("m.usageStatistics.cost"),
          type: 'bar',
          data:[]
        },{
          name: this.$t("m.usageStatistics.table2UsedCount"),
          type: 'bar',
          data:[]
        },{
          name: this.$t("m.usageStatistics.table2ChargeUsedCount"),
          type: 'bar',
          data:[]
        }]

        if(!this.customerList.length) return

        this.customerList.forEach(v => {
          xAxisData.push(v.loginName)
          series[0].data.push(v.cost)
          series[1].data.push(v.usedCount)
          series[2].data.push(v.chargeUsedCount)
        })
      return {
        type: 'column',
        xAxisData,
        series,
        title: this.$t("m.usageStatistics.upstreamCustomerTitle")
      }
    }
  },
  methods: {
    initFun (options) {
      if(options.serviceName) {
        options.serviceNames = options.serviceName.split(',')
        if(options.serviceNames[0] === '') {
          options.serviceNames = []
        }
      }
      delete options.serviceName
      this.getOutServiceChargeInfoAjax(options)
    },
    ...mapActions({
      getAllBasicServiceAjax: "basics/getAllBasicServiceAjax",
      getOutServiceChargeInfoAjax: "usageStatistics/getOutServiceChargeInfoAjax",
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

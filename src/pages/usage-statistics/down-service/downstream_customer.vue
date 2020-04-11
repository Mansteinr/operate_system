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
    <!-- Top10各服务计费调用 -->
    <Content :data="allUsageNameSortBydownChargedCountList">
      <Chart slot="Chart" :options="allUsageNameSortBydownChargedCountChartOption" />
      <Table
        slot="Table"
        :tableData="allUsageNameSortBydownChargedCountList"
        :tatalPage="allUsageNameSortBydownChargedCountList.length"
        :columns="columns"
      />
    </Content>
    <!-- Top10各服务调用金额占比 -->
    <Content :data="allUsageNameSortBydownCostList">
      <Chart slot="Chart" :options="allUsageNameSortBydownCostChartOption" />
      <Table
        slot="Table"
        :tableData="allUsageNameSortBydownCostList"
        :tatalPage="allUsageNameSortBydownCostList.length"
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
import { hotKeyTime, loginName,businessType } from '@/common/js/mixin'

export default {
  mixins: [ hotKeyTime, businessType, loginName],
  data () {
    return {
      columns: [{
        prop: 'serviceName',
        label: '服务名称'
      },{
        prop: 'serviceNameZh',
        label: '服务名称(中文)'
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
        prop: 'serviceName',
        label: '服务名称'
      },{
        prop: 'serviceNameZh',
        label: '服务名称(中文)'
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
    initFun (options) {
      this.getUsageByNameAjax(options)
    },
    ...mapActions({
      getBasicCustomerAjax: "basics/getBasicCustomerAjax",
      getBasicBusinessTypesAjax: "basics/getBasicBusinessTypesAjax",
      getCustomerChargeInfoAjax: "usageStatistics/getCustomerChargeInfoAjax",
      getUsageByNameAjax: "usageStatistics/getUsageByNameAjax",
    })
  },
  computed: {
    ...mapGetters({
      businessTypesList: "basics/businessTypesList",
      basicsCustomerList: "basics/basicsCustomerList",
      allUsageNameSortBydownChargedTop10: "usageStatistics/allUsageNameSortBydownChargedTop10",
      allUsageNameSortBydownChargedCountList: "usageStatistics/allUsageNameSortBydownChargedCountList",
      allUsageNameSortBydownCostTop10: "usageStatistics/allUsageNameSortBydownCostTop10",
      allUsageNameSortBydownCostList: "usageStatistics/allUsageNameSortBydownCostList"
    }),
    allUsageNameSortBydownCostChartOption() {
      return {
        type: 'HollowCircle',
        title: 'Top10各服务计费调用数量占比',
        tipTitle: '计费调用数量',
        obj: this.allUsageNameSortBydownCostTop10
      }
    },
    allUsageNameSortBydownChargedCountChartOption() {
      return {
        type: 'HollowCircle',
        title: 'Top10各服务调用金额占比',
        tipTitle: '计费调用数量',
        obj: this.allUsageNameSortBydownChargedTop10
      }
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

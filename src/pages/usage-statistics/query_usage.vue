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
      <Select
        :labelTitle="$t('m.basics.serviceName')"
        :originArr="basicsServiceList"
        :defaultValue="'serviceName'"
        :searchInput="true"
        :defaultLable="'serviceNameZh'"/>
    </Inquiry>

    <!-- 按日期分析 -->
    <Content :data="UsageByDateList">
      <Chart slot="Chart" :options="UsageByDateChartOption" />
      <Table
        slot="Table"
        ref="table"
        :tableData="UsageByDateList"
        :tatalPage="UsageByDateList.length"
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
import {
  hotKeyTime,
  businessType,
  loginName,
  services
} from "@/common/js/mixin"

export default {
  mixins: [hotKeyTime, businessType, loginName, services],
  data() {
    return {
      queryParams: {
        time: [
          new Date().getTime() - 3600 * 1000 * 24 * 7,
          new Date()
        ] /**默认时间最近七天 */
      },
      columns: [{
        prop: "dayTime",
        sortable: true,
        label: this.$t('m.basics.dayTime')
      }, {
        prop: "usedCount",
        sortable: true,
        label: this.$t('m.basics.usedCount')
      }, {
        prop: "downChargedCount",
        label: this.$t('m.basics.downChargedCount'),
        sortable: true
      }, {
        prop: "downCost",
        sortable: true,
        formatter: (row, column) => {
          return row[column.property].toFixed(4);
        },
        label: this.$t('m.basics.downCost')
      }]
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
      UsageByDateList: "queryIndex/UsageByDateList",
      businessTypesList: "basics/businessTypesList",
      basicsServiceList: "basics/basicsServiceList",
      basicsCustomerList: "basics/basicsCustomerList",
      allBusinessTypesList: "basics/allBusinessTypesList"
    }),
    UsageByDateChartOption() {
      let xAxisData = [],
        series = [ {
            name: this.$t("m.basics.usedCount"),
            data: []
          }, {
            name: this.$t("m.basics.downChargedCount"),
            data: []
          }, {
            name: this.$t("m.basics.downCost"),
            data: []
          }]
      if (this.UsageByDateList.length) {
        this.UsageByDateList.forEach(v => {
          xAxisData.push(v.dayTime);
          series[0].data.push(v.usedCount);
          series[1].data.push(v.downChargedCount);
          series[2].data.push(Math.floor(v.downCost * 100) / 100)
        });
      }
      return {
        xAxisData,
        title: this.$t("m.basics.UsageByDateChartTitle"),
        series
      };
    }
  },
  methods: {
    initFun(options) {
      this.getUsageByDateAjax(options)
    },
    ...mapActions({
      getUsageByDateAjax: "queryIndex/getUsageByDateAjax",
      getBasicServiceAjax: "basics/getBasicServiceAjax",
      getBasicCustomerAjax: "basics/getBasicCustomerAjax",
      getAllBasicServiceAjax: "basics/getAllBasicServiceAjax",
      getBasicBusinessTypesAjax: "basics/getBasicBusinessTypesAjax"
    })
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus"></style>

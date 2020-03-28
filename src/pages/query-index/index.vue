<template>
  <div class="template-wrapper">
    <!-- 查询模块 -->
    <Inquiry
      :queryParams="queryParams"
      @initFun="initFun"
      >
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
            :picker-options="pickerOptions2">
          </el-date-picker>
        </div>
      </el-form-item>
    </Inquiry>
    <!-- 按日期分析 -->
    <Content :data="UsageByDateList">
      <Chart slot="Chart" :options="UsageByDateChartOption"/>
      <Table slot="Table" ref="table" 
        :tableData="UsageByDateList" 
        :tatalPage="UsageByDateList.length" 
        :columns="columns"/>
    </Content>
    <!-- 按客户分析 -->
    <Content :data="UsageByCustomerList">
      <Chart slot="Chart" :options="UsageByCustomerChartOption"/>
      <Table slot="Table" ref="table" 
        :tableData="UsageByCustomerList" 
        :tatalPage="UsageByCustomerList.length" 
        :columns="columns"/>
    </Content>
  </div>
</template>

<script>
import Table from '@/components/Table'
import Chart from '@/components/Chart'
import Content from '@/components/Content'
import Inquiry from '@/components/Inquiry'
import { mapActions, mapGetters } from 'vuex'
import { hotKeyTime } from '@/common/js/mixin'
export default {
  mixins: [ hotKeyTime],
  data () {
    return {
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
      },
      columns: [{
        prop: 'dayTime',
        sortable: true,
        label: this.$t('m.basics.dayTime')
      },{
        prop: 'usedCount',
        sortable: true,
        label: this.$t('m.basics.usedCount')
      },{
        prop: 'downChargedCount',
        sortable: true,
        label: this.$t('m.basics.downChargedCount')
      },{
        prop: 'downCost',
        sortable: true,
        formatter: (row, column) => {
          return row[column.property].toFixed(4)
        },
        label: this.$t('m.basics.downCost')
      }],
      columns1: [{
        prop: 'customerName',
        sortable: true,
        label: this.$t('m.basics.customerName')
      },{
        prop: 'usedCount',
        sortable: true,
        label: this.$t('m.basics.usedCount')
      },{
        prop: 'downChargedCount',
        sortable: true,
        label: this.$t('m.basics.downChargedCount')
      },{
        prop: 'downCost',
        sortable: true,
        formatter: (row, column) => {
          return row[column.property].toFixed(4)
        },
        label: this.$t('m.basics.downCost')
      }]
    }
  },
  components: {
    Chart,
    Table,
    Inquiry,
    Content
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
    },
    initFun (options) {
      this.getUsageByDateAjax(options)
      this.getUsageByCustomerAjax(options)
    },
    ...mapActions({
      getUsageByDateAjax: 'queryIndex/getUsageByDateAjax',
      getUsageByCustomerAjax: 'queryIndex/getUsageByCustomerAjax',
    })
  },
  computed: {
    // ...mapState({
    //   UsageByDateList: 'queryIndex/UsageByDateList',
    //   UsageByCustomerList: 'queryIndex/UsageByCustomerList',
    // }),
    ...mapGetters({
      UsageByDateList: 'queryIndex/UsageByDateList',
      UsageByCustomerList: 'queryIndex/UsageByCustomerList',
   }),
   UsageByDateChartOption (){
    let xAxisData = [], series= [{
          name: this.$t('m.basics.usedCount'),
          data:[]
        },{
          name: this.$t('m.basics.downChargedCount'),
          data:[]
        },{
          name: this.$t('m.basics.downCost'),
          data:[]
        }]
    if (this.UsageByDateList.length) {
      this.UsageByDateList.forEach(v => {
        xAxisData.push(v.dayTime)
        series[0].data.push(v.usedCount)
        series[1].data.push(v.downChargedCount)
        series[2].data.push(Math.floor(v.downCost * 100) / 100)
      })
    }
    return {
      xAxisData,
      title: this.$t('m.basics.UsageByDateChartTitle'),
      series
    }
   },
   UsageByCustomerChartOption (){
    let xAxisData = [], series= [{
          name: this.$t('m.basics.usedCount'),
          data:[]
        },{
          name: this.$t('m.basics.downChargedCount'),
          data:[]
        },{
          name: this.$t('m.basics.downCost'),
          data:[]
        }]
    if (this.UsageByCustomerList.length) {
      this.UsageByCustomerList.forEach(v => {
        xAxisData.push(v.customerName)
        series[0].data.push(v.usedCount)
        series[1].data.push(v.downChargedCount)
        series[2].data.push(Math.floor(v.downCost * 100) / 100)
      })
    }
    return {
      xAxisData,
      title: this.$t('m.basics.UsageByCustomerChartTitle'),
      series
    }
   }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
.mv-tabs
  position relative
  overflow hidden
  .el-tabs__header
    position absolute
    right 0
  .el-tabs__content
    margin-top 45px
</style>

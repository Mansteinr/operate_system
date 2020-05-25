<template>
  <div class="template-wrapper">
    <Inquiry
      :queryParams="queryParams"
      ref="querForm"
      @initFun="initFun"
      >
    <el-form-item label="选择时间：" prop="time">
      <div class="block">
        <el-date-picker
          type="daterange" 
          unlink-panels
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          v-model="queryParams.time"
          :name='["start", "end"]'
          range-separator="至"
          :picker-options="pickerOptions2">
        </el-date-picker>
        </div>
      </el-form-item>
        <Select 
          :labelTitle="'行业类型'" 
          :originArr="businessTypesList" 
          :defaultValue="'typeId'" 
          :defaultLable="'typeName'"
          :isAll="true"
          @changeType="changeType"> 
        </Select>
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
        </serviceSelect>
      </Inquiry>

    <Content :data="UsageByResultList">
      <Chart slot="Chart" :options="UsageByResultChartOption" />
      <Table
        slot="Table"
        ref="table"
        :tableData="UsageByResultList"
        :tatalPage="UsageByResultList.length"
        :columns="columns"
      />
    </Content>
  </div>
</template>

<script>
import Table from '@/components/Table'
import Chart from '@/components/Chart'
import Select from "@/components/Select"
import Content from '@/components/Content'
import Inquiry from '@/components/Inquiry'
import { mapActions, mapGetters } from 'vuex'
import { hotKeyTime, businessType, loginName, services } from '../../common/js/mixin'
export default {
  mixins: [ hotKeyTime, businessType, loginName, services],
  data () {
    return {
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()]/**默认时间最近七天 */
      },
      columns: [{ // 定义table
        prop: 'serviceName',
        minWidth: "160px",
        label: '服务名'
      }, { 
        prop: 'serviceNameZh',
        minWidth: "160px",
        label: '服务名(中文)'
      }, { 
        prop: 'result',
        label: 'RESULT'
      }, { 
        prop: 'resultCode',
        label: 'resultCode'
      }, { 
        prop: 'usedCount',
        label: '共计使用量'
      }, { 
        prop: 'downChargedCount',
        label: '计费使用量'
      }, { 
        prop: 'downCost',
        label: '消费金额',
        formatter: row => {
          return row.downCost.toFixed(4)
        }
      }]
    }
  },
  components: {
    Chart,
    Table,
    Inquiry,
    Content,
    Select
  },
  computed: {
    ...mapGetters({
      UsageByResultList: 'tools/UsageByResultList',
      businessTypesList: "basics/businessTypesList",
      basicsServiceList: "basics/basicsServiceList",
      basicsCustomerList: "basics/basicsCustomerList"
    }),
    UsageByResultChartOption() {
      let xAxisData = [], 
        series= [{
          name: '共计使用量',
          data:[]
        },{
          name: '计费使用量',
          data:[]
        },{
          name: '消费金额',
          data:[]
        }]

        this.UsageByResultList.forEach(v => {
          if (v.resultCode) {
            xAxisData.push(v.result + ':' + v.resultCode)
          } else {
              xAxisData.push(v.result)
          }
          series[0].data.push(v.usedCount)
          series[1].data.push(v.downChargedCount)
          series[2].data.push(Math.floor(v.downCost * 100) / 100)
        })
        return {
          xAxisData,
          series
        }
    }
  },
  methods: {
    initFun () {
      let options = {}
      this.$refs.querForm.$refs.querForm.$el.querySelectorAll('input').forEach(v => {
        if (v.name) {
          if (v.name === 'typeId') {
            options.businessType = v.value
          } else {
            options[v.name] = v.value
          }
        }
      })
      delete options.typeId
      this.getQueryQualityAjax(options)
    },
    ...mapActions({
      getQueryQualityAjax: "tools/getQueryQualityAjax",
      getBasicServiceAjax: "basics/getBasicServiceAjax",
      getBasicCustomerAjax: "basics/getBasicCustomerAjax",
      getAllBasicServiceAjax: "basics/getAllBasicServiceAjax",
      getBasicBusinessTypesAjax: "basics/getBasicBusinessTypesAjax"
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

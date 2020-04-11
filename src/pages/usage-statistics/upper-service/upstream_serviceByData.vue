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
    <Content :isOnlyTable="true" :data='outServiceChargeInfoByDayList'> 
      <Table
        slot="onlyTable"
        :tableData="outServiceChargeInfoByDayListComputed"
        :tatalPage="outServiceChargeInfoByDayList.length"
        :columns="columns"
      />
    </Content>
  </div>
</template>

<script>
import Table from "@/components/Table"
import Select from "@/components/Select"
import Content from "@/components/Content"
import Inquiry from "@/components/Inquiry"
import { mapActions, mapGetters } from "vuex"
import {hotKeyTime, services, loginName } from '@/common/js/mixin'
export default {
  mixins: [hotKeyTime, services, loginName],
  data () {
    return {
      unquieTable:[],
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
      },
      columns: []
    }
  },
  components: {
    Inquiry,
    Content,
    Select,
    Table
  },
  computed: {
    ...mapGetters({
      basicsServiceList: "basics/basicsServiceList",
      basicsCustomerList: "basics/basicsCustomerList",
      outServiceChargeInfoByDayList: "usageStatistics/outServiceChargeInfoByDayList",
    }),
    outServiceChargeInfoByDayListComputed() {
        this.columns = [] // 清空数据
        //先将三维数组转为一维数组 因为最后只要将数组转为[{"日期":'2018-10-21','当天所有服务的计费总量之和'：10，'以及各个服务当天计费之和’：10}]
        let returnData = this.outServiceChargeInfoByDayList, arrData = [],arrTableHeader = []
        if (!returnData.length) {
          // this.tableData = returnData // 当数据为空时 置空防止下面保错
          return []
        }
        returnData.forEach(v => {
          v.dateList.forEach(v2 => {
            if (!arrData.length) {
              let obj = {}
              obj.dateTime = v2.dateTime
              obj.chargeUsedCount = v2.chargeUsedCount
              v2.companyList.forEach(v3 => {
                obj[v3.company] = v3.chargeUsedCount
              })
              arrData.push(obj)
            } else {
              let index = 0, flag = false
              arrData.forEach((v4,k) => {
                if (v2.dateTime === v4.dateTime) {
                  flag = true
                  index = k
                }
              })
              if (flag) {
                arrData[index].chargeUsedCount += v2.chargeUsedCount
                v2.companyList.forEach(v3 => {
                  if (arrData[index][v3.company]){
                    arrData[index][v3.company] += v3.chargeUsedCount
                  } else {
                    arrData[index][v3.company] = v3.chargeUsedCount
                  }
                })
              } else {
                let obj = {}
                obj.dateTime = v2.dateTime
                obj.chargeUsedCount = v2.chargeUsedCount
                v2.companyList.forEach(v3 => {
                  obj[v3.company] = v3.chargeUsedCount
                })
                arrData.push(obj)
              }
            }
          })
        })
        // this.tableData = arrData
        arrData.map(v => {
          arrTableHeader = [...arrTableHeader,...Object.keys(v)]
        })
        this.unquieTable = [...new Set(arrTableHeader)]
        this.unquieTable.forEach(v => {
          this.columns.push({
            prop: v,
            sortable: true,
            label: v === 'dateTime' ? '日期':(v==='chargeUsedCount'?'计费调用总量':v)
          })
        })

        return arrData
    }
  },
  methods: {
    initFun (options) {
      options.serviceNames = options.serviceName.split(',')
      if (options.serviceNames[0] === '') {
        options.serviceNames = []
        delete options.serviceName
        this.getAllOutServiceChargeInfoAjax(options)
      } else {
        delete options.serviceName
        this.getOutServiceChargeInfoByDayAjax(options)
      }
    },
      
    ...mapActions({
      getBasicServiceAjax: "basics/getBasicServiceAjax",
      getAllBasicServiceAjax: "basics/getAllBasicServiceAjax",
      getBasicCustomerAjax : "basics/getBasicCustomerAjax",
      getAllOutServiceChargeInfoAjax : "usageStatistics/getAllOutServiceChargeInfoAjax",
      getOutServiceChargeInfoByDayAjax : "usageStatistics/getOutServiceChargeInfoByDayAjax",
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>


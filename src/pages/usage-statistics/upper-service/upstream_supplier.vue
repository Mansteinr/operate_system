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
        :labelTitle="$t('m.basics.supplierName')"
        :searchInput="true"
        :defaultValue="'companyName'"
        :originArr="supplierCompanysList"
      />
    </Inquiry>
    <!-- 按供应商分析 -->
    <Content :data="dayCompanyList">
      <Chart slot="Chart" :options="dayCompanyListOption" />
      <Table
        slot="Table"
        :tableData="dayCompanyList"
        :tatalPage="dayCompanyList.length"
        :columns="columns"
      />
    </Content>
    <!-- 按供应商服务分析 -->
    <Content :isOnlyTable="true" :data="serviceCompanyList">
      <Table
        slot="onlyTable"
        :tableData="serviceCompanyList"
        :tatalPage="serviceCompanyList.length"
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
import { hotKeyTime, company } from "@/common/js/mixin"
export default {
  mixins: [hotKeyTime, company],
  data() {
    return {
      queryParams: {
        time: [
          new Date().getTime() - 3600 * 1000 * 24 * 7,
          new Date()
        ] /**默认时间最近七天 */,
        companyName: ""
      },
      columns: [{
        prop: "company",
        label: "供应商名称"
      }, {
        prop: "dayTime",
        label: "时间"
      }, {
        prop: "serviceNameZh",
        label: "服务名称"
      }, {
        prop: "usedCount",
        label: "调用总量",
        sortable: true
      }, {
        prop: "chargeUsedCount",
        label: "计费调用量",
        sortable: true
      }, {
        prop: "noChargeCount",
        label: "不计费调用量",
        sortable: true
      }, {
        prop: "cost",
        label: "小视入账",
        sortable: true,
        formatter: (row, column) => {
          return row[column.property].toFixed(4);
        }
      }],
      columns1: [{
        prop: "company",
        label: "供应商名称"
      }, {
        prop: "serviceNameZh",
        label: "服务名称"
      }, {
        prop: "usedCount",
        label: "调用总量",
        sortable: true
      }, {
        prop: "chargeUsedCount",
        label: "计费调用量",
        sortable: true
      }, {
        prop: "noChargeCount",
        label: "不计费调用量",
        sortable: true
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
      supplierCompanysList: "usageStatistics/supplierCompanysList",
      dayCompanyList: "usageStatistics/dayCompanyList",
      serviceCompanyList: "usageStatistics/serviceCompanyList",
    }),
    dayCompanyListOption() {
      let xFiled = {},  finalArr = {} // 将所有的服务名都存储在该对象中
      if (this.dayCompanyList.length) {
        this.dayCompanyList.forEach(v => {
          if (!finalArr[v.serviceName]) {
            // 检测该服务名是否已经存储在finalArr中 否则存  反之不存
            finalArr[v.serviceName] = {
              name: v.serviceNameZh,
              dataArr: []
            }
          }
          if (xFiled[v.dayTime]) {
            // 如果日期存在 则将对应的服务名机器对应的使用量生产key value
            xFiled[v.dayTime][v.serviceName] = v.usedCount
          } else {
            xFiled[v.dayTime] = {} // //如果日期不存在  则生成一个空对象
            xFiled[v.dayTime][v.serviceName] = v.usedCount // 再将对应的服务名及对应的使用量生成key value
          }
        })
        let nuqinexFild = [] // 去重x轴
        for (let k in xFiled) {
          // 循环xFiled中的每一项
          nuqinexFild.push(k);
          for (let k1 in finalArr) {
            // 循环finalArr中的每一项
            if (xFiled[k][k1]) {
              finalArr[k1].dataArr.push(xFiled[k][k1])
            } else {
              finalArr[k1].dataArr.push(0)
            }
          }
        }
        let mycolor = [ "#86D560", "#AF89D6", "#59ADF3","#FF999A", "#FFCC67","#2cb5ab","#91bf5d","#f8a89f","#00FFFF","#7FFFAA", "#2E8B57","#F5F5DC", "#BC8F8F", "	#808080"],
          k = 0,
          lineData = [];
        for (let key in finalArr) {
          lineData.push({
            name: finalArr[key].name,
            type: "line",
            smooth: true,
            lineStyle: {
              normal: {
                width: 1,
                color: mycolor[k]
              }
            },
            areaStyle: {
              normal: {
                color: mycolor[k]
              }
            },
            itemStyle: {
              normal: {
                color: mycolor[k]
              }
            },
            data: finalArr[key].dataArr
          })
          k += 1
        }
        return {
          xAxisData: nuqinexFild,
          title: this.$t("m.basics.supplierChartTitle"),
          series: lineData
        }
      }
    }
  },
  methods: {
    initFun(options) {
      this.getOutServiceChargeInfoBySupplierAjax(options);
    },
    ...mapActions({
      getSupplierCompanysAjax: "usageStatistics/getSupplierCompanysAjax",
      getOutServiceChargeInfoBySupplierAjax: "usageStatistics/getOutServiceChargeInfoBySupplierAjax"
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus"></style>

<template>
  <div class="template-wrapper">
    <Inquiry class="card-wrapper" :queryParams="queryParams" @initFun="initFun">
      <div class="card-container clearfix">
        <el-form :inline="true"  ref="querForm" :rules="rules" :model="queryParams" class="query-form">
          <div class="show-query query-form">
            <el-form-item label="选择日期：" prop="date">
              <div class="block">
                <el-date-picker
                  v-model="queryParams.date"
                  type="date"
                  name="date"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="开始时间：" prop="start1">
              <div class="block">
                <el-time-picker
                  v-model="queryParams.start1"
                  name="start"
                  placeholder="选择开始时间">
                </el-time-picker>
              </div>
            </el-form-item>
            <el-form-item label="结束时间：" prop="end1">
              <div class="block">
                <el-time-picker
                  v-model="queryParams.end1"
                  name="end"
                  placeholder="选择结束时间">
                </el-time-picker>
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
          </div>
          <div class="qurey-btn" style="margin: 10px 0 0 10px;">
            <el-button type="primary" plain size="small" @click="showHideToggle">{{showHideFlag?"显示":"隐藏"}}</el-button>
          </div>
          <div class="query-hide" :class="showHideFlag ? 'active' : '' " ref="paramsBox">
            <el-form-item v-for="(v, key) in queryParamsByServiceNameList" :label="`${v.paramNameCh}：`" :key="key">
              <el-input
                :title="v.paramNameCh"
                :placeholder="`请输入${v.paramNameCh}`"
                :name="v.paramName">
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </Inquiry>
       <!-- 按日期分析 -->
    <Content :isOnlyTable="true"  :data="allLogsList">
      <Table
        slot="onlyTable"
        ref="table"
        :showSummary="false"
        :tableData="allLogsList"
        :tatalPage="allLogsList.length"
        :columns="columns"
      />
    </Content>
  </div>
</template>

<script>
/**
 * 要点：
 *  1、参数  
 *    参数中开始事件、结束时间、客户名称、接口类型必传项，其余参数通过接口查询获取，若客户填则填的参数必传，不填则不传
 *    若注意耗时大于 要大于 耗时小于  还有这两个参数不是通过后台接口获取的 是前台根据后台需要的字段写死的
 *    
 *    查询的参数要包裹在params里面
 *    
 *    参数格式
 *    {
 *      "serviceName":"VehicleLicenseNameCheck",
 *      "params":{},
 *      "start":"2019-04-23 12:42:52",
 *      "end":"2019-04-23 13:42:52"
 *    }
 * 
 */
import Table from "@/components/Table"
import Select from "@/components/Select"
import Content from "@/components/Content"
import Inquiry from "@/components/Inquiry"
import { mapActions, mapGetters } from "vuex"
import {businessType, loginName, services } from '@/common/js/mixin'

export default {
  mixins: [businessType, loginName, services],
  data () {
    let timeRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择时间'));
      } else {
        callback()
      }
    }
    return {
      rules: {
         time: [{ validator: timeRule, trigger: 'change' }]
      },
      queryParams: {
        date: new Date(),
        start1: new Date(+new Date() - 3600 * 1000),
        end1: new Date()
      },
      columns: [{ // 定义table
        prop: 'loginName',
        width: "160px",
        label: '用户名'
      }, { 
        prop: 'guid',
        width: "270px",
        label: 'guid'
      }, { 
        prop: 'beginTime',
        sortble: true,
        width: "150px",
        label: '请求时间',
        formatter: row => {
         return this.$refs.table.formatterTime(row.beginTime)
        }
      }, { 
        prop: 'param',
        label: '参数',
        width: '200px',
        template: scope => {
          return this.$refs.table.formatterParams(scope.row.param)
        }
      }, { 
        prop: 'costTime_all',
        sortble: true,
        width: "80px",
        label: '耗时(ms)'
      }, { 
        prop: 'rsp.RESULT',
        label: 'RESULT',
        width: "80px",
        sortble: true
      }, { 
        prop: 'rsp.flagCode',
        label: 'flagCode',
        width: "80px",
        sortble: true
      }, { 
        prop: 'rsp',
        label: 'resultCode',
        width: "90px",
        sortble: true,
        formatter: row => {
          return row.detail ? row.detail.resultCode : ''
        }
      }, { 
        prop: 'ip',
        width: "130px",
        label: 'IP地址'
      }, { 
        prop: 'srcQueryReturnList',
        label: '渠道',
        formatter: row => {
         return this.$refs.table.formatterSrc(row.srcQueryReturnList)
        }
      }],
      showHideFlag: false // 控制显示隐藏参数
    }
  },
  components: {
    Inquiry,
    Content,
    Table,
    Select
  },
  computed: {
    ...mapGetters({
      allLogsList: "tools/allLogsList",
      businessTypesList: "basics/businessTypesList",
      basicsServiceList: "basics/basicsServiceList",
      basicsCustomerList: "basics/basicsCustomerList",
      allBusinessTypesList: "basics/allBusinessTypesList",
      queryParamsByServiceNameList: "basics/queryParamsByServiceNameList"
    })
  },
  methods: {
    ...mapActions({
      getLogsListAjax: "tools/getLogsListAjax",
      getBasicServiceAjax: "basics/getBasicServiceAjax",
      getBasicCustomerAjax: "basics/getBasicCustomerAjax",
      getAllBasicServiceAjax: "basics/getAllBasicServiceAjax",
      getBasicBusinessTypesAjax: "basics/getBasicBusinessTypesAjax",
      getParamsByServiceNameAjax: "basics/getParamsByServiceNameAjax"
    }),
    initFun () {
      // 组装参数
      let options = {}
      document.querySelector('.show-query').querySelectorAll('input').forEach(v => {
        if (v.name && v.name != 'typeId') {
          options[v.name] = v.value
        }
      })
      let params = {}
      if (this.showHideFlag) {
        document.querySelector('.query-hide').querySelectorAll('input').forEach(v => {
          if (v.name && v.value) {
            if (v.name === 'lowerCostTime' || v.name === 'upperCostTime') {
              options[v.name] = v.value.replace(/(^\s*)|(\s*$)/g, "")
            } else {
              params[v.name] = v.value.replace(/(^\s*)|(\s*$)/g, "") // 去除两端空格
            }
            
          }
        })
      }
      options.params = params
      options.start = options.date + ' ' + options.start
      options.end = options.date + ' ' + options.end
      delete options.date
      if (options.lowerCostTime/1 > options.upperCostTime/1) {
        showModal('输入时间有误', 'error')
        return 
      }
      this.getLogsListAjax(options)
    },
    formatterSrc (val) { // 渠道展示
      if (val && val.length) {
        let html = ''
        val.forEach(v => {
          if (v.className) {
            html += `<span class="param-item" title="渠道名称: ${v.className.split('.')[2]}  ${v["invokeCostTime"]}">渠道名称: ${v.className.split('.')[2]}  ${v["invokeCostTime"]}</span>`
          }
        })
        return html
      }
    },
    showHideToggle() {
      this.showHideFlag = !this.showHideFlag
      let op = {
        serviceId: this.basicsServiceList[0].serviceId,
        serviceName: this.basicsServiceList[0].serviceName,
        serviceNameZh: this.basicsServiceList[0].serviceNameZh
      }
      if (this.showHideFlag) {
        this.selectService(op) 
      } else {
        this.paramsArr = []
      }
     
    },
    formatter(val) {
      return this.$refs.table.formatter(val)
    },
    queryGuid (val) {
      return this.$refs.table.queryGuid(val)
    },
    selectService (v) {
      if (!this.showHideFlag) return
      this.getParamsByServiceNameAjax(v)
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
.query-hide
  .el-form-item
    margin-top 10px
</style>


          
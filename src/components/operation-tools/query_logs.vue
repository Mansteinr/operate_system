<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
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
              :labelTitle="'行业类型'" 
              :originArr="businessType" 
              :defaultValue="'typeId'" 
              :defaultLable="'typeName'"
              :isAll = true
              @changeInputValue="changeType"> 
            </Select>
            <loginNameSelect 
              :labelTitle="'客户名称'" 
              :originArr="loginName" 
              :defaultValue="'loginName'" 
              :defaultLable="'customerName'"
              :needValue="'customerId'"
              :searchInput=true
              :isAll=true
              @changeInputValue="changeCustomer">
            </loginNameSelect>
            <serviceSelect 
              :labelTitle="'接口类型'" 
              :originArr="services" 
              :defaultValue="'serviceName'" 
              :searchInput = true
              :defaultLable="'serviceNameZh'">
            </serviceSelect>
          </div>
          <div class="qurey-btn" style="margin: 10px 0 0 10px;">
            <el-button type="primary" plain size="small" @click="showHideToggle">{{showHideFlag?"显示":"隐藏"}}</el-button>
          </div>
          <div class="query-hide" ref="paramsBox">
            <el-form-item v-for="(v, key) in paramsArr" :label="`${v.paramNameCh}：`" :key="key">
              <el-input
                :placeholder="`请选${v.paramNameCh}`"
                :name="v.paramName">
              </el-input>
            </el-form-item>
          </div>
          <el-form-item class="query-item">
           <query-button @reset="reset" @submit="onSubmit"></query-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="card-wrapper card-content">
      <div class="card-title">
        查询结果
      </div>
      <div class="card-container">
        <div v-show="!tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <Table class="table table1" ref="table" :tableData="tableData" :showSummary="false" :tatalPage="tableData.length" v-show="tableData.length">
          <el-table-column
            label="用户名"
            prop="loginName">
          </el-table-column>
          <el-table-column
            label="guid"
            width="260"
            prop="guid">
            <template slot-scope="scope">
              <div class="link" @click="queryGuid(scope.row.guid)">{{scope.row.guid}}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="请求时间"
            sortable
            width="160"
            :formatter="formatterTime"
            prop="beginTime">
          </el-table-column>
          <el-table-column
            label="请求参数"
            width="200"
            prop="param">
            <template slot-scope="scope">
              <div v-html="formatterParams(scope.row.param)"></div>
            </template>
          </el-table-column>
          <el-table-column
            label="耗时(ms)"
            width="120"
            sortable
            prop="costTime_all">
          </el-table-column>
          <el-table-column
            label="命中缓存"
            :formatter="formatterCache"
            prop="readCacheHit">
          </el-table-column>
          <el-table-column
            label="RESULT"
            sortable
            width="100"
            prop="rsp.RESULT">
          </el-table-column>
          <el-table-column
            label="resultCode"
            width="100"
            prop="rsp.resultCode">
          </el-table-column>
          <el-table-column
            label="IP地址"
            width="120"
            prop="ip">
          </el-table-column>
          <el-table-column
            label="渠道"
            width="180"
            prop="srcQueryReturnList?className.split('.')[2]&invokeCostTime">
              <template slot-scope="scope">
                <div v-html="formatterSrc(scope.row.srcQueryReturnList)"></div>
              </template>
          </el-table-column>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 要点：
 *  1、参数  
 *    参数中开始事件、结束时间、客户名称、接口类型必传项，其余参数通过接口查询获取，若客户填则填的参数必传，不填则不传
 *    若注意耗时大于 要大于 耗时小于  还有这两个参数不是通过后台接口获取的 是前台根据后台需要的字段写死的
 *    
 *   查询的参数要包裹在params里面
 * 
 * 
 */
import { $http } from '../../common/js/ajax'
import { switchMixin, businessType, loginName,services } from '../../common/js/mixin'
import Table from '../../base/Table'
import QueryButton from '../../base/QueryButton'
import loginNameSelect from '../../base/Select'
import serviceSelect from '../../base/Select'
import Select from '../../base/Select'
import { showModal, reset } from '../../utils'
import moment from 'monent'
export default {
  mixins: [switchMixin, businessType, loginName, services],
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
        label: '用户名'
      }, { 
        prop: 'guid',
        width="260",
        label: 'guid'
      }, { 
        prop: 'guid',
        width="260",
        label: 'guid'
      }, { 
        prop: 'beginTime',
        sortble: true,
        label: '请求时间',
        formatter: row => {
          moment(val.beginTime).format('YYYY-MM-DD HH:mm:ss')
        }
      }],
      tableData: [],
      paramsArr: [], // 渲染后台查询得到的参数
      showHideFlag: false // 控制显示隐藏参数
    }
  },
  components: {
    Table,
    Select,
    QueryButton,
    serviceSelect,
    loginNameSelect
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
      reset()
    },
    onSubmit () {
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
              options[v.name] = v.value
            } else {
              params[v.name] = v.value
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
      this.logs(options)
    },
    formatterTime (val) {
      return moment(val.beginTime).format('YYYY-MM-DD HH:mm:ss')
    },
    formatterCache(val) {
      return val.readCacheHit ? '是' : '否'
    },
    formatterParams (val) { // 参数展示
      return this.$refs.table.formatterParams(val)
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
        serviceId: this.services[0].serviceId,
        serviceName: this.services[0].serviceName,
        serviceNameZh: this.services[0].serviceNameZh
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
      $http(this.API.paramsApi.queryParamsByServiceName, v).then((res) => {
        res.resData.paramNameBeans.forEach(v => {
          this.queryParams.params[v.paramName] = ''
        })
        this.paramsArr = [...res.resData.paramNameBeans, ...[{
          paramName: 'lowerCostTime',
          paramNameCh: '耗时大于'
        },{
          paramName: 'upperCostTime',
          paramNameCh: '耗时小于'
        }]]
      })
    },
    logs (options) {
      $http(this.API.upApi.logs, options).then((res) => {
        this.tableData = res.resData
      })
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


          
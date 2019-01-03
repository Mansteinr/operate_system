<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container clearfix">
        <el-form :inline="true"  ref="querForm" :rules="rules" :model="queryParams" class="query-form">
          <div class="show-query">
            <el-form-item label="选择日期：" prop="date">
              <div class="block">
                <el-date-picker
                  v-model="queryParams.date"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="开始时间：" prop="start1">
              <div class="block">
                <el-time-picker
                  v-model="queryParams.start1"
                  placeholder="选择开始时间">
                </el-time-picker>
              </div>
            </el-form-item>
            <el-form-item label="结束时间：" prop="end1">
              <div class="block">
                <el-time-picker
                  v-model="queryParams.end1"
                  placeholder="选择结束时间">
                </el-time-picker>
              </div>
            </el-form-item>
            <el-form-item label="行业类型：" prop="type">
              <el-select @change="changeType" v-model="queryParams.type" placeholder="请选择">
                <el-option
                  v-for="v in businessType"
                  :key="v.typeId"
                  :label="v.typeName"
                  :value="v.typeId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户名称：" prop="loginName">
              <el-select filterable v-model="queryParams.loginName" placeholder="请选择">
                <el-option
                  v-for="v in loginName"
                  @click.native.stop="changeCustomer(v)"
                  :key="v.customerId"
                  :title="`${v.customerName}(${v.loginName})`"
                  :data-customerid="v.customerId"
                  :label="v.customerName"
                  :value="v.loginName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="接口类型：" prop="serviceName">
              <el-select filterable v-model="queryParams.serviceName" placeholder="请选择">
                <el-option
                  v-for="v in services"
                  :key="v.serviceId"
                  @click.native="selectService(v)"
                  :title="`${v.serviceNameZh}(${v.serviceName})`"
                  :label="v.serviceNameZh"
                  :value="v.serviceName">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="qurey-btn" style="margin: 10px 0 0 10px;">
            <el-button class="query-button" size="small" @click="showHideToggle">{{showHideFlag?"显示":"隐藏"}}</el-button>
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
        <Table class="table" :tableData="tableData" :showSummary="false" :tatalPage="tableData.length" v-show="tableData.length">
          <el-table-column
            label="用户名"
            prop="loginName">
          </el-table-column>
          <el-table-column
            label="guid"
            width="280"
            prop="guid">
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
            :formatter="formatterParams"
            prop="param">
            <template slot-scope="scope">
              <div v-html="formatterParams(scope.row.param)"></div>
            </template>
          </el-table-column>
          <el-table-column
            label="耗时(ms)"
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
            prop="rsp.RESULT">
          </el-table-column>
          <el-table-column
            label="resultCode"
            sortable
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
            prop="srcQueryReturnList">
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
import $http from '../../common/js/ajax'
import { setRadiiData, renderChart } from '../../common/js/myCharts'
import { switchMixin, businessType, loginName,services } from '../../common/js/mixin'
import Table from '../../base/Table'
import QueryButton from '../../base/QueryButton'
import { showModal } from '../../utils'
import moment from 'moment'
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
        loginName: '',
        type: '',
        date: new Date(),
        start1: new Date(+new Date() - 3600 * 1000),
        end1: new Date(),
        lowerCostTime: null,
        upperCostTime: null,
        params: {}
      },
      tableData: [],
      paramsArr: [],
      showHideFlag: false
    }
  },
  components: {
    Table,
    QueryButton
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
      this.queryParams.loginName = this.loginName[0]
    },
    onSubmit () {
      this.$refs.querForm.validate((valid) => {
        if (valid) {
          this.resetTabFlag()
          this.logs()
        }
      })
    },
    formatterTime (val) {
      return moment(val.beginTime).format('YYYY-MM-DD HH:mm:ss')
    },
    formatterCache(val) {
      return val.readCacheHit ? '是' : '否'
    },
    formatterParams (val) { // 参数展示
      var html = '';
      for (var key in val) {
        var label = key
        switch (key) {
          case 'accountNo':
            label = '银行卡号'
            break;
          case 'idCard':
            label = '身份证号'
            break;
          case 'mobile':
            label = '手机号码'
            break;
          case 'name':
            label = '姓名'
            break;
          case 'plateNumber':
            label = '车牌号'
            break;
          case 'plateType':
            label = '号牌种类'
            break;
          default:
            label = key
            break;
        }
        // 只展示下面几个参数 其他不需要展示
        if (key == 'accountNo' || key == 'idCard' || key == 'mobile' || key == 'name' || key == 'plateNumber' || key == 'plateType') {
          html += '<span class="param-item" title="' + label + ': ' + val[key] + '">' + label + ': ' + val[key] + '</span>'
        }
      }
      return html
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
    logs () {
      let options = {}, inputs = Array.from(this.$refs.paramsBox.getElementsByTagName('input'))
      options.params = {}
      if (inputs.length) {
        inputs.forEach(v => {
          if (v.name === 'upperCostTime'|| v.name === 'lowerCostTime') {
            options[v.name] = v.value
          } else {
            options.params[v.name] = v.value
          }
        })
      }
      if (options.lowerCostTime/1 > options.upperCostTime/1) {
        showModal('输入时间有误', 'error')
        return 
      }
      let day = moment(this.queryParams.date).format('YYYY-MM-DD')
      // return
      options.start = day + ' ' + moment(this.queryParams.start1).format('HH:mm:ss')
      options.end = day + ' ' + moment(this.queryParams.end1).format('HH:mm:ss')
      options.serviceName = this.queryParams.serviceName

      $http(this.API.upApi.logs, options).then((res) => {
        this.tableData = res.resData
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

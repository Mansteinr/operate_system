<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="查询日期：">
            <div class="block">
              <el-date-picker v-model="value1" type="date" placeholder="选择日期">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="开始时间：">
            <div class="block">
              <el-time-picker v-model="value2" placeholder="任意时间点">
              </el-time-picker>
            </div>
          </el-form-item>
          <el-form-item label="结束时间：">
            <div class="block">
              <el-time-picker v-model="value3" placeholder="任意时间点">
              </el-time-picker>
            </div>
          </el-form-item>
          <el-form-item label="行业类型：">
            <el-select v-model="bussinessType" placeholder="请选择">
              <el-option v-for="item in bussinessList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户名称：">
            <el-select v-model="formInline.loginName" filterable placeholder="请选择">
              <el-option v-for="item in customerArr" :key="item.loginName" :label="item.customerName" :value="item.loginName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务名称：">
            <el-select v-model.trim="formInline.serviceName" filterable placeholder="请选择">
              <el-option v-for="item in serviceArr" :key="item.serviceName" :label="item.serviceNameZh" :value="item.serviceName">
                <span style="float: left">{{ item.serviceNameZh }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="card-query">
            <el-button type="primary" @click="onSubmit" round>查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="card-wrapper card-content">
      <div class="card-title">
        查询结果
        <el-input v-model="search" size="mini" class="serarch-input" placeholder="请输入关键字" />
      </div>
      <div class="card-container">
        <el-table :data="tableDataComputed.filter(data => filterTable(data))" style="width: 100%">
          <el-table-column label="客户名称" prop="loginName">
          </el-table-column>
          <el-table-column label="guid" width="280" prop="guid">
          </el-table-column>
          <el-table-column label="请求时间" sortable width="180" :formatter="formatterTime" prop="beginTime">
          </el-table-column>
          <el-table-column label="耗时(ms)" sortable prop="costTime_all">
          </el-table-column>
          <el-table-column label="请求参数" width="180" prop="param">
            <template slot-scope="scope">
              <div v-html="formatterParam(scope.row)"></div>
            </template>
          </el-table-column>
          <el-table-column label="RESULT" prop="rsp.RESULT">
          </el-table-column>
          <el-table-column label="ip" width="150" prop="ip">
          </el-table-column>
        </el-table>
        <pagination @changePage="changePage" :tatalPage="tatalPage"></pagination>
      </div>
    </div>
  </div>
</template>

  <script>
/* eslint-disable */
import $http from '../common/js/api'
import moment from 'moment'
import Pagination from '../base/Pagination'
export default {
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      tatalPage: 0,
      search: '',
      value1: moment(+new Date()).format('YYYY-MM-DD'),
      value2: new Date(new Date().getTime() - 60 * 5 * 1000),
      value3: new Date(),
      formInline: {
        serviceName: '',
        loginName: '',
      },
      bussinessType: '全部',
      tableData: [],
      customerArr: [],
      serviceArr: [],
      bussinessList: [{
        label: '全部',
        value: '全部'
      }, {
        label: '金融公司',
        value: '金融公司'
      }, {
        label: '数据公司',
        value: '数据公司'
      }, {
        label: '租车',
        value: '租车'
      }, {
        label: '婚恋',
        value: '婚恋'
      }, {
        label: '其他',
        value: '其他'
      }]
    }
  },
  components: {
    Pagination
  },
  computed: {
    tableDataComputed () {
      if (this.tableData && this.tableData.length) {
        let start = this.pageSize * (this.currentPage - 1)
        let end = Math.min(this.pageSize * (this.currentPage), this.tableData.length)
        return this.tableData.slice(start, end)
      } else {
        return []
      }
    },
  },
  methods: {
    changePage (value) {
      this[value.split('-')[0]] = value.split('-')[1] / 1
    },
    // queryCustomers () {
    //   let url = '/operation/down/queryCustomers'
    //   $http(url, {}, 'get').then((res) => {
    //     if (res.resData.length) {
    //       this.customerArr = res.resData
    //       if (this.customerArr.length) {
    //         this.formInline.loginName = this.customerArr[0].loginName
    //       }
    //     }
    //   })
    // },
    services () {
      let url = '/operation/down/queryServices'
      $http(url, {}, 'get').then((res) => {
        this.serviceArr = res.resData
        if (this.serviceArr.length) {
          this.formInline.serviceName = this.serviceArr[0].serviceName
        }
      })
    },
    log (params) {
      let url = '/operator/logs'
      $http(url, params).then((res) => {
        this.tableData = res.resData
        this.tatalPage = this.tableData.length
      })
    },
    onSubmit () {
      this.formInline.end = this.value1 + ' ' + moment(this.value3).format('HH:mm:ss')
      this.formInline.start = this.value1 + ' ' + moment(this.value2).format('HH:mm:ss')
      this.formInline.params = {}
      this.formInline.loginName = ''
      this.log(this.formInline)
    },
    handleSizeChange (val) {
      if (val) {
        this.pageSize = val
      } else {
        this.pageSize = this.tableData.length
      }
    },
    filterTable (data) {
      return !this.search || data.ip.toLowerCase().includes(this.search.toLowerCase()) || (data.loginName + '').toLowerCase().includes(this.search.toLowerCase()) || (data.guid + '').toLowerCase().includes(this.search.toLowerCase()) || (data.costTime_all + '').toLowerCase().includes(this.search.toLowerCase())
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    formatterTime (row) {
      return moment(row.beginTime).format('YYYY-MM-DD HH:mm:ss')
    },
    formatterParam (row) {
      var html = ''
      for (var key in row.param) {
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
        if (key == 'accountNo' || key == 'idCard' || key == 'mobile' || key == 'name' || key == 'plateNumber' || key == 'plateType') {
          html += '<span class="param-item" title="' + label + ': ' + row.param[key] + '">' + label + ': ' + row.param[key] + '</span>'
        }
      }
      return html
    }
  },
  mounted () {
    // this.queryCustomers()
    this.services()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .serarch-input
    width auto
    float right
</style>

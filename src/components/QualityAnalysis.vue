<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="选择时间：">
            <el-date-picker
              v-model="time"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions2">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="服务名称：">
            <el-select v-model.trim="serviceName"
              filterable
              @change="changeValue"
              placeholder="请选择">
              <el-option
                v-for="item in serviceArr"
                :key="item.serviceName"
                :label="item.serviceNameZh"
                :value="item.serviceName">
                <span style="float: left">{{ item.serviceNameZh }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户类型：">
            <el-select v-model.trim="loginName"
              filterable
              placeholder="请选择">
              <el-option
                v-for="item in customerArr"
                :key="item.loginName"
                :label="item.customerName"
                :value="item.loginName">
                <span style="float: left">{{ item.customerName }}</span>
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
      </div>
      <div class="card-container">
         <el-table
          :data="tableDataComputed.filter(data => filterTable(data))"
          :show-summary=true
          :summary-method="getSummaries"
          style="width: 100%">
          <el-table-column
            label="服务名"
            sortable
            prop="serviceName">
          </el-table-column>
          <el-table-column
            label="服务名称"
            sortable
            prop="serviceNameZh">
          </el-table-column>
          <el-table-column
            label="RESULT"
            sortable
            prop="result">
          </el-table-column>
          <el-table-column
            label="resultCode"
            sortable
            prop="resultCode">
          </el-table-column>
          <el-table-column
            label="共计使用量"
            sortable
            prop="usedCount">
          </el-table-column>
          <el-table-column
            label="计费使用量"
            sortable
            prop="downChargedCount">
          </el-table-column>
          <el-table-column
            align="right">
            <template slot="header" slot-scope="slot">
              <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字"/>
            </template>
          </el-table-column>
        </el-table>
         <pagination @changePage="changePage" :tatalPage="tatalPage"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import $http from '../common/js/ajax'
import moment from 'moment'
import Pagination from '../base/Pagination'
export default {
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      tatalPage: 0,
      serviceArr: [],
      serviceName: '',
      loginName: '',
      search: '',
      customerArr: [],
      tableData: [],
      flag: false,
      time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
  },
  components: {
    Pagination
  },
  methods: {
    changePage (value) {
      this[value.split('-')[0]] = value.split('-')[1] / 1
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 1 || index === 2 || index === 3) {
          sums[index] = '-'
          return
        }
        const values = this.tableData.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index]
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    services () {
      let url = '/operation/down/queryServices'
      $http(url, {}, 'get').then((res) => {
        this.serviceArr = res.resData
        if (this.serviceArr && this.serviceArr.length) {
          this.serviceName = this.serviceArr[0].serviceName
          this.queryCustomersByService(this.serviceArr[0].serviceName)
        }
      })
    },
    queryCustomersByService (param) {
      let url = '/operation/down/queryCustomersByService/' + param
      $http(url, {}, 'get').then((res) => {
        this.customerArr = res.resData
        if (this.customerArr && this.customerArr.length) {
          this.loginName = this.customerArr[0].loginName
        } else {
          this.loginName = ''
        }
      })
    },
    UsageByResult (opt) {
      let url = '/operator/down/UsageByResult'
      $http(url, opt).then((res) => {
        this.tableData = res.resData
        this.tatalPage = res.resData.length
      })
    },
    changeValue (value) {

      this.queryCustomersByService(value)
    },
    handleSizeChange (val) {
      if (val) {
        this.pageSize = val
      } else {
        this.pageSize = this.tableData.length
      }
    },
    filterTable (data) {
      return !this.search || (data.serviceNameZh + '').toLowerCase().includes(this.search.toLowerCase()) || (data.serviceName + '').toLowerCase().includes(this.search.toLowerCase()) || data.resultCode.toLowerCase().includes(this.search.toLowerCase()) || (data.result + '').toLowerCase().includes(this.search.toLowerCase())
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    onSubmit () {
      const start = moment(this.time[0]).format('YYYY-MM-DD')
      const end = moment(this.time[1]).format('YYYY-MM-DD')
      const loginName = this.loginName
      const serviceName = this.serviceName
      const businessType = ''
      let opt = {
        start,
        end,
        loginName,
        serviceName,
        businessType
      }
      this.UsageByResult(opt)
    },
    formatterMoney (value) {
      return value.downCost = Math.round(value.downCost * 100) / 100
    }
  },
  mounted () {
    this.services()
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
    }
  }
}
</script>
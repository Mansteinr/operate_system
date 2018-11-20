<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="选择时间：">
            <div class="block">
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
            </div>
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
        <div :class="tableDataDay.length ?'':'no-charts'" ref="charts" style="height:400px;"></div>
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
            label="服务名称"
            sortable
            prop="serviceNameZh">
          </el-table-column>
          <el-table-column
            label="共计条数"
            sortable
            prop="usedCount">
          </el-table-column>
          <el-table-column
            label="计费条数"
            sortable
            prop="chargeUsedCount">
          </el-table-column>
          <el-table-column
            label="不计费条数"
            sortable
            prop="noChargeCount">
          </el-table-column>
          <el-table-column
            align="right">
            <template slot="header" slot-scope="slot">
              <el-input
                v-model="search"
                size="mini"
                placeholder="Type to search"/>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 'all']"
          :page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="tatalPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import $http from '../common/js/api'
import { setOtherLineData } from '../common/js/myCharts'
import echarts from 'echarts'
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      tatalPage: 0,
      formInline: {
        user: '',
        region: ''
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now() || time.getTime() < new Date('2018-09-30') 
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      time: [new Date().getTime() - 3600 * 1000 * 24 * 7,new Date()],/**默认时间最近七天 */
      tableDataService: [],
      tableDataDay: [],
      search: ''
    }
  },
  mounted() {
    this.UsageByDate()
  },
  computed: {
    tableDataComputed () {
      if (this.tableDataService && this.tableDataService.length) {
        let start = this.pageSize * (this.currentPage -1)
        let end = Math.min(this.pageSize * (this.currentPage), this.tableDataService.length)
        return this.tableDataService.slice(start, end)
      } else {
        return []
      }
    }
  },
  methods: {
    getSummaries(param) {
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = this.tableDataService.map(item => Number(item[column.property]))
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
      sums.forEach( (v, k) => {
        if (Number(v)) {
          sums[k] = Math.round( v * 100) / 100
        }
      })
      return sums
    },
    onSubmit() {
      this.UsageByDate()
    },
    handleSizeChange(val) {
      if (val) {
        this.pageSize = val
      } else {
        this.pageSize = this.tableDataDay.length
      }
    },
    filterTable (data) {
      return !this.search || (data.chargeUsedCount+'').toLowerCase().includes(this.search.toLowerCase()) || (data.serviceNameZh+'').toLowerCase().includes(this.search.toLowerCase()) || data.serviceName.toLowerCase().includes(this.search.toLowerCase())  || (data.chargeUsedCount+'').toLowerCase().includes(this.search.toLowerCase())
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    UsageByDate () {
      let url = '/operator/up/getOutServiceChargeInfoBySupplier'
      let data = {
          start: moment(this.time[0]).format('YYYY-MM-DD'),
          end: moment(this.time[1]).format('YYYY-MM-DD'),
          companyName: 'chaxunzhongxin'
      }
      var myChart = echarts.init(this.$refs.charts)
      myChart.clear()
      let that = this
      $http(url, data).then((res) => {
        that.tableDataService = []
        var xFiled = {},
            finalArr = {}
        that.tableDataDay = res.resData.dayCompany
        that.tableDataService = res.resData.serviceCompany
        if (that.tableDataDay && that.tableDataDay.length) {
          that.tableDataDay.forEach((v, k) => {
            v.noChargeCount = v.usedCount - v.chargeUsedCount
            v.cost = v.cost.toFixed(2)
            var dayKey = v.dayTime,
            serviceKey = v.serviceName
            if (!finalArr[v.serviceName]) {//是以服务名为主线  查看服务名是否已经存储
              finalArr[v.serviceName] = {
                name: v.serviceNameZh,
                dataArr: []
              }
            }
            if (xFiled[dayKey]) {//如果日期存在  则将对应的服务名及对应的使用量生成key value
              xFiled[dayKey][serviceKey] = v.usedCount
            } else {
              xFiled[dayKey] = {};//如果日期不存在  则生成一个空对象
            }
            xFiled[dayKey][serviceKey] = v.usedCount
          })
        }
        if (that.tableDataService && that.tableDataService.length) {
          that.tableDataService.forEach((v, k) => {
            v.noChargeCount = v.usedCount - v.chargeUsedCount
            that.tableDataService[k].cost = that.tableDataService[k].cost.toFixed(2)
          })
        }


        var nuqinexFild = []
        for (var k in xFiled) {
          nuqinexFild.push(k)
          for (let k1 in finalArr) {
            if (xFiled[k][k1]) {
              finalArr[k1].dataArr.push(xFiled[k][k1])
            } else {
              finalArr[k1].dataArr.push(0)
            }
          }
        }
        console.log(finalArr, 'finalArr')
        var mycolor = ['#86D560', '#AF89D6', '#59ADF3', '#FF999A', '#FFCC67', '#2cb5ab', '#91bf5d', '#f8a89f', '#00FFFF', '#7FFFAA', '#2E8B57', '#F5F5DC', '#BC8F8F', '	#808080'];
        var k = 0,
          lineData = []
          for ( let k3 in finalArr) {
            lineData.push({
                name: finalArr[k3].name,
                type: 'line',
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
                "data": finalArr[k3].dataArr
              })
              k += 1
          }
          myChart.setOption(setOtherLineData(nuqinexFild, lineData))
          window.onresize = function () {
            myChart.resize()
          }
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

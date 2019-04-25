<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container">
        <el-form :inline="true"  ref="querForm" :rules="rules" :model="queryParams" class="query-form">
          <el-form-item label="选择时间：" prop="time">
            <div class="block">
              <el-date-picker
                type="daterange" 
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :name="['start', 'end']"
                :clearable="false"
                v-model="queryParams.time"
                range-separator="至"
                :picker-options="pickerOptions2">
              </el-date-picker>
            </div>
          </el-form-item>
          <supplierSelect 
            :labelTitle="'供应商'" 
            :searchInput=true
            :defaultValue="'companyName'"
            :originArr="companys" 
            >
          </supplierSelect>
          <el-form-item class="query-item">
           <query-button @reset="reset" @submit="onSubmit"></query-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="card-wrapper card-content">
      <div class="card-title">
        查询结果
        <el-button-group>
          <el-button :type="tabFlag?'':'primary'" :class="tabFlag?'':'active'" @click="switchTab(false)">图表</el-button>
          <el-button :type="tabFlag?'primary':''" :class="tabFlag?'active':''"  @click="switchTab(true)">数据</el-button>
        </el-button-group>
      </div>
      <div class="card-container">
        <div v-show="!tabFlag && !tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <div v-show="!tabFlag && tableData.length" class="charts" ref="charts" style="height:400px;width:100%;"></div>
        <Table class="table" 
          :tableData="tableData" 
          :tatalPage="tableData.length" 
          :columns="columns"
          v-show="tabFlag">
        </Table>
      </div>
    </div>
        <div class="card-wrapper card-content">
      <div class="card-title">
        查询结果
      </div>
      <div class="card-container">
        <div v-show="!tableData2.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <Table class="table" 
          :tableData="tableData2" 
          :tatalPage="tableData.length" 
          v-show="tableData2.length"
          :columns="columns1">
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import { $http } from '../../../common/js/ajax'
import { setLineData, renderChart } from '../../../common/js/myCharts'
import { switchMixin, hotKeyTime, company } from '../../../common/js/mixin'
import Table from '../../../base/Table'
import QueryButton from '../../../base/QueryButton'
import supplierSelect from '../../../base/Select'
import { reset } from '../../../utils'
export default {
  mixins: [switchMixin, hotKeyTime, company],
  data () {
    return {
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
        companyName: ''
      },
      columns: [{
        prop: 'company',
        label: '供应商名称'
      },{
        prop: 'dayTime',
        label: '时间'
      },{
        prop: 'serviceNameZh',
        label: '服务名称'
      },{
        prop: 'usedCount',
        label: '调用总量',
        sortable: true
      },{
        prop: 'chargeUsedCount',
        label: '计费调用量',
        sortable: true
      },{
        prop: 'noChargeCount',
        label: '不计费调用量',
        sortable: true
      },{
        prop: 'cost',
        label: '小视入账',
        sortable: true,
        formatter: (row, column) => {
          return row[column.property].toFixed(4)
        }
      }],
      columns1: [{
        prop: 'company',
        label: '供应商名称'
      },{
        prop: 'serviceNameZh',
        label: '服务名称'
      },{
        prop: 'usedCount',
        label: '调用总量',
        sortable: true
      },{
        prop: 'chargeUsedCount',
        label: '计费调用量',
        sortable: true
      },{
        prop: 'noChargeCount',
        label: '不计费调用量',
        sortable: true
      }],
      tableData: [],
      tableData2: [],
    }
  },
  components: {
    Table,
    QueryButton,
    supplierSelect
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
      reset()
    },
    onSubmit () {
      let options = {}
      this.$refs.querForm.$el.querySelectorAll('input').forEach(v => {
        if (v.name) {
          options[v.name] = v.value
        }
      })
      this.getOutServiceChargeInfoBySupplier(options)
    },
    getOutServiceChargeInfoBySupplier (options) {
      $http(this.API.upApi.getOutServiceChargeInfoBySupplier, options).then((res) => {
        if (res.resData.serviceCompany.length) {
          res.resData.serviceCompany.forEach(v => {
            v.noChargeCount = v.usedCount - v.chargeUsedCount
          })
        }
        if (res.resData.dayCompany.length) {
          res.resData.dayCompany.forEach(v => {
            v.noChargeCount = v.usedCount - v.chargeUsedCount
          })
        }
        this.tableData = res.resData.dayCompany
        this.tableData2 = res.resData.serviceCompany
        // 图标
        let xFiled = {},  
            finalArr = {} // 将所有的服务名都存储在该对象中
        if (res.resData.dayCompany.length) {
          res.resData.dayCompany.forEach(v => {
            if (!finalArr[v.serviceName]) { // 检测该服务名是否已经存储在finalArr中 否则存  反之不存
              finalArr[v.serviceName] = {
                name: v.serviceNameZh,
                dataArr: []
              }
            }
            if(xFiled[v.dayTime]) { // 如果日期存在 则将对应的服务名机器对应的使用量生产key value
              xFiled[v.dayTime][v.serviceName] = v.usedCount
            } else {
              xFiled[v.dayTime] = {} // //如果日期不存在  则生成一个空对象 
              xFiled[v.dayTime][v.serviceName] = v.usedCount // 再将对应的服务名及对应的使用量生成key value
            }
          })
          let nuqinexFild = [] // 去重x轴
          for (let k in xFiled) { // 循环xFiled中的每一项 
            nuqinexFild.push(k)
            for (let k1 in finalArr) { // 循环finalArr中的每一项 
              if (xFiled[k][k1]) { 
                finalArr[k1].dataArr.push(xFiled[k][k1])
              } else {
                 finalArr[k1].dataArr.push(0)
              }
            }
          }
          var mycolor = ['#86D560', '#AF89D6', '#59ADF3', '#FF999A', '#FFCC67', '#2cb5ab', '#91bf5d', '#f8a89f', '#00FFFF', '#7FFFAA', '#2E8B57', '#F5F5DC', '#BC8F8F', '	#808080'];
          var k = 0,
            lineData = [] 
          for (let key in finalArr) {
            lineData.push({
              name: finalArr[key].name,
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
              "data": finalArr[key].dataArr
            })
            k += 1
          }
          renderChart(this.$refs.charts, setLineData( '供应商服务分析',nuqinexFild, lineData))
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

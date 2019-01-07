<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container clearfix">
        <el-form :inline="true"  ref="querForm" :model="queryParams" class="query-form">
          <el-form-item label="供应商：">
            <el-select v-model="supId"  filterable @change="changeSupInfo" placeholder="请选择">
              <el-option
                v-for="v in querySupInfoList"
                :key="v.supId"
                :label="v.supName"
                :value="v.supId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务名称：">
            <el-select v-model="supServiceId"  filterable @change="changeSupService" placeholder="请选择">
              <el-option
                v-for="v in querySupServiceList"
                :key="v.supServiceId"
                :label="v.supServiceNameEn"
                :value="v.supServiceId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通道名称：">
            <el-select v-model="queryParams.classNames" filterable multiple collapse-tags placeholder="请选择">
              <el-option
                v-for="v in queryPipeList"
                :key="v.pipeId"
                @click.native="selectPipe(v)"
                :label="v.pipeName"
                :value="v.pipeName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择时间：" prop="time">
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
          <el-form-item class="query-item">
           <query-button @reset="reset" @submit="onSubmit"></query-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="card-wrapper card-content">
      <div class="card-title">
        实时数据
      </div>
      <div class="card-container">
        <div v-show="!realTimeFlag" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <div v-show="realTimeFlag" class="charts" ref="charts" style="height:400px;width:100%;"></div>
        </div>
      </div>
      <div class="card-wrapper card-content">
        <div class="card-title">
          历史数据
          <el-button-group>
            <el-button :type="tabFlag?'':'primary'" :class="tabFlag?'':'active'" @click="switchTab(false)">图表</el-button>
            <el-button :type="tabFlag?'primary':''" :class="tabFlag?'active':''"  @click="switchTab(true)">数据</el-button>
          </el-button-group>
        </div>
        <div class="card-container">
          <div v-show="!tabFlag && !tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
          <div v-show="!tabFlag && tableData.length" class="charts" ref="charts2"  style="height:450px;width:100%; margin-bottom:10px;"></div>
          <Table v-show="tabFlag" ref="table" class="table" :tableData="tableData" :tatalPage="tableData.length">
            <el-table-column
              label="调用时间"
              sortable
              fixed
              width="100"
              prop="dateTime">
            </el-table-column>
            <el-table-column
              label="计费总量"
              sortable
              width="100"
              fixed
              prop="callSum">
            </el-table-column>
            <el-table-column
              v-for="(v,k) in keys"
              :label="keys[k]"
              sortable
              :key="k"
              :prop="k">
            </el-table-column>
          </Table>
        </div>
    </div>
  </div>
</template>

<script>
import { $http } from '../../common/js/ajax' 
import { mockTime } from '../../utils'
import moment from 'moment'
import { setOtherLineData, renderChart, setColumnData } from '../../common/js/myCharts'
import {switchMixin, querySupInfo, querySupService, queryPipe, hotKeyTime } from '../../common/js/mixin'
import QueryButton from '../../base/QueryButton'
import Table from '../../base/Table'
import echarts from 'echarts'
export default {
  mixins: [switchMixin, querySupInfo, querySupService, queryPipe, hotKeyTime ],
  data () {
    return {
      queryParams: {
        classNames: []
      },
      tableData: [],
      supId: '',
      supServiceId: '',
      realTimeFlag: false,
      historyFlag: false,
      keys: {
        item0: '0-0.05s',
        item1: '0.05-0.1s',
        item2: '0.1-0.2s',
        item3: '0.2-0.3s',
        item4: '0.3-0.5s',
        item5: '0.5-0.8s',
        item6: '0.8-1s',
        item7: '1-1.5s',
        item8: '1.5-2s',
        item9: '2-2.5s',
        item10: '2.5-3s',
        item11: '3-4s',
        item12: '4-5s',
        item13: '5-8s',
        item14: '8-10s',
        item15: '10-15s',
        item16: '12-20s',
        item17: '20s以上'
      },
      time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
    }
  },
  components: {
    Table,
    QueryButton
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
    },
    onSubmit () {
      // if (this.tabFlag) {
        this.supplierHistory() 
        this.realTime()
      // } else {
      //   this.realTime()
      // }
    },
    formatter(val) {
      return this.$refs.table.formatter(val)
    },
    substrTime (params) {
      return params.substr(params.length - 4).substr(0, 2) + ':' + params.substr(params.length - 4).substr(2, 4)
    },
    realTime () {
      let options = {
        date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        classNames: this.classNames
      }
      let _this = this
      $http(this.API.qualityanalyApi.supplierRealTime, options).then((res) => {
        // 提取后台传送的key
        let dataArr = Object.keys(res.resData.avgCallTime)
        if (dataArr && dataArr.length > 0) {
          this.realTimeFlag = true

          let data = res.resData.avgCallTime
          let dataCall = res.resData.callNum, 
            xFiled = [], 
            yFiled = [], 
            yCallFiled = [], 
            handleObj = {}
          mockTime().forEach(v => {
            if (data[v]) { /* 检测某个点是否存在 则不动 反之 补一个空  这样写的好处 就是不会改变时间点的顺序 */
              handleObj[v] = data[v]
            } else {
              handleObj[v] = ''
            }
          })
          for (let k in handleObj) {
            xFiled.push(this.substrTime(k)) /* x轴 */
            yFiled.push(handleObj[k]) /* y轴 */
            if (dataCall[k]) {
              yCallFiled.push(dataCall[k])
            } else {
              yCallFiled.push('')
            }
          }

           let lineData = [{
            "name": "实时响应分析(ms)",
            type: 'line',
            smooth: true, //是否平滑曲线显示
            lineStyle: { //线条样式 
              normal: {
                width: 1,
                color: 'rgba(44,181,171, 1)'
              }
            },
            areaStyle: { //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: 'rgba(44,181,171, 0.3)'
              }
            },
            itemStyle: { //折现拐点标志的样式
              normal: {
                color: 'rgba(44,181,171, 1)'
              }
            },
            "data": yFiled
          }, {
            "name": "实时调用量(条)",
            yAxisIndex: 1,
            type: 'line',
            smooth: true, //是否平滑曲线显示
            lineStyle: { //线条样式 
              normal: {
                width: 1,
                color: 'rgb(248,168,159)'
              }
            },
            areaStyle: { //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: 'rgb(248,168,159,0.3)'
              }
            },
            itemStyle: { //折现拐点标志的样式
              normal: {
                color: 'rgb(248,168,159)'
              }
            },
            "data": yCallFiled
          }]
          renderChart(_this.$refs.charts, setOtherLineData(xFiled, lineData))
        }
      })
    },
    supplierHistory () {
      let options = {
        endTime: moment(this.time[1]).format('YYYY-MM-DD') + ' 23:59:59',
        startTime: moment(this.time[0]).format('YYYY-MM-DD') + ' 00:00:00',
        classNames: this.classNames
      }, _this = this
      $http(this.API.qualityanalyApi.supplierHistory, options).then((res) => {
        let data = res.resData, optionsObj = {},series = [], seriesObj = {}, xFiled = [], flagTime = true

        optionsObj.data = []
        this.tableData = data
        if (data && data.length) {
          this.historyFlag = true
          Object.keys(this.keys).forEach((k) => {
            data.forEach((v1, k1) => {
              if(flagTime) {
                xFiled.push(v1.dateTime)
              }
              if (seriesObj[this.keys[k]]) {  /* 检测对象里是否含有该项 有则直接push */
                seriesObj[this.keys[k]].push(v1[k])
              } else {
                seriesObj[this.keys[k]]= [v1[k]] /** 第一次直接赋值 */
              }
            })
            flagTime = false /* 当外层第一次循环结束之后置为false */
          })
          Object.keys(seriesObj).forEach((k2) => {
              series.push({
              "name": k2,
              "type": "bar",
              "barMaxWidth": 15,
              "stack": "通道日调用量",
              "data": seriesObj[k2],
              itemStyle: {
                normal: {
                  "opacity": 0.3
                },
                emphasis: {
                  opacity: 1
                }
              }
            })
          })
          let total = 0, total3s = 0, target = {
            item0: '0-0.05s',
            item1: '0.05-0.1s',
            item2: '0.1-0.2s',
            item3: '0.2-0.3s',
            item4: '0.3-0.5s',
            item5: '0.5-0.8s',
            item6: '0.8-1s',
            item7: '1-1.5s',
            item8: '1.5-2s',
            item9: '2-2.5s',
            item10: '2.5-3s'
          }, percent = 0
          data.forEach(v => {
            total += v.callSum
            for (let m in target) {
              total3s += v[m]
            }
          })
          percent = Math.round((total3s / total) * 10000) / 100
          let subTitle = `${options.startTime}至${options.endTime}共调用${total}条，3s内${total3s}条，占比${percent}%` /* 因为副标题需要时间参数 */
          renderChart(_this.$refs.charts2, setColumnData('历史调用耗时分析', xFiled, series, subTitle))
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  .card-wrapper
    .el-button
      padding 10px
      font-size 14px
      font-family '微软雅黑'
</style>

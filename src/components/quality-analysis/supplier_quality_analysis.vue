<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container clearfix">
        <el-form :inline="true"  ref="querForm" class="query-form">
          <Select 
            :labelTitle="'供应商'" 
            :originArr="querySupInfoList" 
            :needValue="'supId'" 
            :defaultValue="'supName'" 
            :defaultLable="'supShortName'"
            :searchInput="true"
            @changeInputValue="changeSupInfo"> 
          </Select>
          <Select 
            :labelTitle="'服务名称'" 
            :originArr="querySupServiceList" 
            :needValue="'supServiceId'" 
            :defaultValue="'supServiceNameEn'" 
            :defaultLable="'supServiceNameCn'"
            :searchInput="true"
            @changeInputValue="changeSupService"> 
          </Select>
          <Select 
            :labelTitle="'通道名称'" 
            :originArr="queryPipeList" 
            :needValue="'pipeId'" 
            :defaultValue="'pipePath'" 
            :defaultLable="'pipeName'"
            :isMultiple="true"
            :isAll="true"
            :searchInput="true"> 
          </Select>
          <el-form-item class="query-item">
           <query-button @reset="reset" @submit="onSubmit"></query-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="card-wrapper card-content">
      <div class="card-title">
        当天数据
        <div v-show="showRadio" class="radio-box">
          <el-radio-group v-model="radio" @change="changeRadio">
            <el-radio :label="0">实时数据监控</el-radio>
            <el-radio :label="1">历史数据分析</el-radio>
          </el-radio-group>
          <div class="mv-picker" v-show="showPicker">
            <el-date-picker
              v-model="time"
              type="daterange"
              align="right"
              unlink-panels
              :clearable="false"
              @change="changeDateTime"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions2">
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="card-container">
        <div v-show="!realTimeFlag" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <div v-show="realTimeFlag" class="charts" ref="charts" style="height:400px;width:100%;"></div>
        <Table v-show="radio?true:false" :tableData="tableData" :columns="columns" :tatalPage="tableData.length"></Table>
      </div>
    </div>
      <div class="card-wrapper card-content" v-show="showRadio&&!showPicker">
        <div class="card-title">
          历史调用耗时分析
          <div  class="radio-box">
            <div class="mv-picker">
              <el-date-picker
                v-model="time"
                type="datetimerange"
                align="right"
                unlink-panels
                :clearable="false"
                @change="changeHistoryTime"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :name="['start2', 'end2']"
                :picker-options="pickerOptions2">
              </el-date-picker>
            </div>
          </div>
          <el-button-group>
            <el-button :type="tabFlag?'':'primary'" :class="tabFlag?'':'active'" @click="switchTab(false)">图表</el-button>
            <el-button :type="tabFlag?'primary':''" :class="tabFlag?'active':''"  @click="switchTab(true)">数据</el-button>
          </el-button-group>
        </div>
        <div class="card-container">
          <div v-show="!tabFlag && !tableData2.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
          <div v-show="!tabFlag && tableData2.length" class="charts" ref="charts2"  style="height:450px;width:100%; margin-bottom:10px;"></div>
          <Table v-show="tabFlag" :tableData="tableData2" :columns="columns1" :tatalPage="tableData2.length"></Table>
        </div>
    </div>
  </div>
</template>

<script>
/**
 * 后台接口对接 李志明
 * 
 * 供应商名称、供应商服务名称、通道名称后台接口均是研发中心提供，后台对接 张树形
 * 
 * 实时数据中 date是前端发送请求时的时间 精确到时分秒
 * 
 * 历史数据中参数 startTime和endTime 前端要获取开始结束时的日期 精确到日 然后在 开始时间 手动加上 00:00:00 结束时间手动加上 '23:59:59'
 * 
 * 当请求之后有结果时，会显示实时数据和历史数据单选按钮
 * 
 * 后台会传过来的数据是最近24h之内的数据 但是若某一个时刻没有数据 则后台不传 这时需要前端自己补上这个时间点
 * 
 * 调用实时数据时  要将请求到数据 按相应时间段 将数据分类 并通过柱状图和table分别展示 其中柱状图要展示全部的  table只需要统计到0-2.5s即可
 */
import moment from 'moment' 
import Table from '../../base/Table'
import { mockTime } from '../../utils'
import Select from '../../base/Select' // 下拉框
import { $http } from '../../common/js/ajax'
import QueryButton from '../../base/QueryButton'
import { setOtherLineData, renderChart, setColumnData } from '../../common/js/myCharts'
import {switchMixin, querySupInfo, querySupService, queryPipe, hotKeyTime } from '../../common/js/mixin'
export default {
  mixins: [switchMixin, querySupInfo, querySupService, queryPipe, hotKeyTime ],
  data () {
    return {
      radio: 0,
      columns:[],
      columns1: [],
      tableData: [],
      tableData2: [],
      showRadio: false,
      showPicker: false,
      responseData: null,
      realTimeFlag: false,
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
    Select,
    QueryButton
  },
  methods: {
    changeHistoryTime () {
      this.detailSupplierData()
    },
    changeDateTime() {
      this.supplierHistory()
    },
    changeRadio (val) { // 切换单选框时
      if (val) {
        this.supplierHistory() // 调用历史数据
      } else {
        this.realTime() // 调用实时数据
      }
      this.showPicker = val?true:false
    },
    reset () {
      this.$refs.querForm.resetFields()
    },
    onSubmit () {
      this.radio = 0
      this.realTime()
    },
    substrTime (params) {
      return params.substr(params.length - 4).substr(0, 2) + ':' + params.substr(params.length - 4).substr(2, 4)
    },
    realTime () {
      // 组装参数
      let classNames = [], pipePath = document.querySelector('[name="pipePath"]').value.split(',')
      if (pipePath[0] === '') { // 全部
        this.queryPipeList.forEach(v => {
          classNames.push(v.pipePath)
        })
      } else {
        classNames = [...classNames, ...pipePath]
      }
      let options = {
        date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        classNames: classNames
      }
      let _this = this
      $http(this.API.qualityanalyApi.supplierRealTime, options).then((res) => {
        // 提取后台传送的key
        let dataArr = Object.keys(res.resData.avgCallTime)
        if (dataArr && dataArr.length > 0) {
          this.realTimeFlag = true
          this.showRadio = true
          this.responseData = []
          this.responseData = res.resData
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
          
          this.detailSupplierData()
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
      // 组装参数
      let classNames = [], pipePath = document.querySelector('[name="pipePath"]').value.split(',')
      if (pipePath[0] === '') { // 全部
        this.queryPipeList.forEach(v => {
          classNames.push(v.pipePath)
        })
      } else {
        classNames = [...classNames, ...pipePath]
      }
      let options = {
        endTime: moment(this.time[1]).format('YYYY-MM-DD') + ' 23:59:59',
        startTime: moment(this.time[0]).format('YYYY-MM-DD') + ' 00:00:00',
        classNames: classNames
      }, _this = this
      $http(this.API.qualityanalyApi.supplierHistory, options).then((res) => {
        let data = res.resData, optionsObj = {},series = [], seriesObj = {}, xFiled = [], flagTime = true
        
        optionsObj.data = []
        this.tableData = data
        if (data && data.length) {
          Object.keys(this.keys).forEach((k) => {
            data.forEach(v1 => {
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
          this.columns = []
          this.columns = [{
            prop: 'dateTime',
            minWidth: '105px',
            fixed: true,
            sortable: true,
            label: '调用时间'
          }, {
            prop: 'callSum',
            sortable: true,
            fixed: true,
            minWidth: '105px',
            label: '调用总量'
          }]

          for (let k in this.keys) {
            this.columns.push({
              prop: k,
              minWidth: '105px',
              sortable: true,
              label: this.keys[k]
            })
          }
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

          renderChart(_this.$refs.charts, setColumnData('历史调用耗时分析', xFiled, series, subTitle))
        }
      })
    },
    detailSupplierData () {
      let originData = this.responseData
      // 将2019-02-02 14:12:25转为20190202141225形式 去除秒 并转为Number类型
      let startDayTime = document.querySelector('[name="start2"]').value.replace(/-/g, '').replace(/:/g,'').replace(/ /g, '').substring(0, 12) / 1 
      let endDayTime = document.querySelector('[name="end2"]').value.replace(/-/g, '').replace(/:/g,'').replace(/ /g, '').substring(0, 12) / 1
      let data = {}, dataCall = {}

      for(let k1 in originData.avgCallTime) { // 筛选数据 并重构数据结构
        if ((k1/1) >= startDayTime && (k1/1) <= endDayTime) {
          data[k1] =  originData.avgCallTime[k1]
          dataCall[k1] = originData.callNum[k1]
        }
      }

      let xBarFiled = [], yOptionsCall = {}
      this.columns1  = []

      this.columns1 = [{
        prop: 'callTime',
        label: '耗时',
        sortable: true
      }, {
        prop: 'callNum',
        label: '调用总量',
        sortable: true
      }]
      // 组装yOptionsCall 方便后面数据出理
      for (let k1 in data) {
        switch(true) {
          case data[k1] <= 50:
            if(yOptionsCall.item0) {
              yOptionsCall.item0 += dataCall[k1]
            } else {
              yOptionsCall.item0 = dataCall[k1] || 0
            }
            break;
          case data[k1] <= 100:
            if(yOptionsCall.item1) {
              yOptionsCall.item1 += dataCall[k1]
            } else {
              yOptionsCall.item1 = dataCall[k1] || 0
            }
            break;
          case data[k1] <= 200:
            if(yOptionsCall.item2) {
              yOptionsCall.item2 += dataCall[k1]
            } else {
              yOptionsCall.item2 = dataCall[k1] || 0
            }
            break;
          case data[k1] <= 300:
            if(yOptionsCall.item3) {
              yOptionsCall.item3 += dataCall[k1]
            } else {
              yOptionsCall.item3 = dataCall[k1] || 0
            }
            break;
          case data[k1] <= 500:
            if(yOptionsCall.item4) {
              yOptionsCall.item4 += dataCall[k1]
            } else {
              yOptionsCall.item4 = dataCall[k1] || 0
            }
            break;
          case data[k1] <= 800:
            if(yOptionsCall.item5) {
              yOptionsCall.item5 += dataCall[k1]
            } else {
              yOptionsCall.item5 = dataCall[k1] || 0
            }
            break;
          case data[k1] <= 1000:
            if(yOptionsCall.item6) {
              yOptionsCall.item6 += dataCall[k1]
            } else {
              yOptionsCall.item6 = dataCall[k1] || 0
            }
            break;
          case data[k1] <= 1500:
            if(yOptionsCall.item7) {
              yOptionsCall.item7 += dataCall[k1]
            } else {
              yOptionsCall.item7 = dataCall[k1] || 0
            }
            break;
          case data[k1] <= 2000:
            if(yOptionsCall.item8) {
              yOptionsCall.item8 += dataCall[k1]
            } else {
              yOptionsCall.item8 = dataCall[k1] || 0
            }
            break;
          case data[k1] <= 2500:
            if(yOptionsCall.item9) {
              yOptionsCall.item9 += dataCall[k1]
            } else {
              yOptionsCall.item9 = dataCall[k1] || 0
            }
            break;
          case data[k1] <= 3000:
            if(yOptionsCall.item10) {
              yOptionsCall.item10 += dataCall[k1]
            } else {
              yOptionsCall.item10 = dataCall[k1] || 0
            }
            break;
          case data[k1] <= 4000:
            if(yOptionsCall.item11) {
              yOptionsCall.item11 += dataCall[k1]
            } else {
              yOptionsCall.item11 = dataCall[k1] || 0
            }
            break;
          case data[k1] <= 5000:
            if(yOptionsCall.item12) {
              yOptionsCall.item12 += dataCall[k1]
            } else {
              yOptionsCall.item12 = dataCall[k1] || 0
            }
            break;
          case data[k1] <= 8000:
            if(yOptionsCall.item13) {
              yOptionsCall.item13 += dataCall[k1]
            } else {
              yOptionsCall.item13 = dataCall[k1] || 0
            }
            break;
          case data[k1] <= 10000:
            if(yOptionsCall.item14) {
              yOptionsCall.item14 += dataCall[k1]
            } else {
              yOptionsCall.item14 = dataCall[k1] || 0
            }
            break;
          case data[k1] <= 15000:
            if(yOptionsCall.item15) {
              yOptionsCall.item15 += dataCall[k1]
            } else {
              yOptionsCall.item15 = dataCall[k1] || 0
            }
            break;
          case data[k1] <= 20000:
            if(yOptionsCall.item16) {
              yOptionsCall.item16 += dataCall[k1]
            } else {
              yOptionsCall.item16 = dataCall[k1] || 0
            }
            break;
          case data[k1] > 20000:
            if(yOptionsCall.item17) {
              yOptionsCall.item17 += dataCall[k1]
            } else {
              yOptionsCall.item17 = dataCall[k1] || 0
            }
            break;
          default :
            break;
        }
      }
      let yOptionsCallArr = []
      this.tableData2 = []

      for (let k in this.keys) {
        xBarFiled.push(this.keys[k]) // 柱状图的x轴
        if (!yOptionsCall[k]) {
          yOptionsCall[k] = 0
        }

        yOptionsCallArr.push(yOptionsCall[k])
        this.tableData2.push({
          callTime: this.keys[k],
          callNum: yOptionsCall[k]
        })

      }
       var series1 = [{
        name: '调用总量',
        type: 'bar',
        data: yOptionsCallArr
      }]
      renderChart(this.$refs.charts2, setColumnData('', xBarFiled, series1))
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
  .radio-box,.mv-picker
    position absolute
    top 0px
    left 95px
  .radio-box
    left 95px
  .mv-picker
    left 280px
</style>

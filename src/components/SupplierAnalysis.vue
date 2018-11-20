<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="供应商名称：">
            <el-select v-model.trim="formInline.supId"
              filterable
              v-if="supInfoList.length"
              placeholder="请选择">
              <el-option
                v-for="item in supInfoList"
                :key="item.supId"
                :label="item.supName"
                :value="item.supId">
                <span style="float: left">{{ item.supName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="供应商服务名称：">
            <el-select v-model.trim="formInline.supServiceId"
              filterable
              v-if="supServiceList.length"
              @change="changeValue"
              placeholder="请选择">
              <el-option
                v-for="item in supServiceList"
                :key="item.supServiceId"
                :label="item.supServiceNameCn"
                :value="item.supServiceId">
                <span style="float: left">{{ item.supServiceNameCn }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="specail-item" v-if="pipeList && pipeList.length" label="通道名称：">
            <el-select v-model.trim="formInline.classNames"
              multiple
              filterable
              collapse-tags
              placeholder="请选择">
              <el-option
                v-for="item in pipeList"
                :key="item.pipeId"
                :label="item.pipeName"
                :value="item.pipeId">
                <span style="float: left">{{ item.pipeName }}</span>
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
        <div :class="flag ?'':'no-charts'" ref="charts" style="height:400px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import $http from '../common/js/api'
  import moment from 'moment'
  import { setOtherLineData } from '../common/js/myCharts'
  import echarts from 'echarts'
  export default {
    data() {
      return {
        formInline: {
          classNames: [],
          supId: '',
          supServiceId: ''
        },
        supInfoList: [],
        supServiceList: [],
        pipeList: [],
        flag: false,
        minutesArr: [],
        timeId: null,
        m: 0
      }
    },
    methods: {
      services () {
        let url = '/operation/upper/querySupInfoList'
        $http(url, {}, 'get').then((res) => {
          this.supInfoList = res.resData.supInfos
          if (this.supInfoList.length) {
            this.formInline.supId = this.supInfoList[0].supId
          }
        })
      },
      querySupServiceList () {
        let url = '/operation/upper/querySupServiceList'
         $http(url, {}, 'get').then((res) => {
          this.supServiceList = res.resData.supServiceInfos
          if (this.supServiceList.length) {
            this.formInline.supServiceId = this.supServiceList[0].supServiceId
            // this.queryPipeList(this.formInline.supServiceId)
          }
        })
      },
      // queryPipeList (param) { // tedstetewtewt
      //   let url = '/operation/upper/queryPipeList/' + param
      //   $http(url, {}, 'get').then((res) => {
      //     this.pipeList = res.resData.simplePipeInfos
      //     if (this.pipeList.length) {
      //       this.formInline.classNames[0] = this.pipeList[0].pipeName
      //     }
      //   })
      // },
      realTime () {
        let startTime = + new Date('2018-11-20 17:25:36') - 1 * 24 * 3600 * 1000
        let arr = []
        for (let i = 0; i <= 1440; i++) {
          arr.push(moment(startTime + (i * 60 * 1000)).format('YYYYMMDDHHmm'))
        }
        this.minutesArr = arr
        let url = '/qualityanalyze/supplier/realTime'
        this.formInline.date = moment(+new Date()).format('YYYY-MM-DD HH:mm:ss')
        $http(url, this.formInline).then((res) => {
          var myChart = echarts.init(this.$refs.charts)
          myChart.clear()
          let dataArr = Object.keys(res.resData.avgCallTime) /* 因为返回是个对象 所以提取对象的key并组成一个数组 这是平均相应时长*/
          if (dataArr && dataArr.length > 0) {
            this.flag = true
            let data = res.resData.avgCallTime
            let dataCall = res.resData.callNum
            let xFiled = [] /* x轴数据 */
            let yFiled = [] /* y平均响应时间y轴数据 */
            let yCallFiled = [] /* 平均调用量y轴数据 */
            let handleObj = {}
            this.minutesArr.forEach(v => {
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
            myChart.setOption(setOtherLineData(xFiled, lineData))
            window.onresize = function () {
              myChart.resize()
            }
          } else {
            this.flag = false
          }
        })
      },
      onSubmit () {
        this.setIntervalFun()
      },
      substrTime (params) {
        return params.substr(params.length - 4).substr(0, 2) + ':' + params.substr(params.length - 4).substr(2, 4)
      },
      setIntervalFun () {
        if (this.timeId) {
          clearInterval(this.timeId); /* 每次调用定时器 先清除定时器 */
        }
        this.realTime() /* 第一次调用 */
        this.timeId = setInterval(this.playerInterVal, 1000 * 60);
      },
      playerInterVal () {
        this.m++
        if (this.m > 20) { /* 执行20次以后清除定时器 */
          this.m= 0
          this.setIntervalFun() /* 重启定时器 */
        } else {
          this.realTime()
        }
      },
      changeValue (value) {
        // this.queryPipeList(value)
      }
    },
    mounted() {
      this.services()
      this.querySupServiceList()
    }
  }
</script>
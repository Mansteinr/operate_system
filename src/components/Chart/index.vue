<template>
  <div class="charts" ref="charts" style="height:400px;width:100%;"></div>  
</template>

<style scoped lang="stylus" rel="stylesheet/stylus">


</style>

<script>
  import { setLineData, setColumnData, setPieData, renderChart, setRadiiData } from '@/common/js/myCharts'
  let tempChart = null
  export default {
    props: {
      options: {
        type: Object,
        default: () => {}
      }
    },
    mounted() {
      this.$nextTick(() => {
        if(!this.options) return
        if(this.options.type === 'column') {
          tempChart = renderChart(this.$refs.charts, setColumnData(this.options))
        } else if(this.options.type === 'pie') {
          tempChart = renderChart(this.$refs.charts, setPieData(this.options))
        } else if(this.options.type === 'HollowCircle') {
          tempChart = renderChart(this.$refs.charts, setRadiiData(this.options))
        } else {
          tempChart = renderChart(this.$refs.charts, setLineData(this.options))
        }
        if(this.options.callback) {
          tempChart.on('click', params => {
            this.options.callback(params)
          })
        }
      })
    },
    watch: {
      options () {
        this.$nextTick(() => {
          if(!this.options) return
          if(this.options.type === 'column') {
            tempChart = renderChart(this.$refs.charts, setColumnData(this.options))
          } else if(this.options.type === 'pie') {
            tempChart = renderChart(this.$refs.charts, setPieData(this.options))
          } else if(this.options.type === 'HollowCircle') {
          tempChart = renderChart(this.$refs.charts, setRadiiData(this.options))
          } else {
            tempChart = renderChart(this.$refs.charts, setLineData(this.options))
          }
          if(this.options.callback) {
            callback()
          }
        })   
      }
    }
  }
  // 屏幕改变时 重新渲染 echats 适配
  window.onresize = function () {
    if(tempChart) {
      tempChart.resize()
    }
  }
</script>
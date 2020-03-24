<template>
  <div class="charts" ref="charts" style="height:400px;width:100%;"></div>  
</template>

<style scoped lang="stylus" rel="stylesheet/stylus">


</style>

<script>
  import { setLineData, renderChart } from '@/common/js/myCharts'
  let tempChart = null
  console.log(window)
  export default {
    props: {
      options: Object,
      default: () => {}
    },
    mounted() {
      this.$nextTick(() => {
        console.log(this.options, 'this.option')
        if(!this.options) return
        tempChart = renderChart(this.$refs.charts, setLineData(this.options))
      })
    },
    watch: {
      options () {
        this.$nextTick(() => {
          if(!this.options) return
          tempChart = renderChart(this.$refs.charts, setLineData(this.options))
        })   
      }
    }
  }
  // 屏幕改变时 重新渲染 echats 适配
  window.onresize = function () {
    console.log('909090')
    tempChart.resize()
  }
</script>
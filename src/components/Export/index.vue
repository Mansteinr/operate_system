<template>
    <el-row :gutter="5" v-show="showSearch">
      <el-col :span="1" v-show="showPlusIcon"><el-button @click="addFun" type="primary" icon="el-icon-plus" size="mini"></el-button></el-col>
      <el-col :span="4" :offset="showPlusIcon?17:18"><el-input v-model.trim="search" size="mini" placeholder="请输入关键字"/></el-col>
      <el-col :span="2" class='export-wrapper'>
        <el-dropdown>
          <el-button size="mini" type="primary" icon="el-icon-share"></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="exportExcel('xlsx',$event)">xlsx</el-dropdown-item>
            <el-dropdown-item @click.native="exportExcel('xml',$event)">xml</el-dropdown-item>
            <el-dropdown-item @click.native="exportExcel('csv',$event)">csv</el-dropdown-item>
            <el-dropdown-item @click.native="exportExcel('txt',$event)">txt</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
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
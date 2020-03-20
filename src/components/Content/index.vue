<!-- 显示部分 -->
<template>
  <div class="card-wrapper card-content">
    <div class="card-title">
      {{$t('m.basics.resultCardTitle')}}
    </div>
    <div class="card-container">
      <el-tabs type="card" class="mv-tabs">
        <el-tab-pane
          :label="$t('m.basics.switchTabTable')"
        >
          <Table ref="table" 
            class="table table1" 
            :tableData="tableData" 
            :tatalPage="tableData.length" 
            :columns="columns">
          </Table>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('m.basics.switchTabChart')"
        >
          <div class="charts" ref="charts1" style="height:400px;width:100%;"></div>  
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Table from '@/components/Table'
export default {
  data() {
    return {
    }
  }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus">

</style>
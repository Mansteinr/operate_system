<!-- 显示部分 -->
<template>
  <div class="card-wrapper card-content">
    <div class="card-title">
      {{$t('m.basics.resultCardTitle')}}
    </div>
    <div class="card-container">
      <NoData v-show="!data.length"/>
      <el-tabs v-show="data.length" type="card" class="mv-tabs">
        <el-tab-pane :label="$t('m.basics.switchTabChart')">
          <slot name="Chart"></slot>
        </el-tab-pane>
        <el-tab-pane :label="$t('m.basics.switchTabTable')" >
          <slot name="Table"></slot>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Table from '@/components/Table'
import NoData from '@/components/NoData'
export default {
  data() {
    return {
    }
  },
  components: {
    NoData
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    tatalPage: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
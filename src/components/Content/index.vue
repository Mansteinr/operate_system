<!-- 显示部分 -->
<template>
  <div class="card-wrapper card-content">
    <div class="card-title">
      {{title || $t('m.basics.resultCardTitle')}}
    </div>
    <div class="card-container">
      <NoData v-if="!data.length"/>
      <el-tabs v-else-if="data.length && !isOnlyTable && !isOnlyChart" type="card" class="mv-tabs">
        <el-tab-pane :label="$t('m.basics.switchTabChart')">
          <slot name="Chart"></slot>
        </el-tab-pane>
        <el-tab-pane :label="$t('m.basics.switchTabTable')" >
          <slot name="Table"></slot>
        </el-tab-pane>
      </el-tabs>
      <slot v-else-if="data.length && isOnlyTable" name="onlyTable"></slot>
      <slot v-else-if="data.length && isOnlyChart" name="isOnlyChart"></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import NoData from '@/components/NoData'
export default {
  components: {
    NoData
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    isOnlyTable: {
      type: Boolean,
      default: false
    },
    isOnlyChart: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
<template>
  <Content :isOnlyTable="true">
    <Table 
      slot="onlyTable"
      ref="table" 
        :tableData="UsageByDateList" 
        :tatalPage="UsageByDateList.length" 
        :columns="columns"/>
  </Content>
</template>

<script>
/**
 * 后台对接马超众
 * 
 * 1、若果用elenment中的input框 则必须使用数据双向绑定，不合适 故用该方法展示参数
 * 
 * 2、若没有参数 则也要穿个空param:{}
 * 
 * 3、不支持跨越查询, 故开始时间默认为当月1号零时零点零秒  结束时间为当前时间
 *
 */
import Table from '@/base/Table'
import { $http } from '@/common/js/ajax'
import Content from '@/components/Content'
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
  data () {
    return {
      tableData: []
    }
  },
  components: {
    Table,
    Content
  },
  mounted() {
    this.getLightSignIncustomer()
  },
  methods: {
    ...mapActions({
      getLightSignInCustomersAjax: 'lightSignIn/getLightSignInCustomersAjax'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
</style>

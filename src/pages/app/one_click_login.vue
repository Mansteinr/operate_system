<template>
  <div class="template-wrapper">
    <Content
      :title="$t('m.lightSignIn.resultCardTitle')"
      :isOnlyTable="true" 
      :data="lightSignInCustomerList">
      <Table slot="onlyTable" ref="table"
        :showSearch="false" 
        :showSummary="false" 
        :tableData="lightSignInCustomerList" 
        :tatalPage="lightSignInCustomerList.length" 
        :columns="columns">
          <el-table-column
            slot="tableTail"
            :label="this.$t('m.basics.operateTitle')">
            <template slot-scope="scope">
              <router-link class="link" :to="{path:'/lightSignInDetail', query: {id: scope.row}}">{{$t('m.basics.detailTitle')}}</router-link>
            </template>
          </el-table-column>
        </Table>
    </Content>
  </div>
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

import Table from '@/components/Table'
import Content from '@/components/Content'
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
  data () {
    return {
      columns: [{
        label: this.$t('m.basics.dayTime'),
        formatter: (row, column) => {
          return row
        }
      }]
    }
  },
  components: {
    Table,
    Content
  },
  mounted() {
    this.getLightSignInCustomersAjax()
  },
  methods: {
    add () { //  新增客户
      this.$router.push({path:'/lightSignInAdd'})
    },
    toDetail (value) { // 查看客户详情
      this.$router.push({
        path:'/lightSignInDetail',
        query: {id: value}
      }) 
    },
    ...mapActions({
      getLightSignInCustomersAjax: 'lightSignIn/getLightSignInCustomersAjax'
    })
  },
  computed: {
    ...mapGetters({
      lightSignInCustomerList: 'lightSignIn/lightSignInCustomerList'
   }),
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
</style>

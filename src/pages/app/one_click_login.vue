<template>
  <div  class="template-wrapper">
    <Content  :data="lightSignInCustomerList">
      <Table slot="onlyTable" ref="table"
         :showSearch="false" 
          :showSummary="false" 
        :tableData="lightSignInCustomerList" 
        :tatalPage="lightSignInCustomerList.length" 
        :columns="columns"/>
    </Content>
    <!-- <div class="card-wrapper card-content">
      <div class="card-title">
        新增
         <el-button type="primary" class="fr" @click="add" icon="el-icon-edit">新增</el-button>
      </div>
      <div class="card-container">
        <div v-show="!tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <Table 
          ref="table"
          :showSearch="false" 
          :showSummary="false" 
          :tableData="lightSignInCustomerList" 
          v-show="lightSignInCustomerList.length">
          <el-table-column
            label="客户名称">
            <template slot-scope="scope">
              <div>{{scope.row}}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <div @click="toDetail(scope.row)" class="link">详情</div>
            </template>
          </el-table-column>
        </Table>
      </div>
    </div> -->
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
import { $http } from '../../common/js/ajax'
import Content from '@/components/Content'
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
  data () {
    return {
      columns: [{
        prop: this.$t('m.basics.customerName'),
        label: this.$t('m.basics.dayTime')
      }, {
        prop: 'dayTime',
        sortable: true,
        label: this.$t('m.basics.dayTime')
      }]
    }
  },
  components: {
    Table
  },
  mounted() {
    this.getLightSignInCustomersAjax()
  },
  methods: {
    add () { //  新增客户
      this.$router.push({path:'/lightSignInAdd'})
    },
    toDetail (value) { // 查看客户详情
      // this.setMenu(value)
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

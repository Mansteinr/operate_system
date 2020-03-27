<template>
  <div class="template-wrapper">
    <Content
      :title="$t('m.lightSignIn.resultCardTitle')"
      :isOnlyTable="true" 
      :data="lightSignInAppInfoList">
      <Table slot="onlyTable" ref="table"
        :showSearch="false" 
        :showSummary="false" 
        :tableData="lightSignInAppInfoList" 
        :tatalPage="lightSignInAppInfoList.length" 
        :columns="columns">
        <el-table-column
            slot="tableTail"
            :label="this.$t('m.basics.operateTitle')">
            <template slot-scope="scope">
              <div class="operate-wrapper">
                <span class="link" @click="look(scope.row)">{{$t('m.basics.lookTitle')}}</span>
                <span class="link" @click="deleteItem(scope.row)">{{$t('m.basics.deleteTitle')}}</span>
                <span class="link" @click="edit(scope.row)">{{$t('m.basics.editTitle')}}</span>
              </div>
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
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  data () {
    return {
      columns: [{
        label: this.$t('m.lightSignIn.tableAppName'),
        prop: 'appName'
      }, {
        label: this.$t('m.lightSignIn.tableAppBusiness'),
        prop: 'appBusiness',
        width: '120px'
      }, {
        label: this.$t('m.lightSignIn.tableAppType'),
        prop: 'appType',
        width: '80px'
      }, {
        type: 'image',
        label: this.$t('m.lightSignIn.tableIcon'),
        prop: 'icon',
        width: '80px',
        urlType: 'base64'
      }, {
        label: this.$t('m.lightSignIn.tablePlatform'),
        prop: 'platform',
        width: '80px'
      }, {
        label: this.$t('m.lightSignIn.tableAppState'),
        prop: 'appState',
        width: '80px',
        formatter: row => {
          return row.appState === '0' ? '启用' : '禁止'
        }
      }, {
        label: this.$t('m.lightSignIn.tableAndroidLink'),
        prop: 'androidLink',
        formatter: row => {
          return row.androidLink || row.iosLink
        }
      }, {
        label: this.$t('m.lightSignIn.tableCreateTime'),
        prop: 'createTime',
        width: '160px'
      }]
    }
  },
  components: {
    Table,
    Content
  },
  mounted() {
    this.setActiveTabs()
  },
  methods: {
    // 查看
    look (value) {
      console.log('查看', value)
    },
    // 删除
    deleteItem (value) {
      console.log('删除', value)
    },
    // 编辑
    edit (value) {
      console.log('编辑', value)
    },
    setActiveTabs() {
      let unqiuFlag = false, params = this.$route // 防止重复添加
      if(!params.query.id) return
      this.getLightSignInappInfoAjax(params.query.id)
      unqiuFlag = this.editableTabs.some(v => v.name === (params.name + '-' + params.query.id))
      if(!unqiuFlag) {
        this.setHeaderTab([{
          title: `${params.query.id}详情`,
          name: `${params.name}-${params.query.id}`,
          url: `${params.name}-${params.query.id}`
        }])
    }
    this.setActiveHeaderTab(`${params.name}-${params.query.id}`)
    },
    ...mapActions({
      getLightSignInappInfoAjax: 'lightSignIn/getLightSignInappInfoAjax'
    }),
    ...mapMutations({ // 获取SET_ACTIVE_MEUN的方法
      setHeaderTab: 'basics/SET_HEADER_TABS',
      setActiveHeaderTab: 'basics/SET_ACTIVE_HEADER_TAB'
    })
  },
  computed: {
    ...mapGetters({
      editableTabs: 'basics/editableTabs',
      lightSignInAppInfoList: 'lightSignIn/lightSignInAppInfoList'
   })
  },
  watch: {
    '$route' () {
      this.setActiveTabs()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
</style>

<template>
  <el-container id="app">
    <!-- 头部 -->
    <el-header>
      <div class="header-logo"></div>
      <div class="header-menu-warp">
        <el-select v-model="value4" placeholder="请选择">
          <el-option @click.native="selectLang('zh-CN')" value="中文"></el-option>
          <el-option @click.native="selectLang('en-US')" value="English"></el-option>
        </el-select>
        <div class="avatar">
          <img src="../common/images/default.jpg">
        </div>
        <el-dropdown class="el-select">
          <span class="el-dropdown-link">
            {{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="choseProject">项目选择</el-dropdown-item>
            <el-dropdown-item @click.native="loginOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container class="m-body">
      <el-col class="aside" :span="3">
        <el-menu class="el-menu-vertical-demo" :default-active="menuActive">
          <template v-for="(v, k) in menu">
            <el-menu-item :index="v.id+''" v-if="v.childResource.length==0" @click="selectItem(v)">
              <i :class="v.icon"></i>
              {{v.name}}
            </el-menu-item>
            <el-submenu v-else :index="v.id+''">
              <template slot="title">
                <i :class="v.icon"></i>
                {{v.name}}
                <!-- <span>导航一</span> -->
              </template>
              <template v-for="(v1, k1) in v.childResource">
                <el-menu-item v-if="v1.childResource.length==0"  :index="v.id+'-'+v1.id" @click="selectItem(v1)">
                  <i :class="v1.icon"></i>
                  <span slot="title">{{v1.name}}</span>
                </el-menu-item>
                <el-submenu :index="v.id+'-'+v1.id" v-else>
                  <template slot="title" :class="v1.icon">{{v1.name}}</template>
                  <el-menu-item v-for="(v2, k2) in v1.childResource" :index="v.id+'-'+v1.id+'-'+v2.id" @click="selectItem(v2)"><span slot="title">{{v2.name}}</span></el-menu-item>
                </el-submenu>
              </template>
            </el-submenu>
          </template>
        </el-menu>
      </el-col>
      <el-main :span="20">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import $http from '../common/js/ajax'
export default {
  data () {
    return {
      value4: '中文',
      userName: 'zhoumingye',
      menu: [],
      menuActive: ''
    }
  },
  methods: {
    selectItem (value) {
      let paramArr = value.resourceUrl.split('/')
      this.$router.push({name: paramArr[paramArr.length - 1].split('.')[0]})
      this.menuActive = value.id+'' // 需要传入字符串 传入number会报错
    },
    selectLang (value) {
      console.log(value)
    },
    choseProject () {
      console.log('choseProject')
    },
    loginOut () {
      localStorage.removeItem('mtk')
      this.$router.push({ name: '/Login' })
    },
    querySubSystemMenuList () { // 获取菜单
      // $http(this.API.upApi.querySubSystemMenuList, { systemName: '服务平台' }).then((res) => {
        // this.menu =  res.resData
        this.menu =  [{"accCtrlStr":"plate:operator:general","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"icon-slaadfltic","id":325,"jumpUrl":"","levelNum":2,"name":"总量统计","parentId":null,"resourceOrder":0,"resourceType":null,"resourceUrl":"views/query_index.html","showFlag":"","systemId":101,"updateTime":null},{"accCtrlStr":"","checked":null,"childResource":[{"accCtrlStr":"","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"icon-kefu","id":329,"jumpUrl":"","levelNum":2,"name":"客户用量查询","parentId":327,"resourceOrder":0,"resourceType":null,"resourceUrl":"views/query_usage.html","showFlag":"","systemId":null,"updateTime":null},{"accCtrlStr":"plate:operator:up","checked":null,"childResource":[{"accCtrlStr":"","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"","id":381,"jumpUrl":"","levelNum":2,"name":"按供应商分析","parentId":331,"resourceOrder":0,"resourceType":null,"resourceUrl":"views/query_upstream_supplier.html","showFlag":"","systemId":null,"updateTime":null},{"accCtrlStr":"plate:operator:up:customer","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"","id":333,"jumpUrl":"","levelNum":2,"name":"按客户分析","parentId":331,"resourceOrder":1,"resourceType":null,"resourceUrl":"views/query_upstream_customer.html","showFlag":"","systemId":null,"updateTime":null},{"accCtrlStr":"plate:operator:up:service","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"","id":335,"jumpUrl":"","levelNum":2,"name":"按服务分析","parentId":331,"resourceOrder":2,"resourceType":null,"resourceUrl":"views/query_upstream_service.html","showFlag":"","systemId":null,"updateTime":null},{"accCtrlStr":"plate:operator:up:date","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"","id":337,"jumpUrl":"","levelNum":2,"name":"按日期服务分析","parentId":331,"resourceOrder":3,"resourceType":null,"resourceUrl":"views/query_upstream_serviceByData.html","showFlag":"","systemId":null,"updateTime":null}],"createTime":null,"description":"","enName":"","icon":"icon-shangsheng","id":331,"jumpUrl":"","levelNum":2,"name":"上游服务占比分析","parentId":327,"resourceOrder":1,"resourceType":null,"resourceUrl":"","showFlag":"","systemId":null,"updateTime":null},{"accCtrlStr":"plate:operator:down","checked":null,"childResource":[{"accCtrlStr":"plate:operator:down:customer","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"","id":341,"jumpUrl":"","levelNum":2,"name":"按客户分析","parentId":339,"resourceOrder":0,"resourceType":null,"resourceUrl":"views/query_downstream_customer.html","showFlag":"","systemId":null,"updateTime":null},{"accCtrlStr":"plate:operator:down:service","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"","id":343,"jumpUrl":"","levelNum":2,"name":"按服务分析","parentId":339,"resourceOrder":1,"resourceType":null,"resourceUrl":"views/query_downstream_service.html","showFlag":"","systemId":null,"updateTime":null}],"createTime":null,"description":"","enName":"","icon":"icon-xiajiang","id":339,"jumpUrl":"","levelNum":2,"name":"下游服务占比分析","parentId":327,"resourceOrder":2,"resourceType":null,"resourceUrl":"","showFlag":"","systemId":null,"updateTime":null}],"createTime":null,"description":"","enName":"","icon":"icon-guanli","id":327,"jumpUrl":"","levelNum":2,"name":"用量统计","parentId":null,"resourceOrder":1,"resourceType":null,"resourceUrl":"","showFlag":"","systemId":101,"updateTime":null},{"accCtrlStr":"plate:operator:tool","checked":null,"childResource":[{"accCtrlStr":"plate:operator:tool:log","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"icon-chakanrizhi","id":349,"jumpUrl":"","levelNum":2,"name":"日志分析","parentId":347,"resourceOrder":0,"resourceType":null,"resourceUrl":"views/query_logs.html","showFlag":"","systemId":null,"updateTime":null},{"accCtrlStr":"plate:operator:tool:quality","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"icon-zhiliangbz","id":351,"jumpUrl":"","levelNum":2,"name":"质量分析","parentId":347,"resourceOrder":2,"resourceType":null,"resourceUrl":"views/query_quality.html","showFlag":"","systemId":null,"updateTime":null},{"accCtrlStr":"plate:operator:tool:guid","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"icon-search","id":353,"jumpUrl":"","levelNum":2,"name":"查询guid","parentId":347,"resourceOrder":3,"resourceType":null,"resourceUrl":"views/query_guid.html","showFlag":"","systemId":null,"updateTime":null},{"accCtrlStr":"","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"iconfont icon-xiangmu","id":619,"jumpUrl":"","levelNum":2,"name":"新质量分析","parentId":347,"resourceOrder":3,"resourceType":null,"resourceUrl":"views/query_newquality.html","showFlag":"","systemId":null,"updateTime":null},{"accCtrlStr":"plate:operator:tool:mvTrackId","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"icon-shujucaiji","id":383,"jumpUrl":"","levelNum":2,"name":"查询mvTrackId","parentId":347,"resourceOrder":4,"resourceType":null,"resourceUrl":"views/query_mvTrackId.html","showFlag":"","systemId":null,"updateTime":null}],"createTime":null,"description":"","enName":"","icon":"icon-yunweiguanli","id":347,"jumpUrl":"","levelNum":2,"name":"运维工具","parentId":null,"resourceOrder":2,"resourceType":null,"resourceUrl":"","showFlag":"","systemId":101,"updateTime":null},{"accCtrlStr":"plate:operator:data","checked":null,"childResource":[{"accCtrlStr":"plate:operator:data:redis:crud","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"icon-qingchuhuancun","id":359,"jumpUrl":"","levelNum":2,"name":"操作缓存","parentId":355,"resourceOrder":1,"resourceType":null,"resourceUrl":"views/opreat_cache.html","showFlag":"","systemId":null,"updateTime":null},{"accCtrlStr":"plate:operator:data:persist:crud","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"icon-zhongzhi","id":361,"jumpUrl":"","levelNum":2,"name":"持久化","parentId":355,"resourceOrder":3,"resourceType":null,"resourceUrl":"views/query_dataReset.html","showFlag":"","systemId":null,"updateTime":null}],"createTime":null,"description":"","enName":"","icon":"icon-iconset0358","id":355,"jumpUrl":"","levelNum":2,"name":"数据持久化","parentId":null,"resourceOrder":3,"resourceType":null,"resourceUrl":"","showFlag":"","systemId":101,"updateTime":null},{"accCtrlStr":"","checked":null,"childResource":[{"accCtrlStr":"","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"icon-minganguanjianzi","id":365,"jumpUrl":"","levelNum":2,"name":"敏感词","parentId":363,"resourceOrder":0,"resourceType":null,"resourceUrl":"views/query_sensitive.html","showFlag":"","systemId":null,"updateTime":null},{"accCtrlStr":"","checked":null,"childResource":[{"accCtrlStr":"","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"","id":369,"jumpUrl":"","levelNum":2,"name":"非法调用","parentId":367,"resourceOrder":0,"resourceType":null,"resourceUrl":"views/query_illegality_search.html","showFlag":"","systemId":null,"updateTime":null},{"accCtrlStr":"","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"","id":371,"jumpUrl":"","levelNum":2,"name":"参数设置","parentId":367,"resourceOrder":1,"resourceType":null,"resourceUrl":"views/query_parameter_settings.html","showFlag":"","systemId":null,"updateTime":null},{"accCtrlStr":"","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"","id":373,"jumpUrl":"","levelNum":2,"name":"参数列表","parentId":367,"resourceOrder":2,"resourceType":null,"resourceUrl":"views/query_parameter_list.html","showFlag":"","systemId":null,"updateTime":null}],"createTime":null,"description":"","enName":"","icon":"icon-fuwu1","id":367,"jumpUrl":"","levelNum":2,"name":"防撞库","parentId":363,"resourceOrder":0,"resourceType":null,"resourceUrl":"","showFlag":"","systemId":null,"updateTime":null}],"createTime":null,"description":"","enName":"","icon":"icon-anquan","id":363,"jumpUrl":"","levelNum":2,"name":"安全中心","parentId":null,"resourceOrder":4,"resourceType":null,"resourceUrl":"","showFlag":"","systemId":101,"updateTime":null},{"accCtrlStr":"","checked":null,"childResource":[{"accCtrlStr":"","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"icon-jilu1","id":469,"jumpUrl":"","levelNum":2,"name":"上游调用量","parentId":467,"resourceOrder":0,"resourceType":null,"resourceUrl":"views/query_upStreamCount.html","showFlag":"","systemId":null,"updateTime":null},{"accCtrlStr":"","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"icon-icon-test","id":471,"jumpUrl":"","levelNum":2,"name":"三网通服务调用量","parentId":467,"resourceOrder":0,"resourceType":null,"resourceUrl":"views/query_mobileOperator.html","showFlag":"","systemId":null,"updateTime":null},{"accCtrlStr":"","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"icon-jichuxinxi","id":473,"jumpUrl":"","levelNum":2,"name":"下游客户调用明细","parentId":467,"resourceOrder":0,"resourceType":null,"resourceUrl":"views/query_trackDetail.html","showFlag":"","systemId":null,"updateTime":null}],"createTime":null,"description":"","enName":"","icon":"icon-daochu","id":467,"jumpUrl":"","levelNum":2,"name":"数据导出","parentId":null,"resourceOrder":5,"resourceType":null,"resourceUrl":"","showFlag":"","systemId":101,"updateTime":null},{"accCtrlStr":"","checked":null,"childResource":[{"accCtrlStr":"","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"iconfont icon-jilu1","id":661,"jumpUrl":"","levelNum":2,"name":"供应商质量分析","parentId":659,"resourceOrder":0,"resourceType":null,"resourceUrl":"views/supplier_quality_analysis.html","showFlag":"","systemId":null,"updateTime":null},{"accCtrlStr":"","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"iconfont icon-icon-test","id":663,"jumpUrl":"","levelNum":2,"name":"服务质量分析","parentId":659,"resourceOrder":0,"resourceType":null,"resourceUrl":"views/customer_quality_analysis.html","showFlag":"","systemId":null,"updateTime":null}],"createTime":null,"description":"","enName":"","icon":"iconfont icon-daochu","id":659,"jumpUrl":"","levelNum":2,"name":"平台质量分析","parentId":null,"resourceOrder":7,"resourceType":null,"resourceUrl":"","showFlag":"","systemId":101,"updateTime":null},{"accCtrlStr":"","checked":null,"childResource":[{"accCtrlStr":"","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"iconfont icon-canshu","id":779,"jumpUrl":"","levelNum":2,"name":"接口参数维护","parentId":777,"resourceOrder":0,"resourceType":null,"resourceUrl":"views/interface_parameter_maintenance.html","showFlag":"","systemId":null,"updateTime":null}],"createTime":null,"description":"","enName":"","icon":"iconfont icon-ai-tool","id":777,"jumpUrl":"","levelNum":2,"name":"配置管理","parentId":null,"resourceOrder":7,"resourceType":null,"resourceUrl":"","showFlag":"","systemId":101,"updateTime":null},{"accCtrlStr":"","checked":null,"childResource":[{"accCtrlStr":"","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"icon-shenhe","id":783,"jumpUrl":"","levelNum":2,"name":"订单查询","parentId":781,"resourceOrder":0,"resourceType":null,"resourceUrl":"views/vehicle/query_order.html","showFlag":"","systemId":null,"updateTime":null}],"createTime":null,"description":"","enName":"","icon":"icon-jilu11","id":781,"jumpUrl":"","levelNum":2,"name":"异步服务运营","parentId":null,"resourceOrder":9,"resourceType":null,"resourceUrl":"","showFlag":"1","systemId":101,"updateTime":null},{"accCtrlStr":"","checked":null,"childResource":[{"accCtrlStr":"","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"icon-minganguanjianzi","id":1005,"jumpUrl":"","levelNum":2,"name":"敏感词","parentId":1003,"resourceOrder":0,"resourceType":null,"resourceUrl":"views/security/sensitive_word.html","showFlag":"1","systemId":null,"updateTime":null},{"accCtrlStr":"","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"icon-zhiliangbz","id":1007,"jumpUrl":"","levelNum":2,"name":"服务规则管理","parentId":1003,"resourceOrder":0,"resourceType":null,"resourceUrl":"views/security/service_regular.html","showFlag":"1","systemId":null,"updateTime":null},{"accCtrlStr":"","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"icon-shuaxin","id":1009,"jumpUrl":"","levelNum":2,"name":"实例管理","parentId":1003,"resourceOrder":0,"resourceType":null,"resourceUrl":"views/security/rule_instance.html","showFlag":"1","systemId":null,"updateTime":null},{"accCtrlStr":"","checked":null,"childResource":[],"createTime":null,"description":"","enName":"","icon":"icon-fanhuima","id":1011,"jumpUrl":"","levelNum":2,"name":"拦截记录","parentId":1003,"resourceOrder":0,"resourceType":null,"resourceUrl":"views/security/param_record.html","showFlag":"1","systemId":null,"updateTime":null}],"createTime":null,"description":"","enName":"","icon":"icon-anquan","id":1003,"jumpUrl":"","levelNum":2,"name":"新安全中心","parentId":null,"resourceOrder":10,"resourceType":null,"resourceUrl":"","showFlag":"1","systemId":101,"updateTime":null}]
        this.menuActive = this.menu[0].id + ''
      // })
    }
  },
  mounted() {
    this.userName = localStorage.getItem('accountName')
    this.querySubSystemMenuList()
  }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus">
@import '../common/css/variable';

.el-container 
  min-width 715px
  height 100%
  .el-header 
    box-shadow 0 4px 16px rgba(0, 0, 0, 0.08)
    margin-bottom 10px
    .header-menu-warp 
      position relative
      float right
      height 60px
      line-height 60px
      width 240px
      padding 0
      display flex
      .avatar 
        width 20%
        height calc(100% -12px)
        display table-cell
        text-align center
        padding-top 12px
        img 
          width 36px
          height 36px
          border-radius 50%
      .el-select 
        &:first-child 
          width 70px
        span 
          color white
      input 
        background-color rgba(43, 63, 115, 0) !important
        border none !important
        color white
        padding 0
    .header-logo 
      display inline-block
      width 250px
      height 100%
      background url('../common/images/logo.png') no-repeat 16px center

  .m-body 
    .aside 
      height 100%
      min-width 190px
      background none repeat scroll 0 0 rgba(0, 0, 0, 0.1)
      overflow auto
      .el-menu 
        background-color rgba(0, 0, 0, 0.1)
        .el-menu-item 
          cursor pointer
          height 40px
          line-height 40px
          min-width 190px !important
          color #adb3c4
          &.is-active 
            background none 0px 0px repeat scroll rgba(0, 0, 0, 0.3)
          span
            font-size $font-size-medium
            color $color-aside-text
          i:before 
            font-size: $font-size-medium-x;
        .el-submenu 
          .el-menu-item 
            min-width 190px
        .el-submenu__title 
          height 40px
          line-height 40px
          color #adb3c4
          &:hover 
            background-color: #ecf5ff
</style>

<template>
  <el-container id="app">
    <!-- 头部组件 -->
    <MHeader/>
    <el-container class="m-body">
      <!-- 左侧导航 -->
      <NavLeft/>
      <el-main>
        <HeaderTabs/>
        <keep-alive>
          <router-view/>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
// import { mapGetters } from 'vuex' // 获取state里面的数据
import { $http } from '@/common/js/ajax'
import MHeader from '@/components/Header'
import NavLeft from '@/components/NavLeft'
import HeaderTabs from '@/components/HeaderTabs'
export default {
  data () {
    return {
      isCollapse: false
    }
  },
  components: {
    MHeader,
    NavLeft,
    HeaderTabs
  },
  methods: {
    collapse () { // 左侧菜单展开折叠
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus">
@import '../common/css/variable';
.el-container 
  min-width 715px
  height 100%
  .m-body
    margin-top: 60px;
    .el-main
      overflow-y scroll
      padding 0px 10px 20px 10px !important
      .template-wrapper
        margin-top 55px
        margin-bottom 55px
      .tab-wrapper
        position fixed
        height 40px
        width 100%
        overflow hidden
        padding 0 10px
        margin-left -10px
        margin-right -10px
        z-index 100
        background #fff
        box-shadow 0 5px 10px #ddd
        .el-tabs
          height 50px !important
          margin-left -10px
          margin-right -10px
          position absolute
          z-index 102
          width 100%
          background #ecf1f5
          .is-active
            background white
            border-top-left-radius 10px
            border-top-right-radius 10px
</style>

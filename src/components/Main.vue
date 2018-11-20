<template>
  <el-container id="app">
    <!-- 头部 -->
    <el-header>
      <div class="header-logo"></div>
      <div class="header-menu-warp">
        <div class="avatar">
          <img src="../common/images/default.jpg">
        </div>
        <div @click="loginOut" class="loginOut">退出</div>
      </div>
    </el-header>
    <el-container class="m-body">
      <el-col class="aside" :span="4">
        <el-menu default-active="2" class="el-menu-vertical-demo">
          <el-menu-item index="2" @click="selectItem('QueryIndex')">
            <i class="el-icon-menu"></i>
            <span slot="title">总量统计</span>
          </el-menu-item>
          <el-menu-item index="3" @click="selectItem('SensitiveWord')">
            <i class="el-icon-document"></i>
            <span slot="title">敏感词</span>
          </el-menu-item>
          <el-menu-item index="4" @click="selectItem('SupplierAnalysis')">
            <i class="el-icon-setting"></i>
            <span slot="title">供应商分析</span>
          </el-menu-item>
          <el-menu-item index="5" @click="selectItem('ServiceAnalysis')">
            <i class="el-icon-mobile-phone"></i>
            <span slot="title">服务分析</span>
          </el-menu-item>
          <el-menu-item index="6" @click="selectItem('QueryLog')">
            <i class="el-icon-date"></i>
            <span slot="title">日志分析</span>
          </el-menu-item>
          <el-menu-item index="7" @click="selectItem('QualityAnalysis')">
            <i class="el-icon-upload"></i>
            <span slot="title">质量分析</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-main :span="20">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

export default {
  data () {
    return {}
  },
  methods: {
    selectItem (value) {
      this.$router.push({ name: value })
    },
    loginOut () {
      localStorage.removeItem('mtk')
      this.$router.push({ name: '/Login' })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../common/css/variable'

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
      width 120px
      padding 0
      display flex
      .avatar
        width 50%
        height 100%
        margin 8px
        img
          width 44px
          height 44px
          border-radius 50%
      .loginOut
        width 50%
        text-align center
        cursor pointer
    .header-logo 
      display inline-block
      width 250px
      height 100%
      background url('../common/images/logo.png') no-repeat 16px center;
  .m-body 
    .aside 
      height 100%;
      width 140px;
      background none repeat scroll 0 0 rgba(0, 0, 0, 0.1)
      .el-menu 
        background-color rgba(0, 0, 0, 0.1)
        .el-menu-item 
          height 40px
          line-height 40px
          cursor pointer
          &:hover 
            color $color-white
          &.is-active 
            color $color-white
            background none 0px 0px repeat scroll rgba(0, 0, 0, 0.3)
          span 
            font-size $font-size-medium
            color $color-aside-text
          i:before 
            font-size $font-size-medium-x
</style>

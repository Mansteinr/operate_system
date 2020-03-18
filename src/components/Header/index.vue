<!-- 头部 -->
<template>
  <!-- <div> -->
  <el-header class="m-header">
    <div class="header-logo"></div>
    <div class="header-menu-warp">
      <el-select v-model="chooseLanguageTitle" class="chooseLanguageSelect" placeholder="请选择">
        <el-option @click.native="selectLang('zh-CN')" value="中文"></el-option>
        <el-option @click.native="selectLang('en-US')" value="English"></el-option>
      </el-select>
      <el-dropdown class="el-select chooseNameSelect">
        <span class="el-dropdown-link">
          {{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="choseProject">{{$t('m.header.choseProject')}}</el-dropdown-item>
          <el-dropdown-item @click.native="loginOut">{{$t('m.header.loginOut')}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        chooseLanguageTitle: '中文',
        userName: 'zhoumingye',
      }
    },
    methods: {
      // 选择语言
      selectLang (value) {
        console.log(value)
      },
      choseProject () { // 选择项目
       window.location.href = this.API.base.projectchoose
      },
      loginOut () { // 退出
        localStorage.removeItem('mtk')
        this.$router.push({ name: '/Login' })
      },
    },
    mounted() {
      this.userName = localStorage.getItem('accountName')
    }
  }
</script>

<style  lang="stylus" rel="stylesheet/stylus">
@import '../../common/css/variable';
  .m-header
    box-shadow 0 4px 16px rgba(0, 0, 0, 0.08)
    width: 100%;
    position: fixed;
    background $color-nave;
    padding-right: 0
    .header-menu-warp 
      position relative
      float right
      height 60px
      line-height 60px
      width 240px
      padding 0
      display flex
      .chooseLanguageSelect
        width 30%
        .el-select__caret
          position relative
          top -1px
      .chooseNameSelect
        width 68%
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
      background url('../../common/images/logo.png') no-repeat 16px center
</style>
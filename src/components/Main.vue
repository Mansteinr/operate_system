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
            <el-menu-item :index="v.id" :data-index="v.id" v-if="v.childResource.length==0" @click="selectItem(v)">
              <i :class="v.icon"></i>
              {{v.name}}
            </el-menu-item>
            <el-submenu v-else :index="v.id">
              <template slot="title">
                <i :class="v.icon"></i>
                {{v.name}}
                <!-- <span>导航一</span> -->
              </template>
              <template v-for="(v1, k1) in v.childResource">
                <el-menu-item v-if="v1.childResource.length==0" :data-index="v.id+'-'+v1.id" :index="v.id+'-'+v1.id" @click="selectItem(v1)">
                  <i :class="v1.icon"></i>
                  <span slot="title">{{v1.name}}</span>
                </el-menu-item>
                <el-submenu :index="v.id+'-'+v1.id" v-else>
                  <template slot="title" :class="v1.icon">{{v1.name}}</template>
                  <el-menu-item v-for="(v2, k2) in v1.childResource" :data-index="v.id+'-'+v1.id+'-'+v2.id" :index="v.id+'-'+v1.id+'-'+v2.id" @click="selectItem(v2)"><span slot="title">{{v2.name}}</span></el-menu-item>
                </el-submenu>
              </template>
            </el-submenu>
          </template>
        </el-menu>
      </el-col>
      <el-main :span="21">
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
      console.log(value)
      this.menuActive = value.id
      // this.$router.push({ name: value })
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
      $http(this.API.creditApi.querySubSystemMenuList, { systemName: '服务平台' }).then((res) => {
        this.menu =  res.resData
        this.menuActive = this.menu[0].id
      })
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
      min-width 140px
      background none repeat scroll 0 0 rgba(0, 0, 0, 0.1)
      .el-menu 
        background-color rgba(0, 0, 0, 0.1)
        .el-menu-item 
          cursor pointer
          height 40px
          line-height 40px
          min-width 140px !important
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
            min-width 140px
        .el-submenu__title 
          height 40px
          line-height 40px
          color #adb3c4
          &:hover 
            background-color: #ecf5ff
</style>

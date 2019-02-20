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
      <el-aside :class="isCollapse?'':'active'">
        <el-menu 
          class="el-menu-vertical-demo"
          background-color="#3f455b"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true" 
          :collapse="isCollapse"
          :default-active="menuActive">
          <div class="mv-collapse" @click="collapse"><i class="iconfont icon-tubiaozhizuomoban"></i></div>
          <template v-for="v in menu">
            <el-menu-item :index="v.id+''" :key="v.id" v-if="v.childResource.length==0" @click="selectItem(v)">
              <i :class="v.icon"></i>
              <span slot="title">{{v.name}}</span>
            </el-menu-item>
            <el-submenu v-else :index="v.id+''" :key="v.id">
              <template slot="title">
                <i :class="v.icon"></i>
                <span slot="title">{{v.name}}</span>
              </template>
              <template v-for="v1 in v.childResource">
                <el-menu-item v-if="v1.childResource.length==0" :key="v1.id" :index="v.id+'-'+v1.id" @click="selectItem(v1)">
                  <i :class="v1.icon"></i>
                  <span slot="title">{{v1.name}}</span>
                </el-menu-item>
                <el-submenu :index="v.id+'-'+v1.id" :key="v1.id"  v-else>
                  <template slot="title">
                    <i :class="v.icon"></i>
                    <span slot="title">{{v1.name}}</span>
                  </template>
                  <el-menu-item v-for="v2 in v1.childResource" :index="v.id+'-'+v1.id+'-'+v2.id" :key="v2.id" @click="selectItem(v2)">
                    <span slot="title">{{v2.name}}</span></el-menu-item>
                </el-submenu>
              </template>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <div class="m-tabs">
          <router-link 
            tag="div" class="tab-item" 
            :class="{active:editableTabsValue===item.name}" 
            v-for="item in editableTabs" 
            :key="item.name" 
            :to="{name: item.url}"  
            @click.native='clickTabs(item.name)'>
              {{item.title}}
            <i class="icon-delete" @click.stop="deleteTab(item)"></i>
          </router-link>
        </div>
        <keep-alive>
            <router-view/>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { $http } from '../common/js/ajax'
export default {
  data () {
    return {
      value4: '中文',
      userName: 'zhoumingye',
      menu: [],
      menuActive: '',
      isCollapse: false,
      editableTabsValue: '',
      editableTabs: [],
      tabIndex: 2
    }
  },
  methods: {
    clickTabs (value) {
      this.editableTabsValue = value
    },
    collapse () {
      this.isCollapse = !this.isCollapse
    },
    selectItem (value) {
      let paramArr = value.resourceUrl.split('/'), unqiuFlag = false
      this.$router.push({name: paramArr[paramArr.length - 1].split('.')[0]})
      this.menuActive = value.id+'' // 需要传入字符串 传入number会报错
      this.editableTabs.map(v => {
        if (v.name === this.menuActive) {
          unqiuFlag = true
        }
      })
      if (!unqiuFlag) {
        this.editableTabs.push({
          title: value.name,
          name: this.menuActive,
          url: value.resourceUrl.split('/')[1].split('.')[0]
        })
      }
      this.editableTabsValue = this.menuActive
    },
    selectLang (value) {
      console.log(value)
    },
    choseProject () {
       window.location.href = this.API.base.projectchoose
    },
    loginOut () {
      localStorage.removeItem('mtk')
      this.$router.push({ name: '/Login' })
    },
    querySubSystemMenuList () { // 获取菜单
      $http(this.API.base.querymenus, { 'systemName': '服务平台' }).then((res) => {
        this.menu =  res.resData
        this.menuActive = this.menu[0].id + ''
        this.editableTabs.push({
          title: this.menu[0].name,
          name: this.menuActive,
          url: this.menu[0].resourceUrl.split('/')[1].split('.')[0]
        })
        this.editableTabsValue = this.menuActive
      })
    },
    deleteTab (value) { // 删除tabs
      if (this.editableTabs.length <= 1) {
        return
      }
      this.editableTabs.map((v, k) => {
        if (v.name === value.name) {
          this.editableTabs.splice(k, 1)
          if (this.editableTabsValue === value.name) { // 删除的是激活状态的tabs
            this.editableTabsValue = this.editableTabs[this.editableTabs.length-1].name
            this.$router.push({name: this.editableTabs[this.editableTabs.length-1].url})
          }
        }
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
    background $color-nave
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
    .el-main
      overflow-y scroll
      padding 0px 10px 20px 10px !important
      .m-tabs
        height 40px
        background $color-white
        margin-bottom 10px
        margin-left -10px
        margin-right -10px
        display flex
        background $color-tab-color
        overflow auto
        .tab-item
          position relative
          z-index 50
          height 100%
          line-height 40px
          padding 0 20px
          cursor pointer
          border-right 1px solid rgb(228, 231, 237)
          overflow hidden
          max-width 150px
          i 
            position absolute
            width 0px
            height 15px
            margin-right 0px
            border-radius 50%
            font-size 12px
            line-height 14px
            right 0px
            top 13px
            opacity 0
            transition all .7s
            z-index 105
            &:hover
              background-color rgb(192, 196, 204)
              color rgb(255, 255, 255)
              opacity 1
          &.active
            color $color-bule
            background $color-white
            border-top-left-radius 10px
            border-top-right-radius 10px
            i 
              width 15px
              opacity 1
          &:hover
            i 
              width 15px
              opacity 1
    .el-aside
      width: auto !important
      background $color-nave
      .el-submenu
        .el-submenu__title
          color #adb3c4 !important
      .el-menu-item 
        cursor pointer
        color #adb3c4 !important
        background $color-menuitem-color !important
      .el-menu-item.is-active
        color rgb(255, 208, 75) !important
      .mv-collapse 
        text-align center
        height 30px
        line-height 30px
        .icon-tubiaozhizuomoban
          transition all 0.3s ease-in-out
    .el-aside.active
      width 220px !important
      .icon-tubiaozhizuomoban
        transform rotate(-90deg)
</style>

<template>
  <el-container id="app">
    <!-- 头部组件 -->
    <MHeader/>
    <el-container class="m-body">
      <el-aside :class="isCollapse?'':'active'">
        <el-menu 
          class="el-menu-vertical-demo"
          background-color="#3f455b"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true" 
          :collapse="isCollapse"
          :router="true"
          :default-active="menuActive">
          <div class="mv-collapse" @click="collapse"><i class="iconfont icon-tubiaozhizuomoban"></i></div>
          <template v-for="v in menu">
            <el-menu-item :index="v.resourceUrl+''" :key="v.id" v-if="v.childResource.length==0" @click="selectItem(v)">
              <i :class="v.icon"></i>
              <span slot="title">{{v.name}}</span>
            </el-menu-item>
            <el-submenu v-else :index="v.id+''" :key="v.id">
              <template slot="title">
                <i :class="v.icon"></i>
                <span slot="title">{{v.name}}</span>
              </template>
              <template v-for="v1 in v.childResource">
                <el-menu-item v-if="v1.childResource.length==0" :key="v1.id" :index="v1.resourceUrl" @click="selectItem(v1)">
                 <i :class="v1.icon"></i>
                  <span slot="title">{{v1.name}}</span>
                </el-menu-item>
                <el-submenu :index="v.id+'-'+v1.id" :key="v1.id"  v-else>
                  <template slot="title">
                    <i :class="v.icon"></i>
                    <span slot="title">{{v1.name}}</span>
                  </template>
                  <el-menu-item v-for="v2 in v1.childResource" :index="v2.resourceUrl" :key="v2.id" @click="selectItem(v2)">
                  <span slot="title">{{v2.name}}</span></el-menu-item>
                </el-submenu>
              </template>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-main>
        <div class="tab-wrapper">
          <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="clickTabs">
            <el-tab-pane
              v-for="item in editableTabs"
              :key="item.name"
              :label="item.title"
              :name="item.url"
            >
            </el-tab-pane>
          </el-tabs>
        </div>
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
export default {
  data () {
    return {
      menu: [],
      menuActive: '', // 标记菜单激活状态
      isCollapse: false,
      editableTabsValue: '', // 标记卡片激活状态
      editableTabs: [],
      tabIndex: 1
    }
  },
  components: {
    MHeader
  },
  // computed: {
  //   ...mapGetters([
  //     'addMenu' // 这个menu对应的是getters里面的menu 这样就拿到state中的菜单信息
  //   ])
  // },
  methods: {
    clickTabs (tab) { // 点击选项卡
      this.menuActive = tab.name
      this.$router.push({name: tab.name}) //点击选项卡时 切换路由
    },
    collapse () { // 左侧菜单展开折叠
      this.isCollapse = !this.isCollapse
    },
    selectItem (value) { // 点击左侧菜单
      let unqiuFlag = false // 防止重复点击
      this.$router.push({name: value.resourceUrl})
      
      this.menuActive = value.resourceUrl
      this.editableTabs.map(v => {
        if (v.name === value.resourceUrl) {
          unqiuFlag = true
        }
      })
      
      if (!unqiuFlag) {
        this.editableTabs.push({
          title: value.name,
          name: this.menuActive,
          url: value.resourceUrl
        })
      }
      this.editableTabsValue = this.menuActive
    },
    querySubSystemMenuList () { // 获取菜单
      $http(this.API.base.querymenus, { 'systemName': '服务平台' }).then((res) => {
        this.menu =  res.resData
        this.menuActive = this.menu[0].resourceUrl
        this.editableTabs.push({
          title: this.menu[0].name,
          name: this.menuActive,
          url: this.menu[0].resourceUrl
        })
        this.editableTabsValue = this.menuActive
      })
    },
    removeTab(targetName) { // 删除tab选项卡
      if (!(this.editableTabs.length - 1)) {
        return
      }
      let tabs = this.editableTabs
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName)
      this.$router.push({ name: `${this.editableTabs[this.editableTabs.length-1].url}` })
      this.editableTabsValue = this.editableTabs[this.editableTabs.length-1].url
      this.menuActive = this.editableTabs[this.editableTabs.length-1].url
    }
  },
  mounted() {
    this.querySubSystemMenuList()
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
        margin-top 20px
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
.tab-wrapper
  position relative
  height 40px
  overflow hidden
  background #fff
  padding 0 10px
  box-shadow 0 5px 10px #ddd
  margin-left -10px
  margin-right -10px
</style>

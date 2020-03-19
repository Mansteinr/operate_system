<template>
  <el-container id="app">
    <!-- 头部组件 -->
    <MHeader/>
    <el-container class="m-body">
      <!-- 左侧导航 -->
      <NavLeft/>
      <el-main>
        <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="clickTabs" class="tab-wrapper">
          <el-tab-pane
            v-for="item in editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.url"
          >
          </el-tab-pane>
        </el-tabs>
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
    MHeader,
    NavLeft,
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
      .tab-wrapper
        position relative
        height 40px
        overflow hidden
        background #fff
        padding 0 10px
        box-shadow 0 5px 10px #ddd
        margin-left -10px
        margin-right -10px
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
</style>

<!-- 头部导航栏  v-model="editableTabsValue"-->
<template>
  <el-tabs
    type="card"
    v-model='basics.editableTabsValue'
    closable
    @tab-remove="removeTab"
    @tab-click="clickTabs"
    class="tab-wrapper"
  >
    <el-tab-pane v-for="item in basics.editableTabs" :key="item.name" :label="item.title" :name="item.url"></el-tab-pane>
  </el-tabs>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations, mapState  } from 'vuex' // 获取state里面的数据
export default {
  data() {
    return {}
  },
  methods: {
    clickTabs(tab) {
      // 点击选项卡
      this.setMenuActive(tab.name)
      this.$router.push({ name: tab.name }) //点击选项卡时 切换路由
    },
    removeTab(targetName) {
      // 删除tab选项卡
      if (!(this.basics.editableTabs.length - 1)) return
      let tabs = this.basics.editableTabs, activeName = this.basics.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
              // this.setActiveHeaderTab(nextTab.name)
            }
          }
        })
      }
      // this.setActiveHeaderTab(activeName)
      let tempTableTabs = tabs.filter(tab => tab.name !== targetName)
      this.setHeaderTab(tempTableTabs)
      this.$router.push({
        name: `${this.basics.editableTabs[this.basics.editableTabs.length - 1].url}`
      })
      this.setMenuActive(this.tempTableTabs[this.tempTableTabs.length - 1].url)
    },
    ...mapMutations({ // 获取SET_ACTIVE_MEUN的方法
      setHeaderTab: 'basics/SET_HEADER_TABS',
      setMenuActive: 'basics/SET_ACTIVE_MEUN',
      setActiveHeaderTab: 'basics/SET_ACTIVE_HEADER_TAB',
    })
  },
   computed: {
     ...mapState({
       basics: state => state.basics
     }),
    // ...mapGetters([
    //   'editableTabs',
    //   'editableTabsValue'
    // ])
    // map `this.doneCount` to `this.$store.getters.doneTodosCount`
    // ...mapGetters({
    //   // map `this.doneCount` to `this.$store.getters.doneTodosCount`
    //   editableTabs: 'basics/editableTabs',
    //   editableTabsValue: 'basics/editableTabsValue',
    // }),
  }
}
</script>

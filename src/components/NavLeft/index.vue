<template>
  <!-- 左侧导航 -->
  <el-aside class="nav-left" :class="isCollapse?'':'active'">
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
      <template v-for="v in systemMenuList">
        <el-menu-item :index="v.resourceUrl.trim()+''" :key="v.id" v-if="v.childResource.length==0" @click="selectItem(v)">
          <i :class="v.icon"></i>
          <span slot="title">{{v.name}}</span>
        </el-menu-item>
        <el-submenu v-else :index="v.id+''" :key="v.id">
          <template slot="title">
            <i :class="v.icon"></i>
            <span slot="title">{{v.name}}</span>
          </template>
          <template v-for="v1 in v.childResource">
            <el-menu-item v-if="v1.childResource.length==0" :key="v1.id" :index="v1.resourceUrl.trim()" @click="selectItem(v1)">
              <i :class="v1.icon"></i>
              <span slot="title">{{v1.name}}</span>
            </el-menu-item>
            <el-submenu :index="v.id+'-'+v1.id" :key="v1.id"  v-else>
              <template slot="title">
                <i :class="v.icon"></i>
                <span slot="title">{{v1.name}}</span>
              </template>
              <el-menu-item v-for="v2 in v1.childResource" :index="v2.resourceUrl.trim()" :key="v2.id" @click="selectItem(v2)">
              <span slot="title">{{v2.name}}</span></el-menu-item>
            </el-submenu>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </el-aside>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex' // 获取state里面的数据
export default {
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {
    collapse () { // 左侧菜单展开折叠
      this.isCollapse = !this.isCollapse
    },
    selectItem (value) { // 点击左侧菜单
      let unqiuFlag = false // 防止重复点击

      this.$router.push({name: value.resourceUrl.trim()})
      
      // 此处是单独发送一个Mutationn 设置左侧激活状态
      this.setActiveMEUN(value.resourceUrl.trim())
      
      // 防止头部导航器重复添加
      unqiuFlag = this.editableTabs.some(v => v.name === value.resourceUrl.trim())

      if (!unqiuFlag) {
        this.setHeaderTab([{
          title: value.name,
          name: this.menuActive,
          url: value.resourceUrl
        }])
      }
      this.setActiveHeaderTab(this.menuActive)
    },
    // 映射action
    ...mapActions({
      getSystemMenuAjax: 'basics/getSystemMenuAjax'
    }),
    // ...mapActions([
    //   'getSystemMenuAjax'
    // ]),
    ...mapMutations({ // 获取SET_ACTIVE_MEUN的方法
      setActiveMEUN: 'basics/SET_ACTIVE_MEUN',
      setHeaderTab: 'basics/SET_HEADER_TABS',
      setActiveHeaderTab: 'basics/SET_ACTIVE_HEADER_TAB'
    })
  },
  mounted() {
    // 发送异步请求 单个Mutatio直接用mapMutations映射 多个mutations或者异步action用mapActions
    // 此处是提交异步action  action内部其实也是提交的mutation
    this.getSystemMenuAjax()
  },
  computed: {
    // ...mapGetters([
    //   'systemMenuList',
    //   'menuActive'
    // ])
    ...mapGetters({
      systemMenuList: 'basics/systemMenuList',
      menuActive: 'basics/menuActive',
      editableTabs: 'basics/editableTabs'
   })
  }
}
</script>

<style  lang="stylus" rel="stylesheet/stylus">
@import '../../common/css/variable';
.nav-left
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
  &.active
    width 220px !important
    .icon-tubiaozhizuomoban
      transform rotate(-90deg)
</style>

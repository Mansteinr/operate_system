<template>
  <div>
    <div class="select-dropdown m-input">
      <div class="text-warp selected-value" @click.stop="toggleExp($event)"></div>
      <ul class="dropdown-menu">
        <li class="dropdown-item text-warp">1</li>
        <li class="dropdown-item text-warp">1</li>
        <li class="dropdown-item text-warp">1</li>
        <li class="dropdown-item text-warp">1</li>
        <li class="dropdown-item text-warp">1</li>
      </ul>
    </div>
         <el-dropdown>
          <el-button type="primary" size="mini">
            <i class="el-icon-download"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="exportExcel('xlsx',$event)">excel</el-dropdown-item>
            <el-dropdown-item @click.native="exportExcel('xml',$event)">xml</el-dropdown-item>
            <el-dropdown-item @click.native="exportExcel('csv',$event)">csv</el-dropdown-item>
            <el-dropdown-item @click.native="exportExcel('txt',$event)">txt</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
  </div>
</template>
<script>
import pinyin from 'js-pinyin'
export default {
  data() {
    return {
    }
  },
  methods : {
    toggleExp (e) {
       let classNames = e.target.parentNode.className
        if ( classNames.indexOf('active') < 0 ) { 
          e.target.parentNode.className = e.target.parentNode.className + ' active'
        } else {
          e.target.parentNode.className = e.target.parentNode.className.replace(' active', '')
        }
    }
    
  }
}
</script>
<style lang="stylus">
    .select-dropdown 
      position relative
      vertical-align middle
      width 44px
      height 27px
      line-height 27px
      outline none
      position: relative;
      background-color: #409EFF;
      border-radius: 4px;
      border: 1px solid #dcdee2;
      transition: border-color .2s ease-in-out
      &.active
        border-color #57a3f3
        box-shadow 0 0 0 2px rgba(45, 140, 240, .2)
        .dropdown-menu
          transform scaleY(1)
          -webkit-transform scaleY(1)
          opacity 1
      &:hover
        cursor pointer
      .dropdown-menu
        position absolute
        top 110%
        left -1px
        right -1px
        list-style none
        overflow hidden
        background-color #ffffff
        color #333333
        opacity 0
        transform scaleY(0)
        -webkit-transform scaleY(0)
        border-radius 5px
        transform-origin 0 0
        -webkit-transform-origin 0 0
        transition transform .5s ease, opacity .5s ease
        -webkit-transition -webkit-transform .5s ease, opacity .5s ease
        border solid 1px #cccccc
        box-shadow 0 4px 8px rgba(0, 0, 0, .1)
        max-height 300px
        overflow-y auto
        z-index 49
        .dropdown-item
          position relative
          padding 0 10px
          height 36px
          line-height 36px
          cursor pointer
          color #606266
          clear: both
          &.active
            color #2d8cf0
          &:hover
            background-color #f3f3f3
      .selected-value
        position relative
        height 100%
        padding-right 12px
        &:after
          // content ''
          // font-family "element-icons" !important
          // font-size 12px
          // content "\E617"
          // color #999
          // position absolute
          // left 50%
          // margin-left -6px 
          // color white
</style>
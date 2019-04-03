<template>
  <div class="search-item">
    <label class="input-label">{{labelTitle}}：</label>
    <div class="select-dropdown m-input" :class="toggleExpandFoldFlag ? 'active': ''">
      <div class="text-warp selected-value" @click="toggleExp">{{selectedValue}}</div>
      <input type="hidden" v-model="sendBackgroundValue" @change="changeInputValue">
      <ul class="dropdown-menu" :class="isMultiple ? 'multiple' : ''">
        <li class="dropdown-input" v-show="searchInput">
          <input type="text" placeholder="输入搜索" @change="searchItem" v-model.lazy.trim="searchValue" class="search-input m-input">
        </li>
        <li class="dropdown-item selection-criteria" v-show="isAll">
          <span v-for="v  in choseCondition" :key="v.method" @click="selectWay(v.method)" :class="v.method === selectOption ? 'active':''">{{v.title}}</span>
        </li>
        <li class="dropdown-item text-warp" v-for="(v, k) in originArr" :key="k" @click.stop="searchClick(v,k)" :class="isMultiple ? '': (k === selectedIndex?'active': '')">
          {{v[defaultValue] ? v[defaultValue] : v}}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import pinyin from 'js-pinyin'
export default {
  data() {
    return {
      toggleExpandFoldFlag: false, // 展开折叠搜索
      selectedIndex: 0, // 用于切换active和非active的
      sendBackgroundValue: '', // 发送至后台的关键字段对应的值
      selectedValue: '', // 选中内容， 用来显示
      searchValue: '', // 搜索内容
      selectedArr: [], // 多选时，存储已经选中的
      selectOption: '',
      isFirst: true, // 是否是第一次
      choseCondition: [{
          title: '全选',
          method: 'selectAll'
        }, {
          title: '反选',
          method: 'selectInverse'
        }, {
          title: '全不选',
          method: 'unselectAll'
        }]
      }
  },
  props: {
    isMultiple: { // 是否支持多选
      type: Boolean,
      default: false
    },
    searchInput: {
      type: Boolean,
      default: false // 是否支持搜索
    },
    originArr: { // 原始数据
      type: Array,
      default: () => []
    },
    isAll: { // 是否支持全选 反选  全不选功能
      type: Boolean,
      default: false
    },
    labelTitle: {
      type: String,
      default: ''
    },
    defaultValue: { // 用来发送至后台的 比如服务名称游 中文 英文 还有serveiceId  此时defalutValue即为serviceId
      type: String,
      default: ''
    },
    defaultLable: { // 用来展示的
      type: String,
      default: ''
    },
    searchName: { // 发送至后台的字段
      type: String,
      default: ''
    }
  },
  watch : {
    originArr: function() {
      this.$nextTick(() => {
        document.querySelector('.dropdown-item.text-warp').click()
      })
    }
  },
  methods: {
    toggleExp(e) { // 展开折叠下拉框
      this.toggleExpandFoldFlag = !this.toggleExpandFoldFlag
    },
    searchClick (v, k) {
      this.selectedIndex = k
      if (!this.isMultiple) { // 单选
        if (!this.isFirst) { // 因为第一次是手动触发的  第一次不需要展开折叠
          this.toggleExpandFoldFlag = !this.toggleExpandFoldFlag
        } else {
          this.isFirst = false
        }
        this.selectedValue = v[this.defaultValue]
        this.sendBackgroundValue = v[this.searchName]
      } else { // 多选
        let currentClass = e.target.className
        if (currentClass.indexOf('active') < 0) {
          e.target.className = currentClass + ' active'
          this.selectedArr.push(v[this.defaultValue])
        } else {
          this.selectedArr.splice(this.selectedArr.indexOf(v[this.defaultValue]))
          e.target.className = currentClass.replace(' active', '')
        }
        currentClass = ''
        this.selectedValue = this.selectedArr.join(',')
      }
    },
    searchItem () {
     console.log(90)
    },
    selectWay (way) { //全选
      this.selectOption = way
      let lis = document.querySelectorAll('.dropdown-item.text-warp')
      if (way === 'selectAll') { // 全选
        lis.forEach((v, k) => {
          if (v.className.indexOf('active') < 0) {
            v.className += ' active'
             if (this.selectedArr.indexOf(v[this.defaultValue]) < 0) {
              this.selectedArr.push(v[this.defaultValue])
              this.selectedValue = this.selectedArr.join(',')
            }
          }
        })
      } else if (way === 'selectInverse') { // 反选
        lis.forEach((v, k) => {
           if (v.className.indexOf('active') > 0) {
              v.className = v.className.replace(' active', '')
          } else {
            v.className += ' active'
            if (this.selectedArr.indexOf(v[this.defaultValue]) < 0) {
              this.selectedArr.push(v[this.defaultValue])
              this.selectedValue = this.selectedArr.join(',')
            }
          }
        })
       
      } else { // 全不选
        lis.forEach((v, k) => {
           if (v.className.indexOf('active') > 0) {
            v.className = v.className.replace(' active', '')
          }
        })
      }
      this.selectedArr = []
      this.selectedValue = ''
    },
    changeInputValue () {
      console.log(this.sendBackgroundValue)
      this.$emit('changeInputValue', this.sendBackgroundValue)
    }
  }
}
</script>
<style lang="stylus">
  .search-item 
    position relative
    display inline-block
    width calc(32% - 105px)
    height 40px
    line-height 40px
    margin 0 3% 0 0
    float left
    padding 0 20px 0 85px
    .input-label
      position absolute
      display block
      top 0
      left 0
      width 85px
      color #606266
      text-align right 
    .select-dropdown 
      position relative
      vertical-align middle
      &.active
        border-color #57a3f3
        box-shadow 0 0 0 2px rgba(45, 140, 240, .2)
        .dropdown-menu
          transform scaleY(1)
          -webkit-transform scaleY(1)
          opacity 1
      .multiple
        li.active:after
          font-family iconfont
          content "\e83b"
          position absolute
          right 10px
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
        transform-origin 0 0
        -webkit-transform-origin 0 0
        transition transform .5s ease, opacity .5s ease
        -webkit-transition -webkit-transform .5s ease, opacity .5s ease
        border solid 1px #cccccc
        box-shadow 0 4px 8px rgba(0, 0, 0, .1)
        max-height 300px
        overflow-y auto
        z-index 49
        .selection-criteria
          display flex
          span 
            flex 1
            text-align center
            position relative
            font-size 12px
            &.active
              background-color #f3f3f3
              color #2d8cf0
            &.active:after
              font-family iconfont
              content "\e83b"
              position absolute
              right 0px
        .dropdown-input
          padding 0 20px
          height 40px
          line-height 40px
          .search-input
            height 26px
            line-height 26px
            margin-left -10px
        .dropdown-item
          position relative
          padding 0 10px
          height 36px
          line-height 36px
          cursor pointer
          color #606266
          clear: both
          &.active
            background-color #f3f3f3
            color #2d8cf0
          &:hover
            background-color #f3f3f3
      .selected-value
        position relative
        height 100%
        padding-right 12px
        color #606266
        &:after
          content ''
          font-family "iconfont" !important
          font-size 12px
          content "\e638"
          color #999
          position absolute
          right 0
          transform rotate(0)
          -webkit-transform rotate(0)
          transition transform .6s
          -webkit-transition -webkit-transform .6s
      .text-warp
        white-space nowrap
        text-overflow ellipsis
        overflow hidden
        word-wrap break-word
        word-break break-all
    .m-input
      width 100%
      padding 0 10px
      height 38px
      line-height 38px
      outline none
      position: relative;
      background-color: #fff;
      border-radius: 4px;
      border: 1px solid #dcdee2;
      transition: border-color .2s ease-in-out
.select-dropdown.active .dropdown-menu
    -webkit-transform scaleY(1)
    opacity 1
</style>
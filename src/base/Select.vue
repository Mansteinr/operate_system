<template>
  <div class="search-item">
    <label class="input-label">{{labelTitle}}：</label>
    <div class="select-dropdown m-input" :class="defaultValue">
      <div class="text-warp selected-value" @click.stop="toggleExp($event)" :title="`${selectedValue} (${selectedDefault})`">{{selectedValue}}</div>
      <input type="hidden" :name="defaultValue" :value="selectedDefault">
      <ul class="dropdown-menu" :class="isMultiple ? 'multiple' : ''">
        <li class="dropdown-input" v-show="searchInput">
          <input type="text" placeholder="输入搜索" @change="searchItem" v-model.lazy.trim="searchValue" class="search-input m-input">
        </li>
        <template v-if="localDataArr.length">
          <li class="dropdown-item text-warp" v-for="(v, k) in localDataArr" 
            :key="k"
            :title="`${v[defaultLable] ? v[defaultLable] : v} (${v[defaultValue] ? v[defaultValue] : v})`" 
            @click.stop.prevent="searchClick($event,v,k)" 
            :class="isMultiple ? '': (k === selectedIndex?'active': '')"
          >
            {{v[defaultLable] ? v[defaultLable] : v}}
          </li>
        </template>
        <template v-if="!localDataArr.length">
          <li class="dropdown-item text-warp">
            暂无数据
          </li>
        </template>
     
      </ul>
    </div>
  </div>
</template>
<script>
import pinyin from 'js-pinyin'
export default {
  data() {
    return {
      selectedIndex: 0, // 用于切换active和非active的
      selectedValue: '', // 选中内容， 用来显示
      selectedDefault: '',
      searchValue: '', // 搜索内容
      selectedArr: [], // 多选时，存储已经选中的
      selectedDefaultArr: [], // 多选时，存储已经选中的
      selectOption: '',
      localDataArr: [] // 防止计算过程污染源数据  故先将源数据进行拷贝至改数组中
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
    labelTitle: { // input前的 label值
      type: String,
      default: ''
    },
    defaultValue: { // 需要向后台发送的字段 比如服务名称 英文
      type: String,
      default: ''
    },
    defaultLable: { //  需要向后台发送的字段 展示字段 比如服务名称 中文
      type: String,
      default: ''
    },
    needValue: { // 需要向后台发送的字段 比如服务名称 英文 中文 除此之可能需要serviceId
      type: String,
      default: ''
    }
  },
  watch: {
    originArr() {
      if (this.isAll) {
        this.localDataArr = [{
          [this.defaultValue]:'',
          [this.needValue]: '',
          [this.defaultLable]:'全部'
        }, ...this.originArr]
      } else {
        this.localDataArr = [...this.originArr]
      }
      this.selectedValue = this.localDataArr[0][this.defaultLable]
      this.selectedDefault = this.localDataArr[0][this.defaultValue]
    }
  },
  mounted () {
    window.addEventListener('click', e => { // 当点击其他部位时  则将select收回
      if (e.target.className.indexOf('search-input') >= 0) {
        return false
      }
      document.querySelectorAll('.select-dropdown.m-input').forEach(v => {
        if (v.className.indexOf('active') > 0) {
          v.className = v.className.replace(' active', '')
        }
      })
    }, false)
  },
  methods: {
    reset () {
      // 方法重置
      // this.selectedValue = this.originArr[0][this.defaultLable]
      // this.selectedDefault = this.originArr[0][this.defaultValue]
      // 一开始是按照上面方法做的 也可以实现重置功能 但是这样无法触发chang事件 然后导致无法联动
      document.querySelector('.dropdown-item.text-warp').click()
    },
    toggleExp(e) { // 展开折叠下拉框
      let classNames = ''
      if (e.target) {
        if(e.target.parentNode.querySelector('.search-input')) {
          e.target.parentNode.querySelector('.search-input').focus()
        }
        classNames = e.target.parentNode.className
        if ( classNames.indexOf('active') < 0 ) { 
          e.target.parentNode.className = e.target.parentNode.className + ' active'
        } else {
          e.target.parentNode.className = e.target.parentNode.className.replace(' active', '')
        }
      } else {
        if (e.className.indexOf('active') < 0) {
          e.className = e.className + ' active'
        } else {
          e.className = e.className.replace(' active', '')
        }
      }
    },
    searchClick (e,v, k) {
      console.log(v, this.defaultValue, v[this.defaultValue])
      this.selectedIndex = k
      if (!this.isMultiple) { // 单选
        this.selectedValue = v[this.defaultLable]
        this.selectedDefault = v[this.defaultValue]
        this.toggleExp(e.target.parentNode.parentNode)
        this.$emit('changeInputValue', v)
      } else { // 多选
        let currentClass = e.target.className
        if (currentClass.indexOf('active') < 0) {
          e.target.className = currentClass + ' active'
          this.selectedArr.push(v[this.defaultLable])
          this.selectedDefaultArr.push(v[this.defaultValue])
        } else {
          this.selectedArr.splice(this.selectedArr.indexOf(v[this.defaultLable]))
          this.selectedDefaultArr.splice(this.selectedDefaultArr.indexOf(v[this.defaultValue]))
          e.target.className = currentClass.replace(' active', '')
        }
        currentClass = ''
        this.selectedValue = this.selectedArr.join(',')
        this.selectedDefault = this.selectedDefaultArr.join(',')
      }
    },
    searchItem () {
      //  首先清空 之前选择的数据
      // this.selectedValue = ''
      // this.selectedDefault = ''
      // this.selectedDefaultArr = []
      // this.selectedArr = []
      if (!this.searchValue) { // 若没有搜索内容 则返回源数据
        this.localDataArr = [...this.originArr]
        return
      }
      let searchPinyin = this.searchValue.toLowerCase() // 搜索词
      let searchItemArr = []
      // 估计要分多选和单选两种清空
      // if(!this.isMultiple) { // 单选
        this.localDataArr.map(v => { // 检索
          if (v[this.defaultLable].indexOf(this.searchValue) > -1 || pinyin.getFullChars(v[this.defaultValue]).toLowerCase().indexOf(searchPinyin) > -1 ||  pinyin.getFullChars(v[this.defaultLable]).toLowerCase().indexOf(searchPinyin) > -1 || pinyin.getCamelChars(v[this.defaultValue]).toLowerCase().indexOf(searchPinyin) > -1 || pinyin.getCamelChars(v[this.defaultLable]).toLowerCase().indexOf(searchPinyin) > -1) {
            searchItemArr.push(v)
          }
        })
        this.localDataArr = [...searchItemArr]
      // }
    },
    // selectWay (way, e) { //全选
    //   this.selectOption = way
    //   let lis = e.target.parentNode.parentNode.querySelectorAll('.dropdown-item.text-warp')
    //   let defaultValue = data-defaultValue, 
    //   console.log(lis)
    //   if (way === 'selectAll') { // 全选
    //     lis.forEach(v => {
    //       if (v.className.indexOf('active') < 0) {
    //         v.getAttribute()
    //         v.className += ' active'
    //           // console.log(this.selectedArr.indexOf(v[this.defaultValue]))
    //           // console.log(this.selectedArr)
    //           // console.log(v[this.defaultValue])
    //           // console.log(this.defaultValue)
    //           // console.log(v)
    //           console.log(e.target)
    //          if (this.selectedArr.indexOf(v[this.defaultValue]) <= -1) {
    //           this.selectedArr.push(v[this.defaultValue])
    //         }
    //       }
    //     })
    //     this.selectedValue = this.selectedArr.join(',')
    //           console.log(this.selectedValue)
    //   } else if (way === 'selectInverse') { // 反选
    //     lis.forEach(v => {
    //        if (v.className.indexOf('active') > 0) {
    //           v.className = v.className.replace(' active', '')
    //       } else {
    //         v.className += ' active'
    //         if (this.selectedArr.indexOf(v[this.defaultValue]) < 0) {
    //           this.selectedArr.push(v[this.defaultValue])
    //           this.selectedValue = this.selectedArr.join(',')
    //         }
    //       }
    //     })
       
    //   } else { // 全不选
    //     lis.forEach(v => {
    //        if (v.className.indexOf('active') > 0) {
    //         v.className = v.className.replace(' active', '')
    //       }
    //     })
    //     this.selectedArr = []
    //     this.selectedValue = ''
    //   }
    // }
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
      &:hover
        cursor pointer
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
        .selection-criteria
          display flex
          background #f2f6fc
          span 
            flex 1
            text-align center
            position relative
            font-size 12px
            color #606266
            &.active
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
::-webkit-scrollbar
  display block
  width 4px
  height 8px
::-webkit-scrollbar-thumb
  background rgba(0, 0, 0, .3)
  border-radius 8px
</style>
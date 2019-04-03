<template>
  <div class="search-item">
    <label class="input-label">服务名称：</label>
    <div class="select-dropdown m-input" :class="toggleExpandFoldFlag ? 'active': ''">
      <div class="text-warp selected-value" @click="toggleExp">{{selectedValue}}</div>
      <input type="hidden" name="" value="">
      <ul class="dropdown-menu" :class="isMultiple ? 'multiple' : ''">
        <li class="dropdown-input" v-show="searchInput">
          <input type="text" placeholder="输入搜索" @change="searchItem" v-model.lazy.trim="searchValue" class="search-input m-input">
        </li>
        <li class="dropdown-item selection-criteria" v-show="isAll">
          <span v-for="v  in choseCondition" :key="v.method" @click="selectWay(v.method)" :class="v.method === selectOption ? 'active':''">{{v.title}}</span>
        </li>
        <li class="dropdown-item text-warp" v-for="v in arr" :key="v.customerId" @click="searchClick(v,$event)" :class="isMultiple ? '': (v.customerId === selectedId?'active': '')">
          {{v.customerName}}
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
      searchInput: true, // 是否显示搜索框
      selectedId: '',
      selectedValue: '', // 选中内容
      searchValue: '', // 搜索内容
      isMultiple: true, // 是否支持多选
      selectedArr: [],
      selectOption: '',
      isAll: true, // 是否全选
      choseCondition: [{
          title: '全选',
          method: 'selectAll'
        }, {
          title: '反选',
          method: 'selectInverse'
        }, {
          title: '全不选',
          method: 'unselectAll'
        }],
      arr: [{"businessId":"0","businessName":"金融公司","customerId":"41f3f2bef70d4cc7a177b70430f56012","customerName":"上海珑亿融资租赁有限公司","loginName":"longyijinrong"},{"businessId":"1","businessName":"数据公司","customerId":"4236177e1f1944329189d3da930fdbde","customerName":"91征信","loginName":"91zhengxin"},{"businessId":"0","businessName":"金融公司","customerId":"4261e2b647744a668650a2d7f6f53610","customerName":"数尊","loginName":"shuzun"},{"businessId":"4","businessName":"其他","customerId":"42869d7f96594bd2a449fe9c69eccb54","customerName":"杭州平安","loginName":"hangzhoupingan"},{"businessId":"0","businessName":"金融公司","customerId":"42e6335dfd3e486a8d943629fbe65e96","customerName":"四川博瑞盈","loginName":"boruiyinghuoti"},{"businessId":"0","businessName":"金融公司","customerId":"42f4a3e04236492b8392ac91d90bb6af","customerName":"北京摩拜科技有限公司","loginName":"mobaikeji"},{"businessId":"0","businessName":"金融公司","customerId":"43065b597c5740a2b6d2ce5775d041db","customerName":"吉信","loginName":"jixin"},{"businessId":"4","businessName":"其他","customerId":"432029f917cf43a695ba7b569457d6b5","customerName":"传化支付","loginName":"chuanhuazhifu"},{"businessId":"0","businessName":"金融公司","customerId":"432b7fbf191e4ebaa9b2363cec925194","customerName":"北京华研智行科技有限公司","loginName":"huayan"},{"businessId":"0","businessName":"金融公司","customerId":"4357cad90a87429187e32dcadcfee88c","customerName":"易巴巴","loginName":"yibaba"},{"businessId":"0","businessName":"金融公司","customerId":"4389b73f2213491d88d51f9bddc82afc","customerName":"上海梦浣网络科技有限公司","loginName":"shanghaimenghuan"},{"businessId":"0","businessName":"金融公司","customerId":"439a692f8cce4da9949522e64636648e","customerName":"易网聚鲜科技有限公司","loginName":"juxian"},{"businessId":"1","businessName":"数据公司","customerId":"43b92837e8e94376999591dad1f085ed","customerName":"华付信息","loginName":"huafuxinxi"},{"businessId":"0","businessName":"金融公司","customerId":"43bcace7ffed404284c51664c7489abc","customerName":"旭辉","loginName":"yanxuhui"},{"businessId":"4","businessName":"其他","customerId":"4434786799564864b21131a624ae76b7","customerName":"成本核算账号","loginName":"testMoney"},{"businessId":"0","businessName":"金融公司","customerId":"447d0c5ca505438a91399671f1cea2ea","customerName":"泽维","loginName":"zewei"},{"businessId":"0","businessName":"金融公司","customerId":"4482b6e76c8645669a790b9b351e4e70","customerName":"授权二期","loginName":"shouquan"},{"businessId":"0","businessName":"金融公司","customerId":"44a42f725fa443efa325db4a82add073","customerName":"泛舟科技","loginName":"fanzhou"},{"businessId":"0","businessName":"金融公司","customerId":"45851922de8c46a0a4246af8091faeab","customerName":"口袋理财","loginName":"koudai"},{"businessId":"1","businessName":"数据公司","customerId":"45dd35238416426bbf433983b815f925","customerName":"上海三零卫士信息安全有限公司","loginName":"sanlingweishi"},{"businessId":"0","businessName":"金融公司","customerId":"46166be5de4442bc9e711d1855743c93","customerName":"博雅诚信","loginName":"boyachengxin"},{"businessId":"0","businessName":"金融公司","customerId":"46613a0e56ea44ccb2d4fbca6df958ab","customerName":"安硕","loginName":"安硕"},{"businessId":"0","businessName":"金融公司","customerId":"4671e645941f4d61ac664c999da60250","customerName":"上海极火网络科技公司","loginName":"jihuo"},{"businessId":"0","businessName":"金融公司","customerId":"4688b3b2001242d7befa693df85ed0f3","customerName":"王刚","loginName":"wanggang"},{"businessId":"0","businessName":"金融公司","customerId":"469dd3b2a9744a138e146a4e00fa3b93","customerName":"沃耀数据科技有限公司","loginName":"woyaoshuju"},{"businessId":"0","businessName":"金融公司","customerId":"46d801c3e4d247fb946379c9d3e9d4be","customerName":"安之若素","loginName":"anzhiruosu"},{"businessId":"0","businessName":"金融公司","customerId":"46e1c1efc068465b86ae198f0504811a","customerName":"贵州智行天下","loginName":"zhixingtianxia"},{"businessId":"0","businessName":"金融公司","customerId":"473f435797c646e091554019a2553a54","customerName":"亚联世纪","loginName":"yalianshiji"},{"businessId":"1","businessName":"数据公司","customerId":"4758f679f1c040ff9352fa258d15b10e","customerName":"普惠数据","loginName":"puhuishuju"}]
    }
  },
  methods: {
    toggleExp(e) {
      this.toggleExpandFoldFlag = !this.toggleExpandFoldFlag
    },
    searchClick (v, e) {
      this.selectedId = v.customerId
      if (!this.isMultiple) { // 单选
        this.toggleExpandFoldFlag = !this.toggleExpandFoldFlag
        this.selectedValue = v.customerName
      } else { // 多选
        let currentClass = e.target.className
        if (currentClass.indexOf('active') < 0) {
          e.target.className = currentClass + ' active'
          this.selectedArr.push(v.customerName)
        } else {
          this.selectedArr.splice(this.selectedArr.indexOf(v.customerName))
          e.target.className = currentClass.replace(' active', '')
        }
        currentClass = ''
        this.selectedValue = this.selectedArr.join(',')
      }
    },
    searchItem () {
      arr.forEach((v, k) => {

      })
    },
    selectWay (way) { //全选
      this.selectOption = way
      let lis = document.querySelectorAll('.dropdown-item.text-warp')
      if (way === 'selectAll') { // 全选
        lis.forEach((v, k) => {
          if (v.className.indexOf('active') < 0) {
            v.className += ' active'
          }
        })
      } else if (way === 'selectInverse') { // 反选
        lis.forEach((v, k) => {
           if (v.className.indexOf('active') > 0) {
              v.className = v.className.replace(' active', '')
          } else {
            v.className += ' active'
          }
        })
       
      } else { // 全不选
        lis.forEach((v, k) => {
           if (v.className.indexOf('active') > 0) {
              v.className = v.className.replace(' active', '')
          }
        })
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  .search-item 
    position relative
    display block
    width calc(28.5% - 100px)
    height 40px
    line-height 40px
    margin 5px 3% 5px 0
    float left
    padding 0 20px 0 95px
    .input-label
      position absolute
      display block
      top 0
      left 0
      width 100px
    .select-dropdown 
      position relative
      display inline-block
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
        top 100%
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
          height 30px
          line-height 30px
          cursor pointer
          color #515a6e
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
      display inline-block
      padding 0 10px
      height 30px
      line-height 30px
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
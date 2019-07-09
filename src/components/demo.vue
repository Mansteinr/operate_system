<template>
  <div> 
    <h1>页面熏染：{{this.$store.state.count}}</h1>
    <h1>页面getters：{{this.$store.getters.getStateCount}}</h1>

    <p>count值：{{count}}</p>
    <button @click="addFun">增加</button>
    <button @click="reductionFun">减少</button>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'count'
    ])
  },
  methods: {
    addFun () {
      addFun.dispatch('addFun')
    },
    reductionFun () {
      reductionFun.dispatch('reductionFun', 2)
    },
    ...mapActions({ // 修改mutation 拿到定义在mutations里面的修改函数
      addFun: 'addFun',
      reductionFun: 'reductionFun'
    })
  },
}
</script>
<style lang="stylus" scoped>
  div
    background #fff
    padding 10px
    height 100%
    h1,button,p
      font-size 32px
      text-align center
      margin-top 100px
</style>
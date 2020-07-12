<template>
  <div class="template-wrapper">
    <my-form></my-form>
    <!-- <m-form></m-form> -->
  </div>
</template>
<script>
// import MForm from '@/components/Form'
import MyForm from '@/components/MyForm'
export default {
  data() {
    return {
    }
  },
  components: {
    // MForm,
    MyForm
  }
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
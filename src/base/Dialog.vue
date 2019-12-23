<template>
  <el-dialog
    :title="title"
    custom-class="customize-dialog"
    :visible.sync="dialogShow"
    :width="width"
    @opened="opened"
    :close-on-click-modal="isClickModal"
    :before-close="handleClose">
    <slot></slot>
    <div class="dialog-button-group" v-show="isShowButton">
      <el-button @click.native.stop="determine" v-show="showDetermine" size="small" type="primary">{{primaryText}}</el-button>
      <el-button @click.native="cancel" size="small">{{subText}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      isClickModal: { // 点击背景是否关闭
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        default: '新增'
      },
      primaryText: {
        type: String,
        default: '确定'
      },
      subText: {
        type: String,
        default: '取消'
      },
      dialogShow: {
        type: Boolean,
        default: false
      },
      width: {
        type: String,
        default: '50%'
      },
      isShowButton: {
        type: Boolean,
        default: false
      },
      showDetermine: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      opened() {
        this.$emit('opened')
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      determine () {
        this.$emit('determine', false)
      },
      cancel () {
        this.handleClose()
      }
    }
  }

</script>

<style lang="stylus" scoped>
</style>
<template>
  <el-dialog
    :title="title"
    custom-class="customize-dialog"
    :visible.sync="dialogVisible"
    :close-on-click-modal="isClickModal"
    :before-close="handleClose">
    <slot></slot>
    <div class="dialog-button-group">
      <el-button @click.native.stop="determine" size="small" type="primary">{{primaryText}}</el-button>
      <el-button @click.native="cancel" size="small">{{subText}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      isClickModal: {
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
      dialogVisible: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleClose() {
        this.$emit('closeDialog', false)
      },
      determine () {
        // this.handleClose()
        this.$emit('determine', false)
      },
      cancel () {
        this.handleClose()
      }
    }
  }

</script>
<template>
  <div>
    <el-button class="query-button ml" type="primary" @click.native.stop="onSubmit">{{ submitText }}</el-button>
    <el-button class="query-button" v-show="cancelBtn" type="success" @click="reset">重置</el-button>
  </div>
</template>
<script>
  export default {
    props: {
      cancelBtn: {
        type: Boolean,
        default: true
      },
      submitText: {
        type: String,
        default: '查询'
      }
    },
    data () {
      return {
        
      }
    },
    methods: {
      onSubmit () {
        this.$emit('submit')
      },
      reset () {
        this.$emit('reset')
      }
    }
  }
</script>
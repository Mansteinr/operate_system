<template>
  <div>
    <el-button class="query-button ml" type="primary" @click.native.stop="onSubmit">查询</el-button>
    <el-button class="query-button" type="success" @click="reset">重置</el-button>
  </div>
</template>
<script>
  export default {
    data () {
      return {}
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
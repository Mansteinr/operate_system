<template>
  <div>
    <input :type="type" :value="inputValue" @input="handleInput">
  </div>
</template>

<script>
  export default {
    data() {
      return {
        inputValue: this.value
      }
    },
    props: {
      type: {
        type: String,
        default: 'text'
      },
      value: {
        type: String,
        default: ''
      }
    },
    methods: {
      handleInput(e) {
        // 实现双向数据绑定
        this.inputValue = e.target.value
        this.$emit('input', this.inputValue)
        console.log(this.inputValue, 'this.inputValue')
        // 通知父组件更新
        this.$parent.$emit('validate', this.inputValue)
      }
    }
  }
</script>

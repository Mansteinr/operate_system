<template>
  <div>
    <label v-if="label">{{ label }}</label>
    <slot></slot>
    <p v-if="validateStatus === 'error'" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
// 绑定label和props
// 1.获取当前输入框的规则
// 2.如果输入框和rule不匹配，显示错误信息
// 3。Input组件输入内容时，通知FormItem做检验
import schema from 'async-validator'
  export default {
    data() {
      return {
        validateStatus: '',
        errorMessage: ''
      }
    },
    inject: ['form'],
    mounted () {
      if(this.prop) { // 必须判断 应为Form的子组件可以不说FormItem
        this.$parent.$emit('formItemAdd', this)
      }
    },
    methods: {
      validate(value) {
        return new Promise(resolve => {
        console.log(value, 'valuevalue')
             // value 输入框的值
        // console.log(value)
        // // 获取校验对象 ==》 Form组件对象 ==》 Rules[this.prop]
        // console.log(this.form.rules)
        // console.log(this.prop)
        // let descriptor = {}, // 此对象存储校验规则
        //     obj = {}
        // descriptor[this.prop] = this.form.rules[this.prop]

      // 上面可以简写
          const descriptor = {
            [this.prop]: this.form.rules[this.prop]
          },
          validator = new schema(descriptor)
          
          validator.validate({[this.prop]: value}, errors => {
            console.log('errors')
            console.log(errors)
            if(errors) {
              // 显示错误
              this.validateStatus = 'error'
              this.errorMessage = errors[0].message
              resolve(false)
            } else {
              this.validateStatus = ''
              this.errorMessage = ''
              resolve(true)
            }
          })
        })
      }
    },
    created () {
      this.$on('validate', this.validate);
    },
    props: {
      label: {
        type: String,
        default: '' 
      },
      prop: {
        type: String,
        default: '' 
      }
    },
  }
</script>

<style lang="stylus" scoped>
.error
  color red
</style>
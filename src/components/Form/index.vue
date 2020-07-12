<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
// 声明props 获取数据模型和校验规则
  export default {
    provide() {
      return {
        'form': this
      }
    },
    props: {
      model: {
        type: Object,
        required: true
      },
      rules: {
        type: Object,
        required: true
      }
    },
    created () {
      // 缓存需要校验的表单项
      this.fileds = []
      this.$on('formItemAdd', item => {
        this.fileds.push(item)
      })
    },
    methods: {
      validate(callback) {
        // 获取所有的验证结果 统一处理 
        // tasks保存验证之后多个promise对象
        let ret = true
        const tasks = this.fileds.map(item => item.validate())
        console.log(tasks, 'tasks')
        Promise.all(tasks).then(results => {
          results.forEach(valid => {
            if(!valid) {
              ret = false
            }
          })
          callback(ret)
        })
      }
    },
  }
</script>

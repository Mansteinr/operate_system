<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container">
        <el-form :inline="true" :rules="rules" ref="querForm" :model="queryParams" class="query-form">
          <el-form-item label="guid：" prop="guid">
            <el-input v-model="queryParams.guid" placeholder="请输入guid"></el-input>
          </el-form-item>
          <el-form-item class="query-item">
           <query-button @reset="reset" @submit="onSubmit"></query-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="card-wrapper card-content">
      <div class="card-title">
        查询结果
      </div>
      <div class="card-container">
        <JsonEditor :json="json"></JsonEditor>
      </div>
    </div>
  </div>
</template>

<script>
import $http from '../../common/js/ajax'
import JsonEditor from '../../base/JsonEditor'
import QueryButton from '../../base/QueryButton'
export default {
  data () {
    let guidRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('guid不能为空'));
      } else {
        callback()
      }
    }
    return {
      rules: {
        guid: [{ validator: guidRule, trigger: 'change' },]
      },
      queryParams: {
        guid: ''
      },
      json: {}
    }
  },
  components: {
    JsonEditor,
    QueryButton
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
    },
    onSubmit () {
      this.$refs.querForm.validate((valid) => {
        if (valid) {
         this.logDetail()
        }
      })
    },
    logDetail () {
      $http(this.API.upApi.logDetail, this.queryParams).then((res) => {
        this.json = res.resData
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

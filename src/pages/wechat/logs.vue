<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container">
        <el-form :inline="true" :rules="rules" ref="querForm" :model="queryParams" class="query-form">
          <el-form-item label="trackId：" prop="trackId" style="width: 45%;">
            <el-input v-model="queryParams.trackId" placeholder="请输入trackId"></el-input>
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
        <div v-show="!showFlag" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <JsonEditor v-show="showFlag" :data="json"></JsonEditor>
      </div>
    </div>
  </div>
</template>

<script>
import { $http } from '../../common/js/ajax'
import JsonEditor from '../../base/JsonEditor'
import QueryButton from '../../base/QueryButton'
export default {
  data () {
    let guidRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('trackId不能为空'));
      } else {
        callback()
      }
    }
    return {
      rules: {
        guid: [{ validator: guidRule, trigger: 'change' },]
      },
      showFlag: false,
      queryParams: {
        trackId: ''
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
      $http(this.API.wechatAPI.trackQuery, this.queryParams).then((res) => {
        this.showFlag = true
        this.json = res.resData || {}
      })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

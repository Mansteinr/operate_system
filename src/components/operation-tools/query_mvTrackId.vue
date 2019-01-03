<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container clearfix">
        <el-form :inline="true" :rules="rules" ref="querForm" :model="queryParams" class="query-form">
          <el-form-item label="mvTrackId：" prop="mvTrackId" class="mvTrackId">
            <el-input v-model="queryParams.mvTrackId" placeholder="请输入mvTrackId"></el-input>
          </el-form-item>
          <el-form-item label="选择日期：" prop="date">
              <div class="block">
                <el-date-picker
                  v-model="queryParams.date"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </el-form-item>
          <el-form-item label="客户名称：" prop="loginName">
            <el-select filterable v-model="queryParams.loginName" placeholder="请选择">
              <el-option
                v-for="v in loginName"
                @click.native.stop="changeCustomer(v)"
                :key="v.customerId"
                :title="`${v.customerName}(${v.loginName})`"
                :data-customerid="v.customerId"
                :label="v.customerName"
                :value="v.loginName">
              </el-option>
            </el-select>
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
        <JsonEditor ref="JsonEditor"></JsonEditor>
      </div>
    </div>
  </div>
</template>

<script>
import $http from '../../common/js/ajax'
import JsonEditor from '../../base/JsonEditor'
import QueryButton from '../../base/QueryButton'
import { loginName } from '../../common/js/mixin'
export default {
  mixins: [ loginName ],
  data () {
    let guidRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('mvTrackId不能为空'));
      } else {
        callback()
      }
    }
    let dateRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('日期不能为空'));
      } else {
        callback()
      }
    }
    return {
      rules: {
        mvTrackId: [{ validator: guidRule, trigger: 'change' }],
        date: [{ validator: dateRule, trigger: 'change' }]
      },
      queryParams: {
        mvTrackId: '',
        date: ''
      },
      noAllLogin: true,
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
         this.logByMvTrackId()
        }
      })
    },
    logByMvTrackId () {
      $http(this.API.upApi.logByMvTrackId, this.queryParams).then((res) => {
        this.$refs.JsonEditor.renderJson(res.resData)
      })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
  .mvTrackId
    label
      padding-right 0 !important
</style>

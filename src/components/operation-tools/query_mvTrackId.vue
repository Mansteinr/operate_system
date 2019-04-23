<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container clearfix">
        <el-form :inline="true" :rules="rules" ref="querForm" :model="queryParams" class="query-form">
          <el-form-item label="选择日期：" prop="date">
            <div class="block">
              <el-date-picker
                v-model="queryParams.date"
                type="date"
                :name='"date"'
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="mvTrackId：" prop="mvTrackId" class="mvTrackId">
            <el-input v-model="queryParams.mvTrackId" :name="'mvTrackId'" placeholder="请输入mvTrackId"></el-input>
          </el-form-item>
          <loginNameSelect 
            :labelTitle="'客户名称'" 
            :originArr="loginName" 
            :defaultValue="'loginName'" 
            :defaultLable="'customerName'"
            :searchInput="true">
          </loginNameSelect>
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
        <div v-show="!tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <Table :columns="columns" ref="table" :tableData="tableData" :showSummary="false" :tatalPage="tableData.length" v-show="tableData.length">
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import Table from '../../base/Table'
import { $http } from '../../common/js/ajax'
import loginNameSelect from '../../base/Select'
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
        date: new Date()
      },
      tableData: [],
      columns: [{ // 定义table
        prop: 'guid',
        width: "270px",
        label: 'guid'
      }, {
        prop: 'status',
        label: '状态'
      }, {
        prop: 'result',
        label: 'result'
      }, {
        prop: 'message',
        label: '信息'
      }, {
        prop: 'resultCode',
        label: 'resultCode'
      }, {
        prop: 'resultMsg',
        label: '详细信息'
      }]
    }
  },
  components: {
    Table,
    QueryButton,
    loginNameSelect
  },
  methods: {
    reset () {
      // 重置
      this.$refs.querForm.resetFields()
    },
    onSubmit () {
      // 组装参数
      let options = {}
      this.$refs.querForm.$el.querySelectorAll('input').forEach(v => {
        if (v.name === 'date') {
          options[v.name] = v.value.replace(/-/g, "")
        } else {
          options[v.name] = v.value.replace(/(^\s*)|(\s*$)/g, "")
        }
      })
      this.logByMvTrackId(options)
    },
    logByMvTrackId (options) { // 发送请求
      $http(this.API.upApi.logByMvTrackId, options).then((res) => {
        this.tableData = [] // 清空数据
        this.tableData.push(res.resData)
        console.log(this.tableData)
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

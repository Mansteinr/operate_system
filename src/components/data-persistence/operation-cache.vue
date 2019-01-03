<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container clearfix">
        <el-form :inline="true" ref="querForm" :model="queryParams" class="query-form">
          <el-form-item label="接口类型：" prop="serviceName">
            <el-select filterable v-model="queryParams.serviceName" placeholder="请选择">
              <el-option
                v-for="v in services"
                :key="v.serviceId"
                :title="`${v.serviceNameZh}(${v.serviceName})`"
                :label="v.serviceNameZh"
                @click.native="changeServices(v)"
                :value="v.serviceName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-for="(v, key) in paramsArr" :label="`${v.paramNameCh}：`" :title="`${v.paramNameCh}(${v.paramName})`" :key="key">
            <el-input
              :placeholder="`请选${v.paramNameCh}`"
              :name="v.paramName">
            </el-input>
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
        <div v-show="!tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <Table ref="table" class="table" :showSummary="false" :tableData="tableData" :tatalPage="tableData.length" v-show="tableData.length">
          <el-table-column
            label="结果"
            width="80"
            prop="rsp.MESSAGE">
          </el-table-column>
          <el-table-column
            label="状态"
            width="100"
            prop="rsp.RESULT">
          </el-table-column>
          <el-table-column
            label="数据源"
            sortable
            prop="tail.dataSource">
          </el-table-column>
          <el-table-column
            label="缓存时间"
            width="200"
            :formatter="formatter"
            prop="tail.cacheTime">
          </el-table-column>
          <el-table-column
            label="guid"
            prop="tail.guid">
          </el-table-column>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import $http from '../../common/js/ajax'
import { services } from '../../common/js/mixin'
import Table from '../../base/Table'
import QueryButton from '../../base/QueryButton'
export default {
  mixins: [services],
  data () {
    return {
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
        loginName: '',
        serviceName: '',
        type: ''
      },
      tableData: [],
      paramsArr: []
    }
  },
  components: {
    Table,
    QueryButton
  },
  mounted() {
    setTimeout(() => {
      this.queryParamsByServiceName(this.services[0])
    }, 500)
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
      this.queryParams.serviceName = this.services[0].serviceName
    },
    onSubmit () {
      this.$refs.querForm.validate((valid) => {
        if (valid) {
         this.logByMvTrackId()
        }
      })
    },
    formatter (val) {
      return this.$refs.table.formatterTime(val.tail.cacheTime)
    },
    changeServices (v) {
      this.queryParamsByServiceName(v)
    },
    queryParamsByServiceName (v) {
      let op = {
        serviceId: v.serviceId,
        serviceName: v.serviceName,
        serviceNameZh: v.serviceNameZh
      }
      $http(this.API.paramsApi.queryParamsByServiceName, op).then((res)=>{
        this.paramsArr = res.resData.paramNameBeans
      })
    },
    logByMvTrackId () {
      let options = {}, inputs = Array.from(this.$refs.querForm.$el.getElementsByTagName('input'))
      options = {
        serviceName: this.queryParams.serviceName
      }
      if (inputs.length) {
        options.params = {}
        inputs.forEach(v => {
          console.log(v.name)
          if (v.name) {
            options.params[v.name] = v.value
          }
        })
      }
      $http(this.API.redisApi.query, options).then((res) => {
        this.tableData.push(res.resData)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

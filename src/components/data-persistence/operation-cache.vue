<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container clearfix">
        <el-form :inline="true" ref="querForm" :model="queryParams" class="query-form">
          <serviceSelect 
            :labelTitle="'接口类型'" 
            :originArr="services" 
            :defaultValue="'serviceName'" 
            :searchInput = "true"
            :needValue = "'serviceId'"
            @changeInputValue="chooseService"
            :defaultLable="'serviceNameZh'">
          </serviceSelect>
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
        <Table ref="table" :columns="column" :showSummary="false" :tableData="tableData" :tatalPage="tableData.length" v-show="tableData.length">
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Table from '../../base/Table'
import { $http } from '../../common/js/ajax'
import { services } from '../../common/js/mixin'
import QueryButton from '../../base/QueryButton'
import serviceSelect from '../../base/Select'
import DialogVue from '../../base/Dialog.vue';

export default {
  mixins: [services],
  data () {
    return {
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
      },
      tableData: [],
      column: [{
        prop: 'rsp.MESSAGE',
        width: '50px',
        label: '结果'
      }, {
        prop: 'rsp.RESULT',
        width: '50px',
        label: '状态'
      }, {
        prop: 'tail.dataSource',
        width: '440px',
        label: '数据源'
      }, {
        prop: 'tail.cacheTime',
        formatter: row => {
          return moment(row.tail.cacheTime).format('YYYY-MM-DD HH:mm:ss')
        },
        label: '缓存时间'
      }, {
        prop: 'guid',
        label: 'guid'
      },{
        prop: [{keyWord: '删除', method: 'delete'}, {keyWord: '编辑', method: 'editor'}],
        width: '120px',
        label: '操作'
      }],
      paramsArr: []
    }
  },
  components: {
    Table,
    QueryButton,
    serviceSelect
  },
  watch: {
    services () {
      this.$nextTick(() => {
        setTimeout(() => {
          this.chooseService(this.services[0])
        }, 100)
      })
    }
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
    },
    onSubmit () {
      let options = {}, params = {}
      this.$refs.querForm.$el.querySelectorAll('input').forEach(v => {
        if (!v.name) return
        if (v.name == 'serviceName') {
          options[v.name] = v.value
        } else {
          params[v.name] = v.value.replace(/(^\s*)|(\s*$)/g, '')
        }
      })
      options.params = params
      this.logByMvTrackId(options)
    },
    // formatter (val) {
    //   return this.$refs.table.formatterTime(val.tail.cacheTime)
    // },
    chooseService (v) {
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
    logByMvTrackId (options) {
      $http(this.API.redisApi.query, options).then((res) => {
        res.resData.guid = res.resData.tail.guid
        this.tableData.push(res.resData)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

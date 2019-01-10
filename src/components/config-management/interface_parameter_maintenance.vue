<template>
  <div class="template-wrapper">
    <div class="card-wrapper card-content">
      <div class="card-title">
        查询结果
      </div>
      <div class="card-container">
        <el-button type="primary" icon="el-icon-plus" size="small" @click.native="addItem">新增</el-button>
        <div v-show="!tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <Table ref="table" class="table" :showSummary="false" :tableData="tableData" :tatalPage="tableData.length" v-show="tableData.length">
          <el-table-column
            label="服务名"
            prop="serviceName">
          </el-table-column>
          <el-table-column
            label="服务名(中文)"
            prop="serviceNameCh">
          </el-table-column>
          <el-table-column
            label="参数"
            prop="paramNameBeans">
            <template slot-scope="scope">
              <div v-html="formatterParams(scope.row.paramNameBeans)"></div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </Table>
      </div>
    </div>
    <Dialog :dialogVisible="dialogVisible" @closeDialog="closeDialog" @determine="determine" :isClickModal="false">
      <el-form  :model="queryParams">
        <el-form-item label="接口类型：" >
          <el-select  filterable placeholder="请选择" v-model="queryParams.serviceName">
            <el-option
              v-for="(v, index) in services"
              :key="index"
              @click.native="selecteService(v)"
              :title="`${v.serviceNameZh}(${v.serviceName})`"
              :label="v.serviceNameZh"
              :value="v.serviceName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数：" >
          <el-select  filterable multiple collapse-tags placeholder="请选择" v-model="queryParams.paramNameBeans">
            <el-option
              v-for="(v, index) in allParams"
              :key="index"
              :title="`${v.paramNameCn}(${v.paramNameEn})`"
              :label="v.paramNameCn"
              :value="v.paramNameEn">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import { $http } from '../../common/js/ajax'
import Table from '../../base/Table'
import Dialog from '../../base/Dialog'
import { services, getParam } from '../../common/js/mixin'
import { showModal } from '../../utils'
export default {
  mixins: [ services, getParam ],
  data () {
    return {
      queryParams: {
        serviceName: '',
        paramNameBeans: []
      },
      dialogVisible: false,
      tableData: [],
      paramNameBeans: [],
      options: {}
    }
  },
  components: {
    Table,
    Dialog
  },
  mounted() {
    this.getAll()
  },
  methods: {
    initFun () {
      this.addServiceNameAndParams()
    },
    closeDialog (val) {
      this.dialogVisible = val
    },
    formatter (val) {
      return this.$refs.table.formatter(val)
    },
    formatterParams (val) { // 参数展示
      var html = ''
      if (!val.length) return
      val.forEach( v=> {
        html += `<span class="param-item" title="${v.paramName}">${v.paramNameCh} : ${v.paramName} </span>`
      })
      return html
    },
    addItem () {
      this.dialogVisible = true
    },
    handleDelete(row) {
      let options = {}
      Object.assign(options, row)
      $http(this.API.paramsApi.deleteByServiceNameAndParamName, options).then((res) => {
        showModal(res.resMsg[0].msgText)
        this.getAll()
      })
    },
    determine () {
      if (!this.queryParams.paramNameBeans.length) {
        showModal('请选择参数', 'warning')
        return
      }
      this.paramNameBeans = []
      this.queryParams.paramNameBeans.forEach(v => {
        this.allParams.forEach(v1 => {
          if (v === v1.paramNameEn) {
            this.paramNameBeans.push({
              paramNameCh: v1.paramNameCn,
              paramName: v1.paramNameEn
            })
          }
        })
      })
      this.addServiceNameAndParams()
    },
    selecteService (val) {
      this.options = {
        serviceNameCh: val.serviceNameZh,
        serviceName: val.serviceName
      }
    },
    addServiceNameAndParams () {
      let options = {}
      if (!this.options.serviceName || !this.options.serviceNameCh) {
        this.selecteService(this.services[0])
      }
      Object.assign(options, this.options)
      options.paramNameBeans = []
      options.paramNameBeans = [...options.paramNameBeans, ...this.paramNameBeans]
      if (!options.paramNameBeans.length) {
        showModal('请选择参数', 'warning')
        return
      }
      $http(this.API.paramsApi.addServiceNameAndParams, options).then((res) => {
        showModal(res.resMsg[0].msgText)
      })
    },
    getAll () {
      $http(this.API.paramsApi.getAll, {}).then((res) => {
        this.tableData = res.resData
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

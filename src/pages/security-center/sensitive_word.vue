<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询结果
      </div>
      <div class="card-container">
        <el-button type="primary" icon="el-icon-plus" size="small" @click.native="addItem">新增</el-button>
        <div v-show="!tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <Table ref="table" :showSummary="false" :tableData="tableData" :tatalPage="tableData.length" v-show="tableData.length">
          <el-table-column
            label="敏感词"
            width="160"
            prop="wordKey">
            <template slot-scope="scope">
              <span :class="scope.row.serviceParams.length > 4 ? 'link':''">{{scope.row.wordKey}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="描述信息"
            width="200"
            prop="wordDes">
          </el-table-column>
          <el-table-column
            label="更新时间"
            width="160"
            prop="updateTime">
          </el-table-column>
          <el-table-column
            label="参数"
            prop="serviceParams">
            <template slot-scope="scope">
              <div v-html="formatterParams(scope.row.serviceParams)"></div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
              <el-button @click="handleEditor(scope.row)" type="text" size="small">更新</el-button>
            </template>
          </el-table-column>
        </Table>
      </div>
    </div>
    <Dialog 
    ref="dialog"
    :isShowButton="true"
    @determine="determine"
    :dialogShow="dialogShow"
    @handleClose="handleClose"
    :isClickModal="false">
      <el-form :rules="rules" :model="queryParams" ref="ruleForm">
        <el-form-item label="敏感词：" prop="wordKey">
          <el-input :disabled="!isAddFlg" v-model="queryParams.wordKey"></el-input>
        </el-form-item>
        <el-form-item label="敏感词描述：" prop="wordDes">
          <el-input v-model="queryParams.wordDes"></el-input>
        </el-form-item>
        <Select 
          v-if="dialogShow"
          :labelTitle="'接口类型'" 
          :originArr="serviceArr" 
          :defaultValue="'serviceName'" 
          :defaultLable="'serviceNameZh'"
          @changeInputValue="changeService"
          :searchInput="true"> 
        </Select>
        <Select 
          v-if="dialogShow" 
          :labelTitle="'关联参数'" 
          :originArr="params" 
          :defaultValue="'paramName'" 
          :defaultLable="'paramNameCh'"
          :searchInput="true"
          @changeInputValue="changeParam"> 
        </Select>
        <el-form-item label="参数："  class="dialog-param has-norequire">
          <div v-for="(v, k) in selectedObj" :key="k" @click="deletParam(v,k)" class="dialog-param-item">
            {{k}} : {{v}}
            <i class="el-icon-delete"></i>
          </div>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
/**
 * 后台对接人 马超重
 * 
 * 新增修改敏感词时 可以一个敏感词对应多个服务 但是每个服务只能对应一个参数
 * 修改的时候 敏感不允许修改
 */
import Table from '../../base/Table'
import Select from '../../base/Select'
import Dialog from '../../base/Dialog'
import { showModal } from '../../utils'
import { $http } from '../../common/js/ajax'
import { services } from '../../common/js/mixin'
export default {
  mixins: [ services ],
  data () {
    return {
      rules: {
        wordKey: [
          { required: true, message: '请输入敏感词', trigger: 'blur' }
        ],
        wordDes: [
          { required: true, message: '请输入敏感词描述', trigger: 'blur' }
        ],
        serviceName: [
          { required: true, message: '请输入敏感词描述', trigger: 'blur' }
        ],
      },
      queryParams: {
        wordDes: '',
        wordKey: '',
      },
      params: [],
      tableData: [],
      isAddFlg: true, // 新增和更新参数接口都是同一个 以此来区分
      serviceArr: [], // 所有服务
      serviceParams: [], // 根据服务名称 查询对应的参数
      dialogShow: false,
      selectedObj: {} // 一个服务名对应一个参数
    }
  },
  components: {
    Table,
    Dialog,
    Select
  },
  mounted() {
    this.allWords()
  },
  methods: {
    handleClose (val) { // 隐藏对话框
      this.dialogShow = val
    },
    resetTable() {
      this.$refs.ruleForm.resetFields()
    },
    changeService (val) {
      this.queryParamsByServiceName({
        serviceName: val.serviceName,
        serviceNameZh: val.serviceNameZh
      })
    },
    changeParam (val) {
      let service = document.querySelector('[name="serviceName"]').value
      this.selectedObj = {...this.selectedObj, ...{
        [service]: val.paramName
      }}
    },
    formatterParams (val) { // 参数展示
      var html = ''
      if (!val.length) return
      val.forEach( v=> {
        html += `<span class="param-item" title="${v.serviceName}: ${v.paramName}">${v.serviceName} : ${v.paramName} </span>`
      })
      return html
    },
    addItem () { // 新增敏感词
      this.dialogShow = true
      this.isAddFlg = true
      // 清空数据 防止干扰
      this.serviceArr = []
      this.serviceParams = []
      this.selectedObj = {}
      this.queryParams.wordKey = ''
      this.queryParams.wordDes = ''
      this.queryParams.wordId = ''
      setTimeout(() => {
        this.serviceArr = [...this.serviceArr,...this.services]
        this.queryParamsByServiceName({
          serviceName: this.serviceArr[0].serviceName,
          serviceNameZh: this.serviceArr[0].serviceNameZh
        })
      }, 100)
    },
    // 删除敏感词
    handleDelete(row) {
      let options = {
        wordId: row.wordId
      }
      this.$confirm('确定删除改敏感词?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        center: true
      }).then(() => {
        $http(this.API.secureApi.wordDelete, options).then((res) => {
          showModal(res.resMsg[0].msgText)
          this.allWords()
        })
      })
    },
    handleEditor (row) { // 修改
      this.dialogShow = true
      this.isAddFlg = false
      this.queryParams.wordKey = row.wordKey
      this.queryParams.wordDes = row.wordDes
      this.queryParams.wordId = row.wordId
      this.selectedObj = {}

      if (row.serviceParams.length) {
        row.serviceParams.forEach(v => {
          this.selectedObj[v.serviceName] = v.paramName
        })
      }
      setTimeout(() => {
        this.serviceArr = [...this.serviceArr,...this.services]
        this.queryParamsByServiceName({
          serviceName: this.serviceArr[0].serviceName,
          serviceNameZh: this.serviceArr[0].serviceNameZh
        })
      }, 100)
    },
    // 确定
    determine () {
      let options = {}, serviceParams = []// 组装参数
      for (let k in this.selectedObj) {
        serviceParams.push({
          serviceName: k,
          paramName: this.selectedObj[k],
        })
      }
      options.serviceParams = serviceParams
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.insertWord(Object.assign(this.queryParams, options))
        } else {
          return false
        }
      })
    },
    queryParamsByServiceName (v) {
      $http(this.API.paramsApi.queryParamsByServiceName, v).then((res) => {
        this.params = []
        this.params = res.resData.paramNameBeans
      })
    },
    // 新增  修改
    insertWord (options) {
      $http(this.API.secureApi[this.isAddFlg?'wordInsert':'wordUpdate'], options).then((res) => {
        showModal(res.resMsg[0].msgText)
        this.allWords()
        this.dialogShow = false
        this.serviceParams = []
        this.selectedObj = {}
      })
    },
    // 获取所有的敏感词
    allWords () {
      $http(this.API.secureApi.allWords, {}).then((res) => {
        this.tableData = res.resData
      })
    },
    // 删除已选的服务和参数
    deletParam (item, key) {
      delete this.selectedObj[key]
      // 强制刷新
      this.$forceUpdate()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  .el-dialog__body
    height calc(100% - 54px) !important
    background red
    .search-item
      width calc(100% - 145px) !important
      margin-bottom 10px
      margin-top 10px
      float none
      padding: 0 20px 0 125px
    .dialog-button-group
      bottom 10px
</style>

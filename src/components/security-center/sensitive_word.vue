<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询结果
      </div>
      <div class="card-container">
        <el-button type="primary" icon="el-icon-plus" size="small" @click.native="addItem">新增</el-button>
        <div v-show="!tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <Table ref="table" class="table" :showSummary="false" :tableData="tableData" :tatalPage="tableData.length" v-show="tableData.length">
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
    <Dialog :dialogVisible="dialogVisible" @closeDialog="closeDialog" @determine="determine" :isClickModal="false">
      <el-form :rules="rules" :model="queryParams" ref="ruleForm">
        <el-form-item label="敏感词：" prop="wordKey">
          <el-input v-model="queryParams.wordKey"></el-input>
        </el-form-item>
        <el-form-item label="敏感词描述：" prop="wordDes">
          <el-input v-model="queryParams.wordDes"></el-input>
        </el-form-item>
        <el-form-item label="接口类型：" class="has-norequire">
          <el-select  filterable placeholder="请选择" v-model="queryParams.serviceName" prop="serviceName">
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
        <el-form-item label="关联参数：" class="has-norequire">
          <el-select  filterable collapse-tags placeholder="请选择" @change="changeParam" v-model="queryParams.serviceParam" prop="serviceParam">
            <el-option
              v-for="(v, index) in serviceParams"
              :key="index"
              :title="`${v.paramName}(${v.paramNameCh})`"
              :label="v.paramNameCh"
              :value="v.paramName">
            </el-option>
          </el-select>
        </el-form-item>
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
import { $http } from '../../common/js/ajax'
import Table from '../../base/Table'
import Dialog from '../../base/Dialog'
import { services } from '../../common/js/mixin'
import { showModal } from '../../utils'
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
        serviceName: '',
        wordDes: '',
        wordKey: '',
        serviceParam: ''
      },
      dialogVisible: false,
      tableData: [],
      serviceParams: [],
      selectedObj: {},
      isAddFlg: true,
      wordId: ''
    }
  },
  components: {
    Table,
    Dialog
  },
  mounted() {
    this.allWords()
  },
  methods: {
    resetTable() {
      this.$refs.ruleForm.resetFields()
    },
    closeDialog (val) {
      this.dialogVisible = val
    },
    formatterParams (val) { // 参数展示
      var html = ''
      if (!val.length) return
      val.forEach( v=> {
        html += `<span class="param-item" title="${v.serviceName}: ${v.paramName}">${v.serviceName} : ${v.paramName} </span>`
      })
      return html
    },
    addItem () {
      this.dialogVisible = true
      this.isAddFlg = true
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
    handleEditor (row) {
      this.dialogVisible = true
      this.isAddFlg = false
      this.queryParams.wordKey = row.wordKey
      this.queryParams.wordDes = row.wordDes
      this.wordId = row.wordId
      this.selectedObj = {}
      if (row.serviceParams.length) {
        row.serviceParams.forEach(v => {
          this.selectedObj[v.serviceName] = v.paramName
        })
      }
      this.$forceUpdate()
    },
    // 确定
    determine (val) {
      if (!Object.getOwnPropertyNames(this.selectedObj).length) {
        showModal('请选择参数', 'warning')
        return
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isAddFlg) {
            this.insertWord(val)
          } else {
            this.updatetWord(val)
          }
        } else {
          return false
        }
      })
    },
    selecteService (v) {
      $http(this.API.paramsApi.queryParamsByServiceName, v).then((res) => {
        this.serviceParams = []
        this.serviceParams = res.resData.paramNameBeans
      })
    },
    updatetWord (val) {
      this.insertWord(val)
    },
    // 新增
    insertWord (val) {
      let options = {}, serviceParams = []

      options.wordDes = this.queryParams.wordDes
      options.wordKey = this.queryParams.wordKey

      for (let k in this.selectedObj) {
        serviceParams.push({
          serviceName: k,
          paramName: this.selectedObj[k]
        })
      }
      if (!serviceParams.length) {
        showModal('请选择参数', 'warning')
        return
      }

      options.serviceParams = serviceParams
      let address = ''
      if ( this.isAddFlg ) {
        address = 'wordInsert'
      } else {
        address = 'wordUpdate'
        options.wordId = this.wordId
      }
      $http(this.API.secureApi[address], options).then((res) => {
        showModal(res.resMsg[0].msgText)
        this.allWords()
        this.dialogVisible = val
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
    // 参数该边时
    changeParam () {
      if (this.selectedObj.hasOwnProperty(this.queryParams.serviceName)) {
        showModal('该服务已经添加过了')
        return
      } else {
        if (this.selectedObj[this.queryParams.serviceName]) {
          showModal('给服务参数已经添加过了')
        } else {
          this.selectedObj[this.queryParams.serviceName] = this.queryParams.serviceParam
        }
      }
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
</style>

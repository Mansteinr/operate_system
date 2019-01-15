<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询结果
        <el-button-group>
          <el-button :type="tabFlag?'':'primary'" :class="tabFlag?'':'active'" @click="switchTab(false)">服务</el-button>
          <el-button :type="tabFlag?'primary':''" :class="tabFlag?'active':''"  @click="switchTab(true)">规则</el-button>
        </el-button-group>
      </div>
      <div class="card-container">
        <el-button type="primary" icon="el-icon-plus" size="small" @click.native="addItem">新增</el-button>
        <div v-show="!tableData.length && !tableData2.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <Table v-show="!tabFlag && tableData.length" class="table" :showSummary="false" :tableData="tableData" :tatalPage="tableData.length">
          <el-table-column
            label="服务名"
            prop="serviceName">
          </el-table-column>
          <el-table-column
            label="服务名（中）"
            prop="serviceNameZh">
             <template slot-scope="scope">
               <div @click="handleLook(scope.row)" :class="{'link':scope.row.combine, '': !scope.row.combine}">{{scope.row.serviceNameZh}}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            prop="insertTime">
          </el-table-column>
          <el-table-column
            label="更新时间"
            prop="updateTime">
          </el-table-column>
          <el-table-column
            label="组合服务"
            width="80"
            prop="combine">
            <template slot-scope="scope">
               <div :class="{'link':scope.row.combine, 'mv-danger': !scope.row.combine}">{{scope.row.combine?'是':'否'}}</div>
            </template>
          </el-table-column>
          <el-table-column
            width="90"
            label="操作">
            <template slot-scope="scope">
              <el-button @click="handleServiceDelete(scope.row)" type="text" size="small">删除</el-button>
              <el-button @click="handleServiceUpdate(scope.row)" type="text" size="small" :disabled="!scope.row.combine">更新</el-button>
            </template>
          </el-table-column>
        </Table>
        <Table v-show="tabFlag && tableData2.length" class="table" :showSummary="false" :tableData="tableData2" :tatalPage="tableData2.length">
          <el-table-column
            label="规则名称"
            width="150"
            prop="regularName">
          </el-table-column>
          <el-table-column
            label="规则代码"
            width="80"
            prop="regularCode">
          </el-table-column>
          <el-table-column
            label="告警描述"
            prop="alarmMsg">
          </el-table-column>
          <el-table-column
            label="告警码"
            width="130" 
            prop="alarmCode">
          </el-table-column>
          <el-table-column
            label="生成时间"
            width="150"
            prop="insertTime">
          </el-table-column>
          <el-table-column
            label="更新时间"
            width="150"
            prop="updateTime">
          </el-table-column>
          <el-table-column
            width="90"
            label="操作">
            <template slot-scope="scope">
              <el-button @click="handleRegularDelete(scope.row)" type="text" size="small">删除</el-button>
              <el-button @click="handleRegularUpdate(scope.row)" type="text" size="small">更新</el-button>
            </template>
          </el-table-column>
        </Table>
      </div>
    </div>
    <Dialog :dialogVisible="dialogVisible" @closeDialog="closeDialog" @determine="determine" :isClickModal="false">
      <el-form v-show="tabFlag" :rules="rules" :model="queryParams" ref="ruleForm">
        <el-form-item label="规则名称：" prop="regularName">
          <el-input v-model.trim="queryParams.regularName" placeholder="请输入规则名称"></el-input>
        </el-form-item>
        <el-form-item label="告警码：" prop="alarmCode">
          <el-input v-model.trim="queryParams.alarmCode" placeholder="请输入告警码"></el-input>
        </el-form-item>
        <el-form-item label="告警描述：" prop="alarmMsg">
          <el-input v-model.trim="queryParams.alarmMsg" placeholder="请输入告警描述"></el-input>
        </el-form-item>
      </el-form>
      <el-form v-show="!tabFlag" :model="queryParamsAdd" ref="ruleFormAdd">
        <el-form-item label="组合服务：" prop="combine" class="is-required">
          <el-radio-group v-model="queryParamsAdd.combine" :disabled="isServiceUpdate">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="接口类型：" class="is-required" v-show="!queryParamsAdd.combine">
          <el-select filterable placeholder="请选择" v-model="queryParamsAdd.serviceId" prop="serviceId">
            <el-option
              v-for="(v, index) in services"
              :key="index"
              @click.native="selecteService(v)"
              :title="`${v.serviceNameZh}(${v.serviceName})`"
              :label="v.serviceNameZh"
              :value="v.serviceId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务名称：" class="is-required" v-show="queryParamsAdd.combine">
          <el-input v-model.trim="queryParamsAdd.serviceName" :disabled="isServiceUpdate"></el-input>
        </el-form-item>
        <el-form-item label="中文名称：" class="is-required" v-show="queryParamsAdd.combine">
          <el-input v-model.trim="queryParamsAdd.serviceNameZh" :disabled="isServiceUpdate"></el-input>
        </el-form-item>
        <el-form-item label="子服务：" class="is-required" v-show="queryParamsAdd.combine">
          <el-select filterable placeholder="请选择" multiple v-model="queryParamsAdd.subService" prop="subService">
            <el-option
              v-for="(v, index) in directServices"
              :key="index"
              :title="`${v.serviceNameZh}(${v.serviceName})`"
              :label="v.serviceNameZh"
              :value="v.serviceId">
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
import { services, switchMixin } from '../../common/js/mixin'
import { showModal } from '../../utils'
export default {
  mixins: [ services, switchMixin ],
  data () {
    return {
      rules: {
        regularName: [
          { required: true, message: '请输入规则名称', trigger: 'blur' }
        ],
        alarmCode: [
          { required: true, message: '请输入告警码', trigger: 'blur' }
        ],
        alarmMsg: [
          { required: true, message: '请输入告警描述', trigger: 'blur' }
        ],
      },
      queryParams: {
        regularName: '',
        alarmCode: '',
        alarmMsg: ''
      },
      queryParamsAdd: {
        combine: false,
        serviceId: '',
        subService: [],
        serviceNameZh: '',
        serviceName: ''
      },
      dialogVisible: false,
      tableData: [],
      tableData2: [],
      selectedObj: {},
      directServices: [],
      isServiceFlag: true,
      isServiceUpdate: false,
      isRegularUpdate: false,
    }
  },
  components: {
    Table,
    Dialog
  },
  mounted() {
    this.allService()
    this.directService()
    this.allRegulars()
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
      this.queryParamsAdd.serviceId = this.services[0].serviceId
      this.dialogVisible = true
      this.isServiceUpdate = false
      this.isRegularUpdate = false
    },
    // 预览自服务
    handleLook (row) {
      if (!row.combine) return
      this.dialogVisible = true
    },
    // 删除服务
    handleServiceDelete(row) {
      let options = {
        serviceId: row.serviceId
      }
      this.$confirm('确定删除该服务?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        center: true
      }).then(() => {
        $http(this.API.secureApi.deleteService, options).then((res) => {
          showModal(res.resMsg[0].msgText)
          this.allService()
        })
      })
    },
    // 更新服务
    handleServiceUpdate (row) {
      this.dialogVisible = true
      this.isServiceUpdate = true
      this.queryParamsAdd.combine = row.combine
      this.queryParamsAdd.serviceName = row.serviceName
      this.queryParamsAdd.serviceNameZh = row.serviceNameZh
      this.queryParamsAdd.serviceId = row.serviceId
      this.subService({serviceId: row.serviceId})
    },
    // 确定
    determine (val) {
      if (!this.tabFlag) { // 服务
        this.$refs.ruleFormAdd.validate((valid) => {
          if (valid) {
              if (this.isServiceUpdate) {
                this.updateService(val) //  跟新
              } else {
                this.insertService(val) //  新增
              }
          } else {
            return false
          }
        })
      } else { // 规则
        this.$refs.ruleForm.validate((valid) => { 
          if (valid) {
            if (this.isRegularUpdate) {
              this.updateRegulars(val)
            } else {
              this.insertRegulars(val)
            }
          } else {
            return false
          }
        })
      }
      
    },
    selecteService (v) {
      this.selectedObj = {
        serviceName: v.serviceName,
        serviceNameZh: v.serviceNameZh
      }
    },
    // 新增服务
    insertService (val) {
      let options = {}
        options.combine = this.queryParamsAdd.combine
      if (!this.queryParamsAdd.combine) {
        options.serviceId = this.queryParamsAdd.serviceId
        options.serviceName = this.selectedObj.serviceName || this.services[0].serviceName
        options.serviceNameZh = this.selectedObj.serviceNameZh || this.services[0].serviceNameZh
      } else {
        options.serviceName = this.queryParamsAdd.serviceName || this.services[0].serviceName
        options.serviceNameZh = this.queryParamsAdd.serviceNameZh || this.services[0].serviceNameZh
        options.subService = this.queryParamsAdd.subService
      }
      $http(this.API.secureApi.insertService, options).then((res) => {
        showModal(res.resMsg[0].msgText)
        this.dialogVisible = val
        this.allService()
      })
    },
    // 更新服务
    updateService (val) {
      $http(this.API.secureApi.updateService, this.queryParamsAdd).then((res) => {
        showModal(res.resMsg[0].msgText)
        this.dialogVisible = val
        this.allService()
      })
    },
    /*获取所有的服务*/
    allService () {
      $http(this.API.secureApi.allService, {}).then((res) => {
        this.tableData = res.resData
      })
    },
    // 所有的子服务
    directService () {
      $http(this.API.secureApi.directService, {}).then((res) => {
        this.directServices = res.resData
        this.queryParamsAdd.subService.push(this.directServices[0].serviceId)
      })
    },
    // 服务直接子服务
    subService (op) {
      $http(this.API.secureApi.subService, op).then((res) => {
        this.queryParamsAdd.subService = []
        if (res.resData.length) {
          res.resData.forEach(v => {
            this.queryParamsAdd.subService.push(v.serviceId)
          })
        }
      })
    },
    // 所有的规则
    allRegulars (op) {
      $http(this.API.secureApi.allRegulars, {}).then((res) => {
        this.tableData2 = res.resData
      })
    },
    // 新增规则
    insertRegulars (val) {
      $http(this.API.secureApi.insertRegulars, this.queryParams).then((res) => {
        showModal(res.resMsg[0].msgText)
        this.dialogVisible = val
        this.allRegulars()
      })
    },
    // 删除规则
    handleRegularDelete (row) {
      this.$confirm('确定删除该规则?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        center: true
      }).then(() => {
        $http(this.API.secureApi.deleteRegulars, {regularId: row.regularId}).then((res) => {
          showModal(res.resMsg[0].msgText)
          this.allRegulars()
        })
      })
    },
    handleRegularUpdate (row) {
      this.dialogVisible = true
      this.isRegularUpdate = true
      this.queryParams.regularId = row.regularId
      for (let k in this.queryParams) {
        this.queryParams[k] = row[k]
      }
    },
    updateRegulars (val) {
      $http(this.API.secureApi.updateRegulars, this.queryParams).then((res) => {
        showModal(res.resMsg[0].msgText)
        this.allRegulars()
        this.dialogVisible = val
        delete this.queryParams.regularId
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

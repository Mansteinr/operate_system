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
    <Dialog
      :title="title"
      :dialogShow="dialogShow"
      @handleClose="handleClose"
      @determine="determine" 
      :showDetermine="showDetermine"
      :isShowButton="true" :isClickModal="false">
      <el-form v-show="!lookFlag&&tabFlag" :rules="rules" :model="queryParams" ref="ruleForm">
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
      <el-form v-show="!lookFlag&&!tabFlag" :model="queryParamsAdd" ref="ruleFormAdd">
        <el-form-item label="组合服务：" prop="combine" class="is-required">
          <el-radio-group v-model="queryParamsAdd.combine" :disabled="isServiceUpdate">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <Select 
          v-if="dialogShow&&!queryParamsAdd.combine" 
          :labelTitle="'接口类型'" 
          :originArr="services" 
          :defaultValue="'serviceName'" 
          :defaultLable="'serviceNameZh'"
          :searchInput="true"
          @changeInputValue="changeService"> 
        </Select>
        <el-form-item label="服务名称：" class="is-required" v-show="queryParamsAdd.combine">
          <el-input v-model.trim="queryParamsAdd.serviceName" :disabled="isServiceUpdate" placeholder="输入服务名称"></el-input>
        </el-form-item>
        <el-form-item label="中文名称：" class="is-required" v-show="queryParamsAdd.combine">
          <el-input v-model.trim="queryParamsAdd.serviceNameZh" :disabled="isServiceUpdate" placeholder="输入中文名称"></el-input>
        </el-form-item>
        <Select 
          v-if="dialogShow&&queryParamsAdd.combine" 
          :labelTitle="'子服务'" 
          :needValue="'serviceId'"
          :originArr="directServices" 
          :defaultValue="'serviceId'" 
          :defaultLable="'serviceNameZh'"
          :isMultiple="true"
          :searchInput="true"
          @changeInputValue="changeService"> 
        </Select>
      </el-form>
      <div v-show="lookFlag" style="max-height:300px;overflow:auto;">
        <el-alert
          v-for="(v, k) in subServices"
          :key="v.serviceId"
          :closable="false"
          :title="`${k+1} ${v.serviceNameZh} : ${v.serviceName}`"
          type="info">
        </el-alert>
      </div>
    </Dialog>
  </div>
</template>

<script>
/**
 * 后台对接人马超众
 * 
 * 服务
 *    当时组合服务时 可以更新 否则不能更新 并且时组合服务时 应该有预览效果 可以让操作者看到具体的组合服务
 *    修改服务时 不允许修改为单个服务 也不允许修改服务名称和服务中文名称
 */
import Table from '../../base/Table'
import Dialog from '../../base/Dialog'
import { showModal } from '../../utils'
import Select from '../../base/Select'
import { $http } from '../../common/js/ajax'
import { services, switchMixin } from '../../common/js/mixin'
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
        subService: [],
        serviceNameZh: '',
        serviceName: ''
      },
      title: '新增服务',
      tableData: [],
      tableData2: [],
      lookFlag: false,
      selectedObj: {},
      subServices: [], // 某个组合服务对应的自服务
      dialogShow: false,
      isHasParams: false, // 服务名是否有参数
      directServices: [], // 所有的子服务
      showDetermine: true,
      isServiceFlag: true, // 是否是服务
      isServiceUpdate: false, // 服务跟新
      isRegularUpdate: false, // 规则更新
    }
  },
  components: {
    Table,
    Dialog,
    Select
  },
  mounted() {
    this.allService()
    this.directService()
    this.allRegulars()
  },
  methods: {
    handleClose (val) { // 隐藏对话框
      this.dialogShow = val
    },
    resetTable() {
      this.$refs.ruleForm.resetFields()
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
      this.lookFlag = false
      this.dialogShow = true
      this.showDetermine = true
      this.isServiceUpdate = false
      this.isRegularUpdate = false
      this.queryParamsAdd.combine = false
      this.queryParamsAdd.serviceName = ''
      this.queryParamsAdd.serviceNameZh = ''
      setTimeout(() => {
        this.services = [...[],...this.services]
        this.queryParamsByServiceName({
          serviceName: this.services[0].serviceName,
          serviceNameZh: this.services[0].serviceNameZh
        })
      }, 100)

    },
    queryParamsByServiceName (v) {
      $http(this.API.paramsApi.queryParamsByServiceName, v).then((res) => {
        this.isHasParams = (res.resData.paramNameBeans&&res.resData.paramNameBeans.length)
      })
    },
    // 预览自服务
    handleLook (row) {
      if (!row.combine) return
      this.lookFlag = true
      this.dialogShow = true
      this.title = '预览'
      this.showDetermine = false
      this.subService({serviceId: row.serviceId})
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
      }).catch(() => {
        console.log(90)
      })
    },
    // 更新服务
    handleServiceUpdate (row) {
      this.title = '更新服务'
      /**
       * 服务更新的时候  只能更新子服务
       * 更具服务id查询该组合服务下 各个自服务
       * 
       * 应该先分别查询 所有的子服务 和该组合服务所对应的子服务
       */
      this.dialogShow = true
      this.isServiceUpdate = true
      this.queryParamsAdd.combine = row.combine
      this.queryParamsAdd.serviceName = row.serviceName
      this.queryParamsAdd.serviceNameZh = row.serviceNameZh
      this.queryParamsAdd.serviceId = row.serviceId
      this.lookFlag = false

      
      this.directService({serviceId: row.serviceId})
    },
    // 确定
    determine (val) {
      if (!this.tabFlag) { // 服务
        this.$refs.ruleFormAdd.validate((valid) => {
          if (valid) {
              if (this.isServiceUpdate) {
                this.updateService(val) //  跟新
              } else {
                if (!this.isHasParams) {
                  showModal('该服务未配置参数,请先配置参数', 'warning')
                  return
                }
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
    changeService (value) {
      this.queryParamsByServiceName({
        serviceName: value.serviceName,
        serviceNameZh: value.serviceNameZh
      })
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
        options.subService = document.querySelector('[name="serviceId"]').value.split(',')
      }
      $http(this.API.secureApi.insertService, options).then((res) => {
        showModal(res.resMsg[0].msgText)
        this.dialogShow = val
        this.allService()
      })
    },
    // 更新服务
    updateService (val) {
      this.queryParamsAdd.subService = document.querySelector('[name="serviceId"]').value.split(',')
      $http(this.API.secureApi.updateService, this.queryParamsAdd).then((res) => {
        showModal(res.resMsg[0].msgText)
        this.dialogShow = val
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
    directService (op) {
      /**
       * 选择已经选中的自服务
       */
      $http(this.API.secureApi.directService, {}).then((res) => {
        this.directServices = [...[], ...res.resData]
        if (!op) return
        $http(this.API.secureApi.subService, op).then((res) => {
          if (res.resData.length) {
             if (this.isServiceUpdate) {
              document.querySelectorAll('.dropdown-item.text-warp.li-text').forEach(v => {
                res.resData.forEach(v1 => {
                  if (v.title.indexOf(v1.serviceId) >= 0) {
                    v.click()
                  }
                })
              })
            }
          }
        })
      })
    },
    // 服务直接子服务
    subService (op) {
      $http(this.API.secureApi.subService, op).then((res) => {
        if (res.resData.length) {
          this.subServices = [...res.resData]
        }
      })
    },
    // 所有的规则
    allRegulars () {
      $http(this.API.secureApi.allRegulars, {}).then((res) => {
        this.tableData2 = res.resData
      })
    },
    // 新增规则
    insertRegulars (val) {
      $http(this.API.secureApi.insertRegulars, this.queryParams).then((res) => {
        showModal(res.resMsg[0].msgText)
        this.dialogShow = val
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
      this.dialogShow = true
      this.isRegularUpdate = true
      this.title = '更新规则'
      this.queryParams.regularId = row.regularId
      for (let k in this.queryParams) {
        this.queryParams[k] = row[k]
      }
    },
    updateRegulars (val) {
      this.lookFlag = false
      this.dialogShow = true
      this.showDetermine = false
      this.isServiceUpdate = false
      this.isRegularUpdate = false
      this.queryParamsAdd.combine = false
      this.queryParamsAdd.serviceName = ''
      this.queryParamsAdd.serviceNameZh = ''
      $http(this.API.secureApi.updateRegulars, this.queryParams).then((res) => {
        showModal(res.resMsg[0].msgText)
        this.allRegulars()
        this.dialogShow = val
        delete this.queryParams.regularId
      })
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
    .el-alert 
      margin-bottom 5px
</style>

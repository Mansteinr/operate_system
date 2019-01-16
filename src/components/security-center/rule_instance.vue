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
            label="规则名称"
            prop="regular.regularName">
          </el-table-column>
          <el-table-column
            label="服务名称"
            width="200"
            prop="service.serviceNameZh">
          </el-table-column>
          <el-table-column
            label="服务参数"
            width="160"
            :formatter="formatterParams"
            prop="params">
            <template slot-scope="scope">
              <div v-html="formatterParams(scope.row.params)"></div>
            </template>
          </el-table-column>
          <el-table-column
            label="设置参数"
            width="160"
            prop="callPeriod">
            <template slot-scope="scope">
              <div v-html="formattercallPeriod(scope.row)"></div>
            </template>
          </el-table-column>
          <el-table-column
            label="使用实例"
            prop="use">
            <template slot-scope="scope">
              <div :class="{ 'link':scope.row.use, 'mv-danger': !scope.row.use }">{{scope.row.use?'是':'否'}}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="告警"
            prop="alarm">
            <template slot-scope="scope">
              <div :class="{ 'link':scope.row.alarm, 'mv-danger': !scope.row.alarm }">{{scope.row.alarm?'是':'否'}}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="区分用户"
            prop="useLoginName">
            <template slot-scope="scope">
              <div :class="{ 'link':scope.row.useLoginName, 'mv-danger': !scope.row.useLoginName }">{{scope.row.useLoginName?'是':'否'}}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="区分服务"
            prop="useService">
            <template slot-scope="scope">
              <div :class="{ 'link':scope.row.useService, 'mv-danger': !scope.row.useService }">{{scope.row.useService?'是':'否'}}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
              <el-button @click="handleEditor(scope.row)" type="text" size="small">更新</el-button>
            </template>
          </el-table-column>
        </Table>
      </div>
    </div>
    <Dialog :dialogVisible="dialogVisible"  @closeDialog="closeDialog" @determine="determine" :isClickModal="false">
      <el-form :rules="rules" :model="queryParams" ref="ruleForm">
        <el-form-item label="规则名称：" class="has-norequire">
          <el-select  filterable placeholder="请选择" v-model="queryParams.regularId" prop="serviceName">
            <el-option
              v-for="(v, index) in allRegularsArr"
              :key="index"
              :title="`${v.regularName}`"
              :label="v.regularName"
              :value="v.regularId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接口类型：" class="has-norequire">
          <el-select  filterable placeholder="请选择" v-model="queryParams.serviceId" prop="serviceId">
            <el-option
              v-for="(v, index) in allServiceArr"
              :key="index"
              @click.native="selectedService(v)"
              :title="`${v.serviceNameZh}(${v.serviceName})`"
              :label="v.serviceNameZh"
              :value="v.serviceId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参数：" prop="params">
          <el-select  filterable multiple placeholder="请选择" collapse-tags v-model="queryParams.params">
            <el-option
              v-for="(v, index) in serviceParams"
              :key="index"
              :title="`${v.paramNameCh}(${v.paramName})`"
              :label="v.paramNameCh"
              :value="v.paramName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计数周期：" prop="callPeriod">
          <el-input v-model.number="queryParams.callPeriod"></el-input>
        </el-form-item>
        <el-form-item label="锁定时长：" prop="lockTime">
          <el-input v-model.number="queryParams.lockTime"></el-input>
        </el-form-item>
        <el-form-item label="最大调用次数：" prop="maxCount">
          <el-input v-model.number="queryParams.maxCount"></el-input>
        </el-form-item>
        <el-form-item label="是否使用实例：" prop="use">
          <el-radio-group v-model="queryParams.use">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否告警：" prop="alarm">
          <el-radio-group v-model="queryParams.alarm">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否区分用户：" prop="useLoginName">
          <el-radio-group v-model="queryParams.useLoginName">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否区分服务：" prop="useService">
          <el-radio-group v-model="queryParams.useService">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>
        
   
    
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import { $http } from '../../common/js/ajax'
import Table from '../../base/Table'
import Dialog from '../../base/Dialog'
import { showModal } from '../../utils'
export default {
  data () {
    let numberRule = (rule, value, callback) => {
      if (!/^[1-9]\d*/g.test(value)) {
        callback(new Error('请输入大于0的数字'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        maxCount: [
          { required: true, message: '请输入最大调用次数', trigger: 'blur' },
          { type: 'number', message: '请输入数字值', trigger: 'blur' },
          { validator: numberRule , trigger: 'blur' }
        ],
        lockTime: [ 
          { required: true, message: '请输入锁定时长', trigger: 'blur' },
          { type: 'number', message: '请输入数字值', trigger: 'blur' },
          { validator: numberRule , trigger: 'blur' }
        ],
        callPeriod: [
          { required: true, message: '请输入计数周期', trigger: 'blur' },
          { type: 'number', message: '请输入数字值', trigger: 'blur' },
          { validator: numberRule , trigger: 'blur' }
        ],
        params: [
          { required: true, message: '请选择参数', trigger: 'blur' }
        ]
      },
      queryParams: {
        useService: false,
        useLoginName: false,
        use: false,
        alarm: false,
        callPeriod: '',
        lockTime: '',
        maxCount: '',
        regularId: '',
        serviceId: '',
        params: []
      },
      dialogVisible: false,
      tableData: [],
      serviceParams: [],
      isAddFlg: true,
      allRegularsArr: [],
      allServiceArr: []
    }
  },
  components: {
    Table,
    Dialog
  },
  mounted() {
    this.allRegIns()
    this.allRegulars()
    this.allService()
  },
  methods: {
    resetTable() {
      this.$refs.ruleForm.resetFields()
    },
    closeDialog (val) {
      this.dialogVisible = val
    },
   formatterParams (val) { // 参数展示
      return this.$refs.table.formatterParamsArr(val)
    },
    formattercallPeriod (val) {
      let html = ''
       html += 
        `<span class="param-item" title="">计数周期（s）: ${val.callPeriod}</span>
        <span class="param-item" title="">锁定时长（s）: ${val.lockTime}</span>
        <span class="param-item" title="">最大调用次数: ${val.maxCount}</span>
        `
       return html
    },
    addItem () {
      this.isAddFlg = true
      this.dialogVisible = true
      this.selectedService(this.allServiceArr[0])
    },
    selectedService (v) {
      this.serviceParams = []
      this.queryParams.params = []
      let options = {}
      if (!v.combine) { // 非组合服务
        options = {
          serviceId: v.serviceId,
          serviceName: v.serviceName,
          serviceNameZh: v.serviceNameZh
        }
        $http(this.API.paramsApi.queryParamsByServiceName, options).then((res) => {
          this.serviceParams = res.resData.paramNameBeans
          if (res.resData.paramNameBeans && res.resData.paramNameBeans.length) {
            this.queryParams.params.push(this.serviceParams[0].paramName)
          }
        })
      } else { // 组合服务，先查询所有的子服务，在查询子服务的参数，在取这些参数并集 在去重
        let arr = []
        $http(this.API.secureApi.subService, {serviceId: v.serviceId}).then((res) => {
          if (res.resData.length) {
            res.resData.forEach(v => {
              options = {
                serviceId: v.serviceId,
                serviceName: v.serviceName,
                serviceNameZh: v.serviceNameZh
              }
              $http(this.API.paramsApi.queryParamsByServiceName, options).then((res) => {
                if (res.resData.paramNameBeans && res.resData.paramNameBeans.length) {
                  arr = [...arr, ...res.resData.paramNameBeans]
                  let hash = {}
                  this.serviceParams = arr.reduce(function(item, next) {
                    hash[next.paramName] ? '' : hash[next.paramName] = true && item.push(next);
                    return item
                  }, [])
                  if (!this.queryParams.params.length) {
                    this.queryParams.params.push(this.serviceParams[0].paramName)
                  }
                }
              })
            })
          }
        })
      }
    },
    allRegIns () { // 所有的实列
      $http(this.API.secureApi.allRegIns, {}).then((res) => {
        this.tableData = res.resData
      })
    },  // 确定
    determine () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isAddFlg) {
            this.insertRegIns () // 新增实列
          } else {
            this.updateRegIns()
          }
        } else {
          return false
        }
      })
    },
    allRegulars () { // 所有的规则
      $http(this.API.secureApi.allRegulars, {}).then((res) => {
        this.allRegularsArr = res.resData
        this.queryParams.regularId = this.allRegularsArr[0].regularId
      })
    },
    allService () { // 所有的服务
      $http(this.API.secureApi.allService, {}).then((res) => {
        this.allServiceArr = res.resData
        this.queryParams.serviceId = this.allServiceArr[0].serviceId
      })
    },
    insertRegIns () { // 新增实列
      $http(this.API.secureApi.insertRegIns, this.queryParams).then((res) => {
        showModal(res.resMsg[0].msgText)
        this.allRegIns()
        this.dialogVisible = false
      })
    },
    updateRegIns () { //更新实列
    console.log(this.queryParams)
      $http(this.API.secureApi.updateRegIns, this.queryParams).then((res) => {
        showModal(res.resMsg[0].msgText)
        delete this.queryParams.regInsId
        this.allRegIns()
        this.dialogVisible = false
      })
    },
    handleDelete (row) { // 删除
      this.$confirm('确定删除?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        center: true
      }).then(() => {
        $http(this.API.secureApi.deleteRegIns, {regInsId: row.regInsId}).then((res) => {
          showModal(res.resMsg[0].msgText)
          this.allRegIns()
        })
      })
    },
    handleEditor (row) { // 更新
    console.log(row)
      this.selectedService(this.allServiceArr[0])
      this.dialogVisible = true
      this.isAddFlg = false
      for (let k in this.queryParams) {
        this.queryParams[k] = row[k]
      }
      this.queryParams.regularId = row.regular.regularId
      this.queryParams.serviceId = row.service.serviceId
      this.queryParams.regInsId = row.regInsId
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

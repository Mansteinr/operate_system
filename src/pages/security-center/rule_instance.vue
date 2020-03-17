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
            <template slot-scope="scope">
               <div @click="handleLook(scope.row)" :class="{'link':scope.row.service.combine, '': !scope.row.service.combine}">{{scope.row.service.serviceNameZh}}</div>
            </template>
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
    <Dialog :dialogShow="dialogShow" @determine="determine"
      @handleClose="handleClose"
      :isShowButton="true"
      :title="title"
     :isClickModal="false">
      <el-form :rules="rules"  v-show="!lookFlag" :model="queryParams" ref="ruleForm">
         <Select 
          :labelTitle="'规则名称'" 
          :originArr="allRegularsArr" 
          :defaultValue="'regularId'" 
          :defaultLable="'regularName'"
          :searchInput="true"> 
        </Select>
        <Select 
          :labelTitle="'接口类型'" 
          :originArr="allServiceArr" 
          :defaultValue="'serviceId'" 
          :defaultLable="'serviceNameZh'"
          @changeInputValue='selectedService'
          :searchInput="true"> 
        </Select>
        <Select 
          :labelTitle="'参数'" 
          :originArr="serviceParams" 
          :defaultValue="'paramName'" 
          :defaultLable="'paramNameCh'"
          :isMultiple="true"
          :searchInput="true"> 
        </Select>
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
import Table from '../../base/Table'
import Select from '../../base/Select'
import Dialog from '../../base/Dialog'
import { showModal } from '../../utils'
import { $http } from '../../common/js/ajax'
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
      dialogShow: false,
      tableData: [],
      serviceParams: [],
      isAddFlg: true,
      allRegularsArr: [],
      allServiceArr: [],
      lookFlag: false,
      subServices: [],
      title: '新增'
    }
  },
  components: {
    Table,
    Dialog,
    Select
  },
  mounted() {
    this.allRegIns()
    this.allRegulars()
    this.allService()
  },
  methods: {
    handleClose (val) { // 隐藏对话框
      this.dialogShow = val
    },
    resetTable() {
      this.$refs.ruleForm.resetFields()
    },
    handleLook (row) {
      this.dialogShow = true
      this.lookFlag = true
      this.title = '预览子服务'
      this.subService({serviceId: row.service.serviceId})
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
      this.dialogShow = true
      this.lookFlag = false
      this.title = '新增'
      setTimeout(() => {
        this.allRegularsArr = [...[], ...this.allRegularsArr]
        this.allServiceArr = [...[], ...this.allServiceArr]
        this.selectedService(this.allServiceArr[0])
      }, 120)
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
      } else { // 组合服务，先查询所有的子服务，在查询子服务的参数，在取这些参数交集 在去重
        $http(this.API.secureApi.subService, {serviceId: v.serviceId}).then((res) => {
          if (res.resData.length) {
            let isFirst = true, arr = [], intersect = [] , len = res.resData.length, i = 0
            res.resData.forEach((v, k) => {
              options = {
                serviceId: v.serviceId,
                serviceName: v.serviceName,
                serviceNameZh: v.serviceNameZh
              }
              let isFirst = true, // 判断是否是第一次
               intersect = [], allHasParams = true
              $http(this.API.paramsApi.queryParamsByServiceName, options).then((res1) => {
              i++
                if (!allHasParams) return
                if (res1.resData.paramNameBeans && res1.resData.paramNameBeans.length) {
                  let subServiceArr = []
                  res1.resData.paramNameBeans.forEach(v2 => {
                      if (isFirst) { // 判断是否是第一次 若是第一次
                        v2[v2.paramName] = v2.paramNameCh
                        intersect.push(v2.paramName)
                      } else {
                        subServiceArr.push(v2.paramName)
                        v2[v2.paramName] = v2.paramNameCh
                      }
                  })

                  if (!isFirst) { // 判断是否是第一次 不需要操作，反之需要找出参数的交集
                    intersect = new Set([...subServiceArr].filter(x => new Set(intersect).has(x)))
                  }
                  isFirst = false
                  // debugger
                  console.log(i, len)
                if (i === len) { // 判断是否是最后一个请求 因为请求是异步 所以利用该方法
                  console.log(intersect)
                  let lastArr = []
                  lastArr = [...intersect] // 将Set对象解构为数组
                  if (!lastArr.length) { // 判断数组是否为空 为空提示客户重新配置服务
                    showModal('改组合服务没有公共参数，请重新配置服务', 'warning')
                    return
                  }
                  this.serviceParams = []
                  res1.resData.paramNameBeans.forEach(v2 => {
                    lastArr.forEach(v3 => {
                      if (v2.paramName === v3) {
                        this.serviceParams.push(v2)
                      }
                    })
                  })
                }

                } else {
                  showModal('该组合服务未配置子服务', 'warning')
                  console.log(90, '该组合服务未配置子服务')
                  allHasParams = false
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
        this.allRegularsArr = [...[], ...res.resData]
      })
    },
    allService () { // 所有的服务
      $http(this.API.secureApi.allService, {}).then((res) => {
        this.allServiceArr = [...[], ...res.resData]
      })
    },
    insertRegIns () { // 新增实列
      $http(this.API.secureApi.insertRegIns, this.queryParams).then((res) => {
        showModal(res.resMsg[0].msgText)
        this.allRegIns()
        this.dialogShow = false
      })
    },
    updateRegIns () { //更新实列
      $http(this.API.secureApi.updateRegIns, this.queryParams).then((res) => {
        showModal(res.resMsg[0].msgText)
        delete this.queryParams.regInsId
        this.allRegIns()
        this.dialogShow = false
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
      this.title = '更新'
      this.selectedService(this.allServiceArr[0])
      this.dialogShow = true
      this.isAddFlg = false
      for (let k in this.queryParams) {
        this.queryParams[k] = row[k]
      }
      this.queryParams.regularId = row.regular.regularId
      this.queryParams.serviceId = row.service.serviceId
      this.queryParams.regInsId = row.regInsId
    },
        // 服务直接子服务
    subService (op) {
      console.log(op)
      $http(this.API.secureApi.subService, op).then((res) => {
        if (res.resData.length) {
          this.subServices = [...res.resData]
        }
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

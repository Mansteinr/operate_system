<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询结果
      </div>
      <div class="card-container">
        <el-button type="primary" icon="el-icon-plus" size="small" @click.native="addItem">新增</el-button>
        <div v-show="!tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <Table 
          :columns="columns" 
          :showSummary="false" 
          :tableData="tableData" 
          @handle="handle"
          :tatalPage="tableData.length" 
          v-show="tableData.length">
        </Table>
      </div>
    </div>
    <Dialog
      ref='dialog'
      :dialogShow="dialogShow" 
      @handleClose="handleClose" 
      @determine="determine" 
      :isShowButton="true"
      :isClickModal="false">
      <Select 
        v-if="dialogShow"
        :labelTitle="'接口类型'" 
        :originArr="serviceArr" 
        :defaultValue="'serviceName'" 
        :defaultLable="'serviceNameZh'"
        :searchInput="true"
        @changeInputValue="changeServiceName"> 
      </Select>
      <Select 
        :labelTitle="'参数'" 
        v-if="dialogShow"
        :originArr="allParamsArr" 
        :defaultValue="'paramNameEn'" 
        :defaultLable="'paramNameCn'"
        :searchInput="true"
        :isMultiple="true"> 
      </Select>
    </Dialog>
  </div>
</template>

<script>
/**
 * 后台接口对接人 李志明
 * 
 * 没有修改 若想修改 直接重复添加即可
 */
import Table from '../../base/Table'
import Select from '../../base/Select' // 下拉框
import Dialog from '../../base/Dialog'
import { showModal } from '../../utils'
import { $http } from '../../common/js/ajax'
import { services, getParam } from '../../common/js/mixin'
export default {
  mixins: [ services, getParam ],
  data () {
    return {
      tableData: [],
      serviceArr: [],
      allParamsArr: [],
      dialogShow: false,
      paramNameBeans: [],
      selectedService: {},
      columns: [{
        prop: 'serviceName',
        label: '服务名'
      }, {
        prop: 'serviceNameCh',
        label: '服务名(中文)'
      }, {
        prop: 'paramNameBeans',
        label: '参数'
      }, {
        prop: [{keyWord: '删除', method: 'delete'}],
        width: '160px',
        label: '操作'
      }]
    }
  },
  components: {
    Table,
    Select,
    Dialog
  },
  mounted() {
    this.getAll()
  },
  methods: {
    changeServiceName (value) {
      this.selectedService = value
    },
    handle (row, method) { // 删除操作
      this.$confirm('确定该操作？', '提示', { //提示客户是否确定删除
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this[method](row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    handleClose (val) { // 隐藏对话框
      this.dialogShow = val
    },
    addItem () {
      this.dialogShow = true
      this.serviceArr = []
      this.allParamsArr = []
      setTimeout(() => {
        this.serviceArr = [...this.serviceArr,...this.services]
        this.allParamsArr = [...this.allParamsArr,...this.allParams]
      }, 100)
    },
    delete(options) { // 删除
      $http(this.API.paramsApi.deleteByServiceNameAndParamName, options).then((res) => {
        this.$message({
          type: 'success',
          message: res.resMsg[0].msgText
        })
        this.getAll()
      })
    },
    determine (msg) { // 确定增加
      let paramNameArr = document.querySelector('[name="paramNameEn"]').value.split(','), postParamsArr = [], options = {}
      if (!paramNameArr.length) return
      paramNameArr.forEach(v => {
        let findFlag = false // 防止多余的循环
        this.allParams.forEach(v1 => {
          if (findFlag) return // 对比成功 跳出内层循环
          if (v === v1.paramNameEn) {
            findFlag = true
            postParamsArr.push({
              paramNameCh: v1.paramNameCn,
              paramName: v1.paramNameEn
            })
          }
        })
      })
      options.serviceNameCh = this.selectedService.serviceNameZh
      options.serviceName = this.selectedService.serviceName
      options.paramNameBeans = postParamsArr
      if (!options.paramNameBeans.length) {
        showModal('请选择参数')
        return
      }
      this.addServiceNameAndParams(options)
      this.dialogShow = msg
    },
    addServiceNameAndParams (options) { // 增加参数
      if (!options.paramNameBeans.length) {
        showModal('请选择参数', 'warning')
        return
      }
      $http(this.API.paramsApi.addServiceNameAndParams, options).then((res) => {
        showModal(res.resMsg[0].msgText)
        this.getAll()
      })
    },
    getAll () { // 获取所有的参数
      $http(this.API.paramsApi.getAll, {}).then((res) => {
        this.tableData = res.resData
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
      width calc(100% - 125px) !important
      margin-bottom 10px
      margin-top 10px
      float none
    .dialog-button-group
      bottom 10px
</style>

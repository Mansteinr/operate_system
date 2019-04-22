<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container">
        <el-form :inline="true" ref="querForm" :model="queryParams" class="query-form">
          <el-form-item label="选择时间：" prop="time">
            <div class="block">
              <el-date-picker
                type="daterange" 
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :name="['start', 'end']"
                v-model="queryParams.time"
                range-separator="至"
                :picker-options="pickerOptions2">
              </el-date-picker>
            </div>
          </el-form-item>
          <loginNameSelect 
            :labelTitle="'客户名称'" 
            :originArr="loginName" 
            :defaultValue="'loginName'" 
            :searchInput=true
            :needValue="'customerId'"
            :defaultLable="'customerName'"
          >
          </loginNameSelect>
          <serviceSelect 
            :labelTitle="'接口类型'" 
            :originArr="services" 
            :defaultValue="'serviceName'" 
            :searchInput="true"
            :isMultiple="true"
            :isAll="true"
            :defaultLable="'serviceNameZh'">
          </serviceSelect>
          <el-form-item label="返回码分组：" prop="groupByCode">
            <el-radio v-model="queryParams.groupByCode" label="0">否</el-radio>
            <el-radio v-model="queryParams.groupByCode" label="1">是</el-radio>
          </el-form-item>
          <el-form-item class="query-item">
           <query-button @reset="reset" @submit="onSubmit"></query-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="card-wrapper card-content">
      <div class="card-title">
        每日详情
      </div>
      <div class="card-container">
        <div v-show="!tableData.length" ref="nocharts" class="no-charts" style="height:400px;minWidth:100%;"></div>
        <Table 
          class="table1" 
          :showSummary="true" 
          :tableData="tableData" 
          :tatalPage="tableData.length" 
          v-show="tableData.length" 
          :mergeCell="'dayTime'"
          @handle="handle"
          :columns="tableColumns">
        </Table>
      </div>
    </div>
    <div class="card-wrapper card-content">
      <div class="card-title">
        汇总统计
      </div>
      <div class="card-container">
        <div v-show="!tableData2.length" ref="nocharts" class="no-charts" style="height:400px;minWidth:100%;"></div>
        <Table 
          :columns="tableColumns1" 
          class="table2" 
          :showSummary="true" 
          :tableData="tableData2" 
          @handle="handle"
          :tatalPage="tableData2.length" 
          v-show="tableData2.length">
        </Table>
      </div>
      <el-button type="text" @click="open">点击打开 Message Box</el-button>
    </div>
    <Dialog
      ref='dialog'
      :dialogShow="dialogShow"
      :width="'70%'"
      :title="'上游详情'"
      @handleClose="handleClose"
      @determine="determine"
    >
      <Table 
        :columns="columns3" 
        class="table3" 
        :showSummary="true" 
        :tableData="tableData3" 
        :selector="'table3'"
        :tatalPage="tableData3.length">
      </Table>
    </Dialog>
  </div>
</template>
<script>
/**
 * 要点：后台一次性将数据传递过来 前端自己组装成自己想要的数据
 * 
 *   最大查询事件为2019-03-01
 * 
 */
import { $http } from '../../common/js/ajax'
import { hotKeyTime, services, loginName } from '../../common/js/mixin'
import Table from '../../base/Table'
import loginNameSelect from '../../base/Select'
import serviceSelect from '../../base/Select'
import QueryButton from '../../base/QueryButton'
import { reset, showModal } from '../../utils'
import Dialog from '../../base/Dialog'
let serviceObj = {}  // 由于后端 传参的时候 没有将中文名传过来 前端自己将中英文对照
export default {
  mixins: [hotKeyTime, services, loginName],
  data () {
    return {
      queryParams: { // 保留该参数 是为了重置方便
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
        groupByCode: '0'
      },
      tableData: [],   // 余额快照table数据
      tableData2: [],  // 充值记录table数据
      tableData3: [],  // 详情table数据
      dialogShow: false, // 控制显示隐藏弹框
      multiple: false, // 是否多选
      all: false, // 是否多选
      columns: [{
        prop: 'callNum',
        sortable: true,
        label: '调用总量'
      },{
        prop: 'downChargeNum',
        sortable: true,
        label: '下游计费条数'
      },{
        prop: 'downCost',
        sortable: true,
        label: '下游计费'
      },{
        prop: 'upCost',
        sortable: true,
        label: '上游计费'
      },{
        prop: 'margin',
        sortable: true,
        label: '利润'
      },{
        prop: [{keyWord: '明细', method: 'detail'}],
        label: '操作'
      }],
      columns1: [{
        prop: 'callNum',
        label: '调用总量',
        sortable: true
      }, {
        prop: 'downChargeNum',
        label: '下游计费条数',
        sortable: true
      }, {
        prop: 'downCost',
        label: '下游计费',
        sortable: true
      }, {
        prop: 'upCost',
        label: '上游计费',
        sortable: true
      }, {
        prop: 'margin',
        label: '利润',
        sortable: true
      }, {
        prop: 'margin',
        label: '利润',
        sortable: true
      },{
        label: '操作',
        prop: [{keyWord: '明细', method: 'detail'}]
      }],
      columnsHeader: [{
        prop: 'result',
        label: 'result',
        sortable: true
      }, {
        prop: 'resultCode',
        label: 'resultCode',
        sortable: true
      }],
      columnsService: [ {
        prop: 'serviceName',
        label: '服务名称',
        minWidth: '250px'
      }, {
        prop: 'serviceName',
        label: '服务名称(中文)',
        minWidth: '200px',
        formatter: row => {
          return serviceObj[row.serviceName]
        }
      }],
      tableColumns: [],
      tableColumns1: [],
      columns3: [{
        prop: 'pipeName',
        minWidth: '450px',
        label: '通道',
      },{
        prop: 'callNum',
        label: '调用总量',
      },{
        prop: 'chargeNum',
        label: '计费调用量',
      },{
        prop: 'timeoutNum',
        label: '超时调用量',
      },{
        prop: 'cost',
        label: '消费金额',
      }]
    }
  },
  components: {
    Table,
    Dialog,
    QueryButton,
    serviceSelect,
    loginNameSelect
  },
  watch: {
    services () {
      this.services.forEach(v => { // 组装字典
        serviceObj[v.serviceName] = v.serviceNameZh
      })
    }
  },
  methods: {
    reset () { //  重置操作
      this.$refs.querForm.resetFields()
      reset()
    },
    onSubmit () {
      let options = {}
      document.querySelectorAll('form input').forEach(v => { // 获取参数
        if (v.name) {
          options[v.name] = v.value
        }
      })
      options.serviceNames = options.serviceName.split(',')
      if (options.serviceNames[0] === '') { // 当选择全部时  后台需要的参数为 serviceNames = []
        options.serviceNames = []
      }
      delete options.serviceName
      Object.assign(options, {
        groupByCode: this.queryParams.groupByCode
      })
      if (+new Date(options.start) < +new Date('2019-03-01')) {
        showModal("起始时间请从2019-03-01开始", 'warning')
        return
      }
      this.queryProfit(options)
    },
    queryProfit (options) { // 余额快照
      $http(this.API.upApi.queryByDate, options).then((res) => {
        this.tableData = []
        this.tableData2 = []
        if (this.queryParams.groupByCode === '1') { // 这样处理是因为 有些
          this.tableColumns = [...[{prop: 'dayTime',sortable: true,label: '日期'}], ...this.columnsService, ...this.columnsHeader, ...this.columns1]
          this.tableColumns1= [...this.columnsService, ...this.columnsHeader, ...this.columns]
        } else {
          this.tableColumns = [...[{prop: 'dayTime',sortable: true,label: '日期'}],...this.columnsService, ...this.columns1]
          this.tableColumns1 = [...this.columnsService, ...this.columns]
        }
        this.tableData2 = res.resData.collectInfos

        for (let k in res.resData.dayInfos) {
          if (res.resData.dayInfos[k].length) {
            res.resData.dayInfos[k].forEach(v => {
              this.tableData = [...this.tableData, v]
            })
          }
        }
        // 排序
        if (this.tableData.length) {
          this.tableData.sort((a, b) => {
            return a.dayTime - b.dayTime
          })
        }
      })
    },
    handle(row) {
      this.tableData3 = row.upDetail
      this.dialogShow = true
    },
    handleClose (msg) { // 取消键关闭对话框
      this.dialogShow = msg
    },
    determine (msg) { // 取消键关闭对话框
      this.dialogShow = msg
    },
    open() {
      this.$alert('<strong>这是 <i>HTML</i> 片段</strong>', 'HTML 片段', {
        dangerouslyUseHTMLString: true
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

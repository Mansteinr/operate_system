<template>
  <div class="template-wrapper">
    <Inquiry :queryParams="queryParams" @initFun="initFun">
      <el-form-item label="选择时间：" prop="time">
        <div class="block">
          <el-date-picker
            type="daterange" 
            unlink-panels
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable="false"
            :name="['start', 'end']"
            v-model="queryParams.time"
            range-separator="至"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </div>
      </el-form-item>
      <Select 
        :labelTitle="'客户名称'" 
        :originArr="basicsCustomerList" 
        :defaultValue="'loginName'" 
        :searchInput="true"
        :needValue="'customerId'"
        :defaultLable="'customerName'"
      >
      </Select>
      <Select 
        :labelTitle="'接口类型'" 
        :originArr="basicsServiceList" 
        :defaultValue="'serviceName'" 
        :searchInput="true"
        :isMultiple="true"
        :isAll="true"
        :defaultLable="'serviceNameZh'">
      </Select>
      <el-form-item label="返回码分组：" prop="groupByCode">
        <el-radio v-model="queryParams.groupByCode" label="0">否</el-radio>
        <el-radio v-model="queryParams.groupByCode" label="1">是</el-radio>
      </el-form-item>
    </Inquiry>
    <Content :isOnlyTable="true" title="每日详情"  :data="queryByDateList">
      <Table
        slot="onlyTable"
        ref="table"
        :showSummary="false"
        :tableData="queryByDateList"
        :tatalPage="queryByDateList.length"
        :columns="columns">
          <el-table-column
            slot="tableTail"
            width="100px"
            :label="this.$t('m.basics.operateTitle')">
            <template slot-scope="scope">
              <el-button type="primary" size='mini' plain @click="detail(scope.row.upDetail)">详情</el-button>
            </template>
          </el-table-column>
        </Table>
    </Content>
    <Content :isOnlyTable="true" title="汇总统计"  :data="queryByDateCollectInfoList">
      <Table
        slot="onlyTable"
        ref="table"
        :showSummary="false"
        :tableData="queryByDateCollectInfoList"
        :tatalPage="queryByDateCollectInfoList.length"
        :columns="columns1"
      >
        <el-table-column
          slot="tableTail"
          width="100px"
          :label="this.$t('m.basics.operateTitle')">
          <template slot-scope="scope">
            <el-button type="primary" size='mini' plain @click="detail(scope.row.upDetail)">详情</el-button>
          </template>
        </el-table-column>
      </Table>
    </Content>
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
        :showSummary="true" 
        :tableData="tableData3"
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
import { showModal } from '@/utils'
import Table from "@/components/Table"
import Select from "@/components/Select"
import Dialog from '@/components/Dialog'
import Content from "@/components/Content"
import Inquiry from "@/components/Inquiry"
import { mapActions, mapGetters } from "vuex"
import { loginName, services, hotKeyTime } from '@/common/js/mixin'

export default {
  mixins: [hotKeyTime, services, loginName],
  data () {
    return {
      queryParams: { // 保留该参数 是为了重置方便
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
        groupByCode: '0'
      },
      tableData3: [],  // 详情table数据
      dialogShow: false, // 控制显示隐藏弹框
      columns: [{
        prop: 'dayTime',
        width: '90px',
        label: '日期'
      }, {
        prop: 'serviceName',
        width: '150px',
        label: '服务名称'
      }, {
        prop: 'result',
        sortable: true,
        width: '90px',
        label: 'result'
      }, {
        prop: 'resultCode',
        sortable: true,
        width: '115px',
        label: 'resultCode'
      }, {
        prop: 'flagCode',
        sortable: true,
        width: '110px',
        label: 'flagCode'
      }, {
        prop: 'callNum',
        sortable: true,
        width: '100px',
        label: '调用总量'
      },{
        prop: 'downChargeNum',
        sortable: true,
        width: '120px',
        label: '下游计费量'
      },{
        prop: 'downCost',
        sortable: true,
        width: '120px',
        label: '下游计费'
      },{
        prop: 'upCost',
        sortable: true,
        width: '120px',
        label: '上游计费'
      },{
        prop: 'margin',
        sortable: true,
        label: '利润'
      }],
      columns1: [ {
        prop: 'serviceName',
        width: '150px',
        label: '服务名称'
      }, {
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
      }],
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
    Inquiry,
    Content,
    Table,
    Select,
    Dialog
  },
  computed: {
    ...mapGetters({
      basicsServiceList: "basics/basicsServiceList",
      basicsCustomerList: "basics/basicsCustomerList",
      queryByDateList: "tools/queryByDateList",
      queryByDateCollectInfoList: "tools/queryByDateCollectInfoList",
    }),
  },
  methods: {
    ...mapActions({
      getBasicServiceAjax: "basics/getBasicServiceAjax",
      getBasicCustomerAjax: "basics/getBasicCustomerAjax",
      getAllBasicServiceAjax: "basics/getAllBasicServiceAjax",
      getQueryByDateAjax: "tools/getQueryByDateAjax"
    }),
    initFun () {
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
      this.getQueryByDateAjax(options)
    },
    detail(value) {
      this.tableData3 = value
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
.el-form-item__content
  label
    line-height 40px
</style>

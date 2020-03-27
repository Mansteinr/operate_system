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
                :clearable="false"
                range-separator="至"
                :picker-options="pickerOptions2">
              </el-date-picker>
            </div>
          </el-form-item>
          <Select 
            :labelTitle="$t('m.basics.businessType')" 
            :originArr="businessTypesList" 
            :defaultValue="'typeId'" 
            :defaultLable="'typeName'"
            :isAll = true
            @changeType="changeType"> 
          </Select>
          <Select 
            :labelTitle="$t('m.basics.loginName')" 
            :originArr="basicsCustomerList" 
            :defaultValue="'loginName'" 
            :defaultLable="'customerName'"
            :needValue="'customerId'"
            :searchInput=true
            :isAll = true
            @changeInputValue="changeCustomer">
          </Select>
          <Select 
            :labelTitle="$t('m.basics.serviceName')" 
            :originArr="services" 
            :defaultValue="'serviceName'" 
            :searchInput = true
            :defaultLable="'serviceNameZh'">
          </Select>
          <el-form-item class="query-item">
           <query-button @reset="reset" @submit="onSubmit"></query-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="card-wrapper card-content">
      <div class="card-title">
        查询结果
        <el-button-group>
          <el-button :type="tabFlag?'':'primary'" :class="tabFlag?'':'active'" @click="switchTab(false)">图表</el-button>
          <el-button :type="tabFlag?'primary':''" :class="tabFlag?'active':''"  @click="switchTab(true)">数据</el-button>
        </el-button-group>
      </div>
      <div class="card-container">
        <div v-show="!tabFlag && !tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <div v-show="!tabFlag && tableData.length" class="charts" ref="charts" style="height:400px;width:100%;"></div>
        <Table class="table1" :tableData="tableData" :tatalPage="tableData.length" v-show="tabFlag" :columns="columns">
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import { reset } from '@/utils'
import Table from '@/base/Table'
import Select from '@/components/Select'
// import serviceSelect from '@/base/Select'
// import loginNameSelect from '@/base/Select'
import QueryButton from '@/base/QueryButton'
import { mapActions, mapState, mapGetters } from 'vuex'
import { setLineData, renderChart } from '@/common/js/myCharts'
import { switchMixin, hotKeyTime, businessType, loginName, services } from '@/common/js/mixin'

export default {
  mixins: [switchMixin, hotKeyTime, businessType, loginName, services],
  data () {
    return {
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
      },
      tableData: [],
      columns: [{
        prop: 'dayTime',
        sortable: true,
        label: '使用日期'
      }, {
        prop: 'usedCount',
        sortable: true,
        label: '共计使用量'
      },{
        prop: 'downChargedCount',
        label: '计费使用量',
        sortable: true,
      },{
        prop: 'downCost',
        sortable: true,
        formatter: (row, column) => {
          return row[column.property].toFixed(4)
        },
        label: '消费金额'
      }]
    }
  },
  components: {
    Table,
    Select,
    QueryButton,
    // serviceSelect,
    // loginNameSelect
  },
  computed: {
    ...mapGetters({
      businessTypesList: 'basics/businessTypesList',
      basicsServiceList: 'basics/basicsServiceList',
      basicsCustomerList: 'basics/basicsCustomerList',
      allBusinessTypesList: 'basics/allBusinessTypesList',
    })
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
      reset()
    },
    onSubmit () {
      let options = {}
      document.querySelectorAll('form input').forEach(v => {
        if (v.name && v.name != 'typeId') {
          options[v.name] = v.value
        }
      })
      this.UsageByDate(options)
    },
    UsageByDate (options) {
      $http(this.API.downApi.UsageByDate, options).then((res) => {
        let xAxisData = [], 
          series= [{
            name: '共计使用量',
            data:[]
          },{
            name: '计费使用量',
            data:[]
          },{
            name: '消费金额',
            data:[]
          }]
        this.tableData = res.resData
        if (this.tableData.length) {
          this.tableData.forEach(v => {
            xAxisData.push(v.dayTime)
            series[0].data.push(v.usedCount)
            series[1].data.push(v.downChargedCount)
            series[2].data.push(Math.floor(v.downCost * 100) / 100)
          })
          renderChart(this.$refs.charts, setLineData('总体情况-按日期统计', xAxisData, series))
        }
      })
    },
    ...mapActions({
      getBasicServiceAjax: 'basics/getBasicServiceAjax',
      getBasicCustomerAjax: 'basics/getBasicCustomerAjax',
      getAllBasicServiceAjax: 'basics/getAllBasicServiceAjax',
      getBasicBusinessTypesAjax: 'basics/getBasicBusinessTypesAjax'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

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
            ref="loginNameSelect"
            :labelTitle="'客户名称'" 
            :originArr="loginName" 
            :defaultValue="'loginName'" 
            :searchName="'loginName'"
            :defaultLable="'customerName'"
            :searchInput = true
            @changeInputValue="changeCustomer">
          </loginNameSelect>
          <el-form-item class="query-item">
           <query-button @reset="reset" @submit="onSubmit"></query-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="card-wrapper card-content">
      <div class="card-title">
        查询结果
      </div>
      <div class="card-container">
        <div v-show="!tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <Table class="table1" :tableData="tableData" :tatalPage="tableData.length" v-show="tableData.length">
          <el-table-column
            label="使用日期"
            sortable
            prop="dayTime">
          </el-table-column>
          <el-table-column
            label="共计使用量"
            sortable
            prop="usedCount">
          </el-table-column>
          <el-table-column
            label="计费使用量"
            sortable
            prop="downChargedCount">
          </el-table-column>
          <el-table-column
            label="消费金额"
            sortable
            prop="downCost">
          </el-table-column>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import { $http } from '../../common/js/ajax'
import { hotKeyTime, loginName } from '../../common/js/mixin'
import Table from '../../base/Table'
import loginNameSelect from '../../base/Select'
import QueryButton from '../../base/QueryButton'
export default {
  mixins: [hotKeyTime, loginName],
  data () {
    return {
      queryParams: {
        time: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],/**默认时间最近七天 */
      },
      tableData: []
    }
  },
  components: {
    Table,
    QueryButton,
    loginNameSelect
  },
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
    },
    onSubmit () {
      let options = {}
      document.querySelectorAll('form input').forEach(v => {
        if (v.name && v.name != 'typeId') {
          options[v.name] = v.value
        }
      })
      this.getBalanceSnapshot(options)
    },
    getBalanceSnapshot (options) {
      $http(this.API.downApi.getBalanceSnapshot, options).then((res) => {
          console.log(res)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

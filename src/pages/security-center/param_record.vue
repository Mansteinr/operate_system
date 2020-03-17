<template>
  <div class="template-wrapper">
        <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container clearfix">
        <el-form :inline="true" :rules="rules"  ref="querForm" :model="queryParams">
          <div class="show-query query-form">
            <el-form-item label="开始时间：" prop="beginTime">
              <div class="block">
                <el-date-picker
                  v-model="queryParams.beginTime"
                  type="datetime"
                  name="beginTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择开始时间">
                </el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="结束时间：" prop="endTime">
              <div class="block">
                <el-date-picker
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="queryParams.endTime"
                  placeholder="选择结束时间">
                </el-date-picker>
              </div>
            </el-form-item>
            <Select 
              :labelTitle="'客户名称'" 
              :originArr="loginName"
              :isAll="true"
              :defaultValue="'loginName'" 
              :defaultLable="'customerName'"
              @changeInputValue='changeCustomer'
              :searchInput="true"> 
            </Select>
            <Select 
              :labelTitle="'接口类型'" 
              :originArr="services" 
              :isAll="true"
              :defaultValue="'serviceName'" 
              :defaultLable="'serviceNameZh'"
              @changeInputValue='changeService'
              :searchInput="true"> 
            </Select>
            <el-form-item label="guid：" prop="guid">
              <el-input name="guid"></el-input>
            </el-form-item>
            <el-form-item class="query-item">
            <query-button @reset="reset" @submit="onSubmit"></query-button>
            </el-form-item>
          </div>
          <div class="qurey-btn" style="margin: 10px 0 0 10px;">
            <el-button class="query-button" size="small" @click="showHideToggle">{{showHideFlag?"显示":"隐藏"}}</el-button>
          </div>
          <div class="query-hide" ref="paramsBox" :class="showHideFlag?'active':''">
            <el-form-item class="search-item" label="是否密文：" prop="enParam" style="padding-left: 0px;width: 32%;width: calc(32% - 20px);">
              <el-radio v-model="queryParams.enParam" label="false">否</el-radio>
              <el-radio v-model="queryParams.enParam" label="true">是</el-radio>
            </el-form-item>
            <div class="search-item" v-for="(v, key) in paramsArr" :key="key">
              <label style="white-space: nowrap;overflow: hidden;" :title="`${v.paramNameCh}`" class="input-label">{{v.paramNameCh}}：</label>
              <input type="text" :name="v.paramName" class="m-input form-input" :placeholder="`请输入${v.paramNameCh}`">
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="card-wrapper card-content">
      <div class="card-title">
        查询结果
      </div>
      <div class="card-container">
        <div v-show="!tableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <Table 
          @changePage="changePage" 
          ref="table" class="table" 
          :showSearch="false" 
          :showSummary="false" 
          :tableData="tableData" 
          :tatalPage="tatalPage" 
          :sidePagination="'server'" 
          v-show="tableData.length">
          <el-table-column
            label="客户名称"
            width="120"
            fixed="left"
            prop="loginName">
          </el-table-column>
          <el-table-column
            label="规则名称"
            width="140"
            prop="regularName">
          </el-table-column>
          <el-table-column
            label="服务名称"
            width="250"
            prop="serviceName">
          </el-table-column>
          <el-table-column
            label="时间"
            width="150"
            prop="expireTime">
          </el-table-column>
          <el-table-column
            label="guid"
            width="270"
            prop="guid">
          </el-table-column>
          <el-table-column
            label="参数"
            width="220"
            prop="param">
            <template slot-scope="scope">
              <div v-html="formatterParams(scope.row.param)"></div>
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
            label="区分服务"
            width="80"
            prop="useService">
            <template slot-scope="scope">
              <div :class="{ 'link':scope.row.useService, 'mv-danger': !scope.row.useService }">{{scope.row.useService?'是':'否'}}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="组合服务"
            width="80"
            prop="combine">
            <template slot-scope="scope">
              <div :class="{ 'link':scope.row.combine, 'mv-danger': !scope.row.combine }">{{scope.row.combine?'是':'否'}}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
            width="100">
            <template slot-scope="scope">
              <div @click="handleRestore(scope.row)" :class="+new Date(scope.row.expireTime) < +new Date() ?'no-link':'link'">{{+new Date(scope.row.expireTime) < +new Date() ? '已恢复' : '恢复'}}</div>
            </template>
          </el-table-column>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 后台对接马超众
 * 
 * 1、若果用elenment中的input框 则必须使用数据双向绑定，不合适 故用该方法展示参数
 * 
 * 2、若没有参数 则也要穿个空param:{}
 * 
 * 3、不支持跨越查询, 故开始时间默认为当月1号零时零点零秒  结束时间为当前时间
 *
 */
import moment from 'moment'
import Table from '../../base/Table'
import Select from '../../base/Select'
import { showModal } from '../../utils'
import { $http } from '../../common/js/ajax'
import QueryButton from '../../base/QueryButton'
import { loginName, services } from '../../common/js/mixin'
export default {
  mixins: [ loginName, services ],
  data () {
    let timeRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择时间'));
      } else {
        callback()
      }
    }
    return {
      rules: {
        beginTime: [{ validator: timeRule, trigger: 'change' }],
        endTime: [{ validator: timeRule, trigger: 'change' }],
      },
      queryParams: {
        beginTime: moment(new Date(new Date().getFullYear(), new Date().getMonth(), 1)).format('YYYY-MM-DD HH:mm:ss'),
        limitNum: 10,
        skipNum: 0,
        endTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        enParam: false,
        param: {}
      },
      tableData: [],
      serviceParams: [],
      selectedObj: {},
      wordId: '',
      showHideFlag: false,
      paramsArr: [],
      allServiceNameFlag: true,
      tatalPage: 0,
      nowPage: 1,
      isRestore: '恢复'
    }
  },
  components: {
    Table,
    Select,
    QueryButton
  },
  methods: {
    changeService (val) {
      this.selectService({
        serviceId: val.serviceId,
        serviceName: val.serviceName,
        serviceNameZh: val.serviceNameZh
      })
    },
    reset () {
      this.$refs.querForm.resetFields()
    },
    onSubmit () {
      this.$refs.querForm.validate((valid) => {
        if (valid) {
          this.paramRecord()
        }
      })
    },
    formatterParams (val) { // 参数展示
      var html = '';
      for (var key in val) {
        var label = key
        switch (key) {
          case 'accountNo':
            label = '银行卡号'
            break;
          case 'idCard':
            label = '身份证号'
            break;
          case 'mobile':
            label = '手机号码'
            break;
          case 'name':
            label = '姓名'
            break;
          case 'plateNumber':
            label = '车牌号'
            break;
          case 'plateType':
            label = '号牌种类'
            break;
          default:
            label = key
            break;
        }
        // 只展示下面几个参数 其他不需要展示
        if (key == 'accountNo' || key == 'idCard' || key == 'mobile' || key == 'name' || key == 'plateNumber' || key == 'plateType') {
          html += '<span class="param-item" title="' + label + ': ' + val[key] + '">' + label + ': ' + val[key] + '</span>'
        }
      }
      return html
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
    changePage (val) {
      if (val.split('-')[0] === 'pageSize') {
        this.queryParams.limitNum = val.split('-')[1] / 1
      } else {
        this.queryParams.skipNum = (val.split('-')[1] / 1 - 1) * this.queryParams.limitNum
      }
      this.paramRecord()
    },
    showHideToggle() {
      this.showHideFlag = !this.showHideFlag
      this.queryParams.enParam = 'false'
    },
    selectService (v) {
      if (!this.showHideFlag) return
      if (!v.serviceName) return
      let _this = this
      $http(this.API.paramsApi.queryParamsByServiceName, v).then((res) => {
        this.paramsArr = res.resData.paramNameBeans
      })
    },
    // 恢复
    handleRestore(row) {
      if (+new Date(row.expireTime) < +new Date()) return
      let options = {
        paramRecordId: row.paramRecordId,
        insertTime: row.insertTime
      }
      this.$confirm('确定恢复?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        center: true
      }).then(() => {
        $http(this.API.secureApi.recoverUseful, options).then((res) => {
          showModal(res.resMsg[0].msgText)
          this.paramRecord()
        })
      }).catch(() => {
        
      })
    },
    // 获取所有的拦截记录
    paramRecord () {
      if (document.querySelector('[name="loginName"]').value) {
        this.queryParams.loginName = document.querySelector('[name="loginName"]').value.replace(/(^\s*)|(\s*$)/g, "")
      }
      if (document.querySelector('[name="serviceName"]').value) {
        this.queryParams.serviceName = document.querySelector('[name="serviceName"]').value.replace(/(^\s*)|(\s*$)/g, "")
      }
      if (document.querySelector('[name="guid"]').value) {
        this.queryParams.guid = document.querySelector('[name="guid"]').value.replace(/(^\s*)|(\s*$)/g, "")
      }
      

      let options = {}

      if (this.showHideFlag && document.querySelector('.query-hide .mv-input')) {
        document.querySelectorAll('.query-hide .mv-input input').forEach((v, k) => {
          if (v.name && v.value && v.value.replace(/(^\s*)|(\s*$)/g, "")) {
            options[v.name] =v.value.replace(/(^\s*)|(\s*$)/g, "")
          }
        })
      }
      this.queryParams.param = options
      let start = this.queryParams.beginTime.split('-')[1], end = this.queryParams.endTime.split('-')[1]
      if (start !== end) {
        showModal('不支持跨月查询', 'warning')
        return
      }
      $http(this.API.secureApi.paramRecord, this.queryParams).then((res) => {
        this.tableData = res.resData.result.slice(0,res.resData.result.length)
        this.tatalPage = res.resData.total
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
<style lang="stylus" rel="stylesheet/stylus">
.query-hide 
  transition height .3s
  height 0px
  overflow hidden
  &.active
    height 150px
  .search-item
    margin-bottom 10px

</style>

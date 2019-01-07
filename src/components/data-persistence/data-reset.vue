<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container clearfix">
        <el-form :inline="true" ref="querForm" :model="queryParams" class="query-form">
          <el-form-item label="接口类型：" prop="serviceName">
            <el-select filterable v-model="queryParams.persistId" placeholder="请选择">
              <el-option
                v-for="v in persistArr"
                v-show="v.persistId"
                :key="v.persistId"
                @click.native="selectService(v)"
                :title="`${v.persistName}(${v.persistId})`"
                :label="v.persistName"
                :value="v.persistId">
              </el-option>
            </el-select>
          </el-form-item>
          <div class="param-wrapper">
            <div class="param-middle" ref="paramMiddle">
              <div class="param-wrapper-box" v-for="(v, k) in paramsArr" :key="k">
                <i  :class="[k===0?'el-icon-remove-outlne':'el-icon-remove-outline']" @click="deleteItem" :data-index="k"></i>
                <el-input v-for="(v1, k1) in v" :name="`${v1}`"  :placeholder="`请输入${v1}`" :key="k1"></el-input>
              </div>
            </div>
            <i v-show="paramsKey.length" class="el-icon-circle-plus-outline" @click="addItem"></i>
          </div>
          <el-form-item class="query-item">
           <query-button @reset="reset" @submit="onSubmit"></query-button>
           <el-button v-show="isShowDelFlag" class="query-button" type="danger" @click="deleteFun">删除</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="card-wrapper card-content">
      <div class="card-title">
        查询结果
      </div>
      <div class="card-container">
        <div v-show="!tableData.length && !resTableData.length" ref="nocharts" class="no-charts" style="height:400px;width:100%;"></div>
        <Table ref="table" class="table" :showSummary="false" :tableData="tableData" :tatalPage="tableData.length" v-show="tableData.length">
          <el-table-column
            label="序号"
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            v-for="(v, k) in paramsKey"
            :key="k"
            :width="v === 'name' ? '80' : '180'"
            :label="formatterLabel(v)"
            prop="params">
             <template slot-scope="scope">{{scope.row.params[v]}}</template>
          </el-table-column>
          <el-table-column
            label="guid"
            width="260"
            prop="guid">
          </el-table-column>
          <el-table-column
            label="数据源"
            title="dataSource"
            prop="dataSource">
          </el-table-column>
          <el-table-column
            label="缓存时间"
            width="160"
            :formatter="formatter"
            prop="cacheTime">
          </el-table-column>
          <el-table-column
            label="查询结果"
            width="100"
            prop="result">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.result !== 'T' ? 'danger' : 'success'"
                  disable-transitions>{{scope.row.result | formatterResult}}</el-tag>
              </template>
          </el-table-column>
        </Table>
        <Table class="table" :showSummary="false" :tableData="resTableData" :tatalPage="resTableData.length" v-show="resTableData.length">
          <el-table-column
            label="序号"
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            v-for="(v, k) in paramsKey"
            :key="k"
            :label="formatterLabel(v)"
            prop="params">
             <template slot-scope="scope">{{scope.row[v]}}</template>
          </el-table-column>
          <el-table-column
            label="操作结果"
            prop="responeMessage">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.responeMessage !== '成功' ? 'danger' : 'success'"
                  disable-transitions>{{scope.row.responeMessage}}</el-tag>
              </template>
          </el-table-column>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import { $http } from '../../common/js/ajax'
import Table from '../../base/Table'
import QueryButton from '../../base/QueryButton'
import { checkIdCard, checkMoble, checkNumber, showModal } from '../../utils'
export default {
  data () {
    return {
      queryParams: {
        persistId: ''
      },
      tableData: [],
      resTableData: [],
      paramsArr: [], 
      paramsKey: [],
      persistArr: [],
      columnArr: [],
      isShowDelFlag: false
    }
  },
  components: {
    Table,
    QueryButton
  },
  mounted() {
    setTimeout(()=>{
      this.persistInfos()
    })
    document.addEventListener("change",(e) =>{
      e.target.classList.remove('m-error')
      if (!e.target.value) {
        showModal(`${e.target.name}不能为空`,'error')
        e.target.classList.add('m-error')
        return
      }
      if (e.target.name === 'idCard') {
        if (checkIdCard(e.target.value) !== '身份证校正通过') {
          showModal(checkIdCard(e.target.value),'error')
          e.target.classList.add('m-error')
        }
      } else if (e.target.name === 'accountNo') {
        if (!checkNumber(e.target.value)) {
          showModal('输入的不全是数字','error')
          e.target.classList.add('m-error')
        }
      } else if (e.target.name === 'mobile') {
        if (!checkMoble(e.target.value)) {
          showModal('请检查手机号码是否正确','error')
          e.target.classList.add('m-error')
        }
      }
    })
  },
  filters: {
    formatterResult(val) {
      let label = ''
      switch (val) {
        case 'D':
          label = '未查询到'
          break;
        case 'T':
          label = '一致'
          break;
        case 'F':
          label = '不一致'
          break;
        case '-1':
          label = '参数错误'
          break;
        default:
          label = val
          break;
      }
      return label
    }
  },
  methods: {
    reset () {
      this.tableData = []
      this.resTableData = []
      this.paramsArr = []
      this.paramsKey = []
    },
    deleteFun () {
      let tableArr = []
      tableArr = [...tableArr, ...this.tableData]
      tableArr.forEach(v => {
        let op = {
          persistId: v.persistId,
          params: v.params
        }
        $http(this.API.persistApi.persistDel, op).then((res)=>{
          this.tableData = []
          this.isShowDelFlag = false
          this.resTableData.push(Object.assign(v.params,{responeMessage: res.resMsg[0].msgText}))
        })
      })
    },
    onSubmit () {
      this.tableData = []
      let arr = [], isNullFlag = false
      Array.from(document.querySelectorAll('.param-wrapper-box')).forEach(v => {
        let options = {
          persistId: this.queryParams.persistId
        }
        options.params = {}
        Array.from(v.getElementsByTagName('input')).forEach(v1 => {
          if (!v1.value || v1.classList.contains('m-error')) {
            isNullFlag = true
          } else {
            options.params[v1.name] = v1.value
          }
        })
        arr.push(options)
      })

      if (arr.length && isNullFlag) {
        showModal('参数有空或者错误，请检查','error')
        return
      }
      this.resTableData = []
      arr.forEach(v => {
        this.persistQuery(v)
      })
    },
    selectService(val) {
      this.paramsArr = []
      this.paramsKey = []
      this.paramsKey = val.keys
      this.paramsArr.push(this.paramsKey)
    },
    addItem: function () {
      this.paramsArr.push(this.paramsKey)
    },
    deleteItem (e,k) {
      e.target.parentNode.remove(true)
    },
    formatter (val) {
      return this.$refs.table.formatterTime(val.cacheTime)
    },
    formatterLabel (val) {
      let label = ''
      switch (val) {
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
          label = val
          break;
      }
     return label
    },
    persistInfos () {
      $http(this.API.persistApi.persistInfos, {}).then((res)=>{
        this.persistArr = res.resData
      })
    },
    persistQuery (op) {
      $http(this.API.persistApi.persistQuery, op).then((res) => {
        let obj =JSON.parse(res.resData).tail? JSON.parse(JSON.parse(res.resData).tail) : JSON.parse(res.resData)
        obj.result = JSON.parse(res.resData).result
        if (obj.result === 'T') {
          this.isShowDelFlag = true
        }
        Object.assign(obj, op)
        this.tableData.push(obj)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
.param-wrapper
  position relative
  padding-right 30px
  .el-icon-circle-plus-outline
    position absolute
    right 0px
    height 40px
    bottom 0px
  .param-middle
    max-height 300px
    overflow auto
    .param-wrapper-box
      display flex
      margin-top 10px
      .el-input
        margin-right 5px
        flex 1
        &:last-child
          margin-right 0px !important
[class^=el-icon-]
  font-size 20px
  width 30px
  display flex
  align-items center    //垂直方向的居中
  justify-content center//水平方向的居中
  cursor pointer
</style>

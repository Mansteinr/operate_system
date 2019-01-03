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
        <Table ref="table" class="table" :showSummary="false" :tableData="tableData" :tatalPage="tableData.length" v-show="tableData.length">
          <el-table-column
            label="结果"
            width="80"
            prop="rsp.MESSAGE">
          </el-table-column>
          <el-table-column
            label="状态"
            width="100"
            prop="rsp.RESULT">
          </el-table-column>
          <el-table-column
            label="数据源"
            sortable
            prop="tail.dataSource">
          </el-table-column>
          <el-table-column
            label="缓存时间"
            width="200"
            :formatter="formatter"
            prop="tail.cacheTime">
          </el-table-column>
          <el-table-column
            label="guid"
            prop="tail.guid">
          </el-table-column>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import $http from '../../common/js/ajax'
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
      paramsArr: [], 
      paramsKey: [],
      persistArr: []
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
  methods: {
    reset () {
      this.$refs.querForm.resetFields()
    },
    onSubmit () {
      let arr = [], isNullFlag = false
      Array.from(document.querySelectorAll('.param-wrapper-box')).forEach(v => {
        let options = {
          persistId: this.queryParams.persistId
        }
        options.params = {}
        Array.from(v.getElementsByTagName('input')).forEach(v1 => {
          if (!v1.value) {
            isNullFlag = true
          } else {
            options.params[v1.name] = v1.value
          }
        })
        arr.push(options)
        // this.persistQuery(options)
      })

      if (arr.length && isNullFlag) {
        showModal('参数有空的，请检查','error')
      }
      
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
      return this.$refs.table.formatterTime(val.tail.cacheTime)
    },
    persistInfos () {
      $http(this.API.persistApi.persistInfos, {}).then((res)=>{
        this.persistArr = res.resData
      })
    },
    persistQuery (op) {
      $http(this.API.persistApi.persistQuery, op).then((res) => {
        console.log(res)
        // this.tableData.push(res.resData)
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

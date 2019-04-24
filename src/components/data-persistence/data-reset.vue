<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container clearfix">
        <el-form :inline="true" ref="querForm" :model="queryParams" class="query-form">
          <Select
            :labelTitle="'接口类型'"
            :originArr="persistArr"
            :defaultValue="'persistId'" 
            @changeInputValue="changePersist"
            :defaultLable="'persistName'"
          ></Select>
          <div class="param-wrapper">
            <div class="param-middle" ref="paramMiddle">
              <div class="param-wrapper-box" v-for="(v, k) in paramsArr" :key="k">
                <i  :class="[k===0?'el-icon-remove-outlne':'el-icon-remove-outline']" @click="deleteItem" :data-index="k"></i>
                <el-input v-for="(v1, k1) in v" :name="`${v1}`"  :placeholder="`请输入${v1}`" :key="k1"></el-input>
              </div>
            </div>
            <i v-show="paramsKey.length" class="el-icon-circle-plus-outline" @click="addItem"></i>
          </div>
          <el-form-item class="query-button-box">
           <query-button @reset="reset" @submit="onSubmit"></query-button>
           <el-button v-show="isShowDelFlag" class="query-button" type="danger" key="button" @click="deleteFun">删除</el-button>
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
        <Table ref="table" :columns="column" :showSummary="false"  :key="index" :tableData="tableData" :tatalPage="tableData.length" v-show="tableData.length">
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 后台对接 查询删除门淑敏  获取接口名称接口 由研发中心 张树形提供
 * 要点：
 *  后台删除接口不支持批量删除，故由前台讲参数存储在一个数组中，在利用循环遍历，逐个删除
 *  
 *  查询之后 只有查询结果中有一致的 才显示删除按钮
 * 
 *  删除成功之后 需要将参数也展示出来 但是后台没返回查询时的参数 需要前端自己组装 故导致前端生成table时 比较乱
 * 
 * 
 */
import Table from '../../base/Table'
import Select from '../../base/Select'
import { $http } from '../../common/js/ajax'
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
      column: [],
      index: 1, // element table复用容易报错 故添加个动态的key即可
      isShowDelFlag: false
    }
  },
  components: {
    Table,
    Select,
    QueryButton
  },
  mounted() {
    this.persistInfos()
    document.addEventListener("change",(e) =>{ // 输入参数时  进行参数校验
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
    formatterResult(val) { // 汉化
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
    },
    reset () {
      this.tableData = []
      this.resTableData = []
      this.paramsArr = []
      this.paramsKey = []
    },
    deleteFun () {
      this.index += 1
      let tableArr = []
      tableArr = [...tableArr, ...this.tableData]
      this.column = []
      this.column = [...this.column, ...[{
        label: '序号',
        width: '50px',
        type: 'index'
      }]]
      this.paramsKey.map(v => {
        this.column = [...this.column, ...[{
          label: this.formatterLabel(v),
          prop: v
        }]]
      })

      this.column = [...this.column, ...[{
        label: '查询结果',
        prop: 'responeMessage'
      }]]

      tableArr.forEach(v => {
        let op = {
          persistId: v.persistId,
          params: v.params
        }
        this.tableData = []
        $http(this.API.persistApi.persistDel, op).then((res)=>{
          this.isShowDelFlag = false
          this.tableData.push(Object.assign(v.params,{responeMessage: res.resMsg[0].msgText}))
        })
      })
    },
    changePersist (v) {
      this.paramsArr = []
      this.paramsKey = []
      this.paramsKey = v.keys
      this.paramsArr.push(this.paramsKey)
    },
    onSubmit () {
      let arr = [], isNullFlag = false
      Array.from(document.querySelectorAll('.param-wrapper-box')).forEach(v => {
        let options = {
          persistId: document.querySelector('[name="persistId"]').value
        }
        options.params = {}
        Array.from(v.getElementsByTagName('input')).forEach(v1 => {
          if (!v1.value || v1.classList.contains('m-error')) { // 检测参数是否有错误
            isNullFlag = true
          } else {
            options.params[v1.name] = v1.value.replace(/(^\s*)|(\s*$)/g, "") // 组装参数 并去除两端空格
          }
        })
        arr.push(options)
      })
      if (arr.length && isNullFlag) {
        showModal('参数有空或者错误，请检查','error')
        return
      }
      this.tableData = []
      this.resTableData = []
      arr.forEach(v => {
        this.persistQuery(v)
      })
    },
    addItem: function () {
      this.paramsArr.push(this.paramsKey)
    },
    deleteItem (e,k) {
      e.target.parentNode.remove(true)
    },
    formatterLabel (val) { // 参数汉化
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
      this.paramsArr = []
      $http(this.API.persistApi.persistInfos, {}).then((res)=>{
        this.persistArr = []
        res.resData.forEach(v => {
          if (v.persistId) {
            this.persistArr.push(v)
          }
        })
        this.paramsArr.push(this.persistArr[0].keys)
        this.paramsKey = this.persistArr[0].keys
      })
    },
    persistQuery (op) {
      $http(this.API.persistApi.persistQuery, op).then((res) => {
        this.index += 1
        let obj =JSON.parse(res.resData).tail? JSON.parse(JSON.parse(res.resData).tail) : JSON.parse(res.resData)
        obj.result = JSON.parse(res.resData).result
        obj.formatterResult = this.formatterResult(obj.result)

        if (obj.result === 'T') {
          this.isShowDelFlag = true
        }
        this.column = []
        this.column = [...this.column, ...[{
          label: '序号',
          width: '50px',
          type: 'index'
        }, {
          label: 'guid',
          width: '270px',
          prop: 'guid'
        }]]
        this.paramsKey.map(v => {
          this.column = [...this.column, ...[{
            label: this.formatterLabel(v),
            prop: 'params' + '[' + v + ']'
          }]]
        })

        this.column = [...this.column, ...[{
          label: '查询结果',
          prop: 'formatterResult'
        }]]
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
  width 60%
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
      margin-bottom 5px
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
.query-button-box
  display block
  width 100%
</style>

<template>
  <div class="table">
    <el-row :gutter="5" v-show="showSearch">
      <el-col :span="4" :offset="19"><el-input v-model.trim="search" size="mini" placeholder="请输入关键字"/></el-col>
      <el-col :span="1" class='export-wrapper'>
        <div class="select-dropdown m-input">
          <div class="text-warp selected-value" @click.stop.prevent="toggleExport($event)"></div>
          <ul class="dropdown-menu">
            <li class="dropdown-item text-warp" @click.self="exportExcel('xlsx',$event)">xlsx</li>
            <li class="dropdown-item text-warp" @click.self="exportExcel('xml',$event)">xml</li>
            <li class="dropdown-item text-warp" @click.self="exportExcel('csv',$event)">csv</li>
            <li class="dropdown-item text-warp" @click.self="exportExcel('txt',$event)">txt</li>
          </ul>
        </div>
      </el-col>
    </el-row>
    
    <el-table
      id="out-table"
      :data="sidePagination === 'customer' ? tableDataComputed.slice(start, end) : tableData"
      :show-summary="showSummary"
      :summary-method="getSummaries"
      :stripe="true"
      :span-method="mergeCell?objectSpanMethod:null"
      :border="isBorder"
      style="width: 100%">
        <!-- <slot></slot> -->
        <template  v-for="(v, k) in columns">
          <el-table-column
            :key="k"
            v-if="v.label != '操作' && v.label != 'guid' && v.label != '参数' && v.label != '渠道' && v.label !='车保报告'"
            :label="v.label"
            :fixed="v.fixed"
            :width="v.width"
            :min-width="v.minWidth"
            :show-overflow-tooltip="v.showOverflow?v.showOverflow:true"
            :formatter="v.formatter"
            :sortable="v.sortable"
            :type="v.type"
            :prop='v.prop'>
          </el-table-column>
          <el-table-column
            :key="k"
            v-else-if="v.label == '操作' || v.label == '车保报告'"
            :width="v.width"
            :label="v.label"
          >
            <template slot-scope="scope">
            <el-button
              v-for="(v1, k1) in v.prop"
              :key="k1"
              plain
              :disabled="v.disabled"
              :type="v1.type?v1.type:'primary'"
              :size="v1.size?v1.size:'mini'"
              @click="handle(scope.row, v1.method)">{{v1.keyWord}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            :key="k"
            v-else-if="v.label == 'guid'"
            :prop="v.prop"
            :width="v.width"
            :label="v.label"
          >
            <template slot-scope="scope">
              <div class="link" @click="queryGuid(scope.row[v.prop])">{{scope.row[v.prop]}}</div>
            </template>
          </el-table-column>
          <el-table-column
            :key="k"
            v-else-if="v.label == '参数'"
            :prop="v.prop"
            :width="v.width"
            :label="v.label"
          >
            <template slot-scope="scope">
              <div v-html="scope.row.param?formatterParams(scope.row.param):formatterParamsArrobj(scope.row.paramNameBeans)"></div>
            </template>
          </el-table-column>
          <el-table-column
            :key="k"
            v-else-if="v.label == '渠道'"
            :prop="v.prop"
            :width="v.width"
            :label="v.label"
          >
            <template slot-scope="scope">
              <div v-html="formatterSrc(scope.row.srcQueryReturnList)"></div>
            </template>
          </el-table-column>
        </template>
    </el-table>
    <Pagination @changePage="changePage" :tatalPage="sidePagination === 'customer' ? total : tatalPage" v-show="tatalPage>1"></Pagination>
    <Guid :dialogVisible="dialogVisible" :data="josn" @changeDialog="changeDialog"></Guid>
  </div>
</template>

<script>
/**
 * 支持多选 单选 搜索 前端分页 后端分页 前端导出excel txt等格式 单元格合并
 */
  import XLSX from 'xlsx'
  import Guid from './Guid'
  import moment from 'moment'
  import FileSaver from 'file-saver'
  import { Loading } from 'element-ui'
  import Pagination from './Pagination'
  import { $http } from '../common/js/ajax'
  export default {
    data () {
      return {
        end: 10,
        start:0,
        josn: {},
        Dom: null,
        search: '',
        pageSize: 10,
        parentDom: [],
        currentPage: 1,
        stopFlag: true,
        selectValue: 'xlsx',
        dialogVisible: false,
        spanArr: [] // 合并单元格时 统计需要合并单元格数量
      }
    },
    props: {
      tatalPage: {
        type: Number,
        default: 0
      },
      tableData: {
        type: Array,
        default: () => []
      },
      showSummary: {
        type: Boolean,
        default: true
      },
      showSearch: {
        type: Boolean,
        default: true
      },
      sidePagination: {
        type: String,
        default: 'customer'
      },
      selector: {
        type: String,
        default: 'table1'
      },
      columns: { // 定义表格
        type: Array,
        default: () => []
      },
      isBorder: { // 是否现在网格
        type: Boolean,
        default: false
      },
      mergeCell: { // 合并单元格
        type: String,
        default: ''
      }
    },
    components: {
      Guid,
      Pagination
    },
    methods: {
      handle(row, method) {
        this.$emit('handle', row, method)
      },
      queryGuid (val) {
        $http(this.API.upApi.logDetail, {'guid': val}).then((res) => {
          this.dialogVisible = true
          this.josn = res.resData || {}
        })
      },
      changeDialog (val) {
        this.dialogVisible = val
      },
      getSummaries (param) {
        const { columns } = param
        const sums = []
        columns.forEach((column, index) => {
          if (!column || column.label === '操作') return
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          // column.property 为自己定义的 data为table中的数据 即会计算当前页面的总和
          // const values = data.map(item => Number(item[column.property]))
          const values = this.tableDataComputed.map(item => 
            (column.property.toLowerCase().indexOf('time')>-1||column.property.toLowerCase().indexOf('date')>-1||column.property.toLowerCase().indexOf('day')>-1)? Number(item[column.property])+',' : Number(item[column.property])
          )
          // !values.some(value => isNaN(value)) 是判断数组中是否含有NaN
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index]
          } else {
            sums[index] = '-'
          }
        })
        sums.forEach((v, k) => { // 保留两位
          if (Number(v)) {
            sums[k] = Math.round(v * 100) / 100 // 防止出现很多为小数
          }
        })
        return sums
      },
      formatterTime (val) {
        return moment(val).format('YYYY-MM-DD HH:mm:ss')
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
      formatterParamsArrobj (val) { // 参数展示
        var html = ''
        if (!val.length) return
        val.forEach( v=> {
          html += `<span class="param-item" title="${v.paramName}">${v.paramNameCh} : ${v.paramName} </span>`
        })
        return html
      },
      formatterParamsArr (val) { // 参数展示
        var html = ''
        if (!val.length) return
        val.forEach( v=> {
          html += `<span class="param-item" title="${v}">${v} </span>`
        })
        return html
      },
      changePage (value) {
        this.$emit('changePage', value)
        this[value.split('-')[0]] = value.split('-')[1] / 1
        this.start = this.pageSize * (this.currentPage - 1)
        this.end = Math.min(this.pageSize * (this.currentPage), this.tableData.length)
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {  // 合并单元格
        if (columnIndex === 0) {
            const _row = this.spanArr[rowIndex];
            const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      },
      getSpanArr(data) {  // 统计需要合并的格数
        if (data.length <= 0) return // 没数据时 直接返回
        this.spanArr = []
        for (var i = 0; i < data.length; i++) {
          if (i === 0) {
            this.spanArr.push(1);
            this.pos = 0
          } else {
            // 判断当前元素与上一个元素是否相同
            if (data[i][this.mergeCell] === data[i - 1][this.mergeCell]) {
              this.spanArr[this.pos] += 1
              this.spanArr.push(0)
            } else {
              this.spanArr.push(1)
              this.pos = i
            }
          }
        }
      },
      toggleExport (e) {
        let classNames = e.target.parentNode.className
          if ( classNames.indexOf('active') < 0 ) { 
            e.target.parentNode.className = e.target.parentNode.className + ' active'
          } else {
            e.target.parentNode.className = e.target.parentNode.className.replace(' active', '')
          }
      },
      irateror (dom) { // 递归 寻找table父元素
        this.parentDom.push(dom)
        if (dom.className && dom.className.indexOf('table') < 0) {
          this.irateror(dom.parentNode)
        } else {
          return dom
        }
      },
      formatterSrc (val) {
        if (val && val.length) {
          let html = ''
          val.forEach(v => {
            if (v.className) {
              html += `<span class="param-item" title="渠道名称: ${v.className.split('.')[2]}  ${v["invokeCostTime"]}">渠道名称: ${v.className.split('.')[2]}  ${v["invokeCostTime"]}</span>`
            }
          })
          return html
        }
      },
      exportExcel (kind, e) { // 导出excel
        this.parentDom = [] // 清空数据防止遗留数据影响
        this.irateror(e.target)
        const loading = Loading.service({
          lock: true,
          text: '下载中…',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        if (this.tableData.length > 10) {
          let ul = this.parentDom[this.parentDom.length-1].querySelector('.el-select-dropdown__list')
          let lis = ul.getElementsByTagName('li')
          lis[lis.length -1].click()
          this.$nextTick(() => {
            setTimeout(()=> {
              var wb = XLSX.utils.table_to_book(this.parentDom[this.parentDom.length-1])
              var wbout = XLSX.write(wb, { bookType: kind, bookSST: true, type: 'array' })
              try {
                  FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'download.' + kind)
              } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
              loading.close()
              lis[0].click()
              return wbout
            }, 1000)
          })
        } else {
          var wb = XLSX.utils.table_to_book(this.parentDom[this.parentDom.length-1])
          var wbout = XLSX.write(wb, { bookType: kind, bookSST: true, type: 'array' })
          try {
              FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'download.' + kind)
          } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
          loading.close()
          return wbout
        }
      }
    },
    computed: {
      tableDataComputed (param) {
        const { $children } = param, searchKeys = [], search = this.search
        $children.map(v => {
          if (v.$el.className.indexOf('el-table') > -1) {
            v.columns.map(v1 => {
              searchKeys.push(v1.property)
            })
          }
        })
        if (search) {
          return this.tableData.filter(v => {
            return searchKeys.some(key => {
              // 非对象
              if (typeof v[key] !== 'object') {
                if (Number.isInteger(v[key]/1) && (v[key]/1 > +new Date())) { // 可能时间戳
                  return moment(v[key]).format('YYYYMMDD HH:mm:ss').indexOf(search) > -1 || moment(v[key]).format('YYYY/MM/DD HH:mm:ss').indexOf(search) > -1 || moment(v[key]).format('YYYY-MM-DD HH:mm:ss').indexOf(search) > -1 
                } else {
                  return String(v[key]).toLowerCase().indexOf(search) > -1
                }
              } else { 
                // 数组
                if (Array.isArray(v[key])) {
                  return v[key].includes(search)
                } else {
                  if (key.indexOf('?') === -1) { // 带有参数的
                    Object.keys(v[key]).some(objKey => {
                      return String(v[key][objKey]).toLowerCase().indexOf(search) > -1
                    })
                  } else { // 带有参数的 防止过多的搜索
                    key.split('?')[1].split('&').some(arrKey => {
                      return String(v[key][arrKey]).toLowerCase().indexOf(search) > -1
                    })
                  }
                }
              }
            })
          })
        }
        if (this.mergeCell) {
          this.getSpanArr(this.tableData)
        }
        return this.tableData
      },
      total () {
        return this.tableDataComputed.length
      }
    }
  }
</script>
<style lang="stylus">
.export-wrapper
  .selected-value
    position relative
    height 100%
    padding-right 12px
    &:after
      content ''
      font-family "element-icons" !important
      font-size 12px
      content "\E617"
      color #999
      position absolute
      left 50%
      margin-left -6px 
      color white
</style>

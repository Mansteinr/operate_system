<template>
  <div class="table">
    <!-- 导出文件组件 -->
    <Export
      :showSearch="showSearch"
      :showPlusIcon="showPlusIcon"
      @addFun = "addFun"
      @searchChange="searchChange"
      :data="this.tableData"/>
    <el-table
      id="out-table"
      :data="sidePagination === 'customer' ? tableDataComputed.slice(start, end) : tableData"
      :show-summary="showSummary"
      :summary-method="getSummaries"
      :stripe="true"
      :span-method="mergeCell?objectSpanMethod:null"
      :border="isBorder"
      @selection-change="handleSelectionChange"
      style="width: 100%">
        <slot name="selection"></slot>
        <template  v-for="(v, k) in columns">
          <el-table-column
            v-if="v.type === 'image'"
            :key="k"
            :label="v.label"
            :fixed="v.fixed"
            :class-name="v.className"
            :width="v.width"
            :align="v.align"
            :min-width="v.minWidth"
            :show-overflow-tooltip="v.showOverflow?v.showOverflow:true"
            :formatter="v.formatter"
            :sortable="v.sortable"
            :type="v.type"
            :prop='v.prop'>
            <template slot-scope="scope">
              <el-image style="width: 34px; height: 34px"
                :alt="v.urlType === 'base64' ? `data:image/jpeg;base64,${scope.row[v.prop]}` : scope.row[v.prop]"
                :src="v.urlType === 'base64' ? `data:image/jpeg;base64,${scope.row[v.prop]}` : scope.row[v.prop]"
                fit="contain"></el-image>
            </template>
          </el-table-column>
          <el-table-column
            v-else-if="v.template"
            :key="k"
            :label="v.label"
            :fixed="v.fixed"
            :class-name="v.className"
            :width="v.width"
            :align="v.align"
            :min-width="v.minWidth"
            :show-overflow-tooltip="v.showOverflow?v.showOverflow:true"
            :formatter="v.formatter"
            :sortable="v.sortable"
            :type="v.type"
            :prop='v.prop'>
            <template slot-scope="scope">
              <div v-html="v.template(scope)"></div>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="k"
            :label="v.label"
            :fixed="v.fixed"
            :class-name="v.className"
            :width="v.width"
            :align="v.align"
            :min-width="v.minWidth"
            :show-overflow-tooltip="v.showOverflow?v.showOverflow:true"
            :formatter="v.formatter"
            :sortable="v.sortable"
            :type="v.type"
            :prop='v.prop'>
          </el-table-column>
        </template>
        <slot name="tableTail"></slot>
    </el-table>
    <Pagination 
      @changePage="changePage" 
      :tatalPage="sidePagination === 'customer' ? total : tatalPage" 
      v-show="tatalPage>1"></Pagination>
    <Guid 
      :dialogVisible="dialogVisible" 
      :data="josn" 
      @changeDialog="changeDialog"></Guid>
  </div>
</template>

<script>
/**
 * 支持多选 单选 搜索 前端分页 后端分页 前端导出excel txt等格式 单元格合并
 */
  
  import Guid from '../Guid'
  import moment from 'moment'
  import Export from '../Export'
  import Pagination from '../Pagination'
  import { $http } from '../../common/js/ajax'
  export default {
    data () {
      return {
        end: 10,
        start:0,
        josn: {},
        search: '',
        pageSize: 10,
        currentPage: 1,
        dialogVisible: false,
        spanArr: [] // 合并单元格时 统计需要合并单元格数量
      }
    },
    props: {
      showPlusIcon: {
        type: Boolean,
        default: false
      },
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
      Export,
      Pagination
    },
    methods: {
      searchChange(value) {
        this.search = value
        console.log(value, 'searchChange')
      },
      handleSelectionChange(val) {
        this.$emit('handleSelectionChange', val)
      },
      addFun() {
        this.$emit('addFun')
      },
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
      //  let val = {}
      //  for(let k in value) {
      //    val[k] = value[k]
      //  }
      //  console.log(val)
      //  return
        let html = ''
        for (let key in val) {
         if (key !== 'guid' && key !== 'image' && key !== 'shaIdCard' && key !== 'shaName' && key !== 'shaMobile') { // 不需要展示guid
            html += '<span class="param-item" title="' + key + ': ' + val[key] + '">' + key + ': ' + val[key] + '</span>'
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
      objectSpanMethod({ rowIndex, columnIndex }) {  // 合并单元格
        if (columnIndex === 0) {
          return {
            rowspan: this.spanArr[rowIndex],
            colspan: 1
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
              this.spanArr[this.pos] += 1 // 索引加1
              this.spanArr.push(0)  // 索引加1之后 push 0
            } else {
              this.spanArr.push(1) //不同之后 直接push 1
              this.pos = i
            }
          }
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

</style>

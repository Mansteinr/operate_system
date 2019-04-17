<template>
  <div>
    <el-row :gutter="5" v-show="showSearch">
      <el-col :span="4" :offset="19"><el-input v-model.trim="search" size="mini" placeholder="请输入关键字"/></el-col>
      <el-col :span="1">
        <el-dropdown>
          <el-button type="primary" size="mini">
            <i class="el-icon-download"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="exportExcel('xlsx')">excel</el-dropdown-item>
            <el-dropdown-item @click.native="exportExcel('xml')">xml</el-dropdown-item>
            <el-dropdown-item @click.native="exportExcel('csv')">csv</el-dropdown-item>
            <el-dropdown-item @click.native="exportExcel('txt')">txt</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    
    <el-table
      id="out-table"
      :data="sidePagination === 'customer' ? tableDataComputed.slice(start, end) : tableData"
      :show-summary="showSummary"
      :summary-method="getSummaries"
      :stripe="true"
      style="width: 100%">
        <!-- <slot></slot> -->
        <el-table-column
          v-for="(v, k) in columns"
          :key="k"
          :label="v.label"
          :fixed="v.fixed"
          :formatter="v.formatter"
          :sortable="v.sortable"
          :prop='v.prop'>
        </el-table-column>
    </el-table>
    <Pagination @changePage="changePage" :tatalPage="sidePagination === 'customer' ? total : tatalPage" v-show="tatalPage>1"></Pagination>
    <Guid :dialogVisible="dialogVisible" :data="josn" @changeDialog="changeDialog"></Guid>
  </div>
</template>

<script>
  import Pagination from './Pagination'
  import moment from 'moment'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  import { Loading } from 'element-ui'
  import Guid from './Guid'
  import { $http } from '../common/js/ajax'
  export default {
    data () {
      return {
        currentPage: 1,
        pageSize: 10,
        search: '',
        start:0,
        end: 10,
        dialogVisible: false,
        josn: {}
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
      columns: {
        type: Array,
        default: () => []
      }
    },
    components: {
      Pagination,
      Guid
    },
    methods: {
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
          if (!column) return
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
      exportExcel (kind) { // 导出excel
        const loading = Loading.service({
          lock: true,
          text: '下载中…',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        if (this.tableData.length > 10) {
          let parentDOm = document.querySelector('.' + this.selector)
          let ul = parentDOm.getElementsByClassName('el-select-dropdown__list')[0]
          let lis = ul.getElementsByTagName('li')
          lis[lis.length -1].click()
          this.$nextTick(() => {
            setTimeout(()=> {
              var wb = XLSX.utils.table_to_book(document.querySelector('.' + this.selector))
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
          var wb = XLSX.utils.table_to_book(document.querySelector('.' + this.selector))
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
        return this.tableData
      },
      total () {
        return this.tableDataComputed.length
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
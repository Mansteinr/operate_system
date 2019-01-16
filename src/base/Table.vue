<template>
  <div>
    <el-input v-model.trim="search" v-show="showSearch" size="mini" class="serarch-input" placeholder="请输入关键字"/>
    <el-table
      :data="sidePagination === 'customer' ? tableDataComputed.slice(start, end) : tableData"
      :show-summary="showSummary"
      :summary-method="getSummaries"
      :stripe="true"
      style="width: 100%">
        <slot></slot>
    </el-table>
    <Pagination @changePage="changePage" :tatalPage="sidePagination === 'customer' ? total : tatalPage" v-show="tatalPage>1"></Pagination>
  </div>
</template>

<script>
  import Pagination from './Pagination'
  import moment from 'moment'
  export default {
    data () {
      return {
        currentPage: 1,
        pageSize: 10,
        search: '',
        start:0,
        end: 10,
        serarchItems: []
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
      }
    },
    components: {
      Pagination
    },
    methods: {
      getSummaries (param) {
        const { columns, data } = param
        this.serarchItems = columns
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          // column.property 为自己定义的 data为table中的数据 即会计算当前页面的总和
          // const values = data.map(item => Number(item[column.property]))
          const values = this.tableDataComputed.map(item => Number(item[column.property]))
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
            sums[index] = ''
          }
        })
        sums.forEach((v, k) => {
          if (Number(v)) {
            sums[k] = Math.round(v * 100) / 100
          }
        })
        return sums
      },
      formatter (val, param="downCost") {
        return Math.round(val[param] * 100) / 100
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
      }
    },
    computed: {
      tableDataComputed () {
        const search = this.search
        if (search) {
         return this.tableData.filter(v => {
            return Object.keys(v).some(key => {
              return String(v[key]).toLowerCase().indexOf(search) > -1
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
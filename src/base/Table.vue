<template>
  <div>
    <el-input v-model="search" size="mini" class="serarch-input" placeholder="请输入关键字"/>
    <el-table
      class="table"
      :data="tableDataComputed.filter(data => filterTable(data))"
      :show-summary="showSummary"
      :summary-method="getSummaries"
      style="width: 100%">
        <slot></slot>
    </el-table>
    <Pagination @changePage="changePage" :tatalPage="tatalPage"></Pagination>
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
      }
    },
    components: {
      Pagination
    },
    methods: {
      getSummaries (param) {
        const { columns } = param
        // this.columns = columns
        this.serarchItems = columns
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          // column.property 为自己定义的 data为table中的数据 即会计算当前页面的总和
          // const values = data.map(item => Number(item[column.property]))
          const values = this.tableData.map(item => Number(item[column.property]))
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
      handleSizeChange (val) {
        if (val) {
          this.pageSize = val
        } else {
          this.pageSize = this.tableData.length
        }
      },
      formatter (val, param="downCost") {
        return Math.round(val[param] * 100) / 100
      },
      formatterTime (val) {
        return moment(val).format('YYYY-MM-DD HH:mm:ss')
      },
      filterTable (data) {
        // if (!this.search) {
        //   return true
        // } else {
        //   data.forEach(v => {
        //     console.log(v.dayTime.toLowerCase().includes(this.search.toLowerCase()) || (v.usedCount + '').toLowerCase().includes(this.search.toLowerCase()) || (v.downChargedCount + '').toLowerCase().includes(this.search.toLowerCase()) || (v.downCost + '').toLowerCase().includes(this.search.toLowerCase()))
        //     return v.dayTime.toLowerCase().includes(this.search.toLowerCase()) || (v.usedCount + '').toLowerCase().includes(this.search.toLowerCase()) || (v.downChargedCount + '').toLowerCase().includes(this.search.toLowerCase()) || (v.downCost + '').toLowerCase().includes(this.search.toLowerCase())
        //   })
        // }
        return !this.search || data.dayTime.toLowerCase().includes(this.search.toLowerCase()) || (data.usedCount + '').toLowerCase().includes(this.search.toLowerCase()) || (data.downChargedCount + '').toLowerCase().includes(this.search.toLowerCase()) || (data.downCost + '').toLowerCase().includes(this.search.toLowerCase())
      },
      handleCurrentChange (val) {
        this.currentPage = val
      },
      changePage (value) {
        this[value.split('-')[0]] = value.split('-')[1] / 1
      }
    },
    computed: {
      tableDataComputed () {
        if (this.tableData && this.tableData.length) {
          let start = this.pageSize * (this.currentPage - 1)
          let end = Math.min(this.pageSize * (this.currentPage), this.tableData.length)
          return this.tableData.slice(start, end)
        } else {
          return []
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
<template>
  <el-row :gutter="5" v-show="showSearch">
    <el-col :span="1" v-show="showPlusIcon"><el-button @click="addFun" type="primary" icon="el-icon-plus" size="mini"></el-button></el-col>
    <el-col :span="4" :offset="showPlusIcon?17:18"><el-input v-model.trim="search" size="mini" placeholder="请输入关键字"/></el-col>
    <el-col :span="2" class='export-wrapper'>
      <el-dropdown>
        <el-button size="mini" type="primary" icon="el-icon-share"></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="exportExcel('xlsx',$event)">xlsx</el-dropdown-item>
          <el-dropdown-item @click.native="exportExcel('xml',$event)">xml</el-dropdown-item>
          <el-dropdown-item @click.native="exportExcel('csv',$event)">csv</el-dropdown-item>
          <el-dropdown-item @click.native="exportExcel('txt',$event)">txt</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<style scoped lang="stylus" rel="stylesheet/stylus">


</style>

<script>
  import XLSX from 'xlsx'
  import FileSaver from 'file-saver'
  import { Loading } from 'element-ui'
  export default {
    data () {
      return {
        parentDom: [],
      }
    },
    props: {
      showPlusIcon: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default: () => []
      }
    },
    methods: {
       addFun() {
        this.$emit('addFun')
      },
      irateror (dom) { // 递归 寻找table父元素
        this.parentDom.push(dom)
        if (dom.className && dom.className.indexOf('table') < 0) {
          this.irateror(dom.parentNode)
        } else {
          return dom
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
        if (this.data.length > 10) {
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
    }
  }
</script>
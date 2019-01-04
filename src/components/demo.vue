<template>
  
  <div>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column 
      v-for="col in cols"
      :prop="col.prop" :label="col.label" >
    </el-table-column>
  </el-table>
  
  <el-button raw-type="button" @click="addCol">
    添加一列
  </el-button></div>
</template>

<style scoped lang="stylus" rel="stylesheet/stylus">
  div.jsoneditor-menu 
    background-color #4CAF50 !important
    border-bottom 1px solid #4CAF50 !important
  div.jsoneditor 
    min-height 300px
    border 1px solid #4CAF50 !important

</style>

<script>

  import JSONEditor from 'jsoneditor'
  import 'jsoneditor/dist/jsoneditor.css'
  export default {
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      cols: [
        {prop: 'date', label: '日期'},
        {prop: 'name', label: '姓名'}
      ]
    }
  },
  methods: {
    addCol(){
      this.cols.push({prop: 'address', label: '地址'})
    }
  }
}
</script>
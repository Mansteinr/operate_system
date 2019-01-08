<template>
 <div>
   <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose">
    <span>这是一段信息</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
 </div>

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
      dialogVisible: false
    }
  },
  methods: {
     handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
  }
}
</script>
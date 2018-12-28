<template>
  <div style="background:white;">
    <div id="jsoneditor"></div>
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
    props: {
      mode: {
        type: String,
        default: 'view'
      },
      navigationBar: {
        type: Boolean,
        default: false
      },
      json: {
        type: Object,
        default: {}
      }
    },
    mounted() {
      var container = document.getElementById("jsoneditor")
      console.log(this.json)
      var options = {
        mode: this.mode,
        navigationBar: false
      }
      var editor = new JSONEditor(container, options)
      editor.set(this.json)
      editor.expandAll()
    }
  }
</script>
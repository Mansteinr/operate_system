<template>
  <div style="background:white;">
    <div id="jsoneditor"></div>
  </div>
</template>

<style scoped lang="stylus" rel="stylesheet/stylus">


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
      data: {}
    },
    watch: {
      data () {
        this.renderJson()
      }
    },
    methods: {
      renderJson (val) {
        var container = document.getElementById("jsoneditor")
        container.innerHTML = ''
        var options = {
          mode: this.mode,
          navigationBar: false
        }
        var editor = new JSONEditor(container, options)
        editor.set(val || this.data)
        editor.expandAll()

        container.addEventListener('click', function(e) {
           if(e.target.innerText.indexOf('/data')> -1) {
              window.open(this.API.base.imageapi + event.srcElement.innerHTML)
            }
        })
      }
    }
  }
</script>
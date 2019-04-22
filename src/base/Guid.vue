<template>
  <el-dialog
    title="guid详情"
    custom-class="guid-dialog"
    :visible.sync="dialogVisible"
    :before-close="handleClose">
    <div id="jsoneditor"></div>
  </el-dialog>
</template>

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
      data: {},
      dialogVisible: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      data () {
        this.$nextTick(() => {
          this.renderJson()
        }, 1000)
      }
    },
    methods: {
      handleClose() {
        this.$emit('changeDialog', false)
      },
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
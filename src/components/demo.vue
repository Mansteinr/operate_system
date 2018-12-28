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
    data () {
      return {
        json: {"resCode":1,"resData":{"_id":"5c23385b5c40450001586105","msg":"成功访问","ip":"106.14.136.148","serviceName":"NameIDCardAccountVerify","rsp":{"MESSAGE":"认证信息匹配","RESULT":"1"},"readCacheHit":false,"costTime_db":2608,"costTime_all":2608,"param":{"idCard":"450821********2133","accountNo":"622848*******064972","name":"宾俊*","guid":"20181226161413_9g523XF1_1150799"},"srcQueryReturnList":[{"stat":"DATA_SOURCE_ERROR_KNOWN","classIndex":0,"statMsg":"访问winnie | NameIdAccountCE 上游无法验证","className":"simon.callentity.winnie.NameIdAccountCE","rspInfo":{"rspMsg":"{\"result\":\"D\",\"costTime\":\"1.531189ms\"}","connInfo":"normal","httpCode":"200"},"invokeCostTime":15},{"mvUpTrackId":"20181226161413_9g523XF1_1150799","stat":"DATA_SOURCE_SUCCESS_HIT","classIndex":1,"statMsg":"访问bangfutong | NameIDCardAccountVerifyCE 访问成功，认证信息匹配","tail":{"guid":"20181226161413_9g523XF1_1150799","dataSource":"simon.callentity.bangfutong.NameIDCardAccountVerifyCE"},"className":"simon.callentity.bangfutong.NameIDCardAccountVerifyCE","rspInfo":{"rspMsg":"{\"errcode\":\"00000\",\"result\":{\"photo\":\"\",\"areaname\":\"\",\"bankname\":\"\",\"bankalias\":\"\",\"bankcode\":\"\",\"bankcardtype\":\"\",\"cardtypecode\":\"\",\"provincename\":\"\",\"consumemoney\":0.0,\"consumestate\":\"true\"},\"jobid\":\"20181226161401196603270\",\"bizno\":\"000100630000598\",\"requestsn\":\"20181226161413_9g523XF1_1150799\",\"responsetime\":\"20181226161403553\",\"message\":\"验证通过\"}","connInfo":"normal","httpCode":"200"},"invokeCostTime":2582}],"price":0.08,"loginName":"yunyihutong","ipReal":"106.14.136.148","guid":"20181226161413_9g523XF1_1150799","needCharge":true,"beginTime":1545812053578,"endTime":1545812056186,"enParam":{"idCard":"6b83d55a5d3a25688ba169682b775b375f4238d81c1501fa0fe6e7f8f16a651d","accountNo":"24bf133543e3a0c9318dcfba3bbced00710f721485ae31fb9d7ce9939308fc2f","name":"7ba315504e72b584f39947d6a0739f969b0636ba2ce3d00a02e9aa5d18dbdce1"},"costTime_cache":3,"pipeGroupName":"bft","isearchType":"generalSearch","status":"DATA_SOURCE_SUCCESS_HIT"},"resMsg":[]},
        options: {
          mode: 'view',
          expandAll: true
        }
      }
    },
    mounted() {
      var container = document.getElementById("jsoneditor")
      var options = {
        mode: 'view',
        navigationBar: false
      }
      var editor = new JSONEditor(container, options)
      editor.set(this.json)
      editor.expandAll()
    }
    //  components: {
    //   VJsoneditor
    // },

  }
</script>
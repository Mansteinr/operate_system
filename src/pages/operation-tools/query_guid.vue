<template>
  <div class="template-wrapper">
    <Inquiry
      :queryParams="queryParams"
      @initFun="initFun"
      :rules="rules"
      ref="querForm"
      >
      <el-form-item label="guid：" prop="guid" style="width: 45%;">
        <el-input v-model="queryParams.guid" placeholder="请输入guid"></el-input>
      </el-form-item>
    </Inquiry>

    <Content :isOnlyTable="true" :data="[logDetail]">
      <JsonEditor slot="onlyTable" :data="logDetail"></JsonEditor>
    </Content>

  </div>
</template>

<script>
import Content from "@/components/Content"
import Inquiry from "@/components/Inquiry"
import JsonEditor from '@/components/JsonEditor'
import { mapActions, mapGetters } from "vuex"

export default {
  data () {
    let guidRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('guid不能为空'));
      } else {
        callback()
      }
    }
    return {
      rules: {
        guid: [{ validator: guidRule, trigger: 'change' },]
      },
      queryParams: {
        guid: '20200525090019_C5furv27_2042224'
      }
    }
  },
  components: {
    JsonEditor,
    Content,
    Inquiry
  },
  computed: {
     ...mapGetters({
      logDetail: "tools/logDetail",
    })
  },
  methods: {
    ...mapActions({
      getLogDetailAjax: "tools/getLogDetailAjax"
    }),
    initFun () {
      this.$refs.querForm.$refs.querForm.validate((valid) => {
        if (valid) {
         this.getLogDetailAjax(this.queryParams)
        }
      })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>

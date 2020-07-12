<template>
  <m-form :model="ruleForm" :rules="rules"  ref="ruleForm">
    <my-form-item label="用户名" prop="username">
      <my-input v-model="ruleForm.pass"></my-input>
    </my-form-item>
    <my-form-item label="密码" prop="pass">
      <my-input v-model="ruleForm.pass"></my-input>
    </my-form-item>
    <my-form-item >
      <el-button type="primary" @click="submitForm2('ruleForm')">提交</el-button>
      <el-button @click="resetForm2('ruleForm')">重置</el-button>
    </my-form-item>
  </m-form>
  <!-- <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">

    
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form> -->
</template>
<script>
// Form 定义数据 负责定义校验规则
// FormItem 负责显示错误信息
// Input 负责双向数据绑定
// provide inject内部数据共享2.
import MyInput from '../Input/index'
import MyFormItem from '../FormItem/index'
import MForm from '@/components/Form'
  export default {
    components: {
      MyInput,
      MyFormItem,
      MForm
    },
    data() {
      return {
        ruleForm: {
          pass: '',
          checkPass: '',
          age: '',
          username: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名' },
            { min: 6,max: 10, message: '请输入6-10位用户名' }
          ],
          pass: [
            { required: true, message: '请输入密码' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitForm2(formName) {
        console.log(this.$refs[formName], 'this.$refs[formName]')
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

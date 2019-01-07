<template>
  <section class="login-space">
    <header class="login-header" style="background-image: url(static/company/login-logo.png);"></header>
    <div class="element-center login-warp">
      <div class="login-title">{{$t('m.login.title')}}</div>
      <div class="login-input-warp">
        <input type="text" v-model="username" :placeholder="$t('m.login.username')" @keyup.enter="goLogin" />
      </div>
      <div class="login-input-warp login-pwd">
        <input type="password" v-model="password" :placeholder="$t('m.login.password')" @keyup.enter="goLogin" />
      </div>
      <div class="input-code">
        <input type="text" id="code" v-model.trim="vcode" class="user-input" placeholder="验证码" @keyup.enter="goLogin" maxlength="4">
        <img class="code-img" :src="imgSrc" alt="点击刷新验证码">
      </div>
      <el-button type="primary" @click="goLogin" class="login-btn">登录</el-button>
    </div>
  </section>
</template>

<script>
import { $http } from '../common/js/ajax'
import { showModal } from '../utils'
import { mapMutations } from 'vuex' // 引入mapMutations函数
import md5 from 'js-md5'
export default {
  data () {
    return {
      username: '',
      password: '',
      imgSrc: '',
      uuid: '',
      vcode: ''
    }
  },
  mounted () {
    this.getVerifyCode()
  },
  methods: {
    getVerifyCode () {
      $http(this.API.base.getVerifyCode, {}, 'get').then((res) => {
        this.uuid = res.resData.uuid
        this.imgSrc = 'data:image/png;base64,' + res.resData.vcode
      })
    },
    goLogin: function () {
      if (!this.username || !this.password) {
        showModal('密码账号不能为空', 'error')
      } else {
        $http(this.API.base.login, { pwd: md5(this.password), account: this.username, uuid: this.uuid,vcode: this.vcode }, 'post').then((res) => {
          localStorage.setItem('mtk', res.resData.mtk)
          localStorage.setItem('userId', res.resData.userId)
          localStorage.setItem('accountName', res.resData.accountName)
          this.$router.push('/')
          showModal('登录成功')
        })
      }
    },
    ...mapMutations({ // 修改mutation 拿到定义在mutations里面的修改函数
      setMtk: 'SET_MTK'
    })
  }
}
</script>
<style  scoped lang="stylus" rel="stylesheet/stylus">
input {
  outline: 0;
}

.login-header {
  margin: auto;
  max-width: 1400px;
  height: 200px;
  background-repeat: no-repeat;
  background-position: left center;
}

.login-space {
  position: relative;
  display: block;
  height: 100%;
  background: url('../common/images/login/bj.png') no-repeat center;
  background-size: 100% 100%;
}

.login-warp {
  position: absolute;
  width: 500px;
  height: 400px;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  left: 50%;
  margin-left: -250px;
  top: 50%;
  margin-top: -200px;
}

.login-title {
  height: 80px;
  line-height: 80px;
  text-align: center;
  font-size: 20px;
}

.login-input-warp {
  margin-bottom: 0;
  border: solid 1px #c1c4cd;
  line-height: 50px;
  background-color: #f3f6fd;
  border-radius: 6px;
  padding: 0 10px 0 40px;
  background-repeat: no-repeat;
  background-position: 11px center;
  background-image: url('../common/images/login/user.png');
  margin-bottom: 20px;
  transition: all 0.3s;
}

.input-code {
  margin-bottom: 8px;
  height: 42px;
}

.input-code .user-input {
  width: 75%;
  height: 40px;
  line-height: 42px;
  text-indent: 10px;
  outline: none;
  border: solid 1px rgba(153, 153, 153, 0.75);
  box-shadow: 0 0 4px rgba(153, 153, 153, 0.5);
  float: left;
}

.input-code .code-img {
  float: right;
  width: 20%;
  height: 40px;
  border: solid 1px rgba(153, 153, 153, 0.3);
  box-shadow: 0 0 4px rgba(153, 153, 153, 0.5);
}

.login-input-warp:hover {
  background-color: #ffffff;
  border-color: #3b99fc;
}

.login-input-warp.login-pwd {
  background-image: url('../common/images/login/pwd.png');
}

.login-inputs input, .login-input-warp input {
  width: 100%;
  background-color: transparent;
  line-height: 50px;
  background-position-x: 13px;
}

.login-btn {
  width: 100%;
  margin: 10px 0;
  height: 50px;
}

.login-footer {
  text-align: center;
  position: absolute;
  width: 100%;
  bottom: 0;
  line-height: 60px;
  font-size: 16px;
}
</style>
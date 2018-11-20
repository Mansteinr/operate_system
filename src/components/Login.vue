<template>
  <section class="login-space">
    <header class="login-header" style="background-image: url(static/company/login-logo.png);"></header>
    <div class="element-center login-warp">
      <div class="login-title">小视科技运营平台</div>
      <div class="login-input-warp">
        <input type="text" v-model="username" placeholder="账号" @keyup.enter="goLogin" />
      </div>
      <div class="login-input-warp login-pwd">
        <input type="password" v-model="password" placeholder="密码" @keyup.enter="goLogin" />
      </div>
      <el-button type="primary" @click="goLogin" class="login-btn">登录</el-button>
    </div>
  </section>
</template>

<script>
import $http from '../common/js/api'
import { showModal } from '../utils'
export default {
  data () {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    goLogin: function () {
      if (!this.username || !this.password) {
        showModal('密码账号不能为空', 'error')
      } else {
        if (this.username !== 'minivision' || this.password !== 'minivision123456') {
          showModal('密码或者账户错误', 'warning')
          return
        }
        let url = 'operation/auth/login'
        this.password = 'minivision'
        $http(url, {password: this.password,username: this.username}).then((res) => {
          if (res.resCode/1 === 1) {
            localStorage.setItem('mtk',res.resData.token)
            this.$router.push('/')
            showModal(res.resMsg[0].msgText)
          } else {
              showModal('未登录', 'warning')
          }
        }).catch( err => {
          showModal('网络有问题', 'warning')
        })
     }
    }
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
  width: 500px;
  height: 400px;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  top: 16%;
  margin: 0 auto;
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

.login-input-warp:hover {
  background-color: #ffffff;
  border-color: #3b99fc;
}

.login-input-warp.login-pwd {
  background-image: url('../common/images/login/pwd.png');
}

.login-input-warp input {
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
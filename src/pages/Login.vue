<template>
  <section class="login-space">
    <header class="login-header" style="background-image: url(static/company/login-logo.png);"></header>
    <div class="element-center login-warp">
      <div class="login-title">{{$t('m.login.title')}}</div>
      <div class="login-input-warp">
        <input type="text" v-model="username" :placeholder="$t('m.login.username')" @keyup.enter="goLogin" />
      </div>
      <div class="login-input-warp login-pwd">
        <input :type="isShow ? 'text' : 'password'" v-model="password" :placeholder="$t('m.login.password')" @keyup.enter="goLogin" />
        <span @click="toggelShow" class="iconfont" :class="isShow ? 'icon-xianshimima' : 'icon-buxianshimima'"></span>
      </div>
      <div class="input-code">
        <input type="text" id="code" v-model.trim="vcode" class="user-input" :placeholder="$t('m.login.placeholder')" @keyup.enter="goLogin" maxlength="4">
        <img class="code-img" :src="imgSrc" :alt="$t('m.login.imageAlt')" @click="reloadImg">
      </div>
      <el-button type="primary" @click="goLogin" class="login-btn">{{$t('m.login.loginBtnText')}}</el-button>
    </div>
  </section>
</template>

<script>
import md5 from 'js-md5'
import axios from 'axios'
import { showModal } from '../utils'
// eslint-disable-next-line no-unused-vars
import interfaceApi from '@/config/interface.json'
// import { mapMutations } from 'vuex' // 引入mapMutations函数
import { $http } from '../common/js/ajax'
export default {
  data () {
    return {
      username: '',
      password: '',
      imgSrc: '',
      uuid: '',
      vcode: '',
      isShow: false
    }
  },
  mounted () {
    this.getVerifyCode()
  },
  methods: {
    toggelShow () {
      this.isShow = !this.isShow
    },
    reloadImg () {
      this.getVerifyCode()
    },
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
        axios({
          method: 'post',
          url: this.API.base.login,
          data: { pwd: md5(this.password), account: this.username, uuid: this.uuid,vcode: this.vcode },
          responseType: 'json'
        }).then(() => {
          let res = {"resCode":1,"resData":{"accountName":"machaozhong","mtk":"e5124e23-6223-4c6f-ae1a-8ddcf35d0371","pwdModify":false,"realName":"马超众","success":true,"userId":"6d8ba644-ae54-45e6-b5b5-5bdea76ac9c7"},"resMsg":[{"msgCode":"10001","msgText":"操作成功"}]}
          // if (!res.data.resCode) {
          //   this.getVerifyCode()
          //   this.vcode = ''
          //   showModal(res.data.resMsg[0].msgText, 'error')
          // } else {
            localStorage.setItem('mtk', res.resData.mtk)
            localStorage.setItem('userId', res.resData.userId)
            localStorage.setItem('accountName', res.resData.accountName)
            this.$router.push('/')
            showModal('登录成功')
          // }
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
  position relative
  background-image: url('../common/images/login/pwd.png');
  span {
    position absolute
    right 10px
    height 100%
    width 30px
    text-align center
    line-height 51px
  }
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
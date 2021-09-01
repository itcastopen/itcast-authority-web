<template>
  <div class="login-container">
    <div class="logoHead">
      <div class="logo"></div>
    </div>
    <!-- 登录 -->
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
      @keyup.enter.native="handleLogin()"
    >
      <div class="loginBox">
        <div class="title-container">
          <span class="loginLog">登录LOGIN</span>
        </div>
        <!-- 用户名 -->
        <el-form-item prop="account">
          <span class="svg-container">
            <svg-icon name="user" />
          </span>
          <el-input
            ref="account"
            v-model="loginForm.account"
            name="username"
            type="text"
            autocomplete="on"
            placeholder="请输入账号"
          />
        </el-form-item>
        <!-- end -->
        <!-- 密码 -->
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon name="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入账号"
            name="password"
            autocomplete="on"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <!-- end -->
        <!-- 验证码 -->
        <div class="codeInfo">
          <el-form-item prop="code">
            <span class="svg-container">
              <svg-icon name="code" />
            </span>
            <el-input
              ref="code"
              v-model="loginForm.code"
              name="code"
              type="text"
              autocomplete="on"
              placeholder="请输入验证码"
              class="inputW"
            />
          </el-form-item>
          <img
            :src="imageCode"
            alt="codeImage"
            class="code-image"
            @click="getCode"
          >
        </div>

        <!-- end -->
        <!-- 登录 -->
        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-top: 30px"
          @click.native.prevent="handleLogin"
        >
          立即登录
        </el-button>
        <!-- end -->
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vue-router/types/router'
import { Form as ElForm, Input } from 'element-ui'
import { UserModule } from '@/store/modules/user'
// 用户信息
import { setToken, setUser, setApply, getApply, removeApply } from '@/utils/cookies'
// 随机码
import { randomNum } from '@/utils'
// api接口
import { getAllList } from '@/pages/adhibition/api/index'
import { getCode, loginInfo } from '@/pages/base/api/api'
@Component({
  name: 'Logins'
})
export default class extends Vue {
  // 密码验证
  private validatePassword = (rule: any, value: string, callback: Function) => {
    if (value.length < 6) {
      callback(new Error('密码不能少于6位'))
    } else {
      callback()
    }
  }
  // 验证码验证
  private validateVerificationCode = (
    rule: any,
    value: string,
    callback: Function
  ) => {
    if (value.length < 4) {
      callback(new Error('验证码不能少于4位'))
    } else {
      callback()
    }
  }
  // 验证
  private loginRules = {
    account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    password: [{ validator: this.validatePassword, trigger: 'blur' }],
    code: [{ validator: this.validateVerificationCode, trigger: 'blur' }]
  }
  private imageCode = ''
  private randomId = randomNum(24, 16)
  private loginForm = {
    account: 'admin',
    code: '',
    key: '',
    password: '123456'
  }
  private passwordType = 'password'
  private loading = false
  private showDialog = false
  private redirect?: string
  private isPostBack = true

  private otherQuery: Dictionary<string> = {}
  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {
    const query = route.query as Dictionary<string>
    if (query) {
      this.redirect = query.redirect
      this.otherQuery = this.getOtherQuery(query)
    }
  }
  // 挂载结束
  mounted() {
    if (this.loginForm.account === '') {
      (this.$refs.account as Input).focus()
    } else if (this.loginForm.password === '') {
      (this.$refs.password as Input).focus()
    }
    // if (this.isPostBack) {
    this.getCode(this.randomId)
    // }
  }
  // 获取验证码图片
  private async getCode(val: string) {
    this.loginForm.code = ''
    const response = await getCode(this.randomId)
    const res = response.data
    const data =
      'data:image/png;base64,' +
      btoa(
        new Uint8Array(res).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      )
    this.imageCode = data
  }
  // 显示隐藏密码
  private showPwd() {
    if (this.passwordType === 'password') {
      this.passwordType = ''
    } else {
      this.passwordType = 'password'
    }
    this.$nextTick(() => {
      (this.$refs.password as Input).focus()
    })
  }
  // 登录
  private handleLogin() {
    (this.$refs.loginForm as ElForm).validate(async(valid: boolean) => {
      this.loginForm.key = this.randomId
      let params = {} as any
      if (valid) {
        this.loading = true
        const res = await UserModule.Login(this.loginForm)
        if (res.isSuccess) {
          await UserModule.GetUserInfo()
          setUser(res.data.user)
          setToken(res.data.token.token)
          const { data } = await getAllList({})
          // 默认赋值应用
          if (res.data.user.id >= 10) {
            // 非管理员
            setApply(JSON.stringify(data.data[0]))
          } else {
            // 管理员
            setApply(JSON.stringify({ 'id': '1', 'createTime': null, 'createUser': null, 'updateTime': null, 'updateUser': null, 'name': '应用选择', 'abbreviation': '权限管家', 'status': null, 'describe': null }))
            this.$store.commit('updatedTheme', '')
            this.$store.commit('updatedThemeColor', '#409EFF')
          }
          this.$router.push({
            path: this.redirect || '/',
            query: this.otherQuery
          }, () => {})
          params.description = '登录成功！'
          this.loading = false
        } else {
          this.$message.error(res.msg || '操作失败')
          this.loading = false
          this.getCode(this.randomId)
          params.description = res.msg
        }
        params.name = this.loginForm.account
        // 记录日志
        const { data } = await loginInfo(params)
      } else {
        return false
      }
    })
  }

  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur]
      }
      return acc
    }, {} as Dictionary<string>)
  }
}
</script>

<style lang="scss">
.logoHead {
  margin: 58px 0 0 70px;
}
.logo {
  width: 169px;
  height: 41px;
  background: url(../../assets/images/logo.png) no-repeat;
  background-size: contain;
}
.loginLog {
  font-size: 16px;
  font-weight: 700;
  text-align: left;
  color: #333333;
  line-height: 22px;
}
.login-container {
  background: linear-gradient(to bottom, #2e88ff 0%, #4495ff 100%);
  background-size: cover;
  .el-input {
    display: inline-block;
    // height: 47px;
    // width: 100%;
    border-bottom: 2px solid #eaedf0 !important;
    input {
      height: auto !important;
      background: transparent !important;
      border: 0px !important;
      border-radius: 0px !important;
      padding: 9px 5px 7px 26px !important;
      color: #303133 !important;
      line-height: 30px !important;
      // caret-color: $loginCursorColor;
      -webkit-appearance: none;
      font-size: 14px !important;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: #333 !important;
      }
      &:-webkit-input-placeholder {
        color: #c0c4cc;
      }
    }
  }
  .el-form-item {
    margin-bottom: 0 !important;
  }
  .el-form-item__error {
    position: static;
    padding: 6px 0 0;
  }
}
.code-image {
  vertical-align: top;
  margin: 8px 0 0;
  width: 100px;
  cursor: pointer;
}
.login-container {
  .el-form-item {
    background: none !important;
  }
}

.codeInfo {
  .el-form-item {
    width: 60% !important;
    display: inline-block !important;
  }
}
</style>
<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: $loginBg;

  .login-form {
    position: absolute;
    width: 980px;
    height: 570px;
    max-width: 100%;
    top: calc(50% - 280px);
    left: calc(50% - 490px);
    margin: 0 auto;
    // overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    color: $darkGray;
    display: inline-block;
    position: absolute;
    top: 14px;
    z-index: 1;
  }
  .loginBox {
    height: 570px;
    background: url(../../assets/images/loginBg.png) no-repeat;
    padding: 140px 111px 0 615px;
  }
  .title-container {
    position: relative;
    text-align: right;
    margin-bottom: 33px;
    padding-right: 70px;
    image {
      display: inline;
    }
    .title {
      font-size: 26px;
      color: $lightGray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $darkGray;
    cursor: pointer;
    user-select: none;
  }

}
.el-button--primary {
  height: 36px;
  background-color: #409EFF;
  border-radius: 25px;
  color: #fff;
  border: 0 none;
  &:hover,
  &:focus {
    background-color: #409EFF !important;
  }
}
</style>

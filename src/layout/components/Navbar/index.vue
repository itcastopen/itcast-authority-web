<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <div class="right-menu">
      <el-dropdown class="useList" @command="handleName">
        <span class="el-dropdown-link">
          <i class="el-icon-s-platform adhibitionIcon"></i>
          {{ projectname }}
          <i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="topNav useBox">
          <el-dropdown-item v-for="item in dataTable" :key="item.id" :command="item">{{ item.name }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="avatar-wrapper">
        <span class="userHead"></span>
      </div>

      <el-dropdown @command="logout">
        <span class="el-dropdown-link">
          {{ user.name }}<i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="topNav">
          <el-dropdown-item command="0">修改密码</el-dropdown-item>
          <el-dropdown-item v-if="user.id<10" command="2">平台管理</el-dropdown-item>
          <el-dropdown-item command="1">退出系统</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      class="user-unfreeze-dialog userInfo"
      title="修改密码"
      :visible.sync="isVisible"
      :before-close="handleClose"
    >
      <div class="unfreeze-form">
        <el-form
          ref="ruleForm"
          :rules="formRules"
          :model="userData"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="旧密码：" prop="oldPassword">
            <el-input v-model="userData.oldPassword" type="password" placeholder="请输入" autocomplete="off" minlength="6" maxlength="12" />
          </el-form-item>
          <el-form-item label="新密码：" prop="password">
            <el-input v-model="userData.password" type="password" placeholder="请输入" autocomplete="off" minlength="6" maxlength="12" />
          </el-form-item>
          <el-form-item label="确认密码：" prop="confirmPassword">
            <el-input v-model="userData.confirmPassword" type="password" placeholder="请输入" autocomplete="off" minlength="6" maxlength="12" />
          </el-form-item>
        </el-form>
        <div class="subBox right">
          <el-button @click="handleClose"> 取 消 </el-button>
          <el-button type="primary" :disabled="isDisable" @click="handleSubmit">
            确 定
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 用户添加、编辑对话框 -->
    <more-dialog
      v-if="isMoreVisible"
      ref="userDialog"
      :is-more-visible="isMoreVisible"
      @close="handleMoreClose"
    />
    <!-- end -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { UserModule } from '@/store/modules/user'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import { alterPassword } from '@/pages/base/api/api'
import { ElForm } from 'element-ui/types/form'
import { getUser, setApply, getApply } from '@/utils/cookies'
import { getAllList } from '@/pages/adhibition/api/index'
import moreDialog from '@/pages/adhibition/components/moreList.vue'
import { themeData } from '@/utils/data'
@Component({
  name: 'Navbar',
  components: {
    Breadcrumb,
    Hamburger,
    moreDialog
  }
})
export default class extends Vue {
  private userData={}
  private isVisible =false
  private isDisable = false
  private userInfo = {}
  private dataTable =[]
  private isMoreVisible= false
  private chalk = ''
  private version = require('element-ui/package.json').version
  private formRules = {
    oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
    password: [{ required: true, message: '请输入新密码', trigger: 'blur' }]
  }
  get sidebar() {
    return AppModule.sidebar
  }
  // 获取用户
  get user() {
    return getUser() ? JSON.parse(getUser() as any) : null
  }
  get projectname() {
    return getApply() ? JSON.parse(getApply() as any).name : ''
  }

  get themeVal() {
    return this.$store.state.themeColor
  }

  @Watch('themeVal')
  themeValChange(val:any, oldVal:any) {
    this.updateTheme(val, oldVal)
  }
  created() {
   // 加载应用列表
   this.getList()
   // 初始化应用和平台
   this.initPlatform()
  }

  /// // 功能函数 /////
  // 初始化应用和平台
  private initPlatform() {
    // 管理员默认平台
   if (this.user.id < 10 && !getApply()) {
     setApply(JSON.stringify({ 'id': '1', 'createTime': null, 'createUser': null, 'updateTime': null, 'updateUser': null, 'name': '应用选择', 'abbreviation': '权限管家', 'status': null, 'describe': null }))
     this.$store.commit('updatedTheme', '')
     this.$store.commit('updatedThemeColor', '#409EFF')
   } else {
     // 应用选择相应主题
     let platform = getApply() ? JSON.parse(getApply() as any) : null
     if (platform && platform.name !== '应用选择') {
       const theme = platform.color ? platform.color : 'default'
       const color = (themeData.find(item => item.value === theme) as any).color
       this.$store.commit('updatedTheme', theme)
       this.$store.commit('updatedThemeColor', color)
     }
   }
  }
  // 控制左侧菜单
  private toggleSideBar() {
    AppModule.ToggleSideBar(false)
  }
  // 退出
  private logout(command:string) {
    if (command === '1') {
      this.$confirm('', '确认退出系统?', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(async() => {
          await UserModule.LogOut()
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        })
    } else if (command === '0') {
      this.isVisible = true
    } else if (command === '2') {
      // 切换到平台管理
      setApply(JSON.stringify({ 'id': '1', 'createTime': null, 'createUser': null, 'updateTime': null, 'updateUser': null, 'name': '应用选择', 'abbreviation': '权限管家', 'status': null, 'describe': null }))
      location.reload()
    }
  }
  // 修改密码
  handleSubmit() {
    this.isDisable = true
    let userData = this.userData as any
    setTimeout(() => {
      this.isDisable = false // 点击一次时隔两秒后才能再次点击
    }, 2000)
    userData.id = UserModule.id
    if (userData.confirmPassword !== userData.password) {
      this.$message({
        message: '两次密码不一致',
        type: 'error'
      })
      return false
    }
    (this.$refs.ruleForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        const { data } = await alterPassword(this.userData)
        if (data.isSuccess) {
          this.isVisible = false;
          (this.$refs.ruleForm as ElForm).resetFields()
          this.$message({
            message: '设置成功！',
            type: 'success'
          })
          this.handleClose()
        } else {
          this.$message({
            message: data.msg,
            type: 'error'
          })
        }
      } else {
        return false
      }
    })
  }
  // 获取数据
  private async getList() {
    const { data } = await getAllList({})
    if (data.isSuccess === true) {
      this.dataTable = data.data
      if (this.user.id >= 10 && !getApply()) {
        setApply(JSON.stringify(this.dataTable[0]))
      }
    }
  }
  handleClose() {
    this.isVisible = false
  }
  handleMoreClose() {
    this.isMoreVisible = false
  }
  // 应用筛选
  handleName(val:any) {
    if (val !== 0) {
      setApply(JSON.stringify(val))
      location.reload()
    } else {
      this.isMoreVisible = true
    }
  }

  // 变更主题色
  updateTheme(val:any, oldVal:any) {
    if (typeof val !== 'string') return
    const head = document.getElementsByTagName('head')[0]
    const themeCluster = this.getThemeCluster(val.replace('#', ''))
    const getHandler = (variable:any, id:any) => {
      return () => {
        const originalCluster = this.getThemeCluster(
          oldVal.replace('#', '')
        )
        const newStyle = this.updateStyle(
          this.chalk,
          originalCluster,
          themeCluster
        )

        let styleTag = document.getElementById(id)
        if (!styleTag) {
          styleTag = document.createElement('style')
          styleTag.setAttribute('id', id)
          head.appendChild(styleTag)
        }
        styleTag.innerText = newStyle
      }
    }
    const chalkHandler = getHandler('chalk', 'chalk-style')
    if (!this.chalk) {
      const url = `https://unpkg.com/element-ui@${this.version}/lib/theme-chalk/index.css`
      this.getCSSString(url, chalkHandler, 'chalk')
    } else {
      chalkHandler()
    }
  }

  updateStyle(style:any, oldCluster:any, newCluster:any) {
    let newStyle = style
    oldCluster.forEach((color:any, index:any) => {
      newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
    })
    return newStyle
  }

  // 获取相应主题
  getCSSString(url:any, callback:any, variable:any) {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        if (variable) {
          this.chalk = xhr.responseText.replace(/@font-face{[^}]+}/, '')
        }
        callback(xhr.responseText)
      }
    }
    xhr.open('GET', url)
    xhr.send()
  }

  // 获取相关主题所有颜色
  private getThemeCluster(theme: String) {
    const tintColor = (color: any, tint: any) => {
      let red = parseInt(color.slice(0, 2), 16)
      let green = parseInt(color.slice(2, 4), 16)
      let blue = parseInt(color.slice(4, 6), 16)

      if (tint === 0) {
        // when primary color is in its rgb space
        return [red, green, blue].join(',')
      } else {
        red += Math.round(tint * (255 - red))
        green += Math.round(tint * (255 - green))
        blue += Math.round(tint * (255 - blue))

        const newRed = red.toString(16)
        const newGreen = green.toString(16)
        const newBlue = blue.toString(16)

        return `#${newRed}${newGreen}${newBlue}`
      }
    }

    const shadeColor = (color: any, shade: any) => {
      let red = parseInt(color.slice(0, 2), 16)
      let green = parseInt(color.slice(2, 4), 16)
      let blue = parseInt(color.slice(4, 6), 16)

      red = Math.round((1 - shade) * red)
      green = Math.round((1 - shade) * green)
      blue = Math.round((1 - shade) * blue)

      const newRed = red.toString(16)
      const newGreen = green.toString(16)
      const newBlue = blue.toString(16)

      return `#${newRed}${newGreen}${newBlue}`
    }

    const clusters = [theme]
    for (let i = 0; i <= 9; i++) {
      clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
    }
    clusters.push(shadeColor(theme, 0.1))
    return clusters
  }
}

</script>

<style lang="scss" scoped>
.navbar {
  height: 70px;
  overflow: hidden;
  position: relative;
  // background: url('./../../../assets/images/userBg.png') no-repeat 100% 50%;
  // background-size: contain;
  background: #FFFFFF;
  .backOut {
    background: url('./../../../assets/images/icon_arrow2.png') no-repeat center
      center;
    background-size: 8px 5px;
    display: inline-block;
    cursor: pointer;
    margin-top: 22px;
    width: 8px;
    height: 5px;
  }
  .hamburger-container {
    line-height: 70px;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    display: flex;
    float: right;
    height: 100%;
    line-height: 70px;
    padding-right: 30px;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-wrapper {
      margin-top: 10px;
      margin: 10px 10px 0 0;
      position: relative;
      img{
        width: 29px;
        height: 29px;
        border-radius: 50%;
      }
      .userHead{
        width: 29px;
        height: 29px;
        border-radius: 15px;
      }
      .user-avatar {
        cursor: pointer;
        width: 29px;
        height: 29px;
        border-radius: 29px;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
.el-popper.topNav{
  top: 30px !important;
}
.el-dropdown-link{
  cursor: pointer;
}
.username{
  color: var(--current-color);
}
</style>

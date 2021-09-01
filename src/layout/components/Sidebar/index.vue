<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <div class="sidebarLogo">
      <span v-if="!projectName || projectName === '应用选择'" class="logo"></span>
      <div v-if="projectName && projectName!=='应用选择'" class="logo-title-box">
        <img v-if="projectLogo" :src="projectLogo" alt="" class="logo-mini-project">
        <img v-else src="~@/assets/images/logo-mini.png" mode="" class="logo-mini">
        <span class="logo-title" :alt="projectName">{{ projectName }}</span>
      </div>
      <div class="logo-mini-box">
        <img v-if="projectLogo" :src="projectLogo" alt="" class="logo-mini-project">
        <img v-else src="~@/assets/images/logo-mini.png" mode="" class="logo-mini">
      </div>
    </div>
    <el-menu
      :default-active="activeMenu"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :unique-opened="false"
      :collapse-transition="false"
      mode="vertical"
      :collapse="isCollapse"
    >
      <sidebar-item
        v-for="route in routes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import SidebarItem from './SidebarItem.vue'
import variables from '@/styles/_variables.scss'
import { UserModule } from '@/store/modules/user'
import { asyncRoutes } from '@/router'
import { getApply } from '@/utils/cookies'
@Component({
  name: 'SideBar',
  components: {
    SidebarItem
  }
})
export default class extends Vue {
  get sidebar() {
    return AppModule.sidebar
  }

  get routes() {
    this.filterIcon(asyncRoutes, UserModule.roles)
      return UserModule.roles
  }

  get variables() {
    return variables
  }

  get activeMenu() {
    const route = this.$route as any
    const { meta, path } = route
    if (meta.activeMenu) {
      return meta.activeMenu
    }
    return path
  }

  get isCollapse() {
    return !this.sidebar.opened
  }

  get projectName() {
    return getApply() ? JSON.parse(getApply() as any).name : null
  }

  get projectLogo() {
    return getApply() ? JSON.parse(getApply() as any).logo : null
  }

  // 匹配默认图标
  filterIcon(arrRoutes:any, arrRoles:any) {
    arrRoles.forEach((obj:any) => {
      arrRoutes.forEach((val:any) => {
          if (val.children) {
              if (obj.meta.icon === '' && obj.meta.title === val.children[0].meta.title) {
                obj.meta.icon = val.children[0].meta.icon
              }
          }
        })
    })
  }
}
</script>

<style lang="scss">
.sidebar-container {
  // reset element-ui css
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out,
      0s padding-right ease-in-out;
  }

  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }

  .el-scrollbar__view {
    height: 100%;
  }

  .el-scrollbar__bar {
    &.is-vertical {
      right: 0px;
    }

    &.is-horizontal {
      display: none;
    }
  }
}
.sidebarLogo{
  height: 70px;
  line-height: 70px;
  background: var(--current-color);
  text-align: center;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  // border-radius: 0px 100px 0px 0px;
  // padding: 18px 0 0 35px;
  .logo{
    width: 141px;
    display:inline-block;
    background: url(../../../assets/images/logo.png) no-repeat;
    height: 34px;
    background-size:contain;
  }
  .logo-title-box{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
  }
  .logo-title{
    // width: 141px;
    display:inline-block;
    // height: 34px;
    font-size: 18px;
    font-weight: 500;
    text-align: center;
    color: #ffffff;
    // line-height: 34px;
    letter-spacing: 3px;
    margin-left: 5px;
    max-width: 160px;
    overflow: hidden;
    word-break: keep-all;
  }
}

.hideSidebar{
  .logo,.logo-title-box{
    display: none;
  }
  .logo-mini{
    width: 20px;
    height: auto;
    vertical-align: middle;
  }
  .logo-mini-project{
    width: 20px;
    height: auto;
    vertical-align: middle;
  }

}

.openSidebar{
  .logo-mini-box{
    display: none;
  }
  .logo-mini{
    width: 24px;
    height: auto;
    vertical-align: middle;
  }
  .logo-mini-project{
    width: 30px;
    height: auto;
    vertical-align: middle;
  }
}

</style>

<style lang="scss" scoped>
.el-scrollbar {
  height: 100%;
}

.el-menu {
  padding-top: 23px;
  border-left: 1px solid #ebeef5;
  // height: 100%;
  height: calc(95vh - 23px);
  width: 100% !important;
}
</style>

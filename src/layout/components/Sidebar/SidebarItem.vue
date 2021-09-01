<template>
  <div
    v-if="!item.meta || !item.meta.hidden"
    :class="[
      'menu-wrapper',
      isCollapse ? 'simple-mode' : 'full-mode',
      { 'first-level': isFirstLevel }
    ]"
  >
    <template v-if="(theOnlyOneChild && !theOnlyOneChild.children)&&!item.alwaysShow">
      <sidebar-item-link
        v-if="theOnlyOneChild.meta"
        :to="resolvePath(theOnlyOneChild.path)"
      >
        <el-menu-item
          :index="resolvePath(theOnlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': isFirstLevel }"
        >
          <span
            v-if="theOnlyOneChild.meta.icon"
            class="icon img-icon-sel"
            :class="theOnlyOneChild.meta.icon"
          ></span>
          <span v-if="theOnlyOneChild.meta.title" slot="title" class="menu-title">{{
            theOnlyOneChild.meta.title
          }}</span>
        </el-menu-item>
      </sidebar-item-link>
    </template>
    <el-submenu v-else :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <span
          v-if="item.meta && item.meta.icon"
          class="icon img-icon-sel"
          :class="item.meta.icon"
        ></span>
        <span v-if="item.meta && item.meta.title" slot="title" class="menu-title">{{
          item.meta.title
        }}</span>
      </template>
      <template v-if="item.children">
        <sidebar-item
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :is-collapse="isCollapse"
          :is-first-level="false"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />
      </template>
    </el-submenu>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'
import { isExternal } from '@/utils/validate'
import SidebarItemLink from './SidebarItemLink.vue'

@Component({
  name: 'SidebarItem',
  components: {
    SidebarItemLink
  }
})
export default class extends Vue {
  @Prop({ required: true }) private item!: RouteConfig
  @Prop({ default: false }) private isCollapse!: boolean
  @Prop({ default: true }) private isFirstLevel!: boolean
  @Prop({ default: '' }) private basePath!: string

  get showingChildNumber() {
    if (this.item.children) {
      const showingChildren = this.item.children.filter(item => {
        if (item.meta && item.meta.hidden) {
          return false
        } else {
          return true
        }
      })
      return showingChildren.length
    }
    return 0
  }

  get theOnlyOneChild() {
    if (this.showingChildNumber > 1) {
      return null
    }
    if (this.item.children) {
      for (let child of this.item.children) {
        if (!child.meta || !child.meta.hidden) {
          return child
        }
      }
    }
    return { ...this.item, path: '' }
  }
  private resolvePath(routePath: string) {
    if (isExternal(routePath)) {
      return routePath
    }
    if (isExternal(this.basePath)) {
      return this.basePath
    }
    return path.resolve(this.basePath, routePath)
  }
}
</script>

<style lang="scss">
.el-menu-item {
  // width: 60px !important;
  line-height: 60px !important;
}
.el-menu-item:hover {
  color: var(--current-color);
}
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.hideSidebar {
  .img-icon {
    display: none;
  }
  .img-icon-sel {
    display: inline-block;
    // width: 16px;
    // height: 16px;
    margin-right: 12px;
    // vertical-align: text-bottom;
    &.organizationIcon{
      width: 19px;
      height: 19px;
      margin-right: 12px;
    }
  }
}

.openSidebar {
  .img-icon {
    display: none;
  }
  .img-icon-sel {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 15px;
    font-size: 17px;
    color: #909398;
  }

}
.is-opened{
.el-menu--inline{
    .img-icon-sel {
      display: none;
    }
  }
}

.icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 5px;
}
.dashboard {
  background: url('./../../../assets/icon/indexAct.png') no-repeat center center;
  background-size: contain;
}
.menuuser {
  background: url('./../../../assets/icon/menuuser.png') no-repeat center center;
  background-size: contain;
}
.role {
  background: url('./../../../assets/icon/role.png') no-repeat center center;
  background-size: contain;
}
.organizationIcon {
  background: url('./../../../assets/icon/organization.png') no-repeat center
    center;
  background-size: contain;
}
.post {
  background: url('./../../../assets/icon/post.png') no-repeat center center;
  background-size: contain;
}
.monitor {
  background: url('./../../../assets/icon/monitor.png') no-repeat center center;
  background-size: contain;
}
.menu {
  background: url('./../../../assets/icon/menu.png') no-repeat center center;
  background-size: contain;
}

.el-submenu.is-active > .el-submenu__title {
  // color: $subMenuActiveText !important;
}

.full-mode {
  .nest-menu .el-submenu > .el-submenu__title,
  .el-submenu .el-menu-item {
    // min-width: $sideBarWidth !important;
    // background-color: $subMenuBg !important;

    &:hover span {
      color: var(--current-color);
    }
    &.is-active {
      background-color: $subMenuHover !important;
      border-left: 4px solid var(--current-color);
      color: inherit !important;
      padding-left: 46px !important;
    }
  }
}
.submenu-title-noDropdown,
.el-submenu__title {
  font-weight: 600;
  color: #303133 !important;
  height: 52px;
  line-height: 52px;
  .img-icon-sel{
    color: #909398;
    font-size: 18px;
  }
}
.el-submenu {
  padding: 0 0 2px;
  .el-menu {
    li {
      font-size: 12px;
      // height: 52px !important;
      line-height: 52px !important;
      color: #606266 !important;
      li{
        padding-left: 50px;
      }
    }
  }
}
.el-menu {
    li {
      .el-submenu__title{
            padding-left: 20px !important;

          }
      li{
        padding-left: 50px !important;
          font-weight: normal;
          .el-submenu__title{
            padding-left: 20px !important;
            font-weight: normal;
          }
          li{
          // padding-left:60px !important;
          font-weight: normal;
          .el-submenu__title{
            padding-left: 20px !important;
          }
          li{
            padding-left:40px !important;
          //   .el-submenu__title{
          //   padding-left:50px !important;
          // }
          }
        }

      }
    }
  }

.el-menu-item,
.el-submenu__title {
  // border-bottom: solid 1px rgba(61, 50, 50, 1);
  // padding-left: 29px !important;
  position: relative;
  background: none !important;

  &:active,
  &:hover,
  &.is-active {
    .img-icon-sel{
      color: var(--current-color) !important;
    }
    background: none !important;
    color: var(--current-color) !important;
    .dashboard {
      background: url('./../../../assets/icon/indexActHover.png') no-repeat
        center center;
      background-size: contain;
    }
    .menuuser {
      background: url('./../../../assets/icon/menuuserHover.png') no-repeat
        center center;
      background-size: contain;
    }
    .role {
      background: url('./../../../assets/icon/roleHover.png') no-repeat center
        center;
      background-size: contain;
    }
    .organizationIcon {
      background: url('./../../../assets/icon/organizationHover.png') no-repeat
        center center;
      background-size: contain;
    }
    .post {
      background: url('./../../../assets/icon/postHover.png') no-repeat center
        center;
      background-size: contain;
    }
    .monitor {
      background: url('./../../../assets/icon/monitorHover.png') no-repeat
        center center;
      background-size: contain;
    }
    .menu {
      background: url('./../../../assets/icon/menuHover.png') no-repeat center
        center;
      background-size: contain;
    }
  }
}
.simple-mode {
  &.first-level {
    .submenu-title-noDropdown {
      padding-left: 15px !important;
      position: relative;
      background: none !important;

      .el-tooltip {
        padding-left: 15px !important;
      }
      &:hover {
        background: none !important;
      }
    }

    .el-submenu {
      overflow: hidden;

      & > .el-submenu__title {
        padding: 0px !important;

        .el-submenu__icon-arrow {
          display: none;
        }

        & > span {
          visibility: hidden;
        }
      }
    }
  }
}
.el-submenu__icon-arrow {
  margin-top: -4px !important;
}
.el-submenu__title {
  background: none !important;
  &:hover {
    // color: var(--current-color) !important;
    //  fill: var(--current-color) !important;
  }
  &:active {
    .el-icon-arrow-down:before {
      color: var(--current-color) !important;
    }
  }
}
.el-scrollbar__thumb{
  background-color: rgba(144, 147, 153, 0)
}
</style>
<style lang="scss" scoped>
.svg-icon {
  margin-right: 16px;
  vertical-align: middle;
}
.el-menu-item:hover {
  color: var(--current-color);
}
.simple-mode {
  .svg-icon {
    margin-left: 20px;
  }
}
</style>

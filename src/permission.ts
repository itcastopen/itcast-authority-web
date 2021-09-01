import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { Route } from 'vue-router'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach(async(to: Route, _: Route, next: any) => {
  // Start progress bar
  NProgress.start()
  if (UserModule.token) {
    if (to.path === '/login') {
      next()
      NProgress.done()
    } else {
      await UserModule.GetCurrent()
      if (UserModule.roles.length === 0) {
        if (UserModule.uses.length === 0) {
          Message.error('您的项目被禁用，请联系管理员！')
          return false
        }
        await UserModule.GetRouterInfo()
        const roles = UserModule.roles
        if (roles.length > 0) {
          PermissionModule.GenerateRoutes(roles)
          router.addRoutes(PermissionModule.dynamicRoutes)
          // 获取用户信息及权限
          await UserModule.GetUserAndPermission()
          next({ ...to, replace: true })
        } else {
          Message.error('您的账号没有菜单权限，请联系管理员')
        }
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach((to: Route) => {
  // Finish progress bar
  NProgress.done()
})

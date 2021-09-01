import Router from '@/router'
import RouteConfig from './router'
export default class MoudleBase {
  public static install(router: typeof Router): void {
    router.addRoutes(RouteConfig)
    // router不是响应式的，所以手动将路由元注入路由对象
    if (Array.isArray(router.options.routes)) {
      router.options.routes.push(RouteConfig[0])
    }
  }
}

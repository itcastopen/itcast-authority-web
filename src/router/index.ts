import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import ModuleUser from '@/pages/users/router'
import ModuleMenu from '@/pages/menu/router'
import ModuleOrganization from '@/pages/organization/router'
import ModulePost from '@/pages/post/router'
import ModuleRole from '@/pages/role/router'
import ModuleMonitoring from '@/pages/monitoring'
Vue.use(Router)

export const constantRoutes: RouteConfig[] = [
  {
    path: '/login',
    component: () =>
      import(/* webpackChunkName: "login" */ '@/pages/login/index.vue'),
    meta: {
      hidden: true
    }
  },
  // {
  //   path: '/404',
  //   component: () => import(/* webpackChunkName: "404" */ '@/pages/base/pages/error/404.vue'),
  //   meta: { hidden: true }
  // },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '@/pages/dashboard/index.vue'
          ),
        meta: {
          title: '首页',
          icon: 'dashboard'
        }
      }
    ],
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: Layout,
    // component: () => import(/* webpackChunkName: "404" */ '@/pages/base/pages/error/404.vue'),
    children: [
      {
        path: '',
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '@/pages/error/404.vue'),
        meta: {
          title: '404',
          icon: '404'
        }
      }
    ],
    meta: { hidden: true }
  }
  // {
  //   path: '*',
  //   redirect: '/404',
  //   meta: { hidden: true }
  // }
]
export const asyncRoutes: RouteConfig[] = [
  {
    path: '/menu',
    component: Layout,
    children: [
      {
        path: '',
        component: () =>
          import(/* webpackChunkName: "form" */ '@/pages/menu/index.vue'),
        meta: {
          title: '菜单配置',
          icon: 'menu'
        }
      },
      {
        path: 'detail/:id',
        component: () =>
          import(/* webpackChunkName: "form" */ '@/pages/menu/index.vue'),
        meta: {
          title: '菜单详情',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/monitoring',
    component: Layout,
    redirect: '/log-login',
    meta: {
      title: '监控管理',
      icon: 'monitor'
    },
    children: [
      {
        path: 'log-login',
        component: () =>
          import(
            /* webpackChunkName: "form" */ '@/pages/monitoring/log-login/index.vue'
          ),
        meta: {
          title: '登录日志',
          icon: 'monitor'
        }
      },
      {
        path: 'log-operation',
        component: () =>
          import(
            /* webpackChunkName: "form" */ '@/pages/monitoring/log-operation/index.vue'
          ),
        meta: {
          title: '操作日志',
          icon: 'monitor'
          // icon: 'icon_menu_shenpi'
        }
      }
    ]
  },
  {
    path: '/organization',
    component: Layout,
    children: [
      {
        path: '',
        component: () =>
          import(
            /* webpackChunkName: "form" */ '@/pages/organization/index.vue'
          ),
        meta: {
          title: '组织管理',
          icon: 'organizationIcon'
        }
      },
      {
        path: 'detail/:id',
        component: () =>
          import(
            /* webpackChunkName: "form" */ '@/pages/organization/index.vue'
          ),
        meta: {
          title: '组织详情',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/post',
    component: Layout,
    children: [
      {
        path: '',
        component: () =>
          import(/* webpackChunkName: "form" */ '@/pages/post/index.vue'),
        meta: {
          title: '岗位管理',
          icon: 'post'
        }
      },
      {
        path: 'detail/:id',
        component: () =>
          import(/* webpackChunkName: "form" */ '@/pages/post/index.vue'),
        meta: {
          title: '岗位详情',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/adhibition',
    component: Layout,
    children: [
      {
        path: '',
        component: () =>
          import(/* webpackChunkName: "form" */ '@/pages/adhibition/index.vue'),
        meta: {
          title: '应用管理',
          icon: 'adhibition'
        }
      }
    ]
  },
  {
    path: '/role',
    component: Layout,
    redirect: '/role',
    children: [
      {
        path: '/role',
        component: () =>
          import(/* webpackChunkName: "form" */ '@/pages/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'role'
        }
      },
      {
        path: 'detail/:id',
        component: () =>
          import(/* webpackChunkName: "form" */ '@/pages/role/index.vue'),
        meta: {
          title: '角色详情',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/users',
    component: Layout,
    redirect: '/user-list',
    meta: {
      title: '用户管理',
      icon: 'menuuser'
    },
    children: [
      {
        path: 'user-list',
        component: () =>
          import(
            /* webpackChunkName: "form" */ '@/pages/users/user-list/index.vue'
          ),
        meta: {
          title: '用户管理',
          icon: 'menuuser'
        }
      },
      {
        path: 'user-group',
        component: () =>
          import(
            /* webpackChunkName: "form" */ '@/pages/users/user-group/index.vue'
          ),
        meta: {
          title: '用户组管理',
          icon: 'menuuser'
        }
      },
      {
        path: 'detail/:id',
        component: () =>
          import(
            /* webpackChunkName: "form" */ '@/pages/users/user-group/index.vue'
          ),
        meta: {
          title: '用户详情',
          hidden: true
        }
      }
    ]
  },
  {
    path: '/404',
    component: Layout,
    // component: () => import(/* webpackChunkName: "404" */ '@/pages/base/pages/error/404.vue'),
    children: [
      {
        path: '',
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '@/pages/error/404.vue'),
        meta: {
          title: '404',
          icon: '404'
        }
      }
    ],
    meta: { hidden: true }
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', meta: { hidden: true } }
]

const createRouter = () => new Router({
  // mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}
export default router

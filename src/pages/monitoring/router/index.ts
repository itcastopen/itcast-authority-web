import Layout from '@/layout/index.vue'
export default [
  {
    path: '/monitor',
    component: Layout,
    redirect: '/loginLlist',
    meta: {
      title: '监控管理',
      icon: 'monitor'
    },
    children: [
      {
        path: 'loginLog',
        component: () =>
          import(
            /* webpackChunkName: "form" */ '@/pages/monitoring/log-login/index.vue'
          ),
        meta: {
          title: '登录日志'
          // icon: 'icon_menu_shenpi'
        }
      },
      {
        path: 'operation',
        component: () =>
          import(
            /* webpackChunkName: "form" */ '@/pages/monitoring/log-operation/index.vue'
          ),
        meta: {
          title: '操作日志'
          // icon: 'icon_menu_shenpi'
        }
      }
    ]
  }
]

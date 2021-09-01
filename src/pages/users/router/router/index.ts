import Layout from '@/layout/index.vue'
export default [
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
          title: '用户管理'
        }
      },
      {
        path: 'user-group',
        component: () =>
          import(
            /* webpackChunkName: "form" */ '@/pages/users/user-group/index.vue'
          ),
        meta: {
          title: '用户组管理'
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
  }
]

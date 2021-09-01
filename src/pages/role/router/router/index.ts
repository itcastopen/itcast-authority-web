import Layout from '@/layout/index.vue'
export default [
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
  }
]

import Layout from '@/layout/index.vue'
export default [
  {
    path: '/menu',
    component: Layout,
    children: [
      {
        path: '',
        component: () =>
          import(/* webpackChunkName: "form" */ '@/pages/menu/index.vue'),
        meta: {
          title: '菜单管理',
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
  }
]

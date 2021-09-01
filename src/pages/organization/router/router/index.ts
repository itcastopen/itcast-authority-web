import Layout from '@/layout/index.vue'
export default [
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
  }
]

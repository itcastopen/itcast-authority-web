import Layout from '@/layout/index.vue'
export default [
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
  }
]

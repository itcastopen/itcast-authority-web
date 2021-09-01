import Vue from 'vue'

import 'normalize.css'
import ElementUI from 'element-ui'
import SvgIcon from 'vue-svgicon'
import moment from 'moment'
import '@/styles/element-variables.scss'
import '@/styles/index.scss'
import '@/styles/_svgicon.scss'
import '@/styles/scroll.scss'

import App from '@/App.vue'
import router from '@/router'
import store from './store'
import '@/icons/components'
import '@/permission'
import { hasPermission } from '@/utils'
// 修改 el-dialog 默认点击遮照为不关闭
const el:any = ElementUI
el.Dialog.props.closeOnClickModal.default = false
Vue.use(ElementUI)
Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '16px',
  defaultHeight: '16px'
})

Vue.config.productionTip = false
Vue.prototype.moment = moment
Vue.prototype.$hasPermission = hasPermission

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')

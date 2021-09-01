import axios from 'axios'
import { Message } from 'element-ui'
import { getToken, removeToken, getApply } from '@/utils/cookies'
import { UserModule } from '@/store/modules/user'
import router from '@/router'

const service = axios.create({
  baseURL: '/api',
  timeout: 60000
})
// Request interceptors
// @ts-ignore
service.interceptors.request.use(
  config => {
    const token = getToken()
    const time: any = new Date()
    if (token) {
      config.headers['token'] = token
      if (getApply() !== 'null' && getApply() !== 'undefined' && getApply() !== undefined && getApply()) {
        const useInfo = JSON.parse(getApply() as any)
        config.headers['APPLICATIONID'] = useInfo.id
      }
    }
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        ts: Date.parse(time) / 1000
      }
    }
    return config
  },
  (error: any) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  response => {
    const status = response.status
    const res = response.data
    if (status !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      // token失效
      if (res.code === -9 || res.code === 40001 || res.code === 40003) {
        UserModule.LogOut()
        router.replace({ path: '/login' })
      }
      const msg = res.msg ? res.msg.slice(0, 4) : ''
      if (res.code === -1 && msg === '权限不足') {
        response.data.msg = msg
      }
      return response
    }
  },
  error => {
    Message({
      message: '网络出错啦！',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

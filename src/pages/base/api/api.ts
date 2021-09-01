import request from '@/utils/request'

// 获取验证码
export const getCode = (data: any) =>
  request({
    url: '/authority/anno/captcha' + `?key=${data}`,
    method: 'get',
    responseType: 'arraybuffer',
    data
  })
// 获取验证码验证
export const verifyCode = (data: any) =>
  request({
    url:
      '/authority/anno/check' +
      `?code=${data.key}` +
      '&' +
      `key=${data.code}`,
    method: 'get',
    data
  })
// 登录
export const login = (data: any) =>
  request({
    url: '/authority/anno/login',
    method: 'post',
    data
  })
  // 修改密码
  export const alterPassword = (data: any) =>
    request({
      url: '/authority/user/password',
      method: 'put',
      data
    })
  export const loginInfo = (data: any) =>
    request({
      url: 'authority/loginLog/anno/login/' +
      `${data.name}?` +
      '&' +
      `description=${data.description}`,
      method: 'get',
      data
    })

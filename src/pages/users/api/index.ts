import request from '@/utils/request'

// 首页
export const getVisit = (data: any) =>
  request({
    url: `/authority/dashboard/visit/${data}`,
    method: 'get',
    data
  })

// 用户管理
export const getList = (params: any) =>
  request({
    url: `/authority/user/page`,
    method: 'get',
    params
  })

// 根据条件获取用户列表
export const getUserList = (params: any) =>
  request({
    url: `/authority/user`,
    method: 'get',
    params
  })
// 添加用户
export const addUser = (data: any) =>
  request({
    url: `/authority/user`,
    method: 'post',
    data
  })
// 编辑用户
export const editUser = (data: any) =>
  request({
    url: `/authority/user`,
    method: 'put',
    data
  })
// 用户分配角色
export const editUserRole = (data: any) =>
  request({
    url: `/authority/user/role`,
    method: 'put',
    data
  })
// 获取用户详情
export const detailUser = (id: any) =>
  request({
    url: `/authority/user/${id}`,
    method: 'get'
  })
// 删除用户
export const delUser = (params: any) =>
  request({
    url: `/authority/user`,
    method: 'delete',
    params
  })
// 重置密码
export const resetUser = (params: any) =>
  request({
    url: `/authority/user/reset`,
    method: 'get',
    params
  })
// 用户组管理
export const getUserGroupList = (params: any) =>
  request({
    url: `/authority/userGroup/page`,
    method: 'get',
    params
  })
// 添加用户组
export const addUserGroup = (data: any) =>
  request({
    url: `/authority/userGroup`,
    method: 'post',
    data
  })
// 编辑用户组
export const editUserGroup = (data: any) =>
  request({
    url: `/authority/userGroup`,
    method: 'put',
    data
  })
// 获取用户组详情
export const detailUserGroup = (id: any) =>
  request({
    url: `/authority/userGroup/${id}`,
    method: 'get'
  })
// 删除用户组
export const delUserGroup = (params: any) =>
  request({
    url: `/authority/userGroup`,
    method: 'delete',
    params
  })

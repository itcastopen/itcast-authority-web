import request from '@/utils/request'

// 角色列表
export const getDataList = (params: any) =>
  request({
    url: `/authority/role/listAll`,
    method: 'get',
    params
  })
  // 角色列表
export const getList = (params: any) =>
request({
  url: `/authority/role/page`,
  method: 'get',
  params
})
// 添加角色
export const addRole = (data: any) =>
  request({
    url: `/authority/role`,
    method: 'post',
    data
  })
// 编辑角色
export const editRole = (data: any) =>
  request({
    url: `/authority/role`,
    method: 'put',
    data
  })
// 获取角色详情
export const detailRole = (id: any) =>
  request({
    url: `/authority/role/${id}`,
    method: 'get'
  })
// 删除角色
export const deleteRole = (params: any) =>
  request({
    url: `/authority/role`,
    method: 'delete',
    params
  })

  // 获取全部角色
  export const getAllList = (params: any) =>
  request({
    url: `/authority/role/findAllRoles `,
    method: 'get',
    params
  })
  // 查询角色拥有的资源id集合
  export const getRoleIdList = (id: any) =>
  request({
    url: `/authority/role/authority/${id}`,
    method: 'get'
  })

  // 给角色配置权限 保存
export const setRole = (data: any) =>
request({
  url: `/authority/role/authority`,
  method: 'post',
  data
})
// 获取角色详情
export const userRole = (id: any) =>
  request({
    url: `/authority/user/role/${id}`,
    method: 'get'
  })

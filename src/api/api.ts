import request from '@/utils/request'
// 路由
export const getRouterData = (data: any) =>
  request({
    url: `/authority/menu/router`,
    method: 'get',
    data
  })
// 上传图片
export const getVisit = (data: any) =>
  request({
    url: `/file/attachment/upload`,
    method: 'post',
    data
  })
// 查询附件
export const getAttachment = (data: any) =>
  request({
    url: `/file/attachment`,
    method: 'post',
    data
  })
// 导入
export const exportExle = (data: any) =>
  request({
    url: `/authority/user/importExcel`,
    method: 'post',
    responseType: 'blob',
    data
  })
// 角色
export const getRole = (data: any) =>
  request({
    url: `/authority/role/findAllRoles`,
    method: 'get',
    data
  })
// 角色
export const getRepelRole = (params: any) =>
  request({
    // url: `/authority/role`,/authority/role/page
    url: `/authority/role/page`,
    method: 'get',
    params
  })
// 组织
// export const getAllTree = (data: any) =>
//   request({
//     url: `/authority/org/tree`,
//     method: 'get',
//     data
//   })
export const getAllTree = (params: any) =>
  request({
    url: `/authority/org/tree`,
    method: 'get',
    params
  })
  // 人员
export const getTree = (data: any) =>
request({
  url: `/authority/userGroup/orgUserTree`,
  method: 'get',
  data
})
// 岗位
export const getAllStation = (params: any) =>
  request({
    url: `/authority/station/list`,
    method: 'get',
    params
  })

 // 获取个人信息及权限
 export const getUserAndPermissionInfo = () =>
  request({
    url: `/authority/user/login`,
    method: 'get'
  })

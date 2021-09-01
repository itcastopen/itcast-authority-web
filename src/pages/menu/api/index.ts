import request from '@/utils/request'

// 菜单列表
export const getList = (params: any) =>
  request({
    url: `/authority/menu/page`,
    method: 'get',
    params
  })
// 添加菜单
export const addMenu = (data: any) =>
  request({
    url: `/authority/menu`,
    method: 'post',
    data
  })
// 编辑菜单
export const editMenu = (data: any) =>
  request({
    url: `/authority/menu`,
    method: 'put',
    data
  })
// 获取菜单详情
export const detailMenu = (id: any) =>
  request({
    url: `/authority/menu/${id}`,
    method: 'get'
  })
// 删除菜单
export const deleteMenu = (params: any) =>
  request({
    url: `/authority/menu`,
    method: 'delete',
    params
  })
  // 获取菜单
export const getAllMenu = (params:any) =>
request({
  url: `/authority/menu/tree`,
  method: 'get',
  params
})
  // 获取菜单按钮
  export const getMenuResource = (params:any) =>
  request({
    url: `/authority/menu/resource/tree`,
    method: 'get',
    params
  })

   // 修改组织状态
export const editStatus = (data: any) =>
request({
  url: `/authority/menu/enable`,
  method: 'put',
  data
})
// 拖动排序
export const move = (data: any) =>
  request({
    url: `/authority/menu/move`,
    method: 'put',
    data
  })

// 菜单资源
export const getmenuList = (params: any) =>
  request({
    url: `/authority/resource/page`,
    method: 'get',
    params
  })
  // 添加菜单
export const addJurisdiction = (data: any) =>
request({
  url: `/authority/resource`,
  method: 'post',
  data
})
// 编辑菜单
export const editJurisdiction = (data: any) =>
request({
  url: `/authority/resource`,
  method: 'put',
  data
})
// 获取菜单详情
export const detailJurisdiction = (id: any) =>
request({
  url: `/authority/resource/${id}`,
  method: 'get'
})
// 删除菜单
export const deleteJurisdiction = (params: any) =>
request({
  url: `/authority/resource`,
  method: 'delete',
  params
})

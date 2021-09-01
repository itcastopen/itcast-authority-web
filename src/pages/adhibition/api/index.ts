import request from '@/utils/request'

// 应用列表
export const getList = (params: any) =>
  request({
    url: `/authority/application/page`,
    method: 'get',
    params
  })
  // 集合应用列表
export const getGatherList = (params: any) =>
request({
  url: `/authority/application/list`,
  method: 'get',
  params
})
  // 所有应用列表
  export const getAllList = (params: any) =>
  request({
    url: `/authority/application/currentList`,
    method: 'get',
    params
  })
// 添加岗位
export const add = (data: any) =>
  request({
    url: `/authority/application`,
    method: 'post',
    data
  })
// 编辑岗位
export const edit = (data: any) =>
  request({
    url: `/authority/application`,
    method: 'put',
    data
  })
// 获取岗位详情
export const detail = (id: any) =>
  request({
    url: `/authority/application/${id}`,
    method: 'get'
  })
// 删除岗位
export const deletes = (params: any) =>
  request({
    url: `/authority/application`,
    method: 'delete',
    params
  })

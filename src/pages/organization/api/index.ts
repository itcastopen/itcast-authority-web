import request from '@/utils/request'

// 组织列表
export const getList = (params: any) =>
  request({
    url: `/authority/org/page`,
    method: 'get',
    params
  })
// 添加组织
export const addUser = (data: any) =>
  request({
    url: `/authority/org`,
    method: 'post',
    data
  })
// 编辑组织
export const edit = (data: any) =>
  request({
    url: `/authority/org`,
    method: 'put',
    data
  })
// 获取组织详情
export const detail = (id: any) =>
  request({
    url: `/authority/org/${id}`,
    method: 'get'
  })
// 删除
export const deletes = (params: any) =>
  request({
    url: `/authority/org`,
    method: 'delete',
    params
  })
 // 修改组织状态
export const editStatus = (data: any) =>
request({
  url: `/authority/org/status`,
  method: 'put',
  data
})
// 拖动排序
export const move = (data: any) =>
  request({
    url: `/authority/org/move`,
    method: 'put',
    data
  })

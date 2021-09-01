import request from '@/utils/request'

// 岗位列表
export const getPostList = (params: any) =>
  request({
    url: `/authority/station/page`,
    method: 'get',
    params
  })
// 添加岗位
export const addPost = (data: any) =>
  request({
    url: `/authority/station`,
    method: 'post',
    data
  })
// 编辑岗位
export const editPost = (data: any) =>
  request({
    url: `/authority/station`,
    method: 'put',
    data
  })
// 获取岗位详情
export const detailPost = (id: any) =>
  request({
    url: `/authority/station/${id}`,
    method: 'get'
  })
// 删除岗位
export const deletePost = (params: any) =>
  request({
    url: `/authority/station`,
    method: 'delete',
    params
  })

import request from '@/utils/request'

// 日志列表
export const getList = (params: any) =>
  request({
    url: `/authority/loginLog/page`,
    method: 'get',
    params
  })
  // 操作日志列表
export const getOperationList = (params: any) =>
request({
  url: `/authority/optLog/page`,
  method: 'get',
  params
})

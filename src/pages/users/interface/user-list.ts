// 列表
export interface IArticleData {
  account?: string
  avatar?: string
  createTime?: string
  createUser?: number
  email?: string
  id?: number
  lastLoginTime?: string
  mobile?: string
  name?: string
  orgId?: number
  orgName?: string
  password?: string
  passwordErrorLastTime?: string
  passwordErrorNum?: number
  passwordExpireTime?: string
  roleNames?: any[]
  roles?: any[]
  sex?: Sex
  stationId?: number
  stationName?: string
  status?: boolean
  updateTime?: string
  updateUser?: number
  workDescribe?: string
}
// 用户翻页
export interface IManageUserPageListEntity {
  total?: string
  size?: string
  pages?: string
  current?: string
  records?: IArticleData[]
}

export interface Sex {
  code: string
  desc: string
}
// 表单
export interface IUserFreezeRequest {
  account?: string
  avatar?: string
  email?: string
  id?: number
  mobile?: string
  name?: string
  orgId?: string
  password?: string
  roles?:[]
  sex:iUsex
  stationId?: string
  status?: boolean
  workDescribe?: string
}
// 性别
export interface iUsex {
  code?: string
  desc?: string
}

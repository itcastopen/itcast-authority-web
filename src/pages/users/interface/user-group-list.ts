// 列表
export interface IArticleData {
  createTime?: string
  createUser?: number
  describe?: string
  id?: number
  name?: string
  roleId?: number
  roleName?: string
  status?: boolean
  updateTime?: string
  updateUser?: number
  userCount?: number
}

// 用户翻页
export interface IManageUserPageListEntity {
  total?: string
  size?: string
  pages?: string
  current?: string
  records?: IArticleData[]
}

// 表单
export interface IUserFreezeRequest {
  createTime?: string
  createUser?: number
  describe?: string
  id?: number
  name?: string
  roleId?: string
  roleName?: string
  status?: boolean
  updateTime?: string
  updateUser?: number
  userCount?: number
  userIds?: []
  userNames?: []
}

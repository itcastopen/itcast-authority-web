export interface MenuTableData {
  children?: any[]
  component?: string
  createTime?: string
  createUser?: number
  describe?: string
  group?: string
  icon?: string
  id?: number
  isEnable?: boolean
  isPublic?: boolean
  label?: string
  name?: string
  path?: string
  sortValue?: number
  updateTime?: string
  updateUser?: number
}
// Generated by https://quicktype.io

export interface DsType {
  code?: string
  desc?: string
  val?: number
}

// 用户翻页
export interface PageListEntity {
  total?: string
  size?: string
  pages?: string
  page?: string
  current?: string
  records?: MenuTableData[]
}

export interface RoleTableData {
  code?:string
  createTime?:string
  createUser?:number
  describe?: string
  dsType?: DsType
  id?: number
  name?: string
  readonly?: boolean
  repel?: number
  status?: boolean
  updateTime?: string
  updateUser?: number
  applicationIds?:[]
}

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
  records?: RoleTableData[]
}

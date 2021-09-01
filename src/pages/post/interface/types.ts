export interface IPostTableData {
    createTime?:string
    createUser?: number
    describe?: string
    id?: number
    name?: string
    orgId?: number
    orgName?: string
    status?: boolean
    updateTime?: string
    updateUser?:number
}

export interface IPostTable {
    current?: number
    pages?: number
    records?: IPostTableData[]
    searchCount?: boolean
    size?: number
    total?: number
}

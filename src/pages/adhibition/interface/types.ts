export interface ITableData {
    abbreviation?: string
    createTime?: string
    createUser?: number
    describe?: string
    id?: number
    name?: string
    status?: boolean
    updateTime?: string
    updateUser?: number
}

export interface IPostTable {
    current?: number
    pages?: number
    records?: ITableData[]
    searchCount?: boolean
    size?: number
    total?: number
}

import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule
} from 'vuex-module-decorators'
import { getRouterData, getUserAndPermissionInfo } from '@/api/api'
import { login } from '@/pages/base/api/api'
import { getAllList } from '@/pages/adhibition/api/index'
import {
  getToken,
  // setToken,
  removeToken,
  removeRoutes,
  removeUser,
  setUser,
  getUser,
  removeApply
} from '@/utils/cookies'
import store from '@/store'
// import { ILoginResponseEntity } from '@/api/types'
export interface IUserState {
  token: string
  name: string
  id: string
  avatar: string
  introduction: string
  roles: string[]
  uses:string[]
  userInfo: {}
  menuList: any[]
  permissionsList: any[]
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public name = ''
  public id =''
  public avatar = ''
  public introduction = ''
  public roles: string[] = []
  public uses:string[] = []
  public userInfo = getUser() || {}
  public menuList= []
  public permissionsList: any[] = []

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  // @Mutation
  // private SET_USER(user: Object) {
  //   this.userInfo = user
  // }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_ID(id: string) {
    this.id = id
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Mutation
  private SET_USE(uses: string[]) {
    this.uses = uses
  }

  @Mutation
  private SET_PERMISSION(permissionsList: any[]) {
    this.permissionsList = permissionsList
  }

  @Action
  public async Login(userInfo: {
    account: string
    code: string
    key: string
    password: string
  }) {
    let { account, password, code, key } = userInfo
    account = account.trim()
    const { data } = await login({ account, password, code, key })
    if (data.data !== '') {
      if (data.isSuccess) {
        const token = data.data.token
        this.SET_TOKEN(token.token)
      }
    }
    return data
  }

  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }

  @Action
  public async GetUserInfo() {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }
    let datas = getUser() || {}
    let userInfo
    if (typeof datas === 'object') {
      userInfo = datas
    } else {
      const userString = datas.toString()
      userInfo = JSON.parse(userString)
    }
    this.SET_NAME(userInfo.name)
    this.SET_ID(userInfo.id)
    this.SET_AVATAR(userInfo.avatar)
    this.SET_INTRODUCTION(userInfo.workDescribe)
  }

  @Action
  public async GetUserAndPermission() {
    const { data } = await getUserAndPermissionInfo()
    if (data.isSuccess) {
      setUser(data.data.user)
      this.SET_PERMISSION(data.data.permissionsList)
    }
  }

  @Action({ rawError: true })
  public async GetRouterInfo() {
    const { data } = await getRouterData({})
    // roles must be a non-empty array
    // if (!data.data || data.tata.length <= 0) {
    //   throw Error('GetUserInfo: roles must be a non-null array!')
    // }
    this.SET_ROLES(data.data)
  }
  @Action({ rawError: true })
  public async GetCurrent() {
    const { data } = await getAllList({})
    // roles must be a non-empty array
    // if (!data.data || data.tata.length <= 0) {
    //   throw Error('GetUserInfo: roles must be a non-null array!')
    // }
    this.SET_USE(data.data)
  }

  @Action
  public async LogOut() {
    // if (this.token === '') {
    //   throw Error('LogOut: token is undefined!')
    // }
    // await logout()
    removeToken()
    removeRoutes()
    removeUser()
    removeApply()
    this.SET_TOKEN('')
    this.SET_ROLES([])
    // this.SET_USER({})
    const storage = window.localStorage
        storage.clear()
        location.reload()
  }
}
export const UserModule = getModule(User)

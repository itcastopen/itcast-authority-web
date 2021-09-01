import Vue from 'vue'
import Vuex from 'vuex'
import { IAppState } from './modules/app'
import { IUserState } from './modules/user'
import { IPermissionState } from './modules/permission'

Vue.use(Vuex)

export interface IRootState {
  app: IAppState
  user: IUserState
  permission: IPermissionState
  menuList: Array<string> | undefined // 菜单数组
  menubtnList: Array<string> | undefined // 权限（按钮组数）
  menuData: Array<string> | undefined // 查询角色拥有的资源id集合
  deleteMenuList: Array<string> | undefined // 取消菜单数组
  deleteMenubtnList:Array<string> | undefined // 取消权限（按钮组数）
  menuCheckboxList:Array<string> | undefined // 角色-全选反选
  deletemMnuCheckboxList:Array<string> | undefined // 角色-全选反选
  routrsData: Array<string> | undefined // 路由
  orgData: Array<string> | undefined // 组织
  baseTreeData: Array<string> | undefined // 路由
  baseTreeId :string | undefined // 路由
  baseMenuTreeId:string | undefined // 菜单
  updatedOrgTreeId:string | undefined // 组织
  theme:string | undefined // 主题
  themeColor:string | undefined // 主题颜色
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({
  state: {
    menuList: [],
    menubtnList: [],
    menuData: [],
    routrsData: [],
    deleteMenuList: [],
    deleteMenubtnList: [],
    menuCheckboxList: [],
    deletemMnuCheckboxList: [],
    orgData: [],
    baseTreeData: [],
    baseTreeId: '',
    baseMenuTreeId: '',
    updatedOrgTreeId: '',
    theme: '',
    themeColor: '#409EFF'
  } as any,
  mutations: {
    // 获取、取消菜单
    updatedMenuList(state, data) {
      (state.menuList as any).push(data)
      state.menuList = [...new Set(state.menuList)].concat([...new Set(state.menuCheckboxList)])
    },
    // 取消菜单
    deleteMenuList(state, data) {
      (state.menuList as any).splice((state.menuList as any).findIndex((obj:Object) => (obj === data)), 1);
      (state.deleteMenuList as any).push(data)
      state.deleteMenuList = [...new Set(state.deleteMenuList)].concat([...new Set(state.deletemMnuCheckboxList)])
    },
    // 获取菜单按钮
    updatedbtnMenuList(state, data) {
      data.forEach((obj:any) => {
        (state.menubtnList as any).push(obj)
      })
      // (state.menubtnList as any).push(data)
      state.menubtnList = [...new Set(state.menubtnList)]
    },
    // 获取菜单按钮
    updatedAllbtnMenuList(state, data) {
      state.menubtnList = data
      state.menubtnList = [...new Set(state.menubtnList)]
    },
    // 取消菜单按钮
    deletebtnMenuList(state, data) {
      (state.menubtnList as any).splice((state.menubtnList as any).findIndex((obj:Object) => (obj === data)), 1)
    },
    // 储存角色id集合
    updatedMenuData(state, data) {
      state.menuData = data
      state.menuData = [...new Set(state.menuData)]
    },
    // 获取角色菜单管理树数据
    updatedmenuDataCheckboxList(state, data) {
      (state.menuCheckboxList as any) = [...new Set(data)]
    },
    deleteCheckboxList(state, data) {
      data.forEach((val:any) => {
        (state.menuCheckboxList as any).splice((state.menuCheckboxList as any).findIndex((obj:Object) => (obj === val)), 1)
      })
      state.deletemMnuCheckboxList = data
      state.deletemMnuCheckboxList = [...new Set(state.deletemMnuCheckboxList)]
    },
    // 存储路由集合
    updatedroutrsData(state, data) {
      state.routrsData = data
      state.routrsData = [...new Set(state.routrsData)]
    },
    // 存储菜单管理树，便于修改，删除，修改状态，拖拽更新数据，页面不刷新效果
    updatedOrgData(state, data) {
      state.orgData = data
      state.orgData = [...new Set(state.orgData)]
    },
    // 存储所有角色
    updatedDataTree(state, data) {
      (state.baseTreeData as any) = data
    },
    // 存储角色id
    updatedDataTreeId(state, data) {
      (state.baseTreeId as any) = data
    },
    // 存储菜单id
    updatedMenuTreeId(state, data) {
      (state.baseMenuTreeId as any) = data
    },
    // 储存组织id
    updatedOrgTreeId(state, data) {
      (state.updatedOrgTreeId as any) = data
    },
    // 储存主题
    updatedTheme(state, theme) {
      (state.theme as any) = theme
    },
    // 储存主题颜色
    updatedThemeColor(state, themeColor) {
      (state.themeColor as any) = themeColor
    }
  }
})

import Cookies from 'js-cookie'

// App
const sidebarStatusKey = 'sidebar_status'
export const getSidebarStatus = () => Cookies.get(sidebarStatusKey)
export const setSidebarStatus = (sidebarStatus: string) =>
  Cookies.set(sidebarStatusKey, sidebarStatus)

// User
const tokenKey = 'admin_access_token'
const userData = 'admin_access_user'
const userRoutes = 'admin_access_routes'
const userApply = 'admin_access_apply'
export const getToken = () => Cookies.get(tokenKey)
export const setToken = (token: string) => Cookies.set(tokenKey, token)
export const removeToken = () => Cookies.remove(tokenKey)
export const setUser = (user: object) => Cookies.set(userData, user)
export const getUser = () => Cookies.get(userData)
export const removeUser = () => Cookies.remove(userData)
export const getCodes = () => Cookies.get(userData)
export const setCodes = (code: string) => Cookies.set(userData, code)

export const getRoutes = () => Cookies.get(userRoutes)
export const setRoutes = (route: any) => Cookies.set(userRoutes, route)
export const removeRoutes = () => Cookies.remove(userRoutes)

// 应用id
export const getApply = () => localStorage.getItem(userApply)
export const setApply = (token: string) => localStorage.setItem(userApply, token)
export const removeApply = () => localStorage.removeItem(userApply)

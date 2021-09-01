import store from '@/store'
// key
export function randomNum(len: number, radix: number) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
    ''
  )
  const uuid = []
  radix = radix || chars.length

  if (len) {
    // Compact form
    let i: number
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    // rfc4122, version 4 form
    let r:number

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    let k:number
    for (k = 0; k < 36; k++) {
      if (!uuid[k]) {
        r = 0 | (Math.random() * 16)
        uuid[k] = chars[k === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('') + new Date().getTime()
}
// 多余的字用省略号
export function ellipsis(value: any, num:any) {
  if (!value) return ''
  if (value.length > num) {
    return value.substring(0, num) + '...'
  }
  return value
}
// 筛选刷新数据
export function restData(value:any, obj:any, index:any) {
  obj.status = !obj.status
  value[index] = obj
}
// 随机数
export const randomWord = (randomFlag: boolean, min: number, max: number) => {
  let str = ''
  let range = min
  let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min
  }
  for (let i = 0; i < range; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1))
    str += arr[pos]
  }
  return str
}

// 按钮权限
export const hasPermission = (key:any) => {
  return store.state.user.permissionsList.indexOf(key) !== -1 || false
}

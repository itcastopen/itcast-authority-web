export const isValidUsername = (str: string) =>
  ['admin', 'editor'].indexOf(str.trim()) >= 0

export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path)
// 账号验证
export const validateAccounts = (
  rule: any,
  value: string,
  callback: Function
) => {
  let accountreg = /^[A-Za-z0-9]{3,20}$/
  if (!accountreg.test(value)) {
    callback(new Error('账号必须由数字、字母,请输入3-20位'))
  } else if (value === undefined || value === '') {
    callback(new Error('请输入账号'))
  } else {
    callback()
  }
}
// 名字验证
export const validateName = (rule: any, value: string, callback: Function) => {
  let namereg = /^[\u0391-\uFFE5A-Za-z0-9]{1,12}$/

  if (!namereg.test(value)) {
    callback(new Error('请输入1-12位'))
    // value = value.substring(0,12)
  } else if (value === undefined || value === '') {
    callback(new Error('请输入名称'))
  } else {
    callback()
  }
}
//
export function validatePhone(rule: any, value: any, callback: any) {
  const reg = /^[1][3-9][0-9]{9}$/
  if (value === '' || value === undefined || value === null) {
    if (rule.required) {
      callback(new Error('请输入电话号码'))
    } else {
      callback()
    }
  } else {
    if (!reg.test(value) && value !== '') {
      callback(new Error('请输入正确的电话号码'))
    } else {
      callback()
    }
  }
}
// 上传
export const importFilexml = (
  file: any,
  obj: any,
  callback: any,
  func: any
) => {
  if (file.size < 10100000) {
    let fileName = file.name
    let suffix = fileName.substring(fileName.lastIndexOf('.') + 1).toUpperCase()

    if (suffix === 'xml' || suffix === 'XML') {
      return true
    } else {
      let tipType = '文件类型不正确,请重新上传'
      callback(tipType)
      return false
    }
  } else {
    let tipSize = '文件大小超过10M,请重新上传'
    callback(tipSize)
    return false
  }
}

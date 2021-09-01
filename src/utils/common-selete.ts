import {
  ICommonSelectOptions
  } from './common-interface'
export const selectOptions = [
    {
      value: '1',
      label: '全部'
    },
    {
      value: '2',
      label: '本级'
    },
    {
      value: '3',
      label: '本级及子级'
    },
    {
      value: '4',
      label: '个人'
    },
    {
      value: '5',
      label: '自定义'
    }
  ]
export const statusOptions = [
  {
      value: null,
      label: '全部'
    },
    {
      value: '1',
      label: '启用'
    },
    {
      value: '0',
      label: '禁用'
    }
]
export const optTypeOptions = [
  {
      value: 'GET',
      text: 'GET'
    },
    {
      value: 'POST',
      text: 'POST'
    },
    {
      value: 'PUT',
      text: 'PUT'
    },
    {
      value: 'DELETE',
      text: 'DELETE'
    },
    {
      value: 'PATCH',
      text: 'PATCH'
    },
    {
      value: 'TRACE',
      text: 'TRACE'
    },
    {
      value: 'HEAD',
      text: 'HEAD'
    },
    {
      value: 'OPTIONS',
      text: 'OPTIONS'
    }
]
export const TypeOptions = [
  { text: '正常', value: 'OPT' },
  { text: '异常', value: 'EX' }
]

<template>
  <div ref="getHeight" class="app-container tableMain">
    <div class="main">
      <h2 class="crumbsTitle">菜单管理</h2>
      <div class="container scrollTable tabConLeft">
        <!-- 搜索框 -->
        <div class="conSearch">
          <el-form ref="ruleForm" :inline="true" :model="searchData">
            <el-row>
              <el-col :span="24">
                <el-form-item prop="name" label="菜单名称：">
                  <el-input
                    v-model="searchData.name"
                    placeholder="请输入"
                    suffix-icon="el-icon-search"
                    style="width: 197px;"
                    clearable
                    @click.native="handleSearch"
                    @keypress.native.enter="handleSearch"
                  />
                </el-form-item>
                <el-button v-if="$hasPermission('menu:add')" type="primary" class="textRight" @click="handleAdd('')">
                  添加菜单
                </el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <module-tip :data-table="menuTreeData" :list-loading="listLoading" />
        <div v-if="menuTreeData.length > 0" id="resultScroll" class="menuMain">
          <el-table
            ref="table"
            v-loading="listLoading"
            :data="menuTreeData"
            :row-key="rowKey"
            fit
            :row-class-name="row => row.row.classs ===true ? 'current-row' : ''"
            :expand-row-keys="expandRow"
            :tree-props="treeProps"
            class="orgTree"
            style="width: 100%"
            @row-click="handleClickRow"
          >
            <el-table-column
              prop=""
              width="220"
            >
              <template slot="header">
                <span>
                  菜单名称
                </span>
              </template>
              <template slot-scope="{ row }">
                {{ ellipsis(row.name, 6) }}
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header">
                <span>
                  状态
                </span>
              </template>
              <template slot-scope="{ row }">
                <div @click.stop>
                  <el-switch v-if="row.parentIsEnable===false&&row.isEnable===true" v-model="row.isEnable" :disabled="!$hasPermission('menu:update')" @change="handleState(row)" />
                  <el-switch v-else v-model="row.isEnable" :disabled="!$hasPermission('menu:update') || row.parentIsEnable===false" @change="handleState(row)" />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              width="150"
              fixed="right"
            >
              <template slot="header">
                <span>
                  操作
                </span>
              </template>
              <template slot-scope="{ row }">
                <div class="operation">
                  <el-button v-if="$hasPermission('menu:update')" class="inputText" :disabled="!row.isEnable" @click.stop="handleEdit(row)">修改</el-button>
                  <el-button v-if="$hasPermission('menu:delete')" class="inputText delect" :disabled="!row.isEnable" @click.stop="handleDelete(row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 用户添加、编辑对话框 -->
        <user-add-dialog
          v-if="isShow"
          ref="userDialog"
          :menu-tree-data="menuTreeData"
          :editdata="formData"
          :dialog="dialog"
          @close="handleClose"
          @cleardata="clearData"
          @getMenuList="getMenuList"
        />
        <!-- end -->
        <!-- 启用禁用 -->
        <base-dialog
          ref="status"
          :dialog="dialog"
          @handle-close="handleCloseStatus"
          @state-submit="handleStateSubmit"
        />
        <!-- end -->
        <!-- 删除 -->
        <delete
          ref="delete"
          :dialog="dialog"
          @handleCloseDelete="handleCloseDelete"
          @delete="deleteButton"
          @cleardata="clearData"
        />
        <!-- end -->
      </div>
      <div class="container tabConRight">
        <jurisdiction
          ref="menu"
          :formdata="formData"
          :data-table="dataTable"
          :total="total"
          :list-loading="listLoading"
          :search-data="searchData"
          @getlist="getList"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

import { ElForm } from 'element-ui/types/form'
import { ellipsis } from '@/utils'
// 组件
// 删除
import Delete from './components/delete.vue'
// 添加
import UserAddDialog from './components/add.vue'
// import dragTreeTable from '@/components/treeTable/dragTreeTable.vue'
import ModuleTip from '@/components/ModuleTip/index.vue'
// 启用禁用
import BaseDialog from '@/components/BaseStatus/index.vue'
import Jurisdiction from './components/jurisdiction.vue'
// interface接口
import { MenuTableData, PageListEntity } from '@/pages/menu/interface/types'
// api
import { getRole, getAllTree } from '@/api/api'
import {
  getmenuList,
  getAllMenu,
  deleteMenu,
  move,
  detailMenu,
  editStatus
} from '@/pages/menu/api/index'
// import { log } from 'util'
@Component({
  name: 'RoleList',
  components: {
    Delete,
    UserAddDialog,
    BaseDialog,
    Jurisdiction,
    // dragTreeTable,
    ModuleTip
  }
})
export default class extends Vue {
  private ref = this.$refs as any
  private dataTable: MenuTableData[] = []
  private listLoading = true
  private isShow = false
  private delectData = []
  // private roleData = {} as any
  private roleIds = [] as any
  private formData={
    name: '', // 名称
    path: '', // 路由
    parentId: '', // 上级类目
    icon: '', // 图标
    isEnable: true, // 状态
    sortValue: '' // 排序
  } as any
  private searchData = {
    name: '',
    size: 10,
    current: 1,
    menuId: ''
  } as any
  private dialog = {
    id: '',
    msg: '',
    isVisible: false,
    isDeleVisible: false,
    isStatusVisible: false,
    type: 'add',
    isEnable: false,
    name: '',
    parentId: '',
    title: ''
  }
  private treeData = {
    treeShow: false,
    valueId: '' // 初始ID（可选）
  }
  private treeDatas = {
    columns: [],
    lists: []
  } as any
  private menuTreeData = [] as any
  private total = ''
  private rowKey = 'id'
  private expandRow = []
  private newData = {} as any
  private leave=1
  private objdata= [] as any
  private menuId='' as string
  private treeProps = { children: 'children', hasChildren: 'hasChildren' }

  /// 生命周期
  created() {
    this.getMenuList()
  }
  mounted() {
    this.isShow = true
  }
  /// // 功能函数 /////
  // 获取组织列表
  private async getMenuList() {
    this.listLoading = true
    const parent = {
      name: this.searchData.name
    } as any
    const { data } = await getAllMenu(parent)
    if (data.isSuccess === true) {
      const menuId = this.$store.state.baseMenuTreeId
      if (menuId !== '') {
        this.menuId = menuId
        this.searchData.menuId = menuId
      } else {
        if (data.data.length > 0) {
        this.menuId = data.data[0].id
        this.searchData.menuId = data.data[0].id
        }
      }
      this.getList(this.menuId) // 默认权限显示
      this.menuTreeData = this.addMenuClass(data.data, this.menuId) // 添加highlight属性
    }
    setTimeout(() => {
      this.listLoading = false
    }, 0.1)
  }

  // 获取数据
  private async getList(val: any) {
    this.listLoading = true
    const { data } = await getmenuList(this.searchData)
    if (data.isSuccess === true) {
      this.dataTable = data.data.records
      this.total = data.data.total
    }
    setTimeout(() => {
      this.listLoading = false
    }, 0.001)
  }
  // 搜索
  private handleSearch() {
    this.searchData.current = 1
    this.getMenuList()
  }
  async filterParent(arr: any, form: any) {
    let arrRes = {} as any
    for (let i = 0, length = arr.length; i < length; i++) {
      let node = arr[i]
      if (node.id === form.parentId) {
        form.parentName = node.name
      } else {
        if (node.children) {
          this.filterParent(node.children, form)
        }
      }
    }
    return arrRes
  }
  // 编辑用户
  async filterMenu(arr: any, item: any) {
    // let arrRes = []
    for (let i = 0, length = arr.length; i < length; i++) {
      let node = arr[i]
      const parent = {
        id: item.id,
        name: item.name,
        parentId: '',
        sortValue: item.sortValue
      } as any
      if (node.id === item.id) {
        parent.parentId = node.parent_id
        if (node.parent_id === undefined) {
          parent.parentId = node.parentId
        }
        const { data } = await move(parent)
        if (data.isSuccess) {
          this.getMenuList()
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
        }
      } else {
        if (node.children) {
          this.filterMenu(node.children, item)
        }
      }
    }
  }
  // 启用、禁用确认
  private async handleStateSubmit() {
    const parent = {
      id: this.dialog.id,
      isEnable: this.dialog.isEnable,
      name: this.dialog.name,
      parentId: this.dialog.parentId
    }
    const { data } = await editStatus(parent)
    if (data.isSuccess) {
      this.dialog.isStatusVisible = false
      this.$message.success('操作成功')
      this.getMenuList()
    } else {
      this.$message.error(data.msg)
    }
  }
  // 删除
  private async deleteButton() {
    const ids: any[] = []
    const { data } = await deleteMenu({ ids: this.roleIds })
    if (data.isSuccess === true) {
      this.$message.success('操作成功')
      this.getMenuList()
    } else {
      this.$message.error(data.msg)
    }
    this.dialog.isDeleVisible = false
  }
  // 获取详情
  private async getEdit(id: string) {
    const { data } = await detailMenu(id)
    this.formData = data.data

    this.filterParent(this.menuTreeData, this.formData)
  }
  // 单个删除
  private handleDelete(row: any) {
    this.storeData(row.id)
    this.roleIds.push(row.id)
    if (row.children && row.children.length > 0) {
      this.roleIds = this.roleIds.concat(this.deleteData(row.children))
    }

    this.dialog.isDeleVisible = true
  }
  deleteData(arr:any) {
    let arrRow = [] as any
    arr.forEach((element:any) => {
      this.roleIds.push(element.id)
      if (element.children) {
        this.deleteData(element.children)
      }
    })
    return arrRow
  }
  // 修改
  private handleEdit(row: any) {
    this.storeData(row.id)
    this.dialog.type = 'edit'
    this.dialog.title = '修改'
    this.dialog.isVisible = true
    this.getEdit(row.id)
  }
  /// // ui /////
  // 启用，禁用
  private async handleState(value: any) {
    this.newData = value
    this.storeData(value.id)
    this.dialog.isStatusVisible = true
    this.dialog.id = value.id
    this.dialog.isEnable = value.isEnable
    this.dialog.name = value.name
    this.dialog.parentId = value.parentId
    if (!value.isEnable) {
      this.dialog.msg = `"${value.name}" 将被禁止登录！`
      this.dialog.title = '确认禁用'
    } else {
      this.dialog.msg = `"${value.name}" 启用！`
      this.dialog.title = '确认启用'
    }
  }
  // 添加关闭弹层
  handleClose() {
    this.dialog.isVisible = false
  }
  // 启用，禁用筛选
  filterHandler(value: string) {
    this.searchData.isEnable = value
  }
  // 启用禁用弹层关闭
  async handleCloseStatus() {
    this.dialog.isStatusVisible = false
    await this.filterstatus(this.menuTreeData, this.newData)
  }
  // 删除弹层关闭
  handleCloseDelete() {
    this.dialog.isDeleVisible = false
  }
  // 用户添加
  handleAdd() {
    this.clearData()
    this.dialog.isVisible = true
    this.dialog.type = 'add'
    this.dialog.title = '添加'
    this.searchData.name = ''
    this.getMenuList()
  }
  // 内容控制字数，多出的用省略号
  ellipsis(value: any, num: any) {
    return ellipsis(value, num)
  }
  // 触发当行
  handleClickRow(row: any) {
    this.searchData.menuId = row.id
    this.addMenuClass(this.menuTreeData, row.id)
    this.getEdit(row.id)
    this.getList(row.id)
  }
  clearData() {
    this.formData = {}
  }
  // 递归状态取消，修改关闭状态
  async filterstatus(data: any, obj: any) {
    if (data !== null) {
      let result = [] as any
      for (let i = 0; i < data.length; i++) {
        let item = data[i]

        if (item.id === obj.id) {
          item.isEnable = !item.isEnable
        }
        result.push(item)
        if (item.children && item.children.length > 0) {
          await this.filterstatus(item.children, obj)
        }
      }
      return result
    }
  }
  // 添加当前行样式class属性
  addMenuClass(arr: any, id:string) {
    let arrRes = [] as any
    for (let i = 0, length = arr.length; i < length; i++) {
      let node = arr[i]
      // node.highlight = false

      // node.open = true
      if (id === node.id) {
          node.classs = true
        } else {
          node.classs = false
        }
      arrRes.push(node)
      if (node.children) {
        this.addMenuClass(node.children, id)
      }
    }
    return arrRes
  }
  // 删除数据筛选
  async filterOpen(arr: any, obj?: any, add?:any) {
    // const id = this.$store.state.baseMenuTreeId
    let arrRes = [] as any
    for (let i = 0, length = arr.length; i < length; i++) {
      let node = arr[i]

        if (node.id === obj.id) {
          arr.splice(i, 1)
        }

        if (node.children) {
          arrRes = arrRes.concat(await this.filterOpen(node.children, obj))
        }
        arrRes.push(node)
      // }
    }
    return arrRes
  }
  // 数据筛选 编辑完数据之后列表默认展开open，当前行加背景色
  async filterOpenSave(arr: any, newArr: any) {
    const id = this.$store.state.baseMenuTreeId
    let arrRes = [] as any

    for (let i = 0; i < arr.length; i++) {
      let node = arr[i]
      for (let n = 0; n < newArr.length; n++) {
        let nodes = newArr[n]

        if (nodes.id === id) {
          nodes.highlight = true
        } else {
          nodes.highlight = false
        }
        if (node.id === nodes.id) {
          if (nodes.parentIsEnable === false && node.parentIsEnable === true) {
            node.parentIsEnable = nodes.parentIsEnable
          }
          nodes.parentIsEnable = node.parentIsEnable
          nodes.open = node.open
          arrRes.push(nodes)
        }

        if (node.children && nodes.children) {
          this.filterOpenSave(node.children, nodes.children)
        }
      }
    }
    return arrRes
  }
  // 拖拽修改状态关闭还是禁用
  async filterData(arr?: any, obj?: any, child?:any, where?:any) {
    let arrRes = [] as any
    let objarrRes = [] as any

    if (child) {
      child.forEach((element:any) => {
        if (where === 'top' || where === 'bottom') {
          obj.parentIsEnable = null
          if (obj.isEnable === false) {
            element.parentIsEnable = false
          } else {
            element.parentIsEnable = obj.isEnable
            // element.isEnable = obj.isEnable
          }
        } else {
            element.parentIsEnable = obj.parentIsEnable
        }

        if (element.children) {
          this.filterData(element.children, obj, element.children, where)
        }
        objarrRes.push(element)
    })
      obj.children = objarrRes
    }
    for (let i = 0, length = arr.length; i < length; i++) {
      let node = arr[i]
        if (node.id === obj.id) {
          node = obj
        }

        if (node.children) {
          this.filterData(node.children, obj)
        }
        arrRes.push(node)
    }
    return arrRes
  }
  // 存储数据
  storeData(id: string) {
    this.$store.commit('updatedDataTree', this.menuTreeData) // 当前菜单数据存储到数据池
    this.$store.commit('updatedMenuTreeId', id) // 当前菜单数据存储到数据池
  }
}
</script>

<style lang="scss" scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>

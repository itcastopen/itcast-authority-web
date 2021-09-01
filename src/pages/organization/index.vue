<template>
  <div ref="getHeight" class="app-container">
    <div class="main">
      <h2 class="crumbsTitle">组织管理</h2>
      <div class="container tabCon">
        <!-- 搜索框 -->
        <div class="conSearch">
          <div class="serchForm searchMain">
            <el-form ref="ruleForm" :inline="true" :model="searchData">
              <el-row :gutter="18">
                <el-col :span="6">
                  <el-form-item label="组织名称：">
                    <el-input
                      v-model="searchData.name"
                      placeholder="请输入"
                      clearable
                      @clear="resetSearch"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-button
                    type="primary"
                    class="marLeft"
                    @click="handleSearch"
                  >
                    搜索
                  </el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
        <div class="operationData">
          <el-button v-if="$hasPermission('org:add')" type="primary" @click="handleAdd('')">添加组织</el-button>
        </div>
        <module-tip :data-table="orgData" :list-loading="listLoading" />
        <div v-if="orgData.length > 0" class="organization">
          <el-table
            ref="table"
            v-loading="listLoading"
            :data="orgData"
            :row-key="rowKey"
            border
            fit
            :row-class-name="row => row.row.classs ===true ? 'current-row' : ''"
            style="width: 100%"
            :expand-row-keys="expandRow"
            :tree-props="treeProps"
            class="orgTree"
            @row-click="handleClickRow"
          >
            <el-table-column
              prop="name"
            >
              <template slot="header">
                <span>
                  | 组织名称
                </span>
              </template>
            </el-table-column>
            <el-table-column
              width="250"
            >
              <template slot="header">
                <span>
                  | 状态
                </span>
              </template>
              <template slot-scope="{ row }">
                <div @click.stop>
                  <el-switch v-if="row.parentStatus===false&&row.status===true" v-model="row.status" :disabled="!$hasPermission('org:update')" @change="handleState(row)" />
                  <el-switch v-else v-model="row.status" :disabled="row.parentStatus===false || !$hasPermission('org:update')" @change="handleState(row)" />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              width="250"
            >
              <template slot="header">
                <span>
                  | 操作
                </span>
              </template>
              <template slot-scope="{ row }">
                <div class="operation">
                  <el-button v-if="$hasPermission('org:add')" class="inputText" :disabled="!row.status" @click.stop="handleAdd(row)">添加</el-button>
                  <el-button v-if="$hasPermission('org:update')" class="inputText" :disabled="!row.status" @click.stop="handleEdit(row.id)">修改</el-button>
                  <el-button v-if="$hasPermission('org:delete')" class="inputText delect" :disabled="!row.status" @click.stop="handleDelete(row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 用户添加、编辑对话框 -->
        <user-add-dialog
          ref="userDialog"
          :dialog="dialog"
          :orgdata="orgData"
          :editdata="editData"
          :parentid="parentId"
          :parentname="parentName"
          @close="handleClose"
          @cleardata="clearData"
          @getOrgList="getOrgList"
        />
        <!-- end -->
        <!-- 用户删除警告框 -->
        <delete
          ref="fileDialog"
          :dialog="dialog"
          :dele-data="deleData"
          @delete="deleteButton"
          @batchDelete="handleDelete"
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
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
import { ellipsis } from '@/utils'
// 组件
import Delete from './components/delete.vue'
import ModuleTip from '@/components/ModuleTip/index.vue'
// 启用禁用
import BaseDialog from '@/components/BaseStatus/index.vue'
// 添加
import UserAddDialog from './components/add.vue'
// api
import { getRole, getAllTree } from '@/api/api'
import {
  deletes,
  move,
  editStatus,
  detail
} from '@/pages/organization/api/index'
@Component({
  name: 'organization',
  components: {
    Delete,
    BaseDialog,
    UserAddDialog,
    ModuleTip
  }
})
export default class extends Vue {
  private tableData = []
  private listLoading = true
  private delectData = []
  private roleData = []
  private orgData = [] as any
  private oldList: number[] = []
  private newList: number[] = []
  private deleData = {} as any
  private el: any = this.$refs
  private parentId = ''
  private parentName = ''
  private rowKey = 'id'
  private expandRow = []
  private treeProps = { children: 'children', hasChildren: 'hasChildren' }
  private expandLevel = 3
  private flattArray = []
  private treeDatas = {
    columns: [],
    lists: []
  } as any
  private treeData = {
    treeShow: false,
    valueId: '' // 初始ID（可选）
  }
  private searchData = {
    name: ''
  } as any
  private dialog = {
    id: '',
    msg: '',
    isVisible: false,
    isDeleVisible: false,
    isStatusVisible: false,
    type: 'add',
    status: false,
    title: ''
  }
  private editData = {
    parentId: '',
    name: '',
    status: true,
    sortValue: ''
  } as any
  private treeParams = {
    clickParent: false,
    filterable: true,
    data: [],
    props: {
      children: 'children',
      label: 'name',
      disabled: 'disabled',
      value: 'id'
    }
  }
  private values = ''
  private moveId = ''
  private newData = {} as any
  private orgid='' as string
  private baseTreeData = [] as any
  created() {
    this.getRole()
    this.getOrgList()
  }
  /// // 功能函数 /////
  // 获取角色列表
  private async getRole() {
    const { data } = await getRole({ status: true })
    if (data.isSuccess === true) {
      this.roleData = data.data
    }
  }
  // 获取组织列表
  private async getOrgList() {
    const menuData = this.$store.state.baseTreeData
    this.listLoading = true
    const parent = {
      name: this.searchData.name
    } as any
    if (this.searchData.status !== undefined) {
      parent.status = this.searchData.status
    }
    const { data } = await getAllTree(parent)
    if (data.isSuccess === true) {
      // 根据当前选中的id给表格添加默认选中状态
      const orgId = this.$store.state.updatedOrgTreeId
      if (orgId) {
        this.orgid = orgId
      } else {
        if (data.data.length > 0) {
          this.orgid = data.data[0].id
        }
      }
      this.orgData = this.addMenuClass(data.data, this.orgid)
      if (this.orgData.length > 0) {
        this.treeData.valueId = this.orgData[0].id
      }
      this.baseData(this.orgData)
    }
    setTimeout(() => {
      this.listLoading = false
    }, 0.1)
  }
  // 启用、禁用确认
  private async handleStateSubmit() {
    const parent = {
      id: this.dialog.id,
      status: this.dialog.status
    }
    const { data } = await editStatus(parent)
    if (data.isSuccess) {
      this.dialog.isStatusVisible = false
      this.$message.success('操作成功')
    } else {
      this.$message.error(data.msg)
    }
    this.getOrgList()
  }
  async filterStatusDatas(arr?: any, obj?: any, child?: any) {
    let result = [] as any
    let objData = {} as any
    let objarrRes = [] as any

    if (child) {
      for (let n = 0; n < child.length; n++) {
        let el = child[n]
        el.parentStatus = obj.status
        el.status = obj.status
        objarrRes.push(el)
        if (el.children && el.children !== undefined) {
          objarrRes = objarrRes.concat(
            await this.filterStatusDatas(el.children, obj, el.children)
          )
        }
      }
      obj.children = child
      objData = obj
    }
    if (arr) {
      for (let i = 0; i < arr.length; i++) {
        let node = arr[i]
        if (node.id === objData.id) {
          node = objData
        }
        if (node.children && node.children !== undefined) {
          this.filterStatusDatas(node.children)
        }
        result.push(node)
      }
    }
    return result
  }
  // 搜索
  private handleSearch() {
    this.getOrgList()
  }
  // 启用，禁用
  private async handleState(value: any) {
    // bool:boolean
    this.newData = value
    this.storeData(value.id)
    this.dialog.isStatusVisible = true
    this.dialog.id = value.id
    this.dialog.status = value.status
    if (!value.status) {
      this.dialog.msg = `"${value.name}" 将被禁止使用！`
      this.dialog.title = '确认禁用'
    } else {
      this.dialog.msg = `"${value.name}" 启用！`
      this.dialog.title = '确认启用'
    }
  }
  // 删除
  private async deleteButton() {
    const ids = [this.deleData.id]
    const { data } = await deletes({ ids: ids })
    if (data.isSuccess === true) {
      if (data.data.length > 0) {
        this.$message.error('删除失败！请删除子级组织或用户后重试！')
      } else {
        this.$message.success('操作成功！该组织在列表内删除')
        this.getOrgList()
      }
    } else {
      this.$message.error(data.msg)
    }
    this.dialog.isDeleVisible = false
  }
  // 单个删除
  private handleDelete(row: any) {
    this.newData = row
    this.storeData(row.id)
    this.deleData = row
    this.dialog.isDeleVisible = true
  }
  // 获取详情
  private async getEdit(id: string) {
    const { data } = await detail(id)
    this.editData = data.data
  }
  clearData() {
    this.parentId = ''
    this.parentName = ''
    this.editData = {}
  }
  // 修改
  private handleEdit(id: string) {
    this.storeData(id)
    this.dialog.type = 'edit'
    this.dialog.title = '修改'
    this.dialog.isVisible = true
    this.getEdit(id)
  }
  /// // ui /////
  // 获取组织树id
  getValue(value: any) {
    this.treeData.valueId = value
  }
  // 获取删除的数据
  handleSelectionChange(value: any) {
    this.delectData = value
  }
  // 重置
  resetSearch() {
    (this.$refs.ruleForm as ElForm).resetFields()
    // this.searchData.orgId = ''
    this.getOrgList()
  }
  // 启用，禁用筛选
  filterHandler(value: string) {
    // return row.status === value
    this.searchData.status = value
    this.getOrgList()
  }
  // 启用禁用弹层关闭
  async handleCloseStatus() {
    this.dialog.isStatusVisible = false
    // this.getOrgList()
    this.orgData = await this.filterstatus(this.orgData, this.newData)
  }
  // 关闭添加弹层
  handleClose() {
    this.dialog.isVisible = false
    // this.getOrgList()
  }
  async filterOpenSave(arr: any, newArr: any) {
    const id = this.$store.state.updatedOrgTreeId
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
  // 用户添加
  handleAdd(row: any) {
    if (row.id !== '' || row.id !== undefined) {
      this.parentId = row.id
      this.parentName = row.name
    }
    this.dialog.isVisible = true
    this.dialog.type = 'add'
    this.dialog.title = '添加'
    this.searchData.name = ''
    this.getOrgList()
  }
  // 内容控制字数，多出的用省略号
  ellipsis(value: any, num: any) {
    return ellipsis(value, num)
  }
  // 存储数据
  storeData(id: string) {
    this.$store.commit('updatedDataTree', this.orgData) // 当前菜单数据存储到数据池
    this.$store.commit('updatedOrgTreeId', id) // 当前菜单数据存储到数据池
  }
  // 触发当行
  handleClickRow(row:any) {
    // this.roleData = row
    this.addMenuClass(this.orgData, row.id)
    this.getEdit(row.id)
    this.orgid = row.id
    this.roleData.forEach((item:any) => {
      if (item.status === false || row.id === item.id) {
          item.disabled = true
      }
    })
  }
  // 拖拽排序
  async onTreeDataChange(
    lists: Array<String>,
    from: any,
    to: any,
    where: string
  ) {
    const parent = {
      id: from.id,
      name: from.name,
      parentId: from.parentId,
      sortValue: from.sortValue
    } as any
    const { data } = await move(parent)
    if (data.isSuccess) {
      lists.forEach((obj:any) => {
        if (obj.parentId === '0') {
          obj.parentStatus = null
        }
      })
      this.$message({
        message: '操作成功！',
        type: 'success'
      })
    } else {
      this.$message({
        message: data.msg,
        type: 'error'
      })
    }
  }

  // 1 移动节点
  MoveTreeNode(parentNode?: any, currentNode?: any) {
    let arrRes = [] as any
    for (let index = 0; index < parentNode.length; index++) {
      let curNode = parentNode[index]
      if (currentNode) {
        if (curNode.id === currentNode.id) {
          curNode = currentNode
        }
        arrRes.push(curNode)
      }

      if (curNode.children && curNode.children.length > 0) {
        this.MoveTreeNode(curNode.children)
      }
    }
    return arrRes
  }

  // 2 重新排序，整棵树
  // ReSortTree(this.treeDatas.lists)

  private ReSortTree(arr: any, parentNode?: any) {
    let arrRes = [] as any
    for (let index = 0; index < arr.length; index++) {
      let curNode = arr[index]

      if (parentNode) {
        // 当前状态和父级状态都是false情况下
        if (!parentNode.status && !parentNode.parentStatus) {
          // 父级是false情况下
          curNode.parentStatus = parentNode.status // 子节点处理
          if (!parentNode.parentStatus) {
            // 父元素是false情况下
            curNode.parentStatus = parentNode.status // 子节点处理
            if (curNode.children) {
              curNode.children = this.filterDatas(curNode.children, parentNode.status)
            }
            debugger
          } else {
            curNode.parentStatus = false // 子节点处理
            if (curNode.children) {
              curNode.children = this.filterDatas(curNode.children, false)
            }
            debugger
          }
        }
      }
      // 当前状态是false，父级状态都是true情况下
      if (!parentNode.status && parentNode.parentStatus) {
          // 父级是false情况下
          curNode.parentStatus = parentNode.status // 子节点处理
          if (!parentNode.parentStatus) {
            // 父元素是false情况下
            curNode.parentStatus = parentNode.status // 子节点处理
            if (curNode.children) {
              curNode.children = this.filterDatas(curNode.children, parentNode.status)
            }
            debugger
          } else {
            curNode.parentStatus = false // 子节点处理
            if (curNode.children) {
              curNode.children = this.filterDatas(curNode.children, false)
            }
            debugger
          }
        }
        // 当前状态是true，父级状态都是false情况下
      if (parentNode.status && !parentNode.parentStatus) {
          // 父级是false情况下
          curNode.parentStatus = parentNode.status // 子节点处理
          if (!parentNode.parentStatus) {
            // 父元素是false情况下
            curNode.parentStatus = parentNode.status // 子节点处理
            if (curNode.children) {
              curNode.children = this.filterDatas(curNode.children, parentNode.status)
            }
            debugger
          } else {
            curNode.parentStatus = false // 子节点处理
            if (curNode.children) {
              curNode.children = this.filterDatas(curNode.children, false)
            }
            debugger
          }
        }

      if (
        curNode.children &&
        curNode.children.length > 0 &&
        curNode !== undefined
      ) {
        this.ReSortTree(curNode.children, curNode)
      }
      arrRes.push(curNode)
    }
    return arrRes
  }

   filterDatas(arr: any, status: boolean) {
    let arrRes = [] as any
    arr.forEach((element: any) => {
      element.parentStatus = status
      arrRes.push(element)
      if (element.children) {
        this.filterDatas(element.children, status)
      }
    })
    return arrRes
  }

  // 拖拽更改状态
  async filterData(arr: any, obj: any) {
    let arrRes = [] as any
    let objarrRes = [] as any
    for (let i = 0, length = arr.length; i < length; i++) {
      let node = arr[i]
      if (node.id === obj.id) {
        node = obj
      }
      arrRes.push(node)

      if (node.children) {
        this.filterData(node.children, obj)
      }
    }
    return arrRes
  }
  // 递归状态取消
  async filterstatus(data: any, obj: any) {
    if (data !== null) {
      let result = [] as any
      for (let i = 0; i < data.length; i++) {
        let item = data[i]
        if (item.id === obj.id) {
          item.status = !item.status
        }
        result.push(item)
        if (item.children && item.children.length > 0) {
          await this.filterstatus(item.children, obj)
        }
      }
      return result
    }
  }
  // 添加highlight属性
  addMenuClass(arr: any, id:string) {
    let arrRes = []
    for (let i = 0, length = arr.length; i < length; i++) {
      let node = arr[i]
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
  // 修改，删除，状态更新数据后实现菜单默认展开和选中状态
  async filterOpen(arr: any, obj?: any, add?: any) {
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
    }
    return arrRes
  }

  baseData(data: any) {
    let columns = [
      {
        type: 'selection',
        title: '| 组织名称',
        field: 'name',
        width: 200,
        flex: 7,
        align: 'left',
        titleAlign: 'left',
        formatter: (item: any) => {
          return '<span>' + item.name + '</span>'
        }
      },
      {
        title: '| 状态',
        type: 'switch',
        flex: 1,
        align: 'left',
        titleAlign: 'left',
        // TODO去除掉筛选
        actions: [
          {
            text: '状态',
            onclick: (bool: boolean, item: object) => {
              // this.$refs.addDialog.show('add', item.id)
              // this.handleState(bool, item)
            },
            formatter: (item: object) => {
              return ''
            }
          }
        ]
      },
      {
        title: '| 操作',
        type: 'action',
        flex: 2,
        align: 'left',
        titleAlign: 'left',
        actions: [
          {
            text: '添加',
            onclick: (item: object) => {
              // this.$refs.addDialog.show('add', item.id)
              this.handleAdd(item)
            },
            formatter: (item: object) => {
              return '添加'
            }
          },
          {
            text: '修改',
            onclick: (item: any) => {
              this.handleEdit(item.id)
            },
            formatter: () => {
              return '修改'
            }
          },

          {
            text: '删除',
            onclick: (item: object) => {
              this.handleDelete(item)
            },
            formatter: (item: object) => {
              return '<el-button class="inputText delect">删除</el-button>'
            }
          }
        ]
      }
    ]
    this.treeDatas = {
      columns: columns,
      lists: this.orgData
    }
  }
}
</script>

<style lang="scss" scoped>
.draggable-handler {
  cursor: pointer;
}
</style>

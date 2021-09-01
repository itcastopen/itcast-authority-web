<template>
  <div ref="getHeight" class="app-container">
    <div class="main">
      <h2 class="crumbsTitle">用户组管理</h2>
      <div class="container tabCon">
        <!-- 搜索框 -->
        <div class="conSearch">
          <div class="serchForm">
            <el-form ref="ruleForm" :inline="true" :model="searchData">
              <el-row :gutter="18">
                <el-col :span="6">
                  <el-form-item label="名称：" prop="name">
                    <el-input v-model="searchData.name" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="角色：" prop="roleId">
                    <el-select v-model="searchData.roleId" placeholder="请选择">
                      <el-option
                        v-for="item in roleData"
                        :key="item.id"
                        :disabled="!item.status"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" class="f-right" @click="handleSearch">
                    搜索
                  </el-button>
                  <el-button @click="resetSearch"> 重置 </el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
        <div class="operationData">
          <el-button v-if="$hasPermission('userGroup:add')" type="primary" @click="handleAdd">用户组添加</el-button>
        </div>
        <module-tip :data-table="dataTable.records" :list-loading="listLoading" />
        <div v-if="dataTable.records.length> 0">
          <el-table
            ref="table"
            :data="dataTable.records"
            border
            fit
            stripe
            highlight-current-row
            style="width: 100%"
            @selection-change="handleSelectionChange"
            @filter-change="filterData"
          >
            <el-table-column width="80" align="center" type="index" label="">
              <template slot="header">
                <span> | 序号 </span>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header">
                <span> | 用户组名称 </span>
              </template>
              <template slot-scope="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header">
                <span> | 角色 </span>
              </template>
              <template slot-scope="{ row }">
                <span>{{ row.roleName }}</span>
              </template>
            </el-table-column>

            <el-table-column align="center">
              <template slot="header">
                <span> | 用户数量 </span>
              </template>
              <template slot-scope="{ row }">
                <span>{{ row.userCount }}</span>
              </template>
            </el-table-column>
            <el-table-column class-name="status-col">
              <template slot="header">
                <span> | 描述 </span>
              </template>
              <template slot-scope="{ row }">
                <span>{{ ellipsis(row.describe, 10) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
              align="center"
              :filter-multiple="false"
              :filters="[
                { text: '启用', value: true },
                { text: '禁用', value: false }
              ]"
              column-key="status"
              :filter-method="filterHandler"
            >
              <template slot="header">
                <span>
                  | 状态
                  <i class="iconfont">&#xe62b;</i>
                </span>
              </template>
              <template slot-scope="{ row,$index }">
                <el-switch v-model="row.status" :disabled="!$hasPermission('userGroup:update')" @change="handleState(row,$index)" />
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header">
                <span> | 操作 </span>
              </template>
              <template slot-scope="{ row }">
                <div class="operation">
                  <!-- <span @click="handleView(row.id)">查看</span>
                  <span @click="handleEdit(row.id)">修改</span>
                  <span class="delect" @click="handleDelete(row)">删除</span> -->
                  <el-button v-if="$hasPermission('userGroup:get')" class="inputText" :disabled="!row.status" @click="handleView(row.id)">查看</el-button>
                  <el-button v-if="$hasPermission('userGroup:update')" class="inputText" :disabled="!row.status" @click="handleEdit(row.id)">修改</el-button>
                  <el-button v-if="$hasPermission('userGroup:delete')" class="inputText delect" :disabled="!row.status" @click="handleDelete(row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <pagination
            v-show="dataTable.total > 0"
            :total="Number(dataTable.total)"
            :page.sync="searchData.current"
            :limit.sync="searchData.size"
            @pagination="getList"
          />
          <!-- end -->
        </div>
        <!-- 用户组添加、编辑对话框 -->
        <user-add-dialog
          ref="userDialog"
          :dialog="dialog"
          :org-data="optionData"
          :role-data="roleData"
          :tree-data="treeData"
          :get-value="getValue"
          :user-data="editData"
          @close="handleClose"
          @getList="getList"
        />
        <!-- end -->
        <!-- 用户查看对话框 -->
        <user-detail-dialog
          ref="viewDialog"
          :edit-data="ivewData"
          :dialog="dialog"
        />
        <!-- end -->
        <!-- 用户删除警告框 -->
        <delete
          ref="fileDialog"
          :dialog="dialog"
          :dele-data="deleData"
          @delete="deleteButton"
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
import { ellipsis, restData } from '@/utils'
// 组件
// 分页
import Pagination from '@/components/Pagination/index.vue'
// 启用禁用
import BaseDialog from '@/components/BaseStatus/index.vue'
// 删除
import Delete from './components/delete.vue'
// 添加
import UserAddDialog from './components/add.vue'
// 详情
import UserDetailDialog from './components/detail.vue'
import ModuleTip from '@/components/ModuleTip/index.vue'
// interface接口
import {
  ICommonSelectOptions
} from '@/utils/common-interface'
import { IManageUserPageListEntity, IUserFreezeRequest } from '@/pages/users/interface/user-group-list'
// api接口
import {
  getUserGroupList,
  delUserGroup,
  editUserGroup,
  detailUserGroup
} from '@/pages/users/api/index'
import { getRepelRole, getTree } from '@/api/api'
// import { getRole, getTree } from '@/api/api'
@Component({
  name: 'userGroupList',
  components: {
    Pagination,
    Delete,
    UserAddDialog,
    UserDetailDialog,
    BaseDialog,
    ModuleTip
  }
})
export default class extends Vue {
  private dataTable: IManageUserPageListEntity = {
    records: []
  } as any
  private listLoading = true
  private delectData = []
  private roleData :ICommonSelectOptions[] = []
  private orgData = []
  private deleData = {}
  private treeData = {
    treeShow: false,
    valueId: '' // 初始ID（可选）
  }
  private searchData = {
    id: '',
    name: '',
    roleId: '',
    size: 10,
    current: 1
  } as any
  private dialog = {
    id: '',
    msg: '',
    isVisible: false,
    isViewVisible: false,
    isDeleVisible: false,
    isStatusVisible: false,
    type: 'add',
    status: false,
    title: ''
  }
  private newIndex=0
  private newData ={} as any
  private filterStatus=true
  private editData: IUserFreezeRequest = {
    name: '', // 用户组名称
    userIds: [], // 成员
    roleId: '', // 角色
    describe: '', // 描述
    status: true
  } as any
  private ivewData: IUserFreezeRequest = {}
  /// 生命周期
  created() {
    this.getList()
    this.getRole()
    this.getOrg()
  }

  /// // 功能函数 /////
  get optionData() {
    let cloneData = JSON.parse(JSON.stringify(this.orgData)) // 对源数据深度克隆
    return cloneData.filter((father: any) => {
      // 循环所有项，并添加children属性
      let branchArr = cloneData.filter(
        (child: any) => father.id === child.parentId
      ) // 返回每一项的子级数组
      // eslint-disable-next-line no-unused-expressions
      branchArr.length > 0 ? (father.children = branchArr) : '' // 给父级添加一个children属性，并赋值
      return father.parentId === '0' // 返回第一层
    })
  }
  // 获取数据
  private async getList() {
    this.listLoading = true
    const { data } = await getUserGroupList({ ...this.searchData })
    if (data.isSuccess === true) {
    this.dataTable = data.data
    }
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.1)
  }
  // 获取角色列表
  private async getRole() {
    const params = {
      status: true
    }
    // const { data } = await getRole(params)
    const { data } = await getRepelRole({ status: '' })
    if (data.isSuccess === true) {
      this.roleData = data.data.records
    }
  }
  // 获取组织列表
  private async getOrg() {
    const { data } = await getTree({ status: true })
    if (data.isSuccess === true) {
      this.orgData = await this.filterMenuData(data.data)
      // this.orgData = data.data
      if (data.data.length > 0) {
        this.treeData.valueId = data.data[0].id
      }

      this.treeData.treeShow = true // 解决异步数据子组件获取不到值的问题
    }
  }
  // 递归 设置禁用的组织
  async filterMenuData(data:any) {
    let result = [] as any
      for (let i = 0; i < data.length; i++) {
        let item = data[i]
        item.disabled = !item.status
        // if (node && node.status === false) {
        //   item.disabled = true
        // }
        if (!item.enable && item.children === null) {
            item.disabled = true
          }

        result.push(item)
        if (item.children && item.children.length > 0) {
          this.filterMenuData(item.children)
        }
      }
      return result
  }

  // 启用、禁用确认
  private async handleStateSubmit() {
    const parent = {
      id: this.dialog.id,
      status: this.dialog.status
    }
    const { data } = await editUserGroup(parent)
    if (data.isSuccess) {
      this.dialog.isStatusVisible = false
      this.$message.success('操作成功')
      this.getList()
    } else {
      this.$message.error(data.msg)
    }
  }
  // 删除
  private async deleteButton() {
    const ids: any[] = []
    this.delectData.forEach((value: any) => {
      ids.push(value.id)
    })
    const { data } = await delUserGroup({ ids: ids })
    if (data.isSuccess === true) {
      this.$message.success('操作成功')
      this.getList()
    } else {
      this.$message.error(data.msg)
    }
  }
  // 单个删除
  private handleDelete(row: any) {
    let table: any = this.$refs.table
    table.toggleRowSelection(row, true)
    this.deleData = row
    this.dialog.isDeleVisible = true
  }
  // 获取详情
  private async getEdit(id: string) {
    const { data } = await detailUserGroup(id)
    this.editData = data.data
  }
  // 查看
  private async handleView(id: string) {
    this.dialog.isViewVisible = true
    // this.getEdit(id)
    const { data } = await detailUserGroup(id)
    this.ivewData = data.data
  }
  /// // ui /////
  // 修改
  private handleEdit(id: string) {
    this.dialog.type = 'edit'
    this.dialog.title = '修改'
    this.dialog.isVisible = true
    this.getEdit(id)
  }
  // 搜索
  private async handleSearch() {
    this.searchData.current = 1
    this.getList()
  }
  // 启用，禁用
  private async handleState(value: any, index:any) {
    this.newData = value
    this.newIndex = index
    this.dialog.isStatusVisible = true
    this.dialog.id = value.id
    this.dialog.status = value.status
    if (!value.status) {
      this.dialog.msg = `用户"${value.name}" 将被禁止登录！`
      this.dialog.title = '确认禁用'
    } else {
      this.dialog.msg = `用户"${value.name}" 启用！`
      this.dialog.title = '确认启用'
    }
  }
  // 获取组织树id
  getValue(value: any) {
    this.treeData.valueId = value
    // this.searchData.orgId = value
  }
  // 获取删除的数据
  handleSelectionChange(value: any) {
    this.delectData = value
  }
  // 重置
  resetSearch() {
    (this.$refs.ruleForm as ElForm).resetFields()
    this.getList()
  }
  // 启用，禁用筛选
  filterHandler(value: boolean, row: any) {
    this.filterStatus = value
    return row.status === value
  }
  // 筛选数据状态
  filterData(filter:any) {
    const status = filter['status']
    if (status.length > 0) {
      this.searchData.status = this.filterStatus
    } else {
      this.searchData.status = null
    }
    this.getList()
  }
  // 关闭用户添加、编辑弹层
  handleClose() {
    this.dialog.isVisible = false
  }
  // 启用禁用弹层关闭
  handleCloseStatus() {
    this.dialog.isStatusVisible = false
    restData(this.dataTable, this.newData, this.newIndex)
  }
  // 用户添加
  handleAdd() {
    this.dialog.isVisible = true
    this.dialog.type = 'add'
    this.dialog.title = '添加'
  }
  // 内容控制字数，多出的用省略号
  ellipsis(value: any, num: any) {
    return ellipsis(value, num)
  }
}
</script>

<style lang="scss" scoped>
</style>

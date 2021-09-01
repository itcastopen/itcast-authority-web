<template>
  <div ref="getHeight" class="app-container">
    <div class="main">
      <h2 class="crumbsTitle">用户管理</h2>
      <div class="container tabCon">
        <!-- 搜索框 -->
        <div class="conSearch" :class="{'no-border': projectId!=='1'}">
          <div class="serchForm">
            <el-form ref="ruleForm" :inline="true" :model="searchData">
              <el-row :gutter="18">
                <el-col :span="6">
                  <el-form-item label="组织：">
                    <select-tree
                      v-if="treeData.treeShow"
                      ref="tree"
                      v-model="values"
                      :tree-params="treeParams"
                      :org-data="optionData"
                      :org-id="searchData.orgId"
                      @getValue="getValue($event)"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="账号：" prop="account">
                    <el-input
                      v-model="searchData.account"
                      placeholder="请输入"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="姓名：" prop="name">
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
              </el-row>
            </el-form>
          </div>
          <div class="searchBtn textRight">
            <el-button type="primary" class="f-right" @click="handleSearch">
              搜索
            </el-button>
            <el-button @click="resetSearch"> 重置 </el-button>
          </div>
        </div>
        <div v-if="projectId==='1'" class="operationData">
          <el-button v-if="$hasPermission('user:add')" type="primary" @click="handleAdd">添加用户</el-button>
          <el-button v-if="$hasPermission('user:import')" type="primary" @click="handleImport">导入用户</el-button>
          <el-button v-if="$hasPermission('user:delete')" class="f-right" @click="batchDelete(delectData)">
            批量删除
          </el-button>
        </div>
        <module-tip :data-table="dataTable.records" :list-loading="listLoading" />
        <div v-if="dataTable.records.length>0">
          <el-table
            ref="table"
            :data="dataTable.records"
            border
            stripe
            style="width: 100%"
            @selection-change="handleDeleteChange"
            @filter-change="filterData"
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column align="center" width="80" type="index" label="">
              <template slot="header">
                <span> | 序号 </span>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header">
                <span> | 账号 </span>
              </template>
              <template slot-scope="{ row }">
                <span>{{ row.account }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center">
              <template slot="header">
                <span> | 姓名 </span>
              </template>
              <template slot-scope="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>

            <el-table-column align="center">
              <template slot="header">
                <span> | 组织 </span>
              </template>
              <template slot-scope="{ row }">
                <span>{{ ellipsis(row.orgName, 10) }}</span>
              </template>
            </el-table-column>

            <el-table-column>
              <template slot="header">
                <span> | 岗位 </span>
              </template>
              <template slot-scope="{ row }">
                <span>{{ row.stationName }}</span>
              </template>
            </el-table-column>

            <el-table-column class-name="status-col">
              <template slot="header">
                <span> | 角色 </span>
              </template>
              <template slot-scope="{ row }">
                <span>{{ ellipsis(row.roleNames, 6) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="projectId==='1'"
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
                <el-switch v-model="row.status" @change="handleState(row,$index)" />
              </template>
            </el-table-column>
            <el-table-column align="center" width="160">
              <template slot="header">
                <span> | 操作 </span>
              </template>
              <template slot-scope="{ row }">
                <div class="operation">
                  <!-- <span @click="handleView(row.id)">查看</span>
                  <span @click="handleEdit(row.id)">修改</span>
                  <span class="delect" @click="handleDelete(row)">删除</span> -->
                  <el-button v-if="$hasPermission('user:update') && projectId==='1'" class="inputText" :disabled="!row.status" @click="handleEdit(row.id)">修改</el-button>
                  <el-button v-if="$hasPermission('user:delete') && projectId==='1'" class="inputText delect" :disabled="!row.status" @click="handleDelete(row)">删除</el-button>
                  <el-button v-if="$hasPermission('user:update-role') && projectId!=='1'" class="inputText" :disabled="!row.status" @click="handleEditRole(row.id)">分配角色</el-button>
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
        <!-- 用户添加、编辑对话框 -->
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
        <!-- 用户分配角色对话框 -->
        <user-role-dialog
          ref="userRoleDialog"
          :dialog="roleDialog"
          :role-data="roleData"
          :user-data="editData"
          @close="handleRoleClose"
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
        <!-- 导入对话框 -->
        <upload-file ref="fileDialog" :dialog="dialog" @getList="getList" />
        <!-- end -->
        <!-- 用户删除警告框 -->
        <delete
          ref="fileDialog"
          :dialog="dialog"
          :dele-data="deleData"
          @delete="deleteButton"
          @batchDelete="batchDelete"
          @clearSelection="clearSelection"
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
  <!-- </div> -->
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
import { ellipsis, restData } from '@/utils'
// 组件
// 分页
import Pagination from '@/components/Pagination/index.vue'
// 删除弹层
import Delete from '@/components/Delete/index.vue'
// 启用禁用
import BaseDialog from '@/components/BaseStatus/index.vue'
// 组织树
import SelectTree from '@/components/SelectTree/index.vue'
// 导入
import UploadFile from '@/components/UploadFile/index.vue'
// 添加用户弹层
import UserAddDialog from './components/add.vue'
// 分配角色弹层
import UserRoleDialog from './components/role.vue'
// 用户详情查看
import UserDetailDialog from './components/detail.vue'
import ModuleTip from '@/components/ModuleTip/index.vue'
// interface接口
import {
  ICommonSelectOptions
} from '@/utils/common-interface'
import {
  IManageUserPageListEntity,
  IUserFreezeRequest
} from '@/pages/users/interface/user-list'
// api
import { getRepelRole, getAllTree } from '@/api/api'
import {
  getList,
  delUser,
  editUser,
  detailUser
} from '@/pages/users/api/index'
import { getApply } from '@/utils/cookies'

@Component({
  name: 'UserList',
  components: {
    Pagination,
    Delete,
    SelectTree,
    UploadFile,
    UserAddDialog,
    UserDetailDialog,
    BaseDialog,
    ModuleTip,
    UserRoleDialog
  }
})
export default class extends Vue {
  private dataTable: IManageUserPageListEntity = {
    records: []
  }
  private listLoading = true
  private delectData = []
  private roleData :ICommonSelectOptions[] = []
  private orgData = []
  private deleData = {} as any
  private ref: any = this.$refs
  private treeData = {
    treeShow: false,
    valueId: '' // 初始ID（可选）
  }
  private searchData = {
    id: '',
    orgId: '',
    account: '',
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
    isFileVisible: false,
    isDeleVisible: false,
    isStatusVisible: false,
    type: 'add',
    status: false,
    title: ''
  }
  private roleDialog = {
    id: '',
    msg: '',
    isVisible: false,
    isViewVisible: false,
    isFileVisible: false,
    isDeleVisible: false,
    isStatusVisible: false,
    type: 'editRole',
    status: false,
    title: ''
  }
  private editData: IUserFreezeRequest = {
    account: '', // 账号
    name: '', // 姓名
    password: '123456', // 密码
    mobile: '', // 手机
    avatar: '', // 头像
    stationId: '', // 岗位
    roles: [], // 角色
    sex: { // 年龄
      code: 'M'
    },
    status: true, // 状态
    orgId: '' // 组织
  }
  private ivewData = {}
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
  private newIndex=0
  private newData ={} as any
  private filterStatus=true
  // 获取应用Id
  get projectId() {
    return getApply() ? JSON.parse(getApply() as any).id : ''
  }
  @Watch('optionData')
  getOrgs(value: any) {
    this.treeParams.data = value
  }
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
  /// 生命周期
  mounted() {
  }
  created() {
    this.getList()
    this.getRole()
    this.getOrg()
  }
  /// // 功能函数 /////
  // 获取数据
  private async getList() {
    this.listLoading = true
    const { data } = await getList({ ...this.searchData })
    if (data.isSuccess === true) {
    const objData = data.data.records
    if (objData !== undefined) {
      objData.forEach((val: any) => {
        if (val.roleNames !== null) {
          val.roleNames = val.roleNames.join(',')
        }
      })
    }

    this.dataTable = data.data
    }
    setTimeout(() => {
      this.listLoading = false
    }, 0.1)
  }

  // 获取角色列表
  private async getRole() {
    const params = {
      status: true
    }
    const { data } = await getRepelRole({ status: '' })
    if (data.isSuccess === true) {
    this.roleData = data.data.records
      this.roleData.forEach((item:any) => {
        item.disabled = false
        if (item.status === false) {
          item.disabled = true
        }
      })
    }
  }

  // 获取组织列表
  private async getOrg() {
    const { data } = await getAllTree({ status: '' })
    if (data.isSuccess === true) {
      this.orgData = await this.filterMenuData(data.data)

      // this.orgData = data.data
      if (data.data.length > 0) {
        this.treeData.valueId = data.data[0].id
      }

      this.treeData.treeShow = true // 解决异步数据子组件获取不到值的问题
    }
  }
  // 启用、禁用确认
  private async handleStateSubmit() {
    const parent = {
      id: this.dialog.id,
      status: this.dialog.status
    }
    const { data } = await editUser(parent)
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
    const { data } = await delUser({ ids: ids })
    if (data.isSuccess === true) {
      this.$message.success('操作成功')
      this.getList()
    } else {
      this.$message.error(data.msg)
    }
    this.dialog.isDeleVisible = false
  }
  // 获取详情
  private async getEdit(id: string) {
    const { data } = await detailUser(id)
    if (data.isSuccess === true) {
    this.editData = data.data
    }
  }
  // 查看
  private async handleView(id: string) {
    this.dialog.isViewVisible = true
    const { data } = await detailUser(id)
    this.ivewData = data.data
  }

  // ui //
  // 启用，禁用
  private async handleState(value: any, index:any) {
    this.newData = value
    this.newIndex = index
    this.dialog.isStatusVisible = true
    this.dialog.id = value.id
    this.dialog.status = value.status
    if (!value.status) {
      this.dialog.msg = `用户"${value.account}" 将被禁止登录！`
      this.dialog.title = '确认禁用'
    } else {
      this.dialog.msg = `用户"${value.account}" 启用！`
      this.dialog.title = '确认启用'
    }
  }
  // 单个删除
  handleDelete(row: any) {
    this.ref.table.toggleRowSelection(row, true)
    this.deleData.name = row.name
    this.dialog.isDeleVisible = true
  }
  // 批量删除
  batchDelete() {
    if (this.delectData.length > 0) {
      this.deleData.name = ''
      this.dialog.isDeleVisible = true
    } else {
      this.$message({
        message: '请选择要删除的数据',
        type: 'warning'
      })
      return false
    }
  }
  clearSelection() {
    this.ref.table.clearSelection()
  }
  // 修改
  handleEdit(id: string) {
    this.dialog.type = 'edit'
    this.dialog.title = '修改'
    this.dialog.isVisible = true
    this.getEdit(id)
  }
  // 修改角色
  handleEditRole(id: string) {
    this.roleDialog.type = 'editRole'
    this.roleDialog.title = '分配角色'
    this.roleDialog.isVisible = true
    this.getEdit(id)
  }
  // 获取组织树id
  getValue(value: any) {
    this.treeData.valueId = value
    this.searchData.orgId = value
  }
  // 获取删除的数据
  handleDeleteChange(value: any) {
    this.delectData = value
  }
  // 搜索
  handleSearch() {
    this.searchData.current = 1
    this.getList()
  }
  // 重置
  resetSearch() {
    (this.$refs.ruleForm as ElForm).resetFields()
    this.searchData.orgId = ''
    this.getList()
  }
  // 启用，禁用筛选
  filterHandler(value: any, row: any, column:any) {
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
  // 关闭分配角色弹框
  handleRoleClose() {
    this.roleDialog.isVisible = false
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
    this.getRole()
    this.$nextTick(() => {
      (this.$refs.userDialog as any).init()
    })
  }
  // 导入
  handleImport() {
    this.dialog.isFileVisible = true
  }
  // 内容控制字数，多出的用省略号
  ellipsis(value: any, num: any) {
    return ellipsis(value, num)
  }
   // 递归 设置禁用的组织
  async filterMenuData(data:any) {
    let result = [] as any
      for (let i = 0; i < data.length; i++) {
        let item = data[i]
        // if (item.status === false) {
          item.disabled = !item.status
          result.push(item)
        // }
        if (item.children && item.children.length > 0) {
          this.filterMenuData(item.children)
        }
      }
      return result
  }
}
</script>
<style lang="scss" scoped>
.no-border{
  border-bottom: 0 !important;
}
</style>

<template>
  <div ref="getHeight" class="app-container">
    <div class="main">
      <h2 class="crumbsTitle">角色管理</h2>
      <div class="container scrollTable tabConLeft">
        <!-- 搜索框 -->
        <div class="conSearch">
          <el-form ref="ruleForm" :inline="true" :model="searchData">
            <el-row>
              <el-col :span="24">
                <el-form-item prop="name" label="角色名称：">
                  <el-input
                    v-model="searchData.name"
                    placeholder="请输入"
                    suffix-icon="el-icon-search"
                    style="width: 160px;"
                    clearable
                    @click.native="handleSearch"
                    @keypress.native.enter="handleSearch"
                  />
                </el-form-item>
                <el-button v-if="$hasPermission('role:add')" type="primary" class="textRight" @click="handleAdd"> 添加角色 </el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <module-tip :data-table="dataTable" :list-loading="listLoading" />
        <div v-if="dataTable.length> 0" id="resultScroll" class="roleMain">
          <el-table
            ref="table"
            :data="dataTable"
            fit
            :row-class-name="row => row.row.classs ===true ? 'current-row' : ''"
            style="width: 100%"
            @row-click="handleClickRow"
          >
            <el-table-column align="left">
              <template slot="header">
                <span> 角色名称 </span>
              </template>
              <template slot-scope="{ row }">
                <span>{{ ellipsis(row.name, 6) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label=""
              width="120"
              align="center"
            >
              <template slot-scope="{ row,$index }">
                <div @click.stop>
                  <el-switch v-model="row.status" :disabled="!$hasPermission('role:update')" @change="handleState(row,$index)" />
                </div>
              </template>
            </el-table-column>
            <el-table-column align="left" width="130">
              <template slot="header">
                <span> 操作 </span>
              </template>
              <template slot-scope="{ row }">
                <div class="operation">
                  <!-- <span @click="handleEdit(row.id)">修改</span> -->
                  <el-button v-if="$hasPermission('role:update')" class="inputText" :disabled="!row.status" @click.stop="handleEdit(row.id)">修改</el-button>
                  <el-button v-if="$hasPermission('role:delete')" class="inputText delect" :disabled="!row.status" @click.stop="handleDelete(row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 用户添加、编辑对话框 -->
        <user-add-dialog
          v-if="isShow"
          ref="userDialog"
          :role-data="roleData"
          :roleid="roleid"
          :data="formData"
          :dialog="dialog"
          @close="handleClose"
          @getList="getList"
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
          @handle-close="handleCloseDelete"
          @delete="deleteButton"
        />
        <!-- end -->
      </div>
      <div class="container tabConRight">
        <jurisdictionDialog ref="menu" :allroleid="allRoleId" :formdata="formData" @getEdit="getEdit" @getlist="getList" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

import { ellipsis, restData } from '@/utils'
// 组件
// 删除
import Delete from './components/delete.vue'
// 添加
import UserAddDialog from './components/add.vue'
import ModuleTip from '@/components/ModuleTip/index.vue'
// 启用禁用
import BaseDialog from '@/components/BaseStatus/index.vue'
import JurisdictionDialog from './components/jurisdiction.vue'
// interface接口
import { RoleTableData } from '@/pages/role/interface/types'
// api
// import { getRole, getAllTree } from '@/api/api'
import { getDataList, deleteRole, editRole, getRoleIdList, detailRole, userRole } from '@/pages/role/api'
import { hasPermission } from '../../utils/index'
@Component({
  name: 'RoleList',
  components: {
    Delete,
    UserAddDialog,
    BaseDialog,
    JurisdictionDialog,
    ModuleTip
  }
})
export default class extends Vue {
  private ref = this.$refs as any
  private dataTable: RoleTableData[]=[]
  private listLoading = true
  private isShow =false
  private delectData = []
  private roleData = [] as any
  private roleIds = ''
  private allRoleId=[]
  private userData = {} as any
  private formData: RoleTableData ={
    status: true,
    name: '',
    repel: '',
    applicationIds: [],
    dsType: {
      val: 1,
      code: 'ALL'
    }
  } as any
  private searchData = {
    id: '',
    name: ''
  }
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
  private total = ''
  private roleid='' as string
  private newIndex=0
  private newData ={} as any
  @Watch('dataTable')
  tableData(val:any) {
  this.$nextTick(() => {
    if ((this.$refs as any).table !== undefined) {
    (this.$refs as any).table.setCurrentRow(val[0])
    }
  })
  }
  /// 生命周期
  created() {
    this.getList()
  }
  mounted() {
    this.isShow = true
  }
  /// // 功能函数 /////
  // 获取数据
  private async getList() {
    this.listLoading = true
    const { data } = await getDataList(this.searchData)
    if (data.isSuccess === true) {
      this.dataTable = data.data
      this.roleData = data.data
      const roleId = this.$store.state.baseTreeId
      if (roleId) {
        this.roleid = roleId
      } else {
        if (data.data.length > 0) {
        this.roleid = data.data[0].id
        }
      }
      if ((this as any).$hasPermission('rule:config-get')) {
        if (this.roleid !== '') {
          this.getEdit(this.roleid)
          this.getAllRoleId(this.roleid)
        }

        this.dataTable.forEach((item:any) => {
          item.classs = false
          if (this.roleid === item.id) {
            item.classs = true
          } else {
            item.classs = false
          }
        })
      }

      this.roleData.forEach((item:any) => {
      if (item.status === false) {
          item.disabled = true
      } else {
        item.disabled = false
      }
    })
    }
    setTimeout(() => {
      this.listLoading = false
    }, 0.1)
  }
  // 查询角色拥有的资源id集合
  private async getAllRoleId(id:string) {
    const { data } = await getRoleIdList(id)
    this.allRoleId = data.data
    this.$store.commit('updatedMenuData', data.data.resourceIdList)
  }
  // 搜索
  private handleSearch() {
    this.getList()
  }
  // 启用、禁用确认
  private async handleStateSubmit() {
    this.userData.applicationIds = this.formData.applicationIds
    delete (this.userData as any).createTime
    delete (this.userData as any).updateTime
    const { data } = await editRole(this.userData)
    if (data.isSuccess) {
      this.dialog.isStatusVisible = false
      this.$message.success('操作成功！')
      this.$store.commit('updatedDataTreeId', (this.userData as any).id)
      this.getList()
    } else {
      this.$message.error(data.msg)
    }
  }
  // 删除
  private async deleteButton() {
    const ids = [this.roleIds]
    const { data } = await deleteRole({ ids: ids })
    if (data.isSuccess === true) {
      if (data.data.length > 0) {
        this.$message.error(`角色"${this.dialog.title}"正在被使用，无法删除！`)
      } else {
        this.$message.success('删除成功！')
        this.$store.commit('updatedDataTreeId', '')
      }
    } else {
      this.$message.error(data.msg)
    }
    this.getList()
    this.dialog.isDeleVisible = false
  }
  // 获取详情
  private async getEdit(id: string) {
    const { data } = await detailRole(id)
    this.formData = data.data
    this.roleData.forEach((item:any) => {
      item.disabled = false
      if (item.status === false || id === item.id) {
          item.disabled = true
      }
    })
  }
  // 单个删除
  private handleDelete(row: any) {
    this.dialog.title = row.name
    this.roleIds = row.id
    this.dialog.isDeleVisible = true
  }
  // 修改
  private handleEdit(id: string) {
    this.dialog.type = 'edit'
    this.dialog.title = '修改'
    this.dialog.isVisible = true
    this.getEdit(id)
  }
  /// // ui /////
  private async handleState(value: any, index:any) {
    this.newData = value
    this.newIndex = index
    this.getEdit(value.id)
    const { data } = await userRole(value.id)
    if (data.isSuccess) {
      this.dialog.isStatusVisible = true
      if (data.data.userList.length > 0) {
        this.dialog.msg = `"${value.name}" 有用户在使用，确定要禁用么？`
      } else {
      this.dialog.msg = `"${value.name}" 角色权限将被禁用！`
    }
    }
    this.userData = value
    if (!value.status) {
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
  // 启用禁用弹层关闭
  handleCloseStatus() {
    this.dialog.isStatusVisible = false
    restData(this.dataTable, this.newData, this.newIndex)
  }
  // 删除弹层关闭
  handleCloseDelete() {
    this.dialog.isDeleVisible = false
  }
  // 用户添加
  handleAdd() {
    this.dialog.isVisible = true
    this.dialog.type = 'add'
    this.dialog.title = '添加'
    this.formData = {
      status: true,
      dsType: {
        val: 1,
        code: 'ALL'
      }
    }
    this.searchData.name = ''
    this.getList()
  }
  // 内容控制字数，多出的用省略号
  ellipsis(value: any, num: any) {
    return ellipsis(value, num)
  }
  // 触发当行
  handleClickRow(row:any) {
    if (!(this as any).$hasPermission('rule:config-get')) {
      return
    }
    // this.roleData = row
    this.dataTable.forEach((element:any) => {
      if (row.id === element.id) {
        element.classs = true
      } else {
        element.classs = false
      }
    })
    this.getAllRoleId(row.id)
    this.getEdit(row.id)
    this.roleid = row.id
    this.roleData.forEach((item:any) => {
      if (item.status === false || row.id === item.id) {
          item.disabled = true
      }
    })
    this.ref.menu.getMenuList(row.id)
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

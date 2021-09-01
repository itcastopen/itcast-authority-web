<template>
  <div ref="getHeight" class="app-container">
    <div v-if="$hasPermission('resource:add')" class="operationData menuMar"><el-button type="primary" @click="handleAdd"> 添加权限 </el-button></div>
    <module-tip :data-table="dataTable" :list-loading="listLoading" />
    <div v-if="dataTable.length>0">
      <el-table
        ref="table"
        :data="dataTable"
        border
        fit
        stripe
        highlight-current-row
        style="width: 100%"
        class=""
      >
        <el-table-column
          prop="code"
          width="200"
          align="left"
        >
          <template slot="header">
            <span>
              | 编号
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          width="120"
        >
          <template slot="header">
            <span>
              | 菜单名称
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="method"
          width="120"
        >
          <template slot="header">
            <span>
              | 请求方式
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="url"
        >
          <template slot="header">
            <span>
              | 请求地址
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          width="120"
        >
          <template slot="header">
            <span>
              | 操作
            </span>
          </template>
          <template slot-scope="{ row }">
            <div class="operation">
              <el-button v-if="$hasPermission('resource:update')" class="inputText" @click="handleEdit(row.id)">修改</el-button>
              <el-button v-if="$hasPermission('resource:delete')" class="inputText delect" @click="handleDelete(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination
        v-show="total > 0"
        :total="Number(total)"
        :page.sync="searchData.current"
        :limit.sync="searchData.size"
        @pagination="getList"
      />
    <!-- end -->
    </div>
    <!-- 添加 -->
    <add-dialog
      ref="adddialog"
      :editdata="formData"
      :dialog="dialog"
      @close="handleClose"
    />
    <!-- end -->
    <!-- 删除 -->
    <delete
      ref="delete"
      :dialog="dialog"
      @handleCloseDelete="handleCloseDelete"
      @delete="deleteButton"
    />
    <!-- end -->
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
// 组件
import Pagination from '@/components/Pagination/index.vue'
import ModuleTip from '@/components/ModuleTip/index.vue'
// 删除
import Delete from './delete.vue'
// 添加
import AddDialog from './components/add.vue'
// api
import { editRole, setRole } from '@/pages/role/api/index'
import { deleteJurisdiction, detailJurisdiction } from '@/pages/menu/api/index'
@Component({
  name: 'MenuList',
  components: {
    Pagination,
    Delete,
    AddDialog,
    ModuleTip
  }
})
export default class extends Vue {
  @Prop() private dataTable!:[]
  @Prop() private listLoading!:boolean
  @Prop() private total!:string
  @Prop() private searchData!:any
  private orgListData = [] as any
  private tipShow = false
  private tabIndex ='0'
  private deleData = {} as any
  private formData = {}
  private dialog = {
    id: '',
    msg: '',
    isaddVisible: false,
    isDeleVisible: false,
    type: 'add',
    title: ''
  }
  /// 生命周期
  created() {
  }
  /// // 功能函数 /////
// 保存
  private async handleSave(val:string) {
    if (val === '0') {
      const parent = {
      }
      const { data } = await setRole(parent)
      if (data.isSuccess) {
        this.$message.success('操作成功')
      } else {
        this.$message.error(data.msg)
      }
    } else {
      if (this.orgListData.length > 0) {
       const parent = {
        }
        const { data } = await editRole(parent)
        if (data.isSuccess) {
          this.$message.success('操作成功')
        } else {
          this.$message.error(data.msg)
        }
        this.orgListData = []
      } else {
        this.tipShow = true
      }
    }
  }
  // 删除
  private async deleteButton() {
    const ids = [this.deleData.id]
    const { data } = await deleteJurisdiction({ ids: ids })
    if (data.isSuccess === true) {
      this.$message.success('操作成功！')
    } else {
      this.$message.error(data.msg)
    }
    this.dialog.isDeleVisible = false
    this.$emit('getlist')
  }
  // 获取详情
  private async getEdit(id: string) {
    const { data } = await detailJurisdiction(id)
    this.formData = data.data
  }
  /// // ui /////
  // 用户添加
  handleAdd() {
    this.dialog.isaddVisible = true
    this.dialog.type = 'add'
    this.dialog.title = '添加'
  }
  // 修改
  private handleEdit(id: string) {
    this.dialog.type = 'edit'
    this.dialog.title = '修改'
    this.dialog.isaddVisible = true
    this.getEdit(id)
  }
  // 单个删除
  private handleDelete(row: any) {
    // this.el.table.toggleRowSelection(row, true)
    this.deleData = row
    this.dialog.isDeleVisible = true
  }
  getList() {
    this.$emit('getlist')
  }
  // 添加关闭弹层
  handleClose(id:string) {
    this.dialog.isaddVisible = false
    this.$emit('getlist', id)
  }
  // 删除弹层关闭
  handleCloseDelete() {
    this.dialog.isDeleVisible = false
    this.$emit('getlist', this.searchData.menuId)
  }
}
</script>

<style lang="scss" scoped>
</style>

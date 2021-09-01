<template>
  <div ref="getHeight" class="app-container">
    <div class="main">
      <h2 class="crumbsTitle">应用管理</h2>
      <div class="container tabCon useContain">
        <div class="conSearch">
          <div class="serchForm searchMain">
            <el-form ref="ruleForm" :inline="true" :model="searchData">
              <el-row :gutter="18">
                <el-col :span="6">
                  <el-form-item label="应用名称：" prop="name">
                    <el-input
                      v-model="searchData.name"
                      placeholder="请输入"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="应用状态：" prop="status">
                    <el-select v-model="searchData.status" placeholder="请选择">
                      <el-option
                        v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" class="marLeft" @click="handleSearch">搜索</el-button>
                  <el-button @click="resetSearch"> 重置 </el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
      <div class="operationData">
        <el-button v-if="$hasPermission('application:add')" type="primary" @click="handleAdd">添加应用</el-button>
      </div>
      <module-tip :data-table="dataTable" :list-loading="listLoading" />
      <div v-if="dataTable.length > 0" class="data-list cardBox">
        <el-card v-for="(item, index) of dataTable" :key="index" class="box-card" :class="!item.status?'cardDisabled':''">
          <div class="card" @click.stop="handleEdit(item.id)">
            <div class="card-title">
              <el-tag class="nameInfo" :type="!item.status?'info':''">{{ item.name }}</el-tag>
              <!-- <el-tag class="nameInfo" :type="!item.status?'info':''">{{ item.id }}</el-tag> -->
              <!-- <span>{{ item.name }}</span> -->
              <span v-if="$hasPermission('application:delete')" class="cardClose el-icon-close" @click.stop="handleDelete(item)"></span>
            </div>
            <div class="card-content">
              <p>
                <span class="name-label">描述：</span>
                <span class="name-label-span">{{ item.describe }}</span>
              </p>
            </div>
          </div>
        </el-card>
        <div class="pick"></div>
        <!-- 分页 -->

        <!-- end -->
      </div>
      <pagination
        v-show="total > 0"
        :total="Number(total)"
        :page.sync="searchData.current"
        :limit.sync="searchData.size"
        @pagination="getList"
      />
      <!-- 用户添加、编辑对话框 -->
      <add-dialog
        v-if="dialog.isVisible"
        ref="userDialog"
        :dialog="dialog"
        :base-data="baseData"
        @close="handleClose"
        @getList="getList"
      />
      <!-- end -->
      <!-- 用户删除警告框 -->
      <delete
        ref="fileDialog"
        :dialog="dialog"
        @handleClose="handleCloseDelete"
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
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { IPostTableData } from '@/pages/post/interface/types'
import { ElForm } from 'element-ui/types/form'
import { ellipsis, restData } from '@/utils'
// 组件
import Pagination from '@/components/Pagination/index.vue'
import Delete from './components/delete.vue'
import ModuleTip from '@/components/ModuleTip/index.vue'
// 启用禁用
import BaseDialog from '@/components/BaseStatus/index.vue'
// 添加
import AddDialog from './components/add.vue'
import { statusOptions } from '@/utils/common-selete'
// api
import { getList, deletes, detail } from '@/pages/adhibition/api/index'
import { hasPermission } from '../../utils/index'
@Component({
  name: 'PostList',
  components: {
    Pagination,
    Delete,
    AddDialog,
    BaseDialog,
    ModuleTip
  }
})
export default class extends Vue {
  private dataTable:IPostTableData[]= []
  private total=0
  private listLoading = true
  private deleteId = ''
  private ref: any = this.$refs
  private filterStatus=true
  private statusOptions = [] as any
  private searchData = {
    name: '',
    // status: true,
    size: 16,
    current: 1
  } as any
  private dialog = {
    id: '',
    status: false,
    title: '',
    msg: '',
    isVisible: false,
    isDeleVisible: false,
    isStatusVisible: false
  } as any
  private baseData= {
    id: '',
    name: '',
    color: '',
    status: true,
    describe: '',
    logo: ''
  } as any
  private newIndex=0
  private newData ={} as any
  /// 生命周期
  created() {
    this.getList()
    this.statusOptions = statusOptions
  }
  /// // 功能函数 /////
  // 获取数据
  private async getList() {
    this.listLoading = true
    const { data } = await getList({ ...this.searchData })
    if (data.isSuccess === true) {
      this.dataTable = data.data.records
      this.total = Number(data.data.total)
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
    const { data } = await getList(parent)
    if (data.isSuccess) {
      this.dialog.isStatusVisible = false
      this.$message.success('操作成功')
      this.getList()
    } else {
      this.$message.error(data.msg)
    }
  }
  // 搜索
  private handleSearch() {
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
      this.dialog.msg = `"${value.name}" 岗位禁用后不可使用！`
      this.dialog.title = '确认禁用'
    } else {
      this.dialog.msg = `"${value.name}" 岗位启用！`
      this.dialog.title = '确认启用'
    }
  }
  // 删除
  private async deleteButton() {
    const ids: any[] = [this.dialog.id]
    const { data } = await deletes({ ids: ids })
    if (data.isSuccess === true) {
      this.$message.success('操作成功')
    } else {
      this.$message.error(data.msg)
    }
    this.getList()
    this.dialog.isDeleVisible = false
  }
  // 删除
  private handleDelete(row: any) {
    this.dialog.id = row.id
    this.dialog.name = row.name
    this.dialog.isDeleVisible = true
  }
  // // 获取详情
  private async getEdit(id: string) {
    const { data } = await detail(id)
    this.baseData = { ...data.data }
  }
  // 修改
  private handleEdit(id: string) {
    if (!(this as any).$hasPermission('application:update')) {
      return
    }
    this.dialog.title = '修改'
    this.dialog.isVisible = true
    this.getEdit(id)
  }
  /// // ui /////
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
   // 启用禁用弹层关闭
  handleCloseStatus() {
    this.dialog.isStatusVisible = false
    restData(this.dataTable, this.newData, this.newIndex)
  }
  handleClose() {
    this.dialog.isVisible = false
  }
  handleCloseDelete() {
    this.dialog.isDeleVisible = false
  }
  // 当前页
  private handleCurrentChange(page: number) {
    this.searchData.current = page
    this.getList()
  }

  // 每页条数
  private handleSizeChange(page: number) {
    this.searchData.size = page
    this.searchData.current = 1
    this.getList()
  }
  // 用户添加
  handleAdd() {
    this.dialog.isVisible = true
    this.dialog.title = '添加'
    this.baseData = {
      status: true
    }
  }
  // 内容控制字数，多出的用省略号
  ellipsis(value: any, num: any) {
    return ellipsis(value, num)
  }
}
</script>

<style lang="scss" scoped>
.conSearch{
  border-bottom: 0 !important;
}
</style>

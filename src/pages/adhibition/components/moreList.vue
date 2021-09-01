<template>
  <div>
    <el-dialog
      v-if="isMoreVisible"
      class="user-unfreeze-dialog useDialog"
      title=""
      :visible.sync="isMoreVisible"
      :before-close="handleMoreClose"
    >
      <span slot="title" class="el-dialog__title">
        应用程序<span>({{ dataTable.length }})</span>
      </span>
      <div class="conSearch">
        <div>
          <el-form ref="ruleForm" :inline="true" :model="searchData">
            <el-form-item prop="name">
              <el-input
                v-model="searchData.name"
                placeholder="请输入"
                clearable
                @clear="resetSearch"
                @keyup.enter.native="handleSearch"
              >
                <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearch"></i>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-if="dataTable.length > 0" class="data-list cardBox">
        <el-card v-for="(item, index) of dataTable" :key="index" class="box-card" :class="!item.status?'cardDisabled':''">
          <div class="card" @click.stop="handleChange(item)">
            <div class="card-title">
              <span class="nameInfo">{{ item.abbreviation }}</span>
              <span>{{ item.name }}</span>
              <span class="cardClose el-icon-close" @click.stop="handleDelete(item)"></span>
            </div>
            <div class="card-content">
              <p>
                <span class="name-label">描述：</span>
                <span class="name-label-span">{{ item.describe }}</span>
              </p>
            <!-- <p>
                  <span class="name-label">创建时间：  </span>
                  <span class="name-date">{{ item.createTime }}</span>
                </p> -->
            </div>
          </div>
        </el-card>
        <div class="pick"></div>
      </div>
    </el-dialog>
    <!-- 用户删除警告框 -->
    <delete
      ref="fileDialog"
      :dialog="dialog"
      @handleClose="handleCloseDelete"
      @delete="deleteButton"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
import Delete from './delete.vue'
import { setApply } from '@/utils/cookies'
// api
import { deletes, detail, getAllList } from '@/pages/adhibition/api/index'
@Component({
  name: 'Dialog',
  components: {
      Delete
  }
})
export default class extends Vue {
  @Prop() private isMoreVisible!: any
  private texNum: number = 0
  private isDisable: boolean = false
  private el: any = this.$refs
  private dataTable =[]
  private baseData= {}
  private searchData = {
    name: ''
  } as any
  private dialog = {
    id: '',
    status: false,
    title: '',
    msg: '',
    isVisible: false,
    isDeleVisible: false
  } as any
  // 功能函数
  created() {
      this.getList()
  }
  // 获取数据
  private async getList() {
    const { data } = await getAllList(this.searchData)
    if (data.isSuccess === true) {
      this.dataTable = data.data
    }
  }
  // 修改
  private handleChange(val:any) {
    setApply(JSON.stringify(val))
    location.reload()
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
  // ui
  handleCloseDelete() {
    this.dialog.isDeleVisible = false
  }
  // 搜索
  private handleSearch() {
    this.getList()
  }
  // 重置
  resetSearch() {
    (this.$refs.ruleForm as ElForm).resetFields()
    this.getList()
  }
  // 表单取消
  private handleClose() {
    this.dialog.isVisible = false
  }
  private handleMoreClose() {
      this.$emit('close')
  }
}
</script>

<style lang="scss">
</style>

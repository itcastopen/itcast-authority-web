<template>
  <el-dialog
    v-if="dialog.isViewVisible"
    class="user-unfreeze-dialog userView"
    title="查看"
    :visible.sync="dialog.isViewVisible"
    :before-close="handleClose"
  >
    <div class="detailBox">
      <ul v-if="editData.account !== undefined" class="dialogTable">
        <li v-if="editData.account !== '' && editData.account !== null">
          <label>账号：</label>{{ editData.account }}
        </li>
        <li v-if="editData.name !== '' && editData.name !== null">
          <label>姓名：</label>{{ editData.name }}
        </li>
        <li v-if="editData.orgName !== '' && editData.orgName !== null">
          <label>部门：</label>{{ editData.orgName }}
        </li>
        <li v-if="editData.stationName !== '' && editData.stationName !== null">
          <label>岗位：</label>{{ editData.stationName }}
        </li>
        <li v-if="editData.superior !== '' && editData.superior !== null">
          <label>上级领导：</label>{{ superiorName }}
        </li>
        <li v-if="editData.desc !== '' && editData.desc !== null">
          <label>性别：</label>{{ editData.sex.desc }}
        </li>
        <li v-if="editData.status !== '' && editData.status !== null">
          <label>状态：</label><span v-if="editData.status === true">启用</span><span v-else>禁用</span>
        </li>
        <li v-if="editData.updateTime !== '' && editData.updateTime !== null">
          <label>创建时间：</label>{{ editData.updateTime }}
        </li>
        <li
          v-if="
            editData.lastLoginTime !== '' && editData.lastLoginTime !== null
          "
        >
          <label>最后登录时间：</label>{{ editData.lastLoginTime }}
        </li>
        <li v-if="editData.name !== '' && editData.name !== null">
          <label>用户组：</label>{{ editData.account }}
        </li>
      </ul>
      <div class="right subBox">
        <el-button @click="handleClose"> 取 消 </el-button>
        <el-button type="primary" @click="handleClose"> 确 定 </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import {
  detailUser
} from '@/pages/users/api/index'
@Component({
  name: 'UserDetailDialog',
  components: {}
})
export default class extends Vue {
  @Prop() private dialog!: any
  @Prop() private editData!: {}
  /// // 功能函数 /////
  private superiorName = ''
  /// // ui /////
  // 表单取消
  private handleClose() {
    this.dialog.isViewVisible = false
  }
  @Watch('editData')
  getSuperior(value: any) {
    if (value.superior) {
      this.getSuperiorName(value.superior)
    }
  }
  /// // 功能函数 /////
  // 获取详情
  private async getSuperiorName(id: string) {
    const { data } = await detailUser(id)
    if (data.isSuccess === true) {
      if (data.data) {
        this.superiorName = data.data.name
      }
    }
  }
}
</script>

<style lang="scss">
</style>

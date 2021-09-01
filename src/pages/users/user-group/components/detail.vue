<template>
  <el-dialog
    class="user-unfreeze-dialog userView"
    title="查看"
    :visible="dialog.isViewVisible"
    :before-close="handleClose"
  >
    <div class="detailBox">
      <ul v-if="editData.name !== undefined" class="dialogTable">
        <li v-if="editData.name !== '' && editData.name !== null">
          <label>用户组名称：</label>{{ editData.name }}
        </li>
        <li v-if="editData.roleName !== '' && editData.roleName !== null">
          <label>角色：</label>{{ editData.roleName }}
        </li>
        <li v-if="editData.userCount !== '' && editData.userCount !== null">
          <label>用户数量：</label>{{ editData.userCount }}
        </li>
        <li v-if="editData.status !== '' && editData.status !== null">
          <label>状态：</label><span v-if="editData.status === true">启用</span><span v-else>禁用</span>
        </li>
        <li v-if="editData.userNames.length !==0 && editData.userNames !== null" style="width:100%">
          <label>用户：</label>{{ editData.userNames.join(',') }}
        </li>
        <li v-if="editData.describe !== '' && editData.describe !== null" style="width:100%">
          <label>描述：</label>{{ editData.describe }}
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
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'addDialog',
  components: {}
})
export default class extends Vue {
  @Prop() private dialog!: any
  @Prop() private editData!: {}
  /// // 功能函数 /////
  /// // ui /////
  // 表单取消
  private handleClose() {
    this.dialog.isViewVisible = false
  }
}
</script>

<style lang="scss">
</style>

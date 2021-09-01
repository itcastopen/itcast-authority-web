<template>
  <div>
    <!-- 失败详情 -->
    <el-dialog
      class="user-unfreeze-dialog exporUser dialogw"
      title="导入用户"
      :visible="isFailVisible"
      :before-close="handleClose"
    >
      <div class="uploadBox clearfix">
        <!-- 上传组件按钮 -->
        <!-- 上传文件名列表 -->
        <div v-if="failData.length > 0" class="failList">
          <ul>
            <li v-for="(item, index) in failData" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
      <div class="right">
        <el-button type="primary" @click="handleClose"> 确 定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
@Component({
  name: 'UploadFile'
})
export default class extends Vue {
  @Prop() private isFailVisible!: any
  @Prop() private failData !: []
  // 业务方法

  // 表单取消
  handleClose() {
    this.$emit('handseCloseFail')
  }
  // 确定
  handleSubmit() {
    this.handleClose()
  }
}
</script>
<style>
.upInfoTip {
  line-height: 30px;
}
.upload-text {
  padding: 0 20px 20px;
}
</style>

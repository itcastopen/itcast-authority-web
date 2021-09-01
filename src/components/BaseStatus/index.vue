<template>
  <el-dialog :visible="dialog.isStatusVisible" :show-close="false" class="deleteBox">
    <div v-if="dialog.title!==undefined" class="dialogTitle">{{ dialog.title }}</div>
    <div class="dialogConten">{{ dialog.msg }}</div>
    <div class="subBox">
      <el-button @click="handleClose"> 取 消 </el-button>
      <el-button type="primary" @click="handleSubmit"> 确 定 </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'Dialog'
})
export default class extends Vue {
  @Prop() private dialog!: {
    isDeleVisible:boolean
  }
  // 功能函数
  // 表单提交
  private handleSubmit() {
    this.$emit('state-submit')
  }

  // 表单取消
  private handleClose() {
    this.$emit('handle-close')
  }
}
</script>

<style lang="scss">
</style>

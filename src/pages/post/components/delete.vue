<template>
  <el-dialog :visible.sync="dialog.isDeleVisible" :show-close="false" class="deleteBox">
    <div class="dialogCon">确认删除？</div>
    <div class="subBox">
      <el-button @click="handleClose"> 取 消 </el-button>
      <el-button type="primary" @click="handleSubmit"> 确 定 </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component({
  name: 'deleteDialog'
})
export default class extends Vue {
  @Prop() private dialog!: {
    isDeleVisible:boolean
  }
  // 功能函数

  // 表单提交
  private handleSubmit() {
    this.$emit('delete')
  }
  // ui

  // 表单取消
  private handleClose() {
    this.$emit('handleClose')
  }
}
</script>

<style lang="scss">
</style>

<template>
  <el-dialog :visible.sync="dialog.isDeleVisible" :show-close="false" class="deleteBox">
    <div class="dialogCon textCenter">删除该角色后，相对应的用户权限将被撤销，确认删除？</div>
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
  @Prop() private userData!: {}
  @Prop() private deleData!: {}
  // 解决异步数据子组件获取不到数据
  @Watch('userData')
  getUserInfo(value: any) {
    this.userData = value
  }
  // 功能函数

  // 表单提交
  private handleSubmit() {
    this.$emit('delete')
    this.handleClose()
  }
  // ui

  // 表单取消
  private handleClose() {
    this.dialog.isDeleVisible = false
    this.$emit('handleClose')
    this.$emit('clearSelection')
  }
}
</script>

<style lang="scss">
</style>

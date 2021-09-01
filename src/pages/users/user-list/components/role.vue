<template>
  <div>
    <el-dialog
      class="user-unfreeze-dialog"
      :title="dialog.title"
      :type="dialog.type"
      :visible.sync="dialog.isVisible"
      :before-close="handleClose"
    >
      <div class="unfreeze-form dialogScroll">
        <el-form
          ref="ruleForm"
          :rules="formRules"
          :model="userData"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色：" prop="roles">
            <el-select
              ref="roles"
              v-model="userData.roles"
              multiple
              value-key="id"
              :multiple-limit="limitNumber"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in roleData"
                :key="item.id"
                :disabled="item.disabled"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="subBox">
        <el-button @click="handleClose"> 取 消 </el-button>
        <el-button type="primary" :disabled="isDisable" @click="handleSubmit">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
// api
import { editUserRole } from '@/pages/users/api/index'
@Component({
  name: 'UserRoleDialog',
  components: {
  }
})
export default class extends Vue {
  // 角色验证
  private validateRole = (rule: any, value: string, callback: Function) => {
    if (value && value.length === 0) {
      callback(new Error('请选择角色'))
    } else {
      callback()
    }
  }
  @Prop() private dialog!: any
  @Prop() private roleData!: []
  @Prop() private userData!: {}
  private formRules = {
    // roles: [{ validator: this.validateRole, required: true, trigger: 'fouse' }]

  }
  private styles = {
    width: '300px'
  }
  private el: any = this.$refs
  private limitNumber: Number = 10
  private isDisable: boolean = false

  // 功能函数
  created() {
  }

  /// // 功能函数 /////
  // 编辑用户
  private async updateSave() {
    delete (this.userData as any).createTime
    delete (this.userData as any).updateTime
    const { data } = await editUserRole(this.userData)
    if (data.isSuccess) {
      this.dialog.isVisible = false
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      this.$emit('getList')
      ;(this.userData as any).id = ''
      ;(this.$refs.ruleForm as ElForm).resetFields()
    }
  }
  // 表单提交
  private handleSubmit() {
    this.isDisable = true
    setTimeout(() => {
      this.isDisable = false // 点击一次时隔两秒后才能再次点击
    }, 2000)
    ;(this.$refs.ruleForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        await this.updateSave()
      }
    })
  }
  // 表单取消
  handleClose() {
    const userData = this.userData as any
    (this.$refs.ruleForm as ElForm).resetFields()
    userData.id = ''
    this.dialog.isVisible = false
  }
}
</script>

<style lang="scss">
</style>

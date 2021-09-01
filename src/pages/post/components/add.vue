<template>
  <el-dialog
    v-if="dialog.isVisible"
    class="user-unfreeze-dialog"
    :title="dialog.title + '岗位'"
    :visible.sync="dialog.isVisible"
    :before-close="handleClose"
  >
    <div class="unfreeze-form">
      <el-form
        ref="ruleForm"
        :rules="formRules"
        :model="baseData"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="岗位名称：" prop="name">
          <el-input v-model="baseData.name" placeholder="请输入" autocomplete="off" minlength="1" maxlength="12" />
        </el-form-item>
        <el-form-item label="状态：">
          <el-radio-group v-model="baseData.status">
            <el-radio :label="true">正常</el-radio>
            <el-radio :label="false">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述：" prop="describe" class="textInfo">
          <el-input
            v-model="baseData.describe"
            placeholder="请输入"
            type="textarea"
            resize="none"
            minlength="1"
            maxlength="50"
            @input="descInput"
          />
          <span class="numInfo">{{ texNum }}/50</span>
        </el-form-item>
        <el-form-item class="right">
          <el-button @click="handleClose"> 取 消 </el-button>
          <el-button type="primary" :disabled="isDisable" @click="handleSubmit">
            确 定
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
// api
import { addPost, editPost, detailPost } from '@/pages/post/api/index'

@Component({
  name: 'Dialog',
  components: {
  }
})
export default class extends Vue {
  @Prop() private dialog!: any
  @Prop() private baseData!:any
  private texNum: number = 0
  private isDisable: boolean = false
  private el: any = this.$refs
  // private userData = { ...this.baseData }
  private formRules = {
    name: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }]
  }
  // 功能函数
  // 添加用户
  private async addSave() {
    const { data } = await addPost(this.baseData)
    if (data.isSuccess) {
      this.$message({
        message: '操作成功！',
        type: 'success'
      })
      this.$emit('getList')
      this.handleClose()
    }
  }
  // 编辑用户
  private async updateSave() {
    delete (this.baseData as any).createTime
    delete (this.baseData as any).updateTime
    const { data } = await editPost(this.baseData)
    if (data.isSuccess) {
      this.$message({
        message: '操作成功！',
        type: 'success'
      })
      this.$emit('getList')
      this.handleClose()
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
        if (!this.baseData.id) {
          await this.addSave()
        } else {
          await this.updateSave()
        }
      } else {
        return false
      }
    })
  }
  // ui
  // 表单取消
  private handleClose() {
    (this.$refs.ruleForm as ElForm).resetFields()
    this.$emit('close')
  }
  descInput() {
    let txtVal = (this.baseData as any).describe.length
    this.texNum = 0 + txtVal
  }
}
</script>

<style lang="scss">
</style>

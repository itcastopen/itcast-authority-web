<template>
  <el-dialog
    class="user-unfreeze-dialog"
    :title="dialog.title + '权限'"
    :type="dialog.type"
    :visible.sync="dialog.isaddVisible"
    :before-close="handleClose"
  >
    <div class="unfreeze-form">
      <el-form
        ref="ruleForm"
        :rules="formRules"
        :model="userData"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="编码：" prop="code">
          <el-input v-model="userData.code" placeholder="请输入" autocomplete="off" minlength="1" maxlength="30" />
          <p class="codeTip">建议使用:作为分隔符，并以view、add、update、delete、export、import、download、upload等关键词结尾，如：menu:add、 resource:view、 file:upload</p>
        </el-form-item>
        <el-form-item label="名称：" prop="name">
          <el-input v-model="userData.name" placeholder="请输入" autocomplete="off" minlength="1" maxlength="7" />
        </el-form-item>
        <el-form-item label="请求方式：" prop="method">
          <el-input v-model="userData.method" placeholder="请输入" autocomplete="off" minlength="1" maxlength="10" />
        </el-form-item>
        <el-form-item label="请求地址：" prop="url">
          <el-input v-model="userData.url" placeholder="请输入" autocomplete="off" minlength="1" maxlength="50" />
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
import { getUser } from '@/utils/cookies'
// 公用组件
// api
import { addJurisdiction, editJurisdiction } from '@/pages/menu/api'
@Component({
  name: 'AddDialog',
  components: {
  }
})
export default class extends Vue {
  @Prop() private dialog!: any
  @Prop() private editdata!:{}
  private el: any = this.$refs
  private isDisable =false
  private userData={
    code: '',
    name: '',
    method: '',
    url: '',
    menuId: ''

  } as any
  private formRules = {
    code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    method: [{ required: true, message: '请输入请求方式', trigger: 'blur' }],
    url: [{ required: true, message: '请输入地址', trigger: 'blur' }]
  }
    @Watch('editdata')
    getUserData(val:any) {
      if (val.id !== undefined) this.userData = val
    }
  // 功能函数
  // 添加用户
  private async addSave() {
    const { data } = await addJurisdiction(this.userData)
    if (data.isSuccess) {
      this.$message({
        message: '操作成功！',
        type: 'success'
      })
      this.handleClose()
    }
  }
  // 编辑用户
  private async updateSave() {
    delete (this.userData as any).createTime
    delete (this.userData as any).updateTime
    const { data } = await editJurisdiction(this.userData)
    if (data.isSuccess) {
      this.$message({
        message: '操作成功！',
        type: 'success'
      })
      this.handleClose()
    }
  }

  // 表单提交
  private handleSubmit() {
    this.isDisable = true
    this.userData.menuId = (this.$parent as any).searchData.menuId
    setTimeout(() => {
      this.isDisable = false // 点击一次时隔两秒后才能再次点击
    }, 2000)
    ;(this.$refs.ruleForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        if (this.dialog.type === 'add') {
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
  handleNodeClick(data:Object) {
  }
  // 表单取消
  private handleClose() {
    (this.$refs.ruleForm as ElForm).resetFields()
    this.$emit('close', (this.$parent as any).searchData.menuId)
  }
}
</script>

<style lang="scss">
</style>

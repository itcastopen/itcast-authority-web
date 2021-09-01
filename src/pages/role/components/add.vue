<template>
  <el-dialog
    v-if="dialog.isVisible"
    class="user-unfreeze-dialog"
    :title="dialog.title + '角色'"
    :type="dialog.type"
    :visible.sync="dialog.isVisible"
    :before-close="handleClose"
  >
    <div class="unfreeze-form">
      <el-form
        ref="ruleForm"
        :rules="formRules"
        label-width="100px"
        class="demo-ruleForm"
        :model="formdata"
      >
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model="formdata.name" placeholder="请输入" minlength="1" maxlength="12" />
        </el-form-item>
        <el-form-item label="互斥角色：" prop="repel">
          <el-select
            v-model="formdata.repel"
            placeholder="请选择"
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
        <el-form-item v-if="projectId==='1'" label="选择应用：" prop="applicationIds">
          <el-select
            v-model="formdata.applicationIds"
            placeholder="请选择"
            multiple
            value-key="id"
          >
            <el-option
              v-for="item in dataBase"
              :key="item.id"
              :disabled="!item.status"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-radio-group v-model="formdata.status">
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="right">
          <el-button @click="handleClose"> 取 消 </el-button>
          <el-button type="primary" :disabled="isDisable" @click="handleSubmit"> 确 定 </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
// interface接口
import { getApply } from '@/utils/cookies'
// api
import { addRole, editRole, getList } from '@/pages/role/api/index'
import { getGatherList } from '@/pages/adhibition/api/index'
// 表单验证
import { validateName } from '@/utils/validate'

@Component({
  name: 'roleAddDialog',
  components: {}
})
export default class extends Vue {
  @Prop() private data!:any
  @Prop() private dialog!: any
  @Prop() private roleid!:string
  @Prop() private roleData!:any
  private ref = this.$refs as any
  private dataBase =[] as any
  private formdata={
    dsType: {
      val: 1,
      code: 'ALL'
    }
  } as any
  // 获取应用Id
  get projectId() {
    return getApply() ? JSON.parse(getApply() as any).id : ''
  }
  @Watch('data')
  getformdata(val:any) {
    this.formdata.status = true
    if (this.dialog.type !== 'add') {
      this.formdata = val
    } else {
       this.formdata = {
         name: '',
         id: '',
         repel: '',
         status: true,
         dsType: {
          val: 1,
          code: 'ALL'
        }
       }
         this.roleData.forEach((item:any) => {
          if (item.status) {
              item.disabled = false
          }
        })
    }
  }

  private formRules = {
    name: [{ validator: validateName, required: true, trigger: 'blur' }],
    applicationIds: [{ required: true, message: '请选择', trigger: 'blur' }]
  }

  private isDisable:boolean=false

  /// // 功能函数 /////

  created() {
  this.getList()
  }

  // 获取数据
  private async getList() {
    const { data } = await getGatherList({})
    if (data.isSuccess === true) {
      this.dataBase = data.data
    }
  }
  // 获取角色
  // 添加用户
  private async addSave() {
    const { data } = await addRole(this.formdata)
    if (data.isSuccess) {
      (this.$refs.ruleForm as ElForm).resetFields()
      this.$emit('close')
      this.$message({
        message: '操作成功！',
        type: 'success'
      })
    }
  }
  // 编辑用户
  private async updateSave() {
    delete (this.formdata as any).createTime
    delete (this.formdata as any).updateTime
    const { data } = await editRole(this.formdata)
    if (data.isSuccess) {
      (this.$refs.ruleForm as ElForm).resetFields()
      this.$emit('close')
      this.$message({
        message: '操作成功！',
        type: 'success'
      })
      this.$store.commit('updatedDataTreeId', this.formdata.id)
    }
  }
  // 表单提交
  private handleSubmit() {
    this.isDisable = true
       setTimeout(() => {
           this.isDisable = false // 点击一次时隔两秒后才能再次点击
       }, 1000)
    ;(this.$refs.ruleForm as ElForm).validate(async(valid: boolean) => {
      const formdata = this.formdata as any
      if (valid) {
        if (this.dialog.type === 'add') {
          await this.addSave()
        } else {
          await this.updateSave()
        }
        this.$emit('getList')
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
}
</script>

<style lang="scss">
</style>

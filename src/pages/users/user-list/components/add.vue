<template>
  <div>
    <el-dialog
      class="user-unfreeze-dialog"
      :title="dialog.title + '用户'"
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
          <el-form-item label="账号：" prop="account">
            <el-input v-if="dialog.title === '添加'" v-model="userData.account" minlength="3" maxlength="20" />
            <span v-else>{{ userData.account }}</span>
          </el-form-item>
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="userData.name" autocomplete="off" minlength="1" maxlength="12" />
          </el-form-item>
          <el-form-item label="密码：">
            <el-tooltip
              content="用户的默认密码为123456"
              class="item"
              effect="dark"
              placement="top-start"
            >
              <span>123456</span>
            </el-tooltip>
            <el-button
              v-if="dialog.type === 'edit'"
              type="primary"
              @click="handleReset"
            >
              重置密码
            </el-button>
          </el-form-item>
          <el-form-item label="手机号：" prop="mobile">
            <el-input v-model="userData.mobile" autocomplete="off" minlength="11" maxlength="11" />
          </el-form-item>
          <el-form-item label="组织：" prop="orgId">
            <select-tree
              ref="treeSelect"
              v-model="values"
              popover-class="fas"
              :styles="styles"
              :select-params="selectParams"
              :tree-params="treeParams"
              :org-data="orgData"
              :org-id="userData.orgId"
              @getValue="getValue($event)"
            />
          </el-form-item>
          <el-form-item label="上级领导：" prop="superior">
            <el-select v-model="userData.superior" placeholder="请选择">
              <el-option
                v-for="item in superiorData"
                :key="item.id"
                :disabled="!item.status"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="岗位：" prop="stationId">
            <el-select v-model="userData.stationId" placeholder="请选择">
              <el-option
                v-for="item in stationData"
                :key="item.id"
                :disabled="!item.status"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="角色：" prop="roles">
            <el-select
              ref="roles"
              v-model="userData.roles"
              multiple
              value-key="id"
              :multiple-limit="limitNumber"
              placeholder="请选择"
              @change="handleRepel(userData.roles)"
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
          <el-form-item label="性别：" class="boxPt">
            <el-radio-group v-model="userData.sex.code">
              <el-radio label="M">男</el-radio>
              <el-radio label="W">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态：" class="boxPt">
            <el-radio-group v-model="userData.status">
              <el-radio :label="true">启用</el-radio>
              <el-radio :label="false">禁用</el-radio>
            </el-radio-group>
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
    <!-- 启用禁用 -->
    <base-dialog
      ref="status"
      :dialog="dialogData"
      @handle-close="handleCloseStatus"
      @state-submit="handleResetSubmit"
    />
  <!-- end -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
import { getUser } from '@/utils/cookies'
// 表单验证
import { validateAccounts, validateName, validatePhone } from '@/utils/validate'
// 公用组件
import UploadImage from '@/components/UploadImage/index.vue'
import SelectTree from '@/components/SelectTree/index.vue'
import BaseDialog from '@/components/BaseStatus/index.vue'
// api
import { getAllStation } from '@/api/api'
import { addUser, editUser, resetUser, getUserList } from '@/pages/users/api/index'
@Component({
  name: 'UserAddDialog',
  components: {
    UploadImage,
    SelectTree,
    BaseDialog
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
  @Prop() private orgData!: []
  @Prop() private roleData!: []
  @Prop() private treeData!: {}
  @Prop() private userData!: {}
  // private firstLoad = true
  private accept: string = 'image/jpeg, image/gif, image/png'
  private imgFileList = []
  private stationData = []
  private superiorData = []
  private values = ''
  private userIds:any = []
  private imgFileData = {
    bizId: '',
    bizType: 'USER_AVATAR'
  }
  private fileOtherData = {
    bizId: '',
    bizType: '',
    imageUrl: '',
    isSingle: true
  }
  private dialogData = {
    isStatusVisible: false,
    msg: ''
  }
  private formRules = {
    account: [
      { validator: validateAccounts, required: true, trigger: 'blur' }
    ],
    mobile: [{ validator: validatePhone, required: true, trigger: 'blur' }],
    name: [{ validator: validateName, required: true, trigger: 'blur' }],
    orgId: [{ required: true, message: '请选择组织', trigger: 'change' }],
    // superior: [{ required: true, message: '请选择上级领导', trigger: 'change' }],
    stationId: [{ required: true, message: '请选择岗位', trigger: 'change' }]
    // roles: [{ validator: this.validateRole, required: true, trigger: 'fouse' }]

  }
  private styles = {
    width: '300px'
  }
  // private test = ''
  private selectParams = {
    clearable: true,
    placeholder: '请选择'
  }
  private treeParams = {
    clickParent: false,
    filterable: true,
    data: [],
    props: {
      children: 'children',
      label: 'name',
      disabled: 'disabled',
      value: 'id'
    }
  }

  private el: any = this.$refs
  private limitNumber: Number = 10
  private isDisable: boolean = false
  // 解决异步数据子组件获取不到数据
  @Watch('userData')
  getUserInfo(value: any) {
    if (value.roles && value.roles.length > 0) {
    this.rolesGet(value.roles, this.roleData)
    }
  }
  @Watch('orgData', { immediate: true })
  getOrg(value: any) {
    this.treeParams.data = value
  }

  created() {
    this.getStation()
    this.getSuperiorData()
  }

  /// // 功能函数 /////
  private init() {
    this.clearData()
    ;(this.$refs.ruleForm as ElForm).resetFields()
  }
  // 获取岗位
  private async getStation() {
    const params = {
      status: true
    }
    const { data } = await getAllStation({ status: '' })
    this.stationData = data.data
  }
  // 获取用户列表
  private async getSuperiorData() {
    const params = {
      status: true
    }
    const { data } = await getUserList({ })
    this.superiorData = data.data
  }
  // 重置密码
  handleReset() {
    const ids: any[] = []
    const userData: any = getUser()
    const data = JSON.parse(userData)
    this.userIds.push(data.id)
    this.dialogData.isStatusVisible = true
    this.dialogData.msg = '确认重置该用户的密码吗?'
  }
  // 重置密码提交
  private async handleResetSubmit() {
    const { data } = await resetUser({ ids: this.userIds })
    if (data.isSuccess === true) {
      this.dialogData.isStatusVisible = false
      this.$message.success('操作成功')
    } else {
      this.$message.error(data.msg)
    }
  }
  // 添加用户
  private async addSave() {
    const { data } = await addUser(this.userData)
    if (data.isSuccess && data.code === 0) {
      this.dialog.isVisible = false
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      this.$emit('getList')
      this.clearData()
      ;(this.$refs.ruleForm as ElForm).resetFields()
    }
  }
  // 编辑用户
  private async updateSave() {
    delete (this.userData as any).createTime
    delete (this.userData as any).updateTime
    const { data } = await editUser(this.userData)
    if (data.isSuccess) {
      this.dialog.isVisible = false
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      this.$emit('getList')
      this.clearData()
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
        if (this.dialog.type === 'add') {
          await this.addSave()
        } else {
          await this.updateSave()
        }
      }
    })
  }
  // 表单取消
  handleClose() {
    const userData = this.userData as any
    (this.$refs.ruleForm as ElForm).resetFields()
    userData.id = ''
    this.clearData()
    this.dialog.isVisible = false
  }
  // 关闭重置弹层
  handleCloseStatus() {
    this.dialogData.isStatusVisible = false
  }
  // 获取组织树id
  getValue(value: string) {
    (this.userData as any).orgId = value
  }
  // 触发角色
  handleRepel(val:any) {
    this.rolesGet(val, this.roleData)
  }
  // 触发角色下拉，禁用互斥角色
  rolesGet(objData:any, roleData:Array<string>) {
    let objArr = {} as any
    let dataArr = [] as any
    roleData.forEach((obj:any) => {
        objData.forEach((item:any) => {
        if (item === obj.id) {
          objArr = {
            id: obj.id,
            name: obj.name,
            repel: obj.repel
          }
          dataArr.push(objArr)
        }
      })
    })
    roleData.forEach((obj:any) => {
      if (!obj.status) {
        obj.disabled = true
      } else {
        obj.disabled = false
      }

      dataArr.forEach((item:any) => {
        if (item.id === obj.repel || item.repel === obj.id) {
          obj.disabled = true
        }
      })
    })
  }
  clearData() {
    (this.userData as any).sex.code = 'M'
    ;(this.userData as any).status = true
    ;(this.userData as any).avatar = ''
  }
  mounted() {
    this.fileOtherData.bizType = this.imgFileData.bizType
    this.fileOtherData.isSingle = true
  }
}
</script>

<style lang="scss">
</style>

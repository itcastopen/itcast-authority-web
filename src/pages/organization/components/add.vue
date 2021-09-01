<template>
  <el-dialog
    class="user-unfreeze-dialog"
    :title="dialog.title + '组织'"
    :type="dialog.type"
    :visible.sync="dialog.isVisible"
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
        <el-form-item label="上级组织：" prop="parentId">
          <select-tree
            :props="props"
            :options="optionData"
            :parentname="parentname"
            :parentid="parentid"
            :editdata="editdata"
            :clearable="isClearable"
            :accordion="isAccordion"
            @get-value="getValue($event)"
          />
        </el-form-item>
        <el-form-item label="组织名称：" prop="name">
          <el-input v-model="userData.name" placeholder="请输入" autocomplete="off" minlength="1" maxlength="30" />
        </el-form-item>
        <el-form-item label="组织负责人：" prop="managerId">
          <el-select v-model="userData.managerId" placeholder="请选择">
            <el-option
              v-for="item in superiorData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-radio-group v-model="userData.status">
            <el-radio :label="true">正常</el-radio>
            <el-radio :label="false">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序：" prop="sortValue">
          <el-input-number v-model="userData.sortValue" :min="0" />
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
// api
import { getAllStation } from '@/api/api'
import { addUser, edit } from '@/pages/organization/api/index'
import { getUserList } from '@/pages/users/api/index'

// 公用组件
// 组织树
import SelectTree from '@/components/SelectTree/org-tree.vue'
@Component({
  name: 'AddDialog',
  components: {
    SelectTree
  }
})
export default class extends Vue {
  @Prop() private dialog!: any
  @Prop() private orgdata!:[]
  @Prop() private editdata!:{}
  @Prop() private parentid!:string
  @Prop() private parentname!:string
  private isDisable: boolean = false
  private el: any = this.$refs
  private values = ''
  private styles = {
    width: '300px'
  }
  private userData={
    parentId: '',
    name: '',
    status: true,
    sortValue: '0'

  } as any
  private isClearable=true // 可清空（可选）
  private isAccordion=true // 可收起（可选）
  // private parentInfo={
  //   valueId: '',
  //   parentName: ''
  // }
  private valueId =''
  private parentName =''
  private props={ // 配置项（必选）
        value: 'id',
        label: 'name',
        children: 'children'
        // disabled: true
      }
  private superiorData = [] // 组织负责人列表
  private formRules = {
    parentId: [{ required: true, message: '请选择上级组织', trigger: 'change' }],
    name: [{ required: true, message: '请输入组织名称', trigger: 'blur' }]
  }
  get optionData() {
      let cloneData = JSON.parse(JSON.stringify(this.orgdata)) // 对源数据深度克隆
      return cloneData.filter((father:any) => { // 循环所有项，并添加children属性
          let branchArr = cloneData.filter((child:any) => father.id === child.parentId) // 返回每一项的子级数组
          // eslint-disable-next-line no-unused-expressions
          branchArr.length > 0 ? father.children = branchArr : '' // 给父级添加一个children属性，并赋值
          return String(father.parentId) === '0' // 返回第一层
      })
    }
    @Watch('editdata')
    getUserData(val:any) {
      if (this.dialog.type !== 'add' && val.id !== undefined) {
        this.userData = val
      }
    }
    @Watch('parentid')
    getParentId(val:string) {
      this.userData.parentId = val
    }
  created() {
    this.getSuperiorData()
  }
  // 功能函数
  // 获取用户列表
  private async getSuperiorData() {
    const params = {
      status: true
    }
    const { data } = await getUserList({ })
    this.superiorData = data.data
  }
  // 添加用户
  private async addSave() {
    const { data } = await addUser(this.userData)
    if (data.isSuccess) {
      this.$message({
        message: '操作成功！',
        type: 'success'
      })
      this.$store.commit('updatedOrgTreeId', data.data.id) // 当前菜单数据存储到数据池
      this.$emit('getOrgList')
      this.handleClose()
    }
  }
  // 编辑用户
  private async updateSave() {
    delete (this.userData as any).createTime
    delete (this.userData as any).updateTime
    const { data } = await edit(this.userData)
    if (data.isSuccess) {
      this.$message({
        message: '操作成功！',
        type: 'success'
      })
      this.$store.commit('updatedOrgTreeId', data.data.id) // 当前菜单数据存储到数据池
      this.$emit('getOrgList')
      this.handleClose()
    }
  }

  // 表单提交
  private handleSubmit() {
    this.isDisable = true
    setTimeout(() => {
      this.isDisable = false // 点击一次时隔两秒后才能再次点击
    }, 2000)
    if (this.userData.parentId === '') {
      this.userData.parentId = 0
    }
    (this.$refs.ruleForm as ElForm).validate(async(valid: boolean) => {
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
  // 获取组织树id
  getValue(value: string) {
    (this.userData as any).parentId = value
  }
  // 表单取消
  private handleClose() {
    (this.$refs.ruleForm as ElForm).resetFields()
    this.$emit('cleardata')
    this.$emit('close')
  }
}
</script>

<style lang="scss">
</style>

<template>
  <div>
    <el-dialog
      class="user-unfreeze-dialog"
      :title="dialog.title + '菜单'"
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
          <el-form-item label="名称：" prop="name">
            <el-input
              v-model="userData.name"
              placeholder="请输入"
              autocomplete="off"
              minlength="1"
              maxlength="6"
            />
          </el-form-item>
          <el-form-item label="路由URL：" prop="path">
            <el-input
              v-model="userData.path"
              placeholder="请输入"
              autocomplete="off"
              minlength="1"
              maxlength="50"
              @keyup.native="menuPath"
            />
            {{ menuComponent }}
          </el-form-item>
          <el-form-item label="上级类目：" prop="parentId">
            <select-tree
              ref="tree"
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
          <el-form-item label="图标：" prop="icon" class="incoSelete">
            <el-input
              v-model="userData.icon"
              class="iconInfo"
              placeholder="请选择图标"
              readonly
              @focus="handleIcon"
            >
              <el-button
                slot="append"
                icon="el-icon-brush"
                @click="clearIcon"
              />
            </el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-radio-group v-model="userData.isEnable">
              <el-radio :label="true">正常</el-radio>
              <el-radio :label="false">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序：" prop="sortValue">
            <el-input-number v-model="userData.sortValue" :min="0" />
          </el-form-item>
          <el-form-item class="right">
            <el-button @click="handleClose"> 取 消 </el-button>
            <el-button
              type="primary"
              :disabled="isDisable"
              @click="handleSubmit"
            >
              确 定
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <icons
      :is-visible="isIconVisible"
      @close="handleCloseIcon"
      @getIcon="getIcon"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
// 公用组件
// 组织树
import SelectTree from '@/components/SelectTree/org-tree.vue'
import Icons from './components/icons.vue'
// api
import { addMenu, editMenu } from '@/pages/menu/api'
@Component({
  name: 'AddDialog',
  components: {
    SelectTree,
    Icons
  }
})
export default class extends Vue {
  @Prop() private dialog!: any
  @Prop() private menuTreeData!: []
  @Prop() private editdata!: {}
  @Prop() private parentname!: string
  private isDisable: boolean = false
  private parentid = ''
  private el: any = this.$refs
  private values = ''
  private styles = {
    width: '300px'
  }
  private userData = {
    parentId: '',
    name: '',
    path: '',
    isEnable: true,
    sortValue: '0',
    icon: '',
    component: ''
  } as any
  private isClearable = true // 可清空（可选）
  private isAccordion = true // 可收起（可选）
  private valueId = ''
  private parentName = ''
  private props = {
    // 配置项（必选）
    value: 'id',
    label: 'name',
    children: 'children'
    // disabled:true
  }
  private isIconVisible = false
  private formRules = {
    parentId: [
      { required: true, message: '请选择上级类目', trigger: 'change' }
    ],
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    path: [{ required: true, message: '请输入URL', trigger: 'blur' }]
  }
  get optionData() {
    let cloneData = JSON.parse(JSON.stringify(this.menuTreeData)) // 对源数据深度克隆
    return cloneData
  }
  get menuComponent() {
    let comp = ''
    if (this.userData.path && this.userData.path !== '/') {
      const isUrl = this.isUrl(this.userData.path)
      if (isUrl) {
        comp = `${this.userData.path}`
      } else {
        comp = `${this.userData.path.substr(1)}/index.vue`
      }
    } else {
      comp = `/index.vue`
    }
    return comp
  }
  @Watch('editdata')
  getUserData(val: any) {
    if (this.dialog.type !== 'add' && val.id !== undefined) {
      this.userData = val
    this.parentid = val.parentId
    }
  }
  @Watch('parentid')
  getParentId(val: string) {
    this.userData.parentId = val
  }
  @Watch('userData.path')
  getmenu(val: any) {
    this.computedComponent()
  }
  isUrl(path: any) {
    const urls = [
      'http://',
      '/http://',
      'https://',
      '/https://',
      'www.',
      '/www.'
    ]
    const urlIndex = urls.findIndex(item => {
      return path.startsWith(item)
    })
    return urlIndex >= 0
  }
  menuPath() {
    const isUrl = this.isUrl(this.userData.path)
    if (!isUrl && !this.userData.path.startsWith('/')) {
      this.userData.path = '/' + this.userData.path
    } else if (isUrl) {
      if (this.userData.path.startsWith('/')) {
        this.userData.path = this.userData.path.substr(1)
      }
    }
  }
  computedComponent() {
      const isUrl = this.isUrl(this.userData.path)
      if (isUrl) {
        this.userData.component = 'Layout'
      } else {
        if (this.userData.path) {
          this.userData.component = `${this.userData.path}/index`
        } else {
          this.userData.component = `index`
        }
      }
    }
  // 功能函数
  // 添加
  private async addSave() {
    const { data } = await addMenu(this.userData)
    if (data.isSuccess) {
      this.$message({
        message: '操作成功！',
        type: 'success'
      })
      this.$store.commit('updatedMenuTreeId', data.data.id) // 当前菜单数据存储到数据池
      this.handleClose()
    }
  }
  // 编辑
  private async updateSave() {
    delete (this.userData as any).createTime
    delete (this.userData as any).updateTime
    const { data } = await editMenu(this.userData)
    if (data.isSuccess) {
      this.$message({
        message: '操作成功！',
        type: 'success'
      })
      this.$store.commit('updatedMenuTreeId', data.data.id) // 当前菜单数据存储到数据池
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
        if (this.dialog.type === 'add') {
          await this.addSave()
        } else {
          await this.updateSave()
        }
        this.$emit('getMenuList')
      } else {
        return false
      }
    })
  }
  // ui
  handleNodeClick(data: Object) {}
  // 获取图标
  getIcon(val: string) {
    this.userData.icon = val
  }
  clearIcon() {
    this.userData.icon = ''
  }
  handleIcon() {
    this.isIconVisible = true
  }
  // 获取组织树id
  getValue(value: string) {
    (this.userData as any).parentId = value
  }
  handleCloseIcon() {
    this.isIconVisible = false
  }
  // 表单取消
  private handleClose() {
    (this.$refs.ruleForm as ElForm).resetFields()
    this.$emit('cleardata')
    this.$emit('close')
    this.parentid = ''
    ;(this.$refs as any).tree.clearHandle()
  }
}
</script>

<style lang="scss"></style>

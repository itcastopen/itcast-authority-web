<template>
  <el-dialog
    v-if="dialog.isVisible"
    class="user-unfreeze-dialog"
    :title="dialog.title + '应用'"
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
        <el-form-item label="ID：" prop="id">
          <el-input v-model="baseData.id" placeholder="请输入" disabled autocomplete="off" minlength="1" maxlength="30" />
        </el-form-item>
        <el-form-item label="应用名称：" prop="name">
          <el-input v-model="baseData.name" placeholder="请输入" autocomplete="off" minlength="1" maxlength="15" />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="baseData.status">
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="主题色：" prop="color">
          <el-select v-model="baseData.color" placeholder="请选择" clearable>
            <el-option
              v-for="item in themeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
              <span>{{ item.name }}</span>
              <span style="width:10px;height:10px;display:inline-block;margin-left:20px;" :style="{background: item.color}"></span>
              <span style="font-size: 12px; margin-left:2px; color: #8492a6">{{ item.color }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="logo：" prop="logo">
          <el-upload
            class="avatar-uploader"
            action="fakeaction"
            :show-file-list="false"
            :http-request="uploadImg"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="baseData.logo" :src="baseData.logo" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <i v-if="baseData.logo" class="el-icon-error icon-close" @click="delAvatarHandle"></i>
        </el-form-item>
        <el-form-item label="描述：" prop="describe" class="textInfo">
          <el-input
            v-model="baseData.describe"
            placeholder="请输入"
            type="textarea"
            resize="none"
            minlength="1"
            maxlength="30"
            @input="descInput"
          />
          <span class="numInfo">{{ texNum }}/30</span>
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
import { add, edit } from '@/pages/adhibition/api/index'

import { themeData } from '@/utils/data'

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
  private themeList = themeData
  private imgType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  // private userData = { ...this.baseData }
  private formRules = {
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }]
  }
  // 功能函数
  // 添加用户
  private async addSave() {
    const { data } = await add(this.baseData)
    if (data.isSuccess) {
      this.$message({
        message: '操作成功！',
        type: 'success'
      })
      this.$emit('getList')
      this.handleClose()
    } else {
      this.$message.error(data.msg)
    }
  }
  // 编辑用户
  private async updateSave() {
    delete this.baseData.createTime
    delete this.baseData.updateTime
    const parent = {
      id: this.baseData.id,
      name: this.baseData.name,
      status: this.baseData.status,
      describe: this.baseData.describe,
      color: this.baseData.color,
      logo: this.baseData.logo
    }
    const { data } = await edit(parent)
    if (data.isSuccess) {
      this.$message({
        message: '操作成功！',
        type: 'success'
      })
      this.$emit('getList')
      this.handleClose()
    } else {
      this.$message.error(data.msg)
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
  handleAvatarSuccess(res:any, file:any) {
    // this.imageUrl = URL.createObjectURL(file.raw);
  }
  // 上传文件判断
  beforeAvatarUpload(file:any) {
    // 调用testFileType方法，把定义的imgType数组和我们上传的图片类型file.type一起传进去
    const isType = this.testFileType(file.type)
    const isLt1M = file.size / 1024 / 1024 < 1
    if (isType < 0) {
      this.$message.error('上传的图片只能是 JPG、JPEG、PNG、GIF 格式!')
      return
    }
    if (!isLt1M) {
      this.$message.error('上传的图片大小不能超过 1MB!')
      return
    }
    return true
  }
  // 判断文件类型是否在数组中 返回布尔值
  testFileType(fileType: any) {
    return this.imgType.findIndex(item => fileType === item)
  }
  // 上传文件
  uploadImg(params:any) {
    // Promise的数据需要用.then得到
    this.getBase64(params.file).then(res => {
      this.baseData.logo = res
    })
    // 在此axios请求
  }
  // 转换格式
  getBase64(file:any) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      let fileResult = ''
      reader.readAsDataURL(file) // 开始转
      reader.onload = function() {
        fileResult = reader.result ? String(reader.result) : ''
      } // 转 失败
      reader.onerror = function(error) {
        reject(error)
      } // 转 结束 咱就 resolve 出去
      reader.onloadend = function() {
        resolve(fileResult)
      }
    })
  }
  delAvatarHandle() {
    this.baseData.logo = ''
  }
}
</script>

<style lang="scss" scoped>
 .avatar-uploader ::v-deep.el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader ::v-deep.el-upload:hover {
    border-color: var(--current-color);
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 98px;
    height: 98px;
    line-height: 98px;
    text-align: center;
  }
  .avatar {
    width: 98px;
    height: 98px;
    display: block;
  }
  .icon-close{
    position: absolute;
    top: -8px;
    left: 88px;
    font-size: 20px;
    z-index: 9999 !important;
    cursor: pointer;
    color: var(--current-color);
  }
</style>

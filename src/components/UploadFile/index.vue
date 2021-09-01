<template>
  <div>
    <el-dialog
      class="user-unfreeze-dialog exporUser"
      title="导入用户"
      :visible="dialog.isFileVisible"
      :before-close="handleClose"
    >
      <div class="uploadBox clearfix">
        <!-- 上传组件按钮 -->
        <el-upload
          class="upload-demo upload-text"
          :action="'api/authority/user/importExcel?token='+myheader"
          :before-upload="beforeUpload"
          :on-error="uploadFail"
          multiple
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          请选择需要上传的用户文件
          <el-button
            size="small"
            type="primary"
            class="el-icon-folder-opened"
            :disabled="processing"
          >
            {{ uploadTip }}
          </el-button>
          <span class="pointer" @click="handelDownload">未选择任何文件<span class="colFont">下载模板</span>
          <!-- <span class="colFontTip">(仅支持Excel)</span> -->
          </span>
        </el-upload>
        <!-- 上传文件名列表 -->
        <div v-if="fileList.length > 0" class="fileList">
          <ul>
            <li v-for="(item, index) in fileList" :key="index">
              {{ item.name }}
              <span class="rText delect">
                <span class="pointer" @click="deleteUpdateFiles(item, index)">删除</span>
                <span v-if="item.message.length>0"
                      class="pointer colFont"
                      @click="detailsUpdateFiles(index, item.message)"
                >失败详情</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="subBox">
        <el-button @click="handleClose"> 取 消 </el-button>
        <el-button type="primary" @click="handleSubmit"> 确 定 </el-button>
      </div>
    </el-dialog>
    <!-- 失败详情 -->
    <fail-dilalog
      ref="failDialog"
      :is-fail-visible="isFailVisible"
      :fail-data="failData"
      @handseCloseFail="handseCloseFail"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

// 获取token
import { getToken } from '@/utils/cookies'
// api接口
import { exportExle } from '@/api/api'
// 组件
import FailDilalog from './components/index.vue'
@Component({
  name: 'UploadFile',
  components: {
    FailDilalog
  }
})
export default class extends Vue {
  @Prop() private dialog!: any
  private isFailVisible = false
  private fileList = [] as any
  private failData = []
  private processing = false
  private uploadTip = '点击上传'
  private failIndex = 0
  el: any = this.$refs
  get myheader() {
    return getToken()
  }

  // 业务方法
  // 下载模板
  handelDownload() {
    window.location.href = '../../template/template.xlsx'
  }
  // 文件上传完成
  typeTip(obj: any) {
    this.$message.error(obj)
  }
  // 文件上传格式
  beforeUpload(file: any, obj: any) {
    let fileName = file.name.split('.')
    const size = file.size / 1024 / 1024 < 10
    if (!size) {
      this.$message({
        message: '上传文件大小不能超过 10MB!',
        type: 'warning'
      })
    }
    if (fileName[1] === 'xls' || fileName[1] === 'xlsx') {
      return file
    } else {
      this.$message.error('上传文件只能是 xls/xlsx 格式!')
      return false
    }
  }

  // 上传成功后获取列表
  handleAvatarSuccess(response: any, file: any, fileList: any) {
    if (response.isSuccess) {
      const objData: any = {
      name: file.name,
      message: response.data.message
    }
    this.fileList.push(objData)
    let formData = new FormData()
    formData.append('file', file.file)
      this.$message.success('导入成功！')
    } else {
      this.$message.error(response.msg)
    }
  }
  // 上传错误
  uploadFail(err: any, file: any, fileList: any) {
    this.uploadTip = '点击上传'
    this.processing = false
    this.$message.error(err)
  }
  // 上传成功
  // // 用 http-request上传
  // async httpRequest(val: any) {
  //   let formData = new FormData()
  //   formData.append('file', val.file)
  //   this.submitUpload(formData)
  // }
  // async submitUpload(val: any) {
  //   const data = await exportExle(val)
  //   if (data.status === 200) {
  //     this.$message({
  //       // showClose: true,
  //       type: 'success',
  //       message: '导入成功！'
  //     })
  //   } else {
  //     this.$message({
  //       // showClose: true,
  //       type: 'error',
  //       message: '导入失败！'
  //     })
  //   }
  //   // (this.el.uploadref as any).clearFiles()
  //   // this.handleClose()
  // }
  // 表单取消
  handseCloseFail() {
    this.isFailVisible = false
  }
  handleClose() {
    this.dialog.isFileVisible = false
    this.fileList = []
  }
  // 确定
  handleSubmit() {
    this.handleClose()
    this.$emit('getList')
  }
  handleFail() {}
  // 删除
  deleteUpdateFiles(item: string, index: number) {
    this.fileList.splice(index, 1)
    this.$message.success('文件删除成功')
  }
  // 失败详情
  detailsUpdateFiles(index: number, data: any) {
    this.failData = data
    this.failIndex = index
    this.isFailVisible = true
  }
  //
}
</script>
<style>
.upInfoTip {
  line-height: 30px;
}
.upload-text {
  padding: 0 20px 25px;
}
</style>

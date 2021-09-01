<template>
  <div>
    <el-upload
      ref="uploadRef"
      :accept="accept"
      action="api/file/attachment/upload"
      :auto-upload="autoUpload"
      :before-upload="beforeUpload"
      :data="fileOtherData"
      :headers="headers"
      :limit="limit"
      :on-change="handleChange"
      :on-error="handleError"
      :show-file-list="showFileList"
      class="avatar-uploader"
      list-type="picture-card"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus"></i>
      <div slot="tip" class="el-upload__tip">
        限制上传jpg、png格式，大小不超过100kb
      </div>
    </el-upload>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getToken } from '@/utils/cookies'
import { getAttachment } from '@/api/api'
import { Console } from 'console'
@Component({
  name: 'UploadImage'
})
export default class extends Vue {
  @Prop({ default: '' }) private value!: string
  @Prop({
    default: () => {
      return 'file1'
    }
  })
  @Prop({
    default: () => {
      return false
    }
  })
  @Prop({
    default: () => {
      return false
    }
  })
  private autoUpload!: boolean
  @Prop({
    default: () => {
      return true
    }
  })
  private showFileList!: boolean
  @Prop({
    default: () => {
      return null
    }
  })
  private limit!: 1
  @Prop({
    default: () => {
      return 'image/jpeg, image/gif, image/png, image/bmp'
    }
  })
  private accept!: string
  @Prop({
    default: () => {
      return null
    }
  })
  private acceptSize!: number

  @Prop({
    default: () => {
      return {
        bizId: '',
        bizType: '',
        isSingle: false
      }
    }
  })
  @Prop()
  private fileOtherData!: {}
  @Prop() private avatar!: string
  private imageUrl: string = ''
  // 新增附件列表
  private addFileAry: any[] = []
  // 是否上传失败
  private isUploadError = false
  get headers() {
    return {
      token: getToken()
    }
  }
  @Watch('avatar')
  getAvatar(value: string) {
    this.imageUrl = value
  }
  // 附件上传前触发
  beforeUpload(file: any) {
    const vm = this
    const size = file.size / 1024 / 1024 < 0.1
    if (!size) {
      this.$message({
        message: '上传文件大小不能超过 100kb!',
        type: 'warning'
      })
      return false
    }
    vm.$store.state.hasLoading = true
  }
  // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
  handleChange(file: any, fileList: any) {
    const vm = this
    if (file.response) {
      if (file.response.isSuccess) {
        const remoteFile = file.response.data
        // vm.fileOtherData.bizId = remoteFile.bizId
        this.imageUrl = remoteFile.url
        this.$emit('setData', remoteFile.url)
      } else {
        this.$message.error(file.response.msg)
        this.isUploadError = false
      }
    } else {
      if (this.acceptSize) {
        const isLtAcceptSize = file.size > this.acceptSize
        if (isLtAcceptSize) {
          setTimeout(() => {
            this.$message.error(
              '只能上传100kb' +
                '的文件!已为您过滤文件：' +
                file.name
            )
          }, 10)

          fileList.forEach((item: any, index: number) => {
            if (item.uid === file.uid) {
              fileList.splice(index, 1)
            }
          })
        } else {
          if (!this.isUploadError) {
            this.addFileAry.push(file.name)
          }
          this.isUploadError = false
        }
      }
    }
    this.$store.state.hasLoading = false
  }
  // 附件上传失败
  handleError() {
    const vm = this
    vm.$message.error('附件上传失败，请重试')
    vm.isUploadError = true
    vm.$store.state.hasLoading = false
    if (!vm.showFileList) {
      vm.imageUrl = ''
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

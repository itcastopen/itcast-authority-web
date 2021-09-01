<template>
  <el-dialog
    class="user-unfreeze-dialog iconsDialog"
    title="图标"
    :visible.sync="isVisible"
    :before-close="handleClose"
  >
    <div class="unfreeze-form">
      <el-input
        v-model="name"
        placeholder="请输入"
        clearable
        @clear="resetSearch"
      >
        <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearch"></i>
      </el-input>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane class="resultScroll" label="通用类" name="first">
          <ul class="iconList">
            <li v-for="item in listData" :key="item">
              <span :class="{'active': activeIndex === item}">
                <el-icon
                  :class="item"
                  :title="item"
                  @click.native="hancleIcon(item)"
                  @dblclick.native="handleSave"
                />
              </span>
              <p>{{ item }}</p>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="指向类" name="second" class="resultScroll">
          <ul class="iconList">
            <li v-for="item in listData" :key="item">
              <span :class="{'active': activeIndex === item}">
                <el-icon
                  :class="item"
                  :title="item"
                  @click.native="hancleIcon(item)"
                  @dblclick.native="handleSave"
                />
              </span>
              <p>{{ item }}</p>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="填充类" name="third" class="resultScroll">
          <ul class="iconList">
            <li v-for="item in listData" :key="item">
              <span :class="{'active': activeIndex === item}">
                <el-icon
                  :class="item"
                  :title="item"
                  @click.native="hancleIcon(item)"
                  @dblclick.native="handleSave"
                />
              </span>
              <p>{{ item }}</p>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="食品类" name="fourth" class="resultScroll">
          <ul class="iconList">
            <li v-for="item in listData" :key="item">
              <span :class="{'active': activeIndex === item}">
                <el-icon
                  :class="item"
                  :title="item"
                  @click.native="hancleIcon(item)"
                  @dblclick.native="handleSave"
                />
              </span>
              <p>{{ item }}</p>
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>
      <div class="right">
        <el-button @click="handleClose"> 取 消 </el-button>
        <el-button type="primary" :disabled="isDisable" @click="handleSubmit">
          确 定
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
// api
// icon图标
import { commonIcons, directivityIcons, solidIcons, foodIcons } from '@/utils/common-icons'
@Component({
  name: 'IconDialog',
  components: {
  }
})
export default class extends Vue {
  @Prop() private isVisible!: any
  private activeName= 'first'
  private el: any = this.$refs
  private isDisable =false
  private name=''
  private activeIndex=''
  private icon=''
  private listData =commonIcons
  private tabIndex = '0'
  // 功能函数
  // ui
  // 重置
  resetSearch() {
    // this.listData = commonIcons
    this.getData(this.tabIndex)
  }
  // 搜索
  handleSearch() {
  const icons = commonIcons.concat(directivityIcons, solidIcons, foodIcons)
  this.listData = icons.filter(
    item => item.indexOf(this.name) !== -1
  )
  }
  // 获取当前tab数据
  handleClick(val:any) {
    this.tabIndex = val.index
    this.getData(val.index)
  }
  getData(index:any) {
    if (index === '0') {
      this.listData = commonIcons
    } else if (index === '1') {
      this.listData = directivityIcons
    } else if (index === '2') {
      this.listData = solidIcons
    } else {
      this.listData = foodIcons
    }
  }
  // 选中图标
  hancleIcon(icon:string) {
    this.activeIndex = icon
    this.icon = icon
  }
  // 提交
  handleSubmit() {
    if (this.icon === '') {
      this.$message({
          message: '请选择图标',
          type: 'warning'
        })
        return
    }
    this.isDisable = true
    this.handleClose()
    this.$emit('getIcon', this.icon)
    setTimeout(() => {
      this.isDisable = false // 点击一次时隔两秒后才能再次点击
    }, 2000)
  }
  // 表单取消
  private handleClose() {
    this.activeIndex = ''
    this.name = ''
    this.getData(this.tabIndex)
    this.$emit('close')
  }
}
</script>

<style lang="scss">
</style>

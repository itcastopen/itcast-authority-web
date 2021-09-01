<template>
  <div class="treeBox">
    <span class="text">数据范围：</span>
    <el-tabs v-model="active" type="card" @tab-click="handleClick">
      <el-tab-pane label="全部" name="ALL">
        <div class="blankBox">暂时还没有数据哦～</div>
      </el-tab-pane>
      <el-tab-pane label="本级" name="THIS_LEVEL">
        <div class="blankBox">暂时还没有数据哦～</div>
      </el-tab-pane>
      <el-tab-pane label="本级及子级" name="THIS_LEVEL_CHILDREN">
        <div class="blankBox">暂时还没有数据哦～</div>
      </el-tab-pane>
      <el-tab-pane label="自定义" name="CUSTOMIZE">
        <div v-if="treeData.length > 0">
          <span class="text">组织：</span>
          <el-tree
            ref="rightsTree"
            :data="treeData"
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="orgdata"
            :props="defaultProps"
            @check="handleNodeClick"
          />
          <div v-if="tipshow" class="colRed">请至少选择一个单位</div>
        </div>
        <div v-else class="blankBox">暂时还没有数据哦～</div>
      </el-tab-pane>
      <el-tab-pane label="个人" name="SELF">
        <div class="blankBox">暂时还没有数据哦～</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { getAllTree } from '@/api/api'
@Component({
  name: 'tree-data'
})
export default class extends Vue {
  @Prop() private tipshow!: string
  @Prop() private orgdata!: []
  @Prop() private activeNames!: string
  private treeData = []
  private active = ''
  private orgList = []
  private defaultProps = {
    children: 'children',
    name: 'name',
    id: 'id'
  }
  @Watch('activeNames', { immediate: true })
  getActive(val: any) {
    this.active = val
  }
  @Watch('orgdata')
  getOrg(val: any) {
    if (val !== null && val !== undefined) {
      this.$nextTick(() => {
        (this.$refs as any).rightsTree.setCheckedKeys(val)
      })
    } else {
      if (this.$refs.rightsTree !== undefined) {
        (this.$refs as any).rightsTree.setCheckedKeys([])
      }
    }
  }
  created() {
    this.getList()
  }
  // 功能
  // 获取数据
  private async getList() {
    const { data } = await getAllTree({})
    this.treeData = data.data
  }
  // ui
  handleNodeClick(node: any, data: any, value: any) {
    this.$emit('getOrgList', data.checkedKeys)
  }
  handleClick(item: any) {
    const parent = {
      code: item.name,
      val: Number(item.index) + 1
    }
    this.$emit('gettype', parent)
  }
}
</script>

<style lang="scss"></style>

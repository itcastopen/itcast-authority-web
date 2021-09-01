<template>
  <div class="el-tree-select">
    <!-- 下拉文本 -->
    <!-- TODO -->
    <!--  需求更改2021-3-30：修改时不能修改当前类目 :disabled="parentid!==undefined&&parentid!==''"-->
    <el-select :value="valueTitle" :clearable="clearable" @clear="clearHandle">
      <!-- <el-popover
        v-show="parentid!==''"
        ref="popover"
        width="435"
      > -->
      <el-option :value="valueTitle" :label="valueTitle">
        <el-tree

          id="tree-option"
          ref="selectTree"
          :accordion="accordion"
          :data="options"
          :props="props"
          :node-key="props.value"
          :default-expanded-keys="defaultExpandedKey"
          @node-click="handleNodeClick"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span :class="{'checkboxText': data.isEnable === false||data.status === false}">
              {{ node.label }}
            </span>
          </span>
        </el-tree>
      </el-option>
      <!-- </el-popover> -->
    </el-select>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
import { Tree as ElTree } from 'element-ui'
@Component({
  name: 'TreeSelect'
})
// @group api
export default class extends Vue {
  @Prop() private orgData!: {}
  @Prop() private props!: {}
  @Prop() private options!: []
  @Prop() private parentid!:string
  @Prop() private parentname!:string
  // @Prop() private parentinfo!:{}
  @Prop() private editdata!:{}
  @Prop() private clearable!:true
  @Prop() private accordion!:false
  private treeData = [] as any
  private valueId= ''
  private valueTitle=''
  private defaultExpandedKey = [] as any[]
  private ref: any = this.$refs
  private visible =true
  private isShow = false
  @Watch('parentid', { immediate: true })
  getIds(val: any) {
    if (val !== undefined && val !== '') {
      this.valueId = val
    }
  }
  @Watch('parentname', { immediate: true })
  getname(val: any) {
    this.valueTitle = val
    if (val !== '') {
      this.valueTitle = val
    }
  }
  @Watch('editdata')
  getParendName(val: any) {
    if (val.id !== undefined || val.id !== '') {
      // if (val.parentId === '0') {
      //   if (this.parentname !== '' && this.parentname !== undefined) {
      //     this.valueTitle = this.parentname
      //   } else {
      //     this.valueTitle = '顶级组织'
      //   }
      // } else {
      //   this.valueTitle = val.parentName
      //   this.valueId = val.parentId
      //   if (this.parentname !== '' && this.parentname !== undefined) {
      //     this.valueTitle = this.parentname
      //     this.valueId = this.parentid
      //   }
      // }
        this.valueTitle = val.parentName
        this.valueId = val.parentId
        if (this.parentname !== '' && this.parentname !== undefined) {
          this.valueTitle = this.parentname
          this.valueId = this.parentid
        } else {
          if (val.parentId === '0') {
            this.valueTitle = '顶级组织'
          }
        }
      } else {
        this.valueTitle = ''
        this.valueId = ''
      }
  }
  @Watch('options', { immediate: true })
  getOption(val:Array<string>) {
    // val.splice(val.findIndex((obj:any) => (obj.status === false)), 1)
    const obj = {
      name: '顶级组织',
      id: '0',
      parentId: '0',
      children: []
    } as any
    val.unshift(obj)
  }

  // 生命周期
  mounted() {
    this.initHandle()
  }
  // 初始化值
    initHandle() {
      if (this.valueId) {
        this.valueTitle = this.ref.selectTree.getNode(this.valueId).data[(this.props as any).label] // 初始化显示
        this.ref.selectTree.setCurrentKey(this.valueId) // 设置默认选中
        this.defaultExpandedKey = [this.valueId] // 设置默认展开
      }
    }
  // 切换选项
    handleNodeClick(node:any) {
      if (node.level === undefined || node.level < 4) {
        if (node.id !== '') {
        let scrollWrap = document.querySelectorAll('.el-select-dropdown.el-popper')[0];
        (scrollWrap as any).style.cssText = 'display:none;'
      }
      const props = this.props as any
      if ((node.isEnable || node.isEnable === undefined) && (node.status || node.status === undefined)) {
      this.valueTitle = node[props.label]
      this.valueId = node[props.value]
      this.$emit('get-value', this.valueId)
      this.visible = false
      this.defaultExpandedKey = []
      }
      } else {
        this.$message({
        message: '最多添加四级菜单！',
        type: 'error'
      })
      }
    }
  // 清除选中
    clearHandle() {
      this.valueTitle = ''
      this.valueId = ''
      this.defaultExpandedKey = []
      this.clearSelected()
      this.$emit('get-value', null)
    }
  // 清空选中样式
    clearSelected() {
      let allNode = document.querySelectorAll('#tree-option .el-tree-node')
      allNode.forEach((element) => element.classList.remove('is-current'))
    }
}
</script>
<style scoped>

</style>

<style>
</style>

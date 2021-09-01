<template>
  <div class="el-tree-select" :class="selectClass">
    <!-- 下拉文本 -->
    <el-select
      ref="select"
      v-model="labels"
      v-popover:popover
      v-bind="selectParams"
      :disabled="disabled"
      popper-class="select-option-tree"
      :multiple="selectParams.multiple"
      class="el-tree-select-input"
      @clear="selectClearFun"
      @focus="updateWidth"
      @change="selectChange"
    >
      <el-option :value="ids">
        <!-- 弹出框 -->
        <el-popover
          ref="popover"
          v-model="visible"
          :placement="placement"
          :width="width"
          trigger="click"
        >
          <el-input
            v-model="keywords"
            class="selectInput"
            :placeholder="selectParams.placeholder"
            suffix-icon="el-icon-search"
          />
          <el-scrollbar
            tag="div"
            wrap-class="el-select-dropdown__wrap"
            view-class="el-select-dropdown__list"
            class="is-empty"
          >
            <!-- 树列表 -->
            <!-- :show-checkbox="selectParams.multiple" -->
            <el-tree
              v-show="data.length > 0"
              id="trees"
              ref="tree"
              class="selectClass"
              :accordion="true"
              :data="data"
              :node-key="propsValue"
              :show-checkbox="selectParams.multiple"
              :filter-node-method="filterFuntion"
              @node-click="treeNodeClickFun"
              @check-change="handleCheckChange"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span :class="{'checkboxText': data.disabled === true}">
                  {{ node.label }}
                </span>
              </span>
            </el-tree>
            <!-- 暂无数据 -->
            <div v-if="data.length === 0" class="no-data">暂无数据</div>
          </el-scrollbar>
        </el-popover>
      </el-option>
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
  @Prop({
    default: () => {
      return ''
    }
  })
  private value!: ['', [], Number]

  @Prop({
    default: () => {
      return {}
    }
  })
  private styles!: {}

  @Prop({
    default: () => {
      return ''
    }
  })
  private selectClass!: string

  @Prop({
    default: () => {
      return ''
    }
  })
  private popoverClass!: string

  @Prop({
    default: () => {
      return false
    }
  })
  private disabled!: boolean

  @Prop({
    default: () => {
      return 'bottom'
    }
  })
  private placement!: string
  // @Prop() private treeRenderFun!: Function

  @Prop({
    default: () => {
      return {
        clearable: true,
        disabled: false,
        placeholder: '请选择'
      }
    }
  })
  private selectParams!: {
    multiple: boolean
  }

  @Prop({
    default: () => {
      return {
        clickParent: false,
        filterable: false,
        data: [],
        props: {
          children: 'children',
          label: 'label',
          code: 'code',
          value: 'flowId',
          disabled: 'disabled'
        }
      }
    }
  })
  private treeParams!: {
    data: any
    props: any
    clickParent: any
  }
  @Prop()
  private orgData!: {}
  @Prop() private orgName!: ''
  @Prop() private orgId!: ''
  @Prop() private userIds!: []
  private propsValue: string = 'flowId'
  private propsLabel: string = 'name'
  private propsCode: any // 可能有空的情况
  private propsDisabled: string = 'disabled'
  private propsChildren: string = 'children'
  private data = [] as any[]
  private keywords: string = ''
  private labels = '' as any // 存储名称，用于下拉框显示内容
  private ids = [] as any[] // 存储id
  private visible = false // popover v-model
  private width = 150
  private el: any = this.$refs
  @Watch('ids')
  getIds(val: any) {
    if (val !== undefined) {
      this.$nextTick(() => {
        this.setSelectNodeFun(val)
      })
    }
  }
  @Watch('userIds')
  getuserIds(val: any) {
    this.ids = val
    // if (this.selectParams.multiple) {
    //   this.labels = []
    //   this.ids = val
    // } else {
    //   this.labels = ''
    //   this.ids = val instanceof Array ? val : [val]
    // }
  }
  @Watch('value')
  getvalue(val: any) {
    if (this.ids !== val) {
      this.setMultipleFun()
      if (this.selectParams.multiple) {
        this.labels = []
        this.ids = [...val]
      } else {
        this.labels = ''
        this.ids = val === '' ? [] : [val]
      }
    }
  }
  @Watch('keywords')
  getkeywords(value: any) {
    (this.$refs.tree as ElTree).filter(value)
  }
  @Watch('orgId', { immediate: true })
  getorgName(value: any) {
    if (value !== null && value !== undefined && value !== '') {
      const { props, data } = this.treeParams
      if (data !== null && data.length > 0) {
        // 不让选择父级,判断前面加非'!'
        // if (
        //   !(
        //     this.el.tree.getNode(value).data.children &&
        //     this.el.tree.getNode(value).data.children.length !== 0
        //   )
        // ) {
          // eslint-disable-next-line standard/computed-property-even-spacing
          this.labels = this.el.tree.getNode(value).data[
            this.treeParams.props.label
          ]
        // }
        // 可以选择父级
        // this.labels = this.el.tree.getNode(value).data[ this.treeParams.props.label ]
      }
    } else {
      this.labels = ''
    }
  }

  // 生命周期
  created() {
    const { props, data } = this.treeParams
    this.setMultipleFun()
    this.propsValue = props.value
    this.propsLabel = props.label
    this.propsCode = props.code || null // 可能为空
    this.propsDisabled = props.disabled
    this.propsChildren = props.children
    this.data = data.length > 0 ? [...data] : []
  }
  mounted() {
    // this.updateH()
  }
  // 根据类型判断单选，多选
  setMultipleFun() {
    let multiple = false
    if (this.value instanceof Array) {
      multiple = true
    }
    this.$set(this.selectParams, 'multiple', multiple)
  }
  //  根据id筛选当前树名称，以及选中树列表
  setSelectNodeFun(ids: any) {
    if (!this.el.tree) {
      throw new Error('找不到tree dom')
    }
    const { multiple } = this.selectParams
    // 长度为0，清空选择
    if (ids.length === 0 || this.data.length === 0) {
      this.labels = multiple ? [] : ''
      if (multiple) {
        this.el.tree.setCheckedKeys([])
      } else {
        this.el.tree.setCurrentKey(null)
      }
      return
    }
    if (multiple) {
      // element-ui bug. 如果是父子节点全选 el.setCheckedKeys([非全量id]);之后el.getCheckedNodes()还是全量
      this.el.tree.getCheckedNodes().forEach((item: any) => {
        this.el.tree.setChecked(item, false)
      })
      ids.forEach((id: any) => {
        this.el.tree.setChecked(id, true)
      })
      const nodes = this.el.tree.getCheckedNodes()
      if (this.propsCode) {
        // 如果有code   labels=code(name)
        this.labels =
          nodes.map((item: any) =>
            item[this.propsCode]
              ? item[this.propsLabel] + '(' + item[this.propsCode] + ')'
              : item[this.propsLabel]
          ) || []
      } else {
        this.labels =
          nodes.map((item: any) => {
            // TODO 疑问，父级原来说让选，现在又不让选了【ID1004817】添加用户组成员展示错误，目前展示组织和组织下成员
            if (!(item.children && item.children.length !== 0)) { // 禁止选择父级
            return item[this.propsLabel]
            }
          }) || []
      }
    } else {
      this.el.tree.setCurrentKey(ids[0])
      const node = this.el.tree.getCurrentNode()
      if (node) {
        if (this.propsCode) {
          // 如果有code   labels=code(name)
          this.labels = node[this.propsCode]
            ? node[this.propsLabel] + '(' + node[this.propsCode] + ')'
            : node[this.propsLabel]
        } else {
          this.labels = node[this.propsLabel]
        }
      } else {
        this.labels = ''
      }
    }
    this.updatePopoverLocationFun()
  }
  // 更新popover位置
  updatePopoverLocationFun() {
    // dom高度还没有更新，做一个延迟
    // const el:any = this.$refs
    setTimeout(() => {
      this.el.popover.updatePopper()
    }, 50)
  }
  // 树过滤
  filterFuntion(value: string, data: any, node: any) {
    if (!value) {
      return true
    }
    return data.label && data.label.indexOf(value) !== -1
  }
  // 树点击
  treeNodeClickFun(data: any, node: any, vm: any) {
    // this.$set(node,'checked',false)
    const { multiple } = this.selectParams
    const { clickParent } = this.treeParams
    const { propsValue, propsChildren, propsDisabled } = this
    if (data[propsDisabled]) {
      // 禁用
      return
    }
    if (node.checked) {
      const value = data[this.propsValue]
      this.ids = this.ids.filter(id => id !== value)
    } else {
      if (!multiple) {
        // 单选
        // 多选，不关闭，单选，判断是否允许点击父级关闭弹出框
        if (!clickParent) {
          const children = data[propsChildren]
          // 如果不允许点击父级,自身为末级，允许点击之后关闭
          // if (!children || children.length === 0) {
            this.ids = [data[propsValue]]
            this.$emit('getValue', data[propsValue])
            this.visible = false
          // } else {
          //   // 不允许父级，阻止继续派发
          //   return false
          // }
        } else {
          this.ids = [data[propsValue]]
          this.visible = false
        }
      } else {
        // 多选
        this.ids.push(data[propsValue])
      }
    }
    this.emitFun()
    // this.$emit('node-click', data, node, vm)
  }
  // 下拉框清空数据
  selectClearFun() {
    this.ids = []
    const { multiple } = this.selectParams
    this.$emit('input', multiple ? [] : '')
    this.$emit('select-clear')
    this.updatePopoverLocationFun()
  }
  // 判断类型，抛出当前选中id
  emitFun() {
    const { multiple } = this.selectParams
    this.$emit(
      'input',
      multiple ? this.ids : this.ids.length > 0 ? this.ids[0] : ''
    )
    this.updatePopoverLocationFun()
  }
  // 更新宽度
  updateWidth() {
    this.$nextTick(() => {
      this.width = this.el.select.$el.getBoundingClientRect().width
    })
  }
  // treeDataUpdateFun(data: any) {
  //   this.data = data
  //   // 数据更新完成之后，判断是否回显内容
  //   if (data.length > 0) {
  //     setTimeout(() => {
  //       this.setSelectNodeFun(this.ids)
  //     }, 300)
  //   }
  // }
  // 树下拉菜单发生修改时 多选
  selectChange(e: any) {
    let arrNew: any = []
    const dataLength: any = this.ids.length
    const eleng: any = e.length
    let i: any = 0
    let j: any = 0
    for (i = 0; i < dataLength; i++) {
      for (j = 0; j < eleng; j++) {
        if (e[j] === this.ids[i].label) {
          arrNew.push(this.ids[i])
        }
      }
    }
    (this.$refs as any).tree.setCheckedNodes(arrNew) // 设置勾选的值
    let ids = [] as any
    arrNew.forEach((val: any) => {
      ids.push(val.id)
    })
    this.$emit('getValue', ids)
  }
  // 修改树
  handleCheckChange() {
    let res = (this.$refs as any).tree.getCheckedNodes(false, false) // 这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
    let arrLabel = [] as any[]
    let arr = [] as any[]
    let ids = [] as any[]
    res.forEach((item: any) => {
      if (!(item.children && item.children.length !== 0)) { // 禁止选择父级
        arrLabel.push(item.label)
        arr.push(item)
        ids.push(item.id)
      }
    })
    this.ids = arr
    this.labels = arrLabel
    this.$emit('getValue', ids)
  }
  // // 自定义树文本，控制文本禁用样式
  // treeRenderFun(h:any, { node, data, store }) {
  //   return h('span', [
  //     // h(
  //     //   'span',
  //     //   {
  //     //     class: {
  //     //       'el-tree-node__expand-icon el-icon-caret-right': true,
  //     //       checkboxText: data.disabled === true
  //     //     }
  //     //   }
  //     // ),
  //     h(
  //       'span',
  //       {
  //         class: {
  //           checkboxText: data.disabled === true
  //         }
  //       },
  //       data.name
  //     )
  //   ])
  // }
}
</script>
<style scoped></style>
<style>
.el-tree-node.is-current > .el-tree-node__content {
  background: #ecf5ff;
}
.el-tree-node__expand-icon {
  color: #909399;
}
.el-tree-node__content > .el-tree-node__expand-icon {
  padding-left: 4px;
  padding-right: 4px;
}
.el-tree-node__children .el-tree-node > .el-tree-node__content {
  /* padding-left: 14px !important; */
}
.select-option-tree{
  display: none;
  border: 0 none;
}
</style>
